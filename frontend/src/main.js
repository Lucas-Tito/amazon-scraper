document.getElementById('scrape-btn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  if (!keyword) {
    alert('Please enter a keyword!');
    return;
  }

  try {
    // Direciona corretamente para o backend (porta 3000)
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Verifica o tipo de resposta antes de tentar convertê-la em JSON
    const textResponse = await response.text();
    console.log("Response text:", textResponse);  // Verifique o conteúdo no console

    const data = JSON.parse(textResponse);  // Use JSON.parse para verificar a estrutura da resposta manualmente

    if (data.error) {
      alert(data.error);
      return;
    }

    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    data.forEach(product => {
      const productElem = document.createElement('div');
      productElem.classList.add('product');
      productElem.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Rating: ${product.rating}</p>
        <p>Reviews: ${product.reviews}</p>
      `;
      productsList.appendChild(productElem);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('An error occurred while scraping data.');
  }
});
