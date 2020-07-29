import { 
	getUrlParam,
	setHomePage,
	setGroupSquad,
	setSquad,
	setPlayerInfo,
	setAllLeagueInfo,
	setLeagueInfo,
	showPreloader,
	errApiLimit,
	errDataOffline,
	showAddToFavoriteBtn,
	showDeleteFavoriteBtn,
} from './pages.js';

import { 
	saveClubInfo,
	getClubByID,
	saveLeagueByID,
	getLeagueByID,
	savePlayerByID,
	getPlayerByID,
	favPlayer,
	getAllFavPlayer,
	getFavPlayerById,
	deleteFavPlayer,
	favLeague,
	getAllFavLeague,
	getFavLeagueById,
	deleteFavLeague,
} from './db.js';

import MainAPI from './api.js';

const online = window.navigator.onLine;

export function home() {
	if (online) {
		showPreloader('homepage');
		const base = new MainAPI();
		base.teamInfo()
		.then(info => {
			setHomePage(info);
			saveClubInfo(info);
		})
		.catch(() => errApiLimit())
	} else {
		getClubByID(109)
		.then(info => {
			setHomePage(info);
		})
		.catch(() => errDataOffline())
	}
}

export function allSquadInfo() {
	if (online) {
		showPreloader('team-squad');
		const base = new MainAPI();
		base.teamInfo()
		.then(info => {
			setSquadInfo(info);
			saveClubInfo(info);
		})
		.catch(() => errApiLimit())
	} else {
		getClubByID(109)
		.then(info => {
			setSquadInfo(info)
		})
		.catch(() => errDataOffline())
	}

	function setSquadInfo(info) {
		setGroupSquad();
		const arrTeam = document.querySelectorAll("#team-squad .group");
		arrTeam.forEach(mem => {
			let team = "";
			const spec = info.squad.filter(dt => dt.position === mem.id);
			spec.forEach(dt => team = setSquad(team, dt))
			mem.innerHTML = team;
		});
	}
}

export function allLeagueInfo() {
	if (online) {
		showPreloader('competition-info');
		const base = new MainAPI();
		base.teamInfo()
		.then(info => {
			setAllLeagueInfo(info.activeCompetitions)
			saveClubInfo(info);
		})
		.catch(() => errApiLimit())
	} else {
		getClubByID(109)
		.then(info => {
			setAllLeagueInfo(info.activeCompetitions)
		})
		.catch(() => errDataOffline())
	}
}

export async function playerInfo() {
	showPreloader('player-info');
	const playerID = getUrlParam('id');
	const isPlayerAvailableOnDB = await getFavPlayerById(parseInt(playerID));
	if (isPlayerAvailableOnDB) {
		// get data from indexedDB
		setPlayerInfo(isPlayerAvailableOnDB);
		const btnConfirm = document.getElementById("btn-player");
		btnConfirm.style.backgroundColor = "#B71C1C";
		btnConfirm.innerText = "Delete from Favorite List?";
		btnConfirm.onclick = () => {
			deleteFavPlayer(isPlayerAvailableOnDB);
			showDeleteFavoriteBtn(btnConfirm, isPlayerAvailableOnDB.name);
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		};
	} else {
		if (online) {
			// get data from server
			const base = new MainAPI();
			base.playerInfo(playerID)
			.then(info => {
				setPlayerInfo(info);
				savePlayerByID(info);
				const btnConfirm = document.getElementById("btn-player");
				btnConfirm.onclick = () => {
					favPlayer(info);
					showAddToFavoriteBtn(btnConfirm, info.name);
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}
			})
			.catch(() => errApiLimit())
		} else {
			getPlayerByID(parseInt(playerID))
			.then(info => {
				setPlayerInfo(info);
				const btnConfirm = document.getElementById("btn-player");
				btnConfirm.onclick = () => {
					favPlayer(info);
					showAddToFavoriteBtn(btnConfirm, info.name)
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}
			})
			.catch(() => errDataOffline())
		}
	}
}

export async function leagueInfo() {
	showPreloader('league-info');
	const leagueID = getUrlParam('id');
	const isLeagueAvailableOnDB = await getFavLeagueById(parseInt(leagueID));
	if (isLeagueAvailableOnDB) {
		// get data from indexedDB
		setLeagueInfo(isLeagueAvailableOnDB);
		const btnConfirm = document.getElementById("btn-league");
		btnConfirm.style.backgroundColor = "#B71C1C";
		btnConfirm.innerText = "Delete from Favorite List?";
		btnConfirm.onclick = () => {
			deleteFavLeague(isLeagueAvailableOnDB);
			showDeleteFavoriteBtn(btnConfirm, isLeagueAvailableOnDB.competition.name);
			window.location.reload();
		};
	} else {
		if (online) {
			// get data from server
			const base = new MainAPI();
			base.leagueInfo(parseInt(leagueID))
			.then(info => {
				setLeagueInfo(info);
				saveLeagueByID(info);
				const btnConfirm = document.getElementById("btn-league");
				btnConfirm.onclick = () => {
					favLeague(info);
					showAddToFavoriteBtn(btnConfirm, info.competition.name)
					window.location.reload();
				}
			})
			.catch(() => errApiLimit())
		} else {
			getLeagueByID(parseInt(leagueID))
			.then(info => {
				setLeagueInfo(info);
				const btnConfirm = document.getElementById("btn-league");
				btnConfirm.onclick = () => {
					favLeague(info);
					showAddToFavoriteBtn(btnConfirm, info.competition.name)
					window.location.reload();
				}
			})
			.catch(() => errDataOffline())
		}
	}
}

export function getFavorites() {
	getAllFavPlayer().then((players) => {
		let rowHTML = `<div class="row" id="favorite-player"></div>`;
		let playersHTML = "";
		if (players.length > 0) {
			players.forEach((player) => playersHTML = setSquad(playersHTML, player));
		} else {
			playersHTML = `
				<h3>You haven't favorited any player yet?</h3>
				<a href="#team"><p class="yellow-text center">Search Player</p></a>
			`;
		}
		
		document.getElementById("favoriteSquad").innerHTML = rowHTML;
		document.getElementById("favorite-player").innerHTML = playersHTML;
	});

	getAllFavLeague().then((leagues) => {
		let leagueHTML = "";
		if (leagues.length > 0) {
			leagueHTML = setAllLeagueInfo(leagues, true);
		} else {
			leagueHTML = `
				<h3>You haven't favorited any league yet?</h3>
				<a href="#competition"><p class="yellow-text center">Search League</p></a>
			`;
			document.getElementById("favLeague").innerHTML = leagueHTML;
		}
	});
}