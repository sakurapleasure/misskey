/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 255);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* Riot v3.3.2, @license MIT */
(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.riot = global.riot || {})));
}(this, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_RESERVED_NAMES = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|refs|parent|opts|trigger|o(?:n|ff|ne))$/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = { 'viewbox': 'viewBox' };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Check Check if the passed argument is undefined
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isUndefined(value) || value === null || value === ''
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } -
 */
function isWritable(obj, key) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}

/**
 * Check if passed argument is a reserved name
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isReservedName(value) {
  return RE_RESERVED_NAMES.test(value)
}

var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isArray: isArray,
	isWritable: isWritable,
	isReservedName: isReservedName
});

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 */
/* istanbul ignore next */
function setInnerHTML(container, html) {
  if (!isUndefined(container.innerHTML))
    { container.innerHTML = html; }
    // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml');
    var node = container.ownerDocument.importNode(doc.documentElement, true);
    container.appendChild(node);
  }
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html)
    { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	mkEl: mkEl,
	setInnerHTML: setInnerHTML,
	remAttr: remAttr,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else { document.getElementsByTagName('head')[0].appendChild(newNode); }

    return newNode
  })();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function(k) { return byName[k] })
      .concat(remainder).join('\n');
    /* istanbul ignore next */
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.3
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

/* istanbul ignore next */
var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      pos = match.index;

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(str, match[2], re.lastIndex);
          continue
        }
        if (!match[3]) {
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    return parts

    function unescapeStr (s) {
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function skipBraces (s, ch, ix) {
      var
        match,
        recch = FINDBRACES[ch];

      recch.lastIndex = ix;
      ix = 1;
      while ((match = recch.exec(s))) {
        if (match[1] &&
          !(match[1] === ch ? ++ix : --ix)) { break }
      }
      return ix ? s.length : recch.lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

/* istanbul ignore next */
var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      if (err.riotData.tagName) {
        console.error('Riot template error thrown in the <%s> tag', err.riotData.tagName);
      }
      console.error(err);
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var
    CH_IDEXPR = String.fromCharCode(0x2057),
    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr[0]) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.3';

  return _tmpl

})();

/* istanbul ignore next */
var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; ++i) {
    fn(list[i], i);
  }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments;
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true
});

var EVENTS_PREFIX_REGEX = /^on/;

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent,
    item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  /* istanbul ignore next */
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  /* istanbul ignore next */
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  /* istanbul ignore next */
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName,
    cb = handleEvent.bind(tag, dom, handler);

  // avoid to bind twice the same event
  dom[name] = null;

  // normalize event name
  eventName = name.replace(EVENTS_PREFIX_REGEX, '');

  // cache the callback directly on the DOM node
  if (!dom._riotEvents) { dom._riotEvents = {}; }

  if (dom._riotEvents[name])
    { dom.removeEventListener(eventName, dom._riotEvents[name]); }

  dom._riotEvents[name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag } parent - parent for tag creation
 */
function updateDataIs(expr, parent) {
  var tagName = tmpl(expr.value, parent),
    conf, isVirtual, head, ref;

  if (expr.tag && expr.tagName === tagName) {
    expr.tag.update();
    return
  }

  isVirtual = expr.dom.tagName === 'VIRTUAL';
  // sync _parent to accommodate changing tagnames
  if (expr.tag) {

    // need placeholder before unmount
    if(isVirtual) {
      head = expr.tag.__.head;
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    expr.tag.unmount(true);
  }

  expr.impl = __TAG_IMPL[tagName];
  conf = {root: expr.dom, parent: parent, hasImpl: true, tagName: tagName};
  expr.tag = initChildTag(expr.impl, conf, expr.dom.innerHTML, parent);
  each(expr.attrs, function (a) { return setAttr(expr.tag.root, a.name, a.value); });
  expr.tagName = tagName;
  expr.tag.mount();
  if (isVirtual)
    { makeReplaceVirtual(expr.tag, ref || expr.tag.root); } // root exist first time, after use placeholder

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function() {
    var delName = expr.tag.opts.dataIs,
      tags = expr.tag.parent.tags,
      _tags = expr.tag.__.parent.tags;
    arrayishRemove(tags, delName, expr.tag);
    arrayishRemove(_tags, delName, expr.tag);
    expr.tag.unmount();
  };
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom,
    attrName = expr.attr,
    isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName),
    value = tmpl(expr.expr, this),
    isValueAttr = attrName === 'riot-value',
    isVirtual = expr.root && expr.root.tagName === 'VIRTUAL',
    parent = dom && (expr.parent || dom.parentNode),
    old;

  if (expr.bool)
    { value = value ? attrName : false; }
  else if (isUndefined(value) || value === null)
    { value = ''; }

  if (expr._riot_id) { // if it's a tag
    if (expr.isMounted) {
      expr.update();

    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();

      if (isVirtual)
        { makeReplaceVirtual(expr, expr.root); }

    }
    return
  }

  old = expr.value;
  expr.value = value;

  if (expr.update) {
    expr.update();
    return
  }

  if (expr.isRtag && value) { return updateDataIs(expr, this) }
  if (old === value) { return }
  // no change, so nothing more to do
  if (isValueAttr && dom.value === value) { return }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }

  // remove original attribute
  if (!expr.isAttrRemoved || !value) {
    remAttr(dom, attrName);
    expr.isAttrRemoved = true;
  }

  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    if (attrName === HIDE_DIRECTIVE) { value = !value; }
    dom.style.display = value ? '' : 'none';
  // field value
  } else if (isValueAttr) {
    dom.value = value;
  // <img src="{ expr }">
  } else if (startsWith(attrName, ATTRS_PREFIX) && attrName !== IS_DIRECTIVE) {
    attrName = attrName.slice(ATTRS_PREFIX.length);
    if (CASE_SENSITIVE_ATTRIBUTES[attrName])
      { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
    if (value != null)
      { setAttr(dom, attrName, value); }
  } else {
    if (expr.bool) {
      dom[attrName] = value;
      if (!value) { return }
    }

    if (value === 0 || value && typeof value !== T_OBJECT) {
      setAttr(dom, attrName, value);
    }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = document.createTextNode('');
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    var newValue = tmpl(this.expr, this.tag);

    if (newValue && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);

      this.expressions = [];
      parseExpressions.apply(this.tag, [this.current, this.expressions, true]);
    } else if (!newValue && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode)
        { this.current.parentNode.removeChild(this.current); }
      this.current = null;
      this.expressions = [];
    }

    if (newValue) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
    delete this.pristine;
    delete this.parentNode;
    delete this.stub;
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    this.firstRun = true;

    return this
  },
  update: function update() {
    var value = this.rawValue;
    if (this.hasExp)
      { value = tmpl(this.rawValue, this.parent); }

    // if nothing changed, we're done
    if (!this.firstRun && value === this.value) { return }

    var customParent = this.parent && getImmediateCustomParentTag(this.parent);

    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.tag || this.dom;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }

    if (isBlank(value)) {
      // if the value is blank, we remove it
      remAttr(this.dom, this.attr);
    } else {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }
      // set the actual DOM attr
      setAttr(this.dom, this.attr, value);
    }

    this.value = value;
    this.firstRun = false;
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
    delete this.dom;
    delete this.parent;
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length,
    j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    moveChildTag.apply(this$1.tags[tagName], [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);

  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE),
    tagName = getTagName(dom),
    impl = __TAG_IMPL[tagName],
    parentNode = dom.parentNode,
    placeholder = createDOMPlaceholder(),
    child = getTag(dom),
    ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE),
    tags = [],
    oldItems = [],
    hasKeys,
    isLoop = true,
    isAnonymous = !__TAG_IMPL[tagName],
    isVirtual = dom.tagName === 'VIRTUAL';

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      frag = createFrag(),
      isObject$$1 = !isArray(items) && !isString(items),
      root = placeholder.parentNode;

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, items[key], key)
        }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function(item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function(item, i) {
      // reorder only if the items are objects
      var
        doReorder = mustReorder && typeof item === T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        isNew = oldPos === -1,
        pos = !isNew && doReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos],
        mustAppend = i >= oldItems.length,
        mustCreate =  doReorder && isNew || !doReorder && !tag;

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (mustCreate) {
        tag = new Tag$1(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, dom.innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = items.slice();

    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function() {
    each(tags, function(t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Array } expressions - empty array where the expressions will be added
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Object } an object containing the root noode and the dom tree
 */
function parseExpressions(root, expressions, mustIncludeRoot) {
  var this$1 = this;

  var tree = {parent: {children: expressions}};

  walkNodes(root, function (dom, ctx) {
    var type = dom.nodeType, parent = ctx.parent, attr, expr, tagImpl;
    if (!mustIncludeRoot && dom === root) { return {parent: parent} }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { parent.children.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return ctx } // not an element

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      parent.children.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      parent.children.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (expr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(expr)) {
        parent.children.push({isRtag: true, expr: expr, dom: dom, attrs: [].slice.call(dom.attributes)});
        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);
    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual && !getAttr(dom, IS_DIRECTIVE)) { // handled in update
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);

        var tag = new Tag$1({ tmpl: dom.outerHTML },
          {root: dom, parent: this$1},
          dom.innerHTML);
        parent.children.push(tag); // no return, anonymous tag, keep parsing
      } else {
        var conf = {root: dom, parent: this$1, hasImpl: true};
        parent.children.push(initChildTag(tagImpl, conf, dom.innerHTML, this$1));
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function(attr, expr) {
      if (!expr) { return }
      parent.children.push(expr);
    }]);

    // whatever the parent is, all child elements get the same parent.
    // If this element had an if-attr, that's the parent for all child elements
    return {parent: parent}
  }, tree);

  return { tree: tree, root: root }
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    var name = attr.name, bool = isBoolAttr(name), expr;

    if (contains(REF_DIRECTIVES, name)) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: attr.name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  /* istanbul ignore next */
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/),
    tagName = match && match[1].toLowerCase(),
    el = mkEl(GENERIC);

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$2(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css) { styleManager.add(css, name); }

  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$1(selector, tagName, opts) {
  var tags = [];

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE);

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag)
        { tags.push(tag); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  var elem;
  var allTags;

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var mixins_id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__unnamed_" + (mixins_id++)), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error('Unregistered mixin: ' + name) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag) { return tag.update(); })
}

function unregister$1(name) {
  delete __TAG_IMPL[name];
}

var version = 'v3.3.2';


var core = Object.freeze({
	Tag: Tag$2,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version
});

// counter to give a unique id to all the Tag instances
var __uid = 0;

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }

  var ctx = !isAnonymous && isLoop ? this : parent || this;
  each(instAttrs, function (attr) {
    if (attr.expr) { updateAllExpressions.call(ctx, [attr.expr]); }
    opts[toCamel(attr.name)] = attr.expr ? attr.expr.value : attr.value;
  });
}


/**
 * Tag class
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function Tag$1(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};


  var opts = extend({}, conf.opts),
    parent = conf.parent,
    isLoop = conf.isLoop,
    isAnonymous = !!conf.isAnonymous,
    skipAnonymous = settings$1.skipAnonymousTags && isAnonymous,
    item = cleanUpData(conf.item),
    index = conf.index, // available only for the looped nodes
    instAttrs = [], // All attributes on the Tag when it's first parsed
    implAttrs = [], // expressions on this type of Tag
    expressions = [],
    root = conf.root,
    tagName = conf.tagName || getTagName(root),
    isVirtual = tagName === 'virtual',
    propsInSyncWithParent = [],
    dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(this); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  this.isMounted = false;

  defineProperty(this, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    // these vars will be needed only for the virtual tags
    virts: [],
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id
  defineProperty(this, 'root', root);
  extend(this, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(this, 'parent', parent || null);
  defineProperty(this, 'tags', {});
  defineProperty(this, 'refs', {});

  dom = isLoop && isAnonymous ? root : mkdom(impl.tmpl, innerHTML, isLoop);

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'update', function tagUpdate(data) {
    var nextOpts = {},
      canTrigger = this.isMounted && !skipAnonymous;

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data);
    extend(this, data);
    updateOpts.apply(this, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);
    if (this.isMounted && isFunction(this.shouldUpdate) && !this.shouldUpdate(data, nextOpts)) { return this }

    // inherit properties from the parent, but only for isAnonymous tags
    if (isLoop && isAnonymous) { inheritFrom.apply(this, [this.parent, propsInSyncWithParent]); }
    extend(opts, nextOpts);
    if (canTrigger) { this.trigger('update', data); }
    updateAllExpressions.call(this, expressions);
    if (canTrigger) { this.trigger('updated'); }

    return this

  }.bind(this));

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mixin', function tagMixin() {
    var this$1 = this;

    each(arguments, function (mix) {
      var instance, obj;
      var props = [];

      // properties blacklisted and will not be bound to the tag instance
      var propsBlacklist = ['init', '__proto__'];

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to this
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!this$1.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(this$1, key, descriptor);
          } else {
            this$1[key] = isFunction(instance[key]) ?
              instance[key].bind(this$1) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(this$1)(); }
    });
    return this
  }.bind(this));

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mount', function tagMount() {
    var this$1 = this;

    root._tag = this; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = this$1; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    implAttrs = [];
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(this, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          this$1.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(this, opts); }

    if (!skipAnonymous) { this.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions.apply(this, [dom, expressions, isAnonymous]);

    this.update(item);

    if (!isAnonymous) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(this, 'root', root);
    defineProperty(this, 'isMounted', true);

    if (skipAnonymous) { return }

    // if it's not a child tag we can trigger its mount event
    if (!this.parent) {
      this.trigger('mount');
    }
    // otherwise we need to wait that the parent "mount" or "updated" event gets triggered
    else {
      var p = getImmediateCustomParentTag(this.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        this$1.trigger('mount');
      });
    }

    return this

  }.bind(this));

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'unmount', function tagUnmount(mustKeepRoot) {
    var this$1 = this;

    var el = this.root,
      p = el.parentNode,
      ptag,
      tagIndex = __TAGS_CACHE.indexOf(this);

    if (!skipAnonymous) { this.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }
      remAttr(root, name);
    });

    // remove this tag instance from the global virtualDom variable
    if (tagIndex !== -1)
      { __TAGS_CACHE.splice(tagIndex, 1); }

    if (p || isVirtual) {
      if (parent) {
        ptag = getImmediateCustomParentTag(parent);

        if (isVirtual) {
          Object.keys(this.tags).forEach(function (tagName) {
            arrayishRemove(ptag.tags, tagName, this$1.tags[tagName]);
          });
        } else {
          arrayishRemove(ptag.tags, tagName, this);
          if(parent !== ptag) // remove from _parent too
            { arrayishRemove(parent.tags, tagName, this); }
        }
      } else {
        while (el.firstChild) { el.removeChild(el.firstChild); }
      }

      if (p)
        { if (!mustKeepRoot) {
          p.removeChild(el);
        } else {
          // the riot-tag and the data-is attributes aren't needed anymore, remove them
          remAttr(p, IS_DIRECTIVE);
        } }
    }

    if (this.__.virts) {
      each(this.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // custom internal unmount function to avoid relying on the observable
    if (this.__.onUnmount) { this.__.onUnmount(); }

    if (!skipAnonymous) {
      this.trigger('unmount');
      this.off('*');
    }

    defineProperty(this, 'isMounted', false);

    delete this.root._tag;

    return this

  }.bind(this));
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Inherit properties from a target tag instance
 * @this Tag
 * @param   { Tag } target - tag where we will inherit properties
 * @param   { Array } propsInSyncWithParent - array of properties to sync with the target
 */
function inheritFrom(target, propsInSyncWithParent) {
  var this$1 = this;

  each(Object.keys(target), function (k) {
    // some properties must be always in sync with the parent tag
    var mustSync = !isReservedName(k) && contains(propsInSyncWithParent, k);

    if (isUndefined(this$1[k]) || mustSync) {
      // track the property to keep in sync
      // so we can keep it updated
      if (!mustSync) { propsInSyncWithParent.push(k); }
      this$1[k] = target[k];
    }
  });
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent,
    tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag$1(child, opts, innerHTML),
    tagName = opts.tagName || getTagName(opts.root, true),
    ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = '';

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function(expr) {
    if (expr instanceof Tag$1) { expr.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom),
    namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()
}

/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag$1) && !(data && isFunction(data.trigger)))
    { return data }

  var o = {};
  for (var key in data) {
    if (!RE_RESERVED_NAMES.test(key)) { o[key] = data[key]; }
  }
  return o
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName],
    implClass = __TAG_IMPL[tagName].class,
    tag = ctx || (implClass ? Object.create(implClass.prototype) : {}),
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

  // clear the inner html
  root.innerHTML = '';

  var conf = extend({ root: root, opts: opts }, { parent: opts ? opts.parent : null });

  if (impl && root) { Tag$1.apply(tag, [impl, conf, innerHTML]); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder(),
    tail = createDOMPlaceholder(),
    frag = createFrag(),
    sib, el;

  this.root.insertBefore(head, this.root.firstChild);
  this.root.appendChild(tail);

  this.__.head = el = head;
  this.__.tail = tail;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head,
    frag = createFrag(),
    sib;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	inheritFrom: inheritFrom,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	cleanUpData: cleanUpData,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag$$1 = Tag$2;
var tag$$1 = tag$1;
var tag2$$1 = tag2$1;
var mount$$1 = mount$1;
var mixin$$1 = mixin$1;
var update$$1 = update$1;
var unregister$$1 = unregister$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});

exports.settings = settings;
exports.util = util;
exports.Tag = Tag$$1;
exports.tag = tag$$1;
exports.tag2 = tag2$$1;
exports.mount = mount$$1;
exports.mixin = mixin$$1;
exports.update = update$$1;
exports.unregister = unregister$$1;
exports.observable = observable;
exports['default'] = riot$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Url = new URL(location.href);

const isRoot = Url.host.split('.')[0] == 'misskey';

const host = isRoot ? Url.host : Url.host.substring(Url.host.indexOf('.') + 1, Url.host.length);
const scheme = Url.protocol;
const url = `${scheme}//${host}`;
const apiUrl = `${scheme}//api.${host}`;
const devUrl = `${scheme}//dev.${host}`;
const aboutUrl = `${scheme}//about.${host}`;

/* harmony default export */ __webpack_exports__["a"] = ({
	host,
	scheme,
	url,
	apiUrl,
	devUrl,
	aboutUrl
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 2017 Julian Garnier
 Released under the MIT license
*/
var $jscomp$this=this;
(function(u,r){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (r),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"===typeof module&&module.exports?module.exports=r():u.anime=r()})(this,function(){function u(a){if(!g.col(a))try{return document.querySelectorAll(a)}catch(b){}}function r(a){return a.reduce(function(a,c){return a.concat(g.arr(c)?r(c):c)},[])}function v(a){if(g.arr(a))return a;g.str(a)&&(a=u(a)||a);return a instanceof NodeList||a instanceof HTMLCollection?[].slice.call(a):[a]}function E(a,b){return a.some(function(a){return a===b})}
function z(a){var b={},c;for(c in a)b[c]=a[c];return b}function F(a,b){var c=z(a),d;for(d in a)c[d]=b.hasOwnProperty(d)?b[d]:a[d];return c}function A(a,b){var c=z(a),d;for(d in b)c[d]=g.und(a[d])?b[d]:a[d];return c}function R(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,b,c,h){return b+b+c+c+h+h});var b=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);a=parseInt(b[1],16);var c=parseInt(b[2],16),b=parseInt(b[3],16);return"rgb("+a+","+c+","+b+")"}function S(a){function b(a,b,c){0>
c&&(c+=1);1<c&&--c;return c<1/6?a+6*(b-a)*c:.5>c?b:c<2/3?a+(b-a)*(2/3-c)*6:a}var c=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a);a=parseInt(c[1])/360;var d=parseInt(c[2])/100,c=parseInt(c[3])/100;if(0==d)d=c=a=c;else{var e=.5>c?c*(1+d):c+d-c*d,k=2*c-e,d=b(k,e,a+1/3),c=b(k,e,a);a=b(k,e,a-1/3)}return"rgb("+255*d+","+255*c+","+255*a+")"}function w(a){if(a=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg|rad|turn)?/.exec(a))return a[2]}function T(a){if(-1<a.indexOf("translate"))return"px";
if(-1<a.indexOf("rotate")||-1<a.indexOf("skew"))return"deg"}function G(a,b){return g.fnc(a)?a(b.target,b.id,b.total):a}function B(a,b){if(b in a.style)return getComputedStyle(a).getPropertyValue(b.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function H(a,b){if(g.dom(a)&&E(U,b))return"transform";if(g.dom(a)&&(a.getAttribute(b)||g.svg(a)&&a[b]))return"attribute";if(g.dom(a)&&"transform"!==b&&B(a,b))return"css";if(null!=a[b])return"object"}function V(a,b){var c=T(b),c=-1<b.indexOf("scale")?
1:0+c;a=a.style.transform;if(!a)return c;for(var d=[],e=[],k=[],h=/(\w+)\((.+?)\)/g;d=h.exec(a);)e.push(d[1]),k.push(d[2]);a=k.filter(function(a,c){return e[c]===b});return a.length?a[0]:c}function I(a,b){switch(H(a,b)){case "transform":return V(a,b);case "css":return B(a,b);case "attribute":return a.getAttribute(b)}return a[b]||0}function J(a,b){var c=/^(\*=|\+=|-=)/.exec(a);if(!c)return a;b=parseFloat(b);a=parseFloat(a.replace(c[0],""));switch(c[0][0]){case "+":return b+a;case "-":return b-a;case "*":return b*
a}}function C(a){return g.obj(a)&&a.hasOwnProperty("totalLength")}function W(a,b){function c(c){c=void 0===c?0:c;return a.el.getPointAtLength(1<=b+c?b+c:0)}var d=c(),e=c(-1),k=c(1);switch(a.property){case "x":return d.x;case "y":return d.y;case "angle":return 180*Math.atan2(k.y-e.y,k.x-e.x)/Math.PI}}function K(a,b){var c=/-?\d*\.?\d+/g;a=C(a)?a.totalLength:a;if(g.col(a))b=g.rgb(a)?a:g.hex(a)?R(a):g.hsl(a)?S(a):void 0;else{var d=w(a);a=d?a.substr(0,a.length-d.length):a;b=b?a+b:a}b+="";return{original:b,
numbers:b.match(c)?b.match(c).map(Number):[0],strings:b.split(c)}}function X(a,b){return b.reduce(function(b,d,e){return b+a[e-1]+d})}function L(a){return(a?r(g.arr(a)?a.map(v):v(a)):[]).filter(function(a,c,d){return d.indexOf(a)===c})}function Y(a){var b=L(a);return b.map(function(a,d){return{target:a,id:d,total:b.length}})}function Z(a,b){var c=z(b);if(g.arr(a)){var d=a.length;2!==d||g.obj(a[0])?g.fnc(b.duration)||(c.duration=b.duration/d):a={value:a}}return v(a).map(function(a,c){c=c?0:b.delay;
a=g.obj(a)&&!C(a)?a:{value:a};g.und(a.delay)&&(a.delay=c);return a}).map(function(a){return A(a,c)})}function aa(a,b){var c={},d;for(d in a){var e=G(a[d],b);g.arr(e)&&(e=e.map(function(a){return G(a,b)}),1===e.length&&(e=e[0]));c[d]=e}c.duration=parseFloat(c.duration);c.delay=parseFloat(c.delay);return c}function ba(a){return g.arr(a)?x.apply(this,a):M[a]}function ca(a,b){var c;return a.tweens.map(function(d){d=aa(d,b);var e=d.value,k=I(b.target,a.name),h=c?c.to.original:k,h=g.arr(e)?e[0]:h,n=J(g.arr(e)?
e[1]:e,h),k=w(n)||w(h)||w(k);d.isPath=C(e);d.from=K(h,k);d.to=K(n,k);d.start=c?c.end:a.offset;d.end=d.start+d.delay+d.duration;d.easing=ba(d.easing);d.elasticity=(1E3-Math.min(Math.max(d.elasticity,1),999))/1E3;g.col(d.from.original)&&(d.round=1);return c=d})}function da(a,b){return r(a.map(function(a){return b.map(function(b){var c=H(a.target,b.name);if(c){var d=ca(b,a);b={type:c,property:b.name,animatable:a,tweens:d,duration:d[d.length-1].end,delay:d[0].delay}}else b=void 0;return b})})).filter(function(a){return!g.und(a)})}
function N(a,b,c){var d="delay"===a?Math.min:Math.max;return b.length?d.apply(Math,b.map(function(b){return b[a]})):c[a]}function ea(a){var b=F(fa,a),c=F(ga,a),d=Y(a.targets),e=[],g=A(b,c),h;for(h in a)g.hasOwnProperty(h)||"targets"===h||e.push({name:h,offset:g.offset,tweens:Z(a[h],c)});a=da(d,e);return A(b,{animatables:d,animations:a,duration:N("duration",a,c),delay:N("delay",a,c)})}function m(a){function b(){return window.Promise&&new Promise(function(a){return P=a})}function c(a){return f.reversed?
f.duration-a:a}function d(a){for(var b=0,c={},d=f.animations,e={};b<d.length;){var g=d[b],h=g.animatable,n=g.tweens;e.tween=n.filter(function(b){return a<b.end})[0]||n[n.length-1];e.isPath$0=e.tween.isPath;e.round=e.tween.round;e.eased=e.tween.easing(Math.min(Math.max(a-e.tween.start-e.tween.delay,0),e.tween.duration)/e.tween.duration,e.tween.elasticity);n=X(e.tween.to.numbers.map(function(a){return function(b,c){c=a.isPath$0?0:a.tween.from.numbers[c];b=c+a.eased*(b-c);a.isPath$0&&(b=W(a.tween.value,
b));a.round&&(b=Math.round(b*a.round)/a.round);return b}}(e)),e.tween.to.strings);ha[g.type](h.target,g.property,n,c,h.id);g.currentValue=n;b++;e={isPath$0:e.isPath$0,tween:e.tween,eased:e.eased,round:e.round}}if(c)for(var k in c)D||(D=B(document.body,"transform")?"transform":"-webkit-transform"),f.animatables[k].target.style[D]=c[k].join(" ");f.currentTime=a;f.progress=a/f.duration*100}function e(a){if(f[a])f[a](f)}function g(){f.remaining&&!0!==f.remaining&&f.remaining--}function h(a){var h=f.duration,
k=f.offset,m=f.delay,O=f.currentTime,p=f.reversed,q=c(a),q=Math.min(Math.max(q,0),h);q>k&&q<h?(d(q),!f.began&&q>=m&&(f.began=!0,e("begin")),e("run")):(q<=k&&0!==O&&(d(0),p&&g()),q>=h&&O!==h&&(d(h),p||g()));a>=h&&(f.remaining?(t=n,"alternate"===f.direction&&(f.reversed=!f.reversed)):(f.pause(),P(),Q=b(),f.completed||(f.completed=!0,e("complete"))),l=0);if(f.children)for(a=f.children,h=0;h<a.length;h++)a[h].seek(q);e("update")}a=void 0===a?{}:a;var n,t,l=0,P=null,Q=b(),f=ea(a);f.reset=function(){var a=
f.direction,b=f.loop;f.currentTime=0;f.progress=0;f.paused=!0;f.began=!1;f.completed=!1;f.reversed="reverse"===a;f.remaining="alternate"===a&&1===b?2:b};f.tick=function(a){n=a;t||(t=n);h((l+n-t)*m.speed)};f.seek=function(a){h(c(a))};f.pause=function(){var a=p.indexOf(f);-1<a&&p.splice(a,1);f.paused=!0};f.play=function(){f.paused&&(f.paused=!1,t=0,l=f.completed?0:c(f.currentTime),p.push(f),y||ia())};f.reverse=function(){f.reversed=!f.reversed;t=0;l=c(f.currentTime)};f.restart=function(){f.pause();
f.reset();f.play()};f.finished=Q;f.reset();f.autoplay&&f.play();return f}var fa={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},ga={duration:1E3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},U="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY".split(" "),D,g={arr:function(a){return Array.isArray(a)},obj:function(a){return-1<Object.prototype.toString.call(a).indexOf("Object")},svg:function(a){return a instanceof
SVGElement},dom:function(a){return a.nodeType||g.svg(a)},str:function(a){return"string"===typeof a},fnc:function(a){return"function"===typeof a},und:function(a){return"undefined"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},rgb:function(a){return/^rgb/.test(a)},hsl:function(a){return/^hsl/.test(a)},col:function(a){return g.hex(a)||g.rgb(a)||g.hsl(a)}},x=function(){function a(a,c,d){return(((1-3*d+3*c)*a+(3*d-6*c))*a+3*c)*a}return function(b,c,d,e){if(0<=b&&1>=b&&
0<=d&&1>=d){var g=new Float32Array(11);if(b!==c||d!==e)for(var h=0;11>h;++h)g[h]=a(.1*h,b,d);return function(h){if(b===c&&d===e)return h;if(0===h)return 0;if(1===h)return 1;for(var k=0,l=1;10!==l&&g[l]<=h;++l)k+=.1;--l;var l=k+(h-g[l])/(g[l+1]-g[l])*.1,n=3*(1-3*d+3*b)*l*l+2*(3*d-6*b)*l+3*b;if(.001<=n){for(k=0;4>k;++k){n=3*(1-3*d+3*b)*l*l+2*(3*d-6*b)*l+3*b;if(0===n)break;var m=a(l,b,d)-h,l=l-m/n}h=l}else if(0===n)h=l;else{var l=k,k=k+.1,f=0;do m=l+(k-l)/2,n=a(m,b,d)-h,0<n?k=m:l=m;while(1e-7<Math.abs(n)&&
10>++f);h=m}return a(h,c,e)}}}}(),M=function(){function a(a,b){return 0===a||1===a?a:-Math.pow(2,10*(a-1))*Math.sin(2*(a-1-b/(2*Math.PI)*Math.asin(1))*Math.PI/b)}var b="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),c={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],a],Out:[[.25,.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],
[.075,.82,.165,1],[.175,.885,.32,1.275],function(b,c){return 1-a(1-b,c)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(b,c){return.5>b?a(2*b,c)/2:1-a(-2*b+2,c)/2}]},d={linear:x(.25,.25,.75,.75)},e={},k;for(k in c)e.type=k,c[e.type].forEach(function(a){return function(c,e){d["ease"+a.type+b[e]]=g.fnc(c)?c:x.apply($jscomp$this,c)}}(e)),e={type:e.type};return d}(),ha={css:function(a,b,c){return a.style[b]=
c},attribute:function(a,b,c){return a.setAttribute(b,c)},object:function(a,b,c){return a[b]=c},transform:function(a,b,c,d,e){d[e]||(d[e]=[]);d[e].push(b+"("+c+")")}},p=[],y=0,ia=function(){function a(){y=requestAnimationFrame(b)}function b(b){var c=p.length;if(c){for(var e=0;e<c;)p[e]&&p[e].tick(b),e++;a()}else cancelAnimationFrame(y),y=0}return a}();m.version="2.0.1";m.speed=1;m.running=p;m.remove=function(a){a=L(a);for(var b=p.length-1;0<=b;b--)for(var c=p[b],d=c.animations,e=d.length-1;0<=e;e--)E(a,
d[e].animatable.target)&&(d.splice(e,1),d.length||c.pause())};m.getValue=I;m.path=function(a,b){var c=g.str(a)?u(a)[0]:a,d=b||100;return function(a){return{el:c,property:a,totalLength:c.getTotalLength()*(d/100)}}};m.setDashoffset=function(a){var b=a.getTotalLength();a.setAttribute("stroke-dasharray",b);return b};m.bezier=x;m.easings=M;m.timeline=function(a){var b=m(a);b.duration=0;b.children=[];b.add=function(a){v(a).forEach(function(a){var c=a.offset,d=b.duration;a.autoplay=!1;a.offset=g.und(c)?
d:J(c,d);a=m(a);a.duration>d&&(b.duration=a.duration);b.children.push(a)});return b};return b};m.random=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};return m});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(1);

//const emojinize = require('emojinize');


const escape = text =>
	text
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;');

