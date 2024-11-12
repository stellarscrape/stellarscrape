
let apiurl = "https://api.stellarscrape.com/v1/amazon"


export type supportedCountry = "fr" | "de" | "it" | "es" | "co.uk" | "com.be"


export type ImageQuality = "small" | "medium" | "large" | "full" |number
export type DefaultApiResponse<T extends string, D> = {
    status: number
    data: {
        [key in T]: D
    } & {
        clientName: string,
        tokensLeft: number,
        tokensUsed: number,
        responseTime: number,
    },
    message: string,
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
    reviews: number,
    unitsSold: number,
    variations: {
        name: string,
        selected: number,
        options: {
            asin: string,
            value: string,
            selected: boolean,
        }[]
    }[],
    userComments: string[]
    lastUpdated: Date

}

// verif si bien asin et en plus faut verif si pas plus de 100 asin dans bulk. Modifier prix asin bulk
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
    async getAmazonProduct(asin: string, countries: supportedCountry[], userCountry: supportedCountry): Promise<DefaultApiResponse<'productData', productData[]>> {

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
    async searchAmazonProducts(
        query: string,
        countries: supportedCountry[],
        userCountry: supportedCountry,
        amount?: number,
        startAt?: number
    ): Promise<DefaultApiResponse<'searchData', searchData>> {
        // Set default values inside the function if not provided
        amount = amount ?? 10;
        startAt = startAt ?? 0;


        const url = `${apiurl}/search`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, countries, userCountry, amount, startAt }),
            });
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
    async getAmazonMultipleProducts(asinArray: string[], countries: supportedCountry[], userCountry: supportedCountry): Promise<DefaultApiResponse<'productsData', productsData[]>> {
        if (asinArray.length > 100) {
            throw Error("To much asin, the limit is 100 asin per requests")
        }
        if (!asinArray || !countries || !userCountry) {
            throw Error("Missing one or more parameters")
        }

        const url = `${apiurl}/products`;


        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": this.apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asinArray, countries, userCountry }),
            });
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





