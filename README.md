# Amazon Product Scraper

This is a simple scraper to extract Amazon product data using **ScraperAPI** to bypass IP blocks and **JSDOM** to parse the HTML page and extract the requested information from the sign-up form (title, ratings, number of reviews, and image URL).

## Features

- The frontend asks for a search keyword (e.g., "laptop").
- The backend performs scraping on Amazon and extracts the product information from the search results page.
- The frontend displays the extracted data (product title, rating, number of reviews, and image).

## Technologies Used

- **Backend (Node.js with Express)**: Handles requests and scraping.
- **ScraperAPI**: Bypasses IP blocks and scrapes Amazon.
- **JSDOM**: Simulates browser behavior to extract data from the HTML page.
- **CORS**: Allows requests between the frontend and backend.
- **Frontend (Vanilla JavaScript and Vite)**: User interface for interaction.

**Note:** The backend was set up using **Node.js with Express** and **Bun**.

## How to Run the Project

### Prerequisites

Make sure you have **Node.js** and **Bun** installed on your machine. If not, install the latest version from [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/).

### Steps to Run

#### 1. Backend Configuration (API)

1. Clone the repository.

2. Install the backend dependencies:

    ```bash
    bun install
    ```

3. Install the **`cors`** package to allow CORS on the backend:

    ```bash
    bun add cors
    ```

4. **Note:** While it is **not recommended**, I have left the API key in the file for the convenience of the HR team.

5. Start the backend server:

    ```bash
    bun server.js
    ```

The backend will be running at `http://localhost:3000`.

#### 2. Frontend Configuration

1. Navigate to the frontend directory (where the Vite code is) and install the dependencies:

    ```bash
    cd frontend
    bun install
    ```

2. Start the Vite development server:

    ```bash
    bun run dev
    ```

The frontend will be running at `http://localhost:5173`.


### Testing the Application

1. In the frontend (`http://localhost:5173`), enter a keyword in the search box (e.g., "laptop").
2. Click the "Scrape Products" button.
3. The backend (API) will fetch the product data from Amazon and return the information, which will be displayed on the frontend.

## Main Files

### Backend
- **`server.js`**: The main backend file located in the `backend` directory. It handles API requests, performs scraping using **ScraperAPI**, and parses the HTML using **JSDOM**.

### Frontend
- **`src/main.js`**: The main JavaScript file located in the `frontend/src` directory. It handles user interactions, sends requests to the backend, and dynamically updates the DOM with the scraped product data.
- **`index.html`**: The main HTML file located in the `frontend` directory.
- **`style.css`**: The main CSS file located in the `frontend` directory.

### Dependencies

#### Backend

- **express**: Web framework for Node.js.
- **axios**: HTTP client for making requests.
- **jsdom**: Simulates a browser to parse HTML and extract data.
- **cors**: Middleware to enable CORS on the backend.

#### Frontend

- **Vite**: Build tool for the frontend.
- **Vanilla JavaScript**: For interaction and logic on the frontend.