/* harmony default export */ __webpack_exports__["a"] = ((tokens, shouldBreak) => {
	if (shouldBreak == null) {
		shouldBreak = true;
	}

	const me = __WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('i').me;

	let text = tokens.map(token => {
		switch (token.type) {
			case 'text':
				return escape(token.content)
					.replace(/(\r\n|\n|\r)/g, shouldBreak ? '<br>' : ' ');
			case 'bold':
				return `<strong>${escape(token.bold)}</strong>`;
			case 'url':
				return `<mk-url href="${escape(token.content)}" target="_blank"></mk-url>`;
			case 'link':
				return `<a class="link" href="${escape(token.url)}" target="_blank" title="${escape(token.url)}">${escape(token.title)}</a>`;
			case 'mention':
				return `<a href="${__WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].url + '/' + escape(token.username)}" target="_blank" data-user-preview="${token.content}" ${me && me.username == token.username ? 'data-is-me' : ''}>${token.content}</a>`;
			case 'hashtag': // TODO
				return `<a>${escape(token.content)}</a>`;
			case 'code':
				return `<pre><code>${token.html}</code></pre>`;
			case 'inline-code':
				return `<code>${token.html}</code>`;
			case 'emoji':
				return `<i>${token.content}</i>`;
				//return emojinize.encode(token.content)
		}
	}).join('');

	// Remove needless whitespaces
	text = text
		.replace(/ <code>/g, '<code>').replace(/<\/code> /g, '</code>')
		.replace(/<br><code><pre>/g, '<code><pre>').replace(/<\/code><\/pre><br>/g, '</code></pre>');

	return text;
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


const ev = __WEBPACK_IMPORTED_MODULE_0_riot__["observable"]();

/* harmony default export */ __webpack_exports__["default"] = (ev);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(1);
/**
 * API Request
 */



let spinner = null;
let pending = 0;

/**
 * Send a request to API
 * @param  {string|Object} i  Credential
 * @param  {string} endpoint  Endpoint
 * @param  {any} [data={}] Data
 * @return {Promise<any>} Response
 */
/* harmony default export */ __webpack_exports__["a"] = ((i, endpoint, data = {}) => {
	if (++pending === 1) {
		spinner = document.createElement('div');
		spinner.setAttribute('id', 'wait');
		document.body.appendChild(spinner);
	}

	// Append the credential
	if (i != null) data.i = typeof i === 'object' ? i.token : i;

	return new Promise((resolve, reject) => {
		// Send request
		fetch(endpoint.indexOf('://') > -1 ? endpoint : `${__WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].apiUrl}/${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: endpoint === 'signin' ? 'include' : 'omit'
		}).then(res => {
			if (--pending === 0) spinner.parentNode.removeChild(spinner);
			if (res.status === 200) {
				res.json().then(resolve);
			} else if (res.status === 204) {
				resolve();
			} else {
				res.json().then(err => {
					reject(err.error);
				});
			}
		}).catch(reject);
	});
});


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const NProgress = __webpack_require__(72);
NProgress.configure({
	trickleSpeed: 500,
	showSpinner: false
});

const root = document.getElementsByTagName('html')[0];

/* harmony default export */ __webpack_exports__["a"] = ({
	start: () => {
		root.classList.add('progress');
		NProgress.start();
	},
	done: () => {
		root.classList.remove('progress');
		NProgress.done();
	},
	set: val => {
		NProgress.set(val);
	}
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isWebSocket = function (constructor) {
    return constructor && constructor.CLOSING === 2;
};
var isGlobalWebSocket = function () {
    return typeof WebSocket !== 'undefined' && isWebSocket(WebSocket);
};
var getDefaultOptions = function () { return ({
    constructor: isGlobalWebSocket() ? WebSocket : null,
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1500,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    debug: false,
}); };
var bypassProperty = function (src, dst, name) {
    Object.defineProperty(dst, name, {
        get: function () { return src[name]; },
        set: function (value) { src[name] = value; },
        enumerable: true,
        configurable: true,
    });
};
var initReconnectionDelay = function (config) {
    return (config.minReconnectionDelay + Math.random() * config.minReconnectionDelay);
};
var updateReconnectionDelay = function (config, previousDelay) {
    var newDelay = previousDelay * config.reconnectionDelayGrowFactor;
    return (newDelay > config.maxReconnectionDelay)
        ? config.maxReconnectionDelay
        : newDelay;
};
var LEVEL_0_EVENTS = ['onopen', 'onclose', 'onmessage', 'onerror'];
var reassignEventListeners = function (ws, oldWs, listeners) {
    Object.keys(listeners).forEach(function (type) {
        listeners[type].forEach(function (_a) {
            var listener = _a[0], options = _a[1];
            ws.addEventListener(type, listener, options);
        });
    });
    if (oldWs) {
        LEVEL_0_EVENTS.forEach(function (name) { ws[name] = oldWs[name]; });
    }
};
var ReconnectingWebsocket = function (url, protocols, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var ws;
    var connectingTimeout;
    var reconnectDelay = 0;
    var retriesCount = 0;
    var shouldRetry = true;
    var savedOnClose = null;
    var listeners = {};
    // require new to construct
    if (!(this instanceof ReconnectingWebsocket)) {
        throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");
    }
    // Set config. Not using `Object.assign` because of IE11
    var config = getDefaultOptions();
    Object.keys(config)
        .filter(function (key) { return options.hasOwnProperty(key); })
        .forEach(function (key) { return config[key] = options[key]; });
    if (!isWebSocket(config.constructor)) {
        throw new TypeError('Invalid WebSocket constructor. Set `options.constructor`');
    }
    var log = config.debug ? function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i - 0] = arguments[_i];
        }
        return console.log.apply(console, ['RWS:'].concat(params));
    } : function () { };
    /**
     * Not using dispatchEvent, otherwise we must use a DOM Event object
     * Deferred because we want to handle the close event before this
     */
    var emitError = function (code, msg) { return setTimeout(function () {
        var err = new Error(msg);
        err.code = code;
        if (Array.isArray(listeners.error)) {
            listeners.error.forEach(function (_a) {
                var fn = _a[0];
                return fn(err);
            });
        }
        if (ws.onerror) {
            ws.onerror(err);
        }
    }, 0); };
    var handleClose = function () {
        log('close');
        retriesCount++;
        log('retries count:', retriesCount);
        if (retriesCount > config.maxRetries) {
            emitError('EHOSTDOWN', 'Too many failed connection attempts');
            return;
        }
        if (!reconnectDelay) {
            reconnectDelay = initReconnectionDelay(config);
        }
        else {
            reconnectDelay = updateReconnectionDelay(config, reconnectDelay);
        }
        log('reconnectDelay:', reconnectDelay);
        if (shouldRetry) {
            setTimeout(connect, reconnectDelay);
        }
    };
    var connect = function () {
        log('connect');
        var oldWs = ws;
        ws = new config.constructor(url, protocols);
        connectingTimeout = setTimeout(function () {
            log('timeout');
            ws.close();
            emitError('ETIMEDOUT', 'Connection timeout');
        }, config.connectionTimeout);
        log('bypass properties');
        for (var key in ws) {
            // @todo move to constant
            if (['addEventListener', 'removeEventListener', 'close', 'send'].indexOf(key) < 0) {
                bypassProperty(ws, _this, key);
            }
        }
        ws.addEventListener('open', function () {
            clearTimeout(connectingTimeout);
            log('open');
            reconnectDelay = initReconnectionDelay(config);
            log('reconnectDelay:', reconnectDelay);
            retriesCount = 0;
        });
        ws.addEventListener('close', handleClose);
        reassignEventListeners(ws, oldWs, listeners);
        // because when closing with fastClose=true, it is saved and set to null to avoid double calls
        ws.onclose = ws.onclose || savedOnClose;
        savedOnClose = null;
    };
    log('init');
    connect();
    this.close = function (code, reason, _a) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _b = _a === void 0 ? {} : _a, _c = _b.keepClosed, keepClosed = _c === void 0 ? false : _c, _d = _b.fastClose, fastClose = _d === void 0 ? true : _d, _e = _b.delay, delay = _e === void 0 ? 0 : _e;
        if (delay) {
            reconnectDelay = delay;
        }
        shouldRetry = !keepClosed;
        ws.close(code, reason);
        if (fastClose) {
            var fakeCloseEvent_1 = {
                code: code,
                reason: reason,
                wasClean: true,
            };
            // execute close listeners soon with a fake closeEvent
            // and remove them from the WS instance so they
            // don't get fired on the real close.
            handleClose();
            ws.removeEventListener('close', handleClose);
            // run and remove level2
            if (Array.isArray(listeners.close)) {
                listeners.close.forEach(function (_a) {
                    var listener = _a[0], options = _a[1];
                    listener(fakeCloseEvent_1);
                    ws.removeEventListener('close', listener, options);
                });
            }
            // run and remove level0
            if (ws.onclose) {
                savedOnClose = ws.onclose;
                ws.onclose(fakeCloseEvent_1);
                ws.onclose = null;
            }
        }
    };
    this.send = function (data) {
        ws.send(data);
    };
    this.addEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            if (!listeners[type].some(function (_a) {
                var l = _a[0];
                return l === listener;
            })) {
                listeners[type].push([listener, options]);
            }
        }
        else {
            listeners[type] = [[listener, options]];
        }
        ws.addEventListener(type, listener, options);
    };
    this.removeEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            listeners[type] = listeners[type].filter(function (_a) {
                var l = _a[0];
                return l !== listener;
            });
        }
        ws.removeEventListener(type, listener, options);
    };
};
module.exports = ReconnectingWebsocket;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_api__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_scripts_signout__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_scripts_check_for_update__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_mixins__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_scripts_generate_default_userdata__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_scripts_config__ = __webpack_require__(1);
/**
 * boot
 */








__webpack_require__(56);

/**
 * MISSKEY ENTRY POINT!
 */

"use strict";

console.info(`Misskey v${"0.0.1490"}`);

document.domain = __WEBPACK_IMPORTED_MODULE_6__common_scripts_config__["a" /* default */].host;

// Set global configuration
__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]({
	CONFIG: __WEBPACK_IMPORTED_MODULE_6__common_scripts_config__["a" /* default */]
});

// ↓ iOS待ちPolyfill (SEE: http://caniuse.com/#feat=fetch)
__webpack_require__(61);

// ↓ NodeList、HTMLCollection、FileList、DataTransferItemListで forEach を使えるようにする
if (NodeList.prototype.forEach === undefined) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}
if (HTMLCollection.prototype.forEach === undefined) {
	HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
if (FileList.prototype.forEach === undefined) {
	FileList.prototype.forEach = Array.prototype.forEach;
}
if (window.DataTransferItemList && DataTransferItemList.prototype.forEach === undefined) {
	DataTransferItemList.prototype.forEach = Array.prototype.forEach;
}

// ↓ iOSでプライベートモードだとlocalStorageが使えないので既存のメソッドを上書きする
try {
	localStorage.setItem('kyoppie', 'yuppie');
} catch (e) {
	Storage.prototype.setItem = () => { }; // noop
}

// クライアントを更新すべきならする
if (localStorage.getItem('should-refresh') == 'true') {
	localStorage.removeItem('should-refresh');
	location.reload(true);
}

// 更新チェック
setTimeout(__WEBPACK_IMPORTED_MODULE_3__common_scripts_check_for_update__["a" /* default */], 3000);

// ユーザーをフェッチしてコールバックする
/* harmony default export */ __webpack_exports__["a"] = (callback => {
	// Get cached account data
	let cachedMe = JSON.parse(localStorage.getItem('me'));

	if (cachedMe) {
		fetched(cachedMe);

		// 後から新鮮なデータをフェッチ
		fetchme(cachedMe.token, freshData => {
			Object.assign(cachedMe, freshData);
			cachedMe.trigger('updated');
		});
	} else {
		// Get token from cookie
		const i = (document.cookie.match(/i=(!\w+)/) || [null, null])[1];

		fetchme(i, fetched);
	}

	function fetched(me) {
		if (me) {
			__WEBPACK_IMPORTED_MODULE_0_riot__["observable"](me);

			me.update = data => {
				if (data) Object.assign(me, data);
				me.trigger('updated');
			};

			localStorage.setItem('me', JSON.stringify(me));

			me.on('updated', () => {
				// キャッシュ更新
				localStorage.setItem('me', JSON.stringify(me));
			});
		}

		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__common_mixins__["a" /* default */])(me);

		const ini = document.getElementById('ini');
		ini.parentNode.removeChild(ini);

		const app = document.createElement('div');
		app.setAttribute('id', 'app');
		document.body.appendChild(app);

		try {
			callback(me);
		} catch (e) {
			panic(e);
		}
	}
});

// ユーザーをフェッチしてコールバックする
function fetchme(token, cb) {
	let me = null;

	// Return when not signed in
	if (token == null) {
		return done();
	}

	// Fetch user
	fetch(__WEBPACK_IMPORTED_MODULE_6__common_scripts_config__["a" /* default */].apiUrl + '/i', {
		method: 'POST',
		body: JSON.stringify({
			i: token
		})
	}).then(res => {
		// When failed to authenticate user
		if (res.status !== 200) {
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_scripts_signout__["a" /* default */])();
		}

		res.json().then(i => {
			me = i;
			me.token = token;

			// initialize it if user data is empty
			me.data ? done() : init();
		});
	}, () => {
		__WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-core-error')), {
			retry: () => {
				fetchme(token, cb);
			}
		});
	});

	function done() {
		if (cb) cb(me);
	}

	function init() {
		const data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__common_scripts_generate_default_userdata__["a" /* default */])();
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_api__["a" /* default */])(token, 'i/appdata/set', {
			data
		}).then(() => {
			me.data = data;
			done();
		});
	}
}

function panic(e) {
	console.error(e);
	document.body.innerHTML = '<div id="error"><p>致命的な問題が発生しました。</p></div>';
	// TODO: Report the bug
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const summarize = post => {
	let summary = post.text ? post.text : '';

	// メディアが添付されているとき
	if (post.media) {
		summary += ` (${post.media.length}つのメディア)`;
	}

	// 投票が添付されているとき
	if (post.poll) {
		summary += ' (投票)';
	}

	// 返信のとき
	if (post.reply_to_id) {
		if (post.reply_to) {
			summary += ` RE: ${summarize(post.reply_to)}`;
		} else {
			summary += ' RE: ...';
		}
	}

	// Repostのとき
	if (post.repost_id) {
		if (post.repost) {
			summary += ` RP: ${summarize(post.repost)}`;
		} else {
			summary += ' RP: ...';
		}
	}

	return summary.trim();
};

/* harmony default export */ __webpack_exports__["a"] = (summarize);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15).Buffer))

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(1);


/* harmony default export */ __webpack_exports__["a"] = (() => {
	localStorage.removeItem('me');
	document.cookie = `i=; domain=.${__WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].host}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	location.href = '/';
});


/***/ }),
/* 12 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(14)
var ieee754 = __webpack_require__(12)
var isArray = __webpack_require__(13)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(60)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-activity-table', '<svg if="{data}" ref="canvas" viewbox="0 0 53 7" preserveaspectratio="none"><rect each="{d, i in data}" width="0.8" height="0.8" riot-x="{d.x}" riot-y="{d.date.weekday}" fill="{d.color}"></rect></svg>', 'mk-activity-table,[data-is="mk-activity-table"]{display:block;max-width:600px;margin:0 auto;background:#fff;} mk-activity-table > svg,[data-is="mk-activity-table"] > svg{display:block}', '', function(opts) {
		this.mixin('api');

		this.user = this.opts.user;

		this.on('mount', () => {
			this.api('aggregation/users/activity', {
				user_id: this.user.id
			}).then(data => {
				data.forEach(d => d.total = d.posts + d.replies + d.reposts);
				this.peak = Math.max.apply(null, data.map(d => d.total)) / 2;
				let x = 0;
				data.reverse().forEach(d => {
					d.x = x;
					d.v = d.total / this.peak;
					d.color = d.v > 0.75
						? '#196127'
						: d.v > 0.5
							? '#239a3b'
							: d.v > 0.25
								? '#7bc96f'
								: d.v > 0
									? '#c6e48b'
									: '#eee';
					d.date.weekday = (new Date(d.date.year, d.date.month - 1, d.date.day)).getDay();
					if (d.date.weekday == 6) x++;
				});
				this.update({ data });
			});
		});
});

    
  

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-api-info', '<p>Token:<code>{I.token}</code></p><p>APIを利用するには、上記のトークンを「i」というキーでパラメータに付加してリクエストします。</p><p>アカウントを乗っ取られてしまう可能性があるため、このトークンは第三者に教えないでください(アプリなどにも入力しないでください)。</p><p>万が一このトークンが漏れたりその可能性がある場合は <button class="regenerate" onclick="{regenerateToken}">トークンを再生成</button>できます。(副作用として、ログインしているすべてのデバイスでログアウトが発生します) </p>', 'mk-api-info,[data-is="mk-api-info"]{display:block;} mk-api-info code,[data-is="mk-api-info"] code{padding:4px;background:#eee} mk-api-info .regenerate,[data-is="mk-api-info"] .regenerate{display:inline;color:#87bb35;} mk-api-info .regenerate:hover,[data-is="mk-api-info"] .regenerate:hover{text-decoration:underline}', '', function(opts) {
		this.mixin('i');
});

    
  

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-authorized-apps', '<p class="none" if="{!fetching && apps.length == 0}">連携しているアプリケーションはありません。</p><div class="apps" if="{apps.length != 0}"><div each="{app in apps}"><p><b>{app.name}</b></p><p>{app.description}</p></div></div>', 'mk-authorized-apps,[data-is="mk-authorized-apps"]{display:block;} mk-authorized-apps > .apps > div,[data-is="mk-authorized-apps"] > .apps > div{padding:16px 0 0 0;border-bottom:solid 1px #eee}', '', function(opts) {
		this.mixin('api');

		this.apps = [];
		this.fetching = true;

		this.on('mount', () => {
			this.api('i/authorized_apps').then(apps => {
				this.apps = apps;
				this.fetching = false;
				this.update();
			});
		});
});

    
  

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-copyright', '<span>(c) syuilo 2014-2017</span>', 'mk-copyright,[data-is="mk-copyright"]{display:block}', '', function(opts) {
});

    
  

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-core-error', '<img src="/assets/error.jpg" alt=""><h1>サーバーに接続できません</h1><p class="text">インターネット回線に問題があるか、サーバーがダウンまたはメンテナンスしている可能性があります。しばらくしてから<a onclick="{retry}">再度お試し</a>ください。</p><p class="thanks">いつもMisskeyをご利用いただきありがとうございます。</p>', 'mk-core-error,[data-is="mk-core-error"]{position:fixed;z-index:16385;top:0;left:0;width:100%;height:100%;text-align:center;background:#f8f8f8;} mk-core-error > i,[data-is="mk-core-error"] > i{display:block;margin-top:64px;font-size:5em;color:#6998a0} mk-core-error > img,[data-is="mk-core-error"] > img{display:block;height:200px;margin:64px auto 0 auto;pointer-events:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none} mk-core-error > h1,[data-is="mk-core-error"] > h1{display:block;margin:32px auto 16px auto;font-size:1.5em;color:#555} mk-core-error > .text,[data-is="mk-core-error"] > .text{display:block;margin:0 auto;max-width:600px;font-size:1em;color:#666} mk-core-error > .thanks,[data-is="mk-core-error"] > .thanks{display:block;margin:32px auto 0 auto;padding:32px 0 32px 0;max-width:600px;font-size:.9em;font-style:oblique;color:#aaa;border-top:solid 1px #eee}', '', function(opts) {
		this.retry = () => {
			this.unmount();
			this.opts.retry();
		}
});

    
  

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ellipsis', '<span>.</span><span>.</span><span>.</span>', 'mk-ellipsis,[data-is="mk-ellipsis"]{display:inline;} mk-ellipsis > span,[data-is="mk-ellipsis"] > span{animation:ellipsis 1.4s infinite ease-in-out both;} mk-ellipsis > span:nth-child(1),[data-is="mk-ellipsis"] > span:nth-child(1){animation-delay:0s} mk-ellipsis > span:nth-child(2),[data-is="mk-ellipsis"] > span:nth-child(2){animation-delay:.16s} mk-ellipsis > span:nth-child(3),[data-is="mk-ellipsis"] > span:nth-child(3){animation-delay:.32s}@-moz-keyframes ellipsis{ 0%,80%,100%{opacity:1} 40%{opacity:0}}@-webkit-keyframes ellipsis{ 0%,80%,100%{opacity:1} 40%{opacity:0}}@-o-keyframes ellipsis{ 0%,80%,100%{opacity:1} 40%{opacity:0}}@keyframes ellipsis{ 0%,80%,100%{opacity:1} 40%{opacity:0}}', '', function(opts) {
});

    
  

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-file-type-icon', '<i class="fa fa-file-image-o" if="{kind == \'image\'}"></i>', 'mk-file-type-icon,[data-is="mk-file-type-icon"]{display:inline}', '', function(opts) {
		this.kind = this.opts.type.split('/')[0];
});

    
  

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-forkit', '<a href="https://github.com/syuilo/misskey" target="_blank" title="View source on Github" aria-label="View source on Github"><svg width="80" height="80" viewbox="0 0 250 250" aria-hidden="aria-hidden"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path class="octo-arm" d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path></svg></a>', 'mk-forkit,[data-is="mk-forkit"]{display:block;position:absolute;top:0;right:0;} mk-forkit > a,[data-is="mk-forkit"] > a{display:block;} mk-forkit > a > svg,[data-is="mk-forkit"] > a > svg{display:block;fill:#87bb35;color:#fff} mk-forkit .octo-arm,[data-is="mk-forkit"] .octo-arm{transform-origin:130px 106px} mk-forkit:hover .octo-arm,[data-is="mk-forkit"]:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@-moz-keyframes octocat-wave{ 0%,100%{transform:rotate(0)} 20%,60%{transform:rotate(-25deg)} 40%,80%{transform:rotate(10deg)}}@-webkit-keyframes octocat-wave{ 0%,100%{transform:rotate(0)} 20%,60%{transform:rotate(-25deg)} 40%,80%{transform:rotate(10deg)}}@-o-keyframes octocat-wave{ 0%,100%{transform:rotate(0)} 20%,60%{transform:rotate(-25deg)} 40%,80%{transform:rotate(10deg)}}@keyframes octocat-wave{ 0%,100%{transform:rotate(0)} 20%,60%{transform:rotate(-25deg)} 40%,80%{transform:rotate(10deg)}}', '', function(opts) {
});

    
  

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-introduction', '<article><h1>Misskeyとは？</h1><p><ruby>Misskey<rt>みすきー</rt></ruby>は、<a href="http://syuilo.com" target="_blank">syuilo</a>が2014年くらいから<a href="https://github.com/syuilo/misskey" target="_blank">オープンソースで</a>開発・運営を行っている、ミニブログベースのSNSです。</p><p>無料で誰でも利用でき、広告も掲載していません。</p><p><a href="{CONFIG.aboutUrl}" target="_blank">もっと知りたい方はこちら</a></p></article>', 'mk-introduction,[data-is="mk-introduction"]{display:block;} mk-introduction h1,[data-is="mk-introduction"] h1{margin:0;text-align:center;font-size:1.2em} mk-introduction p,[data-is="mk-introduction"] p{margin:16px 0;} mk-introduction p:last-child,[data-is="mk-introduction"] p:last-child{margin:0;text-align:center}', '', function(opts) {
});

    
  

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-messaging-form', '<textarea ref="text" onkeypress="{onkeypress}" onpaste="{onpaste}" placeholder="ここにメッセージを入力"></textarea><div class="files"></div><mk-uploader ref="uploader"></mk-uploader><button class="send" onclick="{send}" disabled="{sending}" title="メッセージを送信"><i class="fa fa-paper-plane" if="{!sending}"></i><i class="fa fa-spinner fa-spin" if="{sending}"></i></button><button class="attach-from-local" type="button" title="PCから画像を添付する"><i class="fa fa-upload"></i></button><button class="attach-from-drive" type="button" title="アルバムから画像を添付する"><i class="fa fa-folder-open"></i></button><input name="file" type="file" accept="image/*">', 'mk-messaging-form,[data-is="mk-messaging-form"]{display:block;} mk-messaging-form > textarea,[data-is="mk-messaging-form"] > textarea{cursor:auto;display:block;width:100%;min-width:100%;max-width:100%;height:64px;margin:0;padding:8px;font-size:1em;color:#000;outline:none;border:none;border-top:solid 1px #eee;border-radius:0;box-shadow:none;background:transparent} mk-messaging-form > .send,[data-is="mk-messaging-form"] > .send{position:absolute;bottom:0;right:0;margin:0;padding:10px 14px;line-height:1em;font-size:1em;color:#aaa;transition:color .1s ease;} mk-messaging-form > .send:hover,[data-is="mk-messaging-form"] > .send:hover{color:#87bb35} mk-messaging-form > .send:active,[data-is="mk-messaging-form"] > .send:active{color:#7aa830;transition:color 0s ease} mk-messaging-form .files,[data-is="mk-messaging-form"] .files{display:block;margin:0;padding:0 8px;list-style:none;} mk-messaging-form .files:after,[data-is="mk-messaging-form"] .files:after{content:\'\';display:block;clear:both} mk-messaging-form .files > li,[data-is="mk-messaging-form"] .files > li{display:block;float:left;margin:4px;padding:0;width:64px;height:64px;background-color:#eee;background-repeat:no-repeat;background-position:center center;background-size:cover;cursor:move;} mk-messaging-form .files > li:hover > .remove,[data-is="mk-messaging-form"] .files > li:hover > .remove{display:block} mk-messaging-form .files > li > .remove,[data-is="mk-messaging-form"] .files > li > .remove{display:none;position:absolute;right:-6px;top:-6px;margin:0;padding:0;background:transparent;outline:none;border:none;border-radius:0;box-shadow:none;cursor:pointer} mk-messaging-form .attach-from-local,[data-is="mk-messaging-form"] .attach-from-local,mk-messaging-form .attach-from-drive,[data-is="mk-messaging-form"] .attach-from-drive{margin:0;padding:10px 14px;line-height:1em;font-size:1em;font-weight:normal;text-decoration:none;color:#aaa;transition:color .1s ease;} mk-messaging-form .attach-from-local:hover,[data-is="mk-messaging-form"] .attach-from-local:hover,mk-messaging-form .attach-from-drive:hover,[data-is="mk-messaging-form"] .attach-from-drive:hover{color:#87bb35} mk-messaging-form .attach-from-local:active,[data-is="mk-messaging-form"] .attach-from-local:active,mk-messaging-form .attach-from-drive:active,[data-is="mk-messaging-form"] .attach-from-drive:active{color:#7aa830;transition:color 0s ease} mk-messaging-form input[type=file],[data-is="mk-messaging-form"] input[type=file]{display:none}', '', function(opts) {
		this.mixin('api');

		this.onpaste = e => {
			const data = e.clipboardData;
			const items = data.items;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.kind == 'file') {
					this.upload(item.getAsFile());
				}
			}
		};

		this.onkeypress = e => {
			if ((e.which == 10 || e.which == 13) && e.ctrlKey) {
				this.send();
			}
		};

		this.selectFile = () => {
			this.refs.file.click();
		};

		this.selectFileFromDrive = () => {
			const browser = document.body.appendChild(document.createElement('mk-select-file-from-drive-window'));
			const event = riot.observable();
			riot.mount(browser, {
				multiple: true,
				event: event
			});
			event.one('selected', files => {
				files.forEach(this.addFile);
			});
		};

		this.send = () => {
			this.sending = true;
			this.api('messaging/messages/create', {
				user_id: this.opts.user.id,
				text: this.refs.text.value
			}).then(message => {
				this.clear();
			}).catch(err => {
				console.error(err);
			}).then(() => {
				this.sending = false;
				this.update();
			});
		};

		this.clear = () => {
			this.refs.text.value = '';
			this.files = [];
			this.update();
		};
});

    
  

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-messaging', '<div class="search"><div class="form"><label for="search-input"><i class="fa fa-search"></i></label><input ref="search" type="search" oninput="{search}" onkeydown="{onSearchKeydown}" placeholder="ユーザーを探す"></div><div class="result"><ol class="users" if="{searchResult.length > 0}" ref="searchResult"><li each="{user, i in searchResult}" onkeydown="{parent.onSearchResultKeydown.bind(null, i)}" onclick="{user._click}" tabindex="-1"><img class="avatar" riot-src="{user.avatar_url + \'?thumbnail&size=32\'}" alt=""><span class="name">{user.name}</span><span class="username">@{user.username}</span></li></ol></div></div><div class="history" if="{history.length > 0}"><virtual each="{history}"><a class="user" data-is-me="{is_me}" data-is-read="{is_read}" onclick="{_click}"><div><img class="avatar" riot-src="{(is_me ? recipient.avatar_url : user.avatar_url) + \'?thumbnail&size=64\'}" alt=""><header><span class="name">{is_me ? recipient.name : user.name}</span><span class="username">{\'@\' + (is_me ? recipient.username : user.username )}</span><mk-time time="{created_at}"></mk-time></header><div class="body"><p class="text"><span class="me" if="{is_me}">あなた:</span>{text}</p></div></div></a></virtual></div><p class="no-history" if="{history.length == 0}">履歴はありません。<br>ユーザーを検索して、いつでもメッセージを送受信できます。</p>', 'mk-messaging,[data-is="mk-messaging"]{display:block;} mk-messaging > .search,[data-is="mk-messaging"] > .search{display:block;position:-webkit-sticky;position:sticky;top:0;left:0;z-index:1;width:100%;background:#fff;box-shadow:0 0 2px rgba(0,0,0,0.2);} mk-messaging > .search > .form,[data-is="mk-messaging"] > .search > .form{padding:8px;background:#f7f7f7;} mk-messaging > .search > .form > label,[data-is="mk-messaging"] > .search > .form > label{display:block;position:absolute;top:0;left:8px;z-index:1;height:100%;width:38px;pointer-events:none;} mk-messaging > .search > .form > label > i,[data-is="mk-messaging"] > .search > .form > label > i{display:block;position:absolute;top:0;right:0;bottom:0;left:0;width:1em;height:1em;margin:auto;color:#555} mk-messaging > .search > .form > input,[data-is="mk-messaging"] > .search > .form > input{margin:0;padding:0 12px 0 38px;width:100%;font-size:1em;line-height:38px;color:#000;outline:none;border:solid 1px #eee;border-radius:5px;box-shadow:none;transition:color .5s ease,border .5s ease;} mk-messaging > .search > .form > input:hover,[data-is="mk-messaging"] > .search > .form > input:hover{border:solid 1px #ddd;transition:border .2s ease} mk-messaging > .search > .form > input:focus,[data-is="mk-messaging"] > .search > .form > input:focus{color:#6c962a;border:solid 1px #87bb35;transition:color 0,border 0} mk-messaging > .search > .result,[data-is="mk-messaging"] > .search > .result{display:block;top:0;left:0;z-index:2;width:100%;margin:0;padding:0;background:#fff;} mk-messaging > .search > .result > .users,[data-is="mk-messaging"] > .search > .result > .users{margin:0;padding:0;list-style:none;} mk-messaging > .search > .result > .users > li,[data-is="mk-messaging"] > .search > .result > .users > li{display:inline-block;z-index:1;width:100%;padding:8px 32px;vertical-align:top;white-space:nowrap;overflow:hidden;color:rgba(0,0,0,0.8);text-decoration:none;transition:none;cursor:pointer;} mk-messaging > .search > .result > .users > li:hover,[data-is="mk-messaging"] > .search > .result > .users > li:hover,mk-messaging > .search > .result > .users > li:focus,[data-is="mk-messaging"] > .search > .result > .users > li:focus{color:#fff;background:#87bb35;} mk-messaging > .search > .result > .users > li:hover .name,[data-is="mk-messaging"] > .search > .result > .users > li:hover .name,mk-messaging > .search > .result > .users > li:focus .name,[data-is="mk-messaging"] > .search > .result > .users > li:focus .name{color:#fff} mk-messaging > .search > .result > .users > li:hover .username,[data-is="mk-messaging"] > .search > .result > .users > li:hover .username,mk-messaging > .search > .result > .users > li:focus .username,[data-is="mk-messaging"] > .search > .result > .users > li:focus .username{color:#fff} mk-messaging > .search > .result > .users > li:active,[data-is="mk-messaging"] > .search > .result > .users > li:active{color:#fff;background:#7aa830;} mk-messaging > .search > .result > .users > li:active .name,[data-is="mk-messaging"] > .search > .result > .users > li:active .name{color:#fff} mk-messaging > .search > .result > .users > li:active .username,[data-is="mk-messaging"] > .search > .result > .users > li:active .username{color:#fff} mk-messaging > .search > .result > .users > li .avatar,[data-is="mk-messaging"] > .search > .result > .users > li .avatar{vertical-align:middle;min-width:32px;min-height:32px;max-width:32px;max-height:32px;margin:0 8px 0 0;border-radius:6px} mk-messaging > .search > .result > .users > li .name,[data-is="mk-messaging"] > .search > .result > .users > li .name{margin:0 8px 0 0;font-weight:normal;color:rgba(0,0,0,0.8)} mk-messaging > .search > .result > .users > li .username,[data-is="mk-messaging"] > .search > .result > .users > li .username{font-weight:normal;color:rgba(0,0,0,0.3)} mk-messaging > .history > a,[data-is="mk-messaging"] > .history > a{display:block;text-decoration:none;background:#fff;border-bottom:solid 1px #eee;} mk-messaging > .history > a *,[data-is="mk-messaging"] > .history > a *{pointer-events:none;user-select:none} mk-messaging > .history > a:hover,[data-is="mk-messaging"] > .history > a:hover{background:#fafafa;} mk-messaging > .history > a:hover > .avatar,[data-is="mk-messaging"] > .history > a:hover > .avatar{filter:saturate(200%)} mk-messaging > .history > a:active,[data-is="mk-messaging"] > .history > a:active{background:#eee} mk-messaging > .history > a[data-is-read],[data-is="mk-messaging"] > .history > a[data-is-read],mk-messaging > .history > a[data-is-me],[data-is="mk-messaging"] > .history > a[data-is-me]{opacity:.8} mk-messaging > .history > a:not([data-is-me]):not([data-is-read]) > div,[data-is="mk-messaging"] > .history > a:not([data-is-me]):not([data-is-read]) > div{background-image:url("/assets/unread.svg");background-repeat:no-repeat;background-position:0 center} mk-messaging > .history > a:after,[data-is="mk-messaging"] > .history > a:after{content:"";display:block;clear:both} mk-messaging > .history > a > div,[data-is="mk-messaging"] > .history > a > div{max-width:500px;margin:0 auto;padding:20px 30px;} mk-messaging > .history > a > div:after,[data-is="mk-messaging"] > .history > a > div:after{content:"";display:block;clear:both} mk-messaging > .history > a > div > header,[data-is="mk-messaging"] > .history > a > div > header{margin-bottom:2px;white-space:nowrap;overflow:hidden;} mk-messaging > .history > a > div > header > .name,[data-is="mk-messaging"] > .history > a > div > header > .name{text-align:left;display:inline;margin:0;padding:0;font-size:1em;color:rgba(0,0,0,0.9);font-weight:bold;transition:all .1s ease} mk-messaging > .history > a > div > header > .username,[data-is="mk-messaging"] > .history > a > div > header > .username{text-align:left;margin:0 0 0 8px;color:rgba(0,0,0,0.5)} mk-messaging > .history > a > div > header > mk-time,[data-is="mk-messaging"] > .history > a > div > header > mk-time{position:absolute;top:0;right:0;display:inline;color:rgba(0,0,0,0.5);font-size:80%} mk-messaging > .history > a > div > .avatar,[data-is="mk-messaging"] > .history > a > div > .avatar{float:left;width:54px;height:54px;margin:0 16px 0 0;border-radius:8px;transition:all .1s ease} mk-messaging > .history > a > div > .body > .text,[data-is="mk-messaging"] > .history > a > div > .body > .text{display:block;margin:0 0 0 0;padding:0;overflow:hidden;overflow-wrap:break-word;font-size:1.1em;color:rgba(0,0,0,0.8);} mk-messaging > .history > a > div > .body > .text .me,[data-is="mk-messaging"] > .history > a > div > .body > .text .me{color:rgba(0,0,0,0.4)} mk-messaging > .history > a > div > .body > .image,[data-is="mk-messaging"] > .history > a > div > .body > .image{display:block;max-width:100%;max-height:512px} mk-messaging > .no-history,[data-is="mk-messaging"] > .no-history{margin:0;padding:2em 1em;text-align:center;color:#999;font-weight:500}@media (max-width:400px){ mk-messaging > .search > .result > .users > li,[data-is="mk-messaging"] > .search > .result > .users > li{padding:8px 16px} mk-messaging > .history > a:not([data-is-me]):not([data-is-read]) > div,[data-is="mk-messaging"] > .history > a:not([data-is-me]):not([data-is-read]) > div{background-image:none;border-left:solid 4px #3aa2dc} mk-messaging > .history > a > div,[data-is="mk-messaging"] > .history > a > div{padding:16px;font-size:14px;} mk-messaging > .history > a > div > .avatar,[data-is="mk-messaging"] > .history > a > div > .avatar{margin:0 12px 0 0}}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');

		this.searchResult = [];

		this.on('mount', () => {
			this.api('messaging/history').then(history => {
				this.isLoading = false;
				history.forEach(message => {
					message.is_me = message.user_id == this.I.id
					message._click = () => {
						this.trigger('navigate-user', message.is_me ? message.recipient : message.user);
					};
				});
				this.history = history;
				this.update();
			});
		});

		this.search = () => {
			const q = this.refs.search.value;
			if (q == '') {
				this.searchResult = [];
				return;
			}
			this.api('users/search', {
				query: q,
				max: 5
			}).then(users => {
				users.forEach(user => {
					user._click = () => {
						this.trigger('navigate-user', user);
						this.searchResult = [];
					};
				});
				this.update({
					searchResult: users
				});
			});
		};

		this.onSearchKeydown = e => {
			switch (e.which) {
				case 9:
				case 40:
					e.preventDefault();
					e.stopPropagation();
					this.refs.searchResult.childNodes[0].focus();
					break;
			}
		};

		this.onSearchResultKeydown = (i, e) => {
			const cancel = () => {
				e.preventDefault();
				e.stopPropagation();
			};
			switch (true) {
				case e.which == 10:
				case e.which == 13:
					cancel();
					this.searchResult[i]._click();
					break;

				case e.which == 27:
					cancel();
					this.refs.search.focus();
					break;

				case e.which == 9 && e.shiftKey:
				case e.which == 38:
					cancel();
					(this.refs.searchResult.childNodes[i].previousElementSibling || this.refs.searchResult.childNodes[this.searchResult.length - 1]).focus();
					break;

				case e.which == 9:
				case e.which == 40:
					cancel();
					(this.refs.searchResult.childNodes[i].nextElementSibling || this.refs.searchResult.childNodes[0]).focus();
					break;
			}
		};

});

    
  

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-messaging-message', '<a class="avatar-anchor" href="{CONFIG.url + \'/\' + message.user.username}" title="{message.user.username}" target="_blank"><img class="avatar" riot-src="{message.user.avatar_url + \'?thumbnail&size=64\'}" alt=""></a><div class="content-container"><div class="balloon"><p class="read" if="{message.is_me && message.is_read}">既読</p><button class="delete-button" if="{message.is_me}" title="メッセージを削除"><img src="/assets/desktop/messaging/delete.png" alt="Delete"></button><div class="content" if="{!message.is_deleted}"><div ref="text"></div><div class="image" if="{message.file}"><img riot-src="{message.file.url}" alt="image" title="{message.file.name}"></div></div><div class="content" if="{message.is_deleted}"><p class="is-deleted">このメッセージは削除されました</p></div></div><footer><mk-time time="{message.created_at}"></mk-time><i class="fa fa-pencil is-edited" if="{message.is_edited}"></i></footer></div>', 'mk-messaging-message,[data-is="mk-messaging-message"]{display:block;padding:10px 12px 10px 12px;background-color:transparent;} mk-messaging-message:after,[data-is="mk-messaging-message"]:after{content:"";display:block;clear:both} mk-messaging-message > .avatar-anchor,[data-is="mk-messaging-message"] > .avatar-anchor{display:block;} mk-messaging-message > .avatar-anchor > .avatar,[data-is="mk-messaging-message"] > .avatar-anchor > .avatar{display:block;min-width:54px;min-height:54px;max-width:54px;max-height:54px;margin:0;border-radius:8px;transition:all .1s ease} mk-messaging-message > .content-container,[data-is="mk-messaging-message"] > .content-container{display:block;margin:0 12px;padding:0;max-width:calc(100% - 78px);} mk-messaging-message > .content-container > .balloon,[data-is="mk-messaging-message"] > .content-container > .balloon{display:block;float:inherit;margin:0;padding:0;max-width:100%;min-height:38px;border-radius:16px;} mk-messaging-message > .content-container > .balloon:before,[data-is="mk-messaging-message"] > .content-container > .balloon:before{content:"";pointer-events:none;display:block;position:absolute;top:12px} mk-messaging-message > .content-container > .balloon:hover > .delete-button,[data-is="mk-messaging-message"] > .content-container > .balloon:hover > .delete-button{display:block} mk-messaging-message > .content-container > .balloon > .delete-button,[data-is="mk-messaging-message"] > .content-container > .balloon > .delete-button{display:none;position:absolute;z-index:1;top:-4px;right:-4px;margin:0;padding:0;cursor:pointer;outline:none;border:none;border-radius:0;box-shadow:none;background:transparent;} mk-messaging-message > .content-container > .balloon > .delete-button > img,[data-is="mk-messaging-message"] > .content-container > .balloon > .delete-button > img{vertical-align:bottom;width:16px;height:16px;cursor:pointer} mk-messaging-message > .content-container > .balloon > .read,[data-is="mk-messaging-message"] > .content-container > .balloon > .read{user-select:none;display:block;position:absolute;z-index:1;bottom:-4px;left:-12px;margin:0;color:rgba(0,0,0,0.5);font-size:11px} mk-messaging-message > .content-container > .balloon > .content > .is-deleted,[data-is="mk-messaging-message"] > .content-container > .balloon > .content > .is-deleted{display:block;margin:0;padding:0;overflow:hidden;overflow-wrap:break-word;font-size:1em;color:rgba(0,0,0,0.5)} mk-messaging-message > .content-container > .balloon > .content > [ref=\'text\'],[data-is="mk-messaging-message"] > .content-container > .balloon > .content > [ref=\'text\']{display:block;margin:0;padding:8px 16px;overflow:hidden;overflow-wrap:break-word;font-size:1em;color:rgba(0,0,0,0.8);} mk-messaging-message > .content-container > .balloon > .content > [ref=\'text\'],[data-is="mk-messaging-message"] > .content-container > .balloon > .content > [ref=\'text\'],mk-messaging-message > .content-container > .balloon > .content > [ref=\'text\'] *,[data-is="mk-messaging-message"] > .content-container > .balloon > .content > [ref=\'text\'] *{user-select:text;cursor:auto} mk-messaging-message > .content-container > .balloon > .content > [ref=\'text\'] + .file.image > img,[data-is="mk-messaging-message"] > .content-container > .balloon > .content > [ref=\'text\'] + .file.image > img{border-radius:0 0 16px 16px} mk-messaging-message > .content-container > .balloon > .content > .file.image > img,[data-is="mk-messaging-message"] > .content-container > .balloon > .content > .file.image > img{display:block;max-width:100%;max-height:512px;border-radius:16px} mk-messaging-message > .content-container > footer,[data-is="mk-messaging-message"] > .content-container > footer{display:block;clear:both;margin:0;padding:2px;font-size:10px;color:rgba(0,0,0,0.4);} mk-messaging-message > .content-container > footer > .is-edited,[data-is="mk-messaging-message"] > .content-container > footer > .is-edited{margin-left:4px} mk-messaging-message:not([data-is-me=\'true\']) > .avatar-anchor,[data-is="mk-messaging-message"]:not([data-is-me=\'true\']) > .avatar-anchor{float:left} mk-messaging-message:not([data-is-me=\'true\']) > .content-container,[data-is="mk-messaging-message"]:not([data-is-me=\'true\']) > .content-container{float:left;} mk-messaging-message:not([data-is-me=\'true\']) > .content-container > .balloon,[data-is="mk-messaging-message"]:not([data-is-me=\'true\']) > .content-container > .balloon{background:#eee;} mk-messaging-message:not([data-is-me=\'true\']) > .content-container > .balloon:before,[data-is="mk-messaging-message"]:not([data-is-me=\'true\']) > .content-container > .balloon:before{left:-14px;border-top:solid 8px transparent;border-right:solid 8px #eee;border-bottom:solid 8px transparent;border-left:solid 8px transparent} mk-messaging-message:not([data-is-me=\'true\']) > .content-container > footer,[data-is="mk-messaging-message"]:not([data-is-me=\'true\']) > .content-container > footer{text-align:left} mk-messaging-message[data-is-me=\'true\'] > .avatar-anchor,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .avatar-anchor{float:right} mk-messaging-message[data-is-me=\'true\'] > .content-container,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container{float:right;} mk-messaging-message[data-is-me=\'true\'] > .content-container > .balloon,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > .balloon{background:#23a7b6;} mk-messaging-message[data-is-me=\'true\'] > .content-container > .balloon:before,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > .balloon:before{right:-14px;left:auto;border-top:solid 8px transparent;border-right:solid 8px transparent;border-bottom:solid 8px transparent;border-left:solid 8px #23a7b6} mk-messaging-message[data-is-me=\'true\'] > .content-container > .balloon > .content > p.is-deleted,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > .balloon > .content > p.is-deleted{color:rgba(255,255,255,0.5)} mk-messaging-message[data-is-me=\'true\'] > .content-container > .balloon > .content > [ref=\'text\'],[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > .balloon > .content > [ref=\'text\'],mk-messaging-message[data-is-me=\'true\'] > .content-container > .balloon > .content > [ref=\'text\'] *,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > .balloon > .content > [ref=\'text\'] *{color:#fff !important} mk-messaging-message[data-is-me=\'true\'] > .content-container > footer,[data-is="mk-messaging-message"][data-is-me=\'true\'] > .content-container > footer{text-align:right} mk-messaging-message[data-is-deleted=\'true\'] > .content-container,[data-is="mk-messaging-message"][data-is-deleted=\'true\'] > .content-container{opacity:.5}', 'data-is-me="{message.is_me}"', function(opts) {

		this.mixin('i');

		this.message = this.opts.message;
		this.message.is_me = this.message.user.id == this.I.id;

		this.on('mount', () => {
			if (this.message.text) {
				const tokens = this.message.ast;

				this.refs.text.innerHTML = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(tokens);

				this.refs.text.children.forEach(e => {
					if (e.tagName == 'MK-URL') riot.mount(e);
				});

				tokens
					.filter(t => t.type == 'link')
					.map(t => {
						const el = this.refs.text.appendChild(document.createElement('mk-url-preview'));
						riot.mount(el, {
							url: t.content
						});
					});
			}
		});
});

    
  

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_messaging_stream__ = __webpack_require__(53);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-messaging-room', '<div class="stream"><p class="init" if="{init}"><i class="fa fa-spinner fa-spin"></i>読み込み中</p><p class="empty" if="{!init && messages.length == 0}"><i class="fa fa-info-circle"></i>このユーザーと話したことはありません</p><virtual each="{message, i in messages}"><mk-messaging-message message="{message}"></mk-messaging-message><p class="date" if="{i != messages.length - 1 && message._date != messages[i + 1]._date}"><span>{messages[i + 1]._datetext}</span></p></virtual></div><footer><div ref="notifications"></div><div class="grippie" title="ドラッグしてフォームの広さを調整"></div><mk-messaging-form user="{user}"></mk-messaging-form></footer>', 'mk-messaging-room,[data-is="mk-messaging-room"]{display:block;} mk-messaging-room > .stream,[data-is="mk-messaging-room"] > .stream{max-width:600px;margin:0 auto;} mk-messaging-room > .stream > .empty,[data-is="mk-messaging-room"] > .stream > .empty{width:100%;margin:0;padding:16px 8px 8px 8px;text-align:center;font-size:.8em;color:rgba(0,0,0,0.4);} mk-messaging-room > .stream > .empty i,[data-is="mk-messaging-room"] > .stream > .empty i{margin-right:4px} mk-messaging-room > .stream > .no-history,[data-is="mk-messaging-room"] > .stream > .no-history{display:block;margin:0;padding:16px;text-align:center;font-size:.8em;color:rgba(0,0,0,0.4);} mk-messaging-room > .stream > .no-history i,[data-is="mk-messaging-room"] > .stream > .no-history i{margin-right:4px} mk-messaging-room > .stream > .date,[data-is="mk-messaging-room"] > .stream > .date{display:block;margin:8px 0;text-align:center;} mk-messaging-room > .stream > .date:before,[data-is="mk-messaging-room"] > .stream > .date:before{content:\'\';display:block;position:absolute;height:1px;width:90%;top:16px;left:0;right:0;margin:0 auto;background:rgba(0,0,0,0.1)} mk-messaging-room > .stream > .date > span,[data-is="mk-messaging-room"] > .stream > .date > span{display:inline-block;margin:0;padding:0 16px;line-height:32px;color:rgba(0,0,0,0.3);background:#fff} mk-messaging-room > footer,[data-is="mk-messaging-room"] > footer{position:-webkit-sticky;position:sticky;z-index:2;bottom:0;width:100%;max-width:600px;margin:0 auto;padding:0;background:rgba(255,255,255,0.95);background-clip:content-box;} mk-messaging-room > footer > [ref=\'notifications\'],[data-is="mk-messaging-room"] > footer > [ref=\'notifications\']{position:absolute;top:-48px;width:100%;padding:8px 0;text-align:center;} mk-messaging-room > footer > [ref=\'notifications\'] > p,[data-is="mk-messaging-room"] > footer > [ref=\'notifications\'] > p{display:inline-block;margin:0;padding:0 12px 0 28px;cursor:pointer;line-height:32px;font-size:12px;color:#fff;background:#87bb35;border-radius:16px;transition:opacity 1s ease;} mk-messaging-room > footer > [ref=\'notifications\'] > p > i,[data-is="mk-messaging-room"] > footer > [ref=\'notifications\'] > p > i{position:absolute;top:0;left:10px;line-height:32px;font-size:16px} mk-messaging-room > footer > .grippie,[data-is="mk-messaging-room"] > footer > .grippie{height:10px;margin-top:-10px;background:transparent;cursor:ns-resize;}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');

		this.user = this.opts.user;
		this.init = true;
		this.sending = false;
		this.messages = [];
		this.isNaked = this.opts.isNaked;

		this.connection = new __WEBPACK_IMPORTED_MODULE_0__scripts_messaging_stream__["a" /* default */](this.I, this.user.id);

		this.on('mount', () => {
			this.connection.event.on('message', this.onMessage);
			this.connection.event.on('read', this.onRead);

			document.addEventListener('visibilitychange', this.onVisibilitychange);

			this.api('messaging/messages', {
				user_id: this.user.id
			}).then(messages => {
				this.init = false;
				this.messages = messages.reverse();
				this.update();
				this.scrollToBottom();
			});
		});

		this.on('unmount', () => {
			this.connection.event.off('message', this.onMessage);
			this.connection.event.off('read', this.onRead);
			this.connection.close();

			document.removeEventListener('visibilitychange', this.onVisibilitychange);
		});

		this.on('update', () => {
			this.messages.forEach(message => {
				const date = (new Date(message.created_at)).getDate();
				const month = (new Date(message.created_at)).getMonth() + 1;
				message._date = date;
				message._datetext = month + '月 ' + date + '日';
			});
		});

		this.onMessage = (message) => {
			const isBottom = this.isBottom();

			this.messages.push(message);
			if (message.user_id != this.I.id && !document.hidden) {
				this.connection.socket.send(JSON.stringify({
					type: 'read',
					id: message.id
				}));
			}
			this.update();

			if (isBottom) {

				this.scrollToBottom();
			} else if (message.user_id != this.I.id) {

				this.notify('新しいメッセージがあります');
			}
		};

		this.onRead = ids => {
			if (!Array.isArray(ids)) ids = [ids];
			ids.forEach(id => {
				if (this.messages.some(x => x.id == id)) {
					const exist = this.messages.map(x => x.id).indexOf(id);
					this.messages[exist].is_read = true;
					this.update();
				}
			});
		};

		this.isBottom = () => {
			const asobi = 32;
			const current = this.isNaked
				? window.scrollY + window.innerHeight
				: this.root.scrollTop + this.root.offsetHeight;
			const max = this.isNaked
				? document.body.offsetHeight
				: this.root.scrollHeight;
			return current > (max - asobi);
		};

		this.scrollToBottom = () => {
			if (this.isNaked) {
				window.scroll(0, document.body.offsetHeight);
			} else {
				this.root.scrollTop = this.root.scrollHeight;
			}
		};

		this.notify = message => {
			const n = document.createElement('p');
			n.innerHTML = '<i class="fa fa-arrow-circle-down"></i>' + message;
			n.onclick = () => {
				this.scrollToBottom();
				n.parentNode.removeChild(n);
			};
			this.refs.notifications.appendChild(n);

			setTimeout(() => {
				n.style.opacity = 0;
				setTimeout(() => n.parentNode.removeChild(n), 1000);
			}, 4000);
		};

		this.onVisibilitychange = () => {
			if (document.hidden) return;
			this.messages.forEach(message => {
				if (message.user_id !== this.I.id && !message.is_read) {
					this.connection.socket.send(JSON.stringify({
						type: 'read',
						id: message.id
					}));
				}
			});
		};
});

    
  

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-number', '', 'mk-number,[data-is="mk-number"]{display:inline}', '', function(opts) {
		this.on('mount', () => {

			let value = this.opts.riotValue;
			const max = this.opts.max;

			if (max != null && value > max) value = max;

			this.root.innerHTML = value.toLocaleString();
		});
});

    
  

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-poll-editor', '<p class="caution" if="{choices.length < 2}"><i class="fa fa-exclamation-triangle"></i>投票には、選択肢が最低2つ必要です </p><ul ref="choices"><li each="{choice, i in choices}"><input riot-value="{choice}" oninput="{oninput.bind(null, i)}" placeholder="{\'選択肢\' + (i + 1)}"><button onclick="{remove.bind(null, i)}" title="この選択肢を削除"><i class="fa fa-times"></i></button></li></ul><button class="add" if="{choices.length < 10}" onclick="{add}">+選択肢を追加</button><button class="destroy" onclick="{destroy}" title="投票を破棄"><i class="fa fa-times"></i></button>', 'mk-poll-editor,[data-is="mk-poll-editor"]{display:block;padding:8px;} mk-poll-editor > .caution,[data-is="mk-poll-editor"] > .caution{margin:0 0 8px 0;font-size:.8em;color:#f00;} mk-poll-editor > .caution > i,[data-is="mk-poll-editor"] > .caution > i{margin-right:4px} mk-poll-editor > ul,[data-is="mk-poll-editor"] > ul{display:block;margin:0;padding:0;list-style:none;} mk-poll-editor > ul > li,[data-is="mk-poll-editor"] > ul > li{display:block;margin:8px 0;padding:0;width:100%;} mk-poll-editor > ul > li:first-child,[data-is="mk-poll-editor"] > ul > li:first-child{margin-top:0} mk-poll-editor > ul > li:last-child,[data-is="mk-poll-editor"] > ul > li:last-child{margin-bottom:0} mk-poll-editor > ul > li > input,[data-is="mk-poll-editor"] > ul > li > input{padding:6px;border:solid 1px rgba(135,187,53,0.1);border-radius:4px;} mk-poll-editor > ul > li > input:hover,[data-is="mk-poll-editor"] > ul > li > input:hover{border-color:rgba(135,187,53,0.2)} mk-poll-editor > ul > li > input:focus,[data-is="mk-poll-editor"] > ul > li > input:focus{border-color:rgba(135,187,53,0.5)} mk-poll-editor > ul > li > button,[data-is="mk-poll-editor"] > ul > li > button{padding:4px 8px;color:rgba(135,187,53,0.4);} mk-poll-editor > ul > li > button:hover,[data-is="mk-poll-editor"] > ul > li > button:hover{color:rgba(135,187,53,0.6)} mk-poll-editor > ul > li > button:active,[data-is="mk-poll-editor"] > ul > li > button:active{color:#5f8325} mk-poll-editor > .add,[data-is="mk-poll-editor"] > .add{margin:8px 0 0 0;vertical-align:top;color:#87bb35} mk-poll-editor > .destroy,[data-is="mk-poll-editor"] > .destroy{position:absolute;top:0;right:0;padding:4px 8px;color:rgba(135,187,53,0.4);} mk-poll-editor > .destroy:hover,[data-is="mk-poll-editor"] > .destroy:hover{color:rgba(135,187,53,0.6)} mk-poll-editor > .destroy:active,[data-is="mk-poll-editor"] > .destroy:active{color:#5f8325}', '', function(opts) {
		this.choices = ['', ''];

		this.oninput = (i, e) => {
			this.choices[i] = e.target.value;
		};

		this.add = () => {
			this.choices.push('');
			this.update();
			this.refs.choices.childNodes[this.choices.length - 1].childNodes[0].focus();
		};

		this.remove = (i) => {
			this.choices = this.choices.filter((_, _i) => _i != i);
			this.update();
		};

		this.destroy = () => {
			this.opts.ondestroy();
		};

		this.get = () => {
			return {
				choices: this.choices.filter(choice => choice != '')
			}
		};

		this.set = data => {
			if (data.choices.length == 0) return;
			this.choices = data.choices;
		};
});

    
  

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-poll', '<ul><li each="{poll.choices}" onclick="{vote.bind(null, id)}" class="{voted: voted}" title="{!parent.isVoted ? \'「\' + text + \'」に投票する\' : \'\'}"><div class="backdrop" riot-style="{\'width:\' + (parent.result ? (votes / parent.total * 100) : 0) + \'%\'}"></div><span><i class="fa fa-check" if="{is_voted}"></i> {text} <span class="votes" if="{parent.result}">({votes}票)</span></span></li></ul><p if="{total > 0}"><span>{total}人が投票</span> ・ <a if="{!isVoted}" onclick="{toggleResult}">{result ? \'投票する\' : \'結果を見る\'}</a><span if="{isVoted}">投票済み</span></p>', 'mk-poll,[data-is="mk-poll"]{display:block;} mk-poll > ul,[data-is="mk-poll"] > ul{display:block;margin:0;padding:0;list-style:none;} mk-poll > ul > li,[data-is="mk-poll"] > ul > li{display:block;margin:4px 0;padding:4px 8px;width:100%;border:solid 1px #eee;border-radius:4px;overflow:hidden;cursor:pointer;} mk-poll > ul > li:hover,[data-is="mk-poll"] > ul > li:hover{background:rgba(0,0,0,0.05)} mk-poll > ul > li:active,[data-is="mk-poll"] > ul > li:active{background:rgba(0,0,0,0.1)} mk-poll > ul > li > .backdrop,[data-is="mk-poll"] > ul > li > .backdrop{position:absolute;top:0;left:0;height:100%;background:#87bb35;transition:width 1s ease} mk-poll > ul > li > .votes,[data-is="mk-poll"] > ul > li > .votes{margin-left:4px} mk-poll > p a,[data-is="mk-poll"] > p a{color:inherit} mk-poll[data-is-voted] > ul > li,[data-is="mk-poll"][data-is-voted] > ul > li{cursor:default;} mk-poll[data-is-voted] > ul > li:hover,[data-is="mk-poll"][data-is-voted] > ul > li:hover{background:transparent} mk-poll[data-is-voted] > ul > li:active,[data-is="mk-poll"][data-is-voted] > ul > li:active{background:transparent}', 'data-is-voted="{isVoted}"', function(opts) {
		this.mixin('api');

		this.init = post => {
			this.post = post;
			this.poll = this.post.poll;
			this.total = this.poll.choices.reduce((a, b) => a + b.votes, 0);
			this.isVoted = this.poll.choices.some(c => c.is_voted);
			this.result = this.isVoted;
			this.update();
		};

		this.init(this.opts.post);

		this.toggleResult = () => {
			this.result = !this.result;
		};

		this.vote = id => {
			if (this.poll.choices.some(c => c.is_voted)) return;
			this.api('posts/polls/vote', {
				post_id: this.post.id,
				choice: id
			}).then(() => {
				this.poll.choices.forEach(c => {
					if (c.id == id) {
						c.votes++;
						c.is_voted = true;
					}
				});
				this.update({
					poll: this.poll,
					isVoted: true,
					result: true,
					total: this.total + 1
				});
			});
		};
});

    
  

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);

    var riot = __webpack_require__(0)
    riot.tag2('mk-public-timeline', '<inside-renderer each="{posts}"></inside-renderer>', 'mk-public-timeline,[data-is="mk-public-timeline"]{display:block}', '', function(opts) {
		this.mixin('api');

		this.posts = [];
		this.isFetching = true;

		this.on('mount', () => {
			this.api('posts', {
				limit: 5,
				repost: false,
				reply: false,
				media: false,
				poll: false
			}).then(posts => {
				this.update({
					isFetching: false,
					posts: posts
				});
			});
		});
});


