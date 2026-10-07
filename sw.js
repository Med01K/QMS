// sw.js
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl =
    event.notification?.data?.url ||
    self.registration.scope;

  const url = new URL(rawUrl, self.location.href).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    // إذا يوجد تبويب مفتوح: ركّز عليه ثم انتقل للرابط
    for (const client of clientList) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client && client.url !== url) {
          await client.navigate(url);
        }
        return;
      }
    }

    // إذا لا يوجد: افتح تبويب جديد على الرابط
    await clients.openWindow(url);
  })());
});
