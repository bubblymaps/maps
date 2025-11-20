# Bubbly Maps

A modern maps app for locating public water fountains locations. https://bubblymaps.org.

## Self host
### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** or other package manager (yarn, pnpm, bun)
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL** database (local or remote)
- **Git**

### Build from source

```bash
git clone https://github.com/bubblymaps/maps
cd maps
docker compose build
```

For easy deployment, use Docker Compose:

1. Edit `docker-compose.yml` with your environment variables
2. Run:

```bash
docker compose up -d
```

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).
