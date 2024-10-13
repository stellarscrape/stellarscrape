let apiurl = "http://94.130.22.253:4069"

class StellarScrape {
    constructor(endpoint, apikey){
        this.endpoint = endpoint;
        this.apikey = apikey;

    }
    async getProduct(asin, countries, fromcountry){

        let url = `${apiurl}/product?asin=${asin}&countries=${countries}&fromcountry=${fromcountry}`;
        console.log(url);
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    

    




} 

module.exports = StellarScrape;