import { EventEmitter } from "events"
import * as THREE from "three"

// AR场景
export interface ARScene {
  id: string
  name: string
  environment: THREE.Scene
  lighting: THREE.Light[]
  objects: ARObject[]
  loaded: boolean
}

// 虚拟歌手
export interface VirtualSinger {
  id: string
  name: string
  model: THREE.Object3D
  animations: THREE.AnimationClip[]
  currentAnimation: string
  position: THREE.Vector3
  rotation: THREE.Euler
}

// 姿态
export interface Pose {
  position: THREE.Vector3
  rotation: THREE.Quaternion
  scale: THREE.Vector3
  joints?: Record<string, THREE.Vector3>
}

// AR对象
export interface ARObject {
  id: string
  type: "singer" | "prop" | "effect" | "ui"
  object3D: THREE.Object3D
  interactive: boolean
  visible: boolean
}

// 手势
export interface Gesture {
  type: "tap" | "swipe" | "pinch" | "rotate" | "longPress"
  position: { x: number; y: number }
  direction?: { x: number; y: number }
  scale?: number
  rotation?: number
}

// 交互结果
export interface InteractionResult {
  success: boolean
  action: string
  target?: ARObject
  feedback?: string
}

// 用户
export interface User {
  id: string
  name: string
  position: THREE.Vector3
  rotation: THREE.Euler
  camera: THREE.Camera
}

// 同步状态
export interface SyncState {
  timestamp: number
  users: Map<string, User>
  scene: ARScene
  singers: VirtualSinger[]
  synchronized: boolean
}

/**
 * AR虚拟演唱会系统
 * 使用增强现实技术打造沉浸式演唱会体验
 */
export class ARConcertSystem extends EventEmitter {
  private scenes: Map<string, ARScene> = new Map()
  private singers: Map<string, VirtualSinger> = new Map()
  private renderer: THREE.WebGLRenderer | null = null
  private camera: THREE.PerspectiveCamera | null = null
  private currentScene: ARScene | null = null
  private animationFrameId: number | null = null

  constructor() {
    super()
    this.initializeRenderer()
  }

  /**
   * 初始化渲染器
   */
  private initializeRenderer(): void {
    if (typeof window === "undefined") return

    // 创建WebGL渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 1.6, 0) // 人眼高度

    console.log("[v0] AR渲染器初始化成功")
  }

  /**
   * 加载AR场景
   */
  async loadARScene(sceneId: string): Promise<ARScene> {
    // 检查场景是否已加载
    const existingScene = this.scenes.get(sceneId)
    if (existingScene && existingScene.loaded) {
      this.currentScene = existingScene
      return existingScene
    }

    // 创建新场景
    const scene = new THREE.Scene()

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 添加点光源(舞台灯光效果)
    const spotLight1 = new THREE.SpotLight(0xff00ff, 1)
    spotLight1.position.set(-5, 5, 0)
    spotLight1.angle = Math.PI / 6
    scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight(0x00ffff, 1)
    spotLight2.position.set(5, 5, 0)
    spotLight2.angle = Math.PI / 6
    scene.add(spotLight2)

    // 添加舞台地板
    const floorGeometry = new THREE.PlaneGeometry(10, 10)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.5,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // 创建AR场景对象
    const arScene: ARScene = {
      id: sceneId,
      name: `AR Concert Scene ${sceneId}`,
      environment: scene,
      lighting: [ambientLight, directionalLight, spotLight1, spotLight2],
      objects: [],
      loaded: true,
    }

    this.scenes.set(sceneId, arScene)
    this.currentScene = arScene

    console.log("[v0] AR场景加载成功:", sceneId)
    this.emit("scene-loaded", arScene)

    return arScene
  }

  /**
   * 渲染虚拟歌手
   */
  async renderVirtualSinger(singer: VirtualSinger, pose: Pose): Promise<ARObject> {
    if (!this.currentScene) {
      throw new Error("请先加载AR场景")
    }

    // 应用姿态
    singer.model.position.copy(pose.position)
    singer.model.quaternion.copy(pose.rotation)
    singer.model.scale.copy(pose.scale)

    // 添加到场景
    this.currentScene.environment.add(singer.model)

    // 创建AR对象
    const arObject: ARObject = {
      id: singer.id,
      type: "singer",
      object3D: singer.model,
      interactive: true,
      visible: true,
    }

    this.currentScene.objects.push(arObject)
    this.singers.set(singer.id, singer)

    console.log("[v0] 虚拟歌手渲染成功:", singer.name)
    this.emit("singer-rendered", { singer, arObject })

    return arObject
  }

