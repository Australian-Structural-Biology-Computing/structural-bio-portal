# Structural Bio Portal

A Next.js-based web application for managing and launching structural biology workflows using the Seqera Platform API.

## Features

- Workflow launcher with dynamic form input
- Environment-based configuration
- Built with Next.js, TypeScript, React Hook Form, and Material UI

## Prerequisites

- Node.js v18+
- npm or yarn
- Git

## Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd structural-bio-portal
2. Add a .env.local file to the root directory with the following variables:

   ```
   NEXT_PUBLIC_SEQERA_API_URL=<your-seqera-api-url>
   NEXT_PUBLIC_SEQERA_ACCESS_TOKEN=<your-access-token>
   NEXT_PUBLIC_WORKSPACE_ID=<your-workspace-id>
   NEXT_PUBLIC_COMPUTE_ID=<your-compute-env-id>
   NEXT_PUBLIC_WORK_DIR=<your-work-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser at:
http://localhost:3000

6. Scripts

   ```bash
   npm run dev - Start the development server
   npm run build - Create an optimized production  build
   npm run start - Start the production server
   npm run lint - Run ESLint
   ```
