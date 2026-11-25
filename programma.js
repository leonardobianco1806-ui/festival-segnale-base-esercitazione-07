const eventGrid = document.querySelector('#event-grid');
const programStatus = document.querySelector('#programma-stato');

const eventCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTT7mjPCODsu9JvUBCJG2lm_aeAbIKtadAxZ0RzoVdmg4L4RnIanlsmNeaxy-eChpmn7EI8itrv8o7y/pub?gid=385698909&single=true&output=csv';
const venueCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTT7mjPCODsu9JvUBCJG2lm_aeAbIKtadAxZ0RzoVdmg4L4RnIanlsmNeaxy-eChpmn7EI8itrv8o7y/pub?gid=954334914&single=true&output=csv';

function fetchCsv(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(new Error(`Impossibile analizzare il CSV ${url}: ${result.errors[0].message}`));
          return;
        }
        resolve(result.data);
      },
      error: (error) => reject(new Error(`Impossibile leggere il CSV ${url}: ${error.message}`)),
    });
  });
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
      fetchCsv(eventCsvUrl),
      fetchCsv(venueCsvUrl),
    ]);

    if (!Array.isArray(events) || !Array.isArray(venues)) {
      throw new Error('I CSV devono contenere una riga di intestazione e righe di dati.');
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
