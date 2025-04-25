import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom'; // JSDOM é necessário para fazer o parsing do HTML
import cors from 'cors'; // Importando o pacote CORS

const app = express();
const port = 3000;
const SCRAPER_API_KEY = 'c3e6bac546bfc3fa0880bac49f91ee18'; // Sua chave da ScraperAPI


// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir requisições do frontend em localhost:5173
    methods: ['GET'], // Permitir apenas métodos GET
  }));

// Função para fazer scraping na Amazon usando ScraperAPI
const scrapeAmazon = async (keyword) => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

    try {
        // Requisição à ScraperAPI para obter a página HTML
        const response = await axios.get(apiUrl);
        
        // JSDOM é usado aqui para fazer o parsing do HTML retornado pela ScraperAPI
        const dom = new JSDOM(response.data);
        const products = [];

        // Seletores CSS para encontrar os produtos
        const productElements = dom.window.document.querySelectorAll('.s-main-slot .s-result-item');
        
        productElements.forEach((product) => {
            const title = product.querySelector('h2 span')?.textContent;
            const rating = product.querySelector('.a-icon-alt')?.textContent;
            const reviews = product.querySelector('.s-link-style .a-size-base')?.textContent;
            const imageUrl = product.querySelector('.s-image')?.src;

            if (title && rating && reviews && imageUrl) {
                products.push({
                    title,
                    rating,
                    reviews,
                    imageUrl,
                });
            }
        });

        return products;
    } catch (error) {
        console.error('Error scraping Amazon:', error.message);
        return [];
    }
};

// Rota de scraping da Amazon
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const products = await scrapeAmazon(keyword);
    if (products.length === 0) {
        return res.status(404).json({ error: 'No products found' });
    }
    res.json(products);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
