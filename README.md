# BubblyMaps

BubblyMaps is a modern web mapping application built with Next.js 16, React 19, and MapLibre GL. This project provides an interactive mapping platform with user authentication, waypoint management, and cloud storage integration.

## Features

- 🗺️ Interactive maps powered by MapLibre GL
- 🔐 Authentication with NextAuth (Google OAuth)
- 📍 Waypoint creation and management
- ☁️ S3-compatible object storage (MinIO)
- 📧 Email notifications via Resend
- 🎨 Modern UI with Radix UI components and Tailwind CSS
- 🌓 Dark/Light theme support
- 🗄️ PostgreSQL database with Prisma ORM

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** or other package manager (yarn, pnpm, bun)
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL** database (local or remote)
- **Git**

## Manual Clone and Build from Master Branch

### 1. Clone the Repository

```bash
git clone https://github.com/bubblymaps/maps.git
cd maps
git checkout master
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it with your values:

```bash
cp .ENV.EXAMPLE .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:pass@host:5432/database_name?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client
GOOGLE_CLIENT_SECRET=your_client_secret
RESEND_API_KEY=your_resend_api_key
API_TOKEN=your_api_token_secret
MINIO_USER="user"
MINIO_PASSWORD="pass"
MINIO_URL="url"
MINIO_BUCKET="bucket_name"
```

### 4. Initialize Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Build the Application

```bash
npm run build
```

### 6. Start the Application

```bash
npm run start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Docker Deployment

### Build the Docker Image

Build the Docker image from the master branch:

```bash
docker build -t bubblymaps/web:latest .
```

### Run with Docker

Run the container with your environment variables:

```bash
docker run -d \
  -p 3000:3000 \
  --name bubblymaps \
  -e DATABASE_URL="postgresql://user:pass@host:5432/database_name?schema=public" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your_secret" \
  -e GOOGLE_CLIENT_ID="your_client" \
  -e GOOGLE_CLIENT_SECRET="your_client_secret" \
  -e RESEND_API_KEY="your_resend_api_key" \
  -e API_TOKEN="your_api_token_secret" \
  -e MINIO_USER="user" \
  -e MINIO_PASSWORD="pass" \
  -e MINIO_URL="url" \
  -e MINIO_BUCKET="bucket_name" \
  bubblymaps/web:latest
```

### Deploy with Docker Compose

For easier deployment, use Docker Compose:

1. Edit `docker-compose.yml` with your environment variables
2. Run:

```bash
docker-compose up -d
```

To stop the deployment:

```bash
docker-compose down
```

To rebuild and restart:

```bash
docker-compose up -d --build
```

### View Logs

```bash
# Docker
docker logs bubblymaps

# Docker Compose
docker-compose logs -f web
```

## Development

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Linting

```bash
npm run lint
```

### Database Management

```bash
# Open Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/types` - TypeScript type definitions

## Technology Stack

- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Component Library:** Radix UI
- **Maps:** MapLibre GL
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL with Prisma ORM
- **Object Storage:** S3-compatible (MinIO)
- **Email:** Resend
- **Deployment:** Docker

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).
