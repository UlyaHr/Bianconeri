const webPush = require('web-push');

try {

  const vapidKeys = {
    "publicKey":
    "BA7qzHENF4pLfwFGHIQKIgciaZm8s_rqqT4UFdawkMPrgam7YDfKPNVbb-XNOIKgrV6osqF6DtGHlKimXgg5pTo","privateKey":"I52YG6-VmmLbafcJTZRA6fbqx-Rx7sJz9OgBkTxBAK4"};

  webPush.setVapidDetails(
      'mailto:ulhabib7@gmail.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
  )

  const pushSubscription = {
      "endpoint": "https://fcm.googleapis.com/fcm/send/dbcfppLEjKs:APA91bHYdFHSe9_XXyUqsXRrMzy0yVc3X8a6VV5l8BLiKPJxYCLVc0tuMK4QnptPQNyM-U_2Pr0JyO3x-deDbSKIcZBwCJWPHEKa4UI3sNzoIwuq51YKSXxDWruv1L9h5far9eTTpEdH",
      "keys": {
          "p256dh": "BHpHU5JmfenKVlIhDW0yPa8VGAFu//ZGWDnVrWXV9+kVjNVSO/JbYr3XoQAtXWAtrs/tuiLYfammaMMZOHQqABM=",
          "auth": "2n2z2lqCjCQrrQIKVsVmgw=="
      }
  };

  const payload = 'New Standings has been updated!';

  const options = {
      gcmAPIKey: '724689303004',
      TTL: 60
  };

  webPush.sendNotification(
    pushSubscription,
    payload,
    options
  ).then(res => {
    console.debug(res)
  }).catch(err => {
    console.debug('Error: ', err.message)
  });

} catch (error) {
  console.debug(error.message)
}