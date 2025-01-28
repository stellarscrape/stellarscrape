export type supportedCountry = "fr" | "de" | "it" | "es" | "co.uk" | "com.be";
export type DefaultApiResponse<T extends string, D> = {
    status: number;
    data: D;
    tokensLeft: number;
    tokensUsed: number;
    responseTime: number;
};
export type searchData = {
    query: string;
    userCountry: supportedCountry;
    productsData: productsData[];
    totalSearchResults: number;
    firstResult: number;
    amount: number;
};
export type productsData = {
    asin: string;
    productData: productData[];
};
export type multipleProductsData = {
    productsData: productsData[];
};
export type simpleProductData = {
    productData: productData[];
};
export type productData = {
    price: number;
    deliveryPrice: number;
    fullPrice: number;
    priceNew: number;
    priceUsed: number;
    availability: boolean;
    deliveryDate: number;
    country: supportedCountry;
    currencySymbol: string;
    asin: string;
    techSpechs: object[];
    features: string[];
    productRating: number;
    imgarrays: string[];
    name: string;
    weight: number;
    brand: string;
    reviews?: number;
    unitsSold?: number;
    variations?: {
        name: string;
        selected: number;
        options: {
            asin: string;
            value: string;
            selected: boolean;
        }[];
    }[];
    userComments?: string[];
    lastUpdated: Date;
};
export declare class StellarScrape {
    private apikey;
    private apiurl;
    /**
   * Constructor to initialize the base URL and API key
   * @param Platform The platform for the api
   * @param apiKey The API key for authorization
   * @returns A confirmtion message
   */
    constructor(apikey: string, platform: "amazon");
    /**
  * Fetch product details from the API
  * @param asin The ASIN of the product
  * @param countries The list of countries
  * @param fromcountry The country of origin
  * @param advancedScrape If the scrape should be including product info and stuff (true)
  * @param advancedUserCountry If the user country should be included in the scrape (true)
  * @returns A promise resolving to the product data
  */
    getAmazonProduct(asin: string, countries: supportedCountry[], userCountry: supportedCountry, advancedScrape?: boolean | undefined, advancedUserCountry?: boolean | undefined): Promise<DefaultApiResponse<'productData', simpleProductData>>;
    /**
   * Search on amazon for multiple products, in multiple countries
   * @param query What to search for
   * @param countries The list of countries to get items in
   * @param fromcountry The country of origin
   * @returns A promise resolving to the product data
   */
    searchAmazonProducts(query: string, countries: supportedCountry[], userCountry: supportedCountry, amount?: number, startAt?: number): Promise<DefaultApiResponse<'searchData', searchData>>;
    /**
* Fetch multiple products details from the API
* @param asin The ASIN of the products
* @param countries The list of countries
* @param fromcountry The country of origin
* @returns A promise resolving to the product data
*/
    getAmazonMultipleProducts(asinArray: string[], countries: supportedCountry[], userCountry: supportedCountry): Promise<DefaultApiResponse<'productsData', multipleProductsData>>;
}
