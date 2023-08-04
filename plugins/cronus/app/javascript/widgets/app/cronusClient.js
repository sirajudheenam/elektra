import { createAjaxHelper } from "lib/ajax_helper";
import { widgetBasePath } from "lib/widget";

// const REGION = "qa-de-1";
// const CRONUS_ENDPOINT = `https://cronus.${REGION}.cloud.sap`;
// @cronus_endpoint

// const baseURL = widgetBasePath("cronus");

console.log(`CRONUS_ENDPOINT: ${CRONUS_ENDPOINT}`);
export default createAjaxHelper({ CRONUS_ENDPOINT });
