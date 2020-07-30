export function setHomePage(info) {
  const element = /*html*/ `
		<div class="img-parallax"></div>
		<div class="parallax-accent"></div>
		<div class="container">
			<div class="banner-text center">
				<h1>Bianconeri</h1>
				<h4 class="flow-text">Companion app for ${info.name} fans</h4>
				<a href="${info.website}" target="_blank" rel="noopener noreferrer" class="waves-effect waves-light btn-small"><i class="material-icons left">language</i>Website</a>
				<a href="mailto:${info.email}" class="waves-effect waves-light btn-small"><i class="material-icons left">email</i>Email</a>
			</div>
			<div class="club-info">
				<h1>Detail Information</h1>
				<table>
					<tbody>
						<tr>
							<td>Club Name</td>
							<td>${info.name}</td>
						</tr>
						<tr>
							<td>Address</td>
							<td>${info.address}, ${info.area.name}</td>
						</tr>
						<tr>
							<td>Venue</td>
							<td>${info.venue}</td>
						</tr>
						<tr>
							<td>Founded</td>
							<td>${info.founded}</td>
						</tr>
						<tr>
							<td>Website</td>
							<td>
								<a href="${info.website}" target="_blank" rel="noopener noreferrer">
									${info.website}
								</a>
							</td>
						</tr>
						<tr>
							<td>Phone</td>
							<td>
								<a href="tel:${info.phone}">
									${info.phone}
								</a>
							</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>
								<a href="mailto:${info.email}">
									${info.email}
								</a>
							</td>
						</tr>
					</tbody>
				</table>
				<p>Last Updated: ${setDate(info.lastUpdated)}</p>
			</div>
		</div>
    `;
  document.getElementById("homepage").innerHTML = element;
}

export function setGroupSquad() {
  const allSquad = [
    { id: "Goalkeeper", division: "GOALKEEPER" },
    { id: "Defender", division: "DEFENDER" },
    { id: "Midfielder", division: "MIDFIELDER" },
    { id: "Attacker", division: "FORWARD" },
  ];

  let group = /*html*/ `
		<h1><i class="material-icons">chevron_right</i>COACH</h1>
		<div class="row">
			<div class="col s12">
				<a href="#player?id=10983">
					<div class="card">
						<div class="info-content">
							<p class="card-title">Maurizio Sarri</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	`;

  allSquad.forEach((dt) => {
    group += `
			<h1><i class="material-icons">chevron_right</i>${dt.division}</h1>
			<div class="row group" id="${dt.id}"></div>
		`;
  });
  document.getElementById("team-squad").innerHTML = group;
}

export function setSquad(val, dt) {
  return (val += /*html*/ `
		<div class="col s12 m4 l3">
			<a href="#player?id=${dt.id}">
				<div class="card">
					<div class="info-content">
						<p class="card-title">${dt.name}</p>
					</div>
				</div>
			</a>
		</div>
	`);
}

export function setPlayerInfo(info) {
  const element = /*html*/ `
		<div class="col s12 m6 l5">
			${
        info.id === 10983
          ? `<img id="coach-img" src="./assets/icon/coach.png" alt="img-player">`
          : `<img src="./assets/icon/football-player.png" alt="img-player">`
      }
		</div>
		<div class="col s12 m6 l7">
			<table>
				<tbody>
					<tr>
						<td>Name</td>
						<td>${info.name}</td>
					</tr>
					<tr>
						<td>Nickname</td>
						<td>${info.firstName}</td>
					</tr>
					<tr>
						<td>Birthdate</td>
						<td>${setDate(info.dateOfBirth)}</td>
					</tr>
					<tr>
						<td>Country of Birth</td>
						<td>${info.countryOfBirth}</td>
					</tr>
					<tr>
						<td>Position</td>
						<td>${info.position ? info.position : "-"}</td>
					</tr>
					<tr>
						<td>Shirt Number</td>
						<td>${info.shirtNumber ? info.shirtNumber : "-"}</td>
					</tr>
					<tr>
						<td>Nationality</td>
						<td>${info.nationality}</td>
					</tr>
					<tr>
						<td>Last Updated</td>
						<td>${setDate(info.lastUpdated)}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="waves-effect waves-light btn" id="btn-player">
			Save as Your Favorite!
		</div>
	`;
  //! Show error or fetch result
  if (!info) {
    errApiLimit();
  } else if (!info.name) {
    errDataNotFound();
  } else {
    document.getElementById("player-info").innerHTML = element;
  }
}

export function setAllLeagueInfo(info, fromFavorites = false) {
  let dataCompetitions = ``;
  info.forEach((league) => {
    dataCompetitions += /*html*/ `
			<ul class="collection">
				<li class="collection-item row">
					<div class="col s3">
						<a href="#league?id=${league.id}">
							<img src="./assets/image/${league.name}.png" alt="${league.name}">
						</a>
					</div>
					<div class="col s9">
						<a href="#league?id=${league.id}">
							<span>${league.name}</span>
						</a>
					</div>
				</li>
			</ul>
		`;
  });

  if (fromFavorites) {
    document.getElementById("favLeague").innerHTML = dataCompetitions;
  } else {
    document.getElementById("competition-info").innerHTML = dataCompetitions;
  }
}

