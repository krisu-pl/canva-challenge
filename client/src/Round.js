class Round {
  /**
   * Round is dependent on Tournament instance and API class
   * @param tournament - instance of Tournament class
   * @param API
   */
  constructor({ tournament, API }) {
    this.tournament = tournament;
    this.API = API;
  }

  /**
   * Play new round
   * @returns {Promise} - resolved after all matches are finished
   */
  play() {
    return Promise.all(
      this.tournament.matchesToPlay.map(currentMatch => this.playSingleMatch(currentMatch)),
    );
  }

  /**
   * Get result of a single match
   * @param currentMatch - object containing match details
   * @returns {Promise} - resolved when the match is finished
   */
  playSingleMatch(currentMatch) {
    const { tournamentId, currentRound, teamsInfo } = this.tournament;
    const { match, teamIds } = currentMatch;
    const matchOptions = {
      tournamentId,
      round: currentRound,
      match,
    };

    // Get teams scores for the current match
    const teamScores = findTeamsById(teamIds, teamsInfo).map(team => team.score);

    const matchTeams = findTeamsById(teamIds, teamsInfo).map(team => team.name);
    this.tournament.updateMatchInfo({ currentRound, match, matchTeams });

    return this.API.getMatchScore(matchOptions)
      .then(matchScore => this.getMatchWinner({ score: matchScore.score, tournamentId, teamScores }))
      .then(matchWinner => this.getWinningTeam({ score: matchWinner.score, teamsInfo, match }));
  }

  /**
   * Find out which team wins the match
   * @param score
   * @param tournamentId
   * @param teamScores
   * @returns {Promise} - resolved after receiving the winner the server
   */
  getMatchWinner({ score, tournamentId, teamScores }) {
    return this.API.getMatchWinner({
      tournamentId,
      teamScores,
      matchScore: score,
    });
  }

  /**
   * Return id of the winning team
   * If there are more teams with the same score, choose the one with the lowest id
   * @param score
   * @param teamsInfo
   * @returns {number} - winning team id
   */
  getWinningTeam({ score, teamsInfo, match }) {
    const teams = findTeamsByScore(score, teamsInfo);
    const winningTeam = (teams.length > 1)
      ? getTeamWithLowestId(teams) // We have a tie
      : teams[0]; // Only one winner

    this.tournament.tournamentStatus.finishMatch(this.tournament.currentRound, match);

    return winningTeam.teamId;
  }
}
