let CACHE_NAME = 'bianconeri';
let urlsToCache = [
	'/',
	'/index.html',
	'/index.js',
	'/manifest.json',
	'/serviceworker.js',

	//? pages files
	'/pages/404.html',
	'/pages/competition.html',
	'/pages/favorites.html',
	'/pages/home.html',
	'/pages/league.html',
	'/pages/navbar.html',
	'/pages/player.html',
	'/pages/team.html',

	//? css files
	'./css/materialize.min.css',
	'./css/style.css',

	//? js files
	'/js/api.js',
	'/js/app.js',
	'/js/db.js',
	'/js/idb.js',
	'/js/main.js',
	'/js/materialize.min.js',
	'/js/pages.js',
	'/js/sw-auth.js',

	//? assets files
	'/assets/icon/logo-32.png',
	'/assets/icon/logo-128.png',
	'/assets/icon/logo-144.png',
	'/assets/icon/logo-192.png',
	'/assets/icon/logo-512.png',
	'/assets/icon/up.png',
	'/assets/image/404.png',
	'/assets/image/coach.svg',
	'/assets/image/hero.jpg',
	'/assets/image/player.svg',
	'/assets/image/Serie A.png',
	'/assets/image/UEFA Champions League.png'
	
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
})

self.addEventListener('fetch', function (event) {
	const base_url = "https://api.football-data.org/v2/";
	if (event.request.url.indexOf(base_url) > -1) {
		event.respondWith(
			caches.open(CACHE_NAME).then(function (cache) {
				return fetch(event.request).then(function (response) {
					cache.put(event.request.url, response.clone());
					return response;
				})
			})
		);
	} else {
		event.respondWith(
			caches.match(event.request, {
				ignoreSearch: true
			}).then(function (response) {
				return response || fetch(event.request);
			})
		)
	}
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys()
		.then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName != CACHE_NAME) {
						console.log("ServiceWorker: cache " + cacheName + " is deleted");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
})

self.addEventListener('push', function (event) {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
    const title = 'Bianconeri';
	let options = {
		body: body,
        icon: 'assets/icon/logo-192.png',
        badge: 'assets/icon/logo-32.png',
        image: 'assets/image/hero.jpg',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};
	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});