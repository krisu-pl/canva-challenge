class Tournament {
  /**
   * Dependencies of Tournament are API, UI and Round classes.
   * @param API
   * @param UI
   * @param Round
   */
  constructor({ API, UI, Round }) {
    this.API = API;
    this.UI = UI;
    this.Round = Round;
    this.teamsInfo = [];
    this.currentRound = 0;
    this.UI.setWinner('');
    this.UI.showError('');
  }

  /**
   * Start and proceed with a tournament
   */
  start() {
    this.create()
      .then(this.getTeamsInfo.bind(this))
      .then(this.startNewRound.bind(this))
      .then(this.showWinner.bind(this))
      .catch(this.UI.showError);
  }

  /**
   * Create a new tournament
   * @returns {Promise} - object with tournamentId and initial matchesToPlay
   */
  create() {
    const { teamsPerMatch, numberOfTeams } = this.UI.getTournamentOptions();

    return this.API.createTournament({ teamsPerMatch, numberOfTeams })
      .then((response) => {
        this.teamsPerMatch = teamsPerMatch;
        this.tournamentId = response.tournamentId;
        this.matchesToPlay = response.matchUps;
        const { tournamentId, matchesToPlay } = this;

        // Show status of the tournament
        const totalNumberOfMatches = getNumberOfMatches(numberOfTeams, teamsPerMatch)
        const roundsInfo = getRoundsInfo(numberOfTeams, teamsPerMatch);

        this.matchesInfo = roundsInfo.map(roundCount => new Array(roundCount).fill(''))
        this.tournamentStatus = new TournamentStatus(roundsInfo, this.UI);

        return { tournamentId, matchesToPlay };
      });
  }

  /**
   * Get data for each initial team
   * @param tournamentId
   * @param matchesToPlay
   * @returns {Promise}
   */
  getTeamsInfo({ tournamentId, matchesToPlay }) {
    const teamDataPromises = [];

    // Send request for data of each team
    // and push it to the request list.
    matchesToPlay.map((match) => {
      match.teamIds.map((teamId) => {
        const teamData = this.API.getTeamData({ tournamentId, teamId });
        teamDataPromises.push(teamData);
      });
    });

    return Promise.all(teamDataPromises)
      .then((teamsInfo) => {
        this.teamsInfo = teamsInfo;
        return teamsInfo;
      });
  }

  /**
   * Start and play new round
   * @returns {Promise} - array with ids of teams left after the round
   */
  startNewRound() {
    const round = new this.Round({ tournament: this, API: this.API });
    const handleRoundFinish = this.handleRoundFinish.bind(this);

    return round.play()
      .then(handleRoundFinish);
  }

  /**
   * Check how many teams are left and start another round if necessary
   * @param teamsLeft - array with ids of teams left after the round
   * @returns {Promise} - promise is resolved after all rounds are finished
   */
  handleRoundFinish(teamsLeft) {
    // We got a winner mate!
    if (teamsLeft.length === 1) {
      return teamsLeft;
    }

    // Prepare new round
    this.matchesToPlay = [];
    let matchId = 0;
    for (let i = 0; i < teamsLeft.length; i += this.teamsPerMatch) {
      const teamIds = teamsLeft.slice(i, i + this.teamsPerMatch);
      this.matchesToPlay.push({
        match: matchId,
        teamIds,
      });
      matchId += 1;
    }
    this.currentRound += 1;
    return this.startNewRound();
  }

  /**
   * Show winning team name
   * @param {Array} teamId - an array with a single id of winning team
   */
  showWinner(teamId) {
    const winningTeam = findTeamsById(teamId, this.teamsInfo)[0];
    this.UI.setWinner(winningTeam.name);
  }

  updateMatchInfo({ currentRound, match, matchTeams }) {
    this.matchesInfo[currentRound][match] = matchTeams;
  }

  showMatchData({ round, match }) {
    const matchInfo = this.matchesInfo[round][match];
    this.UI.showMatchInfo(matchInfo)
  }
}
