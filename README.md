# Habit Tracker PWA

A simple, offline-first habit tracking Progressive Web App built with React, TypeScript, and Vite.

## Features

- ✅ Create and manage daily habits
- 📱 Progressive Web App (installable)
- 🔄 Offline-first with local storage
- 🎨 Clean, responsive design
- ♿ Accessible interface

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/BuffariniDany/HabitTracker.git
cd HabitTracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

**Live Demo**: [https://buffarinidany.github.io/HabitTracker/](https://buffarinidany.github.io/HabitTracker/)

## Architecture

The project follows domain-driven design principles:

```
src/
├── domains/
│   ├── habits/          # Habit management domain
│   │   ├── components/  # React components
│   │   ├── business/    # Business logic
│   │   ├── data/       # Data persistence
│   │   └── types.ts    # TypeScript types
│   └── ...
├── shared/             # Shared utilities
└── app/               # App-level components
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin + Workbox
- **Storage**: localStorage (upgrading to IndexedDB)
- **Styling**: CSS3 with responsive design
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.