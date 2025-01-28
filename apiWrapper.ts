

//let baseApiurl = "https://beta_api.stellarscrape.com"
let baseApiurl = "https://api.stellarscrape.com"

export type supportedCountry = "fr" | "de" | "it" | "es" | "co.uk" | "com.be"

let supportedPlatform = ["amazon"]

export type ImageQuality = "small" | "medium" | "large" | "full" |number
export type DefaultApiResponse<T extends string, D> = {
    status: number
    data: D
    tokensLeft: number,
    tokensUsed: number,
    responseTime: number,
}





export type searchData = {
    query: string,
    userCountry: supportedCountry,
    productsData: productsData[],
    totalSearchResults: number,
    firstResult: number,
    amount: number,

}

export type productsData = {
    asin: string,
    productData: productData[],
}

export type multipleProductsData = {
    productsData: productsData[],
}

export type simpleProductData = {
    productData: productData[],
}
export type productData = {
    price: number,
    deliveryPrice: number,
    fullPrice: number,
    priceNew: number,
    priceUsed: number,
    availability: boolean,
    deliveryDate: number,
    country: supportedCountry,
    currencySymbol: string,
    asin: string,
    techSpechs: object[],
    features: string[],
    productRating: number,
    imgarrays: string[],
    name: string,
    weight: number,
    brand: string,
    reviews?: number,
    unitsSold?: number,
    variations?: {
        name: string,
        selected: number,
        options: {
            asin: string,
            value: string,
            selected: boolean,
        }[]
    }[],
    userComments?: string[]
    lastUpdated: Date

}

// verif si bien asin et en plus faut verif si pas plus de 100 asin dans bulk. Modifier prix asin bulk
export class StellarScrape {


    private apikey: string;
    private apiurl: string;

    /**
   * Constructor to initialize the base URL and API key
   * @param Platform The platform for the api
   * @param apiKey The API key for authorization
   * @returns A confirmtion message
   */
    constructor(apikey: string, platform: "amazon") {
        if (!supportedPlatform.includes(platform)) {
            throw new Error(`Unsupported platform: ${platform}`);
        }
        this.apiurl = `${baseApiurl}/${platform}`;
        this.apikey = apikey;
        }


    /**
  * Fetch product details from the API
  * @param asin The ASIN of the product
  * @param countries The list of countries
  * @param fromcountry The country of origin
  * @param advancedScrape If the scrape should be including product info and stuff (true)
  * @param advancedUserCountry If the user country should be included in the scrape (true)
  * @returns A promise resolving to the product data
  */
    async getAmazonProduct(asin: string, countries: supportedCountry[], userCountry: supportedCountry, advancedScrape:boolean | undefined=true,advancedUserCountry:boolean | undefined=true, ): Promise<DefaultApiResponse<'productData', simpleProductData>> {

        const url = `${this.apiurl}/product`;
        console.log(url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asin, countries, userCountry, advancedScrape, advancedUserCountry }),
            });
            if (!response.ok) {
                throw Error(`HTTP error! status: ${response.status}`);
            }
            // check if the response is json
            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw Error('Response is not JSON');
            }
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
    async searchAmazonProducts(
        query: string,
        countries: supportedCountry[],
        userCountry: supportedCountry,
        amount?: number,
        startAt?: number,
        advancedScrape:boolean | undefined=true,advancedUserCountry:boolean | undefined=true,
    ): Promise<DefaultApiResponse<'searchData', searchData>> {
        // Set default values inside the function if not provided
        amount = amount ?? 10;
        startAt = startAt ?? 0;


        const url = `${this.apiurl}/search`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, countries, userCountry, amount, startAt, advancedScrape, advancedUserCountry }),
            });
            if (!response.ok) {
                throw Error(`HTTP error! status: ${response.status}`);
            }
            // check if the response is json
            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw Error('Response is not JSON');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product data:', error);
            throw new Error('Failed to fetch product data');
        }
    }





    /**
* Fetch multiple products details from the API
* @param asin The ASIN of the products
* @param countries The list of countries
* @param fromcountry The country of origin
* @returns A promise resolving to the product data
*/
    async getAmazonMultipleProducts(asinArray: string[], countries: supportedCountry[], userCountry: supportedCountry, advancedScrape:boolean | undefined=true,advancedUserCountry:boolean | undefined=true,): Promise<DefaultApiResponse<'productsData', multipleProductsData>> {
        if (asinArray.length > 100) {
            throw Error("To much asin, the limit is 100 asin per requests")
        }
        if (!asinArray || !countries || !userCountry) {
            throw Error("Missing one or more parameters")
        }

        const url = `${this.apiurl}/products`;


        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asinArray, countries, userCountry , advancedScrape, advancedUserCountry}),
            });
            // check if the response is ok
            if (!response.ok) {
                throw Error(`HTTP error! status: ${response.status}`);
            }
            // check if the response is json
            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw Error('Response is not JSON');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product data:', error);
            throw new Error('Failed to fetch product data');
        }
    }



     /**
* Transform an img id into an usable link
* @param imageId An image id of image ids
* @param quality The quality. either "small", "medium", "large", "full" or a number between 1 and 1000
* @returns An amazon image link
*/

     getImageLink(imageId:string, quality:ImageQuality):string{
        
        const binds = {
            "small": "_AC_SL100_",
            "medium": "_AC_SL500_",
            "large": "_AC_SL800_",
            "full": "_AC_SL1000_"
        }


        if(typeof quality === "number"){
            return `https://m.media-amazon.com/images/I/${imageId}._AC_${quality}_.jpg`
        }else if(!binds[quality]){

            return `https://m.media-amazon.com/images/I/${imageId}._AC_SL1000_.jpg`
        }
        else{
        const imgUrl = `https://m.media-amazon.com/images/I/${imageId}.${binds[quality]}.jpg`


        return imgUrl
    }

    }
}





