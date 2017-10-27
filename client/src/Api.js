const API = (function () {
  const API_BASE_URL = window.location.origin;

  /**
   * Send POST request to the server
   * @param endpoint
   * @param params - request body
   * @returns {Promise} - resolved with a received data or rejected with an error message
   */
  const sendRequestPOST = (endpoint, params) =>
    fetch(API_BASE_URL + endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: createURIParams(params),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          throw Error(data.message);
        }
        return data;
      });

  /**
   * Send GET request to the server
   * @param endpoint
   * @param params - params attached to the url
   * @returns {Promise} - resolved with a received data
   */
  const sendRequestGET = (endpoint, params) =>
    fetch(API_BASE_URL + endpoint + `?${createURIParams(params)}`, { method: 'get' })
      .then(response => response.json());


  return {
    createTournament: params => sendRequestPOST('/tournament', params),
    getTeamData: params => sendRequestGET('/team', params),
    getMatchScore: params => sendRequestGET('/match', params),
    getMatchWinner: params => sendRequestGET('/winner', params),
  };
}());
