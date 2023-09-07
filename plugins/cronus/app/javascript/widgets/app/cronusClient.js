import { createAjaxHelper } from 'lib/ajax_helper';
import { widgetBasePath } from 'lib/widget';

console.log(`CRONUS_ENDPOINT: ${CRONUS_ENDPOINT}`);
export default createAjaxHelper({ CRONUS_ENDPOINT });
