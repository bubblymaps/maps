# CI/CD Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for the BubblyMaps project.

## Overview

The project uses GitHub Actions for automated testing, building, security scanning, and deployment. The workflows are located in the `.github/workflows/` directory.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Trigger:** Push to `main` or `develop` branches, Pull requests to these branches

**Jobs:**
- **Lint:** Runs ESLint to check code quality
- **Type Check:** Runs TypeScript compiler to check for type errors
- **Build:** Builds the Next.js application and uploads build artifacts

**Usage:** Automatically runs on every push and pull request. Ensures code quality before merging.

### 2. Security Workflow (`security.yml`)

**Trigger:** Push to `main` or `develop`, Pull requests, Weekly schedule (Mondays at 9 AM UTC)

**Jobs:**
- **Dependency Review:** Reviews dependencies for security vulnerabilities (PRs only)
- **NPM Audit:** Runs npm audit to check for known vulnerabilities
- **CodeQL Analysis:** Performs automated security scanning using GitHub's CodeQL

**Usage:** Helps maintain security by scanning for vulnerabilities in code and dependencies.

### 3. Docker Build Workflow (`docker.yml`)

**Trigger:** Push to `main` or `develop`, Tags starting with `v*`, Pull requests to `main`

**Jobs:**
- **Build and Push:** Builds Docker image and pushes to GitHub Container Registry
- **Vulnerability Scan:** Scans the built image using Trivy

**Features:**
- Multi-architecture support (amd64, arm64)
- Automatic tagging based on branch/tag/PR
- Docker layer caching for faster builds
- Security scanning with Trivy

**Usage:** Automatically builds and publishes Docker images when code is pushed.

### 4. PR Automation Workflow (`pr-automation.yml`)

**Trigger:** Pull request events (opened, reopened, synchronize, labeled)

**Jobs:**
- **Auto Label:** Automatically labels PRs based on changed files
- **Size Label:** Adds size labels (xs, s, m, l, xl) based on number of changes
- **Welcome:** Welcomes first-time contributors
- **PR Checks:** Validates PR title follows conventional commit format

**Usage:** Improves PR management by automatically organizing and categorizing pull requests.

### 5. Database Workflow (`database.yml`)

**Trigger:** Changes to Prisma schema or migrations

**Jobs:**
- **Validate Schema:** Validates Prisma schema syntax and format
- **Check Migrations:** Checks migration consistency

**Usage:** Ensures database schema changes are valid before merging.

### 6. Deploy Workflow (`deploy.yml`)

**Trigger:** Push to `main` branch (manual trigger also available)

**Status:** Template - needs configuration for Docker deployment

**Usage:** Uncomment and configure for your Docker deployment needs

## Configuration Files

### `.github/labeler.yml`

Configures automatic labeling for pull requests based on file patterns:
- `dependencies` - package.json changes
- `documentation` - markdown files
- `frontend` - app/components changes
- `backend` - API routes changes
- `database` - Prisma files
- `docker` - Docker files
- `ci/cd` - GitHub Actions workflows
- `styles` - CSS files
- `typescript` - TypeScript files
- `configuration` - Config files

## Environment Variables

The CI workflows use test environment variables. For production deployment, configure these secrets in GitHub:

### Required for CI (automatically provided):
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

### Required for Docker Registry:
- `GITHUB_TOKEN` - Used for pushing to GitHub Container Registry (automatically provided)

### Required for Deployment (configure in GitHub Secrets):
For Docker deployment, you need:
- `HOST` - Server hostname or IP address
- `USERNAME` - SSH username for server access
- `SSH_KEY` - Private SSH key for authentication

## Setting Up CI/CD

### 1. Enable Workflows
All workflows are enabled by default once merged to the main branch.

### 2. Configure Branch Protection
Recommended branch protection rules for `main`:
- Require pull request reviews before merging
- Require status checks to pass before merging
  - CI / Lint
  - CI / Type Check
  - CI / Build
- Require branches to be up to date before merging
- Include administrators

### 3. Configure Deployment
To enable Docker deployment:
1. Uncomment the `deploy-docker` job in `deploy.yml`
2. Add required secrets to GitHub repository settings (HOST, USERNAME, SSH_KEY)
3. Update the deployment script path in the workflow
4. Test the deployment workflow

### 4. Monitor Workflows
- View workflow runs in the "Actions" tab of your GitHub repository
- Failed workflows will send notifications to commit authors
- Security findings appear in the "Security" tab

## Local Development

You can test the build locally before pushing:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run type check
npx tsc --noEmit

# Generate Prisma Client
npx prisma generate

# Build the application
npm run build
```

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Ensure Prisma schema is valid: `npx prisma validate`
- Clear cache and reinstall: `rm -rf .next node_modules && npm install`

### Docker Build Issues
- Verify Dockerfile syntax
- Check that build context includes all necessary files
- Review Docker build logs in Actions tab

### Security Scan Failures
- Review the Security tab for vulnerability details
- Update vulnerable dependencies: `npm audit fix`
- For false positives, use CodeQL suppressions

## Best Practices

1. **Always create pull requests** - Never push directly to `main`
2. **Keep PRs small** - Aim for xs or s size labels
3. **Write descriptive commit messages** - Follow conventional commits format
4. **Wait for CI to pass** - Don't merge failing PRs
5. **Review security findings** - Address vulnerabilities promptly
6. **Keep dependencies updated** - Run `npm update` regularly

## Contributing

When adding new workflows:
1. Document the workflow purpose in this file
2. Use descriptive job and step names
3. Add appropriate triggers
4. Test the workflow on a feature branch first
5. Consider adding the workflow to branch protection rules

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js CI/CD Guide](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Prisma CI/CD](https://www.prisma.io/docs/guides/deployment/deployment-guides)
