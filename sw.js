/* POSTE EL AMAL - Service Worker */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification?.data?.url || self.registration.scope;
  const targetUrl = new URL(rawUrl, self.location.href).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of clientList) {
      if ("focus" in client) {
        await client.focus();
        const clientUrl = new URL(client.url);
        const targetObj = new URL(targetUrl);

        if (clientUrl.origin === targetObj.origin && clientUrl.pathname === targetObj.pathname) {
          return;
        }

        if ("navigate" in client) {
          await client.navigate(targetUrl);
        }
        return;
      }
    }

    if (clients.openWindow) {
      await clients.openWindow(targetUrl);
    }
  })());
});
