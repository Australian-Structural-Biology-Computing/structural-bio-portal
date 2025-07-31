# Structural Bio Portal

A Next.js-based web application for managing and launching structural biology workflows using the Seqera Platform API.

## Features

- Workflow launcher with dynamic form input
- [NCI GADI HPC](https://opus.nci.org.au/spaces/Help/pages/236880325/Gadi+User+Guide) configuration
- Built with Next.js, TypeScript, React Hook Form, and Material UI
- Implemented with [SEQERA API](https://docs.seqera.io/platform-cloud/api/overview)

## Prerequisites

- Node.js v18+
- npm or yarn
- Git
- SEQERA access token at Biocommons workspace
- NCI account
- GADI access
- Agent connection ID provided by workspace admin

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Australian-Structural-Biology-Computing/structural-bio-portal.git
   cd structural-bio-portal

2. Add a .env file to the root directory with the following variables:

   ```.env
   SEQERA_ACCESS_TOKEN=<your-seqera-token>
   SEQERA_API_URL=https://seqera.services.biocommons.org.au/api
   COMPUTE_ID=<your-compute-env-id>
   WORK_DIR=<your-work-directory>
   WORKSPACE_ID=<your-workspace-id>
   AWS_REGION=ap-southeast-2
   S3_URL=<s3-bucket-storing-output>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up tower agent on GADI
   Tower agent should be active on host HPC (NCI GADI in this state). Please set up your tower agent as below:

   ```bash
   export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
   curl -fSL https://github.com/seqeralabs/tower-agent/releases/latest/download/tw-agent-linux-x86_64 > tw-agent
   chmod +x tw-agent
   ./tw-agent <agent-connection-ID> -u https://seqera.services.biocommons.org.au/api --work-dir=<path-to-your-target-work-dir>
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser at:
http://localhost:3000

7. Related scripts

   ```bash
   npm run dev - Start the development server
   npm run build - Create an optimized production  build
   npm run start - Start the production server
   npm run lint - Run ESLint
   ```
