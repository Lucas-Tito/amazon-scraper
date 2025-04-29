const API_URL = 'http://localhost:3000/api/scrape'; // Backend API URL
const MAX_KEYWORD_LENGTH = 100; // Maximum allowed length for the keyword

// Function to display error messages to the user
function showError(message) {
  alert(message); // Display an alert with the provided message
}

// Function to display the list of products on the page
function displayProducts(products) {
  const productsList = document.getElementById('products-list'); // Select the product list container
  productsList.innerHTML = ''; // Clear any existing content in the product list

  // Iterate over the array of products and create HTML elements for each
  products.forEach(product => {
    const productElem = document.createElement('div'); // Create a new div for the product
    productElem.classList.add('product'); // Add a CSS class for styling

    // Set the inner HTML of the product element with the product details
    productElem.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}"> <!-- Product image -->
      <h3>${product.title}</h3> <!-- Product title -->
      <p>Rating: ${product.rating}</p> <!-- Product rating -->
      <p>Reviews: ${product.reviews}</p> <!-- Number of reviews -->
    `;

    productsList.appendChild(productElem); // Append the product element to the product list
  });
}

// Function to fetch products from the backend API
async function fetchProducts(keyword) {
  const loadingIndicator = document.getElementById('loading'); // Select the loading indicator element
  loadingIndicator.style.display = 'block'; // Show the loading indicator

  try {
    // Send a GET request to the backend API with the keyword as a query parameter
    const response = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);

    // Check if the HTTP response status is not OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the response as JSON

    // Check if the response contains an error
    if (data.error) {
      throw new Error(data.error);
    }

    displayProducts(data); // Display the products on the page
  } catch (error) {
    console.error('Error fetching data:', error.message); // Log the error for debugging
    showError('An error occurred while fetching products. Please try again later.'); // Show an error message to the user
  } finally {
    loadingIndicator.style.display = 'none'; // Hide the loading indicator
  }
}

// Add an event listener to the "scrape-btn" button
document.getElementById('scrape-btn').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value.trim(); // Retrieve and trim the keyword

  // Validate the keyword
  if (!keyword) {
    showError('Please enter a keyword!'); // Show an error if the keyword is empty
    return;
  }

  if (keyword.length > MAX_KEYWORD_LENGTH) {
    showError(`Keyword is too long. Maximum length is ${MAX_KEYWORD_LENGTH} characters.`); // Show an error if the keyword is too long
    return;
  }

  fetchProducts(keyword); // Fetch products with the provided keyword
});