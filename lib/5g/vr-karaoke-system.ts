import { EventEmitter } from "events"
import * as THREE from "three"

// VR环境
export interface VREnvironment {
  id: string
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controllers: VRController[]
  initialized: boolean
}

// 房间类型
export type RoomType = "luxury" | "standard" | "party" | "romantic" | "theme"

// VR房间
export interface VRRoom {
  id: string
  type: RoomType
  name: string
  capacity: number
  scene: THREE.Scene
  furniture: THREE.Object3D[]
  lighting: THREE.Light[]
  audioSources: AudioSource[]
}

// 房间配置
export interface RoomConfig {
  type: RoomType
  theme: string
  lighting: LightingConfig
  audio: AudioConfig
  capacity: number
}

// 灯光配置
export interface LightingConfig {
  ambient: number
  spotlights: SpotlightConfig[]
  colorScheme: string[]
}

export interface SpotlightConfig {
  position: THREE.Vector3
  color: number
  intensity: number
  angle: number
}

// 音频配置
export interface AudioConfig {
  spatialAudio: boolean
  reverbLevel: number
  bassBoost: number
}

// VR控制器
export interface VRController {
  id: string
  hand: "left" | "right"
  position: THREE.Vector3
  rotation: THREE.Quaternion
  buttons: Map<string, boolean>
  axes: number[]
}

// 控制器输入
export interface ControllerInput {
  controllerId: string
  button?: string
  axis?: { x: number; y: number }
  trigger?: number
}

// VR动作
export interface VRAction {
  type: "teleport" | "grab" | "point" | "menu" | "select"
  target?: THREE.Object3D
  position?: THREE.Vector3
  data?: any
}

// 音频源
export interface AudioSource {
  id: string
  type: "music" | "voice" | "effect"
  audio: THREE.Audio
  position: THREE.Vector3
  volume: number
}

// 空间音频流
export interface SpatialAudioStream {
  id: string
  source: AudioSource
  panner: THREE.PositionalAudio
  distance: number
  rolloff: number
}

/**
 * VR卡拉OK系统
 * 使用虚拟现实技术打造沉浸式KTV包厢体验
 */
export class VRKaraokeSystem extends EventEmitter {
  private environments: Map<string, VREnvironment> = new Map()
  private rooms: Map<string, VRRoom> = new Map()
  private currentEnvironment: VREnvironment | null = null
  private currentRoom: VRRoom | null = null
  private audioListener: THREE.AudioListener | null = null
  private animationFrameId: number | null = null

  constructor() {
    super()
  }

  /**
   * 初始化VR环境
   */
  async initVREnvironment(roomType: RoomType): Promise<VREnvironment> {
    if (typeof window === "undefined") {
      throw new Error("VR环境只能在浏览器中初始化")
    }

    // 检查WebXR支持
    if (!("xr" in navigator)) {
      throw new Error("当前浏览器不支持WebXR")
    }

    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    renderer.shadowMap.enabled = true

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 1.6, 3)

    // 创建音频监听器
    this.audioListener = new THREE.AudioListener()
    camera.add(this.audioListener)

    // 创建VR环境对象
    const environment: VREnvironment = {
      id: `vr-env-${Date.now()}`,
      scene,
      renderer,
      camera,
      controllers: [],
      initialized: true,
    }

    // 初始化VR控制器
    await this.initVRControllers(environment)

    this.environments.set(environment.id, environment)
    this.currentEnvironment = environment

    console.log("[v0] VR环境初始化成功")
    this.emit("environment-initialized", environment)

