# Scheda dati

## Entità e campi

### Evento

| Campo | Tipo | Esempio |
|---|---|---|
| `id` | numero intero | `1` |
| `titolo` | stringa | `"Lettere in movimento"` |
| `data` | stringa (formato `AAAA-MM-GG`) | `"2026-06-12"` |
| `orario` | stringa (formato `HH:MM`) | `"10:00"` |
| `categoria` | stringa | `"Incontro"` |
| `descrizione` | stringa | `"Come cambia un messaggio quando cambiano le lettere?"` |
| `immagine` | stringa (percorso del file) | `"assets/lettere-in-movimento.svg"` |
| `immagine_alt` | stringa | `"Lettere geometriche disposte su una griglia"` |
| `sede_id` | numero intero | `1` |

### Sede

| Campo | Tipo | Esempio |
|---|---|---|
| `id` | numero intero | `1` |
| `nome` | stringa | `"Officina Nord — Sede centrale"` |
| `indirizzo` | stringa | `"Corso Duca degli Abruzzi 24, Torino"` |

## Chiavi e relazione

`Evento.id` e `Sede.id` sono le chiavi primarie: sono numeriche, univoche all'interno della rispettiva entità e stabili. Una sede può ospitare più eventi; ogni evento si svolge in una sede. `Evento.sede_id` fa riferimento a `Sede.id`.

## Quantità

Il dataset completo comprende sei eventi e tre sedi.

## Aggiornamento e pubblicazione

Chi cura il sito aggiorna gli eventi in `eventi.json` e le sedi in `sedi.json` nella repository, mantenendo gli ID e i riferimenti tra gli eventi e le sedi. Le modifiche vengono pubblicate aggiornando la repository e la relativa GitHub Pages.

## Contenuto della pagina

La pagina Programma mostra le schede degli eventi con titolo, data, orario, categoria, descrizione e immagine, insieme al nome della sede associata.

## Schema Evento–Sede

```mermaid
erDiagram
    SEDE ||--o{ EVENTO : ospita
    SEDE {
        int id PK
        string nome
        string indirizzo
    }
    EVENTO {
        int id PK
        string titolo
        string data
        string orario
        string categoria
        string descrizione
        string immagine
        string immagine_alt
        int sede_id FK
    }
```
