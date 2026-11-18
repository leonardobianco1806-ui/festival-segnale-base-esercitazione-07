const eventGrid = document.querySelector('#event-grid');
const programStatus = document.querySelector('#programma-stato');

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Impossibile leggere ${path}: ${response.status}`);
  }
  return response.json();
}

function formatEventDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  const formatted = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return formatted.charAt(0).toLocaleUpperCase('it-IT') + formatted.slice(1);
}

function createEventCard(event, venueById) {
  const card = document.createElement('article');
  card.className = 'event-card';

  const image = document.createElement('img');
  image.src = event.immagine;
  image.alt = event.immagine_alt;
  image.width = 900;
  image.height = 600;

  const body = document.createElement('div');
  body.className = 'event-body';

  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = `${formatEventDate(event.data)} · ${event.orario} · ${event.categoria}`;

  const title = document.createElement('h3');
  title.textContent = event.titolo;

  const description = document.createElement('p');
  description.textContent = event.descrizione;

  const place = document.createElement('p');
  place.className = 'event-place';
  const placeLabel = document.createElement('strong');
  placeLabel.textContent = 'Sede: ';
  place.append(placeLabel, venueById.get(event.sede_id) || 'Sede da definire');

  body.append(meta, title, description, place);
  card.append(image, body);
  return card;
}

async function loadProgram() {
  try {
    const [events, venues] = await Promise.all([
      fetchJson('dati/eventi.json'),
      fetchJson('dati/sedi.json'),
    ]);

    if (!Array.isArray(events) || !Array.isArray(venues)) {
      throw new Error('I file dei dati devono contenere elenchi JSON.');
    }

    if (events.length === 0) {
      programStatus.textContent = 'Al momento non ci sono eventi in programma.';
      return;
    }

    const venueById = new Map(venues.map((venue) => [venue.id, venue.nome]));
    const cards = events.map((event) => createEventCard(event, venueById));
    eventGrid.replaceChildren(...cards);
    programStatus.hidden = true;
  } catch (error) {
    console.error('Errore nel caricamento del programma:', error);
    eventGrid.replaceChildren();
    programStatus.textContent = 'Programma attualmente non disponibile';
  }
}

loadProgram();
