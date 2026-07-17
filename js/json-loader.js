localforage.setItem('e', 'e');

function getRouteFromHash() {
	var hash = window.location.hash || '#/';
	var route = hash.slice(1);
	if (route.startsWith('/~')) return '/~';
	return route || '/';
}

var gamesLoaded = false;
var appsLoaded = false;

function loadGames() {
	if (gamesLoaded) return;
	fetch('json/g.json')
		.then(response => response.json())
		.then(data => {
			var gameContainer = document.querySelector('.gameContain');
			if (!gameContainer) return;

			data.sort(function (a, b) { return a.name.localeCompare(b.name); });

			data.forEach(function (game) {
				var gameLink = document.createElement('a');
				gameLink.href = game.url;
				gameLink.target = '_blank';
				gameLink.rel = 'noopener noreferrer';
				gameLink.className = 'gameAnchor';

				if (game.categories && game.name) {
					game.categories.forEach(function (category) {
						gameLink.id = (gameLink.id ? gameLink.id + ' ' : '') + category;
					});
					var gameNameClass = game.name
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');
					gameLink.className += ' ' + gameNameClass;
				}

				var gameImage = document.createElement('img');
				gameImage.src = game.img;
				gameImage.alt = game.name;
				gameImage.title = game.name;
				gameImage.className = 'gameImage';
				gameImage.onerror = function () {
					gameImage.style.display = 'none';
				};

				gameLink.appendChild(gameImage);
				gameContainer.appendChild(gameLink);
			});

			var gameSearchInput = document.querySelector('.gameSearchInput');
			if (gameSearchInput) {
				gameSearchInput.addEventListener('input', function () {
					var searchQuery = gameSearchInput.value
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');
					var gameLinks = document.querySelectorAll('.gameContain a');
					gameLinks.forEach(function (link) {
						link.style.display = link.className.includes(searchQuery) ? '' : 'none';
					});
				});
			}

			var randomBtn = document.querySelector('.randomBtn');
			if (randomBtn) {
				randomBtn.addEventListener('click', function () {
					var gameAnchors = Array.from(document.querySelectorAll('.gameAnchor'));
					var visible = gameAnchors.filter(function (a) { return a.style.display !== 'none'; });
					if (visible.length > 0) {
						visible[Math.floor(Math.random() * visible.length)].click();
					}
				});
			}

			gamesLoaded = true;
			setupObserver('.gameImage');
		})
		.catch(function (error) { console.error('Error loading games:', error); });
}

function loadApps() {
	if (appsLoaded) return;
	fetch('json/a.json')
		.then(response => response.json())
		.then(data => {
			var appsContainer = document.querySelector('.appsContainer');
			if (!appsContainer) return;

			data.sort(function (a, b) { return a.name.localeCompare(b.name); });

			data.forEach(function (app) {
				var appLink = document.createElement('a');
				appLink.href = app.url;
				appLink.target = '_blank';
				appLink.rel = 'noopener noreferrer';

				if (app.categories && app.name) {
					app.categories.forEach(function (category) {
						appLink.id = (appLink.id ? appLink.id + ' ' : '') + category;
					});
					var appNameClass = app.name
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');
					appLink.className = appNameClass;
				}

				var appImage = document.createElement('img');
				appImage.src = app.img;
				appImage.alt = app.name;
				appImage.title = app.name;
				appImage.className = 'appImage';
				appImage.onerror = function () {
					appImage.style.display = 'none';
				};

				appLink.appendChild(appImage);
				appsContainer.appendChild(appLink);
			});

			var appsSearchInput = document.querySelector('.appsSearchInput');
			if (appsSearchInput) {
				appsSearchInput.addEventListener('input', function () {
					var searchQuery = appsSearchInput.value
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');
					var appLinks = document.querySelectorAll('.appsContainer a');
					appLinks.forEach(function (link) {
						link.style.display = link.className.includes(searchQuery) ? '' : 'none';
					});
				});
			}

			appsLoaded = true;
			setupObserver('.appImage');
		})
		.catch(function (error) { console.error('Error loading apps:', error); });
}

function handleRoute() {
	var route = getRouteFromHash();
	if (route === '/g') loadGames();
	if (route === '/a') loadApps();
}

document.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('hashchange', handleRoute);
