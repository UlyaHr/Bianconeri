var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BDlD_wxjgokN9TVJDdEyemsbknIwXxXUo_DTIxgFC7V9afJtzHXhvDPhRXpeXU-hEXwIxjE0cgKtzc2ErUcwQ-E",
  privateKey:     "Xum8Zr_WZ1dKn_nI_PcNM1GPAcwQOG49sty6pcDOFOw",
};

webPush.setVapidDetails(
  "mailto:ulhabib7@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/fgEa6VFKcMI:APA91bGSE0iFccNDkx9AdiBUo6IzDbR6Cv7J1JFLhd2XkPYLE7jqv6rTA84gMYN7YtywaGNeWJx06Qf9r3dGsiEHdvqYts09caoswbnUSIbz4vXx3kezEYzhMKvz4Hw3MVNaFXkY_21t",
  keys: {
    p256dh:
      "BLcX7sLcNSBogCwiEPDjl+ihyU+gz0tu54Pk2d1pOgwELsWQKa7zWQToPNc5BVboXcid9DC0ugmXivJ4lReyc3c=",
    auth: "ol6wZE2FFxABdhZD7tVzVA==",
  },
};

var payload = "Test Push notification from server!";

var options = {
  gcmAPIKey: "724689303004",
  TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
