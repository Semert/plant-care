# Plant Care Client

Frontend for the Plant Care monitoring application.

## Technologies

- React with TypeScript
- Redux Toolkit and Redux Observable
- Material-UI components
- Recharts for data visualization
- React Router

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create `.env` file in the root directory:

   ```
   REACT_APP_API_URL=URL/api
   ```

3. Run development server:

   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Features

- Dashboard with plant health overview
- Household management
- Plant monitoring and tracking
- Historical health data visualization
- Search and filtering
- Responsive design

## Folder Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Application pages
- `/src/store` - Redux state management
- `/src/store/slices` - Redux Toolkit slices
- `/src/store/epics` - Redux Observable epics
- `/src/services` - API and utility services
- `/src/types` - TypeScript type definitions
