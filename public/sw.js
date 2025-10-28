// Service Worker for PWA

const CACHE_NAME = "ktv-admin-v1"
const RUNTIME_CACHE = "ktv-admin-runtime"
const urlsToCache = ["/", "/dashboard", "/manifest.json", "/icon-192.png", "/icon-512.png", "/offline.html"]

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
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// 拦截请求 - 缓存优先策略
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/offline.html")
      }),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((response) => {
            if (event.request.method === "GET") {
              const responseToCache = response.clone()
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseToCache)
              })
            }
            return response
          })
          .catch(() => {
            // 返回离线页面或默认响应
            if (event.request.destination === "document") {
              return caches.match("/offline.html")
            }
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

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-orders") {
    event.waitUntil(syncOrders())
  }
})

async function syncOrders() {
  try {
    const cache = await caches.open(RUNTIME_CACHE)
    const requests = await cache.keys()
    const pendingRequests = requests.filter((req) => req.url.includes("/api/orders"))

    for (const request of pendingRequests) {
      await fetch(request)
      await cache.delete(request)
    }
  } catch (error) {
    console.error("Sync failed:", error)
  }
}
