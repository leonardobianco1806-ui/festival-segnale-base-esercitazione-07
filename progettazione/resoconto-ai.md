# Resoconto del lavoro con l'AI

## Sessione 1

- **Richieste:** creare la scheda dati, completare i JSON di eventi e sedi, generare il programma con `fetch` e aggiungere il meteo di Torino.
- **Modifiche usate:** creati `dati/SCHEMA.md` e `meteo.js`; aggiornati `dati/eventi.json`, `dati/sedi.json`, `programma.html` e `info.html`; creato `programma.js`.
- **Verifiche:** controllati i JSON, i sei eventi, le tre sedi e i riferimenti tra loro; verificato che il programma non contenga schede hardcoded e che usi entrambi i JSON; interrogata l'API Open-Meteo per verificare campi e unità.
- **Problemi e soluzioni:** `SCHEMA.md` inizialmente non risultava nella cartella del repository; verificata l'assenza e ricreato con percorso relativo. Node.js non era disponibile, quindi le verifiche JavaScript sono state statiche.