export function setLeagueInfo(info) {
  // setup for indexedDB
  info.id = info.competition.id;
  info.name = info.competition.name;

  setLeagueHeaderSection(info);
  const params = {
    standings: info.standings.filter((standing) => standing.type === "TOTAL"),
    leagueType: info.standings[0].stage,
    table: ``,
    eachData: ``,
  };

  params.leagueType === "REGULAR_SEASON"
    ? setRegularSeason(params)
    : setTournamentLeague(params);
}

export function showPreloader(id) {
  const element = /*html*/ `
	<div class="preloader-wrapper big active">
		<div class="spinner-layer spinner-blue">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
		</div>

		<div class="spinner-layer spinner-red">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
		</div>

		<div class="spinner-layer spinner-yellow">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
		</div>

		<div class="spinner-layer spinner-green">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
		</div>
	</div>`;

  return (document.getElementById(id).innerHTML = element);
}

export function errApiLimit() {
  const element = /*html*/ `
    <div class="error-api container align-center">
        <h1>Sorry, there's an api limitation!</h1>
        <h2 class="red-text">Wait for a minute and try refresh this page again</h2>
    </div>`;

  return (document.getElementById("bodyContent").innerHTML = element);
}

export function errDataOffline() {
  const element = /*html*/ `
    <div class="error-api container align-center">
        <h1>Sorry, we don't have this data information yet!</h1>
        <h2 class="red-text">You can grab the data while online!</h2>
    </div>`;

  return (document.getElementById("bodyContent").innerHTML = element);
}

export function showAddToFavoriteBtn(btn, name) {
  M.Toast.dismissAll();
  btn.style.backgroundColor = "#B71C1C";
  btn.innerText = "Delete from Favorite?";
  M.toast({
    inDuration: 100,
    html: /*html*/ `
		<span>Save <strong class="yellow-text">${name}</strong> as your favorite!</span>`,
  });
}

export function showDeleteFavoriteBtn(btn, name) {
  M.Toast.dismissAll();
  btn.style.backgroundColor = "#114875";
  btn.innerText = "Save as Your Favorite!";
  M.toast({
    inDuration: 100,
    html: /*html*/ `
		<span>Remove <strong class="yellow-text">${name}</strong> from your favorite!</span>`,
  });
}

export function getUrlParam(param, url) {
  if (!url) url = window.location.href;
  param = param.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function errDataNotFound() {
  const element = /*html*/ `
    <div class="error-api container align-center">
        <h1>Sorry, data not found!</h1>
        <h2 class="red-text">Try other data resource</h2>
    </div>`;

  return (document.getElementById("bodyContent").innerHTML = element);
}

function setDate(val) {
  let date = new Date(val);
  let options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en", options);
}

function setLeagueHeaderSection(data) {
  const element = /*html*/ `
		<div class="card">
			<div class="card-content white-text">
				<span class="card-title">${data.competition.name}</span>
				<p>Last Updated: <span>${setDate(data.competition.lastUpdated)}</span></p>
				<div class="waves-effect waves-light btn" id="btn-league">
					Save as Your Favorite!
				</div>
			</div>
		</div>
		<div class="divider"></div>
		<h1>Standings</h1>
		<div id="league-standing"></div>
	`;
  document.getElementById("league-info").innerHTML = element;
}

function setRegularSeason(data) {
  data.table = /*html*/ `
		<table class="responsive-table centered">
			<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Points</th>
					<th>Won</th>
					<th>Draw</th>
					<th>Lost</th>
				</tr>
			</thead>
			<tbody id="standingTable"></tbody>
		</table>
	`;

  data.standings.forEach(
    (stand) => (data.eachData = setClubStanding(data.eachData, stand.table))
  );
  document.getElementById("league-standing").innerHTML = data.table;
  document.getElementById("standingTable").innerHTML = data.eachData;
}

function setTournamentLeague(data) {
  // Set Group Table
  data.standings.forEach(
    (stand) => (data.table = setGroupLeagueDivision(data.table, stand))
  );
  document.getElementById("league-standing").innerHTML = data.table;

  // Set Club Standing
  data.standings.forEach((stand) => {
    data.eachData = ``;
    stand.table.forEach((dt) => {
      data.eachData += /*html*/ `
				<tr>
					<td>${dt.position}</td>
					<td>${dt.team.name}</td>
					<td>${dt.points}</td>
					<td>${dt.won}</td>
					<td>${dt.lost}</td>
					<td>${dt.draw}</td>
				</tr>
			`;
    });
    document.getElementById(stand.group).innerHTML = data.eachData;
  });
}

function setClubStanding(each, standings) {
  standings.forEach((data) => {
    each += /*html*/ `
			<tr>
				<td>${data.position}</td>
				<td>${data.team.name}</td>
				<td>${data.points}</td>
				<td>${data.won}</td>
				<td>${data.lost}</td>
				<td>${data.draw}</td>
			</tr>
		`;
  });
  return each;
}

function setGroupLeagueDivision(each, data) {
  each += /*html*/ `
		<div class="group-standing">
			<h1>${data.group.replace("_", " ")}</h1>
			<table class="responsive-table centered">
				<thead>
					<tr>
						<th>Position</th>
						<th>Name</th>
						<th>Points</th>
						<th>Won</th>
						<th>Draw</th>
						<th>Lost</th>
					</tr>
				</thead>
				<tbody id="${data.group}"></tbody>
			</table>
		</div>
	`;
  return each;
}
