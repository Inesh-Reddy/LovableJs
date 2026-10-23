# Lovable

Lovable is a full-stack application with a Node.js/Express backend and a workspace-based project structure. The repository is set up to make local development straightforward for contributors.

## Project structure

- `server/` - backend service built with TypeScript and Express
- `package.json` - root workspace configuration

## Prerequisites

Before running the project locally, make sure you have the following installed:

- Node.js 18+
- npm

## Local setup

1. Clone the repository
2. Install dependencies from the root:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

This runs the server workspace in watch mode via the workspace script.

## Server setup

The backend lives in the `server` workspace and exposes a basic health endpoint:

- `GET /heath` - returns server health information

To run only the server package manually:

```bash
cd server
npm run dev
```

## Environment variables

The server expects a `.env` file inside the `server` directory. Example:

```env
API_PORT=3000
```

## Scripts

From the project root:

```bash
npm run dev
```

From the server folder:

```bash
npm run dev
npm start
```

## Notes

- The project uses npm workspaces.
- The backend is built with Express + TypeScript + `tsx` for local development.
- Common environment and generated files are ignored via `.gitignore`.
