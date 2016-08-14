/* global meetupAPIService, organizersService, google */
/* eslint max-len: [1, 130] */
/* eslint-env browser */

(function() {
  'use strict';

  const groupName = 'gdgbogota';

  meetupAPIService(groupName).then(data => {
    if (Boolean(data)) {
      showNextEvent(data);
    }
  });

  showOrganizers();

  /**
   * Muestra los datos del siguiente evento.
   * @param {object} eventObj El objeto del evento.
   */
  function showNextEvent(eventObj) {
    // Referencias a elementos del DOM
    const nextEventContainer = document.querySelector('.next-event-container');
    const eventDescrTitle = document.querySelector('.event-description>h3');
    const eventDescrText = document.querySelector('.event-description>p');
    const eventSpeaker = document.querySelector('.event-description>.event-speaker');

    // Expresiones regulares para obtener el texto deseado a partir de la descripción del evento
    const speakerRegex = new RegExp(/([Aa] cargo|[Aa] cargo de|speaker|[Oo]rador|[Pp]or)(?:\:\s)(.+)(?=[.,;_\-()\n\b]\s)/g);
    const descrTextRegex = new RegExp(/(<p>(?!<)).+?(?=<)/g);

    // Escritura sobre elementos del DOM
    eventDescrTitle.innerText = eventObj.name;
    eventDescrText.innerHTML = eventObj.description.match(descrTextRegex)[0];
    eventSpeaker.innerText = eventObj.description.match(speakerRegex);

    nextEventContainer.style.display = 'block';

    initMap(eventObj.venue.lat, eventObj.venue.lon, eventObj.name);
  }

  /**
   * Inicia el mapa.
   * @param {int} lat Latitud del lugar del en donde se realizará evento.
   * @param {int} lng Longitud del lugar del en donde se realizará evento.
   * @param {string} eventName El nombre del evento, se mostrará como tooltip en el marcador (opcional).
   */
  function initMap(lat, lng, eventName) {
    // Mapa centrado sobre el lugar del evento
    let map = new google.maps.Map(document.getElementById('map-container'), {
      center: {lat: lat, lng: lng},
      zoom: 16
    });

    // Marcador del lugar del evento
    new google.maps.Marker({ // eslint-disable-line
      position: {lat: lat, lng: lng},
      map: map,
      title: eventName || 'Lugar del evento'
    });
  }

  /**
   * Obtiene la lista de organizadores y creea un elemento del DOM para cada uno.
   */
  function showOrganizers() {
    let organizersSection = document.querySelector('.organizers');
    organizersSection.style.display = 'none';

    organizersService().then(data => {
      data.forEach(o => {
        let organizersContainer = document.querySelector('.organizers-container');

        let organizerElement = document.createElement('a');
        let organizerImg = document.createElement('img');
        let organizerName = document.createElement('h3');

        const urlRegExp = (/(^(?:(http|https):|([Ww]{3}))\.)|(?:\w+\.)(\w{2,4})\/.+/g);
        let isRemotePic = Boolean(o.pic.match(urlRegExp));

        organizerElement.classList.add('organizer');
        organizerImg.classList.add('organizer-pic');
        organizerName.classList.add('organizer-name');

        organizerElement.setAttribute('href', o.social.filter(e => e.network === o.linkTo)[0].url || '#');
        organizerImg.setAttribute('src', (isRemotePic ? o.pic : `./images/${o.pic}`));
        organizerImg.alt = o.name;
        organizerImg.setAttribute('aria-label', `Foto de ${o.name}`);
        organizerName.innerText = o.name;
        organizerName.setAttribute('aria-label', o.name);

        organizerElement.appendChild(organizerImg);
        organizerElement.appendChild(organizerName);

        organizersContainer.appendChild(organizerElement);
      });
    });

    organizersSection.style.display = 'block';
  }
})();

