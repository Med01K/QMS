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

// تهيئة نظام الرسائل (Firebase سيتولى إظهار الإشعار القادم من الكلودفلير تلقائياً وبنسخة واحدة فقط)
const messaging = firebase.messaging();

// فتح التطبيق والتركيز عليه عند النقر على الإشعار
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const targetUrl = (event.notification?.data && event.notification.data.url) 
                    ? event.notification.data.url 
                    : "https://med01k.github.io/QMS/";

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
