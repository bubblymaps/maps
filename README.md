# Bubbly Maps

Bubbly Maps is a modern web mapping application built with Next.js 16, React 19, and MapLibre GL specifically designed to map and track Water Bubbler locations. Find the official website at https://bubblymaps.org!

## App Features

- 🗺️ Interactive maps powered by MapLibre GL
- 🔐 Authentication with NextAuth (via Google OAuth)
- 📍 Waypoint creation and management
- ☁️ S3-compatible object storage (via MinIO)
- 📧 Email notifications via Resend
- 🎨 Modern UI with Radix UI components and Tailwind CSS
- 🌓 Dark/Light theme support
- 🗄️ PostgreSQL database with Prisma ORM

## Technology Stack

- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 & Shadcn/ui
- **Component Library:** Radix UI
- **Maps:** MapLibre GL
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL with Prisma ORM
- **Object Storage:** S3-compatible (MinIO)
- **Email:** Resend
- **Deployment:** Docker

## Self host
### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** or other package manager (yarn, pnpm, bun)
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL** database (local or remote)
- **Git**

### Run with Docker

Build the container:

```bash
git clone https://github.com/bubblymaps/maps
cd maps
docker compose build
```

### Deploy with Compose

For easier deployment, use Docker Compose:

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
