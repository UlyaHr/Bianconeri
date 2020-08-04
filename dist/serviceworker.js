importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');

const CACHE_DATA = [
  { url: './', revision: '1' },
	{ url: './index.html', revision: '1' },
  { url: './index.js', revision: '1' },
  { url: './manifest.json', revision: '1' },
	{ url: './serviceworker.js', revision: '1' },
	
	{ url: './css/style.css', revision: '1' },
	{ url: './css/materialize.min.css', revision: '1' },
	{ url: './js/app.js', revision: '1' },
	{ url: './js/materialize.min.js', revision: '1' },
	{ url: './js/idb.js', revision: '1' },

	{ url: './assets/icon/ldpi.png', revision: '1' },
	{ url: './assets/icon/xxhdpi.png', revision: '1' },
	{ url: './assets/icon/xxxhdpi.png', revision: '1' },
	{ url: './assets/image/hero.jpg', revision: '1' },
  { url: './assets/image/nav-logo.png', revision: '1' },
  { url: './assets/image/side-logo.png', revision: '1' },
	{ url: './assets/image/up.png', revision: '1' },
	
	{ url: './pages/404.html', revision: '1' },
	{ url: './pages/competition.html', revision: '1' },
	{ url: './pages/favorites.html', revision: '1' },
	{ url: './pages/home.html', revision: '1' },
	{ url: './pages/league.html', revision: '1' },
	{ url: './pages/navbar.html', revision: '1' },
	{ url: './pages/player.html', revision: '1' },
	{ url: './pages/team.html', revision: '1' }
];

if (workbox) {
	const { precacheAndRoute } = workbox.precaching;
	precacheAndRoute(CACHE_DATA, { ignoreURLParametersMatching: [/.*/] });
	registerRouteConfig();
} else {
	console.log(`Failed to load Workbox`);
}

//? REGISTER ROUTES
function registerRouteConfig() {
	const { registerRoute } = workbox.routing;
	const { CacheFirst } = workbox.strategies;

	//? Images files
	registerRoute(
		/\.(?:png|gif|jpg|svg)$/,
		new CacheFirst({
			cacheName: 'image-assets',
			cacheExpiration: {
				maxEntries: 50,
				maxAgeSeconds: 14 * 24 * 30 * 30 // 14 days
			},
		})
	);

	//? Css & js files
	registerRoute(
		/\.(?:js|css)$/,
		new CacheFirst({
			cacheName: 'css-js-assets',
			cacheExpiration: {
				maxEntries: 50,
				maxAgeSeconds: 14 * 24 * 30 * 30 // 14 days
			},
		})
	);

	//? API route
	registerRoute(
		({url}) => url.origin === 'https://api.football-data.org',
		new CacheFirst({
			cacheName: 'api-data',
			plugins: [
				new workbox.cacheableResponse.CacheableResponse(({
					statuses: [0, 200, 404],
					headers: {
						'Access-Control-Expose-Headers': 'X-Is-Cacheable',
						'X-Is-Cacheable': 'yes'
					}
				}))
			]
		})
	);
}

//* Push Notification
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
        icon: 'assets/icon/xxxhdpi.png',
        badge: 'assets/icon/ldpi.png',
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