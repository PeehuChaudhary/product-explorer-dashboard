# Product Explorer Dashboard

A responsive React dashboard that fetches product information from the public DummyJSON API.

## Features
- Fetches product data from a public REST API
- Search by product name, brand, or description
- Filter by category and minimum rating
- Sort by price, rating, and name
- Loading, error, and no-results states
- Responsive product cards and summary statistics
- API source attribution in the footer

## Tech stack
- React
- JavaScript
- CSS
- Vite
- DummyJSON public API

## Run locally

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open the terminal in the project folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown in the terminal (usually http://localhost:5173).

## Build for deployment

```bash
npm run build
```

Vite creates a `dist` folder. Deploy that folder using a static hosting service such as Vercel or Netlify. For a Vercel deployment, import the project repository and keep the build command as `npm run build` and output directory as `dist`.

## API and attribution

API: [DummyJSON Products](https://dummyjson.com/docs/products)  
Endpoint used: `https://dummyjson.com/products?limit=0`

DummyJSON provides sample/fake data for development and demonstration. Product prices, stock and ratings in this project are not a real shopping catalogue.

## Project structure

```text
product-explorer-dashboard/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Data flow

1. `App` loads when the page opens.
2. `useEffect` calls `loadProducts()`.
3. `fetch()` requests product data from DummyJSON.
4. The response is checked and saved in React state.
5. Search, category, rating and sorting controls update their own state.
6. `useMemo` derives the visible product list from the fetched data and selected controls.
7. The UI displays loading, error, empty, or product-card states.

## Before submitting

- Run `npm install` and `npm run dev`.
- Test search with a word such as `phone`.
- Change the category and sorting dropdowns.
- Test the empty state with a search that has no match.
- Resize the browser to check the mobile layout.
- Deploy the project and paste your live URL into your submission.
