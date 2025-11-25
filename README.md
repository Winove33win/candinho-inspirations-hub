# Welcome to your Winove project

## Project info

**URL**: https://winove.dev/projects/80af99a0-9a42-4774-821e-5680d3e409c6

## How can I edit this code?

There are several ways of editing your application.

**Use Winove**

Simply visit the [Winove Project](https://winove.dev/projects/80af99a0-9a42-4774-821e-5680d3e409c6) and start prompting.

Changes made via Winove will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Winove.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Winove](https://winove.dev/projects/80af99a0-9a42-4774-821e-5680d3e409c6) and click on Share -> Publish.

## Deploying on a Node.js host (e.g. Plesk)

The repo now includes a minimal `server.js` that serves the built Vite assets from the `dist` folder. This is useful for platforms such as Plesk that expect a startup file.

1. Install dependencies and build the static assets:
   ```sh
   npm ci
   npm run build
   ```
2. Start the production server locally with:
   ```sh
   npm run start
   ```
   The server respects the `PORT` environment variable (falls back to `4173`).
3. On Plesk (or similar hosts):
   - Set **Application Root** to the project folder.
   - Set **Document Root** to `dist` (created after the build step).
   - Set **Startup File** to `server.js` and **Application Mode** to `production`.
   - Ensure a `PORT` environment variable is configured if your host requires a specific port.
   - Reinstall dependencies (`npm ci`) and run the build command once, then restart the app.

## Can I connect a custom domain to my Winove project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.winove.dev/features/custom-domain#custom-domain)
