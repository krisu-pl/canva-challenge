const UI = {
  getTournamentOptions: () => ({
    teamsPerMatch: parseInt(document.getElementById('teamsPerMatch').value, 10),
    numberOfTeams: parseInt(document.getElementById('numberOfTeams').value, 10),
  }),
  setWinner: (name) => {
    document.getElementById('winner').innerHTML = name;
  },
  updateTournamentStatus: (status) => {
    document.getElementById('tournament-status__content').innerHTML = status;
  },
  showError: (msg) => {
    document.getElementById('error').innerHTML = msg;
  },
  showMatchInfo: (teams) => {
    const teamNames = teams.join(' vs ');
    document.getElementById('team-names').innerHTML = teamNames
  }
};
