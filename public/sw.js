// Service Worker for PWA

const CACHE_NAME = "ktv-admin-v1"
const urlsToCache = ["/", "/dashboard", "/manifest.json", "/icon-192.png", "/icon-512.png"]

// 安装事件 - 缓存资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// 拦截请求 - 缓存优先策略
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中则返回缓存，否则发起网络请求
      return (
        response ||
        fetch(event.request).then((response) => {
          // 只缓存GET请求
          if (event.request.method === "GET") {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
      )
    }),
  )
})

// 推送通知
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "启智商家"
  const options = {
    body: data.body || "您有新的消息",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: data.url,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// 点击通知
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data || "/"))
})
