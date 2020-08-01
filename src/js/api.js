class MainAPI {
  constructor() {
    (this.base_url = "https://api.football-data.org/v2/"),
      (this.config = {
        method: "get",
        headers: {
          "X-Auth-Token": "b1d770e1e10542849da4ef85aa248a54",
        },
      });
  }

  async api(endpoint) {
    return fetch(this.base_url + endpoint, this.config)
      .then(async (res) => {
        const result = await res.json();
        return result;
      })
      .catch(() => false);
  }

  async teamInfo() {
    const info = await this.api(`teams/109`);
    return info;
  }

  async playerInfo(id) {
    const info = await this.api(`players/${id}`);
    return info;
  }

  async leagueInfo(id) {
    const info = await this.api(`competitions/${id}/standings`);
    return info;
  }
}

export default MainAPI;