riot.tag2('inside-renderer', '<article><img riot-src="{user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div><header><span class="name">{user.name}</span><span class="username">@{user.username}</span></header><div class="body"><div class="text" ref="text"></div></div></div></article>', 'inside-renderer,[data-is="inside-renderer"]{display:block;} inside-renderer > article,[data-is="inside-renderer"] > article{padding:28px;border-bottom:solid 1px #eee;} inside-renderer > article:last-child,[data-is="inside-renderer"] > article:last-child{border-bottom:none} inside-renderer > article > img,[data-is="inside-renderer"] > article > img{display:block;position:absolute;width:58px;height:58px;margin:0;border-radius:100%;vertical-align:bottom} inside-renderer > article > div,[data-is="inside-renderer"] > article > div{min-height:58px;padding-left:68px;} inside-renderer > article > div > header,[data-is="inside-renderer"] > article > div > header{margin-bottom:2px;} inside-renderer > article > div > header > .name,[data-is="inside-renderer"] > article > div > header > .name{margin:0 .5em 0 0;padding:0;color:#777} inside-renderer > article > div > header > .username,[data-is="inside-renderer"] > article > div > header > .username{margin:0 .5em 0 0;color:#ccc} inside-renderer > article > div > .body > .text,[data-is="inside-renderer"] > article > div > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.1em;color:#717171}', '', function(opts) {

		this.on('mount', () => {
			const html = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(this.ast);
			this.refs.text.innerHTML = html;

			this.refs.text.children.forEach(e => {
				if (e.tagName == 'MK-URL') riot.mount(e);
			});

			this.ast
			.filter(t => (t.type == 'url' || t.type == 'link') && !t.silent)
			.map(t => {
				riot.mount(this.refs.text.appendChild(document.createElement('mk-url-preview')), {
					url: t.url
				});
			});
		});
});

    
  

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-raw', '', 'mk-raw,[data-is="mk-raw"]{display:inline}', '', function(opts) {
		this.root.innerHTML = this.opts.content;
});

    
  

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-reaction-icon', '<virtual if="{opts.reaction == \'like\'}">👍</virtual><virtual if="{opts.reaction == \'love\'}">❤️</virtual><virtual if="{opts.reaction == \'laugh\'}">😆</virtual><virtual if="{opts.reaction == \'hmm\'}">🤔</virtual><virtual if="{opts.reaction == \'surprise\'}">😮</virtual><virtual if="{opts.reaction == \'congrats\'}">🎉</virtual>', 'mk-reaction-icon,[data-is="mk-reaction-icon"]{display:inline}', '', function(opts) {
});

    
  

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-reaction-picker', '<div class="backdrop" ref="backdrop" onclick="{close}"></div><div class="popover {compact: opts.compact}" ref="popover"><p if="{!opts.compact}">{title}</p><div><button onclick="{react.bind(null, \'like\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="1" title="Like"><mk-reaction-icon reaction="like"></mk-reaction-icon></button><button onclick="{react.bind(null, \'love\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="2" title="Love"><mk-reaction-icon reaction="love"></mk-reaction-icon></button><button onclick="{react.bind(null, \'laugh\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="3" title="Laugh"><mk-reaction-icon reaction="laugh"></mk-reaction-icon></button><button onclick="{react.bind(null, \'hmm\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="4" title="Hmm...?"><mk-reaction-icon reaction="hmm"></mk-reaction-icon></button><button onclick="{react.bind(null, \'surprise\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="5" title="Wow"><mk-reaction-icon reaction="surprise"></mk-reaction-icon></button><button onclick="{react.bind(null, \'congrats\')}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" tabindex="6" title="Congrats!"><mk-reaction-icon reaction="congrats"></mk-reaction-icon></button></div></div>', 'mk-reaction-picker,[data-is="mk-reaction-picker"]{display:block;position:initial;} mk-reaction-picker > .backdrop,[data-is="mk-reaction-picker"] > .backdrop{position:fixed;top:0;left:0;z-index:10000;width:100%;height:100%;background:rgba(0,0,0,0.1);opacity:0} mk-reaction-picker > .popover,[data-is="mk-reaction-picker"] > .popover{position:absolute;z-index:10001;background:#fff;border:1px solid rgba(27,31,35,0.15);border-radius:4px;box-shadow:0 3px 12px rgba(27,31,35,0.15);transform:scale(.5);opacity:0;} mk-reaction-picker > .popover:not(.compact),[data-is="mk-reaction-picker"] > .popover:not(.compact){margin-top:16px;transform-origin:center top;} mk-reaction-picker > .popover:not(.compact):before,[data-is="mk-reaction-picker"] > .popover:not(.compact):before{content:"";display:block;position:absolute;top:-32px;left:calc(50% - 16px);border-top:solid 16px transparent;border-left:solid 16px transparent;border-right:solid 16px transparent;border-bottom:solid 16px rgba(27,31,35,0.15)} mk-reaction-picker > .popover:not(.compact):after,[data-is="mk-reaction-picker"] > .popover:not(.compact):after{content:"";display:block;position:absolute;top:-30.5px;left:calc(50% - 16px);border-top:solid 16px transparent;border-left:solid 16px transparent;border-right:solid 16px transparent;border-bottom:solid 16px #fff} mk-reaction-picker > .popover > p,[data-is="mk-reaction-picker"] > .popover > p{display:block;margin:0;padding:8px 10px;font-size:14px;color:#586069;border-bottom:solid 1px #e1e4e8} mk-reaction-picker > .popover > div,[data-is="mk-reaction-picker"] > .popover > div{padding:4px;} mk-reaction-picker > .popover > div > button,[data-is="mk-reaction-picker"] > .popover > div > button{width:40px;height:40px;font-size:24px;border-radius:2px;} mk-reaction-picker > .popover > div > button:hover,[data-is="mk-reaction-picker"] > .popover > div > button:hover{background:#eee} mk-reaction-picker > .popover > div > button:active,[data-is="mk-reaction-picker"] > .popover > div > button:active{background:#87bb35;box-shadow:inset 0 .15em .3em rgba(27,31,35,0.15)}', '', function(opts) {

		this.mixin('api');

		this.post = this.opts.post;
		this.source = this.opts.source;

		const placeholder = 'Pick your reaction';

		this.title = placeholder;

		this.onmouseover = e => {
			this.update({
				title: e.target.title
			});
		};

		this.onmouseout = () => {
			this.update({
				title: placeholder
			});
		};

		this.on('mount', () => {
			const rect = this.source.getBoundingClientRect();
			const width = this.refs.popover.offsetWidth;
			const height = this.refs.popover.offsetHeight;
			if (this.opts.compact) {
				const x = rect.left + window.pageXOffset + (this.source.offsetWidth / 2);
				const y = rect.top + window.pageYOffset + (this.source.offsetHeight / 2);
				this.refs.popover.style.left = (x - (width / 2)) + 'px';
				this.refs.popover.style.top = (y - (height / 2)) + 'px';
			} else {
				const x = rect.left + window.pageXOffset + (this.source.offsetWidth / 2);
				const y = rect.top + window.pageYOffset + this.source.offsetHeight;
				this.refs.popover.style.left = (x - (width / 2)) + 'px';
				this.refs.popover.style.top = y + 'px';
			}

			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.backdrop,
				opacity: 1,
				duration: 100,
				easing: 'linear'
			});

			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.popover,
				opacity: 1,
				scale: [0.5, 1],
				duration: 500
			});
		});

		this.react = reaction => {
			this.api('posts/reactions/create', {
				post_id: this.post.id,
				reaction: reaction
			}).then(() => {
				if (this.opts.cb) this.opts.cb();
				this.unmount();
			});
		};

		this.close = () => {
			this.refs.backdrop.style.pointerEvents = 'none';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.backdrop,
				opacity: 0,
				duration: 200,
				easing: 'linear'
			});

			this.refs.popover.style.pointerEvents = 'none';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.popover,
				opacity: 0,
				scale: 0.5,
				duration: 200,
				easing: 'easeInBack',
				complete: () => this.unmount()
			});
		};
});

    
  

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-reactions-viewer', '<virtual if="{reactions}"><span if="{reactions.like}"><mk-reaction-icon reaction="like"></mk-reaction-icon><span>{reactions.like}</span></span><span if="{reactions.love}"><mk-reaction-icon reaction="love"></mk-reaction-icon><span>{reactions.love}</span></span><span if="{reactions.laugh}"><mk-reaction-icon reaction="laugh"></mk-reaction-icon><span>{reactions.laugh}</span></span><span if="{reactions.hmm}"><mk-reaction-icon reaction="hmm"></mk-reaction-icon><span>{reactions.hmm}</span></span><span if="{reactions.surprise}"><mk-reaction-icon reaction="surprise"></mk-reaction-icon><span>{reactions.surprise}</span></span><span if="{reactions.congrats}"><mk-reaction-icon reaction="congrats"></mk-reaction-icon><span>{reactions.congrats}</span></span></virtual>', 'mk-reactions-viewer,[data-is="mk-reactions-viewer"]{display:block;border-top:dashed 1px #eee;border-bottom:dashed 1px #eee;margin:4px 0;} mk-reactions-viewer:empty,[data-is="mk-reactions-viewer"]:empty{display:none} mk-reactions-viewer > span,[data-is="mk-reactions-viewer"] > span{margin-right:8px;} mk-reactions-viewer > span > mk-reaction-icon,[data-is="mk-reactions-viewer"] > span > mk-reaction-icon{font-size:1.4em} mk-reactions-viewer > span > span,[data-is="mk-reactions-viewer"] > span > span{margin-left:4px;font-size:1.2em;color:#444}', '', function(opts) {
		this.post = this.opts.post;

		this.on('mount', () => {
			this.update();
		});

		this.on('update', () => {
			this.reactions = this.post.reaction_counts;
		});
});

    
  

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-signin-history', '<div class="records" if="{history.length != 0}"><div each="{history}"><mk-time time="{created_at}"></mk-time><header><i class="fa fa-check" if="{success}"></i><i class="fa fa-times" if="{!success}"></i><span class="ip">{ip}</span></header><pre><code>{JSON.stringify(headers, null, \'    \')}</code></pre></div></div>', 'mk-signin-history,[data-is="mk-signin-history"]{display:block;} mk-signin-history > .records > div,[data-is="mk-signin-history"] > .records > div{padding:16px 0 0 0;border-bottom:solid 1px #eee;} mk-signin-history > .records > div > header > i,[data-is="mk-signin-history"] > .records > div > header > i{margin-right:8px;} mk-signin-history > .records > div > header > i.fa-check,[data-is="mk-signin-history"] > .records > div > header > i.fa-check{color:#0fda82} mk-signin-history > .records > div > header > i.fa-times,[data-is="mk-signin-history"] > .records > div > header > i.fa-times{color:#ff3100} mk-signin-history > .records > div > header > .ip,[data-is="mk-signin-history"] > .records > div > header > .ip{display:inline-block;color:#444;background:#f8f8f8} mk-signin-history > .records > div > mk-time,[data-is="mk-signin-history"] > .records > div > mk-time{position:absolute;top:16px;right:0;color:#777} mk-signin-history > .records > div > pre,[data-is="mk-signin-history"] > .records > div > pre{overflow:auto;max-height:100px;} mk-signin-history > .records > div > pre > code,[data-is="mk-signin-history"] > .records > div > pre > code{white-space:pre-wrap;word-break:break-all;color:#4a535a}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.history = [];
		this.fetching = true;

		this.on('mount', () => {
			this.api('i/signin_history').then(history => {
				this.update({
					fetching: false,
					history: history
				});
			});

			this.stream.on('signin', this.onSignin);
		});

		this.on('unmount', () => {
			this.stream.off('signin', this.onSignin);
		});

		this.onSignin = signin => {
			this.history.unshift(signin);
			this.update();
		};
});

    
  

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-signin', '<form class="{signing: signing}" onsubmit="{onsubmit}"><label class="user-name"><input ref="username" type="text" pattern="^[a-zA-Z0-9-]+$" placeholder="ユーザー名" autofocus="autofocus" required="required" oninput="{oninput}"><i class="fa fa-at"></i></label><label class="password"><input ref="password" type="password" placeholder="パスワード" required="required"><i class="fa fa-lock"></i></label><button type="submit" disabled="{signing}">{signing ? \'やっています...\' : \'サインイン\'}</button></form>', 'mk-signin,[data-is="mk-signin"]{display:block;} mk-signin > form,[data-is="mk-signin"] > form{display:block;z-index:2;} mk-signin > form.signing,[data-is="mk-signin"] > form.signing,mk-signin > form.signing *,[data-is="mk-signin"] > form.signing *{cursor:wait !important} mk-signin > form label,[data-is="mk-signin"] > form label{display:block;margin:12px 0;} mk-signin > form label i,[data-is="mk-signin"] > form label i{display:block;pointer-events:none;position:absolute;bottom:0;top:0;left:0;z-index:1;margin:auto;padding:0 16px;height:1em;color:#898786} mk-signin > form label input[type=text],[data-is="mk-signin"] > form label input[type=text],mk-signin > form label input[type=password],[data-is="mk-signin"] > form label input[type=password]{user-select:text;display:inline-block;cursor:auto;padding:0 0 0 38px;margin:0;width:100%;line-height:44px;font-size:1em;color:rgba(0,0,0,0.7);background:#fff;outline:none;border:solid 1px #eee;border-radius:4px;} mk-signin > form label input[type=text]:hover,[data-is="mk-signin"] > form label input[type=text]:hover,mk-signin > form label input[type=password]:hover,[data-is="mk-signin"] > form label input[type=password]:hover{background:rgba(255,255,255,0.7);border-color:#ddd;} mk-signin > form label input[type=text]:hover + i,[data-is="mk-signin"] > form label input[type=text]:hover + i,mk-signin > form label input[type=password]:hover + i,[data-is="mk-signin"] > form label input[type=password]:hover + i{color:#797776} mk-signin > form label input[type=text]:focus,[data-is="mk-signin"] > form label input[type=text]:focus,mk-signin > form label input[type=password]:focus,[data-is="mk-signin"] > form label input[type=password]:focus{background:#fff;border-color:#ccc;} mk-signin > form label input[type=text]:focus + i,[data-is="mk-signin"] > form label input[type=text]:focus + i,mk-signin > form label input[type=password]:focus + i,[data-is="mk-signin"] > form label input[type=password]:focus + i{color:#797776} mk-signin > form [type=submit],[data-is="mk-signin"] > form [type=submit]{cursor:pointer;padding:16px;margin:-6px 0 0 0;width:100%;font-size:1.2em;color:rgba(0,0,0,0.5);outline:none;border:none;border-radius:0;background:transparent;transition:all .5s ease;} mk-signin > form [type=submit]:hover,[data-is="mk-signin"] > form [type=submit]:hover{color:#87bb35;transition:all .2s ease} mk-signin > form [type=submit]:focus,[data-is="mk-signin"] > form [type=submit]:focus{color:#87bb35;transition:all .2s ease} mk-signin > form [type=submit]:active,[data-is="mk-signin"] > form [type=submit]:active{color:#5f8325;transition:all .2s ease} mk-signin > form [type=submit]:disabled,[data-is="mk-signin"] > form [type=submit]:disabled{opacity:.7}', '', function(opts) {
		this.mixin('api');

		this.user = null;
		this.signing = false;

		this.oninput = () => {
			this.api('users/show', {
				username: this.refs.username.value
			}).then(user => {
				this.user = user;
				this.trigger('user', user);
				this.update();
			});
		};

		this.onsubmit = e => {
			e.preventDefault();

			if (this.refs.username.value == '') {
				this.refs.username.focus();
				return false;
			}
			if (this.refs.password.value == '') {
				this.refs.password.focus();
				return false;
			}

			this.update({
				signing: true
			});

			this.api('signin', {
				username: this.refs.username.value,
				password: this.refs.password.value
			}).then(() => {
				location.reload();
			}).catch(() => {
				alert('something happened');
				this.update({
					signing: false
				});
			});

			return false;
		};
});

    
  

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-signup', '<form onsubmit="{onsubmit}" autocomplete="off"><label class="username"><p class="caption"><i class="fa fa-at"></i>ユーザー名</p><input ref="username" type="text" pattern="^[a-zA-Z0-9-]{3,20}$" placeholder="a~z、A~Z、0~9、-" autocomplete="off" required="required" onkeyup="{onChangeUsername}"><p class="profile-page-url-preview" if="{refs.username.value != \'\' && username-state != \'invalidFormat\' && username-state != \'minRange\' && username-state != \'maxRange\'}">{CONFIG.url + \'/\' + refs.username.value}</p><p class="info" if="{usernameState == \'wait\'}" style="color:#999"><i class="fa fa-fw fa-spinner fa-pulse"></i>確認しています...</p><p class="info" if="{usernameState == \'ok\'}" style="color:#3CB7B5"><i class="fa fa-fw fa-check"></i>利用できます</p><p class="info" if="{usernameState == \'unavailable\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>既に利用されています</p><p class="info" if="{usernameState == \'error\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>通信エラー</p><p class="info" if="{usernameState == \'invalid-format\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>a~z、A~Z、0~9、-(ハイフン)が使えます</p><p class="info" if="{usernameState == \'min-range\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>3文字以上でお願いします！</p><p class="info" if="{usernameState == \'max-range\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>20文字以内でお願いします</p></label><label class="password"><p class="caption"><i class="fa fa-lock"></i>パスワード</p><input ref="password" type="password" placeholder="8文字以上を推奨します" autocomplete="off" required="required" onkeyup="{onChangePassword}"><div class="meter" if="{passwordStrength != \'\'}" data-strength="{passwordStrength}"><div class="value" ref="passwordMetar"></div></div><p class="info" if="{passwordStrength == \'low\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>弱いパスワード</p><p class="info" if="{passwordStrength == \'medium\'}" style="color:#3CB7B5"><i class="fa fa-fw fa-check"></i>まあまあのパスワード</p><p class="info" if="{passwordStrength == \'high\'}" style="color:#3CB7B5"><i class="fa fa-fw fa-check"></i>強いパスワード</p></label><label class="retype-password"><p class="caption"><i class="fa fa-lock"></i>パスワード(再入力)</p><input ref="passwordRetype" type="password" placeholder="確認のため再入力してください" autocomplete="off" required="required" onkeyup="{onChangePasswordRetype}"><p class="info" if="{passwordRetypeState == \'match\'}" style="color:#3CB7B5"><i class="fa fa-fw fa-check"></i>確認されました</p><p class="info" if="{passwordRetypeState == \'not-match\'}" style="color:#FF1161"><i class="fa fa-fw fa-exclamation-triangle"></i>一致していません</p></label><label class="recaptcha"><p class="caption"><i class="fa fa-toggle-on" if="{recaptchaed}"></i><i class="fa fa-toggle-off" if="{!recaptchaed}"></i>認証</p><div if="{recaptcha}" class="g-recaptcha" data-callback="onRecaptchaed" data-expired-callback="onRecaptchaExpired" data-sitekey="{recaptcha.siteKey}"></div></label><label class="agree-tou"><input name="agree-tou" type="checkbox" autocomplete="off" required="required"><p><a href="{CONFIG.aboutUrl + \'/tou\'}" target="_blank">利用規約</a>に同意する</p></label><button onclick="{onsubmit}">アカウント作成</button></form>', 'mk-signup,[data-is="mk-signup"]{display:block;min-width:302px;overflow:hidden;} mk-signup > form label,[data-is="mk-signup"] > form label{display:block;margin:16px 0;} mk-signup > form label > .caption,[data-is="mk-signup"] > form label > .caption{margin:0 0 4px 0;color:#828888;font-size:.95em;} mk-signup > form label > .caption > i,[data-is="mk-signup"] > form label > .caption > i{margin-right:.25em;color:#96adac} mk-signup > form label > .info,[data-is="mk-signup"] > form label > .info{display:block;margin:4px 0;font-size:.8em;} mk-signup > form label > .info > i,[data-is="mk-signup"] > form label > .info > i{margin-right:.3em} mk-signup > form label.username .profile-page-url-preview,[data-is="mk-signup"] > form label.username .profile-page-url-preview{display:block;margin:4px 8px 0 4px;font-size:.8em;color:#888;} mk-signup > form label.username .profile-page-url-preview:empty,[data-is="mk-signup"] > form label.username .profile-page-url-preview:empty{display:none} mk-signup > form label.username .profile-page-url-preview:not(:empty) + .info,[data-is="mk-signup"] > form label.username .profile-page-url-preview:not(:empty) + .info{margin-top:0} mk-signup > form label.password .meter,[data-is="mk-signup"] > form label.password .meter{display:block;margin-top:8px;width:100%;height:8px;} mk-signup > form label.password .meter[data-strength=\'\'],[data-is="mk-signup"] > form label.password .meter[data-strength=\'\']{display:none} mk-signup > form label.password .meter[data-strength=\'low\'] > .value,[data-is="mk-signup"] > form label.password .meter[data-strength=\'low\'] > .value{background:#d73612} mk-signup > form label.password .meter[data-strength=\'medium\'] > .value,[data-is="mk-signup"] > form label.password .meter[data-strength=\'medium\'] > .value{background:#d7ca12} mk-signup > form label.password .meter[data-strength=\'high\'] > .value,[data-is="mk-signup"] > form label.password .meter[data-strength=\'high\'] > .value{background:#61bb22} mk-signup > form label.password .meter > .value,[data-is="mk-signup"] > form label.password .meter > .value{display:block;width:0%;height:100%;background:transparent;border-radius:4px;transition:all .1s ease} mk-signup > form [type=text],[data-is="mk-signup"] > form [type=text],mk-signup > form [type=password],[data-is="mk-signup"] > form [type=password]{user-select:text;display:inline-block;cursor:auto;padding:0 12px;margin:0;width:100%;line-height:44px;font-size:1em;color:#333 !important;background:#fff !important;outline:none;border:solid 1px rgba(0,0,0,0.1);border-radius:4px;box-shadow:0 0 0 114514px #fff inset;transition:all .3s ease;} mk-signup > form [type=text]:hover,[data-is="mk-signup"] > form [type=text]:hover,mk-signup > form [type=password]:hover,[data-is="mk-signup"] > form [type=password]:hover{border-color:rgba(0,0,0,0.2);transition:all .1s ease} mk-signup > form [type=text]:focus,[data-is="mk-signup"] > form [type=text]:focus,mk-signup > form [type=password]:focus,[data-is="mk-signup"] > form [type=password]:focus{color:#87bb35 !important;border-color:#87bb35;box-shadow:0 0 0 1024px #fff inset,0 0 0 4px rgba(135,187,53,0.1);transition:all 0s ease} mk-signup > form [type=text]:disabled,[data-is="mk-signup"] > form [type=text]:disabled,mk-signup > form [type=password]:disabled,[data-is="mk-signup"] > form [type=password]:disabled{opacity:.5} mk-signup > form .agree-tou,[data-is="mk-signup"] > form .agree-tou{padding:4px;border-radius:4px;} mk-signup > form .agree-tou:hover,[data-is="mk-signup"] > form .agree-tou:hover{background:#f4f4f4} mk-signup > form .agree-tou:active,[data-is="mk-signup"] > form .agree-tou:active{background:#eee} mk-signup > form .agree-tou,[data-is="mk-signup"] > form .agree-tou,mk-signup > form .agree-tou *,[data-is="mk-signup"] > form .agree-tou *{cursor:pointer} mk-signup > form .agree-tou p,[data-is="mk-signup"] > form .agree-tou p{display:inline;color:#555} mk-signup > form button,[data-is="mk-signup"] > form button{margin:0 0 32px 0;padding:16px;width:100%;font-size:1em;color:#fff;background:#87bb35;border-radius:3px;} mk-signup > form button:hover,[data-is="mk-signup"] > form button:hover{background:#8fc638} mk-signup > form button:active,[data-is="mk-signup"] > form button:active{background:#80b232}', '', function(opts) {
		this.mixin('api');
		const getPasswordStrength = __webpack_require__(59);

		this.usernameState = null;
		this.passwordStrength = '';
		this.passwordRetypeState = null;
		this.recaptchaed = false;

		window.onEecaptchaed = () => {
			this.recaptchaed = true;
			this.update();
		};

		window.onRecaptchaExpired = () => {
			this.recaptchaed = false;
			this.update();
		};

		this.on('mount', () => {
			fetch('/config.json').then(res => {
				res.json().then(conf => {
					this.update({
						recaptcha: {
							siteKey: conf.recaptcha.siteKey
						}
					});

					const head = document.getElementsByTagName('head')[0];
					const script = document.createElement('script');
					script.setAttribute('src', 'https://www.google.com/recaptcha/api.js');
					head.appendChild(script);
				});
			});
		});

		this.onChangeUsername = () => {
			const username = this.refs.username.value;

			if (username == '') {
				this.update({
					usernameState: null
				});
				return;
			}

			const err =
				!username.match(/^[a-zA-Z0-9\-]+$/) ? 'invalid-format' :
				username.length < 3 ? 'min-range' :
				username.length > 20 ? 'max-range' :
				null;

			if (err) {
				this.update({
					usernameState: err
				});
				return;
			}

			this.update({
				usernameState: 'wait'
			});

			this.api('username/available', {
				username: username
			}).then(result => {
				this.update({
					usernameState: result.available ? 'ok' : 'unavailable'
				});
			}).catch(err => {
				this.update({
					usernameState: 'error'
				});
			});
		};

		this.onChangePassword = () => {
			const password = this.refs.password.value;

			if (password == '') {
				this.passwordStrength = '';
				return;
			}

			const strength = getPasswordStrength(password);
			this.passwordStrength = strength > 0.7 ? 'high' : strength > 0.3 ? 'medium' : 'low';
			this.update();
			this.refs.passwordMetar.style.width = `${strength * 100}%`;
		};

		this.onChangePasswordRetype = () => {
			const password = this.refs.password.value;
			const retypedPassword = this.refs.passwordRetype.value;

			if (retypedPassword == '') {
				this.passwordRetypeState = null;
				return;
			}

			this.passwordRetypeState = password == retypedPassword ? 'match' : 'not-match';
		};

		this.onsubmit = e => {
			e.preventDefault();

			const username = this.refs.username.value;
			const password = this.refs.password.value;

			const locker = document.body.appendChild(document.createElement('mk-locker'));

			this.api('signup', {
				username: username,
				password: password,
				'g-recaptcha-response': grecaptcha.getResponse()
			}).then(() => {
				this.api('signin', {
					username: username,
					password: password
				}).then(() => {
					location.href = '/';
				});
			}).catch(() => {
				alert('何らかの原因によりアカウントの作成に失敗しました。再度お試しください。');

				grecaptcha.reset();
				this.recaptchaed = false;

				locker.parentNode.removeChild(locker);
			});

			return false;
		};
});

    
  

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-special-message', '<p if="{m == 1 && d == 1}">Happy New Year! </p><p if="{m == 12 && d == 25}">Merry Christmas!</p>', 'mk-special-message,[data-is="mk-special-message"]{display:block;} mk-special-message:empty,[data-is="mk-special-message"]:empty{display:none} mk-special-message > p,[data-is="mk-special-message"] > p{margin:0;padding:4px;text-align:center;font-size:14px;font-weight:bold;text-transform:uppercase;color:#fff;background:#ff1036}', '', function(opts) {
		const now = new Date();
		this.d = now.getDate();
		this.m = now.getMonth() + 1;
});

    
  

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-stream-indicator', '<p if="{stream.state == \'initializing\'}"><i class="fa fa-spinner fa-spin"></i><span>Connecting<mk-ellipsis></mk-ellipsis></span></p><p if="{stream.state == \'reconnecting\'}"><i class="fa fa-spinner fa-spin"></i><span>Disconnected. reconnecting<mk-ellipsis></mk-ellipsis></span></p><p if="{stream.state == \'connected\'}"><i class="fa fa-check"></i><span>Connected</span></p>', 'mk-stream-indicator,[data-is="mk-stream-indicator"]{display:block;pointer-events:none;position:fixed;z-index:16384;bottom:8px;right:8px;margin:0;padding:6px 12px;font-size:.9em;color:#fff;background:rgba(0,0,0,0.8);border-radius:4px;} mk-stream-indicator > p,[data-is="mk-stream-indicator"] > p{display:block;margin:0;} mk-stream-indicator > p > i,[data-is="mk-stream-indicator"] > p > i{margin-right:.25em}', '', function(opts) {

		this.mixin('i');
		this.mixin('stream');

		this.on('before-mount', () => {
			if (this.stream.state == 'connected') {
				this.root.style.opacity = 0;
			}
		});

		this.stream.on('_connected_', () => {
			this.update();
			setTimeout(() => {
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.root,
					opacity: 0,
					easing: 'linear',
					duration: 200
				});
			}, 1000);
		});

		this.stream.on('_closed_', () => {
			this.update();
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 1,
				easing: 'linear',
				duration: 100
			});
		});
});

    
  

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-time', '<time datetime="{opts.time}"><span if="{mode == \'relative\'}">{relative}</span><span if="{mode == \'absolute\'}">{absolute}</span><span if="{mode == \'detail\'}">{absolute} ({relative})</span></time>', '', '', function(opts) {
		this.time = new Date(this.opts.time);
		this.mode = this.opts.mode || 'relative';
		this.tickid = null;

		this.absolute =
			this.time.getFullYear()    + '年' +
			(this.time.getMonth() + 1) + '月' +
			this.time.getDate()        + '日' +
			' ' +
			this.time.getHours()       + '時' +
			this.time.getMinutes()     + '分';

		this.on('mount', () => {
			if (this.mode == 'relative' || this.mode == 'detail') {
				this.tick();
				this.tickid = setInterval(this.tick, 1000);
			}
		});

		this.on('unmount', () => {
			if (this.mode === 'relative' || this.mode === 'detail') {
				clearInterval(this.tickid);
			}
		});

		this.tick = () => {
			const now = new Date();
			const ago = (now - this.time) / 1000 ;
			this.relative =
				ago >= 31536000 ? '{}years ago'  .replace('{}', ~~(ago / 31536000)) :
				ago >= 2592000  ? '{}months ago' .replace('{}', ~~(ago / 2592000)) :
				ago >= 604800   ? '{}weeks ago'  .replace('{}', ~~(ago / 604800)) :
				ago >= 86400    ? '{}d ago'   .replace('{}', ~~(ago / 86400)) :
				ago >= 3600     ? '{}h ago'  .replace('{}', ~~(ago / 3600)) :
				ago >= 60       ? '{}m ago'.replace('{}', ~~(ago / 60)) :
				ago >= 10       ? '{}s ago'.replace('{}', ~~(ago % 60)) :
				ago >= 0        ? 'just now' :
				ago <  0        ? 'future' :
				'unknown';
			this.update();
		};
});

    
  

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-twitter-setting', '<p>お使いのTwitterアカウントをお使いのMisskeyアカウントに接続しておくと、プロフィールでTwitterアカウント情報が表示されるようになったり、Twitterを用いた便利なサインインを利用できるようになります。<a href="{CONFIG.aboutUrl + \'/link-to-twitter\'}" target="_blank">詳細...</a></p><p class="account" if="{I.twitter}" title="{\'Twitter ID: \' + I.twitter.user_id}">次のTwitterアカウントに接続されています: <a href="{\'https://twitter.com/\' + I.twitter.screen_name}" target="_blank">@{I.twitter.screen_name}</a></p><p><a href="{CONFIG.apiUrl + \'/connect/twitter\'}" target="_blank">{I.twitter ? \'再接続する\' : \'Twitterと接続する\'}</a><span if="{I.twitter}"> or </span><a href="{CONFIG.apiUrl + \'/disconnect/twitter\'}" target="_blank" if="{I.twitter}">切断する</a></p><p class="id" if="{I.twitter}">Twitter ID: {I.twitter.user_id}</p>', 'mk-twitter-setting,[data-is="mk-twitter-setting"]{display:block;} mk-twitter-setting .account,[data-is="mk-twitter-setting"] .account{border:solid 1px #e1e8ed;border-radius:4px;padding:16px;} mk-twitter-setting .account a,[data-is="mk-twitter-setting"] .account a{font-weight:bold;color:inherit} mk-twitter-setting .id,[data-is="mk-twitter-setting"] .id{color:#8899a6}', '', function(opts) {
		this.mixin('i');
});

    
  

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-uploader', '<ol if="{uploads.length > 0}"><li each="{uploads}"><div class="img" riot-style="background-image: url({img})"></div><p class="name"><i class="fa fa-spinner fa-pulse"></i>{name}</p><p class="status"><span class="initing" if="{progress == undefined}">待機中 <mk-ellipsis></mk-ellipsis></span><span class="kb" if="{progress != undefined}">{String(Math.floor(progress.value / 1024)).replace(/(\\d)(?=(\\d\\d\\d)+(?!\\d))/g, \'$1,\')}<i>KB</i> / {String(Math.floor(progress.max / 1024)).replace(/(\\d)(?=(\\d\\d\\d)+(?!\\d))/g, \'$1,\')}<i>KB</i></span><span class="percentage" if="{progress != undefined}">{Math.floor((progress.value / progress.max) * 100)}</span></p><progress if="{progress != undefined && progress.value != progress.max}" riot-value="{progress.value}" max="{progress.max}"></progress><div class="progress initing" if="{progress == undefined}"></div><div class="progress waiting" if="{progress != undefined && progress.value == progress.max}"></div></li></ol>', 'mk-uploader,[data-is="mk-uploader"]{display:block;overflow:auto;} mk-uploader:empty,[data-is="mk-uploader"]:empty{display:none} mk-uploader > ol,[data-is="mk-uploader"] > ol{display:block;margin:0;padding:0;list-style:none;} mk-uploader > ol > li,[data-is="mk-uploader"] > ol > li{display:block;margin:8px 0 0 0;padding:0;height:36px;box-shadow:0 -1px 0 rgba(135,187,53,0.1);border-top:solid 8px transparent;} mk-uploader > ol > li:first-child,[data-is="mk-uploader"] > ol > li:first-child{margin:0;box-shadow:none;border-top:none} mk-uploader > ol > li > .img,[data-is="mk-uploader"] > ol > li > .img{display:block;position:absolute;top:0;left:0;width:36px;height:36px;background-size:cover;background-position:center center} mk-uploader > ol > li > .name,[data-is="mk-uploader"] > ol > li > .name{display:block;position:absolute;top:0;left:44px;margin:0;padding:0;max-width:256px;font-size:.8em;color:rgba(135,187,53,0.7);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;} mk-uploader > ol > li > .name > i,[data-is="mk-uploader"] > ol > li > .name > i{margin-right:4px} mk-uploader > ol > li > .status,[data-is="mk-uploader"] > ol > li > .status{display:block;position:absolute;top:0;right:0;margin:0;padding:0;font-size:.8em;} mk-uploader > ol > li > .status > .initing,[data-is="mk-uploader"] > ol > li > .status > .initing{color:rgba(135,187,53,0.5)} mk-uploader > ol > li > .status > .kb,[data-is="mk-uploader"] > ol > li > .status > .kb{color:rgba(135,187,53,0.5)} mk-uploader > ol > li > .status > .percentage,[data-is="mk-uploader"] > ol > li > .status > .percentage{display:inline-block;width:48px;text-align:right;color:rgba(135,187,53,0.7);} mk-uploader > ol > li > .status > .percentage:after,[data-is="mk-uploader"] > ol > li > .status > .percentage:after{content:\'%\'} mk-uploader > ol > li > progress,[data-is="mk-uploader"] > ol > li > progress{display:block;position:absolute;bottom:0;right:0;margin:0;width:calc(100% - 44px);height:8px;background:transparent;border:none;border-radius:4px;overflow:hidden;} mk-uploader > ol > li > progress::-webkit-progress-value,[data-is="mk-uploader"] > ol > li > progress::-webkit-progress-value{background:#87bb35} mk-uploader > ol > li > progress::-webkit-progress-bar,[data-is="mk-uploader"] > ol > li > progress::-webkit-progress-bar{background:rgba(135,187,53,0.1)} mk-uploader > ol > li > .progress,[data-is="mk-uploader"] > ol > li > .progress{display:block;position:absolute;bottom:0;right:0;margin:0;width:calc(100% - 44px);height:8px;border:none;border-radius:4px;background:linear-gradient(45deg,#acd56c 25%,#87bb35 25%,#87bb35 50%,#acd56c 50%,#acd56c 75%,#87bb35 75%,#87bb35);background-size:32px 32px;animation:bg 1.5s linear infinite;} mk-uploader > ol > li > .progress.initing,[data-is="mk-uploader"] > ol > li > .progress.initing{opacity:.3}@-moz-keyframes bg{ from{background-position:0 0} to{background-position:-64px 32px}}@-webkit-keyframes bg{ from{background-position:0 0} to{background-position:-64px 32px}}@-o-keyframes bg{ from{background-position:0 0} to{background-position:-64px 32px}}@keyframes bg{ from{background-position:0 0} to{background-position:-64px 32px}}', '', function(opts) {
		this.mixin('i');

		this.uploads = [];

		this.upload = (file, folder) => {
			if (folder && typeof folder == 'object') folder = folder.id;

			const id = Math.random();

			const ctx = {
				id: id,
				name: file.name || 'untitled',
				progress: undefined
			};

			this.uploads.push(ctx);
			this.trigger('change-uploads', this.uploads);
			this.update();

			const reader = new FileReader();
			reader.onload = e => {
				ctx.img = e.target.result;
				this.update();
			};
			reader.readAsDataURL(file);

			const data = new FormData();
			data.append('i', this.I.token);
			data.append('file', file);

			if (folder) data.append('folder_id', folder);

			const xhr = new XMLHttpRequest();
			xhr.open('POST', this.CONFIG.apiUrl + '/drive/files/create', true);
			xhr.onload = e => {
				const driveFile = JSON.parse(e.target.response);

				this.trigger('uploaded', driveFile);

				this.uploads = this.uploads.filter(x => x.id != id);
				this.trigger('change-uploads', this.uploads);

				this.update();
			};

			xhr.upload.onprogress = e => {
				if (e.lengthComputable) {
					if (ctx.progress == undefined) ctx.progress = {};
					ctx.progress.max = e.total;
					ctx.progress.value = e.loaded;
					this.update();
				}
			};

			xhr.send(data);
		};
});

    
  

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-url-preview', '<a href="{url}" target="_blank" title="{url}" if="{!loading}"><div class="thumbnail" if="{thumbnail}" riot-style="{\'background-image: url(\' + thumbnail + \')\'}"></div><article><header><h1>{title}</h1></header><p>{description}</p><footer><img class="icon" if="{icon}" riot-src="{icon}"><p>{sitename}</p></footer></article></a>', 'mk-url-preview,[data-is="mk-url-preview"]{display:block;font-size:16px;} mk-url-preview > a,[data-is="mk-url-preview"] > a{display:block;border:solid 1px #eee;border-radius:4px;overflow:hidden;} mk-url-preview > a:hover,[data-is="mk-url-preview"] > a:hover{text-decoration:none;border-color:#ddd;} mk-url-preview > a:hover > article > header > h1,[data-is="mk-url-preview"] > a:hover > article > header > h1{text-decoration:underline} mk-url-preview > a > .thumbnail,[data-is="mk-url-preview"] > a > .thumbnail{position:absolute;width:100px;height:100%;background-position:center;background-size:cover;} mk-url-preview > a > .thumbnail + article,[data-is="mk-url-preview"] > a > .thumbnail + article{left:100px;width:calc(100% - 100px)} mk-url-preview > a > article,[data-is="mk-url-preview"] > a > article{padding:16px;} mk-url-preview > a > article > header,[data-is="mk-url-preview"] > a > article > header{margin-bottom:8px;} mk-url-preview > a > article > header > h1,[data-is="mk-url-preview"] > a > article > header > h1{margin:0;font-size:1em;color:#555} mk-url-preview > a > article > p,[data-is="mk-url-preview"] > a > article > p{margin:0;color:#777;font-size:.8em} mk-url-preview > a > article > footer,[data-is="mk-url-preview"] > a > article > footer{margin-top:8px;height:16px;} mk-url-preview > a > article > footer > img,[data-is="mk-url-preview"] > a > article > footer > img{display:inline-block;width:16px;height:16px;margin-right:4px;vertical-align:top} mk-url-preview > a > article > footer > p,[data-is="mk-url-preview"] > a > article > footer > p{display:inline-block;margin:0;color:#666;font-size:.8em;line-height:16px;vertical-align:top}@media (max-width:500px){ mk-url-preview,[data-is="mk-url-preview"]{font-size:8px} mk-url-preview > a,[data-is="mk-url-preview"] > a{border:none;} mk-url-preview > a > .thumbnail,[data-is="mk-url-preview"] > a > .thumbnail{width:70px;} mk-url-preview > a > .thumbnail + article,[data-is="mk-url-preview"] > a > .thumbnail + article{left:70px;width:calc(100% - 70px)} mk-url-preview > a > article,[data-is="mk-url-preview"] > a > article{padding:8px}}', '', function(opts) {
		this.mixin('api');

		this.url = this.opts.url;
		this.loading = true;

		this.on('mount', () => {
			fetch('/api:url?url=' + this.url).then(res => {
				res.json().then(info => {
					this.title = info.title;
					this.description = info.description;
					this.thumbnail = info.thumbnail;
					this.icon = info.icon;
					this.sitename = info.sitename;

					this.loading = false;
					this.update();
				});
			});
		});
});

    
  

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-url', '<a href="{url}" target="{opts.target}"><span class="schema">{schema}//</span><span class="hostname">{hostname}</span><span class="port" if="{port != \'\'}">:{port}</span><span class="pathname" if="{pathname != \'\'}">{pathname}</span><span class="query">{query}</span><span class="hash">{hash}</span></a>', 'mk-url,[data-is="mk-url"]{word-break:break-all;} mk-url > a:after,[data-is="mk-url"] > a:after{content:"\\f14c";display:inline-block;padding-left:2px;font-family:FontAwesome;font-size:.9em;font-weight:400;font-style:normal} mk-url > a > .schema,[data-is="mk-url"] > a > .schema{opacity:.5} mk-url > a > .hostname,[data-is="mk-url"] > a > .hostname{font-weight:bold} mk-url > a > .pathname,[data-is="mk-url"] > a > .pathname{opacity:.8} mk-url > a > .query,[data-is="mk-url"] > a > .query{opacity:.5} mk-url > a > .hash,[data-is="mk-url"] > a > .hash{font-style:italic}', '', function(opts) {
		this.url = this.opts.href;

		this.on('before-mount', () => {
			const url = new URL(this.url);

			this.schema = url.protocol;
			this.hostname = url.hostname;
			this.port = url.port;
			this.pathname = url.pathname;
			this.query = url.search;
			this.hash = url.hash;

			this.update();
		});
});

    
  

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_api__ = __webpack_require__(5);



