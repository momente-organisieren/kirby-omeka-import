(function() {
  "use strict";
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var isURL$1 = { exports: {} };
  var assertString = { exports: {} };
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = assertString2;
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function assertString2(input) {
      var isString = typeof input === "string" || input instanceof String;
      if (!isString) {
        var invalidType = _typeof(input);
        if (input === null)
          invalidType = "null";
        else if (invalidType === "object")
          invalidType = input.constructor.name;
        throw new TypeError("Expected a string but received a ".concat(invalidType));
      }
    }
    module.exports = exports.default;
    module.exports.default = exports.default;
  })(assertString, assertString.exports);
  var isFQDN = { exports: {} };
  var merge = { exports: {} };
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = merge2;
    function merge2() {
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var defaults = arguments.length > 1 ? arguments[1] : void 0;
      for (var key in defaults) {
        if (typeof obj[key] === "undefined") {
          obj[key] = defaults[key];
        }
      }
      return obj;
    }
    module.exports = exports.default;
    module.exports.default = exports.default;
  })(merge, merge.exports);
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isFQDN2;
    var _assertString = _interopRequireDefault(assertString.exports);
    var _merge = _interopRequireDefault(merge.exports);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var default_fqdn_options = {
      require_tld: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_numeric_tld: false,
      allow_wildcard: false
    };
    function isFQDN2(str, options) {
      (0, _assertString.default)(str);
      options = (0, _merge.default)(options, default_fqdn_options);
      if (options.allow_trailing_dot && str[str.length - 1] === ".") {
        str = str.substring(0, str.length - 1);
      }
      if (options.allow_wildcard === true && str.indexOf("*.") === 0) {
        str = str.substring(2);
      }
      var parts = str.split(".");
      var tld = parts[parts.length - 1];
      if (options.require_tld) {
        if (parts.length < 2) {
          return false;
        }
        if (!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
          return false;
        }
        if (/\s/.test(tld)) {
          return false;
        }
      }
      if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
        return false;
      }
      return parts.every(function(part) {
        if (part.length > 63) {
          return false;
        }
        if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
          return false;
        }
        if (/[\uff01-\uff5e]/.test(part)) {
          return false;
        }
        if (/^-|-$/.test(part)) {
          return false;
        }
        if (!options.allow_underscores && /_/.test(part)) {
          return false;
        }
        return true;
      });
    }
    module.exports = exports.default;
    module.exports.default = exports.default;
  })(isFQDN, isFQDN.exports);
  var isIP = { exports: {} };
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isIP2;
    var _assertString = _interopRequireDefault(assertString.exports);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var IPv4SegmentFormat = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
    var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
    var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
    var IPv6SegmentFormat = "(?:[0-9a-fA-F]{1,4})";
    var IPv6AddressRegExp = new RegExp("^(" + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ")(%[0-9a-zA-Z-.:]{1,})?$");
    function isIP2(str) {
      var version = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      (0, _assertString.default)(str);
      version = String(version);
      if (!version) {
        return isIP2(str, 4) || isIP2(str, 6);
      }
      if (version === "4") {
        if (!IPv4AddressRegExp.test(str)) {
          return false;
        }
        var parts = str.split(".").sort(function(a, b) {
          return a - b;
        });
        return parts[3] <= 255;
      }
      if (version === "6") {
        return !!IPv6AddressRegExp.test(str);
      }
      return false;
    }
    module.exports = exports.default;
    module.exports.default = exports.default;
  })(isIP, isIP.exports);
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isURL2;
    var _assertString = _interopRequireDefault(assertString.exports);
    var _isFQDN = _interopRequireDefault(isFQDN.exports);
    var _isIP = _interopRequireDefault(isIP.exports);
    var _merge = _interopRequireDefault(merge.exports);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
        return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null)
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    var default_url_options = {
      protocols: ["http", "https", "ftp"],
      require_tld: true,
      require_protocol: false,
      require_host: true,
      require_port: false,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false,
      allow_fragments: true,
      allow_query_components: true,
      validate_length: true
    };
    var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;
    function isRegExp(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    }
    function checkHost(host, matches) {
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        if (host === match || isRegExp(match) && match.test(host)) {
          return true;
        }
      }
      return false;
    }
    function isURL2(url, options) {
      (0, _assertString.default)(url);
      if (!url || /[\s<>]/.test(url)) {
        return false;
      }
      if (url.indexOf("mailto:") === 0) {
        return false;
      }
      options = (0, _merge.default)(options, default_url_options);
      if (options.validate_length && url.length >= 2083) {
        return false;
      }
      if (!options.allow_fragments && url.includes("#")) {
        return false;
      }
      if (!options.allow_query_components && (url.includes("?") || url.includes("&"))) {
        return false;
      }
      var protocol, auth, host, hostname, port, port_str, split, ipv6;
      split = url.split("#");
      url = split.shift();
      split = url.split("?");
      url = split.shift();
      split = url.split("://");
      if (split.length > 1) {
        protocol = split.shift().toLowerCase();
        if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
          return false;
        }
      } else if (options.require_protocol) {
        return false;
      } else if (url.substr(0, 2) === "//") {
        if (!options.allow_protocol_relative_urls) {
          return false;
        }
        split[0] = url.substr(2);
      }
      url = split.join("://");
      if (url === "") {
        return false;
      }
      split = url.split("/");
      url = split.shift();
      if (url === "" && !options.require_host) {
        return true;
      }
      split = url.split("@");
      if (split.length > 1) {
        if (options.disallow_auth) {
          return false;
        }
        if (split[0] === "") {
          return false;
        }
        auth = split.shift();
        if (auth.indexOf(":") >= 0 && auth.split(":").length > 2) {
          return false;
        }
        var _auth$split = auth.split(":"), _auth$split2 = _slicedToArray(_auth$split, 2), user = _auth$split2[0], password = _auth$split2[1];
        if (user === "" && password === "") {
          return false;
        }
      }
      hostname = split.join("@");
      port_str = null;
      ipv6 = null;
      var ipv6_match = hostname.match(wrapped_ipv6);
      if (ipv6_match) {
        host = "";
        ipv6 = ipv6_match[1];
        port_str = ipv6_match[2] || null;
      } else {
        split = hostname.split(":");
        host = split.shift();
        if (split.length) {
          port_str = split.join(":");
        }
      }
      if (port_str !== null && port_str.length > 0) {
        port = parseInt(port_str, 10);
        if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
          return false;
        }
      } else if (options.require_port) {
        return false;
      }
      if (options.host_whitelist) {
        return checkHost(host, options.host_whitelist);
      }
      if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
        return false;
      }
      host = host || ipv6;
      if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
        return false;
      }
      return true;
    }
    module.exports = exports.default;
    module.exports.default = exports.default;
  })(isURL$1, isURL$1.exports);
  const isURL = /* @__PURE__ */ getDefaultExportFromCjs(isURL$1.exports);
  const OmekaObjectPreview_vue_vue_type_style_index_0_lang = "";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    if (functionalTemplate) {
      options.functional = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    var hook;
    if (moduleIdentifier) {
      hook = function(context) {
        context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (injectStyles) {
          injectStyles.call(this, context);
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (injectStyles) {
      hook = shadowMode ? function() {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        );
      } : injectStyles;
    }
    if (hook) {
      if (options.functional) {
        options._injectStyles = hook;
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return {
      exports: scriptExports,
      options
    };
  }
  function UriInfo(s) {
    s = s.match(/^(([^/]*?:)\/*((?:([^:]+):([^@]+)@)?([^/:]{2,}|\[[\w:]+])(:\d*)?(?=\/|$))?)?((.*?\/)?(([^/]*?)(\.[^/.]+?)?))(\?.*?)?(#.*)?$/);
    return {
      origin: s[1],
      protocol: s[2],
      host: s[3],
      username: s[4],
      password: s[5],
      hostname: s[6],
      port: s[7],
      path: s[8],
      folders: s[9],
      file: s[10],
      filename: s[11],
      fileext: s[12],
      search: s[13],
      hash: s[14]
    };
  }
  function buildOmekaApiUriForObjectDataRetrieval(s) {
    if (!isURL(s)) {
      return "invalid";
    }
    const URI_PARTS = UriInfo(s);
    const OBJECT_PATH = URI_PARTS.path;
    let objId = "";
    if (OBJECT_PATH.includes("obj")) {
      objId = OBJECT_PATH;
      objId = objId.replace("/obj/", "");
    }
    return URI_PARTS.origin + "/api/items?search=" + objId;
  }
  const _sfc_main = {
    data() {
      return {
        thumbUrl: false,
        downloadUrl: false
      };
    },
    methods: {
      async loadOmekaData(omekaApiUrl) {
        const RESPONSE = await fetch(omekaApiUrl);
        const OMEKA_JSON_RESPONSE = await RESPONSE.json();
        this.thumbUrl = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["medium"];
        this.downloadUrl = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["large"];
        this.content.object_title = OMEKA_JSON_RESPONSE[0]["dcterms:title"][0]["@value"];
        this.content.object_id = OMEKA_JSON_RESPONSE[0]["dcterms:identifier"][0]["@value"];
        this.content.object_thumb_square = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["medium"];
        this.content.object_thumb_large = OMEKA_JSON_RESPONSE[0]["thumbnail_display_urls"]["large"];
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["o:resource_template"] && null !== OMEKA_JSON_RESPONSE[0]["o:resource_template"]) {
          let resourceTemplateApiUrl = OMEKA_JSON_RESPONSE[0]["o:resource_template"]["@id"];
          const RESOURCE_TEMPLATE_RESPONSE = await fetch(resourceTemplateApiUrl);
          const RESOURCE_TEMPLATE_RESPONSE_JSON = await RESOURCE_TEMPLATE_RESPONSE.json();
          this.content.object_resource_template = RESOURCE_TEMPLATE_RESPONSE_JSON["o:label"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:rights"]) {
          this.content.object_rights = OMEKA_JSON_RESPONSE[0]["dcterms:rights"][0]["o:label"];
          this.content.object_rights_link = OMEKA_JSON_RESPONSE[0]["dcterms:rights"][0]["@id"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:description"]) {
          this.content.object_description = OMEKA_JSON_RESPONSE[0]["dcterms:description"][0]["@value"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:medium"]) {
          this.content.object_medium = OMEKA_JSON_RESPONSE[0]["dcterms:medium"][0]["@value"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:date"]) {
          this.content.object_date = OMEKA_JSON_RESPONSE[0]["dcterms:date"][0]["@value"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:type"]) {
          this.content.object_type = OMEKA_JSON_RESPONSE[0]["dcterms:type"][0]["@value"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:format"]) {
          this.content.object_format = OMEKA_JSON_RESPONSE[0]["dcterms:format"][0]["@value"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["dcterms:creator"]) {
          this.content.object_creator = OMEKA_JSON_RESPONSE[0]["dcterms:creator"][0]["display_title"];
        }
        if (void 0 !== OMEKA_JSON_RESPONSE[0]["bibo:isbn13"]) {
          this.content.object_bibo_isbn13 = OMEKA_JSON_RESPONSE[0]["bibo:isbn13"][0]["@value"];
        }
      },
      upload() {
        let currentPage = this.$store.state.content.current;
        currentPage = currentPage.replace("/pages/", "");
        this.$refs.upload.open({
          url: this.$urls.api + "/" + this.$api.pages.url(currentPage, "files")
        });
      }
    },
    computed: {
      previewTitle() {
        return `${this.content.object_title}`;
      },
      source() {
        let givenUrl = this.content.url;
        if (0 !== givenUrl.length && isURL(givenUrl)) {
          const apiUrl = buildOmekaApiUriForObjectDataRetrieval(givenUrl);
          this.loadOmekaData(apiUrl);
          return buildOmekaApiUriForObjectDataRetrieval(givenUrl);
        }
      }
    }
  };
  var _sfc_render = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("k-block-figure", { attrs: { "caption": _vm.previewTitle, "is-empty": !_vm.source, "empty-icon": "image", "empty-text": "No Valid Omeka URL given yet \u2026" }, on: { "open": _vm.open, "update": _vm.update } }, [_vm.thumbUrl ? [_vm.thumbUrl ? _c("img", { staticClass: "k-block-type-image-auto", attrs: { "alt": _vm.content.object_title, "src": _vm.thumbUrl } }) : _c("div", [_vm._v("No URL given")])] : _vm._e()], 2);
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    null,
    null,
    null
  );
  __component__.options.__file = "/var/www/src/components/OmekaObjectPreview.vue";
  const OmekaObjectPreview = __component__.exports;
  panel.plugin("momente-organisieren/kirby-omeka-import", {
    blocks: {
      omeka_object: OmekaObjectPreview
    }
  });
})();
