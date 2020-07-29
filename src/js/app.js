import { 
	home,
	allSquadInfo,
	allLeagueInfo,
	playerInfo,
	leagueInfo,
	getFavorites,
} from './main.js';

document.addEventListener('DOMContentLoaded', function() {

	// Detect Hash URL Change
	window.onhashchange = () => getPage();

	// Running when page load
	getPage()

	// Sidebar Navigation
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();

	function loadNav()
	{
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4){
				if(this.status != 200) return;

				// Load menus links
				document.querySelectorAll(".sidenav, .topnav")
				.forEach(function(elm){
					elm.innerHTML = xhttp.responseText;
				});

				// Add listener for each link
				document.querySelectorAll('.sidenav a, .topnav a, .brand-logo')
				.forEach(function(elm) {
					elm.addEventListener('click', function(event) {
						// CLose sidebar when clicked
						const sidenav = document.querySelector('.sidenav');
						M.Sidenav.getInstance(sidenav).close();
					});
				});
			}
		};
		xhttp.open("GET", 'pages/navbar.html', true);
		xhttp.send();
	}

	function loadPage(page)
	{
		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", `pages/${page}.html`, true);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4){
				const content = document.querySelector(".body-content");
				if(this.status === 200) {
					content.innerHTML = xhttp.responseText;
					setPage();
					scrollToTopBtn();
				} else if(this.status === 404) {
					const endpoint = localStorage.getItem('endpoint');
					const p256dh = localStorage.getItem('p256dh');
					const authKey = localStorage.getItem('authKey');

					//? Mobile push notification key
					let pushkey = ``;
					if (endpoint) {
						pushkey = /*html*/ `
							<div class="pushkey" style="color: grey; margin: 4em auto; overflow-wrap: anywhere;">
								<p>${endpoint}</p>
								<p>${p256dh}</p>
								<p>${authKey}</p>
							</div>
						`;
					}

					content.innerHTML = /*html*/ `
						<div class="container center not-found">
							<img width="256" src="assets/image/404.png" />
							<h1>Page Not Found!</h1>
							${ pushkey }
						</div>
					`;
				} else {
					content.innerHTML = /*html*/ `
						<div class="container center">
							<p>Opss.. Page cannot be accessed!</p>
						</div>
					`;
				}
			}
		};
	}

	//? callback based on URL Path
	function setPage() {
		let page = window.location.hash;
		let result =  page.indexOf("?") > -1 ? 
						page.substring(1, page.indexOf('?')) :
						window.location.hash.substr(1)
		
		switch (result) {
			case '':
				home();
				break;
			case 'team':
				allSquadInfo();
				break;
			case 'competition':
				allLeagueInfo();
				break;
			case 'player':
				playerInfo();
				break;
			case 'league':
				leagueInfo();
				break;
			case 'favorites':
				getFavorites();
				break;
			default:
				break;
		}
		
	}

	//? redirect page based on URL changes
	function getPage() {
		let page = window.location.hash;
		let result =  page.indexOf("?") > -1 ? 
				page.substring(1, page.indexOf('?')) :
				window.location.hash.substr(1)
				
		if(result === '') result = 'home';
		loadPage(result);
	}

	//? Show scroll to top button
	function scrollToTopBtn() {
		const scrollTopButton = document.querySelector(".scrollTop");
		window.addEventListener("scroll", () => {
			if (window.pageYOffset > 200) {
				scrollTopButton.classList.add("active")
			} else {
				scrollTopButton.classList.remove("active")
			}
		})
		scrollTopButton.addEventListener("click", function () {
			window.scroll({
				top: 0, 
				left: 0, 
				behavior: 'smooth'
			});
		});
	}
});