/* global fetch */
/* eslint no-unused-vars: 0 */

'use strict';

/**
 * Consulta un archivo JSON para obtener infoamción acerca de los organizadores.
 * @return {object} Una promesa.
 */
function organizersService() {
  return fetch(`./organizers.json`).then(response => {
    return response.json();
  });
}