/* harmony default export */ __webpack_exports__["a"] = (me => {
	__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('api', {
		api: __WEBPACK_IMPORTED_MODULE_1__scripts_api__["a" /* default */].bind(null, me ? me.token : null)
	});
});


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


/* harmony default export */ __webpack_exports__["a"] = (me => {
	__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('i', {
		init: function() {
			this.I = me;
			this.SIGNIN = me != null;

			if (this.SIGNIN) {
				this.on('mount', () => {
					me.on('updated', this.update);
				});
				this.on('unmount', () => {
					me.off('updated', this.update);
				});
			}
		},
		me: me
	});
});


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__i__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stream__ = __webpack_require__(50);




/* harmony default export */ __webpack_exports__["a"] = (me => {
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__i__["a" /* default */])(me);
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */])(me);
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__stream__["a" /* default */])(me);
});


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_stream__ = __webpack_require__(54);



/* harmony default export */ __webpack_exports__["a"] = (me => {
	const stream = me ? new __WEBPACK_IMPORTED_MODULE_1__scripts_stream__["a" /* default */](me) : null;
	__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('stream', {
		stream: stream
	});
});


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(1);


/* harmony default export */ __webpack_exports__["a"] = (function() {
	fetch(__WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].apiUrl + '/meta', {
		method: 'POST'
	}).then(res => {
		res.json().then(meta => {
			if (meta.version != "0.0.1490") {
				localStorage.setItem('should-refresh', 'true');
				alert(`Misskeyの新しいバージョンがあります(${meta.version}。現在${"0.0.1490"}を利用中)。\nページを再度読み込みすると更新が適用されます。`);
			}
		});
	});
});;


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uuid__ = __webpack_require__(55);


const home = {
	left: [
		'profile',
		'calendar',
		'rss-reader',
		'photo-stream',
		'version'
	],
	right: [
		'broadcast',
		'notifications',
		'user-recommendation',
		'donation',
		'nav',
		'tips'
	]
};

/* harmony default export */ __webpack_exports__["a"] = (() => {
	const homeData = [];

	home.left.forEach(widget => {
		homeData.push({
			name: widget,
			id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__uuid__["a" /* default */])(),
			place: 'left'
		});
	});

	home.right.forEach(widget => {
		homeData.push({
			name: widget,
			id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__uuid__["a" /* default */])(),
			place: 'right'
		});
	});

	const data = {
		home: JSON.stringify(homeData)
	};

	return data;
});


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(1);
const ReconnectingWebSocket = __webpack_require__(7);



class Connection {
	constructor(me, otherparty) {
		// BIND -----------------------------------
		this.onOpen =    this.onOpen.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.close =     this.close.bind(this);
		// ----------------------------------------

		this.event = __WEBPACK_IMPORTED_MODULE_0_riot__["observable"]();
		this.me = me;

		const host = __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].apiUrl.replace('http', 'ws');
		this.socket = new ReconnectingWebSocket(`${host}/messaging?i=${me.token}&otherparty=${otherparty}`);
		this.socket.addEventListener('open', this.onOpen);
		this.socket.addEventListener('message', this.onMessage);
	}

	onOpen() {
		this.socket.send(JSON.stringify({
			i: this.me.token
		}));
	}

	onMessage(message) {
		try {
			const msg = JSON.parse(message.data);
			if (msg.type) this.event.trigger(msg.type, msg.body);
		} catch(e) {
			// noop
		}
	}

	close() {
		this.socket.removeEventListener('open', this.onOpen);
		this.socket.removeEventListener('message', this.onMessage);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Connection);


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(1);
const ReconnectingWebSocket = __webpack_require__(7);



class Connection {
	constructor(me) {
		// BIND -----------------------------------
		this.onOpen =    this.onOpen.bind(this);
		this.onClose =   this.onClose.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.send =      this.send.bind(this);
		this.close =     this.close.bind(this);
		// ----------------------------------------

		__WEBPACK_IMPORTED_MODULE_0_riot__["observable"](this);

		this.state = 'initializing';
		this.me = me;
		this.buffer = [];

		const host = __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].apiUrl.replace('http', 'ws');
		this.socket = new ReconnectingWebSocket(`${host}?i=${me.token}`);
		this.socket.addEventListener('open', this.onOpen);
		this.socket.addEventListener('close', this.onClose);
		this.socket.addEventListener('message', this.onMessage);

