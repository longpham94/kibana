webpackJsonp([1],{0:function(module,exports,__webpack_require__){"use strict";__webpack_require__(1),__webpack_require__(2418),__webpack_require__(2398),__webpack_require__(2399),__webpack_require__(2306),__webpack_require__(2400),__webpack_require__(1).bootstrap()},2418:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}__webpack_require__(956);var _chrome=__webpack_require__(1),_chrome2=_interopRequireDefault(_chrome),_state_hashing=__webpack_require__(379),_routes=__webpack_require__(312),_routes2=_interopRequireDefault(_routes);_routes2["default"].enable(),_routes2["default"].when("/",{resolve:{url:function url(AppState,globalState,$window){var redirectUrl=_chrome2["default"].getInjected("redirectUrl"),hashedUrl=(0,_state_hashing.hashUrl)([new AppState,globalState],redirectUrl),url=_chrome2["default"].addBasePath(hashedUrl);$window.location=url}}})}});