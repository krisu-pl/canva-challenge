class TournamentStatus {
  /**
   * TournamentStatus is dependent on UI class
   * @param UI
   */
  constructor(roundsInfo, UI) {
    this.UI = UI;
    this.matchStatus = roundsInfo.map(roundCount => new Array(roundCount).fill(0))
    this.updateStatus();
  }

  /**
   * Update status after a match is finished
   */
  finishMatch(round, match) {
    this.matchStatus[round][match] = true;
    this.updateStatus();
  }

  getMatchIndicator(isFinished, round, match) {
    return `<span class="status ${isFinished ? 'status--finished' : 'status--todo'}"
                  data-round="${round}"
                  data-match="${match}"></span>`
  }

  /**
   * Update interface
   * Matches to play are presented with an empty square
   * Finished matches are presented with a full square
   */
  updateStatus() {
    const squareFull = '<span class="status status--finished"></span>';
    const squareEmpty = '<span class="status status--todo"></span>';

    const status = this.matchStatus.map((round, roundIndex) =>
      round.map((isFinished, matchIndex) => this.getMatchIndicator(isFinished, roundIndex, matchIndex)).join('')
    ).join('')

    this.UI.updateTournamentStatus(status);
  }
}
