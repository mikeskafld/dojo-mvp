# Phase 1 Implementation Guide: MVP with AI-Ready Architecture

## Overview
This guide provides step-by-step instructions for implementing Phase 1 of the Dojo MVP while preparing the architecture for future AI integration.

## Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account
- Vercel account (for deployment)

---

## Step 1: Create Monorepo Structure

### 1.1 Initialize New Monorepo
```bash
# Create new directory
mkdir ../dojo-monorepo
cd ../dojo-monorepo

# Initialize with Turborepo
npx create-turbo@latest . --package-manager pnpm --example basic

# Clean up example files
rm -rf apps/docs apps/web packages/ui packages/eslint-config packages/typescript-config
```

### 1.2 Create Proper Directory Structure
```bash
# Create apps
mkdir -p apps/web apps/ai-worker

# Create packages
mkdir -p packages/database packages/shared packages/ui

# Create placeholder files
touch apps/ai-worker/.gitkeep
```

### 1.3 Root Configuration Files

```json
// package.json
{
  "name": "dojo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "latest",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@8.0.0"
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
``` 