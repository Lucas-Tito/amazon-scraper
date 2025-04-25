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
    // Constructing the Amazon search URL
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    // Constructing the ScraperAPI URL with the Amazon URL
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

    try {
        // Making a GET request to ScraperAPI to fetch the HTML content
        const response = await axios.get(apiUrl);
        
        // Parsing the HTML content using JSDOM
        const dom = new JSDOM(response.data);
        const products = []; // Array to store the scraped product data

        // Selecting product elements using CSS selectors
        const productElements = dom.window.document.querySelectorAll('.s-main-slot .s-result-item');
        
        // Iterating over each product element to extract details
        productElements.forEach((product) => {
            const title = product.querySelector('h2 span')?.textContent; // Extracting product title
            const rating = product.querySelector('.a-icon-alt')?.textContent; // Extracting product rating
            const reviews = product.querySelector('.s-link-style .a-size-base')?.textContent; // Extracting number of reviews
            const imageUrl = product.querySelector('.s-image')?.src; // Extracting product image URL

            // Adding the product to the array if all details are available
            if (title && rating && reviews && imageUrl) {
                products.push({
                    title,
                    rating,
                    reviews,
                    imageUrl,
                });
            }
        });

        // Returning the array of products
        return products;
    } catch (error) {
        // Logging any errors that occur during the scraping process
        console.error('Error scraping Amazon:', error.message);
        return []; // Returning an empty array in case of an error
    }
};

// Route to handle Amazon scraping requests
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword; // Extracting the keyword from the query parameters
    if (!keyword) {
        // Returning a 400 error if the keyword is missing
        return res.status(400).json({ error: 'Keyword is required' });
    }

    // Calling the scrapeAmazon function with the provided keyword
    const products = await scrapeAmazon(keyword);
    if (products.length === 0) {
        // Returning a 404 error if no products are found
        return res.status(404).json({ error: 'No products found' });
    }
    // Returning the scraped products as a JSON response
    res.json(products);
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Logging the server URL
});