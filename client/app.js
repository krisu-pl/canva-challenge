/**
 * Main
 */

const createTournament = () => {
  const tournamentOptions = {
    API,
    UI,
    Round
  };
  const tournament = new Tournament(tournamentOptions);
  tournament.start();

  const tournamentStatus = document.getElementById('tournament-status');
  tournamentStatus.addEventListener('click', (e) => {
      const el = e.target;
      if (el.classList.contains('status')) {
        const { round, match } = el.dataset;
        tournament.showMatchData({ round, match })
      }
  })
};