		this.on('i_updated', me.update);
	}

	onOpen() {
		this.state = 'connected';
		this.trigger('_connected_');

		// バッファーを処理
		const _buffer = [].concat(this.buffer); // Shallow copy
		this.buffer = []; // Clear buffer
		_buffer.forEach(message => {
			this.send(message); // Resend each buffered messages
		});
	}

	onClose() {
		this.state = 'reconnecting';
		this.trigger('_closed_');
	}

	onMessage(message) {
		try {
			const msg = JSON.parse(message.data);
			if (msg.type) this.trigger(msg.type, msg.body);
		} catch(e) {
			// noop
		}
	}

	send(message) {
		// まだ接続が確立されていなかったらバッファリングして次に接続した時に送信する
		if (this.state != 'connected') {
			this.buffer.push(message);
			return;
		};

		this.socket.send(JSON.stringify(message));
	}

	close() {
		this.socket.removeEventListener('open', this.onOpen);
		this.socket.removeEventListener('message', this.onMessage);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Connection);


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (() => {
	var uuid = '', i, random;
	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;

		if (i == 8 || i == 12 || i == 16 || i == 20) {
			uuid += '-';
		}
		uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
	}
	return uuid;
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
__webpack_require__(46);
__webpack_require__(45);
__webpack_require__(42);
__webpack_require__(22);
__webpack_require__(44);
__webpack_require__(21);
__webpack_require__(33);
__webpack_require__(29);
__webpack_require__(40);
__webpack_require__(38);
__webpack_require__(39);
__webpack_require__(23);
__webpack_require__(24);
__webpack_require__(19);
__webpack_require__(37);
__webpack_require__(17);
__webpack_require__(43);
__webpack_require__(18);
__webpack_require__(31);
__webpack_require__(30);
__webpack_require__(28);
__webpack_require__(27);
__webpack_require__(26);
__webpack_require__(25);
__webpack_require__(41);
__webpack_require__(32);
__webpack_require__(16);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(34);


/***/ }),
/* 57 */,
/* 58 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isIE9 = memoize(function() {
		return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0;

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isIE9();

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function createStyleElement() {
	var styleElement = document.createElement("style");
	var head = getHeadElement();
	styleElement.type = "text/css";
	head.appendChild(styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement());
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement();
		update = applyToTag.bind(null, styleElement);
		remove = function () {
			styleElement.parentNode.removeChild(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

function replaceText(source, id, replacement) {
	var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
	var start = source.lastIndexOf(boundaries[0]);
	var wrappedReplacement = replacement
		? (boundaries[0] + replacement + boundaries[1])
		: "";
	if (source.lastIndexOf(boundaries[0]) >= 0) {
		var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
		return source.slice(0, start) + wrappedReplacement + source.slice(end);
	} else {
		return source + wrappedReplacement;
	}
}

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if(sourceMap && typeof btoa === "function") {
		try {
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
			css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
		} catch(e) {}
	}

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * strength.js
 *
 * @version  0.0.1
 * @url https://github.com/syuilo/strength.js
 *
 * Copyright 2016 syuilo.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(definition) {
	'use strict';

	// CommonJS
	if (true) {
		module.exports = definition();

	// RequireJS
	} else if (typeof define === 'function' && define.amd) {
		define(definition);

	// <script>
	} else {
		window.WavesEffect = definition();
	}
})(function() {
	'use strict';

	return function(source) {
		var strength = 0;
		var power = 0.018;

		// 英数字
		if (/[a-zA-Z]/.test(source) && /[0-9]/.test(source)) {
			power += 0.020;
		}

		// 大文字と小文字が混ざってたら
		if (/[a-z]/.test(source) && /[A-Z]/.test(source)) {
			power += 0.015;
		}

		// 記号が混ざってたら
		if (/[!\x22\#$%&@'()*+,-./_]/.test(source)) {
			power += 0.02;
		}

		strength = power * source.length;

		if (strength < 0) {
			strength = 0;
		}

		if (strength > 1) {
			strength = 1;
		}

		return strength;
	};
});

/***/ }),
/* 60 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 62 */,
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (x => typeof x.then == 'function');


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {  /* globals require, module */

  

  /**
   * Module dependencies.
   */

  var pathtoRegexp = __webpack_require__(66);

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */
  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    // use shadow dom when available
    var el = e.path ? e.path[0] : e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(67)))

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var isarray = __webpack_require__(65)

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}


/***/ }),
/* 67 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 68 */,
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (bytes => {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0Byte';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
});


/***/ }),
/* 70 */,
/* 71 */,
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.NProgress = factory();
  }

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.2.0';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   *
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;

    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() === "resolved") {
        return this;
      }

      if (current === 0) {
        NProgress.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current === 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});



/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ----- Calculate age given date
//		-- @see http://stackoverflow.com/a/7091965/4459340
//		-- @param date {String|Number|Date}
//		-- @return {Number} years since date
// ---------------------------------------
module.exports = function(date) {

	const type = Object.prototype.toString.call(date);
	const now = new Date();

	// convert dateStrings and timestamps to a Date
	if (type === '[object String]' || type === '[object Number]') {
		date = new Date(date);
	}

	let yearDiff = now.getFullYear() - date.getFullYear();
	const monthDiff = now.getMonth() - date.getMonth();
	const pastDate = now.getDate() < date.getDate();
	
	// compare months. if same month, compare days
	if (monthDiff < 0 || (monthDiff === 0 && pastDate)) {
		yearDiff--;
	}

	return yearDiff;

};

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (() => '(=^・・^=)');


/***/ }),
/* 75 */,
/* 76 */,
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


/* harmony default export */ __webpack_exports__["a"] = (opts => {
	const app = document.getElementById('app');
	app.style.display = 'none';

	function recover() {
		app.style.display = 'block';
	}

	const form = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-post-form')), opts)[0];
	form
		.on('cancel', recover)
		.on('post', recover);
});


/***/ }),
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/**
 * Mobile App Router
 */


const route = __webpack_require__(64);
let page = null;

/* harmony default export */ __webpack_exports__["a"] = (me => {
	route('/',                           index);
	route('/i/notifications',            notifications);
	route('/i/messaging',                messaging);
	route('/i/messaging/:username',      messaging);
	route('/i/drive',                    drive);
	route('/i/drive/folder/:folder',     drive);
	route('/i/drive/file/:file',         drive);
	route('/i/settings',                 settings);
	route('/i/settings/signin-history',  settingsSignin);
	route('/i/settings/api',             settingsApi);
	route('/i/settings/twitter',         settingsTwitter);
	route('/i/settings/authorized-apps', settingsAuthorizedApps);
	route('/post/new',                   newPost);
	route('/post::post',                 post);
	route('/search::query',              search);
	route('/:user',                      user.bind(null, 'posts'));
	route('/:user/graphs',               user.bind(null, 'graphs'));
	route('/:user/followers',            userFollowers);
	route('/:user/following',            userFollowing);
	route('/:user/:post',                post);
	route('*',                           notFound);

	function index() {
		me ? home() : entrance();
	}

	function home() {
		mount(document.createElement('mk-home-page'));
	}

	function entrance() {
		mount(document.createElement('mk-entrance'));
	}

	function notifications() {
		mount(document.createElement('mk-notifications-page'));
	}

	function messaging(ctx) {
		if (ctx.params.username) {
			const el = document.createElement('mk-messaging-room-page');
			el.setAttribute('username', ctx.params.username);
			mount(el);
		} else {
			mount(document.createElement('mk-messaging-page'));
		}
	}

	function newPost() {
		mount(document.createElement('mk-new-post-page'));
	}

	function settings() {
		mount(document.createElement('mk-settings-page'));
	}

	function settingsSignin() {
		mount(document.createElement('mk-signin-history-page'));
	}

	function settingsApi() {
		mount(document.createElement('mk-api-info-page'));
	}

	function settingsTwitter() {
		mount(document.createElement('mk-twitter-setting-page'));
	}

	function settingsAuthorizedApps() {
		mount(document.createElement('mk-authorized-apps-page'));
	}

	function search(ctx) {
		const el = document.createElement('mk-search-page');
		el.setAttribute('query', ctx.params.query);
		mount(el);
	}

	function user(page, ctx) {
		const el = document.createElement('mk-user-page');
		el.setAttribute('user', ctx.params.user);
		el.setAttribute('page', page);
		mount(el);
	}

	function userFollowing(ctx) {
		const el = document.createElement('mk-user-following-page');
		el.setAttribute('user', ctx.params.user);
		mount(el);
	}

	function userFollowers(ctx) {
		const el = document.createElement('mk-user-followers-page');
		el.setAttribute('user', ctx.params.user);
		mount(el);
	}

	function post(ctx) {
		const el = document.createElement('mk-post-page');
		el.setAttribute('post', ctx.params.post);
		mount(el);
	}

	function drive(ctx) {
		const el = document.createElement('mk-drive-page');
		if (ctx.params.folder) el.setAttribute('folder', ctx.params.folder);
		if (ctx.params.file) el.setAttribute('file', ctx.params.file);
		mount(el);
	}

	function notFound() {
		mount(document.createElement('mk-not-found'));
	}

	__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('page', {
		page: route
	});

	// EXEC
	route();
});

function mount(content) {
	if (page) page.unmount();
	const body = document.getElementById('app');
	page = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](body.appendChild(content))[0];
}


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(240);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(211);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(210);
__webpack_require__(218);
__webpack_require__(228);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(219);
__webpack_require__(217);
__webpack_require__(220);
__webpack_require__(221);
__webpack_require__(224);
__webpack_require__(222);
__webpack_require__(223);
__webpack_require__(225);
__webpack_require__(216);
__webpack_require__(215);
__webpack_require__(204);
__webpack_require__(203);
__webpack_require__(237);
__webpack_require__(236);
__webpack_require__(235);
__webpack_require__(231);
__webpack_require__(234);
__webpack_require__(205);
__webpack_require__(198);
__webpack_require__(197);
__webpack_require__(196);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(199);
__webpack_require__(230);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(206);
__webpack_require__(233);
__webpack_require__(232);
__webpack_require__(229);
__webpack_require__(245);
__webpack_require__(244);
__webpack_require__(202);
__webpack_require__(243);
__webpack_require__(246);
__webpack_require__(242);
__webpack_require__(241);


/***/ }),
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(96);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(58)(content, {});
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	module.hot.accept("!!/home/travis/build/syuilo/misskey/node_modules/css-loader/index.js!/home/travis/build/syuilo/misskey/node_modules/stylus-loader/index.js!/home/travis/build/syuilo/misskey/src/web/app/mobile/style.styl", function() {
		var newContent = require("!!/home/travis/build/syuilo/misskey/node_modules/css-loader/index.js!/home/travis/build/syuilo/misskey/node_modules/stylus-loader/index.js!/home/travis/build/syuilo/misskey/src/web/app/mobile/style.styl");
		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
		update(newContent);
	});
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "@charset 'utf-8';\n* {\n  position: relative;\n  box-sizing: border-box;\n  background-clip: padding-box !important;\n}\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  overflow-wrap: break-word;\n}\ninput:not([type]),\ninput[type='text'],\ninput[type='password'],\ninput[type='email'],\ntextarea,\nbutton,\nprogress {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  box-shadow: none;\n}\nbutton {\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  color: inherit;\n}\nbutton * {\n  pointer-events: none;\n}\npre {\n  overflow: auto;\n  white-space: pre;\n}\n* {\n  tap-highlight-color: rgba(135,187,53,0.7);\n  -webkit-tap-highlight-color: rgba(135,187,53,0.7);\n}\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n  scroll-behavior: smooth;\n  text-size-adjust: 100%;\n  font-family: sans-serif;\n}\nhtml.progress,\nhtml.progress * {\n  cursor: progress !important;\n}\n#error {\n  position: fixed;\n  z-index: 32768;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #00f;\n  color: #fff;\n}\n#error > p {\n  text-align: center;\n}\n#nprogress {\n  pointer-events: none;\n  position: absolute;\n  z-index: 65536;\n/* Fancy blur effect */\n}\n#nprogress .bar {\n  background: #87bb35;\n  position: fixed;\n  z-index: 65537;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n}\n#nprogress .peg {\n  display: block;\n  position: absolute;\n  right: 0px;\n  width: 100px;\n  height: 100%;\n  box-shadow: 0 0 10px #87bb35, 0 0 5px #87bb35;\n  opacity: 1;\n  transform: rotate(3deg) translate(0px, -4px);\n}\n#wait {\n  display: block;\n  position: fixed;\n  z-index: 65537;\n  top: 15px;\n  right: 15px;\n}\n#wait:before {\n  content: \"\";\n  display: block;\n  width: 18px;\n  height: 18px;\n  box-sizing: border-box;\n  border: solid 2px transparent;\n  border-top-color: #87bb35;\n  border-left-color: #87bb35;\n  border-radius: 50%;\n  animation: progress-spinner 400ms linear infinite;\n}\n@-moz-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@-webkit-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@-o-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\na {\n  text-decoration: none;\n  color: #87bb35;\n  cursor: pointer;\n}\na:hover {\n  text-decoration: underline;\n}\na * {\n  cursor: pointer;\n}\ncode {\n  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;\n}\ncode .comment {\n  opacity: 0.5;\n}\ncode .string {\n  color: #e96900;\n}\ncode .regexp {\n  color: #e9003f;\n}\ncode .keyword {\n  color: #2973b7;\n}\ncode .keyword.true,\ncode .keyword.false,\ncode .keyword.null,\ncode .keyword.nil,\ncode .keyword.undefined {\n  color: #ae81ff;\n}\ncode .symbol {\n  color: #42b983;\n}\ncode .number,\ncode .nan {\n  color: #ae81ff;\n}\ncode .var:not(.keyword) {\n  font-weight: bold;\n  font-style: italic;\n}\ncode .method {\n  font-style: italic;\n  color: #8964c1;\n}\ncode .property {\n  color: #a71d5d;\n}\ncode .label {\n  color: #e9003f;\n}\npre {\n  display: block;\n}\npre > code {\n  display: block;\n  overflow: auto;\n  tab-size: 2;\n}\nmk-locker {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 65536;\n  width: 100%;\n  height: 100%;\n  cursor: wait;\n}\n#wait {\n  top: auto;\n  bottom: 15px;\n  left: 15px;\n}\n", ""]);

// exports


/***/ }),
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-folder-selector', '<div class="body"><header><h1>フォルダを選択</h1><button class="close" onclick="{cancel}"><i class="fa fa-times"></i></button><button class="ok" onclick="{ok}"><i class="fa fa-check"></i></button></header><mk-drive ref="browser" select-folder="{true}"></mk-drive></div>', 'mk-drive-folder-selector,[data-is="mk-drive-folder-selector"]{display:block;position:fixed;z-index:2048;top:0;left:0;width:100%;height:100%;padding:8px;background:rgba(0,0,0,0.2);} mk-drive-folder-selector > .body,[data-is="mk-drive-folder-selector"] > .body{width:100%;height:100%;background:#fff;} mk-drive-folder-selector > .body > header,[data-is="mk-drive-folder-selector"] > .body > header{border-bottom:solid 1px #eee;} mk-drive-folder-selector > .body > header > h1,[data-is="mk-drive-folder-selector"] > .body > header > h1{margin:0;padding:0;text-align:center;line-height:42px;font-size:1em;font-weight:normal} mk-drive-folder-selector > .body > header > .close,[data-is="mk-drive-folder-selector"] > .body > header > .close{position:absolute;top:0;left:0;line-height:42px;width:42px} mk-drive-folder-selector > .body > header > .ok,[data-is="mk-drive-folder-selector"] > .body > header > .ok{position:absolute;top:0;right:0;line-height:42px;width:42px} mk-drive-folder-selector > .body > mk-drive,[data-is="mk-drive-folder-selector"] > .body > mk-drive{height:calc(100% - 42px);overflow:scroll;-webkit-overflow-scrolling:touch}', '', function(opts) {
		this.cancel = () => {
			this.trigger('canceled');
			this.unmount();
		};

		this.ok = () => {
			this.trigger('selected', this.refs.browser.folder);
			this.unmount();
		};
});

    
  

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-selector', '<div class="body"><header><h1>ファイルを選択<span class="count" if="{files.length > 0}">({files.length})</span></h1><button class="close" onclick="{cancel}"><i class="fa fa-times"></i></button><button class="ok" onclick="{ok}"><i class="fa fa-check"></i></button></header><mk-drive ref="browser" select-file="{true}" multiple="{opts.multiple}"></mk-drive></div>', 'mk-drive-selector,[data-is="mk-drive-selector"]{display:block;position:fixed;z-index:2048;top:0;left:0;width:100%;height:100%;padding:8px;background:rgba(0,0,0,0.2);} mk-drive-selector > .body,[data-is="mk-drive-selector"] > .body{width:100%;height:100%;background:#fff;} mk-drive-selector > .body > header,[data-is="mk-drive-selector"] > .body > header{border-bottom:solid 1px #eee;} mk-drive-selector > .body > header > h1,[data-is="mk-drive-selector"] > .body > header > h1{margin:0;padding:0;text-align:center;line-height:42px;font-size:1em;font-weight:normal;} mk-drive-selector > .body > header > h1 > .count,[data-is="mk-drive-selector"] > .body > header > h1 > .count{margin-left:4px;opacity:.5} mk-drive-selector > .body > header > .close,[data-is="mk-drive-selector"] > .body > header > .close{position:absolute;top:0;left:0;line-height:42px;width:42px} mk-drive-selector > .body > header > .ok,[data-is="mk-drive-selector"] > .body > header > .ok{position:absolute;top:0;right:0;line-height:42px;width:42px} mk-drive-selector > .body > mk-drive,[data-is="mk-drive-selector"] > .body > mk-drive{height:calc(100% - 42px);overflow:scroll;-webkit-overflow-scrolling:touch}', '', function(opts) {
		this.files = [];

		this.on('mount', () => {
			this.refs.browser.on('change-selection', files => {
				this.update({
					files: files
				});
			});
		});

		this.cancel = () => {
			this.trigger('canceled');
			this.unmount();
		};

		this.ok = () => {
			this.trigger('selected', this.files);
			this.unmount();
		};
});

    
  

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive', '<nav><p onclick="{goRoot}"><i class="fa fa-cloud"></i>ドライブ</p><virtual each="{folder in hierarchyFolders}"><span><i class="fa fa-angle-right"></i></span><p onclick="{move}">{folder.name}</p></virtual><virtual if="{folder != null}"><span><i class="fa fa-angle-right"></i></span><p>{folder.name}</p></virtual><virtual if="{file != null}"><span><i class="fa fa-angle-right"></i></span><p>{file.name}</p></virtual></nav><mk-uploader ref="uploader"></mk-uploader><div class="browser {fetching: fetching}" if="{file == null}"><div class="info" if="{info}"><p if="{folder == null}">{(info.usage / info.capacity * 100).toFixed(1)}%使用中</p><p if="{folder != null && (folder.folders_count > 0 || folder.files_count > 0)}"><virtual if="{folder.folders_count > 0}">{folder.folders_count}フォルダ</virtual><virtual if="{folder.folders_count > 0 && folder.files_count > 0}">、</virtual><virtual if="{folder.files_count > 0}">{folder.files_count}ファイル</virtual></p></div><div class="folders" if="{folders.length > 0}"><virtual each="{folder in folders}"><mk-drive-folder folder="{folder}"></mk-drive-folder></virtual><p if="{moreFolders}">もっと読み込む</p></div><div class="files" if="{files.length > 0}"><virtual each="{file in files}"><mk-drive-file file="{file}"></mk-drive-file></virtual><button class="more" if="{moreFiles}" onclick="{fetchMoreFiles}"> {fetchingMoreFiles ? \'読み込み中\' : \'もっと読み込む\'} </button></div><div class="empty" if="{files.length == 0 && folders.length == 0 && !fetching}"><p if="{!folder == null}">ドライブには何もありません。</p><p if="{folder != null}">このフォルダーは空です</p></div></div><div class="fetching" if="{fetching && file == null && files.length == 0 && folders.length == 0}"><div class="spinner"><div class="dot1"></div><div class="dot2"></div></div></div><input ref="file" type="file" multiple="multiple" onchange="{changeLocalFile}"><mk-drive-file-viewer if="{file != null}" file="{file}"></mk-drive-file-viewer>', 'mk-drive,[data-is="mk-drive"]{display:block;background:#fff;} mk-drive[data-is-naked] > nav,[data-is="mk-drive"][data-is-naked] > nav{top:48px} mk-drive > nav,[data-is="mk-drive"] > nav{display:block;position:sticky;position:-webkit-sticky;top:0;z-index:1;width:100%;padding:10px 12px;overflow:auto;white-space:nowrap;font-size:.9em;color:rgba(0,0,0,0.67);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background-color:rgba(255,255,255,0.75);border-bottom:solid 1px rgba(0,0,0,0.13);} mk-drive > nav > p,[data-is="mk-drive"] > nav > p{display:inline;margin:0;padding:0;} mk-drive > nav > p:last-child,[data-is="mk-drive"] > nav > p:last-child{font-weight:bold} mk-drive > nav > p > i,[data-is="mk-drive"] > nav > p > i{margin-right:4px} mk-drive > nav > span,[data-is="mk-drive"] > nav > span{margin:0 8px;opacity:.5} mk-drive > .browser.fetching,[data-is="mk-drive"] > .browser.fetching{opacity:.5} mk-drive > .browser > .info,[data-is="mk-drive"] > .browser > .info{border-bottom:solid 1px #eee;} mk-drive > .browser > .info:empty,[data-is="mk-drive"] > .browser > .info:empty{display:none} mk-drive > .browser > .info > p,[data-is="mk-drive"] > .browser > .info > p{display:block;max-width:500px;margin:0 auto;padding:4px 16px;font-size:10px;color:#777} mk-drive > .browser > .folders > mk-drive-folder,[data-is="mk-drive"] > .browser > .folders > mk-drive-folder{border-bottom:solid 1px #eee} mk-drive > .browser > .files > mk-drive-file,[data-is="mk-drive"] > .browser > .files > mk-drive-file{border-bottom:solid 1px #eee} mk-drive > .browser > .files > .more,[data-is="mk-drive"] > .browser > .files > .more{display:block;width:100%;padding:16px;font-size:16px;color:#555} mk-drive > .browser > .empty,[data-is="mk-drive"] > .browser > .empty{padding:16px;text-align:center;color:#999;pointer-events:none;} mk-drive > .browser > .empty > p,[data-is="mk-drive"] > .browser > .empty > p{margin:0} mk-drive > .fetching .spinner,[data-is="mk-drive"] > .fetching .spinner{margin:100px auto;width:40px;height:40px;text-align:center;animation:sk-rotate 2s infinite linear} mk-drive > .fetching .dot1,[data-is="mk-drive"] > .fetching .dot1,mk-drive > .fetching .dot2,[data-is="mk-drive"] > .fetching .dot2{width:60%;height:60%;display:inline-block;position:absolute;top:0;background:rgba(0,0,0,0.2);border-radius:100%;animation:sk-bounce 2s infinite ease-in-out} mk-drive > .fetching .dot2,[data-is="mk-drive"] > .fetching .dot2{top:auto;bottom:0;animation-delay:-1s}@-moz-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-webkit-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-o-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-moz-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@-webkit-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@-o-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}} mk-drive > [ref=\'file\'],[data-is="mk-drive"] > [ref=\'file\']{display:none}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.files = [];
		this.folders = [];
		this.hierarchyFolders = [];
		this.selectedFiles = [];

		this.folder = null;

		this.file = null;

		this.isFileSelectMode = this.opts.selectFile;
		this.multiple =this.opts.multiple;

		this.on('mount', () => {
			this.stream.on('drive_file_created', this.onStreamDriveFileCreated);
			this.stream.on('drive_file_updated', this.onStreamDriveFileUpdated);
			this.stream.on('drive_folder_created', this.onStreamDriveFolderCreated);
			this.stream.on('drive_folder_updated', this.onStreamDriveFolderUpdated);

			if (this.opts.folder && this.opts.folder != '') {
				this.cd(this.opts.folder, true);
			} else if (this.opts.file && this.opts.file != '') {
				this.cf(this.opts.file, true);
			} else {
				this.fetch();
			}
		});

		this.on('unmount', () => {
			this.stream.off('drive_file_created', this.onStreamDriveFileCreated);
			this.stream.off('drive_file_updated', this.onStreamDriveFileUpdated);
			this.stream.off('drive_folder_created', this.onStreamDriveFolderCreated);
			this.stream.off('drive_folder_updated', this.onStreamDriveFolderUpdated);
		});

		this.onStreamDriveFileCreated = file => {
			this.addFile(file, true);
		};

		this.onStreamDriveFileUpdated = file => {
			const current = this.folder ? this.folder.id : null;
			if (current != file.folder_id) {
				this.removeFile(file);
			} else {
				this.addFile(file, true);
			}
		};

		this.onStreamDriveFolderCreated = folder => {
			this.addFolder(folder, true);
		};

		this.onStreamDriveFolderUpdated = folder => {
			const current = this.folder ? this.folder.id : null;
			if (current != folder.parent_id) {
				this.removeFolder(folder);
			} else {
				this.addFolder(folder, true);
			}
		};

		this.move = ev => {
			this.cd(ev.item.folder);
		};

		this.cd = (target, silent = false) => {
			this.file = null;

			if (target == null) {
				this.goRoot();
				return;
			} else if (typeof target == 'object') target = target.id;

			this.update({
				fetching: true
			});

			this.api('drive/folders/show', {
				folder_id: target
			}).then(folder => {
				this.folder = folder;
				this.hierarchyFolders = [];

				if (folder.parent) dive(folder.parent);

				this.update();
				this.trigger('open-folder', this.folder, silent);
				this.fetch();
			});
		};

		this.addFolder = (folder, unshift = false) => {
			const current = this.folder ? this.folder.id : null;

			if (current != folder.parent_id) return;

			if (this.folders.some(f => f.id == folder.id)) return;

			if (unshift) {
				this.folders.unshift(folder);
			} else {
				this.folders.push(folder);
			}

			this.update();
		};

		this.addFile = (file, unshift = false) => {
			const current = this.folder ? this.folder.id : null;

			if (current != file.folder_id) return;

			if (this.files.some(f => f.id == file.id)) {
				const exist = this.files.map(f => f.id).indexOf(file.id);
				this.files[exist] = file;
				this.update();
				return;
			}

			if (unshift) {
				this.files.unshift(file);
			} else {
				this.files.push(file);
			}

			this.update();
		};

		this.removeFolder = folder => {
			if (typeof folder == 'object') folder = folder.id;
			this.folders = this.folders.filter(f => f.id != folder);
			this.update();
		};

		this.removeFile = file => {
			if (typeof file == 'object') file = file.id;
			this.files = this.files.filter(f => f.id != file);
			this.update();
		};

		this.appendFile = file => this.addFile(file);
		this.appendFolder = file => this.addFolder(file);
		this.prependFile = file => this.addFile(file, true);
		this.prependFolder = file => this.addFolder(file, true);

		this.goRoot = () => {
			if (this.folder || this.file) {
				this.update({
					file: null,
					folder: null,
					hierarchyFolders: []
				});
				this.trigger('move-root');
				this.fetch();
			}
		};

		this.fetch = () => {
			this.update({
				folders: [],
				files: [],
				moreFolders: false,
				moreFiles: false,
				fetching: true
			});

			this.trigger('begin-fetch');

			let fetchedFolders = null;
			let fetchedFiles = null;

			const foldersMax = 20;
			const filesMax = 20;

			this.api('drive/folders', {
				folder_id: this.folder ? this.folder.id : null,
				limit: foldersMax + 1
			}).then(folders => {
				if (folders.length == foldersMax + 1) {
					this.moreFolders = true;
					folders.pop();
				}
				fetchedFolders = folders;
				complete();
			});

			this.api('drive/files', {
				folder_id: this.folder ? this.folder.id : null,
				limit: filesMax + 1
			}).then(files => {
				if (files.length == filesMax + 1) {
					this.moreFiles = true;
					files.pop();
				}
				fetchedFiles = files;
				complete();
			});

			let flag = false;
			const complete = () => {
				if (flag) {
					fetchedFolders.forEach(this.appendFolder);
					fetchedFiles.forEach(this.appendFile);
					this.update({
						fetching: false
					});

					this.trigger('fetched');
				} else {
					flag = true;

					this.trigger('fetch-mid');
				}
			};

			if (this.folder == null) {

				this.api('drive').then(info => {
					this.update({ info });
				});
			}
		};

		this.fetchMoreFiles = () => {
			this.update({
				fetching: true,
				fetchingMoreFiles: true
			});

			const max = 30;

			this.api('drive/files', {
				folder_id: this.folder ? this.folder.id : null,
				limit: max + 1
			}).then(files => {
				if (files.length == max + 1) {
					this.moreFiles = true;
					files.pop();
				} else {
					this.moreFiles = false;
				}
				files.forEach(this.appendFile);
				this.update({
					fetching: false,
					fetchingMoreFiles: false
				});
			});
		};

		this.chooseFile = file => {
			if (this.isFileSelectMode) {
				if (this.selectedFiles.some(f => f.id == file.id)) {
					this.selectedFiles = this.selectedFiles.filter(f => f.id != file.id);
				} else {
					this.selectedFiles.push(file);
				}
				this.update();
				this.trigger('change-selection', this.selectedFiles);
			} else {
				this.cf(file);
			}
		};

		this.cf = (file, silent = false) => {
			if (typeof file == 'object') file = file.id;

			this.update({
				fetching: true
			});

			this.api('drive/files/show', {
				file_id: file
			}).then(file => {
				this.fetching = false;
				this.file = file;
				this.folder = null;
				this.hierarchyFolders = [];

				if (file.folder) dive(file.folder);

				this.update();
				this.trigger('open-file', this.file, silent);
			});
		};

		const dive = folder => {
			this.hierarchyFolders.unshift(folder);
			if (folder.parent) dive(folder.parent);
		};

		this.openContextMenu = () => {
			const fn = window.prompt('何をしますか？(数字を入力してください): <1 → ファイルをアップロード | 2 → ファイルをURLでアップロード | 3 → フォルダ作成 | 4 → このフォルダ名を変更 | 5 → このフォルダを移動 | 6 → このフォルダを削除>');
			if (fn == null || fn == '') return;
			switch (fn) {
				case '1':
					this.refs.file.click();
					break;
				case '2':
					this.urlUpload();
					break;
				case '3':
					this.createFolder();
					break;
				case '4':
					this.renameFolder();
					break;
				case '5':
					this.moveFolder();
					break;
				case '6':
					alert('ごめんなさい！フォルダの削除は未実装です...。');
					break;
			}
		};

		this.createFolder = () => {
			const name = window.prompt('フォルダー名');
			if (name == null || name == '') return;
			this.api('drive/folders/create', {
				name: name,
				parent_id: this.folder ? this.folder.id : undefined
			}).then(folder => {
				this.addFolder(folder, true);
				this.update();
			});
		};

		this.renameFolder = () => {
			if (this.folder == null) {
				alert('現在いる場所はルートで、フォルダではないため名前の変更はできません。名前を変更したいフォルダに移動してからやってください。');
				return;
			}
			const name = window.prompt('フォルダー名', this.folder.name);
			if (name == null || name == '') return;
			this.api('drive/folders/update', {
				name: name,
				folder_id: this.folder.id
			}).then(folder => {
				this.cd(folder);
			});
		};

		this.moveFolder = () => {
			if (this.folder == null) {
				alert('現在いる場所はルートで、フォルダではないため移動はできません。移動したいフォルダに移動してからやってください。');
				return;
			}
			const dialog = riot.mount(document.body.appendChild(document.createElement('mk-drive-folder-selector')))[0];
			dialog.one('selected', folder => {
				this.api('drive/folders/update', {
					parent_id: folder ? folder.id : null,
					folder_id: this.folder.id
				}).then(folder => {
					this.cd(folder);
				});
			});
		};

		this.urlUpload = () => {
			const url = window.prompt('アップロードしたいファイルのURL');
			if (url == null || url == '') return;
			this.api('drive/files/upload_from_url', {
				url: url,
				folder_id: this.folder ? this.folder.id : undefined
			});
			alert('アップロードをリクエストしました。アップロードが完了するまで時間がかかる場合があります。');
		};

		this.changeLocalFile = () => {
			this.refs.file.files.forEach(f => this.refs.uploader.upload(f, this.folder));
		};
});

    
  

/***/ }),
/* 199 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_gcd__ = __webpack_require__(249);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-drive-file-viewer', '<div class="preview"><img if="{kind == \'image\'}" riot-src="{file.url}" alt="{file.name}" title="{file.name}"><i if="{kind != \'image\'}" class="fa fa-file"></i><footer if="{kind == \'image\'}"><span class="size"><span class="width">{file.properties.width}</span><span class="time">×</span><span class="height">{file.properties.height}</span><span class="px">px</span></span><span class="separator"></span><span class="aspect-ratio"><span class="width">{file.properties.width / gcd(file.properties.width, file.properties.height)}</span><span class="colon">:</span><span class="height">{file.properties.height / gcd(file.properties.width, file.properties.height)}</span></span></footer></div><div class="info"><div><span class="type"><mk-file-type-icon type="{file.type}"></mk-file-type-icon>{file.type}</span><span class="separator"></span><span class="data-size">{bytesToSize(file.datasize)}</span><span class="separator"></span><span class="created-at" onclick="{showCreatedAt}"><i class="fa fa-clock-o"></i><mk-time time="{file.created_at}"></mk-time></span></div></div><div class="menu"><div><a href="{file.url + \'?download\'}" download="{file.name}"><i class="fa fa-download"></i>ダウンロード </a><button onclick="{rename}"><i class="fa fa-pencil"></i>名前を変更 </button><button onclick="{move}"><i class="fa fa-folder-open"></i>移動 </button></div></div><div class="hash"><div><p><i class="fa fa-hashtag"></i>ファイルのハッシュ値 </p><code>{file.hash}</code></div></div>', 'mk-drive-file-viewer,[data-is="mk-drive-file-viewer"]{display:block;} mk-drive-file-viewer > .preview,[data-is="mk-drive-file-viewer"] > .preview{padding:8px;background:#f0f0f0;} mk-drive-file-viewer > .preview > img,[data-is="mk-drive-file-viewer"] > .preview > img{display:block;max-width:100%;max-height:300px;margin:0 auto;box-shadow:1px 1px 4px rgba(0,0,0,0.2)} mk-drive-file-viewer > .preview > footer,[data-is="mk-drive-file-viewer"] > .preview > footer{padding:8px 8px 0 8px;font-size:.8em;color:#888;text-align:center;} mk-drive-file-viewer > .preview > footer > .separator,[data-is="mk-drive-file-viewer"] > .preview > footer > .separator{display:inline;padding:0 4px} mk-drive-file-viewer > .preview > footer > .size,[data-is="mk-drive-file-viewer"] > .preview > footer > .size{display:inline;} mk-drive-file-viewer > .preview > footer > .size .time,[data-is="mk-drive-file-viewer"] > .preview > footer > .size .time{margin:0 2px} mk-drive-file-viewer > .preview > footer > .size .px,[data-is="mk-drive-file-viewer"] > .preview > footer > .size .px{margin-left:4px} mk-drive-file-viewer > .preview > footer > .aspect-ratio,[data-is="mk-drive-file-viewer"] > .preview > footer > .aspect-ratio{display:inline;opacity:.7;} mk-drive-file-viewer > .preview > footer > .aspect-ratio:before,[data-is="mk-drive-file-viewer"] > .preview > footer > .aspect-ratio:before{content:"("} mk-drive-file-viewer > .preview > footer > .aspect-ratio:after,[data-is="mk-drive-file-viewer"] > .preview > footer > .aspect-ratio:after{content:")"} mk-drive-file-viewer > .info,[data-is="mk-drive-file-viewer"] > .info{padding:14px;font-size:.8em;border-top:solid 1px #dfdfdf;} mk-drive-file-viewer > .info > div,[data-is="mk-drive-file-viewer"] > .info > div{max-width:500px;margin:0 auto;} mk-drive-file-viewer > .info > div > .separator,[data-is="mk-drive-file-viewer"] > .info > div > .separator{padding:0 4px;color:#cdcdcd} mk-drive-file-viewer > .info > div > .type,[data-is="mk-drive-file-viewer"] > .info > div > .type,mk-drive-file-viewer > .info > div > .data-size,[data-is="mk-drive-file-viewer"] > .info > div > .data-size{color:#9d9d9d;} mk-drive-file-viewer > .info > div > .type > mk-file-type-icon,[data-is="mk-drive-file-viewer"] > .info > div > .type > mk-file-type-icon,mk-drive-file-viewer > .info > div > .data-size > mk-file-type-icon,[data-is="mk-drive-file-viewer"] > .info > div > .data-size > mk-file-type-icon{margin-right:4px} mk-drive-file-viewer > .info > div > .created-at,[data-is="mk-drive-file-viewer"] > .info > div > .created-at{color:#bdbdbd;} mk-drive-file-viewer > .info > div > .created-at > i,[data-is="mk-drive-file-viewer"] > .info > div > .created-at > i{margin-right:2px} mk-drive-file-viewer > .menu,[data-is="mk-drive-file-viewer"] > .menu{padding:14px;border-top:solid 1px #dfdfdf;} mk-drive-file-viewer > .menu > div,[data-is="mk-drive-file-viewer"] > .menu > div{max-width:500px;margin:0 auto;} mk-drive-file-viewer > .menu > div > *,[data-is="mk-drive-file-viewer"] > .menu > div > *{display:block;width:100%;padding:10px 16px;margin:0 0 12px 0;color:#333;font-size:.9em;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(255,255,255,0.9);background-image:linear-gradient(#fafafa,#eaeaea);border:1px solid #ddd;border-bottom-color:#cecece;border-radius:3px;} mk-drive-file-viewer > .menu > div > *:last-child,[data-is="mk-drive-file-viewer"] > .menu > div > *:last-child{margin-bottom:0} mk-drive-file-viewer > .menu > div > *:active,[data-is="mk-drive-file-viewer"] > .menu > div > *:active{background-color:#767676;background-image:none;border-color:#444;box-shadow:0 1px 3px rgba(0,0,0,0.075),inset 0 0 5px rgba(0,0,0,0.2)} mk-drive-file-viewer > .menu > div > * > i,[data-is="mk-drive-file-viewer"] > .menu > div > * > i{margin-right:4px} mk-drive-file-viewer > .hash,[data-is="mk-drive-file-viewer"] > .hash{padding:14px;border-top:solid 1px #dfdfdf;} mk-drive-file-viewer > .hash > div,[data-is="mk-drive-file-viewer"] > .hash > div{max-width:500px;margin:0 auto;} mk-drive-file-viewer > .hash > div > p,[data-is="mk-drive-file-viewer"] > .hash > div > p{display:block;margin:0;padding:0;color:#555;font-size:.9em;} mk-drive-file-viewer > .hash > div > p > i,[data-is="mk-drive-file-viewer"] > .hash > div > p > i{margin-right:4px} mk-drive-file-viewer > .hash > div > code,[data-is="mk-drive-file-viewer"] > .hash > div > code{display:block;width:100%;margin:6px 0 0 0;padding:8px;white-space:nowrap;overflow:auto;font-size:.8em;border:solid 1px #dfdfdf;border-radius:2px;background:#f5f5f5}', '', function(opts) {

		this.bytesToSize = __WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__["a" /* default */];
		this.gcd = __WEBPACK_IMPORTED_MODULE_1__common_scripts_gcd__["a" /* default */];

		this.mixin('api');

		this.file = this.opts.file;
		this.kind = this.file.type.split('/')[0];

		this.rename = () => {
			const name = window.prompt('名前を変更', this.file.name);
			if (name == null || name == '' || name == this.file.name) return;
			this.api('drive/files/update', {
				file_id: this.file.id,
				name: name
			}).then(() => {
				this.parent.cf(this.file, true);
			});
		};

		this.move = () => {
			const dialog = riot.mount(document.body.appendChild(document.createElement('mk-drive-folder-selector')))[0];
			dialog.one('selected', folder => {
				this.api('drive/files/update', {
					file_id: this.file.id,
					folder_id: folder == null ? null : folder.id
				}).then(() => {
					this.parent.cf(this.file, true);
				});
			});
		};

		this.showCreatedAt = () => {
			alert(new Date(this.file.created_at).toLocaleString());
		};
});

    
  

