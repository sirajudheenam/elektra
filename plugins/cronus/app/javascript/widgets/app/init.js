import { createWidget } from "lib/widget";
import App from "./components/Application";
import * as reducers from "./reducers";

const identityUrl = "https://identity-3.qa-de-1.cloud.sap/v3/";
createWidget({ pluginName: "cronus", widgetName: "app" }).then((widget) => {
  console.log(widget);
  widget.configureAjaxHelper({
    // baseURL: widget.config.scriptParams.cronusApi,
    baseURL: identityUrl,
    headers: { "X-Auth-Token": widget.config.scriptParams.token },
  });

  console.log(`token : ${widget.config.scriptParams.token}`);
  console.log(`endpoint : ${widget.config.scriptParams.cronus_endpoint}`);

  delete widget.config.scriptParams.cronusApi;
  delete widget.config.scriptParams.token;
  widget.setPolicy();
  widget.createStore(reducers);
  widget.render(App);
});
