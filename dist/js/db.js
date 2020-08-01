const dbPromised = idb.open("JuveDB-1", 5, (JuveDB) => {
    switch (JuveDB.oldVersion) {
        case 0:
            const playerStore = JuveDB.createObjectStore('FavPlayers', {keyPath: 'id'});
            playerStore.createIndex('name', 'name');
        case 1:
            const leagueStore = JuveDB.createObjectStore('FavLeague', {keyPath: 'id'});
            leagueStore.createIndex('name', 'name');
        case 2:
            JuveDB.createObjectStore('ClubInfo', {keyPath: 'id'});
        case 3:
            JuveDB.createObjectStore('League', {keyPath: 'id'});
        case 4:
            JuveDB.createObjectStore('Player', {keyPath: 'id'});
    }
});

// IDB OFFLINE ACCESS FUNCTIONS

export function saveClubInfo(team) {
    dbPromised.then(db => {
        const tx = db.transaction('ClubInfo', 'readwrite');
        const store = tx.objectStore('ClubInfo');
        store.put(team);
        return tx.complete;
    })
}

export function getClubByID(id) {
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction('ClubInfo', 'readonly');
            const store = tx.objectStore('ClubInfo');
            return store.get(id);
        })
        .then((data) => resolve(data));
    });
}

export function saveLeagueByID(league) {
    dbPromised.then(db => {
        const tx = db.transaction('League', 'readwrite');
        const store = tx.objectStore('League');
        store.put(league);
        return tx.complete;
    })
}

export function getLeagueByID(id) {
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction('League', 'readonly');
            const store = tx.objectStore('League');
            return store.get(id);
        })
        .then((data) => resolve(data));
    });
}

export function savePlayerByID(player) {
    dbPromised.then(db => {
        const tx = db.transaction('Player', 'readwrite');
        const store = tx.objectStore('Player');
        store.put(player);
        return tx.complete;
    })
}

export function getPlayerByID(id) {
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction('Player', 'readonly');
            const store = tx.objectStore('Player');
            return store.get(id);
        })
        .then((data) => resolve(data));
    });
}

// FAV PLAYER FUNCTIONS

export function favPlayer(player) {
    dbPromised.then(db => {
        const tx = db.transaction("FavPlayers", 'readwrite');
        const store = tx.objectStore("FavPlayers");
        store.put(player);

        return tx.complete;
    })
    .then(() => console.log(`${player.name} is ADDED to Favorites`));
}

export function getAllFavPlayer() {
    return new Promise(async (resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction("FavPlayers", 'readonly');
            const store = tx.objectStore("FavPlayers");
            return store.getAll();
        })
        .then((FavPlayers) => resolve(FavPlayers));
    });
}

export function getFavPlayerById(id) {
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction("FavPlayers", 'readonly');
            const store = tx.objectStore("FavPlayers");
            
            return store.get(id);
        })
        .then((player) => resolve(player));
    });
}

export function deleteFavPlayer(player) {
    dbPromised
    .then((db) => {
        var tx = db.transaction('FavPlayers', 'readwrite');
        var store = tx.objectStore('FavPlayers');
        store.delete(player.id);

        return tx.complete;
    }).then(() => console.log(`${player.name} is REMOVED from Favorites`));
}

// FAV LEAGUE FUNCTIONS

export function favLeague(league) {
    dbPromised.then(db => {
        const tx = db.transaction('FavLeague', 'readwrite');
        const store = tx.objectStore('FavLeague');
        store.put(league);
        return tx.complete;
    })
    .then(() => console.log(`${league.competition.name} is ADDED to Favorites`));
}

export function getAllFavLeague() {
    return new Promise(async (resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction('FavLeague', 'readonly');
            const store = tx.objectStore('FavLeague');
            return store.getAll();
        })
        .then((league) => resolve(league));
    });
}

export function getFavLeagueById(id) {
    return new Promise(async (resolve, reject) => {
        dbPromised
        .then((db) => {
            const tx = db.transaction('FavLeague', 'readonly');
            const store = tx.objectStore('FavLeague');
            
            return store.get(id);
        })
        .then((league) => resolve(league));
    });
}

export function deleteFavLeague(league) {
    dbPromised
    .then((db) => {
        var tx = db.transaction('FavLeague', 'readwrite');
        var store = tx.objectStore('FavLeague');
        store.delete(league.id);

        return tx.complete;
    }).then(() => console.log(`${league.name} is REMOVED from Favorites`));
}