/***/ }),
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__ = __webpack_require__(69);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-drive-file', '<div class="container"><div class="thumbnail" riot-style="{\'background-image: url(\' + file.url + \'?thumbnail&size=128)\'}"></div><div class="body"><p class="name">{file.name}</p><footer><p class="type"><mk-file-type-icon type="{file.type}"></mk-file-type-icon>{file.type}</p><p class="separator"></p><p class="data-size">{bytesToSize(file.datasize)}</p><p class="separator"></p><p class="created-at"><i class="fa fa-clock-o"></i><mk-time time="{file.created_at}"></mk-time></p></footer></div></div>', 'mk-drive-file,[data-is="mk-drive-file"]{display:block;} mk-drive-file,[data-is="mk-drive-file"],mk-drive-file *,[data-is="mk-drive-file"] *{user-select:none} mk-drive-file *,[data-is="mk-drive-file"] *{pointer-events:none} mk-drive-file > .container,[data-is="mk-drive-file"] > .container{max-width:500px;margin:0 auto;padding:16px;} mk-drive-file > .container:after,[data-is="mk-drive-file"] > .container:after{content:"";display:block;clear:both} mk-drive-file > .container > .thumbnail,[data-is="mk-drive-file"] > .container > .thumbnail{display:block;float:left;width:64px;height:64px;background-size:cover;background-position:center center} mk-drive-file > .container > .body,[data-is="mk-drive-file"] > .container > .body{display:block;float:left;width:calc(100% - 74px);margin-left:10px;} mk-drive-file > .container > .body > .name,[data-is="mk-drive-file"] > .container > .body > .name{display:block;margin:0;padding:0;font-size:.9em;font-weight:bold;color:#555;text-overflow:ellipsis;overflow-wrap:break-word} mk-drive-file > .container > .body > .tags,[data-is="mk-drive-file"] > .container > .body > .tags{display:block;margin:4px 0 0 0;padding:0;list-style:none;font-size:.5em;} mk-drive-file > .container > .body > .tags > .tag,[data-is="mk-drive-file"] > .container > .body > .tags > .tag{display:inline-block;margin:0 5px 0 0;padding:1px 5px;border-radius:2px} mk-drive-file > .container > .body > footer,[data-is="mk-drive-file"] > .container > .body > footer{display:block;margin:4px 0 0 0;font-size:.7em;} mk-drive-file > .container > .body > footer > .separator,[data-is="mk-drive-file"] > .container > .body > footer > .separator{display:inline;margin:0;padding:0 4px;color:#cdcdcd} mk-drive-file > .container > .body > footer > .type,[data-is="mk-drive-file"] > .container > .body > footer > .type{display:inline;margin:0;padding:0;color:#9d9d9d;} mk-drive-file > .container > .body > footer > .type > mk-file-type-icon,[data-is="mk-drive-file"] > .container > .body > footer > .type > mk-file-type-icon{margin-right:4px} mk-drive-file > .container > .body > footer > .data-size,[data-is="mk-drive-file"] > .container > .body > footer > .data-size{display:inline;margin:0;padding:0;color:#9d9d9d} mk-drive-file > .container > .body > footer > .created-at,[data-is="mk-drive-file"] > .container > .body > footer > .created-at{display:inline;margin:0;padding:0;color:#bdbdbd;} mk-drive-file > .container > .body > footer > .created-at > i,[data-is="mk-drive-file"] > .container > .body > footer > .created-at > i{margin-right:2px} mk-drive-file[data-is-selected],[data-is="mk-drive-file"][data-is-selected]{background:#87bb35;} mk-drive-file[data-is-selected],[data-is="mk-drive-file"][data-is-selected],mk-drive-file[data-is-selected] *,[data-is="mk-drive-file"][data-is-selected] *{color:#fff !important}', 'onclick="{onclick}" data-is-selected="{isSelected}"', function(opts) {
		this.bytesToSize = __WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__["a" /* default */];

		this.browser = this.parent;
		this.file = this.opts.file;
		this.isSelected = this.browser.selectedFiles.some(f => f.id == this.file.id);

		this.browser.on('change-selection', selections => {
			this.isSelected = selections.some(f => f.id == this.file.id);
		});

		this.onclick = () => {
			this.browser.chooseFile(this.file);
		};
});

    
  

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-folder', '<div class="container"><p class="name"><i class="fa fa-folder"></i>{folder.name}</p><i class="fa fa-angle-right"></i></div>', 'mk-drive-folder,[data-is="mk-drive-folder"]{display:block;color:#777;} mk-drive-folder,[data-is="mk-drive-folder"],mk-drive-folder *,[data-is="mk-drive-folder"] *{user-select:none} mk-drive-folder *,[data-is="mk-drive-folder"] *{pointer-events:none} mk-drive-folder > .container,[data-is="mk-drive-folder"] > .container{max-width:500px;margin:0 auto;padding:16px;} mk-drive-folder > .container > .name,[data-is="mk-drive-folder"] > .container > .name{display:block;margin:0;padding:0;} mk-drive-folder > .container > .name > i,[data-is="mk-drive-folder"] > .container > .name > i{margin-right:6px} mk-drive-folder > .container > i,[data-is="mk-drive-folder"] > .container > i{position:absolute;top:0;bottom:0;right:8px;margin:auto 0 auto 0;width:1em;height:1em}', 'onclick="{onclick}"', function(opts) {
		this.browser = this.parent;
		this.folder = this.opts.folder;

		this.onclick = () => {
			this.browser.cd(this.folder);
		};
});

    
  

/***/ }),
/* 202 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__ = __webpack_require__(63);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-follow-button', '<button class="{wait: wait, follow: !user.is_following, unfollow: user.is_following}" if="{!init}" onclick="{onclick}" disabled="{wait}"><i class="fa fa-minus" if="{!wait && user.is_following}"></i><i class="fa fa-plus" if="{!wait && !user.is_following}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{wait}"></i>{user.is_following ? \'フォロー解除\' : \'フォロー\'}</button><div class="init" if="{init}"><i class="fa fa-spinner fa-pulse fa-fw"></i></div>', 'mk-follow-button,[data-is="mk-follow-button"]{display:block;} mk-follow-button > button,[data-is="mk-follow-button"] > button,mk-follow-button > .init,[data-is="mk-follow-button"] > .init{display:block;user-select:none;cursor:pointer;padding:0 16px;margin:0;height:inherit;font-size:16px;outline:none;border:solid 1px #87bb35;border-radius:4px;} mk-follow-button > button *,[data-is="mk-follow-button"] > button *,mk-follow-button > .init *,[data-is="mk-follow-button"] > .init *{pointer-events:none} mk-follow-button > button.follow,[data-is="mk-follow-button"] > button.follow,mk-follow-button > .init.follow,[data-is="mk-follow-button"] > .init.follow{color:#87bb35;background:transparent;} mk-follow-button > button.follow:hover,[data-is="mk-follow-button"] > button.follow:hover,mk-follow-button > .init.follow:hover,[data-is="mk-follow-button"] > .init.follow:hover{background:rgba(135,187,53,0.1)} mk-follow-button > button.follow:active,[data-is="mk-follow-button"] > button.follow:active,mk-follow-button > .init.follow:active,[data-is="mk-follow-button"] > .init.follow:active{background:rgba(135,187,53,0.2)} mk-follow-button > button.unfollow,[data-is="mk-follow-button"] > button.unfollow,mk-follow-button > .init.unfollow,[data-is="mk-follow-button"] > .init.unfollow{color:#fff;background:#87bb35} mk-follow-button > button.wait,[data-is="mk-follow-button"] > button.wait,mk-follow-button > .init.wait,[data-is="mk-follow-button"] > .init.wait{cursor:wait !important;opacity:.7} mk-follow-button > button.init,[data-is="mk-follow-button"] > button.init,mk-follow-button > .init.init,[data-is="mk-follow-button"] > .init.init{cursor:wait !important;opacity:.7} mk-follow-button > button > i,[data-is="mk-follow-button"] > button > i,mk-follow-button > .init > i,[data-is="mk-follow-button"] > .init > i{margin-right:4px}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.user = null;
		this.userPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__["a" /* default */])(this.opts.user)
			? this.opts.user
			: Promise.resolve(this.opts.user);
		this.init = true;
		this.wait = false;

		this.on('mount', () => {
			this.userPromise.then(user => {
				this.update({
					init: false,
					user: user
				});
				this.stream.on('follow', this.onStreamFollow);
				this.stream.on('unfollow', this.onStreamUnfollow);
			});
		});

		this.on('unmount', () => {
			this.stream.off('follow', this.onStreamFollow);
			this.stream.off('unfollow', this.onStreamUnfollow);
		});

		this.onStreamFollow = user => {
			if (user.id == this.user.id) {
				this.update({
					user: user
				});
			}
		};

		this.onStreamUnfollow = user => {
			if (user.id == this.user.id) {
				this.update({
					user: user
				});
			}
		};

		this.onclick = () => {
			this.wait = true;
			if (this.user.is_following) {
				this.api('following/delete', {
					user_id: this.user.id
				}).then(() => {
					this.user.is_following = false;
				}).catch(err => {
					console.error(err);
				}).then(() => {
					this.wait = false;
					this.update();
				});
			} else {
				this.api('following/create', {
					user_id: this.user.id
				}).then(() => {
					this.user.is_following = true;
				}).catch(err => {
					console.error(err);
				}).then(() => {
					this.wait = false;
					this.update();
				});
			}
		};
});

    
  

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-home-timeline', '<mk-timeline ref="timeline" init="{init}" more="{more}" empty="{\'表示する投稿がありません。誰かしらをフォローするなどしましょう。\'}"></mk-timeline>', 'mk-home-timeline,[data-is="mk-home-timeline"]{display:block}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.init = new Promise((res, rej) => {
			this.api('posts/timeline').then(posts => {
				res(posts);
				this.trigger('loaded');
			});
		});

		this.on('mount', () => {
			this.stream.on('post', this.onStreamPost);
			this.stream.on('follow', this.onStreamFollow);
			this.stream.on('unfollow', this.onStreamUnfollow);
		});

		this.on('unmount', () => {
			this.stream.off('post', this.onStreamPost);
			this.stream.off('follow', this.onStreamFollow);
			this.stream.off('unfollow', this.onStreamUnfollow);
		});

		this.more = () => {
			return this.api('posts/timeline', {
				max_id: this.refs.timeline.tail().id
			});
		};

		this.onStreamPost = post => {
			this.update({
				isEmpty: false
			});
			this.refs.timeline.addPost(post);
		};

		this.onStreamFollow = () => {
			this.fetch();
		};

		this.onStreamUnfollow = () => {
			this.fetch();
		};
});

    
  

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-home', '<mk-home-timeline ref="tl"></mk-home-timeline>', 'mk-home,[data-is="mk-home"]{display:block;} mk-home > mk-home-timeline,[data-is="mk-home"] > mk-home-timeline{max-width:600px;margin:0 auto}@media (min-width:500px){ mk-home,[data-is="mk-home"]{padding:16px}}', '', function(opts) {
		this.on('mount', () => {
			this.refs.tl.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-images-viewer', '<div class="image" ref="view" onclick="{click}"><img ref="img" riot-src="{image.url + \'?thumbnail&size=512\'}" alt="{image.name}" title="{image.name}"></div>', 'mk-images-viewer,[data-is="mk-images-viewer"]{display:block;padding:8px;overflow:hidden;box-shadow:0 0 4px rgba(0,0,0,0.2);border-radius:4px;} mk-images-viewer > .image > img,[data-is="mk-images-viewer"] > .image > img{display:block;max-height:256px;max-width:100%;margin:0 auto}', '', function(opts) {
		this.images = this.opts.images;
		this.image = this.images[0];

		this.click = () => {
			window.open(this.image.url);
		};
});

    
  

/***/ }),
/* 206 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__ = __webpack_require__(9);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-notification-preview', '<virtual if="{notification.type == \'reaction\'}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><mk-reaction-icon reaction="{notification.reaction}"></mk-reaction-icon>{notification.user.name}</p><p class="post-ref">{getPostSummary(notification.post)}</p></div></virtual><virtual if="{notification.type == \'repost\'}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-retweet"></i>{notification.post.user.name}</p><p class="post-ref">{getPostSummary(notification.post.repost)}</p></div></virtual><virtual if="{notification.type == \'quote\'}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-quote-left"></i>{notification.post.user.name}</p><p class="post-preview">{getPostSummary(notification.post)}</p></div></virtual><virtual if="{notification.type == \'follow\'}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-user-plus"></i>{notification.user.name}</p></div></virtual><virtual if="{notification.type == \'reply\'}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-reply"></i>{notification.post.user.name}</p><p class="post-preview">{getPostSummary(notification.post)}</p></div></virtual><virtual if="{notification.type == \'mention\'}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-at"></i>{notification.post.user.name}</p><p class="post-preview">{getPostSummary(notification.post)}</p></div></virtual><virtual if="{notification.type == \'poll_vote\'}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><div class="text"><p><i class="fa fa-pie-chart"></i>{notification.user.name}</p><p class="post-ref">{getPostSummary(notification.post)}</p></div></virtual>', 'mk-notification-preview,[data-is="mk-notification-preview"]{display:block;margin:0;padding:8px;color:#fff;overflow-wrap:break-word;} mk-notification-preview:after,[data-is="mk-notification-preview"]:after{content:"";display:block;clear:both} mk-notification-preview img,[data-is="mk-notification-preview"] img{display:block;float:left;min-width:36px;min-height:36px;max-width:36px;max-height:36px;border-radius:6px} mk-notification-preview .text,[data-is="mk-notification-preview"] .text{float:right;width:calc(100% - 36px);padding-left:8px;} mk-notification-preview .text p,[data-is="mk-notification-preview"] .text p{margin:0;} mk-notification-preview .text p i,[data-is="mk-notification-preview"] .text p i,mk-notification-preview .text p mk-reaction-icon,[data-is="mk-notification-preview"] .text p mk-reaction-icon{margin-right:4px} mk-notification-preview .post-ref:before,[data-is="mk-notification-preview"] .post-ref:before,mk-notification-preview .post-ref:after,[data-is="mk-notification-preview"] .post-ref:after{font-family:FontAwesome;font-size:1em;font-weight:normal;font-style:normal;display:inline-block;margin-right:3px} mk-notification-preview .post-ref:before,[data-is="mk-notification-preview"] .post-ref:before{content:"\\f10d"} mk-notification-preview .post-ref:after,[data-is="mk-notification-preview"] .post-ref:after{content:"\\f10e"} mk-notification-preview.repost .text p i,[data-is="mk-notification-preview"].repost .text p i,mk-notification-preview.quote .text p i,[data-is="mk-notification-preview"].quote .text p i{color:#77b255} mk-notification-preview.follow .text p i,[data-is="mk-notification-preview"].follow .text p i{color:#53c7ce} mk-notification-preview.reply .text p i,[data-is="mk-notification-preview"].reply .text p i,mk-notification-preview.mention .text p i,[data-is="mk-notification-preview"].mention .text p i{color:#fff}', 'class="{notification.type}"', function(opts) {
		this.getPostSummary = __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__["a" /* default */];
		this.notification = this.opts.notification;
});

    
  

/***/ }),
/* 207 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__ = __webpack_require__(9);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-notification', '<mk-time time="{notification.created_at}"></mk-time><virtual if="{notification.type == \'reaction\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><mk-reaction-icon reaction="{notification.reaction}"></mk-reaction-icon><a href="{CONFIG.url + \'/\' + notification.user.username}">{notification.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'repost\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-retweet"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}">{notification.post.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post.repost)}</a></div></virtual><virtual if="{notification.type == \'quote\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-quote-left"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'follow\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-user-plus"></i><a href="{CONFIG.url + \'/\' + notification.user.username}">{notification.user.name}</a></p></div></virtual><virtual if="{notification.type == \'reply\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-reply"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'mention\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-at"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'poll_vote\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-pie-chart"></i><a href="{CONFIG.url + \'/\' + notification.user.username}">{notification.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual>', 'mk-notification,[data-is="mk-notification"]{display:block;margin:0;padding:16px;overflow-wrap:break-word;} mk-notification > mk-time,[data-is="mk-notification"] > mk-time{display:inline;position:absolute;top:16px;right:12px;vertical-align:top;color:rgba(0,0,0,0.6);font-size:12px} mk-notification:after,[data-is="mk-notification"]:after{content:"";display:block;clear:both} mk-notification .avatar-anchor,[data-is="mk-notification"] .avatar-anchor{display:block;float:left;} mk-notification .avatar-anchor img,[data-is="mk-notification"] .avatar-anchor img{min-width:36px;min-height:36px;max-width:36px;max-height:36px;border-radius:6px} mk-notification .text,[data-is="mk-notification"] .text{float:right;width:calc(100% - 36px);padding-left:8px;} mk-notification .text p,[data-is="mk-notification"] .text p{margin:0;} mk-notification .text p i,[data-is="mk-notification"] .text p i,mk-notification .text p mk-reaction-icon,[data-is="mk-notification"] .text p mk-reaction-icon{margin-right:4px} mk-notification .post-preview,[data-is="mk-notification"] .post-preview{color:rgba(0,0,0,0.7)} mk-notification .post-ref,[data-is="mk-notification"] .post-ref{color:rgba(0,0,0,0.7);} mk-notification .post-ref:before,[data-is="mk-notification"] .post-ref:before,mk-notification .post-ref:after,[data-is="mk-notification"] .post-ref:after{font-family:FontAwesome;font-size:1em;font-weight:normal;font-style:normal;display:inline-block;margin-right:3px} mk-notification .post-ref:before,[data-is="mk-notification"] .post-ref:before{content:"\\f10d"} mk-notification .post-ref:after,[data-is="mk-notification"] .post-ref:after{content:"\\f10e"} mk-notification.repost .text p i,[data-is="mk-notification"].repost .text p i,mk-notification.quote .text p i,[data-is="mk-notification"].quote .text p i{color:#77b255} mk-notification.follow .text p i,[data-is="mk-notification"].follow .text p i{color:#53c7ce} mk-notification.reply .text p i,[data-is="mk-notification"].reply .text p i,mk-notification.mention .text p i,[data-is="mk-notification"].mention .text p i{color:#555} mk-notification.reply .post-preview,[data-is="mk-notification"].reply .post-preview,mk-notification.mention .post-preview,[data-is="mk-notification"].mention .post-preview{color:rgba(0,0,0,0.7)}', 'class="{notification.type}"', function(opts) {
		this.getPostSummary = __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__["a" /* default */];
		this.notification = this.opts.notification;
});

    
  

/***/ }),
/* 208 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__ = __webpack_require__(9);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-notifications', '<div class="notifications" if="{notifications.length != 0}"><virtual each="{notification, i in notifications}"><mk-notification notification="{notification}"></mk-notification><p class="date" if="{i != notifications.length - 1 && notification._date != notifications[i + 1]._date}"><span><i class="fa fa-angle-up"></i>{notification._datetext}</span><span><i class="fa fa-angle-down"></i>{notifications[i + 1]._datetext}</span></p></virtual></div><p class="empty" if="{notifications.length == 0 && !loading}">ありません！</p><p class="loading" if="{loading}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p>', 'mk-notifications,[data-is="mk-notifications"]{display:block;background:#fff;} mk-notifications > .notifications,[data-is="mk-notifications"] > .notifications{margin:0 auto;max-width:500px;} mk-notifications > .notifications > mk-notification,[data-is="mk-notifications"] > .notifications > mk-notification{border-bottom:solid 1px rgba(0,0,0,0.05);} mk-notifications > .notifications > mk-notification:last-child,[data-is="mk-notifications"] > .notifications > mk-notification:last-child{border-bottom:none} mk-notifications > .notifications > .date,[data-is="mk-notifications"] > .notifications > .date{display:block;margin:0;line-height:32px;text-align:center;font-size:.8em;color:#aaa;background:#fdfdfd;border-bottom:solid 1px rgba(0,0,0,0.05);} mk-notifications > .notifications > .date span,[data-is="mk-notifications"] > .notifications > .date span{margin:0 16px} mk-notifications > .notifications > .date i,[data-is="mk-notifications"] > .notifications > .date i{margin-right:8px} mk-notifications > .empty,[data-is="mk-notifications"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-notifications > .loading,[data-is="mk-notifications"] > .loading{margin:0;padding:16px;text-align:center;color:#aaa;} mk-notifications > .loading > i,[data-is="mk-notifications"] > .loading > i{margin-right:4px}', '', function(opts) {
		this.getPostSummary = __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__["a" /* default */];

		this.mixin('api');
		this.mixin('stream');

		this.notifications = [];
		this.loading = true;

		this.on('mount', () => {
			this.api('i/notifications').then(notifications => {
				this.update({
					loading: false,
					notifications: notifications
				});

				this.trigger('fetched');
			});

			this.stream.on('notification', this.onNotification);
		});

		this.on('unmount', () => {
			this.stream.off('notification', this.onNotification);
		});

		this.onNotification = notification => {
			this.notifications.unshift(notification);
			this.update();
		};

		this.on('update', () => {
			this.notifications.forEach(notification => {
				const date = new Date(notification.created_at).getDate();
				const month = new Date(notification.created_at).getMonth() + 1;
				notification._date = date;
				notification._datetext = `${month}月 ${date}日`;
			});
		});
});

    
  

/***/ }),
/* 209 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-notify', '<mk-notification-preview notification="{opts.notification}"></mk-notification-preview>', 'mk-notify,[data-is="mk-notify"]{display:block;position:fixed;z-index:1024;bottom:-64px;left:0;width:100%;height:64px;pointer-events:none;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:rgba(0,0,0,0.5)}', '', function(opts) {

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				bottom: '0px',
				duration: 500,
				easing: 'easeOutQuad'
			});

			setTimeout(() => {
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.root,
					bottom: '-64px',
					duration: 500,
					easing: 'easeOutQuad',
					complete: () => this.unmount()
				});
			}, 6000);
		});
});

    
  

/***/ }),
/* 210 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-drive-page', '<mk-ui ref="ui"><mk-drive ref="browser" folder="{parent.opts.folder}" file="{parent.opts.file}" data-is-naked="true"></mk-drive></mk-ui>', 'mk-drive-page,[data-is="mk-drive-page"]{display:block}', '', function(opts) {

		this.on('mount', () => {
			document.title = 'Misskey Drive';
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-cloud"></i>ドライブ');

			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('func', () => {
				this.refs.ui.refs.browser.openContextMenu();
			}, 'ellipsis-h');

			this.refs.ui.refs.browser.on('begin-fetch', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();
			});

			this.refs.ui.refs.browser.on('fetched-mid', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].set(0.5);
			});

			this.refs.ui.refs.browser.on('fetched', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
			});

			this.refs.ui.refs.browser.on('move-root', () => {
				const title = 'Misskey Drive';

				history.pushState(null, title, '/i/drive');

				document.title = title;
				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-cloud"></i>ドライブ');
			});

			this.refs.ui.refs.browser.on('open-folder', (folder, silent) => {
				const title = folder.name + ' | Misskey Drive';

				if (!silent) {

					history.pushState(null, title, '/i/drive/folder/' + folder.id);
				}

				document.title = title;

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-folder-open"></i>' + folder.name);
			});

			this.refs.ui.refs.browser.on('open-file', (file, silent) => {
				const title = file.name + ' | Misskey Drive';

				if (!silent) {

					history.pushState(null, title, '/i/drive/file/' + file.id);
				}

				document.title = title;

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<mk-file-type-icon class="icon"></mk-file-type-icon>' + file.name);
				riot.mount('mk-file-type-icon', {
					type: file.type
				});
			});
		});
});

    
  

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance', '<main><img src="/assets/title.svg" alt="Misskey"><mk-entrance-signin if="{mode == \'signin\'}"></mk-entrance-signin><mk-entrance-signup if="{mode == \'signup\'}"></mk-entrance-signup><div class="introduction" if="{mode == \'introduction\'}"><mk-introduction></mk-introduction><button onclick="{signin}">わかった</button></div></main><footer><mk-copyright></mk-copyright></footer>', 'mk-entrance,[data-is="mk-entrance"]{display:block;height:100%;} mk-entrance > main,[data-is="mk-entrance"] > main{display:block;} mk-entrance > main > img,[data-is="mk-entrance"] > main > img{display:block;width:130px;height:120px;margin:0 auto} mk-entrance > main > .introduction,[data-is="mk-entrance"] > main > .introduction{max-width:300px;margin:0 auto;color:#666;} mk-entrance > main > .introduction > button,[data-is="mk-entrance"] > main > .introduction > button{display:block;margin:16px auto 0 auto} mk-entrance > footer > mk-copyright,[data-is="mk-entrance"] > footer > mk-copyright{margin:0;text-align:center;line-height:64px;font-size:10px;color:rgba(0,0,0,0.5)}', '', function(opts) {
		this.mode = 'signin';

		this.signup = () => {
			this.update({
				mode: 'signup'
			});
		};

		this.signin = () => {
			this.update({
				mode: 'signin'
			});
		};

		this.introduction = () => {
			this.update({
				mode: 'introduction'
			});
		};
});

    
  

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance-signin', '<mk-signin></mk-signin><div class="divider"><span>or</span></div><button class="signup" onclick="{parent.signup}">新規登録</button><a class="introduction" onclick="{parent.introduction}">Misskeyについて</a>', 'mk-entrance-signin,[data-is="mk-entrance-signin"]{display:block;margin:0 auto;padding:0 8px;max-width:350px;text-align:center;} mk-entrance-signin > .signup,[data-is="mk-entrance-signin"] > .signup{padding:16px;width:100%;font-size:1em;color:#fff;background:#87bb35;border-radius:3px} mk-entrance-signin > .divider,[data-is="mk-entrance-signin"] > .divider{padding:16px 0;text-align:center;} mk-entrance-signin > .divider:after,[data-is="mk-entrance-signin"] > .divider:after{content:"";display:block;position:absolute;top:50%;width:100%;height:1px;border-top:solid 1px rgba(0,0,0,0.1)} mk-entrance-signin > .divider > *,[data-is="mk-entrance-signin"] > .divider > *{z-index:1;padding:0 8px;color:rgba(0,0,0,0.5);background:#fdfdfd} mk-entrance-signin > .introduction,[data-is="mk-entrance-signin"] > .introduction{display:inline-block;margin-top:16px;font-size:12px;color:#666}', '', function(opts) {
});

    
  

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance-signup', '<mk-signup></mk-signup><button class="cancel" type="button" onclick="{parent.signin}" title="キャンセル"><i class="fa fa-times"></i></button>', 'mk-entrance-signup,[data-is="mk-entrance-signup"]{display:block;margin:0 auto;padding:0 8px;max-width:350px;} mk-entrance-signup > .cancel,[data-is="mk-entrance-signup"] > .cancel{cursor:pointer;display:block;position:absolute;top:0;right:0;z-index:1;margin:0;padding:0;font-size:1.2em;color:#999;border:none;outline:none;box-shadow:none;background:transparent;transition:opacity .1s ease;} mk-entrance-signup > .cancel:hover,[data-is="mk-entrance-signup"] > .cancel:hover{color:#555} mk-entrance-signup > .cancel:active,[data-is="mk-entrance-signup"] > .cancel:active{color:#222} mk-entrance-signup > .cancel > i,[data-is="mk-entrance-signup"] > .cancel > i{padding:14px}', '', function(opts) {
});

    
  

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_scripts_get_post_summary__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scripts_open_post_form__ = __webpack_require__(77);

    var riot = __webpack_require__(0)
    



riot.tag2('mk-home-page', '<mk-ui ref="ui"><mk-home ref="home"></mk-home></mk-ui>', 'mk-home-page,[data-is="mk-home-page"]{display:block}', '', function(opts) {

		this.mixin('i');
		this.mixin('stream');

		this.unreadCount = 0;

		this.on('mount', () => {
			document.title = 'Misskey'
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-home"></i>ホーム');

			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('func', () => {
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__scripts_open_post_form__["a" /* default */])();
			}, 'pencil');

			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.stream.on('post', this.onStreamPost);
			document.addEventListener('visibilitychange', this.onVisibilitychange, false);

			this.refs.ui.refs.home.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
			});
		});

		this.on('unmount', () => {
			this.stream.off('post', this.onStreamPost);
			document.removeEventListener('visibilitychange', this.onVisibilitychange);
		});

		this.onStreamPost = post => {
			if (document.hidden && post.user_id !== this.I.id) {
				this.unreadCount++;
				document.title = `(${this.unreadCount}) ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_scripts_get_post_summary__["a" /* default */])(post)}`;
			}
		};

		this.onVisibilitychange = () => {
			if (!document.hidden) {
				this.unreadCount = 0;
				document.title = 'Misskey';
			}
		};
});

    
  

/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-messaging-room-page', '<mk-ui ref="ui"><mk-messaging-room if="{!parent.fetching}" user="{parent.user}" is-naked="{true}"></mk-messaging-room></mk-ui>', 'mk-messaging-room-page,[data-is="mk-messaging-room-page"]{display:block}', '', function(opts) {

		this.mixin('api');

		this.fetching = true;

		this.on('mount', () => {
			this.api('users/show', {
				username: this.opts.username
			}).then(user => {
				this.update({
					fetching: false,
					user: user
				});

				document.title = `メッセージ: ${user.name} | Misskey`;

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-comments-o"></i>' + user.name);
			});
		});
});

    
  

/***/ }),
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-messaging-page', '<mk-ui ref="ui"><mk-messaging ref="index"></mk-messaging></mk-ui>', 'mk-messaging-page,[data-is="mk-messaging-page"]{display:block}', '', function(opts) {

		this.mixin('page');

		this.on('mount', () => {
			document.title = 'Misskey | メッセージ';
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-comments-o"></i>メッセージ');

			this.refs.ui.refs.index.on('navigate-user', user => {
				this.page('/i/messaging/' + user.username);
			});
		});
});

    
  

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-new-post-page', '<mk-post-form ref="form"></mk-post-form>', 'mk-new-post-page,[data-is="mk-new-post-page"]{display:block}', '', function(opts) {
});

    
  

