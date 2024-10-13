
let apiurl = "http://54.36.121.173:3012/v1/amazon"


export type supportedCountry = "fr" | "de" | "it" | "es" | "co.uk"

export type productResponse = {
    status: "success" | "error",
    data: {
        data: productData[],

        responseTime: number,
    }

    message: string,

}

export type searchResponse = {
    status: "success" | "error",
    data: {
        query : string,
        userCountry: supportedCountry,
        productsData : {
            ASIN : string,
            ResultsArray : productData[]
        }[]

        responseTime: number,
    }

    message: string,

}
export type productData = {
    price: number,
    deliveryPrice: number,
    fullPrice: number,
    availability: boolean,
    deliveryDate: number,
    country: supportedCountry,
    currencySymbol: string,
    ASIN: string,
    techSpechs: object[],
    features: string[],
    productRating: number,
    imgarrays: string[],
    name: string,
    weight: number,
    brand: string,
}


export class StellarScrape {


    private apikey: string;

    /**
   * Constructor to initialize the base URL and API key
   * @param baseURL The base URL of the API
   * @param apiKey The API key for authorization
   * @returns A confirmtion message
   */
    constructor(apikey: string) {

        this.apikey = apikey;

    }


    /**
  * Fetch product details from the API
  * @param asin The ASIN of the product
  * @param countries The list of countries
  * @param fromcountry The country of origin
  * @returns A promise resolving to the product data
  */
    async getAmazonProduct(asin: string, countries: supportedCountry[], userCountry: supportedCountry): Promise<productResponse> {

        const url = `${apiurl}/product`;
        console.log(url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asin, countries, userCountry }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product data:', error);
            throw new Error('Failed to fetch product data');
        }
    }

   /**
  * Search on amazon for multiple products, in multiple countries
  * @param query What to search for
  * @param countries The list of countries to get items in
  * @param fromcountry The country of origin
  * @returns A promise resolving to the product data
  */
    async searchAmazonProducts(query: string, countries: supportedCountry[], userCountry: supportedCountry): Promise<searchResponse> {

        const url = `${apiurl}/search`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, countries, userCountry }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product data:', error);
            throw new Error('Failed to fetch product data');
        }
    }
}

