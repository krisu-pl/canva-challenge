const getTeamWithLowestId = teams => teams.sort((a, b) => a.teamId - b.teamId)[0];

const findTeamsById = (teamIds, teamsInfo) => teamIds.map(teamId => teamsInfo.find(team => team.teamId === teamId));

const findTeamsByScore = (score, teamsInfo) => teamsInfo.filter(team => team.score === score);

const getNumberOfMatches = (players, perMatch) => {
  if (players <= 1) {
    return 0;
  }
  const newPlayers = players / perMatch;
  return newPlayers + getNumberOfMatches(newPlayers, perMatch);
};

const getRoundsInfo = (players, perMatch) => {
  const roundsInfo = [];
  let playersLeft = players;
  while (playersLeft > 1) {
    playersLeft = playersLeft / perMatch;
    roundsInfo.push(playersLeft)
  }
  return roundsInfo;
}

const createURIParams = params =>
  Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (typeof value === 'object') {
        return value.map(subvalue => encodeURIComponent(key) + '=' + encodeURIComponent(subvalue)).join('&');
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&');