/***/ }),
/* 218 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-notifications-page', '<mk-ui ref="ui"><mk-notifications ref="notifications"></mk-notifications></mk-ui>', 'mk-notifications-page,[data-is="mk-notifications-page"]{display:block}', '', function(opts) {

		this.on('mount', () => {
			document.title = 'Misskey | 通知';
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-bell-o"></i>通知');

			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.notifications.on('fetched', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 219 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-post-page', '<mk-ui ref="ui"><main><mk-post-detail ref="post" post="{parent.post}"></mk-post-detail></main></mk-ui>', 'mk-post-page,[data-is="mk-post-page"]{display:block;} mk-post-page main,[data-is="mk-post-page"] main{background:#fff;} mk-post-page main > mk-post-detail,[data-is="mk-post-page"] main > mk-post-detail{width:100%;max-width:500px;margin:0 auto}', '', function(opts) {

		this.post = this.opts.post;

		this.on('mount', () => {
			document.title = 'Misskey';
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-sticky-note-o"></i>投稿');

			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.post.on('post-fetched', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].set(0.5);
			});

			this.refs.ui.refs.post.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 220 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-search-page', '<mk-ui ref="ui"><mk-search ref="search" query="{parent.opts.query}"></mk-search></mk-ui>', 'mk-search-page,[data-is="mk-search-page"]{display:block}', '', function(opts) {

		this.on('mount', () => {
			document.title = `検索: ${this.opts.query} | Misskey`

			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-search"></i>' + this.opts.query);

			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.search.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-settings-page', '<mk-ui ref="ui"><ul><li><a><i class="fa fa-user"></i>プロフィール</a></li><li><a href="./settings/authorized-apps"><i class="fa fa-puzzle-piece"></i>アプリケーション</a></li><li><a href="./settings/twitter"><i class="fa fa-twitter"></i>Twitter連携</a></li><li><a href="./settings/signin-history"><i class="fa fa-sign-in"></i>ログイン履歴</a></li><li><a href="./settings/api"><i class="fa fa-key"></i>API</a></li></ul></mk-ui>', 'mk-settings-page,[data-is="mk-settings-page"]{display:block}', '', function(opts) {

		this.on('mount', () => {
			document.title = 'Misskey | 設定';
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-cog"></i>設定');
		});
});

    
  

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-api-info-page', '<mk-ui ref="ui"><mk-api-info></mk-api-info></mk-ui>', 'mk-api-info-page,[data-is="mk-api-info-page"]{display:block}', '', function(opts) {
		const ui = __webpack_require__(4);

		this.on('mount', () => {
			document.title = 'Misskey | API';
			ui.trigger('title', '<i class="fa fa-key"></i>API');
		});
});

    
  

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-authorized-apps-page', '<mk-ui ref="ui"><mk-authorized-apps></mk-authorized-apps></mk-ui>', 'mk-authorized-apps-page,[data-is="mk-authorized-apps-page"]{display:block}', '', function(opts) {
		const ui = __webpack_require__(4);

		this.on('mount', () => {
			document.title = 'Misskey | アプリケーション';
			ui.trigger('title', '<i class="fa fa-puzzle-piece"></i>アプリケーション');
		});
});

    
  

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-signin-history-page', '<mk-ui ref="ui"><mk-signin-history></mk-signin-history></mk-ui>', 'mk-signin-history-page,[data-is="mk-signin-history-page"]{display:block}', '', function(opts) {
		const ui = __webpack_require__(4);

		this.on('mount', () => {
			document.title = 'Misskey | ログイン履歴';
			ui.trigger('title', '<i class="fa fa-sign-in"></i>ログイン履歴');
		});
});

    
  

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-twitter-setting-page', '<mk-ui ref="ui"><mk-twitter-setting></mk-twitter-setting></mk-ui>', 'mk-twitter-setting-page,[data-is="mk-twitter-setting-page"]{display:block}', '', function(opts) {
		const ui = __webpack_require__(4);

		this.on('mount', () => {
			document.title = 'Misskey | Twitter連携';
			ui.trigger('title', '<i class="fa fa-twitter"></i>Twitter連携');
		});
});

    
  

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-user-followers-page', '<mk-ui ref="ui"><mk-user-followers ref="list" if="{!parent.fetching}" user="{parent.user}"></mk-user-followers></mk-ui>', 'mk-user-followers-page,[data-is="mk-user-followers-page"]{display:block}', '', function(opts) {

		this.mixin('api');

		this.fetching = true;
		this.user = null;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.api('users/show', {
				username: this.opts.user
			}).then(user => {
				this.update({
					fetching: false,
					user: user
				});

				document.title = user.name + 'のフォロワー | Misskey';

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<img src="' + user.avatar_url + '?thumbnail&size=64">' + user.name + 'のフォロワー');

				this.refs.ui.refs.list.on('loaded', () => {
					__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
				});
			});
		});
});

    
  

/***/ }),
/* 227 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-user-following-page', '<mk-ui ref="ui"><mk-user-following ref="list" if="{!parent.fetching}" user="{parent.user}"></mk-user-following></mk-ui>', 'mk-user-following-page,[data-is="mk-user-following-page"]{display:block}', '', function(opts) {

		this.mixin('api');

		this.fetching = true;
		this.user = null;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.api('users/show', {
				username: this.opts.user
			}).then(user => {
				this.update({
					fetching: false,
					user: user
				});

				document.title = user.name + 'のフォロー | Misskey';

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<img src="' + user.avatar_url + '?thumbnail&size=64">' + user.name + 'のフォロー');

				this.refs.ui.refs.list.on('loaded', () => {
					__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
				});
			});
		});
});

    
  

/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-user-page', '<mk-ui ref="ui"><mk-user ref="user" user="{parent.user}" page="{parent.opts.page}"></mk-user></mk-ui>', 'mk-user-page,[data-is="mk-user-page"]{display:block}', '', function(opts) {

		this.user = this.opts.user;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.user.on('loaded', user => {
				__WEBPACK_IMPORTED_MODULE_1__common_scripts_loading__["a" /* default */].done();
				document.title = user.name + ' | Misskey';

				__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].trigger('title', '<i class="fa fa-user"></i>' + user.name);
			});
		});
});

    
  

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_open_post_form__ = __webpack_require__(77);

    var riot = __webpack_require__(0)
    


riot.tag2('mk-post-detail', '<div class="fetching" if="{fetching}"><mk-ellipsis-icon></mk-ellipsis-icon></div><div class="main" if="{!fetching}"><button class="read-more" if="{p.reply_to && p.reply_to.reply_to_id && context == null}" onclick="{loadContext}" disabled="{loadingContext}"><i class="fa fa-ellipsis-v" if="{!contextFetching}"></i><i class="fa fa-spinner fa-pulse" if="{contextFetching}"></i></button><div class="context"><virtual each="{post in context}"><mk-post-preview post="{post}"></mk-post-preview></virtual></div><div class="reply-to" if="{p.reply_to}"><mk-post-preview post="{p.reply_to}"></mk-post-preview></div><div class="repost" if="{isRepost}"><p><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=32\'}" alt="avatar"></a><i class="fa fa-retweet"></i><a class="name" href="{CONFIG.url + \'/\' + post.user.username}"> {post.user.name} </a> がRepost </p></div><article><header><a class="avatar-anchor" href="{CONFIG.url + \'/\' + p.user.username}"><img class="avatar" riot-src="{p.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div><a class="name" href="{CONFIG.url + \'/\' + p.user.username}">{p.user.name}</a><span class="username">@{p.user.username}</span></div></header><div class="body"><div class="text" ref="text"></div><div class="media" if="{p.media}"><virtual each="{file in p.media}"><img riot-src="{file.url + \'?thumbnail&size=512\'}" alt="{file.name}" title="{file.name}"></virtual></div><mk-poll if="{p.poll}" post="{p}"></mk-poll></div><a class="time" href="{url}"><mk-time time="{p.created_at}" mode="detail"></mk-time></a><footer><mk-reactions-viewer post="{p}"></mk-reactions-viewer><button onclick="{reply}" title="返信"><i class="fa fa-reply"></i><p class="count" if="{p.replies_count > 0}">{p.replies_count}</p></button><button onclick="{repost}" title="Repost"><i class="fa fa-retweet"></i><p class="count" if="{p.repost_count > 0}">{p.repost_count}</p></button><button class="{reacted: p.my_reaction != null}" onclick="{react}" ref="reactButton" title="リアクション"><i class="fa fa-plus"></i><p class="count" if="{p.reactions_count > 0}">{p.reactions_count}</p></button><button><i class="fa fa-ellipsis-h"></i></button></footer></article><div class="replies"><virtual each="{post in replies}"><mk-post-preview post="{post}"></mk-post-preview></virtual></div></div>', 'mk-post-detail,[data-is="mk-post-detail"]{display:block;margin:0;padding:0;} mk-post-detail > .fetching,[data-is="mk-post-detail"] > .fetching{padding:64px 0} mk-post-detail > .main > .read-more,[data-is="mk-post-detail"] > .main > .read-more{display:block;margin:0;padding:10px 0;width:100%;font-size:1em;text-align:center;color:#999;cursor:pointer;background:#fafafa;outline:none;border:none;border-bottom:solid 1px #eef0f2;border-radius:6px 6px 0 0;box-shadow:none;} mk-post-detail > .main > .read-more:hover,[data-is="mk-post-detail"] > .main > .read-more:hover{background:#f6f6f6} mk-post-detail > .main > .read-more:active,[data-is="mk-post-detail"] > .main > .read-more:active{background:#f0f0f0} mk-post-detail > .main > .read-more:disabled,[data-is="mk-post-detail"] > .main > .read-more:disabled{color:#ccc} mk-post-detail > .main > .context > *,[data-is="mk-post-detail"] > .main > .context > *{border-bottom:1px solid #eef0f2} mk-post-detail > .main > .repost,[data-is="mk-post-detail"] > .main > .repost{color:#9dbb00;background:linear-gradient(to bottom,#edfde2 0%,#fff 100%);} mk-post-detail > .main > .repost > p,[data-is="mk-post-detail"] > .main > .repost > p{margin:0;padding:16px 32px;} mk-post-detail > .main > .repost > p .avatar-anchor,[data-is="mk-post-detail"] > .main > .repost > p .avatar-anchor{display:inline-block;} mk-post-detail > .main > .repost > p .avatar-anchor .avatar,[data-is="mk-post-detail"] > .main > .repost > p .avatar-anchor .avatar{vertical-align:bottom;min-width:28px;min-height:28px;max-width:28px;max-height:28px;margin:0 8px 0 0;border-radius:6px} mk-post-detail > .main > .repost > p i,[data-is="mk-post-detail"] > .main > .repost > p i{margin-right:4px} mk-post-detail > .main > .repost > p .name,[data-is="mk-post-detail"] > .main > .repost > p .name{font-weight:bold} mk-post-detail > .main > .repost + article,[data-is="mk-post-detail"] > .main > .repost + article{padding-top:8px} mk-post-detail > .main > .reply-to,[data-is="mk-post-detail"] > .main > .reply-to{border-bottom:1px solid #eef0f2} mk-post-detail > .main > article,[data-is="mk-post-detail"] > .main > article{padding:14px 16px 9px 16px;}@media (min-width:500px){ mk-post-detail > .main > article,[data-is="mk-post-detail"] > .main > article{padding:28px 32px 18px 32px}} mk-post-detail > .main > article:after,[data-is="mk-post-detail"] > .main > article:after{content:"";display:block;clear:both} mk-post-detail > .main > article:hover > .main > footer > button,[data-is="mk-post-detail"] > .main > article:hover > .main > footer > button{color:#888} mk-post-detail > .main > article > header,[data-is="mk-post-detail"] > .main > article > header{display:flex;line-height:1.1;} mk-post-detail > .main > article > header > .avatar-anchor,[data-is="mk-post-detail"] > .main > article > header > .avatar-anchor{display:block;padding:0 .5em 0 0;} mk-post-detail > .main > article > header > .avatar-anchor > .avatar,[data-is="mk-post-detail"] > .main > article > header > .avatar-anchor > .avatar{display:block;width:54px;height:54px;margin:0;border-radius:8px;vertical-align:bottom;}@media (min-width:500px){ mk-post-detail > .main > article > header > .avatar-anchor > .avatar,[data-is="mk-post-detail"] > .main > article > header > .avatar-anchor > .avatar{width:60px;height:60px}} mk-post-detail > .main > article > header > div > .name,[data-is="mk-post-detail"] > .main > article > header > div > .name{display:inline-block;margin:.4em 0;color:#777;font-size:16px;font-weight:bold;text-align:left;text-decoration:none;} mk-post-detail > .main > article > header > div > .name:hover,[data-is="mk-post-detail"] > .main > article > header > div > .name:hover{text-decoration:underline} mk-post-detail > .main > article > header > div > .username,[data-is="mk-post-detail"] > .main > article > header > div > .username{display:block;text-align:left;margin:0;color:#ccc} mk-post-detail > .main > article > .body,[data-is="mk-post-detail"] > .main > article > .body{padding:8px 0;} mk-post-detail > .main > article > .body > .text,[data-is="mk-post-detail"] > .main > article > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:16px;color:#717171;}@media (min-width:500px){ mk-post-detail > .main > article > .body > .text,[data-is="mk-post-detail"] > .main > article > .body > .text{font-size:24px}} mk-post-detail > .main > article > .body > .text .link:after,[data-is="mk-post-detail"] > .main > article > .body > .text .link:after{content:"\\f14c";display:inline-block;padding-left:2px;font-family:FontAwesome;font-size:.9em;font-weight:400;font-style:normal} mk-post-detail > .main > article > .body > .text > mk-url-preview,[data-is="mk-post-detail"] > .main > article > .body > .text > mk-url-preview{margin-top:8px} mk-post-detail > .main > article > .body > .media > img,[data-is="mk-post-detail"] > .main > article > .body > .media > img{display:block;max-width:100%} mk-post-detail > .main > article > .time,[data-is="mk-post-detail"] > .main > article > .time{font-size:16px;color:#c0c0c0} mk-post-detail > .main > article > footer,[data-is="mk-post-detail"] > .main > article > footer{font-size:1.2em;} mk-post-detail > .main > article > footer > button,[data-is="mk-post-detail"] > .main > article > footer > button{margin:0 28px 0 0;padding:8px;background:transparent;border:none;box-shadow:none;font-size:1em;color:#ddd;cursor:pointer;} mk-post-detail > .main > article > footer > button:hover,[data-is="mk-post-detail"] > .main > article > footer > button:hover{color:#666} mk-post-detail > .main > article > footer > button > .count,[data-is="mk-post-detail"] > .main > article > footer > button > .count{display:inline;margin:0 0 0 8px;color:#999} mk-post-detail > .main > article > footer > button.reacted,[data-is="mk-post-detail"] > .main > article > footer > button.reacted{color:#87bb35} mk-post-detail > .main > .replies > *,[data-is="mk-post-detail"] > .main > .replies > *{border-top:1px solid #eef0f2}', '', function(opts) {

		this.mixin('api');

		this.fetching = true;
		this.loadingContext = false;
		this.context = null;
		this.post = null;

		this.on('mount', () => {
			this.api('posts/show', {
				post_id: this.opts.post
			}).then(post => {
				const isRepost = post.repost != null;
				const p = isRepost ? post.repost : post;
				p.reactions_count = p.reaction_counts ? Object.keys(p.reaction_counts).map(key => p.reaction_counts[key]).reduce((a, b) => a + b) : 0;

				this.update({
					fetching: false,
					post: post,
					isRepost: isRepost,
					p: p,
					summary: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__["a" /* default */])(p)
				});

				this.trigger('loaded');

				if (this.p.text) {
					const tokens = this.p.ast;

					this.refs.text.innerHTML = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(tokens);

					this.refs.text.children.forEach(e => {
						if (e.tagName == 'MK-URL') riot.mount(e);
					});

					tokens
					.filter(t => (t.type == 'url' || t.type == 'link') && !t.silent)
					.map(t => {
						riot.mount(this.refs.text.appendChild(document.createElement('mk-url-preview')), {
							url: t.url
						});
					});
				}

				this.api('posts/replies', {
					post_id: this.p.id,
					limit: 8
				}).then(replies => {
					this.update({
						replies: replies
					});
				});
			});
		});

		this.reply = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_open_post_form__["a" /* default */])({
				reply: this.p
			});
		};

		this.repost = () => {
			const text = window.prompt(`「${this.summary}」をRepost`);
			if (text == null) return;
			this.api('posts/create', {
				repost_id: this.p.id,
				text: text == '' ? undefined : text
			});
		};

		this.react = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-reaction-picker')), {
				source: this.refs.reactButton,
				post: this.p,
				compact: true
			});
		};

		this.loadContext = () => {
			this.contextFetching = true;

			this.api('posts/context', {
				post_id: this.p.reply_to_id
			}).then(context => {
				this.update({
					contextFetching: false,
					context: context.reverse()
				});
			});
		};
});

    
  

/***/ }),
/* 230 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_cat__ = __webpack_require__(74);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-post-form', '<header><div><button class="cancel" onclick="{cancel}"><i class="fa fa-times"></i></button><div><span if="{refs.text}" class="text-count {over: refs.text.value.length > 1000}">{1000 - refs.text.value.length}</span><button class="submit" onclick="{post}">投稿</button></div></div></header><div class="form"><mk-post-preview if="{opts.reply}" post="{opts.reply}"></mk-post-preview><textarea ref="text" disabled="{wait}" oninput="{update}" onkeydown="{onkeydown}" onpaste="{onpaste}" placeholder="{opts.reply ? \'この投稿への返信...\' : \'いまどうしてる？\'}"></textarea><div class="attaches" if="{files.length != 0}"><ul class="files" ref="attaches"><li class="file" each="{files}"><div class="img" riot-style="background-image: url({url + \'?thumbnail&size=64\'})" title="{name}"></div></li><li class="add" if="{files.length < 4}" title="PCからファイルを添付" onclick="{selectFile}"><i class="fa fa-plus"></i></li></ul></div><mk-poll-editor if="{poll}" ref="poll" ondestroy="{onPollDestroyed}"></mk-poll-editor><mk-uploader ref="uploader"></mk-uploader><button ref="upload" onclick="{selectFile}"><i class="fa fa-upload"></i></button><button ref="drive" onclick="{selectFileFromDrive}"><i class="fa fa-cloud"></i></button><button class="cat" onclick="{cat}"><i class="fa fa-smile-o"></i></button><button class="poll" onclick="{addPoll}"><i class="fa fa-pie-chart"></i></button><input ref="file" type="file" accept="image/*" multiple="multiple" onchange="{changeFile}"></div>', 'mk-post-form,[data-is="mk-post-form"]{display:block;padding-top:50px;} mk-post-form > header,[data-is="mk-post-form"] > header{position:fixed;z-index:1000;top:0;left:0;width:100%;height:50px;background:#fff;} mk-post-form > header > div,[data-is="mk-post-form"] > header > div{max-width:500px;margin:0 auto;} mk-post-form > header > div > .cancel,[data-is="mk-post-form"] > header > div > .cancel{width:50px;line-height:50px;font-size:24px;color:#555} mk-post-form > header > div > div,[data-is="mk-post-form"] > header > div > div{position:absolute;top:0;right:0;} mk-post-form > header > div > div > .text-count,[data-is="mk-post-form"] > header > div > div > .text-count{line-height:50px;color:#657786} mk-post-form > header > div > div > .submit,[data-is="mk-post-form"] > header > div > div > .submit{margin:8px;padding:0 16px;line-height:34px;color:#fff;background:#87bb35;border-radius:4px;} mk-post-form > header > div > div > .submit:disabled,[data-is="mk-post-form"] > header > div > div > .submit:disabled{opacity:.7} mk-post-form > .form,[data-is="mk-post-form"] > .form{max-width:500px;margin:0 auto;} mk-post-form > .form > mk-post-preview,[data-is="mk-post-form"] > .form > mk-post-preview{padding:16px} mk-post-form > .form > .attaches > .files,[data-is="mk-post-form"] > .form > .attaches > .files{display:block;margin:0;padding:4px;list-style:none;} mk-post-form > .form > .attaches > .files:after,[data-is="mk-post-form"] > .form > .attaches > .files:after{content:"";display:block;clear:both} mk-post-form > .form > .attaches > .files > .file,[data-is="mk-post-form"] > .form > .attaches > .files > .file{display:block;float:left;margin:4px;padding:0;cursor:move;} mk-post-form > .form > .attaches > .files > .file:hover > .remove,[data-is="mk-post-form"] > .form > .attaches > .files > .file:hover > .remove{display:block} mk-post-form > .form > .attaches > .files > .file > .img,[data-is="mk-post-form"] > .form > .attaches > .files > .file > .img{width:64px;height:64px;background-size:cover;background-position:center center} mk-post-form > .form > .attaches > .files > .file > .remove,[data-is="mk-post-form"] > .form > .attaches > .files > .file > .remove{display:none;position:absolute;top:-6px;right:-6px;width:16px;height:16px;cursor:pointer} mk-post-form > .form > .attaches > .files > .add,[data-is="mk-post-form"] > .form > .attaches > .files > .add{display:block;float:left;margin:4px;padding:0;border:dashed 2px rgba(135,187,53,0.2);cursor:pointer;} mk-post-form > .form > .attaches > .files > .add:hover,[data-is="mk-post-form"] > .form > .attaches > .files > .add:hover{border-color:rgba(135,187,53,0.3);} mk-post-form > .form > .attaches > .files > .add:hover > i,[data-is="mk-post-form"] > .form > .attaches > .files > .add:hover > i{color:rgba(135,187,53,0.4)} mk-post-form > .form > .attaches > .files > .add > i,[data-is="mk-post-form"] > .form > .attaches > .files > .add > i{display:block;width:60px;height:60px;line-height:60px;text-align:center;font-size:1.2em;color:rgba(135,187,53,0.2)} mk-post-form > .form > mk-uploader,[data-is="mk-post-form"] > .form > mk-uploader{margin:8px 0 0 0;padding:8px} mk-post-form > .form > [ref=\'file\'],[data-is="mk-post-form"] > .form > [ref=\'file\']{display:none} mk-post-form > .form > [ref=\'text\'],[data-is="mk-post-form"] > .form > [ref=\'text\']{display:block;padding:12px;margin:0;width:100%;max-width:100%;min-width:100%;min-height:80px;font-size:16px;color:#333;border:none;border-bottom:solid 1px #ddd;border-radius:0;} mk-post-form > .form > [ref=\'text\']:disabled,[data-is="mk-post-form"] > .form > [ref=\'text\']:disabled{opacity:.5} mk-post-form > .form > [ref=\'upload\'],[data-is="mk-post-form"] > .form > [ref=\'upload\'],mk-post-form > .form > [ref=\'drive\'],[data-is="mk-post-form"] > .form > [ref=\'drive\'],mk-post-form > .form .cat,[data-is="mk-post-form"] > .form .cat,mk-post-form > .form .poll,[data-is="mk-post-form"] > .form .poll{display:inline-block;padding:0;margin:0;width:48px;height:48px;font-size:20px;color:#657786;background:transparent;outline:none;border:none;border-radius:0;box-shadow:none}', '', function(opts) {

		this.mixin('api');

		this.wait = false;
		this.uploadings = [];
		this.files = [];
		this.poll = false;

		this.on('mount', () => {
			this.refs.uploader.on('uploaded', file => {
				this.addFile(file);
			});

			this.refs.uploader.on('change-uploads', uploads => {
				this.trigger('change-uploading-files', uploads);
			});

			this.refs.text.focus();
		});

		this.onkeydown = e => {
			if ((e.which == 10 || e.which == 13) && (e.ctrlKey || e.metaKey)) this.post();
		};

		this.onpaste = e => {
			e.clipboardData.items.forEach(item => {
				if (item.kind == 'file') {
					this.upload(item.getAsFile());
				}
			});
		};

		this.selectFile = () => {
			this.refs.file.click();
		};

		this.selectFileFromDrive = () => {
			const i = riot.mount(document.body.appendChild(document.createElement('mk-drive-selector')), {
				multiple: true
			})[0];
			i.one('selected', files => {
				files.forEach(this.addFile);
			});
		};

		this.changeFile = () => {
			this.refs.file.files.forEach(this.upload);
		};

		this.upload = file => {
			this.refs.uploader.upload(file);
		};

		this.addFile = file => {
			file._remove = () => {
				this.files = this.files.filter(x => x.id != file.id);
				this.trigger('change-files', this.files);
				this.update();
			};

			this.files.push(file);
			this.trigger('change-files', this.files);
			this.update();
		};

		this.addPoll = () => {
			this.poll = true;
		};

		this.onPollDestroyed = () => {
			this.update({
				poll: false
			});
		};

		this.post = () => {
			this.wait = true;

			const files = this.files && this.files.length > 0
				? this.files.map(f => f.id)
				: undefined;

			this.api('posts/create', {
				text: this.refs.text.value,
				media_ids: files,
				reply_to_id: opts.reply ? opts.reply.id : undefined,
				poll: this.poll ? this.refs.poll.get() : undefined
			}).then(data => {
				this.trigger('post');
				this.unmount();
			}).catch(err => {
				this.update({
					wait: false
				});
			});
		};

		this.cancel = () => {
			this.trigger('cancel');
			this.unmount();
		};

		this.cat = () => {
			this.refs.text.value += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_get_cat__["a" /* default */])();
		};
});

    
  

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-post-preview', '<article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + post.user.username}">{post.user.name}</a><span class="username">@{post.user.username}</span><a class="time" href="{CONFIG.url + \'/\' + post.user.username + \'/\' + post.id}"><mk-time time="{post.created_at}"></mk-time></a></header><div class="body"><mk-sub-post-content class="text" post="{post}"></mk-sub-post-content></div></div></article>', 'mk-post-preview,[data-is="mk-post-preview"]{display:block;margin:0;padding:0;font-size:.9em;background:#fff;} mk-post-preview > article:after,[data-is="mk-post-preview"] > article:after{content:"";display:block;clear:both} mk-post-preview > article:hover > .main > footer > button,[data-is="mk-post-preview"] > article:hover > .main > footer > button{color:#888} mk-post-preview > article > .avatar-anchor,[data-is="mk-post-preview"] > article > .avatar-anchor{display:block;float:left;margin:0 12px 0 0;} mk-post-preview > article > .avatar-anchor > .avatar,[data-is="mk-post-preview"] > article > .avatar-anchor > .avatar{display:block;width:48px;height:48px;margin:0;border-radius:8px;vertical-align:bottom} mk-post-preview > article > .main,[data-is="mk-post-preview"] > article > .main{float:left;width:calc(100% - 60px);} mk-post-preview > article > .main > header,[data-is="mk-post-preview"] > article > .main > header{display:flex;margin-bottom:4px;white-space:nowrap;} mk-post-preview > article > .main > header > .name,[data-is="mk-post-preview"] > article > .main > header > .name{display:block;margin:0 .5em 0 0;padding:0;overflow:hidden;color:#607073;font-size:1em;font-weight:700;text-align:left;text-decoration:none;text-overflow:ellipsis;} mk-post-preview > article > .main > header > .name:hover,[data-is="mk-post-preview"] > article > .main > header > .name:hover{text-decoration:underline} mk-post-preview > article > .main > header > .username,[data-is="mk-post-preview"] > article > .main > header > .username{text-align:left;margin:0 .5em 0 0;color:#d1d8da} mk-post-preview > article > .main > header > .time,[data-is="mk-post-preview"] > article > .main > header > .time{margin-left:auto;color:#b2b8bb} mk-post-preview > article > .main > .body > .text,[data-is="mk-post-preview"] > article > .main > .body > .text{cursor:default;margin:0;padding:0;font-size:1.1em;color:#717171}', '', function(opts) {
this.post = this.opts.post
});

    
  

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-search-posts', '<mk-timeline init="{init}" more="{more}" empty="{\'「\' + query + \'」に関する投稿は見つかりませんでした。\'}"></mk-timeline>', 'mk-search-posts,[data-is="mk-search-posts"]{display:block;background:#fff}', '', function(opts) {
		this.mixin('api');

		this.max = 30;
		this.offset = 0;

		this.query = this.opts.query;
		this.withMedia = this.opts.withMedia;

		this.init = new Promise((res, rej) => {
			this.api('posts/search', {
				query: this.query
			}).then(posts => {
				res(posts);
				this.trigger('loaded');
			});
		});

		this.more = () => {
			this.offset += this.max;
			return this.api('posts/search', {
				query: this.query,
				max: this.max,
				offset: this.offset
			});
		};
});

    
  

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-search', '<mk-search-posts ref="posts" query="{query}"></mk-search-posts>', 'mk-search,[data-is="mk-search"]{display:block}', '', function(opts) {
		this.query = this.opts.query;

		this.on('mount', () => {
			this.refs.posts.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 234 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-sub-post-content', '<div class="body"><a class="reply" if="{post.reply_to_id}"><i class="fa fa-reply"></i></a><span ref="text"></span><a class="quote" if="{post.repost_id}" href="{\'/post:\' + post.repost_id}">RP: ...</a></div><details if="{post.media}"><summary>({post.media.length}つのメディア)</summary><mk-images-viewer images="{post.media}"></mk-images-viewer></details><details if="{post.poll}"><summary>投票</summary><mk-poll post="{post}"></mk-poll></details>', 'mk-sub-post-content,[data-is="mk-sub-post-content"]{display:block;overflow-wrap:break-word;} mk-sub-post-content > .body > .reply,[data-is="mk-sub-post-content"] > .body > .reply{margin-right:6px;color:#717171} mk-sub-post-content > .body > .quote,[data-is="mk-sub-post-content"] > .body > .quote{margin-left:4px;font-style:oblique;color:#a0bf46} mk-sub-post-content mk-poll,[data-is="mk-sub-post-content"] mk-poll{font-size:80%}', '', function(opts) {

		this.post = this.opts.post;

		this.on('mount', () => {
			if (this.post.text) {
				const tokens = this.post.ast;
				this.refs.text.innerHTML = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(tokens, false);

				this.refs.text.children.forEach(e => {
					if (e.tagName == 'MK-URL') riot.mount(e);
				});
			}
		});
});

    
  

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-timeline-post-sub', '<article><a class="avatar-anchor" href="{\'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=96\'}" alt="avatar"></a><div class="main"><header><a class="name" href="{\'/\' + post.user.username}">{post.user.name}</a><span class="username">@{post.user.username}</span><a class="created-at" href="{\'/\' + post.user.username + \'/\' + post.id}"><mk-time time="{post.created_at}"></mk-time></a></header><div class="body"><mk-sub-post-content class="text" post="{post}"></mk-sub-post-content></div></div></article>', 'mk-timeline-post-sub,[data-is="mk-timeline-post-sub"]{display:block;margin:0;padding:0;font-size:.9em;} mk-timeline-post-sub > article,[data-is="mk-timeline-post-sub"] > article{padding:16px;} mk-timeline-post-sub > article:after,[data-is="mk-timeline-post-sub"] > article:after{content:"";display:block;clear:both} mk-timeline-post-sub > article:hover > .main > footer > button,[data-is="mk-timeline-post-sub"] > article:hover > .main > footer > button{color:#888} mk-timeline-post-sub > article > .avatar-anchor,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor{display:block;float:left;margin:0 10px 0 0;}@media (min-width:500px){ mk-timeline-post-sub > article > .avatar-anchor,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor{margin-right:16px}} mk-timeline-post-sub > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor > .avatar{display:block;width:44px;height:44px;margin:0;border-radius:8px;vertical-align:bottom;}@media (min-width:500px){ mk-timeline-post-sub > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor > .avatar{width:52px;height:52px}} mk-timeline-post-sub > article > .main,[data-is="mk-timeline-post-sub"] > article > .main{float:left;width:calc(100% - 54px);}@media (min-width:500px){ mk-timeline-post-sub > article > .main,[data-is="mk-timeline-post-sub"] > article > .main{width:calc(100% - 68px)}} mk-timeline-post-sub > article > .main > header,[data-is="mk-timeline-post-sub"] > article > .main > header{display:flex;margin-bottom:2px;white-space:nowrap;} mk-timeline-post-sub > article > .main > header > .name,[data-is="mk-timeline-post-sub"] > article > .main > header > .name{display:block;margin:0 .5em 0 0;padding:0;overflow:hidden;color:#607073;font-size:1em;font-weight:700;text-align:left;text-decoration:none;text-overflow:ellipsis;} mk-timeline-post-sub > article > .main > header > .name:hover,[data-is="mk-timeline-post-sub"] > article > .main > header > .name:hover{text-decoration:underline} mk-timeline-post-sub > article > .main > header > .username,[data-is="mk-timeline-post-sub"] > article > .main > header > .username{text-align:left;margin:0;color:#d1d8da} mk-timeline-post-sub > article > .main > header > .created-at,[data-is="mk-timeline-post-sub"] > article > .main > header > .created-at{margin-left:auto;color:#b2b8bb} mk-timeline-post-sub > article > .main > .body > .text,[data-is="mk-timeline-post-sub"] > article > .main > .body > .text{cursor:default;margin:0;padding:0;font-size:1.1em;color:#717171;} mk-timeline-post-sub > article > .main > .body > .text pre,[data-is="mk-timeline-post-sub"] > article > .main > .body > .text pre{max-height:120px;font-size:80%}', '', function(opts) {
this.post = this.opts.post
});

    
  

