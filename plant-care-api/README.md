# Plant Care API

Backend API for the Plant Care monitoring application.

## Technologies

- Node.js with Express
- TypeScript
- MongoDB
- Open-Meteo Weather API integration

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create `.env` file in the root directory:

   ```
   PORT=5000
   MONGODB_URI=URL
   NODE_ENV=development
   ```

3. Run development server:

   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   npm start
   ```

## API Endpoints

### Households

- `GET /api/households` - Get all households
- `GET /api/households/:id` - Get a specific household
- `POST /api/households` - Create a household
- `PUT /api/households/:id` - Update a household
- `DELETE /api/households/:id` - Delete a household

### Plants

- `GET /api/plants` - Get all plants
- `GET /api/plants/household/:householdId` - Get plants for a household
- `GET /api/plants/:id` - Get a specific plant
- `POST /api/plants` - Create a plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant

### Plant Health

- `GET /api/health/plant/:plantId` - Get health records for a plant
- `GET /api/health/plant/:plantId/range` - Get health with date range
- `POST /api/health/plant/:plantId/update` - Update health for a plant
- `POST /api/health/update` - Update health for all plants
