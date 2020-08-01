//! Checking Service Working!
if ('serviceWorker' in navigator) {
    registerServiceWorker();
    requestPermission();
}

//! Register service worker
function registerServiceWorker() {
    return navigator.serviceWorker.register('serviceworker.js')
        .then(function (registration) {
            console.log('Service worker has been registered!');
            return registration;
        })
        .catch(function (err) {
            console.error('Failed registering service worker!', err);
        });
}

//! ServerKey converter
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

//! Request User's Permission 
function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Notification has been disapproved!");
                return;
            } else if (result === "default") {
                console.error("User closed the confirmation!");
                return;
            } else {
                console.log("Notification has been allowed!");
            }

            if ('PushManager' in window) {
                navigator.serviceWorker.getRegistration()
                .then(function(registration) {
                    if (registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BDlD_wxjgokN9TVJDdEyemsbknIwXxXUo_DTIxgFC7V9afJtzHXhvDPhRXpeXU-hEXwIxjE0cgKtzc2ErUcwQ-E")
                        }).then(function(subscribe) {
                            const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh'))));
                            const authKey = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))));
                            console.log('endpoint: ', subscribe.endpoint);
                            console.log('p256dh key: ', p256dh);
                            console.log('auth key: ', authKey);
                            localStorage.setItem("endpoint", subscribe.endpoint);
                            localStorage.setItem("p256dh", p256dh);
                            localStorage.setItem("authKey", authKey);
                        }).catch(function(e) {
                            console.error('Failed to subscribe: ', e.message);
                        });
                    }
                });
            }
        });
    }
}