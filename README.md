

# Stellarscrape ApiClient

The Stellarscrape ApiClient is an npm package designed to interact with the Stellarscrape API, allowing you to search for Amazon products and retrieve detailed product information across supported Amazon marketplaces. To use this package, obtain an API key by subscribing at [StellarScrape.com](https://stellarscrape.com).

## Installation

Install the Stellarscrape client via npm:

```bash
npm install stellarscrape
```

## Getting Started

To start using the Stellarscrape client, import the `StellarScrape` class, initialize it with your API key, and use the methods provided to search for products or fetch product details.

```javascript
const { StellarScrape } = require('stellarscrape');

const stellarScrape = new StellarScrape("YOUR_API_KEY");
```

### API Methods

#### 1. Get Amazon Product Data

Retrieve details for a specific product based on its Amazon Standard Identification Number (ASIN).

```javascript
stellarScrape.getAmazonProduct("B0DGHN7913", ["fr"], "fr")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
```

**Parameters:**
- `asin` (string): The ASIN of the product.
- `countries` (array of supportedCountry): List of country codes to fetch data from (e.g., `["fr"]`).
- `userCountry` (supportedCountry): The country code for the user.

#### 2. Search Amazon Products

Search for products on Amazon across multiple supported locales using a query string.

```javascript
stellarScrape.searchAmazonProducts("iphones", ["fr", "it", "es", "de"], "fr", 10, 0)
  .then((data) => {
    data.data.searchData.productsData.forEach((product) => console.log(product));
  })
  .catch((err) => {
    console.log(err);
  });
```

**Parameters:**
- `query` (string): Search term (e.g., `"iphones"`).
- `countries` (array of supportedCountry): List of countries to search in (e.g., `["fr", "it", "es", "de"]`).
- `userCountry` (supportedCountry): The primary country for the user.
- `amount` (number, optional): Number of results per page (default is 10).
- `startAt` (number, optional): The starting index of the results (default is 0).

#### 3. Get Multiple Amazon Products

Retrieve details for multiple products in one request by providing an array of ASINs.

```javascript
stellarScrape.getAmazonMultipleProducts(["B09G9HWQYT", "B07F81WWKP"], ["fr"], "fr")
  .then((data) => {
    console.log(data.data);
  })
  .catch((err) => {
    console.log(err);
  });
```

**Parameters:**
- `asinArray` (array of strings): Array of ASINs (up to 100 per request).
- `countries` (array of supportedCountry): List of country codes (e.g., `["fr"]`).
- `userCountry` (supportedCountry): The user's country code.


### Notes

- Obtain your API key by subscribing at [StellarScrape.com](https://stellarscrape.com).
- Manage errors with `.catch()` to handle potential API request issues.

