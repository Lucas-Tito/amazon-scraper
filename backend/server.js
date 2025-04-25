// Importing required modules
import express from 'express'; // Express framework for building the server
import axios from 'axios'; // Axios for making HTTP requests
import { JSDOM } from 'jsdom'; // JSDOM for parsing HTML
import cors from 'cors'; // CORS middleware to handle cross-origin requests

// Initializing the Express application
const app = express();
const port = 3000; // Port where the server will run
const SCRAPER_API_KEY = 'c3e6bac546bfc3fa0880bac49f91ee18'; // API key for ScraperAPI

// Configuring CORS to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this specific origin
    methods: ['GET'], // Only allow GET requests
}));

// Function to scrape Amazon using ScraperAPI
const scrapeAmazon = async (keyword) => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(apiUrl);
        const dom = new JSDOM(response.data);
        const products = [];
        const productElements = dom.window.document.querySelectorAll('.s-main-slot .s-result-item');

        productElements.forEach((product) => {
            const title = product.querySelector('h2 span')?.textContent;
            const rating = product.querySelector('.a-icon-alt')?.textContent;
            const reviews = product.querySelector('.s-link-style .a-size-base')?.textContent;
            const imageUrl = product.querySelector('.s-image')?.src;

            if (title && rating && reviews && imageUrl) {
                products.push({ title, rating, reviews, imageUrl });
            }
        });

        return products;
    } catch (error) {
        // Differentiating between network errors and other errors
        if (error.response) {
            console.error(`ScraperAPI responded with status ${error.response.status}: ${error.response.data}`);
        } else if (error.request) {
            console.error('No response received from ScraperAPI:', error.message);
        } else {
            console.error('Error setting up the request:', error.message);
        }
        throw new Error('Failed to scrape Amazon. Please try again later.');
    }
};

// Route to handle Amazon scraping requests
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;

    // Validate the keyword
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }
    if (keyword.length > 100) {
        return res.status(400).json({ error: 'Keyword is too long. Maximum length is 100 characters.' });
    }

    try {
        const products = await scrapeAmazon(keyword);
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        res.json(products);
    } catch (error) {
        console.error('Error handling /api/scrape request:', error.message);
        res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
    }
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});