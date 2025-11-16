# Quick Start Guide - CI/CD Scripts

Welcome! This guide will help you quickly understand and use the CI/CD setup for BubblyMaps.

## What Gets Automated?

### ✅ Every Pull Request
When you create or update a pull request, these checks run automatically:
- **Linting** - Code quality checks
- **Type Checking** - TypeScript validation
- **Build** - Ensures the app builds successfully
- **Security Scans** - Checks for vulnerabilities
- **Auto-Labeling** - Automatically categorizes your PR

### 🚢 Every Push to Main/Develop
- All PR checks (above)
- **Docker Image Build** - Creates a new container image
- **CodeQL Analysis** - Deep security scanning
- **Database Schema Validation** - If Prisma files changed

### 📅 Weekly (Every Monday)
- Security audit of dependencies

## How to Use

### For Contributors

1. **Create a branch** and make your changes
2. **Push your changes** - CI runs automatically
3. **Create a Pull Request** - More checks run
4. **Wait for green checkmarks** ✓ - All checks must pass
5. **Request review** - A maintainer will review your PR

### Viewing CI Results

1. Go to the **Actions** tab in GitHub
2. Click on a workflow run to see details
3. If something fails, click on the failed job to see why

### Common Issues

**Build Fails?**
- Check if you have linting errors: `npm run lint`
- Check TypeScript errors: `npx tsc --noEmit`
- Try building locally: `npm run build`

**Test Locally Before Pushing**
```bash
# Run all the same checks CI will run
npm install
npm run lint
npx tsc --noEmit
npx prisma generate
npm run build
```

## Workflows Overview

| Workflow | When | What |
|----------|------|------|
| CI | Every push/PR | Lint, type-check, build |
| Security | Push/PR + Weekly | Vulnerability scanning |
| Docker | Push to main/develop | Build container images |
| PR Automation | Every PR | Auto-label and organize |
| Database | Schema changes | Validate Prisma changes |

## Labels You'll See

Your PR will automatically get labels like:
- `frontend` - Changed app/components
- `backend` - Changed API routes
- `database` - Changed Prisma schema
- `dependencies` - Changed package.json
- `size/s`, `size/m`, etc. - PR size
- `documentation` - Changed docs

## For Maintainers

### Setting Up Deployment

1. Edit `.github/workflows/deploy.yml`
2. Uncomment your deployment platform section
3. Add required secrets to GitHub Settings > Secrets:
   - For Vercel: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - For AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
   - For Docker: `HOST`, `USERNAME`, `SSH_KEY`

### Enabling Branch Protection

Go to Settings > Branches > Add rule for `main`:
- ✅ Require pull request reviews
- ✅ Require status checks to pass:
  - CI / Lint
  - CI / Type Check
  - CI / Build
- ✅ Require branches to be up to date

### Docker Images

Built images are pushed to GitHub Container Registry:
```
ghcr.io/bubblymaps/maps:latest
ghcr.io/bubblymaps/maps:main
ghcr.io/bubblymaps/maps:develop
```

Pull an image:
```bash
docker pull ghcr.io/bubblymaps/maps:latest
```

## Need Help?

- 📖 Full documentation: `docs/CI-CD.md`
- 🐛 Issues? Open a GitHub issue
- 💬 Questions? Ask in discussions

## Quick Commands

```bash
# Test locally
npm install && npm run lint && npm run build

# Check Prisma schema
npx prisma validate

# Generate Prisma client
npx prisma generate

# Run type check
npx tsc --noEmit
```

---

**Pro Tip**: Keep PRs small (aim for `size/xs` or `size/s` labels) for faster reviews! 🚀