  /**
   * 创建虚拟歌手
   */
  async createVirtualSinger(singerId: string, singerName: string, modelUrl?: string): Promise<VirtualSinger> {
    // 创建简单的人形模型(实际应用中应加载3D模型文件)
    const group = new THREE.Group()

    // 身体
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16)
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 1
    body.castShadow = true
    group.add(body)

    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16)
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.75
    head.castShadow = true
    group.add(head)

    // 手臂
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8)
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 })

    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.5, 1, 0)
    leftArm.rotation.z = Math.PI / 4
    leftArm.castShadow = true
    group.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.5, 1, 0)
    rightArm.rotation.z = -Math.PI / 4
    rightArm.castShadow = true
    group.add(rightArm)

    // 创建虚拟歌手对象
    const singer: VirtualSinger = {
      id: singerId,
      name: singerName,
      model: group,
      animations: [],
      currentAnimation: "idle",
      position: new THREE.Vector3(0, 0, -3),
      rotation: new THREE.Euler(0, 0, 0),
    }

    console.log("[v0] 虚拟歌手创建成功:", singerName)
    return singer
  }

  /**
   * 播放动画
   */
  playAnimation(singerId: string, animationName: string): void {
    const singer = this.singers.get(singerId)
    if (!singer) {
      console.error("[v0] 虚拟歌手不存在:", singerId)
      return
    }

    singer.currentAnimation = animationName

    // 简单的动画效果(实际应用中应使用AnimationMixer)
    const animate = () => {
      if (singer.currentAnimation === "dance") {
        singer.model.rotation.y += 0.02
        singer.model.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.2
      } else if (singer.currentAnimation === "wave") {
        const leftArm = singer.model.children[2]
        if (leftArm) {
          leftArm.rotation.z = Math.PI / 4 + Math.sin(Date.now() * 0.01) * 0.5
        }
      }
    }

    // 启动动画循环
    const animationLoop = () => {
      if (singer.currentAnimation !== "idle") {
        animate()
        requestAnimationFrame(animationLoop)
      }
    }
    animationLoop()

    console.log("[v0] 播放动画:", animationName)
    this.emit("animation-started", { singerId, animationName })
  }

  /**
   * 处理交互
   */
  handleInteraction(gesture: Gesture): InteractionResult {
    if (!this.currentScene || !this.camera) {
      return {
        success: false,
        action: "no-scene",
        feedback: "场景未加载",
      }
    }

    // 射线检测
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(gesture.position.x * 2 - 1, -(gesture.position.y * 2 - 1))

    raycaster.setFromCamera(mouse, this.camera)

    const intersects = raycaster.intersectObjects(this.currentScene.environment.children, true)

    if (intersects.length > 0) {
      const target = intersects[0].object

      // 查找对应的AR对象
      const arObject = this.currentScene.objects.find(
        (obj) => obj.object3D === target || obj.object3D.children.includes(target),
      )

      if (arObject && arObject.interactive) {
        // 处理不同类型的手势
        switch (gesture.type) {
          case "tap":
            this.handleTapInteraction(arObject)
            break
          case "swipe":
            this.handleSwipeInteraction(arObject, gesture.direction!)
            break
          case "pinch":
            this.handlePinchInteraction(arObject, gesture.scale!)
            break
          case "rotate":
            this.handleRotateInteraction(arObject, gesture.rotation!)
            break
        }

        console.log("[v0] 交互处理成功:", gesture.type, arObject.id)
        this.emit("interaction", { gesture, arObject })

        return {
          success: true,
          action: gesture.type,
          target: arObject,
          feedback: `${gesture.type} on ${arObject.type}`,
        }
      }
    }

    return {
      success: false,
      action: gesture.type,
      feedback: "未检测到可交互对象",
    }
  }

  /**
   * 处理点击交互
   */
  private handleTapInteraction(arObject: ARObject): void {
    if (arObject.type === "singer") {
      // 点击歌手触发动画
      const singer = this.singers.get(arObject.id)
      if (singer) {
        this.playAnimation(singer.id, "wave")
      }
    }
  }

  /**
   * 处理滑动交互
   */
  private handleSwipeInteraction(arObject: ARObject, direction: { x: number; y: number }): void {
    // 滑动改变对象位置
    arObject.object3D.position.x += direction.x * 0.5
    arObject.object3D.position.z += direction.y * 0.5
  }

  /**
   * 处理捏合交互
   */
  private handlePinchInteraction(arObject: ARObject, scale: number): void {
    // 捏合改变对象大小
    arObject.object3D.scale.multiplyScalar(scale)
  }

  /**
   * 处理旋转交互
   */
  private handleRotateInteraction(arObject: ARObject, rotation: number): void {
    // 旋转对象
    arObject.object3D.rotation.y += rotation
  }

  /**
   * 多人同步
   */
  async syncMultiUser(users: User[]): Promise<SyncState> {
    if (!this.currentScene) {
      throw new Error("场景未加载")
    }

    const usersMap = new Map<string, User>()
    users.forEach((user) => {
      usersMap.set(user.id, user)
    })

    const syncState: SyncState = {
      timestamp: Date.now(),
      users: usersMap,
      scene: this.currentScene,
      singers: Array.from(this.singers.values()),
      synchronized: true,
    }

    // 同步场景状态到所有用户
    this.emit("sync-state", syncState)

    console.log("[v0] 多人同步完成, 用户数:", users.length)
    return syncState
  }

  /**
   * 开始渲染循环
   */
  startRendering(): void {
    if (!this.renderer || !this.camera || !this.currentScene) {
      console.error("[v0] 渲染器、相机或场景未初始化")
      return
    }

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate)

      // 渲染场景
      this.renderer!.render(this.currentScene!.environment, this.camera!)
    }

    animate()
    console.log("[v0] 渲染循环已启动")
  }

  /**
   * 停止渲染循环
   */
  stopRendering(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
      console.log("[v0] 渲染循环已停止")
    }
  }

  /**
   * 获取渲染器DOM元素
   */
  getRendererElement(): HTMLCanvasElement | null {
    return this.renderer?.domElement || null
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopRendering()

    // 清理场景
    this.scenes.forEach((scene) => {
      scene.environment.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    })

    this.scenes.clear()
    this.singers.clear()

    if (this.renderer) {
      this.renderer.dispose()
      this.renderer = null
    }

    console.log("[v0] AR系统资源已清理")
  }
}

// 导出单例
export const arConcertSystem = new ARConcertSystem()
