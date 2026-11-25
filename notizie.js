const newsStatus = document.querySelector('#notizie-stato');
const newsList = document.querySelector('#lista-notizie');
const newsCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTT7mjPCODsu9JvUBCJG2lm_aeAbIKtadAxZ0RzoVdmg4L4RnIanlsmNeaxy-eChpmn7EI8itrv8o7y/pub?gid=317082574&single=true&output=csv';

function fetchNews(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const requiredFields = ['titolo', 'link', 'data'];
        if (result.errors.length > 0) {
          reject(new Error(`Impossibile analizzare il CSV delle notizie: ${result.errors[0].message}`));
          return;
        }
        if (!requiredFields.every((field) => result.meta.fields?.includes(field))) {
          reject(new Error('Il CSV delle notizie deve contenere i campi titolo, link e data.'));
          return;
        }
        resolve(result.data);
      },
      error: (error) => {
        const detail = error instanceof Error ? error.message : 'richiesta di rete non riuscita';
        reject(new Error(`Impossibile leggere il CSV delle notizie: ${detail}`));
      },
    });
  });
}

function createNewsItem(news) {
  const date = new Date(news.data);
  const url = new URL(news.link);
  if (
    !news.titolo
    || Number.isNaN(date.getTime())
    || url.protocol !== 'https:'
  ) {
    throw new Error('Una notizia contiene titolo, data o link non validi.');
  }

  const item = document.createElement('li');
  item.className = 'news-item';

  const publishedAt = document.createElement('time');
  publishedAt.className = 'news-date';
  publishedAt.dateTime = date.toISOString();
  publishedAt.textContent = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Rome',
  }).format(date);

  const heading = document.createElement('h3');
  const link = document.createElement('a');
  link.href = url.href;
  link.textContent = news.titolo;
  heading.append(link);

  item.append(publishedAt, heading);
  return item;
}

async function loadNews() {
  try {
    const news = await fetchNews(newsCsvUrl);
    if (news.length === 0) {
      newsStatus.textContent = 'Al momento non ci sono notizie disponibili.';
      return;
    }

    const items = news.slice(0, 5).map(createNewsItem);
    newsList.replaceChildren(...items);
    newsStatus.hidden = true;
  } catch (error) {
    console.error('Errore nel caricamento delle notizie:', error);
    newsList.replaceChildren();
    newsStatus.textContent = 'Notizie momentaneamente non disponibili.';
  }
}

loadNews();
