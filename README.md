# MultiSelect Test Task

This is a monorepo project containing a SvelteKit frontend and Express.js backend implementation of a multiselect component with drag-and-drop functionality.

## Implemented Features

- [x] Basic list interaction with pagination (20 items per page)
- [x] Search and filtering functionality
- [x] Multiple item selection with checkboxes
- [x] Drag and drop sorting
- [x] Server synchronization
- [x] Mobile-friendly interface
- [x] Error handling and offline support
- [x] Performance optimization (debounced search, efficient updates)

## Documentation

The `docs` folder contains comprehensive documentation:

- `Technical Design Documentation.md` - System architecture and technical specifications
- `Use Cases.md` - Detailed user scenarios and interactions
- `Testing.md` - Testing strategy and scenarios
- `SSR.md` - Server-side rendering implementation details
- `Code Review.md` - Code review guidelines and standards
- `Index.md` - Documentation overview and navigation

## Requirements

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- Node.js 18+ (for development tools)

## Project Structure

```
apps/
  ├── frontend/  # SvelteKit application
  └── backend/   # Express.js API server
```

## Setup & Installation

1. Clone the repository
2. Install dependencies for both applications:

```bash
# Install frontend dependencies
cd apps/frontend
bun install

# Install backend dependencies
cd ../backend
bun install
```

## Running the Applications

### Backend

```bash
cd apps/backend
bun run index.ts
```

The backend server will start on `http://localhost:3000`

### Frontend

```bash
cd apps/frontend
bun run dev
```

The frontend development server will start on `http://localhost:5173`

## Testing

The project includes end-to-end tests using Playwright.

To run the tests:

```bash
cd apps/frontend
bun run test
```

## Development Scripts

### Frontend

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run end-to-end tests
- `bun run lint` - Run ESLint and Prettier checks
- `bun run format` - Format code with Prettier

### Backend

- `bun run index.ts` - Start the backend server

## Technologies Used

### Frontend
- SvelteKit
- TailwindCSS
- DND-kit (drag-and-drop functionality)
- Playwright (testing)

### Backend
- Express.js
- Zod (validation)
- Winston (logging)
- Cors
- Express Rate Limit
