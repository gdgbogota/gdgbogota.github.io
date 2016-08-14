/* global fetch */
/* eslint no-unused-vars: 0 */

'use strict';

/**
 * Usa un API personalizada para obtener datos de meetup.com.
 * @param {string} groupName Nombre del grupo para consultar.
 * @return {object} Una promesa.
 */
function meetupAPIService(groupName) {
  return fetch(`http://stuff7723.cloudapp.net:8090/api/events/${groupName}/`).then(response => {
    return response.json();
  })
  .then(data => {
    if (!data.next_event) {
      return false;
    }

    return fetch(`http://stuff7723.cloudapp.net:8090/api/events/${groupName}/${data.next_event.id}`).then(eventResponse => {
      return eventResponse.json();
    })
    .catch(err => err);
  })
  .catch(err => err);
}
