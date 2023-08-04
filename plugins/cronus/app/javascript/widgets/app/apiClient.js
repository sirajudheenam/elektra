import { createAjaxHelper } from "lib/ajax_helper";
import { widgetBasePath } from "lib/widget";

const baseURL = widgetBasePath("cronus");

// const allCredentialsURL = "https://identity-3.qa-de-1.cloud.sap/v3/users/";
// console.log(`baseURL: ${allCredentialsURL}`);
export default createAjaxHelper({ baseURL });
