"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarScrape = void 0;
let apiurl = "https://api.stellarscrape.com/amazon";
// verif si bien asin et en plus faut verif si pas plus de 100 asin dans bulk. Modifier prix asin bulk
class StellarScrape {
    /**
   * Constructor to initialize the base URL and API key
   * @param baseURL The base URL of the API
   * @param apiKey The API key for authorization
   * @returns A confirmtion message
   */
    constructor(apikey) {
        this.apikey = apikey;
    }
    /**
  * Fetch product details from the API
  * @param asin The ASIN of the product
  * @param countries The list of countries
  * @param fromcountry The country of origin
  * @returns A promise resolving to the product data
  */
    getAmazonProduct(asin, countries, userCountry) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${apiurl}/product`;
            console.log(url);
            try {
                const response = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        "Authorization": this.apikey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ asin, countries, userCountry }),
                });
                if (!response.ok) {
                    throw Error(`HTTP error! status: ${response.status}`);
                }
                // check if the response is json
                if (!((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                    throw Error('Response is not JSON');
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Error fetching product data:', error);
                throw new Error('Failed to fetch product data');
            }
        });
    }
    /**
   * Search on amazon for multiple products, in multiple countries
   * @param query What to search for
   * @param countries The list of countries to get items in
   * @param fromcountry The country of origin
   * @returns A promise resolving to the product data
   */
    searchAmazonProducts(query, countries, userCountry, amount, startAt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Set default values inside the function if not provided
            amount = amount !== null && amount !== void 0 ? amount : 10;
            startAt = startAt !== null && startAt !== void 0 ? startAt : 0;
            const url = `${apiurl}/search`;
            try {
                const response = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        "Authorization": this.apikey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, countries, userCountry, amount, startAt }),
                });
                if (!response.ok) {
                    throw Error(`HTTP error! status: ${response.status}`);
                }
                // check if the response is json
                if (!((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                    throw Error('Response is not JSON');
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Error fetching product data:', error);
                throw new Error('Failed to fetch product data');
            }
        });
    }
    /**
* Fetch multiple products details from the API
* @param asin The ASIN of the products
* @param countries The list of countries
* @param fromcountry The country of origin
* @returns A promise resolving to the product data
*/
    getAmazonMultipleProducts(asinArray, countries, userCountry) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (asinArray.length > 100) {
                throw Error("To much asin, the limit is 100 asin per requests");
            }
            if (!asinArray || !countries || !userCountry) {
                throw Error("Missing one or more parameters");
            }
            const url = `${apiurl}/products`;
            try {
                const response = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        "Authorization": this.apikey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ asinArray, countries, userCountry }),
                });
                // check if the response is ok
                if (!response.ok) {
                    throw Error(`HTTP error! status: ${response.status}`);
                }
                // check if the response is json
                if (!((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                    throw Error('Response is not JSON');
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Error fetching product data:', error);
                throw new Error('Failed to fetch product data');
            }
        });
    }
    /**
* Transform an img id into an usable link
* @param imageId An image id of image ids
* @param quality The quality. either "small", "medium", "large", "full" or a number between 1 and 1000
* @returns An amazon image link
*/
    getImageLink(imageId, quality) {
        const binds = {
            "small": "_AC_SL100_",
            "medium": "_AC_SL500_",
            "large": "_AC_SL800_",
            "full": "_AC_SL1000_"
        };
        if (typeof quality === "number") {
            return `https://m.media-amazon.com/images/I/${imageId}._AC_${quality}_.jpg`;
        }
        else if (!binds[quality]) {
            return `https://m.media-amazon.com/images/I/${imageId}._AC_SL1000_.jpg`;
        }
        else {
            const imgUrl = `https://m.media-amazon.com/images/I/${imageId}.${binds[quality]}.jpg`;
            return imgUrl;
        }
    }
}
exports.StellarScrape = StellarScrape;