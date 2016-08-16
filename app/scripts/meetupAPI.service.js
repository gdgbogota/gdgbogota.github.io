/* global fetch */
/* eslint no-unused-vars: 0 */

'use strict';

/**
 * Usa un API personalizada para obtener datos de meetup.com.
 * @param {string} groupName Nombre del grupo para consultar.
 * @return {object} Una promesa.
 */
function meetupAPIService(groupName) {
  return fetch(`https://diegocoy.com/meetup/events/${groupName}/`).then(response => {
    return response.json();
  })
  .then(data => {
    if (!data.next_event) {
      return false;
    }

    return fetch(`https://diegocoy.com/meetup/events/${groupName}/${data.next_event.id}`).then(eventResponse => {
      return eventResponse.json();
    })
    .catch(err => err);
  })
  .catch(err => err);
}
