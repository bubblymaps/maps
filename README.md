# Bubbly Maps

A maps app for locating public water fountains locations. Access it [here](https://bubblymaps.org)!

# Self host

### Prerequisites

- Postgresql
- Node.js >= 24.1.0
- npm >= 11.3.0
- Docker >= 28.5.2
- Minio

### Build from source

1. Run the following commands to build from source
```bash
git clone https://github.com/bubblymaps/maps
cd maps
docker compose build
```

2. Edit `docker-compose.yml` with your environment variables
3. Start using docker:

```bash
docker compose up -d
```

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).

## License

See [LICENSE](LICENSE) file for details.
