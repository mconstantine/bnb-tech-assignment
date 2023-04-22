# Sample application

## Server

### Installation

- `cd server`
- `yarn`
- `yarn start`

The application will throw errors for environment variables it can't find. Here is the environment it expects, with some random values:

```
SERVER_PORT=5000
DB_LOGGING=false
```

### Scripts

- `yarn build` to compile TypeScript into JavaScript
- `yarn serve` to serve the build
- `yarn seedDatabase` to throw some mock data into the database
- `yarn test` is a proxy to Jest (so for example, `yarn test --watch` runs the tests in watch mode)

> **Note**: `yarn seedDatabase` compiles the application in development mode, so don't use the build from it for production.

## Client

### Installation

- `cd client`
- `yarn`
- `yarn dev`

Again, the application will throw errors for environment variables it can't find.

`VITE_MOCK_CUSTOMER_ID` should be the ID of the customer created during `seedDatabase` (see server scripts). If you call `seedDatabase` more than one without deleting the folder at `server/data`, you will get incrementing IDs.

`VITE_API_URL` should match the API URL and server port.

```
VITE_MOCK_CUSTOMER_ID=1
VITE_API_URL="http://localhost:5000"
```

### Scripts

- `yarn dev` for development
- `yarn build` builds the application
- `yarn lint` for linting, since Vite does not expose lints nor TypeScript compilation errors
- `yarn test` launches Cypress without a browser. You need to have both the server and client running
- `yarn test-open` launches Cypress with a browser You need to have both the server and client running

> **Note**: If you experience the Cypress test failing, ensure that Vite is running on port 5173. If it's not, you can change Cypress' configuration at `client/cypress.config.json`.

## Application interesting features

- States are handled so that the UI is disabled when needed (e.g.: during network requests)
- The backend validates any data that comes through the network with `Zod`
- The `NetworkList` component handles any list with attached network requests, with sublists. It's a little bit complex, could probably be simplified in time

### Tentative todo list

- Product minimum quantity is one so there is no need to remove orders. If order could be added and removed, it would probably trigger a deletion if the quantity was set to zero
- Use server side rendering, moving the api behind a `/api` namespace
- Share common interfaces between client and server (inputs, models)
- Use codecs on frontend (`Zod` or `io-ts`/`schema`), to validate API data and transform data (e.g.: ISO strings to Dates)
- Make a pretty loader and error panel, use it instead of "Loading…" text
- Make a Button component
- Use an actual router
- Implement unit testing on server (Jest is already installed)
