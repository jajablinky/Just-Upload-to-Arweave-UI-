# Just A Tip

A tip protocol on Arweave.



## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Deployment**: Arweave via ArX and Permaweb Deploy

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository

```bash
git clone <repo-url> && cd justatip
```

2. Install dependencies

```bash
npm install
```

3. Start the dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Preview the production build

```bash
npm run preview
```

6. Lint the code

```bash
npm run lint
```

7. Deploy to Arweave (ArX)

```bash
# Builds the app and uploads the dist/ directory using ArX
npm run deploy
```

#### Deploy prerequisites
- **ArX CLI** installed and available on your PATH
- **Arweave wallet** JSON saved as `wallet.json` in the project root
- **Host**: uses `https://turbo.ardrive.io` by default; edit the script to change

### Available scripts
- `dev`: Start the Vite dev server.
- `build`: Type-check and build to `dist/`.
- `preview`: Serve the built app locally.
- `lint`: Run ESLint.
- `deploy`: Build, then upload `dist/` via ArX (permaweb-deploy) to Arweave.