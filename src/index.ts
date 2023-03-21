// Import the functions you need from the packages
import axios from "axios";
import * as cheerio from "cheerio";

// Set the url 
const URL_TO_SCRAPE = `https://www.svetstripa.org.rs/izdanja/golconda/lms/lms-1012-julija/`;

// Helper function to load the markup
const loadMarkup = async (url: string, selector?: string) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // Element that needs to be scrapped
  // Optionally you can pass this as parameter to the markup function
  const n = $(selector || ".woocommerce-product-details__short-description").first();

  return $;
};

// Process the markup
const processMarkup = async () => {
  const $ = await loadMarkup(URL_TO_SCRAPE);

  const productData = $(
    ".woocommerce-product-details__short-description"
  ).first();

  let data: string[] = [];

  productData.each((_i, el) => {
    const text = $(el).text().trim();
    const split = text.split("\n");
    data = split;
  });


  // Transform the processed data to desired otuput
  const transformedData = transformDataToMap(data);

  return transformedData;

};

// Helper function to transform the data to desired output
const transformDataToMap = (data: string[]) =>
  data.reduce((acc, curr) => {
    // We are expecring the data to be in format "key: value" and to get the data split by ":"
    const [key, value] = curr.split(":");
    return { ...acc, [key]: value };
  }, {});


// We need to wrap the async function in an IIFE to be able to use await
(async () => {

// Call
// Optionally omit / pick any values from the object or define the type of it for better intellisense and ease of use
const processed = await processMarkup();

console.log('Processed', processed)

})()
