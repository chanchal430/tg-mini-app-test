# Folk Finance Frontend

This repository contains the **Folk Finance** frontend, built using **React.js** and **JavScript**. The frontend interacts with the **Folk Finance Backend**, providing a seamless user interface for the Folk Finance TG Mini App.

## Prerequisites

- Node.js (v20 or higher recommended)
- npm (v10 or higher)
- A running instance of the **Folk Finance Backend**
- A Telegram Bot created via **BotFather**

## Getting Started

### Clone the repository

```sh
  git clone https://github.com/Folks-Finance/tg-mini-app-frontend-internal.git
  cd tg-mini-app-frontend-internal
```

### Use the main branch

Make sure you're on the **main** branch.

### Install dependencies

Run the following command to install all required dependencies:

```sh
  npm install
```

### Setup the `.env` file in the root folder

Create a `.env` file in the root directory and add the following environment variables:

```env
REACT_APP_API_URL= https://api-folk.defipredictor.com
```

### Setting Up the Telegram Bot

To integrate the Telegram Mini App, follow these steps to create a bot using **BotFather**:

1. Open Telegram and search for `BotFather`.
2. Start a chat and type `/newbot`.
3. Follow the prompts to:
   - Provide a **bot name** (e.g., `FolkFinanceBot`).
   - Choose a **unique username** (e.g., `FolkFinanceMiniBot`).
4. After successful creation, BotFather will provide a **BOT_TOKEN**.
5. Copy the **BOT_TOKEN** and paste it into your `.env` file as `REACT_APP_BOT_TOKEN`.
6. Configure the bot for Mini Apps by running the following command in **BotFather**:
   ```
   /setdomain
   ```
   Then, provide your appUrl for miniApp (e.g., `https://folkfinance.com`).
7. You can now use this bot in the **Folk Finance TG Mini App**.

### Start the development server

Run the following command to start the frontend in development mode:

```sh
  npm start
```

The application will be available at `http://localhost:3000/` by default.

### Build for production

To create a production-ready build, run:

```sh
  npm run build
```

This will generate an optimized build in the `build/` directory.

### Deploying the frontend

To deploy the frontend, upload the contents of the `build/` directory to a hosting provider such as **Vercel, Netlify, Firebase, or AWS S3**.
