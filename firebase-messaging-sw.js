/* POSTE EL AMAL - Firebase Cloud Messaging Service Worker */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDMXCn68jPTrbwHZ7-YXI3HtiG84gOkITU",
  authDomain: "qms-online-2658d.firebaseapp.com",
  databaseURL: "https://qms-online-2658d-default-rtdb.firebaseio.com",
  projectId: "qms-online-2658d",
  storageBucket: "qms-online-2658d.firebasestorage.app",
  messagingSenderId: "1018632771701",
  appId: "1:1018632771701:web:2a87f89d70987bdbbdc03c"
});

const messaging = firebase.messaging();

// استقبال الإشعارات عندما يكون المتصفح مغلقاً أو في الخلفية
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "POSTE EL AMAL";
  const notificationOptions = {
    body: payload.notification?.body || "Votre tour approche au guichet.",
    icon: new URL("logo.png", self.location.href).href,
    badge: new URL("logo.png", self.location.href).href,
    tag: "qms-fcm-alert",
    requireInteraction: true,
    vibrate: [400, 150, 400, 150, 600],
    data: {
      url: payload.data?.url || self.registration.scope
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// فتح التطبيق عند النقر على الإشعار
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification?.data?.url || self.registration.scope, self.location.href).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientList) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(targetUrl);
        return;
      }
    }
    if (clients.openWindow) await clients.openWindow(targetUrl);
  })());
});