    return environment
  }

  /**
   * 初始化VR控制器
   */
  private async initVRControllers(environment: VREnvironment): Promise<void> {
    const { renderer, scene } = environment

    // 左手控制器
    const leftController = renderer.xr.getController(0)
    leftController.addEventListener("selectstart", () => this.onControllerSelect("left", true))
    leftController.addEventListener("selectend", () => this.onControllerSelect("left", false))
    scene.add(leftController)

    // 右手控制器
    const rightController = renderer.xr.getController(1)
    rightController.addEventListener("selectstart", () => this.onControllerSelect("right", true))
    rightController.addEventListener("selectend", () => this.onControllerSelect("right", false))
    scene.add(rightController)

    // 添加控制器模型
    const controllerModelFactory = await this.loadControllerModels()

    const leftGrip = renderer.xr.getControllerGrip(0)
    leftGrip.add(controllerModelFactory.createControllerModel(leftGrip))
    scene.add(leftGrip)

    const rightGrip = renderer.xr.getControllerGrip(1)
    rightGrip.add(controllerModelFactory.createControllerModel(rightGrip))
    scene.add(rightGrip)

    // 添加射线指示器
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)])
    const material = new THREE.LineBasicMaterial({ color: 0x00ffff })

    const leftLine = new THREE.Line(geometry, material)
    leftController.add(leftLine)

    const rightLine = new THREE.Line(geometry, material)
    rightController.add(rightLine)

    console.log("[v0] VR控制器初始化成功")
  }

  /**
   * 加载控制器模型
   */
  private async loadControllerModels(): Promise<any> {
    // 简化实现，实际应使用XRControllerModelFactory
    return {
      createControllerModel: (grip: THREE.Group) => {
        const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.15)
        const material = new THREE.MeshStandardMaterial({ color: 0x333333 })
        return new THREE.Mesh(geometry, material)
      },
    }
  }

  /**
   * 控制器选择事件
   */
  private onControllerSelect(hand: "left" | "right", pressed: boolean): void {
    console.log(`[v0] ${hand}手控制器${pressed ? "按下" : "释放"}`)
    this.emit("controller-select", { hand, pressed })
  }

  /**
   * 渲染虚拟包厢
   */
  async renderVirtualRoom(roomConfig: RoomConfig): Promise<VRRoom> {
    if (!this.currentEnvironment) {
      throw new Error("请先初始化VR环境")
    }

    const { scene } = this.currentEnvironment

    // 创建房间
    const room: VRRoom = {
      id: `vr-room-${Date.now()}`,
      type: roomConfig.type,
      name: `${roomConfig.type} VR包厢`,
      capacity: roomConfig.capacity,
      scene,
      furniture: [],
      lighting: [],
      audioSources: [],
    }

    // 添加地板
    const floorGeometry = new THREE.PlaneGeometry(8, 8)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      roughness: 0.8,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)
    room.furniture.push(floor)

    // 添加墙壁
    this.createWalls(scene, room, roomConfig)

    // 添加天花板
    const ceilingGeometry = new THREE.PlaneGeometry(8, 8)
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.9,
    })
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
    ceiling.position.y = 3
    ceiling.rotation.x = Math.PI / 2
    scene.add(ceiling)
    room.furniture.push(ceiling)

    // 添加沙发
    this.createSofa(scene, room)

    // 添加茶几
    this.createTable(scene, room)

    // 添加大屏幕
    this.createScreen(scene, room)

    // 添加灯光
    this.setupLighting(scene, room, roomConfig.lighting)

    // 添加音响系统
    this.setupAudioSystem(room, roomConfig.audio)

    this.rooms.set(room.id, room)
    this.currentRoom = room

    console.log("[v0] 虚拟包厢渲染成功:", room.name)
    this.emit("room-rendered", room)

    return room
  }

  /**
   * 创建墙壁
   */
  private createWalls(scene: THREE.Scene, room: VRRoom, config: RoomConfig): void {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a4e,
      roughness: 0.7,
    })

    // 后墙
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMaterial)
    backWall.position.set(0, 1.5, -4)
    scene.add(backWall)
    room.furniture.push(backWall)

    // 左墙
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMaterial)
    leftWall.position.set(-4, 1.5, 0)
    leftWall.rotation.y = Math.PI / 2
    scene.add(leftWall)
    room.furniture.push(leftWall)

    // 右墙
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMaterial)
    rightWall.position.set(4, 1.5, 0)
    rightWall.rotation.y = -Math.PI / 2
    scene.add(rightWall)
    room.furniture.push(rightWall)
  }

  /**
   * 创建沙发
   */
  private createSofa(scene: THREE.Scene, room: VRRoom): void {
    const sofaGroup = new THREE.Group()

    // 沙发座位
    const seatGeometry = new THREE.BoxGeometry(2.5, 0.4, 0.8)
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    const seat = new THREE.Mesh(seatGeometry, seatMaterial)
    seat.position.y = 0.4
    seat.castShadow = true
    sofaGroup.add(seat)

    // 沙发靠背
    const backGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.2)
    const back = new THREE.Mesh(backGeometry, seatMaterial)
    back.position.set(0, 0.8, -0.3)
    back.castShadow = true
    sofaGroup.add(back)

    // 扶手
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.8)
    const leftArm = new THREE.Mesh(armGeometry, seatMaterial)
    leftArm.position.set(-1.35, 0.6, 0)
    leftArm.castShadow = true
    sofaGroup.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, seatMaterial)
    rightArm.position.set(1.35, 0.6, 0)
    rightArm.castShadow = true
    sofaGroup.add(rightArm)

    sofaGroup.position.set(0, 0, 2)
    scene.add(sofaGroup)
    room.furniture.push(sofaGroup)
  }

  /**
   * 创建茶几
   */
  private createTable(scene: THREE.Scene, room: VRRoom): void {
    const tableGroup = new THREE.Group()

    // 桌面
    const topGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.6)
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.3,
      metalness: 0.1,
    })
    const top = new THREE.Mesh(topGeometry, topMaterial)
    top.position.y = 0.5
    top.castShadow = true
    tableGroup.add(top)

    // 桌腿
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5)
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })

    const positions = [
      [-0.5, 0.25, -0.25],
      [0.5, 0.25, -0.25],
      [-0.5, 0.25, 0.25],
      [0.5, 0.25, 0.25],
    ]

    positions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial)
      leg.position.set(pos[0], pos[1], pos[2])
      leg.castShadow = true
      tableGroup.add(leg)
    })

    tableGroup.position.set(0, 0, 0.5)
    scene.add(tableGroup)
    room.furniture.push(tableGroup)
  }

  /**
   * 创建大屏幕
   */
  private createScreen(scene: THREE.Scene, room: VRRoom): void {
    const screenGroup = new THREE.Group()

    // 屏幕
    const screenGeometry = new THREE.PlaneGeometry(3, 1.7)
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      emissive: 0x111111,
    })
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.y = 1.5
    screenGroup.add(screen)

    // 屏幕边框
    const frameGeometry = new THREE.BoxGeometry(3.2, 1.9, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.position.set(0, 1.5, -0.05)
    frame.castShadow = true
    screenGroup.add(frame)

    screenGroup.position.set(0, 0, -3.9)
    scene.add(screenGroup)
    room.furniture.push(screenGroup)
  }

  /**
   * 设置灯光
   */
  private setupLighting(scene: THREE.Scene, room: VRRoom, config: LightingConfig): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, config.ambient)
    scene.add(ambientLight)
    room.lighting.push(ambientLight)

    // 聚光灯
    config.spotlights.forEach((spotConfig, index) => {
      const spotlight = new THREE.SpotLight(spotConfig.color, spotConfig.intensity)
      spotlight.position.copy(spotConfig.position)
      spotlight.angle = spotConfig.angle
      spotlight.penumbra = 0.3
      spotlight.castShadow = true
      scene.add(spotlight)
      room.lighting.push(spotlight)
    })

    // 点光源(氛围灯)
    const pointLight1 = new THREE.PointLight(0xff00ff, 0.5, 5)
    pointLight1.position.set(-3, 2, -3)
    scene.add(pointLight1)
    room.lighting.push(pointLight1)

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 5)
    pointLight2.position.set(3, 2, -3)
    scene.add(pointLight2)
    room.lighting.push(pointLight2)

    console.log("[v0] 灯光设置完成")
  }

  /**
   * 设置音响系统
   */
  private setupAudioSystem(room: VRRoom, config: AudioConfig): void {
    if (!this.audioListener) {
      console.warn("[v0] 音频监听器未初始化")
      return
    }

    // 创建空间音频源
    const audioSource: AudioSource = {
      id: `audio-${Date.now()}`,
      type: "music",
      audio: new THREE.Audio(this.audioListener),
      position: new THREE.Vector3(0, 2, -3),
      volume: 1.0,
    }

    room.audioSources.push(audioSource)

    console.log("[v0] 音响系统设置完成")
  }

  /**
   * 处理控制器输入
   */
  handleControllerInput(input: ControllerInput): VRAction {
    if (!this.currentEnvironment || !this.currentRoom) {
      return {
        type: "menu",
        data: { error: "环境未初始化" },
      }
    }

    // 处理按钮输入
    if (input.button) {
      switch (input.button) {
        case "trigger":
          return this.handleTriggerPress(input)
        case "grip":
          return this.handleGripPress(input)
        case "menu":
          return { type: "menu" }
        default:
          return { type: "select" }
      }
    }

    // 处理摇杆输入
    if (input.axis) {
      return this.handleAxisInput(input)
    }

    return { type: "select" }
  }

  /**
   * 处理扳机按下
   */
  private handleTriggerPress(input: ControllerInput): VRAction {
    // 射线检测
    const raycaster = new THREE.Raycaster()
    // 实际应用中应使用控制器的位置和方向
    const intersects = raycaster.intersectObjects(this.currentRoom!.furniture, true)

    if (intersects.length > 0) {
      const target = intersects[0].object
      console.log("[v0] 选中对象:", target.name || target.type)

      return {
        type: "select",
        target,
        position: intersects[0].point,
      }
    }

    return { type: "point" }
  }

  /**
   * 处理握把按下
   */
  private handleGripPress(input: ControllerInput): VRAction {
    return {
      type: "grab",
      data: { controllerId: input.controllerId },
    }
  }

  /**
   * 处理摇杆输入
   */
  private handleAxisInput(input: ControllerInput): VRAction {
    const { x, y } = input.axis!

    // 传送移动
    if (Math.abs(y) > 0.5) {
      const direction = new THREE.Vector3(0, 0, -y * 0.1)
      return {
        type: "teleport",
        position: direction,
      }
    }

    return { type: "point" }
  }

  /**
   * 空间音频
   */
  spatialAudio(audioSource: AudioSource, position: THREE.Vector3): SpatialAudioStream {
    if (!this.audioListener) {
      throw new Error("音频监听器未初始化")
    }

    // 创建位置音频
    const positionalAudio = new THREE.PositionalAudio(this.audioListener)
    positionalAudio.setRefDistance(1)
    positionalAudio.setRolloffFactor(2)
    positionalAudio.setDistanceModel("exponential")

    // 创建音频对象
    const audioObject = new THREE.Object3D()
    audioObject.position.copy(position)
    audioObject.add(positionalAudio)

    if (this.currentEnvironment) {
      this.currentEnvironment.scene.add(audioObject)
    }

    const spatialStream: SpatialAudioStream = {
      id: `spatial-${Date.now()}`,
      source: audioSource,
      panner: positionalAudio,
      distance: 1,
      rolloff: 2,
    }

    console.log("[v0] 空间音频创建成功")
    this.emit("spatial-audio-created", spatialStream)

    return spatialStream
  }

  /**
   * 开始VR会话
   */
  async startVRSession(): Promise<void> {
    if (!this.currentEnvironment) {
      throw new Error("VR环境未初始化")
    }

    const { renderer } = this.currentEnvironment

    try {
      // 请求VR会话
      const session = await (navigator as any).xr.requestSession("immersive-vr", {
        requiredFeatures: ["local-floor", "bounded-floor"],
      })

      await renderer.xr.setSession(session)

      // 开始渲染循环
      this.startRendering()

      console.log("[v0] VR会话已启动")
      this.emit("vr-session-started")
    } catch (error) {
      console.error("[v0] VR会话启动失败:", error)
      throw error
    }
  }

  /**
   * 开始渲染循环
   */
  private startRendering(): void {
    if (!this.currentEnvironment) return

    const { renderer, scene, camera } = this.currentEnvironment

    renderer.setAnimationLoop(() => {
      // 更新场景
      this.updateScene()

      // 渲染场景
      renderer.render(scene, camera)
    })

    console.log("[v0] VR渲染循环已启动")
  }

  /**
   * 更新场景
   */
  private updateScene(): void {
    // 更新动画、物理、交互等
    // 实际应用中应包含更复杂的逻辑
  }

  /**
   * 停止VR会话
   */
  async stopVRSession(): Promise<void> {
    if (!this.currentEnvironment) return

    const { renderer } = this.currentEnvironment
    const session = renderer.xr.getSession()

    if (session) {
      await session.end()
      console.log("[v0] VR会话已停止")
      this.emit("vr-session-stopped")
    }
  }

  /**
   * 获取渲染器DOM元素
   */
  getRendererElement(): HTMLCanvasElement | null {
    return this.currentEnvironment?.renderer.domElement || null
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // 停止VR会话
    this.stopVRSession()

    // 清理场景
    this.rooms.forEach((room) => {
      room.furniture.forEach((furniture) => {
        if (furniture instanceof THREE.Mesh) {
          furniture.geometry.dispose()
          if (Array.isArray(furniture.material)) {
            furniture.material.forEach((mat) => mat.dispose())
          } else {
            furniture.material.dispose()
          }
        }
      })
    })

    this.rooms.clear()
    this.environments.clear()

    console.log("[v0] VR系统资源已清理")
  }
}

// 导出单例
export const vrKaraokeSystem = new VRKaraokeSystem()
