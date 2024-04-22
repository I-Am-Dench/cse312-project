# Boardunity - Jessefanclub

Check out the site here: [https://rossien.com](https://rossien.com)

## Running

The `Dockerfile` contains two build stages: **dev** and **prod**. Both stages setup the Flask environment variables, install python requirements, install node dependencies, and build the application's frontend. The only exception is the `CMD` directive:

- **dev**: Runs the server with the default `flask` program.
- **prod**: Installs the `waitress` program and uses it to run the server in a production environment.

While you could just change the build target in the `docker-compose.yml` from **dev** to **prod**, for convenience, `docker-compose.prod.yml` already has this changed.

### Run dev

```bash
docker compose up
```

### Run prod

```bash
docker compose -f docker-compose.prod.yml up
```

## Stack

- Fontend: React + Vite
- Backend: Flask + MongoDB