# DevBytes - Developer Tech News Aggregator

A modern tech news aggregation platform built with React and Express.js, featuring AI-powered summaries and a coding chat assistant.

## Features

- **Tech News Aggregation**: Curated news from GNews API covering AI, programming, startups, cloud, cybersecurity, and DevOps
- **AI-Powered Summaries**: Generate TL;DR summaries using Mistral AI
- **Coding Chat Assistant**: Interactive AI assistant for programming questions
- **Article Bookmarking**: Save interesting articles for later reading
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Smart Caching**: Intelligent rate limiting and caching to optimize API usage

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **State Management**: TanStack React Query
- **Routing**: Wouter (lightweight React Router alternative)
- **APIs**: GNews API, Mistral AI API
- **Storage**: In-memory storage with local storage for bookmarks

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devbytes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file or set environment variables:
   ```
   GNEWS_API_KEY=your_gnews_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## API Keys

- **GNews API**: Sign up at [gnews.io](https://gnews.io) for free news API access
- **Mistral AI**: Get your API key at [console.mistral.ai](https://console.mistral.ai) for AI features

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and API client
│   │   └── pages/        # Page components
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared types and schemas
└── components.json       # Shadcn/ui configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Deployment

This app is designed to be deployed on platforms like:
- **Replit Deployments** (recommended)
- **Vercel** 
- **Netlify**
- **Railway**
- **Render**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details