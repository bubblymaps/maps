# Bubbly Maps

A maps app for locating public water fountains locations. https://bubblymaps.org.

### Website Terms

https://bubblymaps.org/terms

### Website Privacy Policy

https://bubblymaps.org/privacy

# Self host

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

## Documentation

- [API Documentation](docs/API.md) - Comprehensive guide to all API endpoints, authentication, headers, and request/response formats
- [XP System](docs/XP-SYSTEM.md) - Details about the experience points system
- [CI/CD](docs/CI-CD.md) - Continuous integration and deployment information

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).
