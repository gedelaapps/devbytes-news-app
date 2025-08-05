# DevBytes News Application

## Overview

DevBytes is a modern tech news aggregation platform that provides curated technology news with AI-powered features. The application focuses on developer-relevant content including AI, programming, startups, cloud computing, cybersecurity, and DevOps. It features article summarization, bookmarking, search functionality, and an AI chat assistant for coding help.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack React Query for server state and local state hooks
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes

### Backend Architecture
- **Server**: Express.js with TypeScript in ESM format
- **API Design**: RESTful API with structured error handling and request logging
- **Storage**: Abstract storage interface with in-memory implementation (IStorage pattern)
- **Development**: Hot module replacement with Vite integration for full-stack development

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Tables**: 
  - `articles` - stores news articles with metadata
  - `summaries` - AI-generated article summaries
  - `bookmarks` - user bookmarks with article references
- **Schema Validation**: Zod schemas generated from Drizzle tables for type safety

### Key Features
- **News Categories**: Filtered content for AI, programming, startups, cloud, cybersecurity, and DevOps
- **Search**: Real-time article search with debounced input
- **AI Integration**: Article summarization and coding chat assistant
- **Bookmarking**: Local storage with API persistence
- **Theme System**: Light/dark mode with system preference detection

## External Dependencies

### News API Integration
- **GNews API**: Primary news source for fetching categorized tech articles
- **Configuration**: Environment-based API key management
- **Category Mapping**: Custom search terms mapped to predefined categories

### AI Services
- **Mistral AI**: Powers article summarization and chat assistant features
- **Use Cases**: 
  - Generate concise article summaries
  - Provide coding assistance and technical support

### Database Services
- **Neon Database**: PostgreSQL database hosting (configured for serverless)
- **Connection**: Environment variable-based connection string
- **Migration**: Drizzle Kit for schema management

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Replit Integration**: Development environment with runtime error overlay
- **TypeScript**: Full type safety across client and server
- **ESBuild**: Production bundling for server code