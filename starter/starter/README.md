# items-api — starter kolokwium

REST API z dwoma endpointami, w Node.js + Express, z bazą Postgres.

## Endpointy

| Method | Path | Opis |
|---|---|---|
| GET | `/health` | sprawdzenie żywotności (zwraca `{"status":"ok"}`) |
| GET | `/items` | lista wszystkich items |
| POST | `/items` | tworzy nowy item; body: `{"name":"..."}` |

## Konfiguracja przez zmienne środowiskowe

| Zmienna | Domyślnie |
|---|---|
| `PORT` | `3000` |
| `PGHOST` | `db` |
| `PGPORT` | `5432` |
| `PGUSER` | `postgres` |
| `PGPASSWORD` | `postgres` |
| `PGDATABASE` | `items` |

Aplikacja **sama tworzy tabelę** `items` przy starcie (`CREATE TABLE IF NOT EXISTS`).

## Skrypty npm

- `npm start` — uruchamia serwer.
- `npm test` — uruchamia testy (`node --test`, bez DB).
- `npm run lint` — uruchamia `scripts/lint.sh`.
- `npm run build` — kopiuje `src/` do `dist/`.

## Co masz do zrobienia (patrz: treść kolokwium)

1. `Dockerfile` dla aplikacji.
2. `docker-compose.yml` z dwoma serwisami: `app` + `db` (Postgres).
3. `.github/workflows/ci.yml` z trzema jobami `lint → test → build` (bez Dockera).

## Smoke test (po napisaniu Dockerfile i compose)

```bash
docker compose up -d --build
sleep 5
curl http://localhost:3000/health
curl -X POST -H 'Content-Type: application/json' -d '{"name":"apple"}' http://localhost:3000/items
curl http://localhost:3000/items
docker compose down
```
