self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// استقبال إشعارات Push مستقبلًا
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "QMS",
      body: event.data ? event.data.text() : "إشعار جديد"
    };
  }

  const title = data.title || "QMS — إشعار";
  const options = {
    body: data.body || "لديك إشعار جديد.",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    tag: data.tag || "qms-push",
    renotify: true,
    requireInteraction: Boolean(data.urgent),
    vibrate: data.urgent
      ? [200, 100, 200, 100, 200]
      : [150],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
