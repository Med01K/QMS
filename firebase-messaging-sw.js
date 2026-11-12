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

const APP_URL = "https://med01k.github.io/QMS/";

// [تحديث] النسخة الجديدة من هذا الملف تعمل فوراً بعد رفعها، دون انتظار إغلاق كل نوافذ الموقع
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

// [إشعارات] Firebase يعرض بنفسه الرسائل التي فيها حقل notification فقط.
// إذا أرسل الـ Worker رسالة بيانات فقط (data) لم يكن يظهر شيء؛ نعرضها هنا.
// الرسائل التي فيها notification نتركها لـ Firebase حتى لا يظهر الإشعار مرتين.
messaging.onBackgroundMessage((payload) => {
  if (payload && payload.notification) return;

  const d = (payload && payload.data) || {};
  const type = String(d.type || "prep").toLowerCase();
  const isTurn = (type === "turn" || type === "called");

  return self.registration.showNotification(d.title || "بريد حي الأمل", {
    body: d.body || "",
    icon: d.icon || "logo.png",
    badge: "logo.png",
    // نفس وسم إشعارات الصفحة (qms-<رقم>-turn / qms-<رقم>-prep) فيستبدل أحدهما الآخر بدل التكرار
    tag: d.tag || ("qms-" + (d.ticket || "0") + "-" + (isTurn ? "turn" : "prep")),
    renotify: true,
    dir: "auto",
    requireInteraction: isTurn,
    vibrate: isTurn ? [400, 150, 400, 150, 600] : [300, 150, 300],
    data: { url: d.url || APP_URL }
  });
});

// فتح التطبيق والتركيز عليه عند النقر على الإشعار
// (إشعارات الصفحة وإشعارات onBackgroundMessage أعلاه. إشعارات Firebase التلقائية
//  يعالج Firebase نقرها بنفسه ويفتح الرابط fcm_options.link إن أرسله الـ Worker)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification?.data && event.notification.data.url)
                    ? event.notification.data.url
                    : APP_URL;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("med01k.github.io/QMS") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
