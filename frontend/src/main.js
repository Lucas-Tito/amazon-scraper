// Adding an event listener to the "scrape-btn" button
document.getElementById('scrape-btn').addEventListener('click', async () => {
  // Retrieving the keyword entered by the user and trimming any extra spaces
  const keyword = document.getElementById('keyword').value.trim();
  
  // If the keyword is empty, show an alert and stop execution
  if (!keyword) {
    alert('Please enter a keyword!');
    return;
  }

  try {
    // Sending a GET request to the backend API with the keyword as a query parameter
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Fetching the response as plain text to debug its content
    const textResponse = await response.text();
    console.log("Response text:", textResponse); // Logging the raw response text to the console for debugging

    // Parsing the response text into JSON format
    const data = JSON.parse(textResponse); // Manually parsing to check the structure of the response

    // If the response contains an error, show an alert and stop execution
    if (data.error) {
      alert(data.error);
      return;
    }

    // Selecting the HTML element where the product list will be displayed
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // Clearing any previous content in the product list

    // Iterating over the array of products returned by the API
    data.forEach(product => {
      // Creating a new HTML element for each product
      const productElem = document.createElement('div');
      productElem.classList.add('product'); // Adding a CSS class for styling

      // Setting the inner HTML of the product element with the product details
      productElem.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}"> <!-- Product image -->
        <h3>${product.title}</h3> <!-- Product title -->
        <p>Rating: ${product.rating}</p> <!-- Product rating -->
        <p>Reviews: ${product.reviews}</p> <!-- Number of reviews -->
      `;

      // Appending the product element to the product list in the DOM
      productsList.appendChild(productElem);
    });
  } catch (error) {
    // Logging any errors that occur during the fetch process
    console.error('Error fetching data:', error);
    // Showing an alert to the user if an error occurs
    alert('An error occurred while scraping data.');
  }
});