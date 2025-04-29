import express from 'express'; // Express framework for building the server
import axios from 'axios'; // Axios for making HTTP requests
import { JSDOM } from 'jsdom'; // JSDOM for parsing HTML
import cors from 'cors'; // CORS middleware to handle cross-origin requests


const app = express(); // Initialize the Express application
const port = process.env.PORT || 3000; // Port where the server will run
const SCRAPER_API_KEY = 'c3e6bac546bfc3fa0880bac49f91ee18'; // API key for ScraperAPI (stored in environment variables)

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this specific origin
  methods: ['GET'], // Only allow GET requests
}));

// Function to scrape Amazon using ScraperAPI
const scrapeAmazon = async (keyword) => {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`; // Construct the Amazon search URL
  const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`; // Construct the ScraperAPI URL

  try {
    const response = await axios.get(apiUrl); // Send a GET request to ScraperAPI
    const dom = new JSDOM(response.data); // Parse the HTML response using JSDOM
    const products = []; // Array to store the scraped products

    // Select all product elements from the Amazon search results page
    const productElements = dom.window.document.querySelectorAll('.s-main-slot .s-result-item');

    // Iterate over each product element and extract relevant details
    productElements.forEach((product) => {
      const title = product.querySelector('h2 span')?.textContent; // Extract product title
      const rating = product.querySelector('.a-icon-alt')?.textContent; // Extract product rating
      const reviews = product.querySelector('.s-link-style .a-size-base')?.textContent; // Extract number of reviews
      const imageUrl = product.querySelector('.s-image')?.src; // Extract product image URL

      // Add the product to the array if all details are available
      if (title && rating && reviews && imageUrl) {
        products.push({ title, rating, reviews, imageUrl });
      }
    });

    return products; // Return the array of products
  } catch (error) {
    // Handle errors during the scraping process
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
  const keyword = req.query.keyword; // Retrieve the keyword from the query parameters

  // Validate the keyword
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' }); // Respond with a 400 error if no keyword is provided
  }
  if (keyword.length > 100) {
    return res.status(400).json({ error: 'Keyword is too long. Maximum length is 100 characters.' }); // Respond with a 400 error if the keyword is too long
  }

  try {
    const products = await scrapeAmazon(keyword); // Call the scrapeAmazon function to scrape products

    // If no products are found, respond with a 404 error
    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    res.json(products); // Respond with the scraped products as JSON
  } catch (error) {
    console.error('Error handling /api/scrape request:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'An internal server error occurred. Please try again later.' }); // Respond with a 500 error
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // Log the server URL
});