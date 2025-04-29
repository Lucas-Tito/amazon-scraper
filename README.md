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
- **Docker Compose**: Simplifies the setup and running of the application.

---

## How to Run the Project

*The following steps are based on an Ubuntu environment.*

### Option 1: Using Docker (Recommended)

#### Prerequisites

Make sure you have **Docker** and **Docker Compose** installed on your machine. 

#### Steps to Run

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/amazon-scraper.git
    cd amazon-scraper
    ```

2. Build the Docker containers:

    ```bash
    sudo docker-compose build
    ```

3. Start the application:

    ```bash
    sudo docker-compose up
    ```

The frontend will be running at `http://localhost:5173`.

---

### Option 2: Without Docker (Manual Setup)

#### Prerequisites

Make sure you have **Node.js** and **Bun** installed on your machine. If not, install the latest version from [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/).

#### Steps to Run

##### 1. Backend Configuration (API)

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/amazon-scraper.git
    cd amazon-scraper
    ```

2. Navigate to the backend directory and install the dependencies:

    ```bash
    cd backend
    bun install
    ```

3. Install the **`cors`** package to allow CORS on the backend:

    ```bash
    bun add cors
    ```

4. Start the backend server:

    ```bash
    bun server.js
    ```

The backend will be running at `http://localhost:3000`.

##### 2. Frontend Configuration

1. Navigate to the frontend directory and install the dependencies:

    ```bash
    cd frontend
    bun install
    ```

2. Start the Vite development server:

    ```bash
    bun run dev
    ```

The frontend will be running at `http://localhost:5173`.

---

## Troubleshooting

### Error: Address Already in Use (Port 3000)

If you encounter the error `Error: listen EADDRINUSE: address already in use :::<PORT>` when starting the backend, it means that port is already being used by another process. Follow these steps to resolve the issue:

1. Identify the process using the port:

    ```bash
    lsof -i :<PORT>
    ```

    This will display a list of processes using the port. Look for the **PID** (Process ID) in the output.

2. Terminate the process using the port:

    ```bash
    kill -9 <PID>
    ```

    Replace `<PID>` with the Process ID from the previous command.

3. Try starting the application again:

---

## Testing the Application

1. Open the frontend in your browser at `http://localhost:5173`.
2. Enter a keyword in the search box (e.g., "laptop").
3. Click the "Scrape Products" button.
4. The backend (API) will fetch the product data from Amazon and return the information, which will be displayed on the frontend.

---

## Known Issues

- **Long Loading Times**: The scraping process may take longer than expected, especially for keywords with many results. This is due to the time required to fetch and parse the Amazon search results page.    

---

## Main Files

### Backend
- **`server.js`**: The main backend file located in the `backend` directory. It handles API requests, performs scraping using **ScraperAPI**, and parses the HTML using **JSDOM**.

### Frontend
- **`src/main.js`**: The main JavaScript file located in the `frontend/src` directory. It handles user interactions, sends requests to the backend, and dynamically updates the DOM with the scraped product data.
- **`index.html`**: The main HTML file located in the `frontend` directory.
- **`style.css`**: The main CSS file located in the `frontend` directory.

---

## Dependencies

### Backend

- **express**: Web framework for Node.js.
- **axios**: HTTP client for making requests.
- **jsdom**: Simulates a browser to parse HTML and extract data.
- **cors**: Middleware to enable CORS on the backend.

### Frontend

- **Vite**: Build tool for the frontend.
- **Vanilla JavaScript**: For interaction and logic on the frontend.