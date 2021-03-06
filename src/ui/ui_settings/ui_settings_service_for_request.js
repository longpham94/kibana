'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettingsServiceForRequest = getUiSettingsServiceForRequest;

var _ui_settings_service_factory = require('./ui_settings_service_factory');

const BY_REQUEST_CACHE = new WeakMap();

/**
 *  Get/create an instance of UiSettingsService bound to a specific request.
 *  Each call is cached (keyed on the request object itself) and subsequent
 *  requests will get the first UiSettingsService instance even if the `options`
 *  have changed.
 *
 *  @param {Hapi.Server} server
 *  @param {Hapi.Request} request
 *  @param {Object} [options={}]
 *  @property {AsyncFunction} [options.getDefaults] async function that returns defaults/details about
 *                            the uiSettings.
 *  @property {AsyncFunction} [options.readInterceptor] async function that is called when the
 *                            UiSettingsService does a read() and has an oportunity to intercept the
 *                            request and return an alternate `_source` value to use.
 *  @return {UiSettingsService}
 */
function getUiSettingsServiceForRequest(server, request, options = {}) {
  if (BY_REQUEST_CACHE.has(request)) {
    return BY_REQUEST_CACHE.get(request);
  }

  const readInterceptor = options.readInterceptor,
        getDefaults = options.getDefaults;


  const uiSettingsService = (0, _ui_settings_service_factory.uiSettingsServiceFactory)(server, {
    readInterceptor,
    getDefaults,
    savedObjectsClient: request.getSavedObjectsClient()
  });

  BY_REQUEST_CACHE.set(request, uiSettingsService);
  return uiSettingsService;
}