/***/ }),
/* 236 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_open_post_form__ = __webpack_require__(77);

    var riot = __webpack_require__(0)
    


riot.tag2('mk-timeline-post', '<div class="reply-to" if="{p.reply_to}"><mk-timeline-post-sub post="{p.reply_to}"></mk-timeline-post-sub></div><div class="repost" if="{isRepost}"><p><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><i class="fa fa-retweet"></i><a class="name" href="{CONFIG.url + \'/\' + post.user.username}">{post.user.name}</a>がRepost </p><mk-time time="{post.created_at}"></mk-time></div><article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + p.user.username}"><img class="avatar" riot-src="{p.user.avatar_url + \'?thumbnail&size=96\'}" alt="avatar"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + p.user.username}">{p.user.name}</a><span class="is-bot" if="{p.user.is_bot}">bot</span><span class="username">@{p.user.username}</span><a class="created-at" href="{url}"><mk-time time="{p.created_at}"></mk-time></a></header><div class="body"><div class="text" ref="text"><a class="reply" if="{p.reply_to}"><i class="fa fa-reply"></i></a><p class="dummy"></p><a class="quote" if="{p.repost != null}">RP:</a></div><div class="media" if="{p.media}"><mk-images-viewer images="{p.media}"></mk-images-viewer></div><mk-poll if="{p.poll}" post="{p}" ref="pollViewer"></mk-poll><span class="app" if="{p.app}">via <b>{p.app.name}</b></span><div class="repost" if="{p.repost}"><i class="fa fa-quote-right fa-flip-horizontal"></i><mk-post-preview class="repost" post="{p.repost}"></mk-post-preview></div></div><footer><mk-reactions-viewer post="{p}" ref="reactionsViewer"></mk-reactions-viewer><button onclick="{reply}"><i class="fa fa-reply"></i><p class="count" if="{p.replies_count > 0}">{p.replies_count}</p></button><button onclick="{repost}" title="Repost"><i class="fa fa-retweet"></i><p class="count" if="{p.repost_count > 0}">{p.repost_count}</p></button><button class="{reacted: p.my_reaction != null}" onclick="{react}" ref="reactButton"><i class="fa fa-plus"></i><p class="count" if="{p.reactions_count > 0}">{p.reactions_count}</p></button></footer></div></article>', 'mk-timeline-post,[data-is="mk-timeline-post"]{display:block;margin:0;padding:0;font-size:12px;}@media (min-width:350px){ mk-timeline-post,[data-is="mk-timeline-post"]{font-size:14px}}@media (min-width:500px){ mk-timeline-post,[data-is="mk-timeline-post"]{font-size:16px}} mk-timeline-post > .repost,[data-is="mk-timeline-post"] > .repost{color:#9dbb00;background:linear-gradient(to bottom,#edfde2 0%,#fff 100%);} mk-timeline-post > .repost > p,[data-is="mk-timeline-post"] > .repost > p{margin:0;padding:8px 16px;line-height:28px;}@media (min-width:500px){ mk-timeline-post > .repost > p,[data-is="mk-timeline-post"] > .repost > p{padding:16px}} mk-timeline-post > .repost > p .avatar-anchor,[data-is="mk-timeline-post"] > .repost > p .avatar-anchor{display:inline-block;} mk-timeline-post > .repost > p .avatar-anchor .avatar,[data-is="mk-timeline-post"] > .repost > p .avatar-anchor .avatar{vertical-align:bottom;width:28px;height:28px;margin:0 8px 0 0;border-radius:6px} mk-timeline-post > .repost > p i,[data-is="mk-timeline-post"] > .repost > p i{margin-right:4px} mk-timeline-post > .repost > p .name,[data-is="mk-timeline-post"] > .repost > p .name{font-weight:bold} mk-timeline-post > .repost > mk-time,[data-is="mk-timeline-post"] > .repost > mk-time{position:absolute;top:8px;right:16px;font-size:.9em;line-height:28px;}@media (min-width:500px){ mk-timeline-post > .repost > mk-time,[data-is="mk-timeline-post"] > .repost > mk-time{top:16px}} mk-timeline-post > .repost + article,[data-is="mk-timeline-post"] > .repost + article{padding-top:8px} mk-timeline-post > .reply-to,[data-is="mk-timeline-post"] > .reply-to{background:rgba(0,0,0,0.013);} mk-timeline-post > .reply-to > mk-post-preview,[data-is="mk-timeline-post"] > .reply-to > mk-post-preview{background:transparent} mk-timeline-post > article,[data-is="mk-timeline-post"] > article{padding:14px 16px 9px 16px;} mk-timeline-post > article:after,[data-is="mk-timeline-post"] > article:after{content:"";display:block;clear:both} mk-timeline-post > article > .avatar-anchor,[data-is="mk-timeline-post"] > article > .avatar-anchor{display:block;float:left;margin:0 10px 8px 0;position:-webkit-sticky;position:sticky;top:62px;}@media (min-width:500px){ mk-timeline-post > article > .avatar-anchor,[data-is="mk-timeline-post"] > article > .avatar-anchor{margin-right:16px}} mk-timeline-post > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post"] > article > .avatar-anchor > .avatar{display:block;width:48px;height:48px;margin:0;border-radius:6px;vertical-align:bottom;}@media (min-width:500px){ mk-timeline-post > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post"] > article > .avatar-anchor > .avatar{width:58px;height:58px;border-radius:8px}} mk-timeline-post > article > .main,[data-is="mk-timeline-post"] > article > .main{float:left;width:calc(100% - 58px);}@media (min-width:500px){ mk-timeline-post > article > .main,[data-is="mk-timeline-post"] > article > .main{width:calc(100% - 74px)}} mk-timeline-post > article > .main > header,[data-is="mk-timeline-post"] > article > .main > header{display:flex;white-space:nowrap;}@media (min-width:500px){ mk-timeline-post > article > .main > header,[data-is="mk-timeline-post"] > article > .main > header{margin-bottom:2px}} mk-timeline-post > article > .main > header > .name,[data-is="mk-timeline-post"] > article > .main > header > .name{display:block;margin:0 .5em 0 0;padding:0;overflow:hidden;color:#777;font-size:1em;font-weight:700;text-align:left;text-decoration:none;text-overflow:ellipsis;} mk-timeline-post > article > .main > header > .name:hover,[data-is="mk-timeline-post"] > article > .main > header > .name:hover{text-decoration:underline} mk-timeline-post > article > .main > header > .is-bot,[data-is="mk-timeline-post"] > article > .main > header > .is-bot{text-align:left;margin:0 .5em 0 0;padding:1px 6px;font-size:12px;color:#aaa;border:solid 1px #ddd;border-radius:3px} mk-timeline-post > article > .main > header > .username,[data-is="mk-timeline-post"] > article > .main > header > .username{text-align:left;margin:0 .5em 0 0;color:#ccc} mk-timeline-post > article > .main > header > .created-at,[data-is="mk-timeline-post"] > article > .main > header > .created-at{margin-left:auto;font-size:.9em;color:#c0c0c0} mk-timeline-post > article > .main > .body > .text,[data-is="mk-timeline-post"] > article > .main > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.1em;color:#717171;} mk-timeline-post > article > .main > .body > .text > .dummy,[data-is="mk-timeline-post"] > article > .main > .body > .text > .dummy{display:none} mk-timeline-post > article > .main > .body > .text .link:after,[data-is="mk-timeline-post"] > article > .main > .body > .text .link:after{content:"\\f14c";display:inline-block;padding-left:2px;font-family:FontAwesome;font-size:.9em;font-weight:400;font-style:normal} mk-timeline-post > article > .main > .body > .text mk-url-preview,[data-is="mk-timeline-post"] > article > .main > .body > .text mk-url-preview{margin-top:8px} mk-timeline-post > article > .main > .body > .text > .reply,[data-is="mk-timeline-post"] > article > .main > .body > .text > .reply{margin-right:8px;color:#717171} mk-timeline-post > article > .main > .body > .text > .quote,[data-is="mk-timeline-post"] > article > .main > .body > .text > .quote{margin-left:4px;font-style:oblique;color:#a0bf46} mk-timeline-post > article > .main > .body > .text code,[data-is="mk-timeline-post"] > article > .main > .body > .text code{padding:4px 8px;margin:0 .5em;font-size:80%;color:#525252;background:#f8f8f8;border-radius:2px} mk-timeline-post > article > .main > .body > .text pre > code,[data-is="mk-timeline-post"] > article > .main > .body > .text pre > code{padding:16px;margin:0} mk-timeline-post > article > .main > .body > .text [data-is-me]:after,[data-is="mk-timeline-post"] > article > .main > .body > .text [data-is-me]:after{content:"you";padding:0 4px;margin-left:4px;font-size:80%;color:#fff;background:#87bb35;border-radius:4px} mk-timeline-post > article > .main > .body > .media > img,[data-is="mk-timeline-post"] > article > .main > .body > .media > img{display:block;max-width:100%} mk-timeline-post > article > .main > .body > .app,[data-is="mk-timeline-post"] > article > .main > .body > .app{font-size:12px;color:#ccc} mk-timeline-post > article > .main > .body > mk-poll,[data-is="mk-timeline-post"] > article > .main > .body > mk-poll{font-size:80%} mk-timeline-post > article > .main > .body > .repost,[data-is="mk-timeline-post"] > article > .main > .body > .repost{margin:8px 0;} mk-timeline-post > article > .main > .body > .repost > i:first-child,[data-is="mk-timeline-post"] > article > .main > .body > .repost > i:first-child{position:absolute;top:-8px;left:-8px;z-index:1;color:#c0dac6;font-size:28px;background:#fff} mk-timeline-post > article > .main > .body > .repost > mk-post-preview,[data-is="mk-timeline-post"] > article > .main > .body > .repost > mk-post-preview{padding:16px;border:dashed 1px #c0dac6;border-radius:8px} mk-timeline-post > article > .main > footer > button,[data-is="mk-timeline-post"] > article > .main > footer > button{margin:0 28px 0 0;padding:8px;background:transparent;border:none;box-shadow:none;font-size:1em;color:#ddd;cursor:pointer;} mk-timeline-post > article > .main > footer > button:hover,[data-is="mk-timeline-post"] > article > .main > footer > button:hover{color:#666} mk-timeline-post > article > .main > footer > button > .count,[data-is="mk-timeline-post"] > article > .main > footer > button > .count{display:inline;margin:0 0 0 8px;color:#999} mk-timeline-post > article > .main > footer > button.reacted,[data-is="mk-timeline-post"] > article > .main > footer > button.reacted{color:#87bb35}', 'class="{repost: isRepost}"', function(opts) {

		this.mixin('api');
		this.mixin('stream');

		this.set = post => {
			this.post = post;
			this.isRepost = this.post.repost != null && this.post.text == null;
			this.p = this.isRepost ? this.post.repost : this.post;
			this.p.reactions_count = this.p.reaction_counts ? Object.keys(this.p.reaction_counts).map(key => this.p.reaction_counts[key]).reduce((a, b) => a + b) : 0;
			this.summary = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__["a" /* default */])(this.p);
			this.url = `/${this.p.user.username}/${this.p.id}`;
		};

		this.set(this.opts.post);

		this.refresh = post => {
			this.set(post);
			this.update();
			if (this.refs.reactionsViewer) this.refs.reactionsViewer.update({
				post
			});
			if (this.refs.pollViewer) this.refs.pollViewer.init(post);
		};

		this.onStreamPostUpdated = data => {
			const post = data.post;
			if (post.id == this.post.id) {
				this.refresh(post);
			}
		};

		this.onStreamConnected = () => {
			this.capture();
		};

		this.capture = withHandler => {
			this.stream.send({
				type: 'capture',
				id: this.post.id
			});
			if (withHandler) this.stream.on('post-updated', this.onStreamPostUpdated);
		};

		this.decapture = withHandler => {
			this.stream.send({
				type: 'decapture',
				id: this.post.id
			});
			if (withHandler) this.stream.off('post-updated', this.onStreamPostUpdated);
		};

		this.on('mount', () => {
			this.capture(true);
			this.stream.on('_connected_', this.onStreamConnected);

			if (this.p.text) {
				const tokens = this.p.ast;

				this.refs.text.innerHTML = this.refs.text.innerHTML.replace('<p class="dummy"></p>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(tokens));

				this.refs.text.children.forEach(e => {
					if (e.tagName == 'MK-URL') riot.mount(e);
				});

				tokens
				.filter(t => (t.type == 'url' || t.type == 'link') && !t.silent)
				.map(t => {
					riot.mount(this.refs.text.appendChild(document.createElement('mk-url-preview')), {
						url: t.url
					});
				});
			}
		});

		this.on('unmount', () => {
			this.decapture(true);
			this.stream.off('_connected_', this.onStreamConnected);
		});

		this.reply = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_open_post_form__["a" /* default */])({
				reply: this.p
			});
		};

		this.repost = () => {
			const text = window.prompt(`「${this.summary}」をRepost`);
			if (text == null) return;
			this.api('posts/create', {
				repost_id: this.p.id,
				text: text == '' ? undefined : text
			});
		};

		this.react = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-reaction-picker')), {
				source: this.refs.reactButton,
				post: this.p,
				compact: true
			});
		};
});

    
  

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-timeline', '<div class="init" if="{init}"><i class="fa fa-spinner fa-pulse"></i>読み込んでいます </div><div class="empty" if="{!init && posts.length == 0}"><i class="fa fa-comments-o"></i>{opts.empty || \'表示するものがありません\'} </div><virtual each="{post, i in posts}"><mk-timeline-post post="{post}"></mk-timeline-post><p class="date" if="{i != posts.length - 1 && post._date != posts[i + 1]._date}"><span><i class="fa fa-angle-up"></i>{post._datetext}</span><span><i class="fa fa-angle-down"></i>{posts[i + 1]._datetext}</span></p></virtual><footer if="{!init}"><button if="{canFetchMore}" onclick="{more}" disabled="{fetching}"><span if="{!fetching}">もっとみる</span><span if="{fetching}">読み込み中<mk-ellipsis></mk-ellipsis></span></button></footer>', 'mk-timeline,[data-is="mk-timeline"]{display:block;background:#fff;} mk-timeline > .init,[data-is="mk-timeline"] > .init{padding:64px 0;text-align:center;color:#999;} mk-timeline > .init > i,[data-is="mk-timeline"] > .init > i{margin-right:4px} mk-timeline > .empty,[data-is="mk-timeline"] > .empty{margin:0 auto;padding:32px;max-width:400px;text-align:center;color:#999;} mk-timeline > .empty > i,[data-is="mk-timeline"] > .empty > i{display:block;margin-bottom:16px;font-size:3em;color:#ccc} mk-timeline > mk-timeline-post,[data-is="mk-timeline"] > mk-timeline-post{border-bottom:solid 1px #eaeaea;} mk-timeline > mk-timeline-post:last-of-type,[data-is="mk-timeline"] > mk-timeline-post:last-of-type{border-bottom:none} mk-timeline > .date,[data-is="mk-timeline"] > .date{display:block;margin:0;line-height:32px;text-align:center;font-size:.9em;color:#aaa;background:#fdfdfd;border-bottom:solid 1px #eaeaea;} mk-timeline > .date span,[data-is="mk-timeline"] > .date span{margin:0 16px} mk-timeline > .date i,[data-is="mk-timeline"] > .date i{margin-right:8px} mk-timeline > footer,[data-is="mk-timeline"] > footer{text-align:center;border-top:solid 1px #eaeaea;border-bottom-left-radius:4px;border-bottom-right-radius:4px;} mk-timeline > footer > button,[data-is="mk-timeline"] > footer > button{margin:0;padding:16px;width:100%;color:#87bb35;} mk-timeline > footer > button:disabled,[data-is="mk-timeline"] > footer > button:disabled{opacity:.7}', '', function(opts) {
		this.posts = [];
		this.init = true;
		this.fetching = false;
		this.canFetchMore = true;

		this.on('mount', () => {
			this.opts.init.then(posts => {
				this.init = false;
				this.setPosts(posts);
			});
		});

		this.on('update', () => {
			this.posts.forEach(post => {
				const date = new Date(post.created_at).getDate();
				const month = new Date(post.created_at).getMonth() + 1;
				post._date = date;
				post._datetext = `${month}月 ${date}日`;
			});
		});

		this.more = () => {
			if (this.init || this.fetching || this.posts.length == 0) return;
			this.update({
				fetching: true
			});
			this.opts.more().then(posts => {
				this.fetching = false;
				this.prependPosts(posts);
			});
		};

		this.setPosts = posts => {
			this.update({
				posts: posts
			});
		};

		this.prependPosts = posts => {
			posts.forEach(post => {
				this.posts.push(post);
				this.update();
			});
		}

		this.addPost = post => {
			this.posts.unshift(post);
			this.update();
		};

		this.tail = () => {
			return this.posts[this.posts.length - 1];
		};
});

    
  

/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__ = __webpack_require__(4);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-ui-header', '<mk-special-message></mk-special-message><div class="main"><div class="backdrop"></div><div class="content"><button class="nav" onclick="{parent.toggleDrawer}"><i class="fa fa-bars"></i></button><h1 ref="title">Misskey</h1><button if="{func}" onclick="{func}"><i class="fa fa-{funcIcon}"></i></button></div></div>', 'mk-ui-header,[data-is="mk-ui-header"]{display:block;position:fixed;top:0;z-index:1024;width:100%;box-shadow:0 1px 0 rgba(0,0,0,0.075);} mk-ui-header > .main,[data-is="mk-ui-header"] > .main{color:rgba(255,255,255,0.9);} mk-ui-header > .main > .backdrop,[data-is="mk-ui-header"] > .main > .backdrop{position:absolute;top:0;z-index:1023;width:100%;height:48px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background-color:rgba(27,32,35,0.75)} mk-ui-header > .main > .content,[data-is="mk-ui-header"] > .main > .content{z-index:1024;} mk-ui-header > .main > .content > h1,[data-is="mk-ui-header"] > .main > .content > h1{display:block;margin:0 auto;padding:0;width:100%;max-width:calc(100% - 112px);text-align:center;font-size:1.1em;font-weight:normal;line-height:48px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} mk-ui-header > .main > .content > h1 > i,[data-is="mk-ui-header"] > .main > .content > h1 > i,mk-ui-header > .main > .content > h1 > .icon,[data-is="mk-ui-header"] > .main > .content > h1 > .icon{margin-right:8px} mk-ui-header > .main > .content > h1 > img,[data-is="mk-ui-header"] > .main > .content > h1 > img{display:inline-block;vertical-align:bottom;width:32px;height:32px;margin:8px;border-radius:6px} mk-ui-header > .main > .content > .nav,[data-is="mk-ui-header"] > .main > .content > .nav{display:block;position:absolute;top:0;left:0;width:48px;font-size:1.4em;line-height:48px;border-right:solid 1px rgba(0,0,0,0.1);} mk-ui-header > .main > .content > .nav > i,[data-is="mk-ui-header"] > .main > .content > .nav > i{transition:all .2s ease} mk-ui-header > .main > .content > button:last-child,[data-is="mk-ui-header"] > .main > .content > button:last-child{display:block;position:absolute;top:0;right:0;width:48px;text-align:center;font-size:1.4em;color:inherit;line-height:48px;border-left:solid 1px rgba(0,0,0,0.1)}', '', function(opts) {

		this.func = null;
		this.funcIcon = null;

		this.on('unmount', () => {
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].off('title', this.setTitle);
			__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].off('func', this.setFunc);
		});

		this.setTitle = title => {
			this.refs.title.innerHTML = title;
		};

		this.setFunc = (fn, icon) => {
			this.update({
				func: fn,
				funcIcon: icon
			});
		};

		__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].on('title', this.setTitle);
		__WEBPACK_IMPORTED_MODULE_0__scripts_ui_event__["default"].on('func', this.setFunc);
});

    
  

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-nav', '<div class="backdrop" onclick="{parent.toggleDrawer}"></div><div class="body"><a class="me" if="{SIGNIN}" href="{CONFIG.url + \'/\' + I.username}"><img class="avatar" riot-src="{I.avatar_url + \'?thumbnail&size=128\'}" alt="avatar"><p class="name">{I.name}</p></a><div class="links"><ul><li class="home"><a href="/"><i class="icon fa fa-home"></i>ホーム<i class="angle fa fa-angle-right"></i></a></li><li class="notifications"><a href="/i/notifications"><i class="icon fa fa-bell-o"></i>通知<i class="angle fa fa-angle-right"></i></a></li><li class="messaging"><a href="/i/messaging"><i class="icon fa fa-comments-o"></i>メッセージ<i class="angle fa fa-angle-right"></i></a></li><li class="live"><a href="//misskey.tk" target="_blank"><i class="icon fa fa-television"></i>ライブ<i class="angle fa fa-angle-right"></i></a></li></ul><ul><li class="settings"><a onclick="{search}"><i class="icon fa fa-search"></i>検索<i class="angle fa fa-angle-right"></i></a></li></ul><ul><li class="settings"><a href="/i/drive"><i class="icon fa fa-cloud"></i>ドライブ<i class="angle fa fa-angle-right"></i></a></li></ul><ul><li class="settings"><a href="/i/settings"><i class="icon fa fa-cog"></i>設定<i class="angle fa fa-angle-right"></i></a></li></ul></div><p class="about" href="{CONFIG.aboutUrl}"><a>Misskeyについて</a></p></div>', 'mk-ui-nav,[data-is="mk-ui-nav"]{display:none;} mk-ui-nav .backdrop,[data-is="mk-ui-nav"] .backdrop{position:fixed;top:0;left:0;z-index:1025;width:100%;height:100%;background:rgba(0,0,0,0.2)} mk-ui-nav .body,[data-is="mk-ui-nav"] .body{position:fixed;top:0;left:0;z-index:1026;width:240px;height:100%;overflow:auto;color:#777;background:#fff} mk-ui-nav .me,[data-is="mk-ui-nav"] .me{display:block;margin:0;padding:16px;} mk-ui-nav .me .avatar,[data-is="mk-ui-nav"] .me .avatar{display:inline;max-width:64px;border-radius:32px;vertical-align:middle} mk-ui-nav .me .name,[data-is="mk-ui-nav"] .me .name{display:block;margin:0 16px;position:absolute;top:0;left:80px;padding:0;width:calc(100% - 112px);color:#777;line-height:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} mk-ui-nav ul,[data-is="mk-ui-nav"] ul{display:block;margin:16px 0;padding:0;list-style:none;} mk-ui-nav ul:first-child,[data-is="mk-ui-nav"] ul:first-child{margin-top:0} mk-ui-nav ul li,[data-is="mk-ui-nav"] ul li{display:block;font-size:1em;line-height:1em;} mk-ui-nav ul li a,[data-is="mk-ui-nav"] ul li a{display:block;padding:0 20px;line-height:3rem;line-height:calc(1rem + 30px);color:#777;text-decoration:none;} mk-ui-nav ul li a > .icon,[data-is="mk-ui-nav"] ul li a > .icon{margin-right:.5em} mk-ui-nav ul li a > .angle,[data-is="mk-ui-nav"] ul li a > .angle{position:absolute;top:0;right:0;padding:0 20px;font-size:1.2em;line-height:calc(1rem + 30px);color:#ccc} mk-ui-nav .about,[data-is="mk-ui-nav"] .about{margin:1em 1em 2em 1em;text-align:center;font-size:.6em;opacity:.3;} mk-ui-nav .about a,[data-is="mk-ui-nav"] .about a{color:#777}', '', function(opts) {
		this.mixin('i');
		this.mixin('page');

		this.search = () => {
			const query = window.prompt('検索');
			if (query == null || query == '') return;
			this.page('/search:' + query);
		};
});

    
  

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui', '<mk-ui-header></mk-ui-header><mk-ui-nav ref="nav"></mk-ui-nav><div class="content"><yield></yield></div><mk-stream-indicator></mk-stream-indicator>', 'mk-ui,[data-is="mk-ui"]{display:block;padding-top:48px}', '', function(opts) {
		this.mixin('i');
		this.mixin('stream');

		this.isDrawerOpening = false;

		this.on('mount', () => {
			this.stream.on('notification', this.onStreamNotification);
		});

		this.on('unmount', () => {
			this.stream.off('notification', this.onStreamNotification);
		});

		this.toggleDrawer = () => {
			this.isDrawerOpening = !this.isDrawerOpening;
			this.refs.nav.root.style.display = this.isDrawerOpening ? 'block' : 'none';
		};

		this.onStreamNotification = notification => {
			riot.mount(document.body.appendChild(document.createElement('mk-notify')), {
				notification: notification
			});
		};
});

    
  

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-followers', '<mk-users-list ref="list" fetch="{fetch}" count="{user.followers_count}" you-know-count="{user.followers_you_know_count}" no-users="{\'フォロワーはいないようです。\'}"></mk-users-list>', 'mk-user-followers,[data-is="mk-user-followers"]{display:block}', '', function(opts) {
		this.mixin('api');

		this.user = this.opts.user;

		this.fetch = (iknow, limit, cursor, cb) => {
			this.api('users/followers', {
				user_id: this.user.id,
				iknow: iknow,
				limit: limit,
				cursor: cursor ? cursor : undefined
			}).then(cb);
		};

		this.on('mount', () => {
			this.refs.list.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-following', '<mk-users-list ref="list" fetch="{fetch}" count="{user.following_count}" you-know-count="{user.following_you_know_count}" no-users="{\'フォロー中のユーザーはいないようです。\'}"></mk-users-list>', 'mk-user-following,[data-is="mk-user-following"]{display:block}', '', function(opts) {
		this.mixin('api');

		this.user = this.opts.user;

		this.fetch = (iknow, limit, cursor, cb) => {
			this.api('users/following', {
				user_id: this.user.id,
				iknow: iknow,
				limit: limit,
				cursor: cursor ? cursor : undefined
			}).then(cb);
		};

		this.on('mount', () => {
			this.refs.list.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-preview', '<a class="avatar-anchor" href="{CONFIG.url + \'/\' + user.username}"><img class="avatar" riot-src="{user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + user.username}">{user.name}</a><span class="username">@{user.username}</span></header><div class="body"><div class="description">{user.description}</div></div></div>', 'mk-user-preview,[data-is="mk-user-preview"]{display:block;margin:0;padding:16px;font-size:12px;}@media (min-width:350px){ mk-user-preview,[data-is="mk-user-preview"]{font-size:14px}}@media (min-width:500px){ mk-user-preview,[data-is="mk-user-preview"]{font-size:16px}} mk-user-preview:after,[data-is="mk-user-preview"]:after{content:"";display:block;clear:both} mk-user-preview > .avatar-anchor,[data-is="mk-user-preview"] > .avatar-anchor{display:block;float:left;margin:0 10px 0 0;}@media (min-width:500px){ mk-user-preview > .avatar-anchor,[data-is="mk-user-preview"] > .avatar-anchor{margin-right:16px}} mk-user-preview > .avatar-anchor > .avatar,[data-is="mk-user-preview"] > .avatar-anchor > .avatar{display:block;width:48px;height:48px;margin:0;border-radius:6px;vertical-align:bottom;}@media (min-width:500px){ mk-user-preview > .avatar-anchor > .avatar,[data-is="mk-user-preview"] > .avatar-anchor > .avatar{width:58px;height:58px;border-radius:8px}} mk-user-preview > .main,[data-is="mk-user-preview"] > .main{float:left;width:calc(100% - 58px);}@media (min-width:500px){ mk-user-preview > .main,[data-is="mk-user-preview"] > .main{width:calc(100% - 74px)}}@media (min-width:500px){ mk-user-preview > .main > header,[data-is="mk-user-preview"] > .main > header{margin-bottom:2px}} mk-user-preview > .main > header > .name,[data-is="mk-user-preview"] > .main > header > .name{display:inline;margin:0;padding:0;color:#777;font-size:1em;font-weight:700;text-align:left;text-decoration:none;} mk-user-preview > .main > header > .name:hover,[data-is="mk-user-preview"] > .main > header > .name:hover{text-decoration:underline} mk-user-preview > .main > header > .username,[data-is="mk-user-preview"] > .main > header > .username{text-align:left;margin:0 0 0 8px;color:#ccc} mk-user-preview > .main > .body > .description,[data-is="mk-user-preview"] > .main > .body > .description{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.1em;color:#717171}', '', function(opts) {
this.user = this.opts.user
});

    
  

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-timeline', '<mk-timeline ref="timeline" init="{init}" more="{more}" empty="{withMedia ? \'メディア付き投稿はありません。\' : \'このユーザーはまだ投稿していないようです。\'}"></mk-timeline>', 'mk-user-timeline,[data-is="mk-user-timeline"]{display:block;max-width:600px;margin:0 auto;background:#fff}', '', function(opts) {
		this.mixin('api');

		this.user = this.opts.user;
		this.withMedia = this.opts.withMedia;

		this.init = new Promise((res, rej) => {
			this.api('users/posts', {
				user_id: this.user.id,
				with_media: this.withMedia
			}).then(posts => {
				res(posts);
				this.trigger('loaded');
			});
		});

		this.more = () => {
			return this.api('users/posts', {
				user_id: this.user.id,
				with_media: this.withMedia,
				max_id: this.refs.timeline.tail().id
			});
		};
});

    
  

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user', '<div class="user" if="{!fetching}"><header><div class="banner" riot-style="{user.banner_url ? \'background-image: url(\' + user.banner_url + \'?thumbnail&size=1024)\' : \'\'}"></div><div class="body"><div class="top"><a class="avatar"><img riot-src="{user.avatar_url + \'?thumbnail&size=160\'}" alt="avatar"></a><mk-follow-button if="{SIGNIN && I.id != user.id}" user="{user}"></mk-follow-button></div><div class="title"><h1>{user.name}</h1><span class="username">@{user.username}</span><span class="followed" if="{user.is_followed}">フォローされています</span></div><div class="description">{user.description}</div><div class="info"><p class="location" if="{user.profile.location}"><i class="fa fa-map-marker"></i>{user.profile.location} </p><p class="birthday" if="{user.profile.birthday}"><i class="fa fa-birthday-cake"></i>{user.profile.birthday.replace(\'-\', \'年\').replace(\'-\', \'月\') + \'日\'} ({age(user.profile.birthday)}歳) </p></div><div class="friends"><a href="{user.username}/following"><b>{user.following_count}</b><i>フォロー</i></a><a href="{user.username}/followers"><b>{user.followers_count}</b><i>フォロワー</i></a></div><mk-activity-table user="{user}"></mk-activity-table></div><nav><a data-is-active="{page == \'posts\'}" onclick="{go.bind(null, \'posts\')}">タイムライン</a><a data-is-active="{page == \'media\'}" onclick="{go.bind(null, \'media\')}">メディア</a></nav></header><div class="body"><mk-user-timeline if="{page == \'posts\'}" user="{user}"></mk-user-timeline><mk-user-timeline if="{page == \'media\'}" user="{user}" with-media="{true}"></mk-user-timeline></div></div>', 'mk-user,[data-is="mk-user"]{display:block;} mk-user > .user > header > .banner,[data-is="mk-user"] > .user > header > .banner{padding-bottom:33.3%;background-color:#f5f5f5;background-size:cover;background-position:center} mk-user > .user > header > .body,[data-is="mk-user"] > .user > header > .body{padding:12px;margin:0 auto;max-width:600px;} mk-user > .user > header > .body > .top:after,[data-is="mk-user"] > .user > header > .body > .top:after{content:\'\';display:block;clear:both} mk-user > .user > header > .body > .top > .avatar,[data-is="mk-user"] > .user > header > .body > .top > .avatar{display:block;float:left;width:25%;height:40px;} mk-user > .user > header > .body > .top > .avatar > img,[data-is="mk-user"] > .user > header > .body > .top > .avatar > img{display:block;position:absolute;left:-2px;bottom:-2px;width:100%;border:2px solid #fff;border-radius:6px;}@media (min-width:500px){ mk-user > .user > header > .body > .top > .avatar > img,[data-is="mk-user"] > .user > header > .body > .top > .avatar > img{left:-4px;bottom:-4px;border:4px solid #fff;border-radius:12px}} mk-user > .user > header > .body > .top > mk-follow-button,[data-is="mk-user"] > .user > header > .body > .top > mk-follow-button{float:right;height:40px} mk-user > .user > header > .body > .title,[data-is="mk-user"] > .user > header > .body > .title{margin:8px 0;} mk-user > .user > header > .body > .title > h1,[data-is="mk-user"] > .user > header > .body > .title > h1{margin:0;line-height:22px;font-size:20px;color:#222} mk-user > .user > header > .body > .title > .username,[data-is="mk-user"] > .user > header > .body > .title > .username{display:inline-block;line-height:20px;font-size:16px;font-weight:bold;color:#657786} mk-user > .user > header > .body > .title > .followed,[data-is="mk-user"] > .user > header > .body > .title > .followed{margin-left:8px;padding:2px 4px;font-size:12px;color:#657786;background:#f8f8f8;border-radius:4px} mk-user > .user > header > .body > .description,[data-is="mk-user"] > .user > header > .body > .description{margin:8px 0;color:#333} mk-user > .user > header > .body > .info,[data-is="mk-user"] > .user > header > .body > .info{margin:8px 0;} mk-user > .user > header > .body > .info > p,[data-is="mk-user"] > .user > header > .body > .info > p{display:inline;margin:0 16px 0 0;color:#555;} mk-user > .user > header > .body > .info > p > i,[data-is="mk-user"] > .user > header > .body > .info > p > i{margin-right:4px} mk-user > .user > header > .body > .friends > a,[data-is="mk-user"] > .user > header > .body > .friends > a{color:#657786;} mk-user > .user > header > .body > .friends > a:first-child,[data-is="mk-user"] > .user > header > .body > .friends > a:first-child{margin-right:16px} mk-user > .user > header > .body > .friends > a > b,[data-is="mk-user"] > .user > header > .body > .friends > a > b{margin-right:4px;font-size:16px;color:#14171a} mk-user > .user > header > .body > .friends > a > i,[data-is="mk-user"] > .user > header > .body > .friends > a > i{font-size:14px} mk-user > .user > header > .body > mk-activity-table,[data-is="mk-user"] > .user > header > .body > mk-activity-table{margin:12px 0 0 0} mk-user > .user > header > nav,[data-is="mk-user"] > .user > header > nav{display:flex;justify-content:center;margin:0 auto;max-width:600px;border-bottom:solid 1px #ddd;} mk-user > .user > header > nav > a,[data-is="mk-user"] > .user > header > nav > a{display:block;flex:1 1;text-align:center;line-height:52px;font-size:14px;text-decoration:none;color:#657786;border-bottom:solid 2px transparent;} mk-user > .user > header > nav > a[data-is-active],[data-is="mk-user"] > .user > header > nav > a[data-is-active]{font-weight:bold;color:#87bb35;border-color:#87bb35}@media (min-width:500px){ mk-user > .user > .body,[data-is="mk-user"] > .user > .body{padding:16px 0 0 0}}', '', function(opts) {
		this.age = __webpack_require__(73);

		this.mixin('i');
		this.mixin('api');

		this.username = this.opts.user;
		this.page = this.opts.page ? this.opts.page : 'posts';
		this.fetching = true;

		this.on('mount', () => {
			this.api('users/show', {
				username: this.username
			}).then(user => {
				this.fetching = false;
				this.user = user;
				this.trigger('loaded', user);
				this.update();
			});
		});

		this.go = page => {
			this.update({
				page: page
			});
		};
});

    
  

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-users-list', '<nav><span data-is-active="{mode == \'all\'}" onclick="{setMode.bind(this, \'all\')}">すべて<span>{opts.count}</span></span><span if="{SIGNIN && opts.youKnowCount != \'\'}" data-is-active="{mode == \'iknow\'}" onclick="{setMode.bind(this, \'iknow\')}">知り合い<span>{opts.youKnowCount}</span></span></nav><div class="users" if="{!fetching && users.length != 0}"><mk-user-preview each="{users}" user="{this}"></mk-user-preview></div><button class="more" if="{!fetching && next != null}" onclick="{more}" disabled="{moreFetching}"><span if="{!moreFetching}">もっと</span><span if="{moreFetching}">読み込み中<mk-ellipsis></mk-ellipsis></span></button><p class="no" if="{!fetching && users.length == 0}">{opts.noUsers}</p><p class="fetching" if="{fetching}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます<mk-ellipsis></mk-ellipsis></p>', 'mk-users-list,[data-is="mk-users-list"]{display:block;background:#fff;} mk-users-list > nav,[data-is="mk-users-list"] > nav{display:flex;justify-content:center;margin:0 auto;max-width:600px;border-bottom:solid 1px #ddd;} mk-users-list > nav > span,[data-is="mk-users-list"] > nav > span{display:block;flex:1 1;text-align:center;line-height:52px;font-size:14px;color:#657786;border-bottom:solid 2px transparent;} mk-users-list > nav > span[data-is-active],[data-is="mk-users-list"] > nav > span[data-is-active]{font-weight:bold;color:#87bb35;border-color:#87bb35} mk-users-list > nav > span > span,[data-is="mk-users-list"] > nav > span > span{display:inline-block;margin-left:4px;padding:2px 5px;font-size:12px;line-height:1;color:#888;background:#eee;border-radius:20px} mk-users-list > .users > *,[data-is="mk-users-list"] > .users > *{max-width:600px;margin:0 auto;border-bottom:solid 1px rgba(0,0,0,0.05)} mk-users-list > .no,[data-is="mk-users-list"] > .no{margin:0;padding:16px;text-align:center;color:#aaa} mk-users-list > .fetching,[data-is="mk-users-list"] > .fetching{margin:0;padding:16px;text-align:center;color:#aaa;} mk-users-list > .fetching > i,[data-is="mk-users-list"] > .fetching > i{margin-right:4px}', '', function(opts) {
		this.mixin('i');

		this.limit = 30;
		this.mode = 'all';

		this.fetching = true;
		this.moreFetching = false;

		this.on('mount', () => {
			this.fetch(() => this.trigger('loaded'));
		});

		this.fetch = cb => {
			this.update({
				fetching: true
			});
			this.opts.fetch(this.mode == 'iknow', this.limit, null, obj => {
				this.update({
					fetching: false,
					users: obj.users,
					next: obj.next
				});
				if (cb) cb();
			});
		};

		this.more = () => {
			this.update({
				moreFetching: true
			});
			this.opts.fetch(this.mode == 'iknow', this.limit, this.next, obj => {
				this.update({
					moreFetching: false,
					users: this.users.concat(obj.users),
					next: obj.next
				});
			});
		};

		this.setMode = mode => {
			this.update({
				mode: mode
			});
			this.fetch();
		};
});

    
  

/***/ }),
/* 247 */,
/* 248 */,
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const gcd = (a, b) => !b ? a : gcd(b, a % b);
/* harmony default export */ __webpack_exports__["a"] = (gcd);


/***/ }),
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_styl__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boot__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__(85);
/**
 * Mobile Client
 */

// Style


__webpack_require__(86);



/**
 * Boot
 */
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__boot__["a" /* default */])(me => {
	// http://qiita.com/junya/items/3ff380878f26ca447f85
	document.body.setAttribute('ontouchstart', '');

	// Start routing
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */])(me);
});


/***/ })
/******/ ]);