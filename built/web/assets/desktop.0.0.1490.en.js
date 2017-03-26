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
/******/ 	return __webpack_require__(__webpack_require__.s = 251);
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
/* 4 */,
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
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


/* harmony default export */ __webpack_exports__["default"] = ((title, text, buttons, canThrough, onThrough) => {
	const dialog = document.body.appendChild(document.createElement('mk-dialog'));
	const controller = __WEBPACK_IMPORTED_MODULE_0_riot__["observable"]();
	__WEBPACK_IMPORTED_MODULE_0_riot__["mount"](dialog, {
		controller: controller,
		title: title,
		text: text,
		buttons: buttons,
		canThrough: canThrough,
		onThrough: onThrough
	});
	controller.trigger('open');
	return controller;
});


/***/ }),
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
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((parent, child) => {
	let node = child.parentNode;
	while (node) {
		if (node == parent) return true;
		node = node.parentNode;
	}
	return false;
});


/***/ }),
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
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (date => {
	if (typeof date == 'string') date = new Date(date);
	return (
		date.getFullYear()    + '年' +
		(date.getMonth() + 1) + '月' +
		date.getDate()        + '日' +
		' ' +
		date.getHours()       + '時' +
		date.getMinutes()     + '分' +
		' ' +
		`(${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`
	);
});


/***/ }),
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
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


/* harmony default export */ __webpack_exports__["a"] = ((title, placeholder, defaultValue, onOk, onCancel) => {
	const dialog = document.body.appendChild(document.createElement('mk-input-dialog'));
	return __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](dialog, {
		title: title,
		placeholder: placeholder,
		'default': defaultValue,
		onOk: onOk,
		onCancel: onCancel
	});
});


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_config__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialog__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_scripts_api__ = __webpack_require__(5);





/* harmony default export */ __webpack_exports__["a"] = ((I, cb, file = null) => {
	const fileSelected = file => {
		const cropper = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-crop-window')), {
			file: file,
			title: 'アバターとして表示する部分を選択',
			aspectRatio: 1 / 1
		})[0];

		cropper.on('cropped', blob => {
			const data = new FormData();
			data.append('i', I.token);
			data.append('file', blob, file.name + '.cropped.png');

			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'drive/folders/find', {
				name: 'アイコン'
			}).then(iconFolder => {
				if (iconFolder.length === 0) {
					__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'drive/folders/create', {
						name: 'アイコン'
					}).then(iconFolder => {
						upload(data, iconFolder);
					});
				} else {
					upload(data, iconFolder[0]);
				}
			});
		});

		cropper.on('skipped', () => {
			set(file);
		});
	};

	const upload = (data, folder) => {
		const progress = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-progress-dialog')), {
			title: '新しいアバターをアップロードしています'
		})[0];

		if (folder) data.append('folder_id', folder.id);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', __WEBPACK_IMPORTED_MODULE_1__common_scripts_config__["a" /* default */].apiUrl + '/drive/files/create', true);
		xhr.onload = e => {
			const file = JSON.parse(e.target.response);
			progress.close();
			set(file);
		};

		xhr.upload.onprogress = e => {
			if (e.lengthComputable) progress.updateProgress(e.loaded, e.total);
		};

		xhr.send(data);
	};

	const set = file => {
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'i/update', {
			avatar_id: file.id
		}).then(i => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dialog__["default"])('<i class="fa fa-info-circle"></i>アバターを更新しました',
				'新しいアバターが反映されるまで時間がかかる場合があります。',
			[{
				text: 'わかった'
			}]);

			if (cb) cb(i);
		});
	};

	if (file) {
		fileSelected(file);
	} else {
		const browser = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-select-file-from-drive-window')), {
			multiple: false,
			title: '<i class="fa fa-picture-o"></i>アバターにする画像を選択'
		})[0];

		browser.one('selected', file => {
			fileSelected(file);
		});
	}
});


/***/ }),
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
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


/* harmony default export */ __webpack_exports__["a"] = (message => {
	const notification = document.body.appendChild(document.createElement('mk-ui-notification'));
	__WEBPACK_IMPORTED_MODULE_0_riot__["mount"](notification, {
		message: message
	});
});


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_config__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialog__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_scripts_api__ = __webpack_require__(5);





/* harmony default export */ __webpack_exports__["a"] = ((I, cb, file = null) => {
	const fileSelected = file => {
		const cropper = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-crop-window')), {
			file: file,
			title: 'バナーとして表示する部分を選択',
			aspectRatio: 16 / 9
		})[0];

		cropper.on('cropped', blob => {
			const data = new FormData();
			data.append('i', I.token);
			data.append('file', blob, file.name + '.cropped.png');

			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'drive/folders/find', {
				name: 'バナー'
			}).then(iconFolder => {
				if (iconFolder.length === 0) {
					__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'drive/folders/create', {
						name: 'バナー'
					}).then(iconFolder => {
						upload(data, iconFolder);
					});
				} else {
					upload(data, iconFolder[0]);
				}
			});
		});

		cropper.on('skipped', () => {
			set(file);
		});
	};

	const upload = (data, folder) => {
		const progress = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-progress-dialog')), {
			title: '新しいバナーをアップロードしています'
		})[0];

		if (folder) data.append('folder_id', folder.id);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', __WEBPACK_IMPORTED_MODULE_1__common_scripts_config__["a" /* default */].apiUrl + '/drive/files/create', true);
		xhr.onload = e => {
			const file = JSON.parse(e.target.response);
			progress.close();
			set(file);
		};

		xhr.upload.onprogress = e => {
			if (e.lengthComputable) progress.updateProgress(e.loaded, e.total);
		};

		xhr.send(data);
	};

	const set = file => {
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_scripts_api__["a" /* default */])(I, 'i/update', {
			banner_id: file.id
		}).then(i => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dialog__["default"])('<i class="fa fa-info-circle"></i>バナーを更新しました',
				'新しいバナーが反映されるまで時間がかかる場合があります。',
			[{
				text: 'わかりました。'
			}]);

			if (cb) cb(i);
		});
	};

	if (file) {
		fileSelected(file);
	} else {
		const browser = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(document.createElement('mk-select-file-from-drive-window')), {
			multiple: false,
			title: '<i class="fa fa-picture-o"></i>バナーにする画像を選択'
		})[0];

		browser.one('selected', file => {
			fileSelected(file);
		});
	}
});


/***/ }),
/* 77 */,
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(250);


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
/**
 * Desktop App Router
 */


const route = __webpack_require__(64);
let page = null;

/* harmony default export */ __webpack_exports__["a"] = (me => {
	route('/',              index);
	route('/i>mentions',    mentions);
	route('/post::post',    post);
	route('/search::query', search);
	route('/:user',         user.bind(null, 'home'));
	route('/:user/graphs',  user.bind(null, 'graphs'));
	route('/:user/:post',   post);
	route('*',              notFound);

	function index() {
		me ? home() : entrance();
	}

	function home() {
		mount(document.createElement('mk-home-page'));
	}

	function entrance() {
		mount(document.createElement('mk-entrance'));
		document.documentElement.setAttribute('data-page', 'entrance');
	}

	function mentions() {
		const el = document.createElement('mk-home-page');
		el.setAttribute('mode', 'mentions');
		mount(el);
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

	function post(ctx) {
		const el = document.createElement('mk-post-page');
		el.setAttribute('post', ctx.params.post);
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
	document.documentElement.removeAttribute('data-page');
	if (page) page.unmount();
	const body = document.getElementById('app');
	page = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](body.appendChild(content))[0];
}


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__(97);
const dialog = __webpack_require__(57);

/* harmony default export */ __webpack_exports__["a"] = (() => {
	if (fuckAdBlock === undefined) {
		adBlockDetected();
	} else {
		fuckAdBlock.onDetected(adBlockDetected);
	}
});

function adBlockDetected() {
	dialog('<i class="fa fa-exclamation-triangle"></i>広告ブロッカーを無効にしてください',
		'<strong>Misskeyは広告を掲載していません</strong>が、広告をブロックする機能が有効だと一部の機能が利用できなかったり、不具合が発生する場合があります。',
	[{
		text: 'OK'
	}]);
}


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(103);
__webpack_require__(105);
__webpack_require__(190);
__webpack_require__(136);
__webpack_require__(116);
__webpack_require__(107);
__webpack_require__(110);
__webpack_require__(112);
__webpack_require__(111);
__webpack_require__(113);
__webpack_require__(114);
__webpack_require__(108);
__webpack_require__(109);
__webpack_require__(159);
__webpack_require__(104);
__webpack_require__(163);
__webpack_require__(162);
__webpack_require__(100);
__webpack_require__(174);
__webpack_require__(168);
__webpack_require__(171);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(140);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(166);
__webpack_require__(153);
__webpack_require__(155);
__webpack_require__(131);
__webpack_require__(128);
__webpack_require__(121);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(129);
__webpack_require__(122);
__webpack_require__(125);
__webpack_require__(123);
__webpack_require__(127);
__webpack_require__(124);
__webpack_require__(118);
__webpack_require__(132);
__webpack_require__(126);
__webpack_require__(130);
__webpack_require__(167);
__webpack_require__(139);
__webpack_require__(138);
__webpack_require__(117);
__webpack_require__(115);
__webpack_require__(176);
__webpack_require__(133);
__webpack_require__(182);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(183);
__webpack_require__(181);
__webpack_require__(184);
__webpack_require__(102);
__webpack_require__(141);
__webpack_require__(142);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(148);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(145);
__webpack_require__(101);
__webpack_require__(154);
__webpack_require__(185);
__webpack_require__(150);
__webpack_require__(149);
__webpack_require__(158);
__webpack_require__(157);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(156);
__webpack_require__(165);
__webpack_require__(164);
__webpack_require__(135);
__webpack_require__(134);
__webpack_require__(106);
__webpack_require__(189);
__webpack_require__(180);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(177);
__webpack_require__(137);
__webpack_require__(175);


/***/ }),
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(58)(content, {});
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	module.hot.accept("!!/home/travis/build/syuilo/misskey/node_modules/css-loader/index.js!/home/travis/build/syuilo/misskey/node_modules/stylus-loader/index.js!/home/travis/build/syuilo/misskey/src/web/app/desktop/style.styl", function() {
		var newContent = require("!!/home/travis/build/syuilo/misskey/node_modules/css-loader/index.js!/home/travis/build/syuilo/misskey/node_modules/stylus-loader/index.js!/home/travis/build/syuilo/misskey/src/web/app/desktop/style.styl");
		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
		update(newContent);
	});
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */,
/* 90 */,
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Cropper.js v1.0.0-rc
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-03-25T12:02:21.062Z
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Cropper = factory());
}(this, (function () { 'use strict';

var DEFAULTS = {
  // Define the view mode of the cropper
  viewMode: 0, // 0, 1, 2, 3

  // Define the dragging mode of the cropper
  dragMode: 'crop', // 'crop', 'move' or 'none'

  // Define the aspect ratio of the crop box
  aspectRatio: NaN,

  // An object with the previous cropping result data
  data: null,

  // A selector for adding extra containers to preview
  preview: '',

  // Re-render the cropper when resize the window
  responsive: true,

  // Restore the cropped area after resize the window
  restore: true,

  // Check if the current image is a cross-origin image
  checkCrossOrigin: true,

  // Check the current image's Exif Orientation information
  checkOrientation: true,

  // Show the black modal
  modal: true,

  // Show the dashed lines for guiding
  guides: true,

  // Show the center indicator for guiding
  center: true,

  // Show the white modal to highlight the crop box
  highlight: true,

  // Show the grid background
  background: true,

  // Enable to crop the image automatically when initialize
  autoCrop: true,

  // Define the percentage of automatic cropping area when initializes
  autoCropArea: 0.8,

  // Enable to move the image
  movable: true,

  // Enable to rotate the image
  rotatable: true,

  // Enable to scale the image
  scalable: true,

  // Enable to zoom the image
  zoomable: true,

  // Enable to zoom the image by dragging touch
  zoomOnTouch: true,

  // Enable to zoom the image by wheeling mouse
  zoomOnWheel: true,

  // Define zoom ratio when zoom the image by wheeling mouse
  wheelZoomRatio: 0.1,

  // Enable to move the crop box
  cropBoxMovable: true,

  // Enable to resize the crop box
  cropBoxResizable: true,

  // Toggle drag mode between "crop" and "move" when click twice on the cropper
  toggleDragModeOnDblclick: true,

  // Size limitation
  minCanvasWidth: 0,
  minCanvasHeight: 0,
  minCropBoxWidth: 0,
  minCropBoxHeight: 0,
  minContainerWidth: 200,
  minContainerHeight: 100,

  // Shortcuts of events
  ready: null,
  cropstart: null,
  cropmove: null,
  cropend: null,
  crop: null,
  zoom: null
};

var TEMPLATE = '<div class="cropper-container">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-action="e"></span>' + '<span class="cropper-line line-n" data-action="n"></span>' + '<span class="cropper-line line-w" data-action="w"></span>' + '<span class="cropper-line line-s" data-action="s"></span>' + '<span class="cropper-point point-e" data-action="e"></span>' + '<span class="cropper-point point-n" data-action="n"></span>' + '<span class="cropper-point point-w" data-action="w"></span>' + '<span class="cropper-point point-s" data-action="s"></span>' + '<span class="cropper-point point-ne" data-action="ne"></span>' + '<span class="cropper-point point-nw" data-action="nw"></span>' + '<span class="cropper-point point-sw" data-action="sw"></span>' + '<span class="cropper-point point-se" data-action="se"></span>' + '</div>' + '</div>';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// RegExps
var REGEXP_DATA_URL_HEAD = /^data:.*,/;
var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
var REGEXP_ORIGINS = /^(https?:)\/\/([^:/?#]+):?(\d*)/i;
var REGEXP_SPACES = /\s+/;
var REGEXP_SUFFIX = /^(width|height|left|top|marginLeft|marginTop)$/;
var REGEXP_TRIM = /^\s+(.*)\s+$/;
var REGEXP_USERAGENT = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i;

// Utilities
var navigator = typeof window !== 'undefined' ? window.navigator : null;
var IS_SAFARI_OR_UIWEBVIEW = navigator && REGEXP_USERAGENT.test(navigator.userAgent);
var objectProto = Object.prototype;
var toString = objectProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var slice = Array.prototype.slice;
var fromCharCode = String.fromCharCode;

function typeOf(obj) {
  return toString.call(obj).slice(8, -1).toLowerCase();
}

function isNumber(num) {
  return typeof num === 'number' && !isNaN(num);
}

function isUndefined(obj) {
  return typeof obj === 'undefined';
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function isPlainObject(obj) {
  if (!isObject(obj)) {
    return false;
  }

  try {
    var _constructor = obj.constructor;
    var prototype = _constructor.prototype;

    return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (e) {
    return false;
  }
}

function isFunction(fn) {
  return typeOf(fn) === 'function';
}

function isArray(arr) {
  return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
}



function trim(str) {
  if (typeof str === 'string') {
    str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '$1');
  }

  return str;
}

function each(obj, callback) {
  if (obj && isFunction(callback)) {
    var i = void 0;

    if (isArray(obj) || isNumber(obj.length) /* array-like */) {
        var length = obj.length;

        for (i = 0; i < length; i++) {
          if (callback.call(obj, obj[i], i, obj) === false) {
            break;
          }
        }
      } else if (isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        callback.call(obj, obj[key], key, obj);
      });
    }
  }

  return obj;
}

function extend(obj) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(obj) && args.length > 0) {
    if (Object.assign) {
      return Object.assign.apply(Object, [obj].concat(args));
    }

    args.forEach(function (arg) {
      if (isObject(arg)) {
        Object.keys(arg).forEach(function (key) {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
}

function proxy(fn, context) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args2 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args2[_key3] = arguments[_key3];
    }

    return fn.apply(context, args.concat(args2));
  };
}

function setStyle(element, styles) {
  var style = element.style;

  each(styles, function (value, property) {
    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
      value += 'px';
    }

    style[property] = value;
  });
}

function hasClass(element, value) {
  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
}

function addClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, function (elem) {
      addClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.add(value);
    return;
  }

  var className = trim(element.className);

  if (!className) {
    element.className = value;
  } else if (className.indexOf(value) < 0) {
    element.className = className + ' ' + value;
  }
}

function removeClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, function (elem) {
      removeClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.remove(value);
    return;
  }

  if (element.className.indexOf(value) >= 0) {
    element.className = element.className.replace(value, '');
  }
}

function toggleClass(element, value, added) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, function (elem) {
      toggleClass(elem, value, added);
    });
    return;
  }

  // IE10-11 doesn't support the second parameter of `classList.toggle`
  if (added) {
    addClass(element, value);
  } else {
    removeClass(element, value);
  }
}

function hyphenate(str) {
  return str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
}

function getData$1(element, name) {
  if (isObject(element[name])) {
    return element[name];
  } else if (element.dataset) {
    return element.dataset[name];
  }

  return element.getAttribute('data-' + hyphenate(name));
}

function setData$1(element, name, data) {
  if (isObject(data)) {
    element[name] = data;
  } else if (element.dataset) {
    element.dataset[name] = data;
  } else {
    element.setAttribute('data-' + hyphenate(name), data);
  }
}

function removeData(element, name) {
  if (isObject(element[name])) {
    delete element[name];
  } else if (element.dataset) {
    // #128 Safari not allows to delete dataset property
    try {
      delete element.dataset[name];
    } catch (e) {
      element.dataset[name] = null;
    }
  } else {
    element.removeAttribute('data-' + hyphenate(name));
  }
}

function removeListener(element, type, handler) {
  var types = trim(type).split(REGEXP_SPACES);

  if (types.length > 1) {
    each(types, function (t) {
      removeListener(element, t, handler);
    });
    return;
  }

  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  }
}

function addListener(element, type, _handler, once) {
  var types = trim(type).split(REGEXP_SPACES);
  var originalHandler = _handler;

  if (types.length > 1) {
    each(types, function (t) {
      addListener(element, t, _handler);
    });
    return;
  }

  if (once) {
    _handler = function handler() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      removeListener(element, type, _handler);

      return originalHandler.apply(element, args);
    };
  }

  if (element.addEventListener) {
    element.addEventListener(type, _handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, _handler);
  }
}

function dispatchEvent(element, type, data) {
  if (element.dispatchEvent) {
    var event = void 0;

    // Event and CustomEvent on IE9-11 are global objects, not constructors
    if (isFunction(Event) && isFunction(CustomEvent)) {
      if (isUndefined(data)) {
        event = new Event(type, {
          bubbles: true,
          cancelable: true
        });
      } else {
        event = new CustomEvent(type, {
          detail: data,
          bubbles: true,
          cancelable: true
        });
      }
    } else if (isUndefined(data)) {
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    // IE9+
    return element.dispatchEvent(event);
  } else if (element.fireEvent) {
    // IE6-10 (native events only)
    return element.fireEvent('on' + type);
  }

  return true;
}

function getEvent(event) {
  var e = event || window.event;

  // Fix target property (IE8)
  if (!e.target) {
    e.target = e.srcElement || document;
  }

  if (!isNumber(e.pageX) && isNumber(e.clientX)) {
    var eventDoc = event.target.ownerDocument || document;
    var doc = eventDoc.documentElement;
    var body = eventDoc.body;

    e.pageX = e.clientX + ((doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
    e.pageY = e.clientY + ((doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0));
  }

  return e;
}

function getOffset(element) {
  var doc = document.documentElement;
  var box = element.getBoundingClientRect();

  return {
    left: box.left + ((window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0)),
    top: box.top + ((window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0))
  };
}

function getByTag(element, tagName) {
  return element.getElementsByTagName(tagName);
}

function getByClass(element, className) {
  return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
}

function createElement(tagName) {
  return document.createElement(tagName);
}

function appendChild(element, elem) {
  element.appendChild(elem);
}

function removeChild(element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function isCrossOriginURL(url) {
  var parts = url.match(REGEXP_ORIGINS);

  return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
}

function addTimestamp(url) {
  var timestamp = 'timestamp=' + new Date().getTime();

  return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
}

function getImageSize(image, callback) {
  // Modern browsers (ignore Safari)
  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
    callback(image.naturalWidth, image.naturalHeight);
    return;
  }

  // IE8: Don't use `new Image()` here
  var newImage = createElement('img');

  newImage.onload = function load() {
    callback(this.width, this.height);
  };

  newImage.src = image.src;
}

function getTransforms(data) {
  var transforms = [];
  var translateX = data.translateX;
  var translateY = data.translateY;
  var rotate = data.rotate;
  var scaleX = data.scaleX;
  var scaleY = data.scaleY;

  if (isNumber(translateX) && translateX !== 0) {
    transforms.push('translateX(' + translateX + 'px)');
  }

  if (isNumber(translateY) && translateY !== 0) {
    transforms.push('translateY(' + translateY + 'px)');
  }

  // Rotate should come first before scale to match orientation transform
  if (isNumber(rotate) && rotate !== 0) {
    transforms.push('rotate(' + rotate + 'deg)');
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    transforms.push('scaleX(' + scaleX + ')');
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    transforms.push('scaleY(' + scaleY + ')');
  }

  var transform = transforms.length ? transforms.join(' ') : 'none';

  return {
    WebkitTransform: transform,
    msTransform: transform,
    transform: transform
  };
}

function getRotatedSizes(data, reversed) {
  var deg = Math.abs(data.degree) % 180;
  var arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180;
  var sinArc = Math.sin(arc);
  var cosArc = Math.cos(arc);
  var width = data.width;
  var height = data.height;
  var aspectRatio = data.aspectRatio;
  var newWidth = void 0;
  var newHeight = void 0;

  if (!reversed) {
    newWidth = width * cosArc + height * sinArc;
    newHeight = width * sinArc + height * cosArc;
  } else {
    newWidth = width / (cosArc + sinArc / aspectRatio);
    newHeight = newWidth / aspectRatio;
  }

  return {
    width: newWidth,
    height: newHeight
  };
}

function getSourceCanvas(image, data) {
  var canvas = createElement('canvas');
  var context = canvas.getContext('2d');
  var dstX = 0;
  var dstY = 0;
  var dstWidth = data.naturalWidth;
  var dstHeight = data.naturalHeight;
  var rotate = data.rotate;
  var scaleX = data.scaleX;
  var scaleY = data.scaleY;
  var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
  var rotatable = isNumber(rotate) && rotate !== 0;
  var advanced = rotatable || scalable;
  var canvasWidth = dstWidth * Math.abs(scaleX || 1);
  var canvasHeight = dstHeight * Math.abs(scaleY || 1);
  var translateX = void 0;
  var translateY = void 0;
  var rotated = void 0;

  if (scalable) {
    translateX = canvasWidth / 2;
    translateY = canvasHeight / 2;
  }

  if (rotatable) {
    rotated = getRotatedSizes({
      width: canvasWidth,
      height: canvasHeight,
      degree: rotate
    });

    canvasWidth = rotated.width;
    canvasHeight = rotated.height;
    translateX = canvasWidth / 2;
    translateY = canvasHeight / 2;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (advanced) {
    dstX = -dstWidth / 2;
    dstY = -dstHeight / 2;

    context.save();
    context.translate(translateX, translateY);
  }

  // Rotate should come first before scale as in the "getTransform" function
  if (rotatable) {
    context.rotate(rotate * Math.PI / 180);
  }

  if (scalable) {
    context.scale(scaleX, scaleY);
  }

  context.drawImage(image, Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));

  if (advanced) {
    context.restore();
  }

  return canvas;
}

function getStringFromCharCode(dataView, start, length) {
  var str = '';
  var i = start;

  for (length += start; i < length; i++) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}

function getOrientation(arrayBuffer) {
  var dataView = new DataView(arrayBuffer);
  var length = dataView.byteLength;
  var orientation = void 0;
  var exifIDCode = void 0;
  var tiffOffset = void 0;
  var firstIFDOffset = void 0;
  var littleEndian = void 0;
  var endianness = void 0;
  var app1Start = void 0;
  var ifdStart = void 0;
  var offset = void 0;
  var i = void 0;

  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2;

    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset;
        break;
      }

      offset++;
    }
  }

  if (app1Start) {
    exifIDCode = app1Start + 4;
    tiffOffset = app1Start + 10;

    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      endianness = dataView.getUint16(tiffOffset);
      littleEndian = endianness === 0x4949;

      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
    }
  }

  if (ifdStart) {
    length = dataView.getUint16(ifdStart, littleEndian);

    for (i = 0; i < length; i++) {
      offset = ifdStart + i * 12 + 2;

      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with its default value for Safari
          if (IS_SAFARI_OR_UIWEBVIEW) {
            dataView.setUint16(offset, 1, littleEndian);
          }

          break;
        }
    }
  }

  return orientation;
}

function dataURLToArrayBuffer(dataURL) {
  var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  var binary = atob(base64);
  var length = binary.length;
  var arrayBuffer = new ArrayBuffer(length);
  var dataView = new Uint8Array(arrayBuffer);
  var i = void 0;

  for (i = 0; i < length; i++) {
    dataView[i] = binary.charCodeAt(i);
  }

  return arrayBuffer;
}

// Only available for JPEG image
function arrayBufferToDataURL(arrayBuffer) {
  var dataView = new Uint8Array(arrayBuffer);
  var length = dataView.length;
  var base64 = '';
  var i = void 0;

  for (i = 0; i < length; i++) {
    base64 += fromCharCode(dataView[i]);
  }

  return 'data:image/jpeg;base64,' + btoa(base64);
}

var render$1 = {
  render: function render() {
    var self = this;

    self.initContainer();
    self.initCanvas();
    self.initCropBox();

    self.renderCanvas();

    if (self.cropped) {
      self.renderCropBox();
    }
  },
  initContainer: function initContainer() {
    var self = this;
    var options = self.options;
    var element = self.element;
    var container = self.container;
    var cropper = self.cropper;
    var hidden = 'cropper-hidden';
    var containerData = void 0;

    addClass(cropper, hidden);
    removeClass(element, hidden);

    self.containerData = containerData = {
      width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
      height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
    };

    setStyle(cropper, {
      width: containerData.width,
      height: containerData.height
    });

    addClass(element, hidden);
    removeClass(cropper, hidden);
  },


  // Canvas (image wrapper)
  initCanvas: function initCanvas() {
    var self = this;
    var viewMode = self.options.viewMode;
    var containerData = self.containerData;
    var imageData = self.imageData;
    var rotated = Math.abs(imageData.rotate) === 90;
    var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
    var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
    var aspectRatio = naturalWidth / naturalHeight;
    var canvasWidth = containerData.width;
    var canvasHeight = containerData.height;

    if (containerData.height * aspectRatio > containerData.width) {
      if (viewMode === 3) {
        canvasWidth = containerData.height * aspectRatio;
      } else {
        canvasHeight = containerData.width / aspectRatio;
      }
    } else if (viewMode === 3) {
      canvasHeight = containerData.width / aspectRatio;
    } else {
      canvasWidth = containerData.height * aspectRatio;
    }

    var canvasData = {
      naturalWidth: naturalWidth,
      naturalHeight: naturalHeight,
      aspectRatio: aspectRatio,
      width: canvasWidth,
      height: canvasHeight
    };

    canvasData.oldLeft = canvasData.left = (containerData.width - canvasWidth) / 2;
    canvasData.oldTop = canvasData.top = (containerData.height - canvasHeight) / 2;

    self.canvasData = canvasData;
    self.limited = viewMode === 1 || viewMode === 2;
    self.limitCanvas(true, true);
    self.initialImageData = extend({}, imageData);
    self.initialCanvasData = extend({}, canvasData);
  },
  limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
    var self = this;
    var options = self.options;
    var viewMode = options.viewMode;
    var containerData = self.containerData;
    var canvasData = self.canvasData;
    var aspectRatio = canvasData.aspectRatio;
    var cropBoxData = self.cropBoxData;
    var cropped = self.cropped && cropBoxData;

    if (sizeLimited) {
      var minCanvasWidth = Number(options.minCanvasWidth) || 0;
      var minCanvasHeight = Number(options.minCanvasHeight) || 0;

      if (viewMode > 1) {
        minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
        minCanvasHeight = Math.max(minCanvasHeight, containerData.height);

        if (viewMode === 3) {
          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          } else {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          }
        }
      } else if (viewMode > 0) {
        if (minCanvasWidth) {
          minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
        } else if (minCanvasHeight) {
          minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
        } else if (cropped) {
          minCanvasWidth = cropBoxData.width;
          minCanvasHeight = cropBoxData.height;

          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          } else {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          }
        }
      }

      if (minCanvasWidth && minCanvasHeight) {
        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else {
          minCanvasWidth = minCanvasHeight * aspectRatio;
        }
      } else if (minCanvasWidth) {
        minCanvasHeight = minCanvasWidth / aspectRatio;
      } else if (minCanvasHeight) {
        minCanvasWidth = minCanvasHeight * aspectRatio;
      }

      canvasData.minWidth = minCanvasWidth;
      canvasData.minHeight = minCanvasHeight;
      canvasData.maxWidth = Infinity;
      canvasData.maxHeight = Infinity;
    }

    if (positionLimited) {
      if (viewMode) {
        var newCanvasLeft = containerData.width - canvasData.width;
        var newCanvasTop = containerData.height - canvasData.height;

        canvasData.minLeft = Math.min(0, newCanvasLeft);
        canvasData.minTop = Math.min(0, newCanvasTop);
        canvasData.maxLeft = Math.max(0, newCanvasLeft);
        canvasData.maxTop = Math.max(0, newCanvasTop);

        if (cropped && self.limited) {
          canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
          canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
          canvasData.maxLeft = cropBoxData.left;
          canvasData.maxTop = cropBoxData.top;

          if (viewMode === 2) {
            if (canvasData.width >= containerData.width) {
              canvasData.minLeft = Math.min(0, newCanvasLeft);
              canvasData.maxLeft = Math.max(0, newCanvasLeft);
            }

            if (canvasData.height >= containerData.height) {
              canvasData.minTop = Math.min(0, newCanvasTop);
              canvasData.maxTop = Math.max(0, newCanvasTop);
            }
          }
        }
      } else {
        canvasData.minLeft = -canvasData.width;
        canvasData.minTop = -canvasData.height;
        canvasData.maxLeft = containerData.width;
        canvasData.maxTop = containerData.height;
      }
    }
  },
  renderCanvas: function renderCanvas(changed) {
    var self = this;
    var canvasData = self.canvasData;
    var imageData = self.imageData;
    var rotate = imageData.rotate;

    if (self.rotated) {
      self.rotated = false;

      // Computes rotated sizes with image sizes
      var rotatedData = getRotatedSizes({
        width: imageData.width,
        height: imageData.height,
        degree: rotate
      });
      var aspectRatio = rotatedData.width / rotatedData.height;
      var isSquareImage = imageData.aspectRatio === 1;

      if (isSquareImage || aspectRatio !== canvasData.aspectRatio) {
        canvasData.left -= (rotatedData.width - canvasData.width) / 2;
        canvasData.top -= (rotatedData.height - canvasData.height) / 2;
        canvasData.width = rotatedData.width;
        canvasData.height = rotatedData.height;
        canvasData.aspectRatio = aspectRatio;
        canvasData.naturalWidth = imageData.naturalWidth;
        canvasData.naturalHeight = imageData.naturalHeight;

        // Computes rotated sizes with natural image sizes
        if (isSquareImage && rotate % 90 || rotate % 180) {
          var rotatedData2 = getRotatedSizes({
            width: imageData.naturalWidth,
            height: imageData.naturalHeight,
            degree: rotate
          });

          canvasData.naturalWidth = rotatedData2.width;
          canvasData.naturalHeight = rotatedData2.height;
        }

        self.limitCanvas(true, false);
      }
    }

    if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
      canvasData.left = canvasData.oldLeft;
    }

    if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
      canvasData.top = canvasData.oldTop;
    }

    canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
    canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);

    self.limitCanvas(false, true);

    canvasData.oldLeft = canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
    canvasData.oldTop = canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);

    setStyle(self.canvas, extend({
      width: canvasData.width,
      height: canvasData.height
    }, getTransforms({
      translateX: canvasData.left,
      translateY: canvasData.top
    })));

    self.renderImage();

    if (self.cropped && self.limited) {
      self.limitCropBox(true, true);
    }

    if (changed) {
      self.output();
    }
  },
  renderImage: function renderImage(changed) {
    var self = this;
    var canvasData = self.canvasData;
    var imageData = self.imageData;
    var newImageData = void 0;
    var reversedData = void 0;
    var reversedWidth = void 0;
    var reversedHeight = void 0;

    if (imageData.rotate) {
      reversedData = getRotatedSizes({
        width: canvasData.width,
        height: canvasData.height,
        degree: imageData.rotate,
        aspectRatio: imageData.aspectRatio
      }, true);

      reversedWidth = reversedData.width;
      reversedHeight = reversedData.height;

      newImageData = {
        width: reversedWidth,
        height: reversedHeight,
        left: (canvasData.width - reversedWidth) / 2,
        top: (canvasData.height - reversedHeight) / 2
      };
    }

    extend(imageData, newImageData || {
      width: canvasData.width,
      height: canvasData.height,
      left: 0,
      top: 0
    });

    setStyle(self.image, extend({
      width: imageData.width,
      height: imageData.height
    }, getTransforms(extend({
      translateX: imageData.left,
      translateY: imageData.top
    }, imageData))));

    if (changed) {
      self.output();
    }
  },
  initCropBox: function initCropBox() {
    var self = this;
    var options = self.options;
    var aspectRatio = options.aspectRatio;
    var autoCropArea = Number(options.autoCropArea) || 0.8;
    var canvasData = self.canvasData;
    var cropBoxData = {
      width: canvasData.width,
      height: canvasData.height
    };

    if (aspectRatio) {
      if (canvasData.height * aspectRatio > canvasData.width) {
        cropBoxData.height = cropBoxData.width / aspectRatio;
      } else {
        cropBoxData.width = cropBoxData.height * aspectRatio;
      }
    }

    self.cropBoxData = cropBoxData;
    self.limitCropBox(true, true);

    // Initialize auto crop area
    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

    // The width/height of auto crop area must large than "minWidth/Height"
    cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
    cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
    cropBoxData.oldLeft = cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
    cropBoxData.oldTop = cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;

    self.initialCropBoxData = extend({}, cropBoxData);
  },
  limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
    var self = this;
    var options = self.options;
    var aspectRatio = options.aspectRatio;
    var containerData = self.containerData;
    var canvasData = self.canvasData;
    var cropBoxData = self.cropBoxData;
    var limited = self.limited;

    if (sizeLimited) {
      var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
      var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
      var maxCropBoxWidth = Math.min(containerData.width, limited ? canvasData.width : containerData.width);
      var maxCropBoxHeight = Math.min(containerData.height, limited ? canvasData.height : containerData.height);

      // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
      minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
      minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);

      if (aspectRatio) {
        if (minCropBoxWidth && minCropBoxHeight) {
          if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }
        } else if (minCropBoxWidth) {
          minCropBoxHeight = minCropBoxWidth / aspectRatio;
        } else if (minCropBoxHeight) {
          minCropBoxWidth = minCropBoxHeight * aspectRatio;
        }

        if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
          maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
        } else {
          maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
        }
      }

      // The minWidth/Height must be less than maxWidth/Height
      cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
      cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
      cropBoxData.maxWidth = maxCropBoxWidth;
      cropBoxData.maxHeight = maxCropBoxHeight;
    }

    if (positionLimited) {
      if (limited) {
        cropBoxData.minLeft = Math.max(0, canvasData.left);
        cropBoxData.minTop = Math.max(0, canvasData.top);
        cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
        cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
      } else {
        cropBoxData.minLeft = 0;
        cropBoxData.minTop = 0;
        cropBoxData.maxLeft = containerData.width - cropBoxData.width;
        cropBoxData.maxTop = containerData.height - cropBoxData.height;
      }
    }
  },
  renderCropBox: function renderCropBox() {
    var self = this;
    var options = self.options;
    var containerData = self.containerData;
    var cropBoxData = self.cropBoxData;

    if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
      cropBoxData.left = cropBoxData.oldLeft;
    }

    if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
      cropBoxData.top = cropBoxData.oldTop;
    }

    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

    self.limitCropBox(false, true);

    cropBoxData.oldLeft = cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
    cropBoxData.oldTop = cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);

    if (options.movable && options.cropBoxMovable) {
      // Turn to move the canvas when the crop box is equal to the container
      setData$1(self.face, 'action', cropBoxData.width === containerData.width && cropBoxData.height === containerData.height ? 'move' : 'all');
    }

    setStyle(self.cropBox, extend({
      width: cropBoxData.width,
      height: cropBoxData.height
    }, getTransforms({
      translateX: cropBoxData.left,
      translateY: cropBoxData.top
    })));

    if (self.cropped && self.limited) {
      self.limitCanvas(true, true);
    }

    if (!self.disabled) {
      self.output();
    }
  },
  output: function output() {
    var self = this;

    self.preview();

    if (self.complete) {
      dispatchEvent(self.element, 'crop', self.getData());
    }
  }
};

var DATA_PREVIEW = 'preview';

var preview$1 = {
  initPreview: function initPreview() {
    var self = this;
    var preview = self.options.preview;
    var image = createElement('img');
    var crossOrigin = self.crossOrigin;
    var url = crossOrigin ? self.crossOriginUrl : self.url;

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = url;
    appendChild(self.viewBox, image);
    self.image2 = image;

    if (!preview) {
      return;
    }

    var previews = preview.querySelector ? [preview] : document.querySelectorAll(preview);

    self.previews = previews;

    each(previews, function (element) {
      var img = createElement('img');

      // Save the original size for recover
      setData$1(element, DATA_PREVIEW, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        html: element.innerHTML
      });

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.src = url;

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * Add `height:auto` to override `height` attribute on IE8
       * (Occur only when margin-top <= -height)
       */

      img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';

      empty(element);
      appendChild(element, img);
    });
  },
  resetPreview: function resetPreview() {
    each(this.previews, function (element) {
      var data = getData$1(element, DATA_PREVIEW);

      setStyle(element, {
        width: data.width,
        height: data.height
      });

      element.innerHTML = data.html;
      removeData(element, DATA_PREVIEW);
    });
  },
  preview: function preview() {
    var self = this;
    var imageData = self.imageData;
    var canvasData = self.canvasData;
    var cropBoxData = self.cropBoxData;
    var cropBoxWidth = cropBoxData.width;
    var cropBoxHeight = cropBoxData.height;
    var width = imageData.width;
    var height = imageData.height;
    var left = cropBoxData.left - canvasData.left - imageData.left;
    var top = cropBoxData.top - canvasData.top - imageData.top;

    if (!self.cropped || self.disabled) {
      return;
    }

    setStyle(self.image2, extend({
      width: width,
      height: height
    }, getTransforms(extend({
      translateX: -left,
      translateY: -top
    }, imageData))));

    each(self.previews, function (element) {
      var data = getData$1(element, DATA_PREVIEW);
      var originalWidth = data.width;
      var originalHeight = data.height;
      var newWidth = originalWidth;
      var newHeight = originalHeight;
      var ratio = 1;

      if (cropBoxWidth) {
        ratio = originalWidth / cropBoxWidth;
        newHeight = cropBoxHeight * ratio;
      }

      if (cropBoxHeight && newHeight > originalHeight) {
        ratio = originalHeight / cropBoxHeight;
        newWidth = cropBoxWidth * ratio;
        newHeight = originalHeight;
      }

      setStyle(element, {
        width: newWidth,
        height: newHeight
      });

      setStyle(getByTag(element, 'img')[0], extend({
        width: width * ratio,
        height: height * ratio
      }, getTransforms(extend({
        translateX: -left * ratio,
        translateY: -top * ratio
      }, imageData))));
    });
  }
};

// Globals
var PointerEvent = typeof window !== 'undefined' ? window.PointerEvent : null;

// Events
var EVENT_POINTER_DOWN = PointerEvent ? 'pointerdown' : 'touchstart mousedown';
var EVENT_POINTER_MOVE = PointerEvent ? 'pointermove' : 'touchmove mousemove';
var EVENT_POINTER_UP = PointerEvent ? ' pointerup pointercancel' : 'touchend touchcancel mouseup';
var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
var EVENT_DBLCLICK = 'dblclick';
var EVENT_RESIZE = 'resize';
var EVENT_CROP_START = 'cropstart';
var EVENT_CROP_MOVE = 'cropmove';
var EVENT_CROP_END = 'cropend';
var EVENT_CROP$1 = 'crop';
var EVENT_ZOOM = 'zoom';

var events = {
  bind: function bind() {
    var self = this;
    var options = self.options;
    var element = self.element;
    var cropper = self.cropper;

    if (isFunction(options.cropstart)) {
      addListener(element, EVENT_CROP_START, options.cropstart);
    }

    if (isFunction(options.cropmove)) {
      addListener(element, EVENT_CROP_MOVE, options.cropmove);
    }

    if (isFunction(options.cropend)) {
      addListener(element, EVENT_CROP_END, options.cropend);
    }

    if (isFunction(options.crop)) {
      addListener(element, EVENT_CROP$1, options.crop);
    }

    if (isFunction(options.zoom)) {
      addListener(element, EVENT_ZOOM, options.zoom);
    }

    addListener(cropper, EVENT_POINTER_DOWN, self.onCropStart = proxy(self.cropStart, self));

    if (options.zoomable && options.zoomOnWheel) {
      addListener(cropper, EVENT_WHEEL, self.onWheel = proxy(self.wheel, self));
    }

    if (options.toggleDragModeOnDblclick) {
      addListener(cropper, EVENT_DBLCLICK, self.onDblclick = proxy(self.dblclick, self));
    }

    addListener(document, EVENT_POINTER_MOVE, self.onCropMove = proxy(self.cropMove, self));
    addListener(document, EVENT_POINTER_UP, self.onCropEnd = proxy(self.cropEnd, self));

    if (options.responsive) {
      addListener(window, EVENT_RESIZE, self.onResize = proxy(self.resize, self));
    }
  },
  unbind: function unbind() {
    var self = this;
    var options = self.options;
    var element = self.element;
    var cropper = self.cropper;

    if (isFunction(options.cropstart)) {
      removeListener(element, EVENT_CROP_START, options.cropstart);
    }

    if (isFunction(options.cropmove)) {
      removeListener(element, EVENT_CROP_MOVE, options.cropmove);
    }

    if (isFunction(options.cropend)) {
      removeListener(element, EVENT_CROP_END, options.cropend);
    }

    if (isFunction(options.crop)) {
      removeListener(element, EVENT_CROP$1, options.crop);
    }

    if (isFunction(options.zoom)) {
      removeListener(element, EVENT_ZOOM, options.zoom);
    }

    removeListener(cropper, EVENT_POINTER_DOWN, self.onCropStart);

    if (options.zoomable && options.zoomOnWheel) {
      removeListener(cropper, EVENT_WHEEL, self.onWheel);
    }

    if (options.toggleDragModeOnDblclick) {
      removeListener(cropper, EVENT_DBLCLICK, self.onDblclick);
    }

    removeListener(document, EVENT_POINTER_MOVE, self.onCropMove);
    removeListener(document, EVENT_POINTER_UP, self.onCropEnd);

    if (options.responsive) {
      removeListener(window, EVENT_RESIZE, self.onResize);
    }
  }
};

var REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;

function getPointer(_ref, endOnly) {
  var pageX = _ref.pageX,
      pageY = _ref.pageY;

  var end = {
    endX: pageX,
    endY: pageY
  };

  if (endOnly) {
    return end;
  }

  return extend({
    startX: pageX,
    startY: pageY
  }, end);
}

var handlers = {
  resize: function resize() {
    var self = this;
    var options = self.options;
    var container = self.container;
    var containerData = self.containerData;
    var minContainerWidth = Number(options.minContainerWidth) || 200;
    var minContainerHeight = Number(options.minContainerHeight) || 100;

    if (self.disabled || containerData.width === minContainerWidth || containerData.height === minContainerHeight) {
      return;
    }

    var ratio = container.offsetWidth / containerData.width;

    // Resize when width changed or height changed
    if (ratio !== 1 || container.offsetHeight !== containerData.height) {
      (function () {
        var canvasData = void 0;
        var cropBoxData = void 0;

        if (options.restore) {
          canvasData = self.getCanvasData();
          cropBoxData = self.getCropBoxData();
        }

        self.render();

        if (options.restore) {
          self.setCanvasData(each(canvasData, function (n, i) {
            canvasData[i] = n * ratio;
          }));
          self.setCropBoxData(each(cropBoxData, function (n, i) {
            cropBoxData[i] = n * ratio;
          }));
        }
      })();
    }
  },
  dblclick: function dblclick() {
    var self = this;

    if (self.disabled || self.options.dragMode === 'none') {
      return;
    }

    self.setDragMode(hasClass(self.dragBox, 'cropper-crop') ? 'move' : 'crop');
  },
  wheel: function wheel(event) {
    var self = this;
    var e = getEvent(event);
    var ratio = Number(self.options.wheelZoomRatio) || 0.1;
    var delta = 1;

    if (self.disabled) {
      return;
    }

    e.preventDefault();

    // Limit wheel speed to prevent zoom too fast (#21)
    if (self.wheeling) {
      return;
    }

    self.wheeling = true;

    setTimeout(function () {
      self.wheeling = false;
    }, 50);

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    self.zoom(-delta * ratio, e);
  },
  cropStart: function cropStart(event) {
    var self = this;

    if (self.disabled) {
      return;
    }

    var options = self.options;
    var pointers = self.pointers;
    var e = getEvent(event);
    var action = void 0;

    if (e.changedTouches) {
      // Handle touch event
      each(e.changedTouches, function (touch) {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      // Handle mouse event and pointer event
      pointers[e.pointerId || 0] = getPointer(e);
    }

    if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
      action = 'zoom';
    } else {
      action = getData$1(e.target, 'action');
    }

    if (!REGEXP_ACTIONS.test(action)) {
      return;
    }

    if (dispatchEvent(self.element, 'cropstart', {
      originalEvent: e,
      action: action
    }) === false) {
      return;
    }

    e.preventDefault();

    self.action = action;
    self.cropping = false;

    if (action === 'crop') {
      self.cropping = true;
      addClass(self.dragBox, 'cropper-modal');
    }
  },
  cropMove: function cropMove(event) {
    var self = this;
    var action = self.action;

    if (self.disabled || !action) {
      return;
    }

    var pointers = self.pointers;
    var e = getEvent(event);

    e.preventDefault();

    if (dispatchEvent(self.element, 'cropmove', {
      originalEvent: e,
      action: action
    }) === false) {
      return;
    }

    if (e.changedTouches) {
      each(e.changedTouches, function (touch) {
        extend(pointers[touch.identifier], getPointer(touch, true));
      });
    } else {
      extend(pointers[e.pointerId || 0], getPointer(e, true));
    }

    self.change(e);
  },
  cropEnd: function cropEnd(event) {
    var self = this;

    if (self.disabled) {
      return;
    }

    var action = self.action;
    var pointers = self.pointers;
    var e = getEvent(event);

    if (e.changedTouches) {
      each(e.changedTouches, function (touch) {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[e.pointerId || 0];
    }

    if (!action) {
      return;
    }

    e.preventDefault();

    if (!Object.keys(pointers).length) {
      self.action = '';
    }

    if (self.cropping) {
      self.cropping = false;
      toggleClass(self.dragBox, 'cropper-modal', self.cropped && this.options.modal);
    }

    dispatchEvent(self.element, 'cropend', {
      originalEvent: e,
      action: action
    });
  }
};

// Actions
var ACTION_EAST = 'e';
var ACTION_WEST = 'w';
var ACTION_SOUTH = 's';
var ACTION_NORTH = 'n';
var ACTION_SOUTH_EAST = 'se';
var ACTION_SOUTH_WEST = 'sw';
var ACTION_NORTH_EAST = 'ne';
var ACTION_NORTH_WEST = 'nw';

function getMaxZoomRatio(pointers) {
  var pointers2 = extend({}, pointers);
  var ratios = [];

  each(pointers, function (pointer, pointerId) {
    delete pointers2[pointerId];

    each(pointers2, function (pointer2) {
      var x1 = Math.abs(pointer.startX - pointer2.startX);
      var y1 = Math.abs(pointer.startY - pointer2.startY);
      var x2 = Math.abs(pointer.endX - pointer2.endX);
      var y2 = Math.abs(pointer.endY - pointer2.endY);
      var z1 = Math.sqrt(x1 * x1 + y1 * y1);
      var z2 = Math.sqrt(x2 * x2 + y2 * y2);
      var ratio = (z2 - z1) / z1;

      ratios.push(ratio);
    });
  });

  ratios.sort(function (a, b) {
    return Math.abs(a) < Math.abs(b);
  });

  return ratios[0];
}

var change$1 = {
  change: function change(e) {
    var self = this;
    var options = self.options;
    var containerData = self.containerData;
    var canvasData = self.canvasData;
    var cropBoxData = self.cropBoxData;
    var aspectRatio = options.aspectRatio;
    var action = self.action;
    var width = cropBoxData.width;
    var height = cropBoxData.height;
    var left = cropBoxData.left;
    var top = cropBoxData.top;
    var right = left + width;
    var bottom = top + height;
    var minLeft = 0;
    var minTop = 0;
    var maxWidth = containerData.width;
    var maxHeight = containerData.height;
    var renderable = true;
    var offset = void 0;

    // Locking aspect ratio in "free mode" by holding shift key
    if (!aspectRatio && e.shiftKey) {
      aspectRatio = width && height ? width / height : 1;
    }

    if (self.limited) {
      minLeft = cropBoxData.minLeft;
      minTop = cropBoxData.minTop;
      maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
      maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
    }

    var pointers = self.pointers;
    var pointer = pointers[Object.keys(pointers)[0]];
    var range = {
      x: pointer.endX - pointer.startX,
      y: pointer.endY - pointer.startY
    };

    if (aspectRatio) {
      range.X = range.y * aspectRatio;
      range.Y = range.x / aspectRatio;
    }

    switch (action) {
      // Move crop box
      case 'all':
        left += range.x;
        top += range.y;
        break;

      // Resize crop box
      case ACTION_EAST:
        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top -= range.Y / 2;
        }

        if (width < 0) {
          action = ACTION_WEST;
          width = 0;
        }

        break;

      case ACTION_NORTH:
        if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height -= range.y;
        top += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left += range.X / 2;
        }

        if (height < 0) {
          action = ACTION_SOUTH;
          height = 0;
        }

        break;

      case ACTION_WEST:
        if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width -= range.x;
        left += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top += range.Y / 2;
        }

        if (width < 0) {
          action = ACTION_EAST;
          width = 0;
        }

        break;

      case ACTION_SOUTH:
        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left -= range.X / 2;
        }

        if (height < 0) {
          action = ACTION_NORTH;
          height = 0;
        }

        break;

      case ACTION_NORTH_EAST:
        if (aspectRatio) {
          if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y <= 0 && top <= minTop) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y <= 0) {
            if (top > minTop) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          action = ACTION_SOUTH_WEST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_NORTH_WEST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_SOUTH_EAST;
          height = 0;
        }

        break;

      case ACTION_NORTH_WEST:
        if (aspectRatio) {
          if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
          left += range.X;
        } else {
          if (range.x <= 0) {
            if (left > minLeft) {
              width -= range.x;
              left += range.x;
            } else if (range.y <= 0 && top <= minTop) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y <= 0) {
            if (top > minTop) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          action = ACTION_SOUTH_EAST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_NORTH_EAST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_SOUTH_WEST;
          height = 0;
        }

        break;

      case ACTION_SOUTH_WEST:
        if (aspectRatio) {
          if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x <= 0) {
            if (left > minLeft) {
              width -= range.x;
              left += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          action = ACTION_NORTH_EAST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_SOUTH_EAST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_NORTH_WEST;
          height = 0;
        }

        break;

      case ACTION_SOUTH_EAST:
        if (aspectRatio) {
          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          action = ACTION_NORTH_WEST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_SOUTH_WEST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_NORTH_EAST;
          height = 0;
        }

        break;

      // Move canvas
      case 'move':
        self.move(range.x, range.y);
        renderable = false;
        break;

      // Zoom canvas
      case 'zoom':
        self.zoom(getMaxZoomRatio(pointers), e);
        renderable = false;
        break;

      // Create crop box
      case 'crop':
        if (!range.x || !range.y) {
          renderable = false;
          break;
        }

        offset = getOffset(self.cropper);
        left = pointer.startX - offset.left;
        top = pointer.startY - offset.top;
        width = cropBoxData.minWidth;
        height = cropBoxData.minHeight;

        if (range.x > 0) {
          action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
        } else if (range.x < 0) {
          left -= width;
          action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
        }

        if (range.y < 0) {
          top -= height;
        }

        // Show the crop box if is hidden
        if (!self.cropped) {
          removeClass(self.cropBox, 'cropper-hidden');
          self.cropped = true;

          if (self.limited) {
            self.limitCropBox(true, true);
          }
        }

        break;

      // No default
    }

    if (renderable) {
      cropBoxData.width = width;
      cropBoxData.height = height;
      cropBoxData.left = left;
      cropBoxData.top = top;
      self.action = action;

      self.renderCropBox();
    }

    // Override
    each(pointers, function (p) {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  }
};

function getPointersCenter(pointers) {
  var pageX = 0;
  var pageY = 0;
  var count = 0;

  each(pointers, function (_ref) {
    var startX = _ref.startX,
        startY = _ref.startY;

    pageX += startX;
    pageY += startY;
    count += 1;
  });

  pageX /= count;
  pageY /= count;

  return {
    pageX: pageX,
    pageY: pageY
  };
}

var methods = {
  // Show the crop box manually
  crop: function crop() {
    var self = this;

    if (self.ready && !self.disabled) {
      if (!self.cropped) {
        self.cropped = true;
        self.limitCropBox(true, true);

        if (self.options.modal) {
          addClass(self.dragBox, 'cropper-modal');
        }

        removeClass(self.cropBox, 'cropper-hidden');
      }

      self.setCropBoxData(self.initialCropBoxData);
    }

    return self;
  },


  // Reset the image and crop box to their initial states
  reset: function reset() {
    var self = this;

    if (self.ready && !self.disabled) {
      self.imageData = extend({}, self.initialImageData);
      self.canvasData = extend({}, self.initialCanvasData);
      self.cropBoxData = extend({}, self.initialCropBoxData);

      self.renderCanvas();

      if (self.cropped) {
        self.renderCropBox();
      }
    }

    return self;
  },


  // Clear the crop box
  clear: function clear() {
    var self = this;

    if (self.cropped && !self.disabled) {
      extend(self.cropBoxData, {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      });

      self.cropped = false;
      self.renderCropBox();

      self.limitCanvas();

      // Render canvas after crop box rendered
      self.renderCanvas();

      removeClass(self.dragBox, 'cropper-modal');
      addClass(self.cropBox, 'cropper-hidden');
    }

    return self;
  },


  /**
   * Replace the image's src and rebuild the cropper
   *
   * @param {String} url
   * @param {Boolean} onlyColorChanged (optional)
   */
  replace: function replace(url, onlyColorChanged) {
    var self = this;

    if (!self.disabled && url) {
      if (self.isImg) {
        self.element.src = url;
      }

      if (onlyColorChanged) {
        self.url = url;
        self.image.src = url;

        if (self.ready) {
          self.image2.src = url;

          each(self.previews, function (element) {
            getByTag(element, 'img')[0].src = url;
          });
        }
      } else {
        if (self.isImg) {
          self.replaced = true;
        }

        // Clear previous data
        self.options.data = null;
        self.load(url);
      }
    }

    return self;
  },


  // Enable (unfreeze) the cropper
  enable: function enable() {
    var self = this;

    if (self.ready) {
      self.disabled = false;
      removeClass(self.cropper, 'cropper-disabled');
    }

    return self;
  },


  // Disable (freeze) the cropper
  disable: function disable() {
    var self = this;

    if (self.ready) {
      self.disabled = true;
      addClass(self.cropper, 'cropper-disabled');
    }

    return self;
  },


  // Destroy the cropper and remove the instance from the image
  destroy: function destroy() {
    var self = this;
    var element = self.element;
    var image = self.image;

    if (self.loaded) {
      if (self.isImg && self.replaced) {
        element.src = self.originalUrl;
      }

      self.unbuild();
      removeClass(element, 'cropper-hidden');
    } else if (self.isImg) {
      removeListener(element, 'load', self.onStart);
    } else if (image) {
      removeChild(image);
    }

    removeData(element, 'cropper');

    return self;
  },


  /**
   * Move the canvas with relative offsets
   *
   * @param {Number} offsetX
   * @param {Number} offsetY (optional)
   */
  move: function move(offsetX, offsetY) {
    var self = this;
    var canvasData = self.canvasData;

    return self.moveTo(isUndefined(offsetX) ? offsetX : canvasData.left + Number(offsetX), isUndefined(offsetY) ? offsetY : canvasData.top + Number(offsetY));
  },


  /**
   * Move the canvas to an absolute point
   *
   * @param {Number} x
   * @param {Number} y (optional)
   */
  moveTo: function moveTo(x, y) {
    var self = this;
    var canvasData = self.canvasData;
    var changed = false;

    // If "y" is not present, its default value is "x"
    if (isUndefined(y)) {
      y = x;
    }

    x = Number(x);
    y = Number(y);

    if (self.ready && !self.disabled && self.options.movable) {
      if (isNumber(x)) {
        canvasData.left = x;
        changed = true;
      }

      if (isNumber(y)) {
        canvasData.top = y;
        changed = true;
      }

      if (changed) {
        self.renderCanvas(true);
      }
    }

    return self;
  },


  /**
   * Zoom the canvas with a relative ratio
   *
   * @param {Number} ratio
   * @param {Event} _originalEvent (private)
   */
  zoom: function zoom(ratio, _originalEvent) {
    var self = this;
    var canvasData = self.canvasData;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    return self.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, _originalEvent);
  },


  /**
   * Zoom the canvas to an absolute ratio
   *
   * @param {Number} ratio
   * @param {Event} _originalEvent (private)
   */
  zoomTo: function zoomTo(ratio, _originalEvent) {
    var self = this;
    var options = self.options;
    var canvasData = self.canvasData;
    var width = canvasData.width;
    var height = canvasData.height;
    var naturalWidth = canvasData.naturalWidth;
    var naturalHeight = canvasData.naturalHeight;

    ratio = Number(ratio);

    if (ratio >= 0 && self.ready && !self.disabled && options.zoomable) {
      var newWidth = naturalWidth * ratio;
      var newHeight = naturalHeight * ratio;

      if (dispatchEvent(self.element, 'zoom', {
        originalEvent: _originalEvent,
        oldRatio: width / naturalWidth,
        ratio: newWidth / naturalWidth
      }) === false) {
        return self;
      }

      if (_originalEvent) {
        var pointers = self.pointers;
        var offset = getOffset(self.cropper);
        var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
          pageX: _originalEvent.pageX,
          pageY: _originalEvent.pageY
        };

        // Zoom from the triggering point of the event
        canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
        canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
      } else {
        // Zoom from the center of the canvas
        canvasData.left -= (newWidth - width) / 2;
        canvasData.top -= (newHeight - height) / 2;
      }

      canvasData.width = newWidth;
      canvasData.height = newHeight;
      self.renderCanvas(true);
    }

    return self;
  },


  /**
   * Rotate the canvas with a relative degree
   *
   * @param {Number} degree
   */
  rotate: function rotate(degree) {
    var self = this;

    return self.rotateTo((self.imageData.rotate || 0) + Number(degree));
  },


  /**
   * Rotate the canvas to an absolute degree
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
   *
   * @param {Number} degree
   */
  rotateTo: function rotateTo(degree) {
    var self = this;

    degree = Number(degree);

    if (isNumber(degree) && self.ready && !self.disabled && self.options.rotatable) {
      self.imageData.rotate = degree % 360;
      self.rotated = true;
      self.renderCanvas(true);
    }

    return self;
  },


  /**
   * Scale the image
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
   *
   * @param {Number} scaleX
   * @param {Number} scaleY (optional)
   */
  scale: function scale(scaleX, scaleY) {
    var self = this;
    var imageData = self.imageData;
    var changed = false;

    // If "scaleY" is not present, its default value is "scaleX"
    if (isUndefined(scaleY)) {
      scaleY = scaleX;
    }

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (self.ready && !self.disabled && self.options.scalable) {
      if (isNumber(scaleX)) {
        imageData.scaleX = scaleX;
        changed = true;
      }

      if (isNumber(scaleY)) {
        imageData.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        self.renderImage(true);
      }
    }

    return self;
  },


  /**
   * Scale the abscissa of the image
   *
   * @param {Number} scaleX
   */
  scaleX: function scaleX(_scaleX) {
    var self = this;
    var scaleY = self.imageData.scaleY;

    return self.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
  },


  /**
   * Scale the ordinate of the image
   *
   * @param {Number} scaleY
   */
  scaleY: function scaleY(_scaleY) {
    var self = this;
    var scaleX = self.imageData.scaleX;

    return self.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
  },


  /**
   * Get the cropped area position and size data (base on the original image)
   *
   * @param {Boolean} rounded (optional)
   * @return {Object} data
   */
  getData: function getData(rounded) {
    var self = this;
    var options = self.options;
    var imageData = self.imageData;
    var canvasData = self.canvasData;
    var cropBoxData = self.cropBoxData;
    var ratio = void 0;
    var data = void 0;

    if (self.ready && self.cropped) {
      data = {
        x: cropBoxData.left - canvasData.left,
        y: cropBoxData.top - canvasData.top,
        width: cropBoxData.width,
        height: cropBoxData.height
      };

      ratio = imageData.width / imageData.naturalWidth;

      each(data, function (n, i) {
        n /= ratio;
        data[i] = rounded ? Math.round(n) : n;
      });
    } else {
      data = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    if (options.rotatable) {
      data.rotate = imageData.rotate || 0;
    }

    if (options.scalable) {
      data.scaleX = imageData.scaleX || 1;
      data.scaleY = imageData.scaleY || 1;
    }

    return data;
  },


  /**
   * Set the cropped area position and size with new data
   *
   * @param {Object} data
   */
  setData: function setData(data) {
    var self = this;
    var options = self.options;
    var imageData = self.imageData;
    var canvasData = self.canvasData;
    var cropBoxData = {};
    var rotated = void 0;
    var scaled = void 0;
    var ratio = void 0;

    if (isFunction(data)) {
      data = data.call(self.element);
    }

    if (self.ready && !self.disabled && isPlainObject(data)) {
      if (options.rotatable) {
        if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
          imageData.rotate = data.rotate;
          self.rotated = rotated = true;
        }
      }

      if (options.scalable) {
        if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
          imageData.scaleX = data.scaleX;
          scaled = true;
        }

        if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
          imageData.scaleY = data.scaleY;
          scaled = true;
        }
      }

      if (rotated) {
        self.renderCanvas();
      } else if (scaled) {
        self.renderImage();
      }

      ratio = imageData.width / imageData.naturalWidth;

      if (isNumber(data.x)) {
        cropBoxData.left = data.x * ratio + canvasData.left;
      }

      if (isNumber(data.y)) {
        cropBoxData.top = data.y * ratio + canvasData.top;
      }

      if (isNumber(data.width)) {
        cropBoxData.width = data.width * ratio;
      }

      if (isNumber(data.height)) {
        cropBoxData.height = data.height * ratio;
      }

      self.setCropBoxData(cropBoxData);
    }

    return self;
  },


  /**
   * Get the container size data
   *
   * @return {Object} data
   */
  getContainerData: function getContainerData() {
    var self = this;

    return self.ready ? self.containerData : {};
  },


  /**
   * Get the image position and size data
   *
   * @return {Object} data
   */
  getImageData: function getImageData() {
    var self = this;

    return self.loaded ? self.imageData : {};
  },


  /**
   * Get the canvas position and size data
   *
   * @return {Object} data
   */
  getCanvasData: function getCanvasData() {
    var self = this;
    var canvasData = self.canvasData;
    var data = {};

    if (self.ready) {
      each(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
        data[n] = canvasData[n];
      });
    }

    return data;
  },


  /**
   * Set the canvas position and size with new data
   *
   * @param {Object} data
   */
  setCanvasData: function setCanvasData(data) {
    var self = this;
    var canvasData = self.canvasData;
    var aspectRatio = canvasData.aspectRatio;

    if (isFunction(data)) {
      data = data.call(self.element);
    }

    if (self.ready && !self.disabled && isPlainObject(data)) {
      if (isNumber(data.left)) {
        canvasData.left = data.left;
      }

      if (isNumber(data.top)) {
        canvasData.top = data.top;
      }

      if (isNumber(data.width)) {
        canvasData.width = data.width;
        canvasData.height = data.width / aspectRatio;
      } else if (isNumber(data.height)) {
        canvasData.height = data.height;
        canvasData.width = data.height * aspectRatio;
      }

      self.renderCanvas(true);
    }

    return self;
  },


  /**
   * Get the crop box position and size data
   *
   * @return {Object} data
   */
  getCropBoxData: function getCropBoxData() {
    var self = this;
    var cropBoxData = self.cropBoxData;
    var data = void 0;

    if (self.ready && self.cropped) {
      data = {
        left: cropBoxData.left,
        top: cropBoxData.top,
        width: cropBoxData.width,
        height: cropBoxData.height
      };
    }

    return data || {};
  },


  /**
   * Set the crop box position and size with new data
   *
   * @param {Object} data
   */
  setCropBoxData: function setCropBoxData(data) {
    var self = this;
    var cropBoxData = self.cropBoxData;
    var aspectRatio = self.options.aspectRatio;
    var widthChanged = void 0;
    var heightChanged = void 0;

    if (isFunction(data)) {
      data = data.call(self.element);
    }

    if (self.ready && self.cropped && !self.disabled && isPlainObject(data)) {
      if (isNumber(data.left)) {
        cropBoxData.left = data.left;
      }

      if (isNumber(data.top)) {
        cropBoxData.top = data.top;
      }

      if (isNumber(data.width) && data.width !== cropBoxData.width) {
        widthChanged = true;
        cropBoxData.width = data.width;
      }

      if (isNumber(data.height) && data.height !== cropBoxData.height) {
        heightChanged = true;
        cropBoxData.height = data.height;
      }

      if (aspectRatio) {
        if (widthChanged) {
          cropBoxData.height = cropBoxData.width / aspectRatio;
        } else if (heightChanged) {
          cropBoxData.width = cropBoxData.height * aspectRatio;
        }
      }

      self.renderCropBox();
    }

    return self;
  },


  /**
   * Get a canvas drawn the cropped image
   *
   * @param {Object} options (optional)
   * @return {HTMLCanvasElement} canvas
   */
  getCroppedCanvas: function getCroppedCanvas(options) {
    var self = this;

    if (!self.ready || !window.HTMLCanvasElement) {
      return null;
    }

    // Return the whole canvas if not cropped
    if (!self.cropped) {
      return getSourceCanvas(self.image, self.imageData);
    }

    if (!isPlainObject(options)) {
      options = {};
    }

    var data = self.getData();
    var originalWidth = data.width;
    var originalHeight = data.height;
    var aspectRatio = originalWidth / originalHeight;
    var scaledWidth = void 0;
    var scaledHeight = void 0;
    var scaledRatio = void 0;

    if (isPlainObject(options)) {
      scaledWidth = options.width;
      scaledHeight = options.height;

      if (scaledWidth) {
        scaledHeight = scaledWidth / aspectRatio;
        scaledRatio = scaledWidth / originalWidth;
      } else if (scaledHeight) {
        scaledWidth = scaledHeight * aspectRatio;
        scaledRatio = scaledHeight / originalHeight;
      }
    }

    // The canvas element will use `Math.floor` on a float number, so floor first
    var canvasWidth = Math.floor(scaledWidth || originalWidth);
    var canvasHeight = Math.floor(scaledHeight || originalHeight);

    var canvas = createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (options.fillColor) {
      context.fillStyle = options.fillColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
    var parameters = function () {
      var source = getSourceCanvas(self.image, self.imageData);
      var sourceWidth = source.width;
      var sourceHeight = source.height;
      var canvasData = self.canvasData;
      var params = [source];

      // Source canvas
      var srcX = data.x + canvasData.naturalWidth * (Math.abs(data.scaleX || 1) - 1) / 2;
      var srcY = data.y + canvasData.naturalHeight * (Math.abs(data.scaleY || 1) - 1) / 2;
      var srcWidth = void 0;
      var srcHeight = void 0;

      // Destination canvas
      var dstX = void 0;
      var dstY = void 0;
      var dstWidth = void 0;
      var dstHeight = void 0;

      if (srcX <= -originalWidth || srcX > sourceWidth) {
        srcX = srcWidth = dstX = dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        srcWidth = dstWidth = Math.min(sourceWidth, originalWidth + srcX);
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        srcWidth = dstWidth = Math.min(originalWidth, sourceWidth - srcX);
      }

      if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
        srcY = srcHeight = dstY = dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        srcHeight = dstHeight = Math.min(sourceHeight, originalHeight + srcY);
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        srcHeight = dstHeight = Math.min(originalHeight, sourceHeight - srcY);
      }

      params.push(Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight));

      // Scale destination sizes
      if (scaledRatio) {
        dstX *= scaledRatio;
        dstY *= scaledRatio;
        dstWidth *= scaledRatio;
        dstHeight *= scaledRatio;
      }

      // Avoid "IndexSizeError" in IE and Firefox
      if (dstWidth > 0 && dstHeight > 0) {
        params.push(Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
      }

      return params;
    }();

    context.drawImage.apply(context, toConsumableArray(parameters));

    return canvas;
  },


  /**
   * Change the aspect ratio of the crop box
   *
   * @param {Number} aspectRatio
   */
  setAspectRatio: function setAspectRatio(aspectRatio) {
    var self = this;
    var options = self.options;

    if (!self.disabled && !isUndefined(aspectRatio)) {
      // 0 -> NaN
      options.aspectRatio = Math.max(0, aspectRatio) || NaN;

      if (self.ready) {
        self.initCropBox();

        if (self.cropped) {
          self.renderCropBox();
        }
      }
    }

    return self;
  },


  /**
   * Change the drag mode
   *
   * @param {String} mode (optional)
   */
  setDragMode: function setDragMode(mode) {
    var self = this;
    var options = self.options;
    var dragBox = self.dragBox;
    var face = self.face;
    var croppable = void 0;
    var movable = void 0;

    if (self.loaded && !self.disabled) {
      croppable = mode === 'crop';
      movable = options.movable && mode === 'move';
      mode = croppable || movable ? mode : 'none';

      setData$1(dragBox, 'action', mode);
      toggleClass(dragBox, 'cropper-crop', croppable);
      toggleClass(dragBox, 'cropper-move', movable);

      if (!options.cropBoxMovable) {
        // Sync drag mode to crop box when it is not movable
        setData$1(face, 'action', mode);
        toggleClass(face, 'cropper-crop', croppable);
        toggleClass(face, 'cropper-move', movable);
      }
    }

    return self;
  }
};

// Constants
var NAMESPACE = 'cropper';

// Classes
var CLASS_HIDDEN = NAMESPACE + '-hidden';

// Events
var EVENT_ERROR = 'error';
var EVENT_LOAD = 'load';
var EVENT_READY = 'ready';
var EVENT_CROP = 'crop';

// RegExps
var REGEXP_DATA_URL = /^data:/;
var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;

var AnotherCropper = void 0;

var Cropper = function () {
  function Cropper(element, options) {
    classCallCheck(this, Cropper);

    var self = this;

    self.element = element;
    self.options = extend({}, DEFAULTS, isPlainObject(options) && options);
    self.loaded = false;
    self.ready = false;
    self.complete = false;
    self.rotated = false;
    self.cropped = false;
    self.disabled = false;
    self.replaced = false;
    self.limited = false;
    self.wheeling = false;
    self.isImg = false;
    self.originalUrl = '';
    self.canvasData = null;
    self.cropBoxData = null;
    self.previews = null;
    self.pointers = {};
    self.init();
  }

  createClass(Cropper, [{
    key: 'init',
    value: function init() {
      var self = this;
      var element = self.element;
      var tagName = element.tagName.toLowerCase();
      var url = void 0;

      if (getData$1(element, NAMESPACE)) {
        return;
      }

      setData$1(element, NAMESPACE, self);

      if (tagName === 'img') {
        self.isImg = true;

        // e.g.: "img/picture.jpg"
        self.originalUrl = url = element.getAttribute('src');

        // Stop when it's a blank image
        if (!url) {
          return;
        }

        // e.g.: "http://example.com/img/picture.jpg"
        url = element.src;
      } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
        url = element.toDataURL();
      }

      self.load(url);
    }
  }, {
    key: 'load',
    value: function load(url) {
      var self = this;
      var options = self.options;
      var element = self.element;

      if (!url) {
        return;
      }

      self.url = url;
      self.imageData = {};

      if (!options.checkOrientation || !window.ArrayBuffer) {
        self.clone();
        return;
      }

      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
      if (REGEXP_DATA_URL.test(url)) {
        if (REGEXP_DATA_URL_JPEG) {
          self.read(dataURLToArrayBuffer(url));
        } else {
          self.clone();
        }
        return;
      }

      var xhr = new XMLHttpRequest();

      xhr.onerror = xhr.onabort = function () {
        self.clone();
      };

      xhr.onload = function () {
        self.read(xhr.response);
      };

      if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
        url = addTimestamp(url);
      }

      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.withCredentials = element.crossOrigin === 'use-credentials';
      xhr.send();
    }
  }, {
    key: 'read',
    value: function read(arrayBuffer) {
      var self = this;
      var options = self.options;
      var orientation = getOrientation(arrayBuffer);
      var imageData = self.imageData;
      var rotate = 0;
      var scaleX = 1;
      var scaleY = 1;

      if (orientation > 1) {
        self.url = arrayBufferToDataURL(arrayBuffer);

        switch (orientation) {

          // flip horizontal
          case 2:
            scaleX = -1;
            break;

          // rotate left 180°
          case 3:
            rotate = -180;
            break;

          // flip vertical
          case 4:
            scaleY = -1;
            break;

          // flip vertical + rotate right 90°
          case 5:
            rotate = 90;
            scaleY = -1;
            break;

          // rotate right 90°
          case 6:
            rotate = 90;
            break;

          // flip horizontal + rotate right 90°
          case 7:
            rotate = 90;
            scaleX = -1;
            break;

          // rotate left 90°
          case 8:
            rotate = -90;
            break;
        }
      }

      if (options.rotatable) {
        imageData.rotate = rotate;
      }

      if (options.scalable) {
        imageData.scaleX = scaleX;
        imageData.scaleY = scaleY;
      }

      self.clone();
    }
  }, {
    key: 'clone',
    value: function clone() {
      var self = this;
      var element = self.element;
      var url = self.url;
      var crossOrigin = void 0;
      var crossOriginUrl = void 0;
      var start = void 0;
      var stop = void 0;

      if (self.options.checkCrossOrigin && isCrossOriginURL(url)) {
        crossOrigin = element.crossOrigin;

        if (crossOrigin) {
          crossOriginUrl = url;
        } else {
          crossOrigin = 'anonymous';

          // Bust cache when there is not a "crossOrigin" property
          crossOriginUrl = addTimestamp(url);
        }
      }

      self.crossOrigin = crossOrigin;
      self.crossOriginUrl = crossOriginUrl;

      var image = createElement('img');

      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }

      image.src = crossOriginUrl || url;
      self.image = image;
      self.onStart = start = proxy(self.start, self);
      self.onStop = stop = proxy(self.stop, self);

      if (self.isImg) {
        if (element.complete) {
          self.start();
        } else {
          addListener(element, EVENT_LOAD, start);
        }
      } else {
        addListener(image, EVENT_LOAD, start);
        addListener(image, EVENT_ERROR, stop);
        addClass(image, 'cropper-hide');
        element.parentNode.insertBefore(image, element.nextSibling);
      }
    }
  }, {
    key: 'start',
    value: function start(event) {
      var self = this;
      var image = self.isImg ? self.element : self.image;

      if (event) {
        removeListener(image, EVENT_LOAD, self.onStart);
        removeListener(image, EVENT_ERROR, self.onStop);
      }

      getImageSize(image, function (naturalWidth, naturalHeight) {
        extend(self.imageData, {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: naturalWidth / naturalHeight
        });

        self.loaded = true;
        self.build();
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var self = this;
      var image = self.image;

      removeListener(image, EVENT_LOAD, self.onStart);
      removeListener(image, EVENT_ERROR, self.onStop);

      removeChild(image);
      self.image = null;
    }
  }, {
    key: 'build',
    value: function build() {
      var self = this;
      var options = self.options;
      var element = self.element;
      var image = self.image;
      var container = void 0;
      var cropper = void 0;
      var canvas = void 0;
      var dragBox = void 0;
      var cropBox = void 0;
      var face = void 0;

      if (!self.loaded) {
        return;
      }

      // Unbuild first when replace
      if (self.ready) {
        self.unbuild();
      }

      var template = createElement('div');
      template.innerHTML = TEMPLATE;

      // Create cropper elements
      self.container = container = element.parentNode;
      self.cropper = cropper = getByClass(template, 'cropper-container')[0];
      self.canvas = canvas = getByClass(cropper, 'cropper-canvas')[0];
      self.dragBox = dragBox = getByClass(cropper, 'cropper-drag-box')[0];
      self.cropBox = cropBox = getByClass(cropper, 'cropper-crop-box')[0];
      self.viewBox = getByClass(cropper, 'cropper-view-box')[0];
      self.face = face = getByClass(cropBox, 'cropper-face')[0];

      appendChild(canvas, image);

      // Hide the original image
      addClass(element, CLASS_HIDDEN);

      // Inserts the cropper after to the current image
      container.insertBefore(cropper, element.nextSibling);

      // Show the image if is hidden
      if (!self.isImg) {
        removeClass(image, 'cropper-hide');
      }

      self.initPreview();
      self.bind();

      options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
      options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

      self.cropped = options.autoCrop;

      if (options.autoCrop) {
        if (options.modal) {
          addClass(dragBox, 'cropper-modal');
        }
      } else {
        addClass(cropBox, CLASS_HIDDEN);
      }

      if (!options.guides) {
        addClass(getByClass(cropBox, 'cropper-dashed'), CLASS_HIDDEN);
      }

      if (!options.center) {
        addClass(getByClass(cropBox, 'cropper-center'), CLASS_HIDDEN);
      }

      if (options.background) {
        addClass(cropper, 'cropper-bg');
      }

      if (!options.highlight) {
        addClass(face, 'cropper-invisible');
      }

      if (options.cropBoxMovable) {
        addClass(face, 'cropper-move');
        setData$1(face, 'action', 'all');
      }

      if (!options.cropBoxResizable) {
        addClass(getByClass(cropBox, 'cropper-line'), CLASS_HIDDEN);
        addClass(getByClass(cropBox, 'cropper-point'), CLASS_HIDDEN);
      }

      self.setDragMode(options.dragMode);
      self.render();
      self.ready = true;
      self.setData(options.data);

      // Call the "ready" option asynchronously to keep "image.cropper" is defined
      self.completing = setTimeout(function () {
        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, true);
        }

        dispatchEvent(element, EVENT_READY);
        dispatchEvent(element, EVENT_CROP, self.getData());

        self.complete = true;
      }, 0);
    }
  }, {
    key: 'unbuild',
    value: function unbuild() {
      var self = this;

      if (!self.ready) {
        return;
      }

      if (!self.complete) {
        clearTimeout(self.completing);
      }

      self.ready = false;
      self.complete = false;
      self.initialImageData = null;

      // Clear `initialCanvasData` is necessary when replace
      self.initialCanvasData = null;
      self.initialCropBoxData = null;
      self.containerData = null;
      self.canvasData = null;

      // Clear `cropBoxData` is necessary when replace
      self.cropBoxData = null;
      self.unbind();

      self.resetPreview();
      self.previews = null;

      self.viewBox = null;
      self.cropBox = null;
      self.dragBox = null;
      self.canvas = null;
      self.container = null;

      removeChild(self.cropper);
      self.cropper = null;
    }
  }], [{
    key: 'noConflict',
    value: function noConflict() {
      window.Cropper = AnotherCropper;
      return Cropper;
    }
  }, {
    key: 'setDefaults',
    value: function setDefaults(options) {
      extend(DEFAULTS, isPlainObject(options) && options);
    }
  }]);
  return Cropper;
}();

extend(Cropper.prototype, render$1);
extend(Cropper.prototype, preview$1);
extend(Cropper.prototype, events);
extend(Cropper.prototype, handlers);
extend(Cropper.prototype, change$1);
extend(Cropper.prototype, methods);

if (typeof window !== 'undefined') {
  AnotherCropper = window.Cropper;
  window.Cropper = Cropper;
}

return Cropper;

})));


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "/*!\n * Cropper.js v1.0.0-rc\n * https://github.com/fengyuanchen/cropperjs\n *\n * Copyright (c) 2017 Fengyuan Chen\n * Released under the MIT license\n *\n * Date: 2017-03-25T12:02:21.062Z\n */\n\n.cropper-container {\n  font-size: 0;\n  line-height: 0;\n\n  position: relative;\n\n  -webkit-user-select: none;\n\n     -moz-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n\n  direction: ltr;\n  -ms-touch-action: none;\n      touch-action: none\n}\n\n.cropper-container img {\n  /* Avoid margin top issue (Occur only when margin-top <= -height) */\n  display: block;\n  min-width: 0 !important;\n  max-width: none !important;\n  min-height: 0 !important;\n  max-height: none !important;\n  width: 100%;\n  height: 100%;\n  image-orientation: 0deg\n}\n\n.cropper-wrap-box,\n.cropper-canvas,\n.cropper-drag-box,\n.cropper-crop-box,\n.cropper-modal {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.cropper-wrap-box {\n  overflow: hidden;\n}\n\n.cropper-drag-box {\n  opacity: 0;\n  background-color: #fff;\n}\n\n.cropper-modal {\n  opacity: .5;\n  background-color: #000;\n}\n\n.cropper-view-box {\n  display: block;\n  overflow: hidden;\n\n  width: 100%;\n  height: 100%;\n\n  outline: 1px solid #39f;\n  outline-color: rgba(51, 153, 255, 0.75);\n}\n\n.cropper-dashed {\n  position: absolute;\n\n  display: block;\n\n  opacity: .5;\n  border: 0 dashed #eee\n}\n\n.cropper-dashed.dashed-h {\n  top: 33.33333%;\n  left: 0;\n  width: 100%;\n  height: 33.33333%;\n  border-top-width: 1px;\n  border-bottom-width: 1px\n}\n\n.cropper-dashed.dashed-v {\n  top: 0;\n  left: 33.33333%;\n  width: 33.33333%;\n  height: 100%;\n  border-right-width: 1px;\n  border-left-width: 1px\n}\n\n.cropper-center {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n\n  display: block;\n\n  width: 0;\n  height: 0;\n\n  opacity: .75\n}\n\n.cropper-center:before,\n  .cropper-center:after {\n  position: absolute;\n  display: block;\n  content: ' ';\n  background-color: #eee\n}\n\n.cropper-center:before {\n  top: 0;\n  left: -3px;\n  width: 7px;\n  height: 1px\n}\n\n.cropper-center:after {\n  top: -3px;\n  left: 0;\n  width: 1px;\n  height: 7px\n}\n\n.cropper-face,\n.cropper-line,\n.cropper-point {\n  position: absolute;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  opacity: .1;\n}\n\n.cropper-face {\n  top: 0;\n  left: 0;\n\n  background-color: #fff;\n}\n\n.cropper-line {\n  background-color: #39f\n}\n\n.cropper-line.line-e {\n  top: 0;\n  right: -3px;\n  width: 5px;\n  cursor: e-resize\n}\n\n.cropper-line.line-n {\n  top: -3px;\n  left: 0;\n  height: 5px;\n  cursor: n-resize\n}\n\n.cropper-line.line-w {\n  top: 0;\n  left: -3px;\n  width: 5px;\n  cursor: w-resize\n}\n\n.cropper-line.line-s {\n  bottom: -3px;\n  left: 0;\n  height: 5px;\n  cursor: s-resize\n}\n\n.cropper-point {\n  width: 5px;\n  height: 5px;\n\n  opacity: .75;\n  background-color: #39f\n}\n\n.cropper-point.point-e {\n  top: 50%;\n  right: -3px;\n  margin-top: -3px;\n  cursor: e-resize\n}\n\n.cropper-point.point-n {\n  top: -3px;\n  left: 50%;\n  margin-left: -3px;\n  cursor: n-resize\n}\n\n.cropper-point.point-w {\n  top: 50%;\n  left: -3px;\n  margin-top: -3px;\n  cursor: w-resize\n}\n\n.cropper-point.point-s {\n  bottom: -3px;\n  left: 50%;\n  margin-left: -3px;\n  cursor: s-resize\n}\n\n.cropper-point.point-ne {\n  top: -3px;\n  right: -3px;\n  cursor: ne-resize\n}\n\n.cropper-point.point-nw {\n  top: -3px;\n  left: -3px;\n  cursor: nw-resize\n}\n\n.cropper-point.point-sw {\n  bottom: -3px;\n  left: -3px;\n  cursor: sw-resize\n}\n\n.cropper-point.point-se {\n  right: -3px;\n  bottom: -3px;\n  width: 20px;\n  height: 20px;\n  cursor: se-resize;\n  opacity: 1\n}\n\n@media (min-width: 768px) {\n\n  .cropper-point.point-se {\n    width: 15px;\n    height: 15px\n  }\n}\n\n@media (min-width: 992px) {\n\n  .cropper-point.point-se {\n    width: 10px;\n    height: 10px\n  }\n}\n\n@media (min-width: 1200px) {\n\n  .cropper-point.point-se {\n    width: 5px;\n    height: 5px;\n    opacity: .75\n  }\n}\n\n.cropper-point.point-se:before {\n  position: absolute;\n  right: -50%;\n  bottom: -50%;\n  display: block;\n  width: 200%;\n  height: 200%;\n  content: ' ';\n  opacity: 0;\n  background-color: #39f\n}\n\n.cropper-invisible {\n  opacity: 0;\n}\n\n.cropper-bg {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');\n}\n\n.cropper-hide {\n  position: absolute;\n\n  display: block;\n\n  width: 0;\n  height: 0;\n}\n\n.cropper-hidden {\n  display: none !important;\n}\n\n.cropper-move {\n  cursor: move;\n}\n\n.cropper-crop {\n  cursor: crosshair;\n}\n\n.cropper-disabled .cropper-drag-box,\n.cropper-disabled .cropper-face,\n.cropper-disabled .cropper-line,\n.cropper-disabled .cropper-point {\n  cursor: not-allowed;\n}\n\n", ""]);

// exports


/***/ }),
/* 93 */,
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports
exports.i(__webpack_require__(92), "");

// module
exports.push([module.i, "@charset 'utf-8';\n* {\n  position: relative;\n  box-sizing: border-box;\n  background-clip: padding-box !important;\n}\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  overflow-wrap: break-word;\n}\ninput:not([type]),\ninput[type='text'],\ninput[type='password'],\ninput[type='email'],\ntextarea,\nbutton,\nprogress {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  box-shadow: none;\n}\nbutton {\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  color: inherit;\n}\nbutton * {\n  pointer-events: none;\n}\npre {\n  overflow: auto;\n  white-space: pre;\n}\n* {\n  tap-highlight-color: rgba(135,187,53,0.7);\n  -webkit-tap-highlight-color: rgba(135,187,53,0.7);\n}\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n  scroll-behavior: smooth;\n  text-size-adjust: 100%;\n  font-family: sans-serif;\n}\nhtml.progress,\nhtml.progress * {\n  cursor: progress !important;\n}\n#error {\n  position: fixed;\n  z-index: 32768;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #00f;\n  color: #fff;\n}\n#error > p {\n  text-align: center;\n}\n#nprogress {\n  pointer-events: none;\n  position: absolute;\n  z-index: 65536;\n/* Fancy blur effect */\n}\n#nprogress .bar {\n  background: #87bb35;\n  position: fixed;\n  z-index: 65537;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n}\n#nprogress .peg {\n  display: block;\n  position: absolute;\n  right: 0px;\n  width: 100px;\n  height: 100%;\n  box-shadow: 0 0 10px #87bb35, 0 0 5px #87bb35;\n  opacity: 1;\n  transform: rotate(3deg) translate(0px, -4px);\n}\n#wait {\n  display: block;\n  position: fixed;\n  z-index: 65537;\n  top: 15px;\n  right: 15px;\n}\n#wait:before {\n  content: \"\";\n  display: block;\n  width: 18px;\n  height: 18px;\n  box-sizing: border-box;\n  border: solid 2px transparent;\n  border-top-color: #87bb35;\n  border-left-color: #87bb35;\n  border-radius: 50%;\n  animation: progress-spinner 400ms linear infinite;\n}\n@-moz-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@-webkit-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@-o-keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes progress-spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\na {\n  text-decoration: none;\n  color: #87bb35;\n  cursor: pointer;\n}\na:hover {\n  text-decoration: underline;\n}\na * {\n  cursor: pointer;\n}\ncode {\n  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;\n}\ncode .comment {\n  opacity: 0.5;\n}\ncode .string {\n  color: #e96900;\n}\ncode .regexp {\n  color: #e9003f;\n}\ncode .keyword {\n  color: #2973b7;\n}\ncode .keyword.true,\ncode .keyword.false,\ncode .keyword.null,\ncode .keyword.nil,\ncode .keyword.undefined {\n  color: #ae81ff;\n}\ncode .symbol {\n  color: #42b983;\n}\ncode .number,\ncode .nan {\n  color: #ae81ff;\n}\ncode .var:not(.keyword) {\n  font-weight: bold;\n  font-style: italic;\n}\ncode .method {\n  font-style: italic;\n  color: #8964c1;\n}\ncode .property {\n  color: #a71d5d;\n}\ncode .label {\n  color: #e9003f;\n}\npre {\n  display: block;\n}\npre > code {\n  display: block;\n  overflow: auto;\n  tab-size: 2;\n}\nmk-locker {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 65536;\n  width: 100%;\n  height: 100%;\n  cursor: wait;\n}\n*::input-placeholder {\n  color: #d8cbc5;\n}\n*:focus {\n  outline: none;\n}\n*::scrollbar {\n  width: 5px;\n  background: transparent;\n}\n*::scrollbar:horizontal {\n  height: 5px;\n}\n*::scrollbar-button {\n  width: 0;\n  height: 0;\n  background: rgba(0,0,0,0.2);\n}\n*::scrollbar-piece {\n  background: transparent;\n}\n*::scrollbar-piece:start {\n  background: transparent;\n}\n*::scrollbar-thumb {\n  background: rgba(0,0,0,0.2);\n}\n*::scrollbar-thumb:hover {\n  background: rgba(0,0,0,0.4);\n}\n*::scrollbar-thumb:active {\n  background: #87bb35;\n}\n*::scrollbar-corner {\n  background: rgba(0,0,0,0.2);\n}\nhtml {\n  background: #fdfdfd;\n}\nhtml[data-page='entrance'] #wait {\n  right: auto;\n  left: 15px;\n}\nhtml[theme='dark'] {\n  background: #100f0f;\n}\nbutton {\n  font-family: sans-serif;\n}\nbutton * {\n  pointer-events: none;\n}\nbutton.style-normal,\nbutton.style-primary {\n  display: block;\n  cursor: pointer;\n  padding: 0 16px;\n  margin: 0;\n  min-width: 100px;\n  height: 40px;\n  font-size: 1em;\n  outline: none;\n  border-radius: 4px;\n}\nbutton.style-normal:focus:after,\nbutton.style-primary:focus:after {\n  content: \"\";\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  right: -5px;\n  bottom: -5px;\n  left: -5px;\n  border: 2px solid rgba(135,187,53,0.3);\n  border-radius: 8px;\n}\nbutton.style-normal:disabled,\nbutton.style-primary:disabled {\n  opacity: 0.7;\n  cursor: default;\n}\nbutton.style-normal {\n  color: #888;\n  background: linear-gradient(to bottom, #fff 0%, #f5f5f5 100%);\n  border: solid 1px #e2e2e2;\n}\nbutton.style-normal:hover {\n  background: linear-gradient(to bottom, #f9f9f9 0%, #ececec 100%);\n  border-color: #dcdcdc;\n}\nbutton.style-normal:active {\n  background: #ececec;\n  border-color: #dcdcdc;\n}\nbutton.style-primary {\n  color: #fff;\n  background: linear-gradient(to bottom, #a6d261 0%, #95c942 100%);\n  border: solid 1px #9bcc4c;\n}\nbutton.style-primary:not(:disabled) {\n  font-weight: bold;\n}\nbutton.style-primary:hover:not(:disabled) {\n  background: linear-gradient(to bottom, #92c83d 0%, #7cac31 100%);\n  border-color: #87bb35;\n}\nbutton.style-primary:active:not(:disabled) {\n  background: #87bb35;\n  border-color: #87bb35;\n}\n", ""]);

// exports


/***/ }),
/* 95 */,
/* 96 */,
/* 97 */
/***/ (function(module, exports) {

/*
 * FuckAdBlock 3.2.1
 * Copyright (c) 2015 Valentin Allaire <valentin.allaire@sitexw.fr>
 * Released under the MIT license
 * https://github.com/sitexw/FuckAdBlock
 */

(function(window) {
	var FuckAdBlock = function(options) {
		this._options = {
			checkOnLoad:		false,
			resetOnEnd:			false,
			loopCheckTime:		50,
			loopMaxNumber:		5,
			baitClass:			'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:			'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;',
			debug:				false
		};
		this._var = {
			version:			'3.2.1',
			bait:				null,
			checking:			false,
			loop:				null,
			loopNumber:			0,
			event:				{ detected: [], notDetected: [] }
		};
		if(options !== undefined) {
			this.setOption(options);
		}
		var self = this;
		var eventCallback = function() {
			setTimeout(function() {
				if(self._options.checkOnLoad === true) {
					if(self._options.debug === true) {
						self._log('onload->eventCallback', 'A check loading is launched');
					}
					if(self._var.bait === null) {
						self._creatBait();
					}
					setTimeout(function() {
						self.check();
					}, 1);
				}
			}, 1);
		};
		if(window.addEventListener !== undefined) {
			window.addEventListener('load', eventCallback, false);
		} else {
			window.attachEvent('onload', eventCallback);
		}
	};
	FuckAdBlock.prototype._options = null;
	FuckAdBlock.prototype._var = null;
	FuckAdBlock.prototype._bait = null;
	
	FuckAdBlock.prototype._log = function(method, message) {
		console.log('[FuckAdBlock]['+method+'] '+message);
	};
	
	FuckAdBlock.prototype.setOption = function(options, value) {
		if(value !== undefined) {
			var key = options;
			options = {};
			options[key] = value;
		}
		for(var option in options) {
			this._options[option] = options[option];
			if(this._options.debug === true) {
				this._log('setOption', 'The option "'+option+'" he was assigned to "'+options[option]+'"');
			}
		}
		return this;
	};
	
	FuckAdBlock.prototype._creatBait = function() {
		var bait = document.createElement('div');
			bait.setAttribute('class', this._options.baitClass);
			bait.setAttribute('style', this._options.baitStyle);
		this._var.bait = window.document.body.appendChild(bait);
		
		this._var.bait.offsetParent;
		this._var.bait.offsetHeight;
		this._var.bait.offsetLeft;
		this._var.bait.offsetTop;
		this._var.bait.offsetWidth;
		this._var.bait.clientHeight;
		this._var.bait.clientWidth;
		
		if(this._options.debug === true) {
			this._log('_creatBait', 'Bait has been created');
		}
	};
	FuckAdBlock.prototype._destroyBait = function() {
		window.document.body.removeChild(this._var.bait);
		this._var.bait = null;
		
		if(this._options.debug === true) {
			this._log('_destroyBait', 'Bait has been removed');
		}
	};
	
	FuckAdBlock.prototype.check = function(loop) {
		if(loop === undefined) {
			loop = true;
		}
		
		if(this._options.debug === true) {
			this._log('check', 'An audit was requested '+(loop===true?'with a':'without')+' loop');
		}
		
		if(this._var.checking === true) {
			if(this._options.debug === true) {
				this._log('check', 'A check was canceled because there is already an ongoing');
			}
			return false;
		}
		this._var.checking = true;
		
		if(this._var.bait === null) {
			this._creatBait();
		}
		
		var self = this;
		this._var.loopNumber = 0;
		if(loop === true) {
			this._var.loop = setInterval(function() {
				self._checkBait(loop);
			}, this._options.loopCheckTime);
		}
		setTimeout(function() {
			self._checkBait(loop);
		}, 1);
		if(this._options.debug === true) {
			this._log('check', 'A check is in progress ...');
		}
		
		return true;
	};
	FuckAdBlock.prototype._checkBait = function(loop) {
		var detected = false;
		
		if(this._var.bait === null) {
			this._creatBait();
		}
		
		if(window.document.body.getAttribute('abp') !== null
		|| this._var.bait.offsetParent === null
		|| this._var.bait.offsetHeight == 0
		|| this._var.bait.offsetLeft == 0
		|| this._var.bait.offsetTop == 0
		|| this._var.bait.offsetWidth == 0
		|| this._var.bait.clientHeight == 0
		|| this._var.bait.clientWidth == 0) {
			detected = true;
		}
		if(window.getComputedStyle !== undefined) {
			var baitTemp = window.getComputedStyle(this._var.bait, null);
			if(baitTemp && (baitTemp.getPropertyValue('display') == 'none' || baitTemp.getPropertyValue('visibility') == 'hidden')) {
				detected = true;
			}
		}
		
		if(this._options.debug === true) {
			this._log('_checkBait', 'A check ('+(this._var.loopNumber+1)+'/'+this._options.loopMaxNumber+' ~'+(1+this._var.loopNumber*this._options.loopCheckTime)+'ms) was conducted and detection is '+(detected===true?'positive':'negative'));
		}
		
		if(loop === true) {
			this._var.loopNumber++;
			if(this._var.loopNumber >= this._options.loopMaxNumber) {
				this._stopLoop();
			}
		}
		
		if(detected === true) {
			this._stopLoop();
			this._destroyBait();
			this.emitEvent(true);
			if(loop === true) {
				this._var.checking = false;
			}
		} else if(this._var.loop === null || loop === false) {
			this._destroyBait();
			this.emitEvent(false);
			if(loop === true) {
				this._var.checking = false;
			}
		}
	};
	FuckAdBlock.prototype._stopLoop = function(detected) {
		clearInterval(this._var.loop);
		this._var.loop = null;
		this._var.loopNumber = 0;
		
		if(this._options.debug === true) {
			this._log('_stopLoop', 'A loop has been stopped');
		}
	};
	
	FuckAdBlock.prototype.emitEvent = function(detected) {
		if(this._options.debug === true) {
			this._log('emitEvent', 'An event with a '+(detected===true?'positive':'negative')+' detection was called');
		}
		
		var fns = this._var.event[(detected===true?'detected':'notDetected')];
		for(var i in fns) {
			if(this._options.debug === true) {
				this._log('emitEvent', 'Call function '+(parseInt(i)+1)+'/'+fns.length);
			}
			if(fns.hasOwnProperty(i)) {
				fns[i]();
			}
		}
		if(this._options.resetOnEnd === true) {
			this.clearEvent();
		}
		return this;
	};
	FuckAdBlock.prototype.clearEvent = function() {
		this._var.event.detected = [];
		this._var.event.notDetected = [];
		
		if(this._options.debug === true) {
			this._log('clearEvent', 'The event list has been cleared');
		}
	};
	
	FuckAdBlock.prototype.on = function(detected, fn) {
		this._var.event[(detected===true?'detected':'notDetected')].push(fn);
		if(this._options.debug === true) {
			this._log('on', 'A type of event "'+(detected===true?'detected':'notDetected')+'" was added');
		}
		
		return this;
	};
	FuckAdBlock.prototype.onDetected = function(fn) {
		return this.on(true, fn);
	};
	FuckAdBlock.prototype.onNotDetected = function(fn) {
		return this.on(false, fn);
	};
	
	window.FuckAdBlock = FuckAdBlock;
	
	if(window.fuckAdBlock === undefined) {
		window.fuckAdBlock = new FuckAdBlock({
			checkOnLoad: true,
			resetOnEnd: true
		});
	}
})(window);


/***/ }),
/* 98 */,
/* 99 */,
/* 100 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-analog-clock', '<canvas ref="canvas" width="256" height="256"></canvas>', 'mk-analog-clock > canvas,[data-is="mk-analog-clock"] > canvas{display:block;width:256px;height:256px}', '', function(opts) {
		const Vec2 = function(x, y) {
			this.x = x;
			this.y = y;
		};

		this.on('mount', () => {
			this.draw()
			this.clock = setInterval(this.draw, 1000);
		});

		this.on('unmount', () => {
			clearInterval(this.clock);
		});

		this.draw = () => {
			const now = new Date();
			const s = now.getSeconds();
			const m = now.getMinutes();
			const h = now.getHours();

			const ctx = this.refs.canvas.getContext('2d');
			const canvW = this.refs.canvas.width;
			const canvH = this.refs.canvas.height;
			ctx.clearRect(0, 0, canvW, canvH);

			{
				const center = Math.min((canvW / 2), (canvH / 2));
				const lineStart =    center * 0.90;
				const shortLineEnd = center * 0.87;
				const longLineEnd =  center * 0.84;
				for (let i = 0; i < 60; i++) {
					const angle = Math.PI * i / 30;
					const uv = new Vec2(Math.sin(angle), -Math.cos(angle));
					ctx.beginPath();
					ctx.lineWidth = 1;
					ctx.moveTo((canvW / 2) + uv.x * lineStart, (canvH / 2) + uv.y * lineStart);
					if (i % 5 == 0) {
						ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
						ctx.lineTo((canvW / 2) + uv.x * longLineEnd, (canvH / 2) + uv.y * longLineEnd);
					} else {
						ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
						ctx.lineTo((canvW / 2) + uv.x * shortLineEnd, (canvH / 2) + uv.y * shortLineEnd);
					}
					ctx.stroke();
				}
			}

			{
				const angle = Math.PI * (m + s / 60) / 30;
				const length = Math.min(canvW, canvH) / 2.6;
				const uv = new Vec2(Math.sin(angle), -Math.cos(angle));
				ctx.beginPath();
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 2;
				ctx.moveTo(canvW / 2 - uv.x * length / 5, canvH / 2 - uv.y * length / 5);
				ctx.lineTo(canvW / 2 + uv.x * length,     canvH / 2 + uv.y * length);
				ctx.stroke();
			}

			{
				const angle = Math.PI * (h % 12 + m / 60) / 6;
				const length = Math.min(canvW, canvH) / 4;
				const uv = new Vec2(Math.sin(angle), -Math.cos(angle));
				ctx.beginPath();
				ctx.strokeStyle = "#87bb35";
				ctx.lineWidth = 2;
				ctx.moveTo(canvW / 2 - uv.x * length / 5, canvH / 2 - uv.y * length / 5);
				ctx.lineTo(canvW / 2 + uv.x * length,     canvH / 2 + uv.y * length);
				ctx.stroke();
			}

			{
				const angle = Math.PI * s / 30;
				const length = Math.min(canvW, canvH) / 2.6;
				const uv = new Vec2(Math.sin(angle), -Math.cos(angle));
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.lineWidth = 1;
				ctx.moveTo(canvW / 2 - uv.x * length / 5, canvH / 2 - uv.y * length / 5);
				ctx.lineTo(canvW / 2 + uv.x * length,     canvH / 2 + uv.y * length);
				ctx.stroke();
			}
		};
});

    
  

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__ = __webpack_require__(62);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-autocomplete-suggestion', '<ol class="users" ref="users" if="{users.length > 0}"><li each="{users}" onclick="{parent.onClick}" onkeydown="{parent.onKeydown}" tabindex="-1"><img class="avatar" riot-src="{avatar_url + \'?thumbnail&size=32\'}" alt=""><span class="name">{name}</span><span class="username">@{username}</span></li></ol>', 'mk-autocomplete-suggestion,[data-is="mk-autocomplete-suggestion"]{display:block;position:absolute;z-index:65535;margin-top:calc(1em + 8px);overflow:hidden;background:#fff;border:solid 1px rgba(0,0,0,0.1);border-radius:4px;} mk-autocomplete-suggestion > .users,[data-is="mk-autocomplete-suggestion"] > .users{display:block;margin:0;padding:4px 0;max-height:190px;max-width:500px;overflow:auto;list-style:none;} mk-autocomplete-suggestion > .users > li,[data-is="mk-autocomplete-suggestion"] > .users > li{display:block;padding:4px 12px;white-space:nowrap;overflow:hidden;font-size:.9em;color:rgba(0,0,0,0.8);cursor:default;} mk-autocomplete-suggestion > .users > li,[data-is="mk-autocomplete-suggestion"] > .users > li,mk-autocomplete-suggestion > .users > li *,[data-is="mk-autocomplete-suggestion"] > .users > li *{user-select:none} mk-autocomplete-suggestion > .users > li:hover,[data-is="mk-autocomplete-suggestion"] > .users > li:hover,mk-autocomplete-suggestion > .users > li[data-selected=\'true\'],[data-is="mk-autocomplete-suggestion"] > .users > li[data-selected=\'true\']{color:#fff;background:#87bb35;} mk-autocomplete-suggestion > .users > li:hover .name,[data-is="mk-autocomplete-suggestion"] > .users > li:hover .name,mk-autocomplete-suggestion > .users > li[data-selected=\'true\'] .name,[data-is="mk-autocomplete-suggestion"] > .users > li[data-selected=\'true\'] .name{color:#fff} mk-autocomplete-suggestion > .users > li:hover .username,[data-is="mk-autocomplete-suggestion"] > .users > li:hover .username,mk-autocomplete-suggestion > .users > li[data-selected=\'true\'] .username,[data-is="mk-autocomplete-suggestion"] > .users > li[data-selected=\'true\'] .username{color:#fff} mk-autocomplete-suggestion > .users > li:active,[data-is="mk-autocomplete-suggestion"] > .users > li:active{color:#fff;background:#7aa830;} mk-autocomplete-suggestion > .users > li:active .name,[data-is="mk-autocomplete-suggestion"] > .users > li:active .name{color:#fff} mk-autocomplete-suggestion > .users > li:active .username,[data-is="mk-autocomplete-suggestion"] > .users > li:active .username{color:#fff} mk-autocomplete-suggestion > .users > li .avatar,[data-is="mk-autocomplete-suggestion"] > .users > li .avatar{vertical-align:middle;min-width:28px;min-height:28px;max-width:28px;max-height:28px;margin:0 8px 0 0;border-radius:100%} mk-autocomplete-suggestion > .users > li .name,[data-is="mk-autocomplete-suggestion"] > .users > li .name{margin:0 8px 0 0;font-weight:normal;color:rgba(0,0,0,0.8)} mk-autocomplete-suggestion > .users > li .username,[data-is="mk-autocomplete-suggestion"] > .users > li .username{font-weight:normal;color:rgba(0,0,0,0.3)}', '', function(opts) {

		this.mixin('api');

		this.q = this.opts.q;
		this.textarea = this.opts.textarea;
		this.fetching = true;
		this.users = [];
		this.select = -1;

		this.on('mount', () => {
			this.textarea.addEventListener('keydown', this.onKeydown);

			document.querySelectorAll('body *').forEach(el => {
				el.addEventListener('mousedown', this.mousedown);
			});

			this.api('users/search_by_username', {
				query: this.q,
				limit: 30
			}).then(users => {
				this.update({
					fetching: false,
					users: users
				});
			});
		});

		this.on('unmount', () => {
			this.textarea.removeEventListener('keydown', this.onKeydown);

			document.querySelectorAll('body *').forEach(el => {
				el.removeEventListener('mousedown', this.mousedown);
			});
		});

		this.mousedown = e => {
			if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__["a" /* default */])(this.root, e.target) && (this.root != e.target)) this.close();
		};

		this.onClick = e => {
			this.complete(e.item);
		};

		this.onKeydown = e => {
			const cancel = () => {
				e.preventDefault();
				e.stopPropagation();
			};

			switch (e.which) {
				case 10:
				case 13:
					if (this.select !== -1) {
						cancel();
						this.complete(this.users[this.select]);
					} else {
						this.close();
					}
					break;

				case 27:
					cancel();
					this.close();
					break;

				case 38:
					if (this.select !== -1) {
						cancel();
						this.selectPrev();
					} else {
						this.close();
					}
					break;

				case 9:
				case 40:
					cancel();
					this.selectNext();
					break;

				default:
					this.close();
			}
		};

		this.selectNext = () => {
			if (++this.select >= this.users.length) this.select = 0;
			this.applySelect();
		};

		this.selectPrev = () => {
			if (--this.select < 0) this.select = this.users.length - 1;
			this.applySelect();
		};

		this.applySelect = () => {
			this.refs.users.children.forEach(el => {
				el.removeAttribute('data-selected');
			});

			this.refs.users.children[this.select].setAttribute('data-selected', 'true');
			this.refs.users.children[this.select].focus();
		};

		this.complete = user => {
			this.opts.complete(user);
		};

		this.close = () => {
			this.opts.close();
		};

});

    
  

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__ = __webpack_require__(63);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-big-follow-button', '<button class="{wait: wait, follow: !user.is_following, unfollow: user.is_following}" if="{!init}" onclick="{onclick}" disabled="{wait}" title="{user.is_following ? \'フォロー解除\' : \'フォローする\'}"><span if="{!wait && user.is_following}"><i class="fa fa-minus"></i>フォロー解除</span><span if="{!wait && !user.is_following}"><i class="fa fa-plus"></i>フォロー</span><i class="fa fa-spinner fa-pulse fa-fw" if="{wait}"></i></button><div class="init" if="{init}"><i class="fa fa-spinner fa-pulse fa-fw"></i></div>', 'mk-big-follow-button,[data-is="mk-big-follow-button"]{display:block;} mk-big-follow-button > button,[data-is="mk-big-follow-button"] > button,mk-big-follow-button > .init,[data-is="mk-big-follow-button"] > .init{display:block;cursor:pointer;padding:0;margin:0;width:100%;line-height:38px;font-size:1em;outline:none;border-radius:4px;} mk-big-follow-button > button *,[data-is="mk-big-follow-button"] > button *,mk-big-follow-button > .init *,[data-is="mk-big-follow-button"] > .init *{pointer-events:none} mk-big-follow-button > button i,[data-is="mk-big-follow-button"] > button i,mk-big-follow-button > .init i,[data-is="mk-big-follow-button"] > .init i{margin-right:8px} mk-big-follow-button > button:focus:after,[data-is="mk-big-follow-button"] > button:focus:after,mk-big-follow-button > .init:focus:after,[data-is="mk-big-follow-button"] > .init:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-big-follow-button > button.follow,[data-is="mk-big-follow-button"] > button.follow,mk-big-follow-button > .init.follow,[data-is="mk-big-follow-button"] > .init.follow{color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-big-follow-button > button.follow:hover,[data-is="mk-big-follow-button"] > button.follow:hover,mk-big-follow-button > .init.follow:hover,[data-is="mk-big-follow-button"] > .init.follow:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-big-follow-button > button.follow:active,[data-is="mk-big-follow-button"] > button.follow:active,mk-big-follow-button > .init.follow:active,[data-is="mk-big-follow-button"] > .init.follow:active{background:#ececec;border-color:#dcdcdc} mk-big-follow-button > button.unfollow,[data-is="mk-big-follow-button"] > button.unfollow,mk-big-follow-button > .init.unfollow,[data-is="mk-big-follow-button"] > .init.unfollow{color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-big-follow-button > button.unfollow:not(:disabled),[data-is="mk-big-follow-button"] > button.unfollow:not(:disabled),mk-big-follow-button > .init.unfollow:not(:disabled),[data-is="mk-big-follow-button"] > .init.unfollow:not(:disabled){font-weight:bold} mk-big-follow-button > button.unfollow:hover:not(:disabled),[data-is="mk-big-follow-button"] > button.unfollow:hover:not(:disabled),mk-big-follow-button > .init.unfollow:hover:not(:disabled),[data-is="mk-big-follow-button"] > .init.unfollow:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-big-follow-button > button.unfollow:active:not(:disabled),[data-is="mk-big-follow-button"] > button.unfollow:active:not(:disabled),mk-big-follow-button > .init.unfollow:active:not(:disabled),[data-is="mk-big-follow-button"] > .init.unfollow:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-big-follow-button > button.wait,[data-is="mk-big-follow-button"] > button.wait,mk-big-follow-button > .init.wait,[data-is="mk-big-follow-button"] > .init.wait{cursor:wait !important;opacity:.7}', '', function(opts) {

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
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_contains__ = __webpack_require__(62);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-contextmenu', '<yield></yield>', 'mk-contextmenu,[data-is="mk-contextmenu"]{display:none;position:fixed;top:0;left:0;z-index:4096;width:240px;font-size:.8em;background:#fff;border-radius:0 4px 4px 4px;box-shadow:2px 2px 8px rgba(0,0,0,0.2);opacity:0;} mk-contextmenu ul,[data-is="mk-contextmenu"] ul{display:block;margin:0;padding:10px 0;list-style:none} mk-contextmenu li,[data-is="mk-contextmenu"] li{display:block;} mk-contextmenu li.separator,[data-is="mk-contextmenu"] li.separator{margin-top:10px;padding-top:10px;border-top:solid 1px #eee} mk-contextmenu li.has-child > p,[data-is="mk-contextmenu"] li.has-child > p{cursor:default;} mk-contextmenu li.has-child > p > i:last-child,[data-is="mk-contextmenu"] li.has-child > p > i:last-child{position:absolute;top:0;right:8px;line-height:38px} mk-contextmenu li.has-child:hover > ul,[data-is="mk-contextmenu"] li.has-child:hover > ul{visibility:visible} mk-contextmenu li.has-child:active > p,[data-is="mk-contextmenu"] li.has-child:active > p,mk-contextmenu li.has-child:active a,[data-is="mk-contextmenu"] li.has-child:active a{background:#87bb35} mk-contextmenu li > p,[data-is="mk-contextmenu"] li > p,mk-contextmenu li a,[data-is="mk-contextmenu"] li a{display:block;z-index:1;margin:0;padding:0 32px 0 38px;line-height:38px;color:#868c8c;text-decoration:none;cursor:pointer;} mk-contextmenu li > p:hover,[data-is="mk-contextmenu"] li > p:hover,mk-contextmenu li a:hover,[data-is="mk-contextmenu"] li a:hover{text-decoration:none} mk-contextmenu li > p *,[data-is="mk-contextmenu"] li > p *,mk-contextmenu li a *,[data-is="mk-contextmenu"] li a *{pointer-events:none} mk-contextmenu li > p > i,[data-is="mk-contextmenu"] li > p > i,mk-contextmenu li a > i,[data-is="mk-contextmenu"] li a > i{width:28px;margin-left:-28px;text-align:center} mk-contextmenu li:hover > p,[data-is="mk-contextmenu"] li:hover > p,mk-contextmenu li:hover a,[data-is="mk-contextmenu"] li:hover a{text-decoration:none;background:#87bb35;color:#fff} mk-contextmenu li:active > p,[data-is="mk-contextmenu"] li:active > p,mk-contextmenu li:active a,[data-is="mk-contextmenu"] li:active a{text-decoration:none;background:#7aa830;color:#fff} mk-contextmenu li > ul,[data-is="mk-contextmenu"] li > ul{visibility:hidden;position:absolute;top:0;left:240px;margin-top:-10px;width:240px;background:#fff;border-radius:0 4px 4px 4px;box-shadow:2px 2px 8px rgba(0,0,0,0.2);transition:visibility 0s linear .2s}', '', function(opts) {

		this.root.addEventListener('contextmenu', e => {
			e.preventDefault();
		});

		this.mousedown = e => {
			e.preventDefault();
			if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_contains__["a" /* default */])(this.root, e.target) && (this.root != e.target)) this.close();
			return false;
		};

		this.open = pos => {
			document.querySelectorAll('body *').forEach(el => {
				el.addEventListener('mousedown', this.mousedown);
			});

			this.root.style.display = 'block';
			this.root.style.left = pos.x + 'px';
			this.root.style.top = pos.y + 'px';

			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: [0, 1],
				duration: 100,
				easing: 'linear'
			});
		};

		this.close = () => {
			document.querySelectorAll('body *').forEach(el => {
				el.removeEventListener('mousedown', this.mousedown);
			});

			this.trigger('closed');
			this.unmount();
		};
});

    
  

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-crop-window', '<mk-window ref="window" is-modal="{true}" width="{\'800px\'}"><yield to="header"><i class="fa fa-crop"></i>{parent.title}</yield><yield to="content"><div class="body"><img ref="img" riot-src="{parent.image.url + \'?thumbnail&quality=80\'}" alt=""></div><div class="action"><button class="skip" onclick="{parent.skip}">クロップをスキップ</button><button class="cancel" onclick="{parent.cancel}">キャンセル</button><button class="ok" onclick="{parent.ok}">決定</button></div></yield></mk-window>', 'mk-crop-window,[data-is="mk-crop-window"]{display:block;} mk-crop-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-crop-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-crop-window > mk-window [data-yield=\'content\'] > .body > img,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .body > img{width:100%;max-height:400px} mk-crop-window > mk-window [data-yield=\'content\'] .cropper-modal,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] .cropper-modal{opacity:.8} mk-crop-window > mk-window [data-yield=\'content\'] .cropper-view-box,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] .cropper-view-box{outline-color:#87bb35} mk-crop-window > mk-window [data-yield=\'content\'] .cropper-line,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] .cropper-line,mk-crop-window > mk-window [data-yield=\'content\'] .cropper-point,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] .cropper-point{background-color:#87bb35} mk-crop-window > mk-window [data-yield=\'content\'] .cropper-bg,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] .cropper-bg{animation:cropper-bg .5s linear infinite}@-webkit-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}@-moz-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}@-ms-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}} mk-crop-window > mk-window [data-yield=\'content\'] > .action,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action{height:72px;background:#f9fcf4;} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok,mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip{display:block;position:absolute;bottom:16px;cursor:pointer;padding:0;margin:0;height:40px;font-size:1em;outline:none;border-radius:4px;} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok:focus:after,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok:focus:after,mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel:focus:after,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel:focus:after,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip:focus:after,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok:disabled,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok:disabled,mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel:disabled,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel:disabled,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip:disabled,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip:disabled{opacity:.7;cursor:default} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok,mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel{width:120px} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok{right:16px;color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok:not(:disabled),[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok:not(:disabled){font-weight:bold} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok:hover:not(:disabled),[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-crop-window > mk-window [data-yield=\'content\'] > .action .ok:active:not(:disabled),[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .ok:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip{color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel:hover,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel:hover,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip:hover,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel:active,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel:active,mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip:active,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip:active{background:#ececec;border-color:#dcdcdc} mk-crop-window > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .cancel{right:148px} mk-crop-window > mk-window [data-yield=\'content\'] > .action .skip,[data-is="mk-crop-window"] > mk-window [data-yield=\'content\'] > .action .skip{left:16px;width:150px}@-moz-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}@-webkit-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}@-o-keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}@keyframes cropper-bg{ 0%{background-position:0 0} 100%{background-position:-8px -8px}}', '', function(opts) {
		const Cropper = __webpack_require__(91);

		this.image = this.opts.file;
		this.title = this.opts.title;
		this.aspectRatio = this.opts.aspectRatio;
		this.cropper = null;

		this.on('mount', () => {
			this.img = this.refs.window.refs.img;
			this.cropper = new Cropper(this.img, {
				aspectRatio: this.aspectRatio,
				highlight: false,
				viewMode: 1
			});
		});

		this.ok = () => {
			this.cropper.getCroppedCanvas().toBlob(blob => {
				this.trigger('cropped', blob);
				this.refs.window.close();
			});
		};

		this.skip = () => {
			this.trigger('skipped');
			this.refs.window.close();
		};

		this.cancel = () => {
			this.trigger('canceled');
			this.refs.window.close();
		};
});

    
  

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-dialog', '<div class="bg" ref="bg" onclick="{bgClick}"></div><div class="main" ref="main"><header ref="header"></header><div class="body" ref="body"></div><div class="buttons"><virtual each="{opts.buttons}"><button onclick="{_onclick}">{text}</button></virtual></div></div>', 'mk-dialog,[data-is="mk-dialog"]{display:block;} mk-dialog > .bg,[data-is="mk-dialog"] > .bg{display:block;position:fixed;z-index:8192;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);opacity:0;pointer-events:none} mk-dialog > .main,[data-is="mk-dialog"] > .main{display:block;position:fixed;z-index:8192;top:20%;left:0;right:0;margin:0 auto 0 auto;padding:32px 42px;width:480px;background:#fff;opacity:0;} mk-dialog > .main > header,[data-is="mk-dialog"] > .main > header{margin:1em 0;color:#87bb35;font-weight:bold;} mk-dialog > .main > header > i,[data-is="mk-dialog"] > .main > header > i{margin-right:.5em} mk-dialog > .main > .body,[data-is="mk-dialog"] > .main > .body{margin:1em 0;color:#888} mk-dialog > .main > .buttons > button,[data-is="mk-dialog"] > .main > .buttons > button{display:inline-block;float:right;margin:0;padding:10px 10px;font-size:1.1em;font-weight:normal;text-decoration:none;color:#888;background:transparent;outline:none;border:none;border-radius:0;cursor:pointer;transition:color .1s ease;} mk-dialog > .main > .buttons > button i,[data-is="mk-dialog"] > .main > .buttons > button i{margin:0 .375em} mk-dialog > .main > .buttons > button:hover,[data-is="mk-dialog"] > .main > .buttons > button:hover{color:#87bb35} mk-dialog > .main > .buttons > button:active,[data-is="mk-dialog"] > .main > .buttons > button:active{color:#7aa830;transition:color 0s ease}', '', function(opts) {

		this.canThrough = opts.canThrough != null ? opts.canThrough : true;
		this.opts.buttons.forEach(button => {
			button._onclick = () => {
				if (button.onclick) button.onclick();
				this.close();
			};
		});

		this.on('mount', () => {
			this.refs.header.innerHTML = this.opts.title;
			this.refs.body.innerHTML = this.opts.text;

			this.refs.bg.style.pointerEvents = 'auto';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.bg,
				opacity: 1,
				duration: 100,
				easing: 'linear'
			});

			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.main,
				opacity: 1,
				scale: [1.2, 1],
				duration: 300,
				easing: [ 0, 0.5, 0.5, 1 ]
			});
		});

		this.close = () => {
			this.refs.bg.style.pointerEvents = 'none';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.bg,
				opacity: 0,
				duration: 300,
				easing: 'linear'
			});

			this.refs.main.style.pointerEvents = 'none';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.main,
				opacity: 0,
				scale: 0.8,
				duration: 300,
				easing: [ 0.5, -0.5, 1, 0.5 ],
				complete: () => this.unmount()
			});
		};

		this.bgClick = () => {
			if (this.canThrough) {
				if (this.opts.onThrough) this.opts.onThrough();
				this.close();
			}
		};
});

    
  

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-donation', '<button class="close" onclick="{close}">閉じる x</button><div class="message"><p>利用者の皆さま、</p><p> 今日は、日本の皆さまにお知らせがあります。 Misskeyの援助をお願いいたします。 私は独立性を守るため、一切の広告を掲載いたしません。 平均で約¥1,500の寄付をいただき、運営しております。 援助をしてくださる利用者はほんの少数です。 お願いいたします。 今日、利用者の皆さまが¥300ご援助くだされば、募金活動を一時間で終了することができます。 コーヒー1杯ほどの金額です。 Misskeyを活用しておられるのでしたら、広告を掲載せずにもう1年活動できるよう、どうか1分だけお時間をください。 私は小さな非営利個人ですが、サーバー、プログラム、人件費など、世界でトップクラスのウェブサイト同等のコストがかかります。 利用者は何億人といますが、他の大きなサイトに比べてほんの少額の費用で運営しているのです。 人間の可能性、自由、そして機会。知識こそ、これらの基盤を成すものです。 私は、誰もが無料かつ制限なく知識に触れられるべきだと信じています。 募金活動を終了し、Misskeyの改善に戻れるようご援助ください。 よろしくお願いいたします。 </p></div>', 'mk-donation,[data-is="mk-donation"]{display:block;color:#fff;background:#03072c;} mk-donation > .close,[data-is="mk-donation"] > .close{position:absolute;top:16px;right:16px;z-index:1} mk-donation > .message,[data-is="mk-donation"] > .message{padding:32px;font-size:1.4em;font-family:serif;} mk-donation > .message > p,[data-is="mk-donation"] > .message > p{display:block;margin:0 auto;max-width:1200px} mk-donation > .message > p:first-child,[data-is="mk-donation"] > .message > p:first-child{margin-bottom:16px}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');

		this.close = e => {
			e.preventDefault();
			e.stopPropagation();

			this.I.data.no_donation = 'true';
			this.I.update();
			this.api('i/appdata/set', {
				key: 'no_donation',
				value: 'true'
			});

			this.unmount();
		};
});

    
  

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-browser-base-contextmenu', '<mk-contextmenu ref="ctx"><ul><li onclick="{parent.createFolder}"><p><i class="fa fa-folder-o"></i>フォルダーを作成</p></li><li onclick="{parent.upload}"><p><i class="fa fa-upload"></i>ファイルをアップロード</p></li><li onclick="{parent.urlUpload}"><p><i class="fa fa-cloud-upload"></i>URLからアップロード</p></li></ul></mk-contextmenu>', '', '', function(opts) {
		this.browser = this.opts.browser;

		this.on('mount', () => {
			this.refs.ctx.on('closed', () => {
				this.trigger('closed');
				this.unmount();
			});
		});

		this.open = pos => {
			this.refs.ctx.open(pos);
		};

		this.createFolder = () => {
			this.browser.createFolder();
			this.refs.ctx.close();
		};

		this.upload = () => {
			this.browser.selectLocalFile();
			this.refs.ctx.close();
		};

		this.urlUpload = () => {
			this.browser.urlUpload();
			this.refs.ctx.close();
		};
});

    
  

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-browser-window', '<mk-window ref="window" is-modal="{false}" width="{\'800px\'}" height="{\'500px\'}"><yield to="header"><p class="info" if="{parent.usage}"><b>{parent.usage.toFixed(1)}%</b>使用中</p><i class="fa fa-cloud"></i>ドライブ </yield><yield to="content"><mk-drive-browser multiple="{true}" folder="{parent.folder}"></mk-drive-browser></yield></mk-window>', 'mk-drive-browser-window > mk-window [data-yield=\'header\'] > .info,[data-is="mk-drive-browser-window"] > mk-window [data-yield=\'header\'] > .info{position:absolute;top:0;left:16px;margin:0;font-size:80%} mk-drive-browser-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-drive-browser-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-drive-browser-window > mk-window [data-yield=\'content\'] > mk-drive-browser,[data-is="mk-drive-browser-window"] > mk-window [data-yield=\'content\'] > mk-drive-browser{height:100%}', '', function(opts) {
		this.mixin('api');

		this.folder = this.opts.folder ? this.opts.folder : null;

		this.on('mount', () => {
			this.refs.window.on('closed', () => {
				this.unmount();
			});

			this.api('drive').then(info => {
				this.update({
					usage: info.usage / info.capacity * 100
				});
			});
		});

		this.close = () => {
			this.refs.window.close();
		};
});

    
  

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_dialog__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_input_dialog__ = __webpack_require__(70);

    var riot = __webpack_require__(0)
    


riot.tag2('mk-drive-browser', '<nav><div class="path" oncontextmenu="{pathOncontextmenu}"><mk-drive-browser-nav-folder class="{current: folder == null}" folder="{null}"></mk-drive-browser-nav-folder><virtual each="{folder in hierarchyFolders}"><span class="separator"><i class="fa fa-angle-right"></i></span><mk-drive-browser-nav-folder folder="{folder}"></mk-drive-browser-nav-folder></virtual><span class="separator" if="{folder != null}"><i class="fa fa-angle-right"></i></span><span class="folder current" if="{folder != null}">{folder.name}</span></div><input class="search" type="search" placeholder="&#xf002; 検索"></nav><div class="main {uploading: uploads.length > 0, fetching: fetching}" ref="main" onmousedown="{onmousedown}" ondragover="{ondragover}" ondragenter="{ondragenter}" ondragleave="{ondragleave}" ondrop="{ondrop}" oncontextmenu="{oncontextmenu}"><div class="selection" ref="selection"></div><div class="contents" ref="contents"><div class="folders" ref="foldersContainer" if="{folders.length > 0}"><virtual each="{folder in folders}"><mk-drive-browser-folder class="folder" folder="{folder}"></mk-drive-browser-folder></virtual><button if="{moreFolders}">もっと読み込む</button></div><div class="files" ref="filesContainer" if="{files.length > 0}"><virtual each="{file in files}"><mk-drive-browser-file class="file" file="{file}"></mk-drive-browser-file></virtual><button if="{moreFiles}" onclick="{fetchMoreFiles}">もっと読み込む</button></div><div class="empty" if="{files.length == 0 && folders.length == 0 && !fetching}"><p if="{draghover}">ドロップですか？いいですよ、ボクはカワイイですからね</p><p if="{!draghover && folder == null}"><strong>ドライブには何もありません。</strong><br>右クリックして「ファイルをアップロード」を選んだり、ファイルをドラッグ&ドロップすることでもアップロードできます。</p><p if="{!draghover && folder != null}">このフォルダーは空です</p></div></div><div class="fetching" if="{fetching}"><div class="spinner"><div class="dot1"></div><div class="dot2"></div></div></div></div><div class="dropzone" if="{draghover}"></div><mk-uploader ref="uploader"></mk-uploader><input ref="fileInput" type="file" accept="*/*" multiple="multiple" tabindex="-1" onchange="{changeFileInput}">', 'mk-drive-browser,[data-is="mk-drive-browser"]{display:block;} mk-drive-browser > nav,[data-is="mk-drive-browser"] > nav{display:block;z-index:2;width:100%;overflow:auto;font-size:.9em;color:#555;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,0.05);} mk-drive-browser > nav,[data-is="mk-drive-browser"] > nav,mk-drive-browser > nav *,[data-is="mk-drive-browser"] > nav *{user-select:none} mk-drive-browser > nav > .path,[data-is="mk-drive-browser"] > nav > .path{display:inline-block;vertical-align:bottom;margin:0;padding:0 8px;width:calc(100% - 200px);line-height:38px;white-space:nowrap;} mk-drive-browser > nav > .path > *,[data-is="mk-drive-browser"] > nav > .path > *{display:inline-block;margin:0;padding:0 8px;line-height:38px;cursor:pointer;} mk-drive-browser > nav > .path > * i,[data-is="mk-drive-browser"] > nav > .path > * i{margin-right:4px} mk-drive-browser > nav > .path > * *,[data-is="mk-drive-browser"] > nav > .path > * *{pointer-events:none} mk-drive-browser > nav > .path > *:hover,[data-is="mk-drive-browser"] > nav > .path > *:hover{text-decoration:underline} mk-drive-browser > nav > .path > *.current,[data-is="mk-drive-browser"] > nav > .path > *.current{font-weight:bold;cursor:default;} mk-drive-browser > nav > .path > *.current:hover,[data-is="mk-drive-browser"] > nav > .path > *.current:hover{text-decoration:none} mk-drive-browser > nav > .path > *.separator,[data-is="mk-drive-browser"] > nav > .path > *.separator{margin:0;padding:0;opacity:.5;cursor:default;} mk-drive-browser > nav > .path > *.separator > i,[data-is="mk-drive-browser"] > nav > .path > *.separator > i{margin:0} mk-drive-browser > nav > .search,[data-is="mk-drive-browser"] > nav > .search{display:inline-block;vertical-align:bottom;user-select:text;cursor:auto;margin:0;padding:0 18px;width:200px;font-size:1em;line-height:38px;background:transparent;outline:none;border:none;border-radius:0;box-shadow:none;transition:color .5s ease,border .5s ease;font-family:FontAwesome,sans-serif;} mk-drive-browser > nav > .search[data-active=\'true\'],[data-is="mk-drive-browser"] > nav > .search[data-active=\'true\']{background:#fff} mk-drive-browser > nav > .search::-webkit-input-placeholder,[data-is="mk-drive-browser"] > nav > .search::-webkit-input-placeholder,mk-drive-browser > nav > .search:-ms-input-placeholder,[data-is="mk-drive-browser"] > nav > .search:-ms-input-placeholder,mk-drive-browser > nav > .search:-moz-placeholder,[data-is="mk-drive-browser"] > nav > .search:-moz-placeholder{color:$ui-control-foreground-color} mk-drive-browser > .main,[data-is="mk-drive-browser"] > .main{padding:8px;height:calc(100% - 38px);overflow:auto;} mk-drive-browser > .main,[data-is="mk-drive-browser"] > .main,mk-drive-browser > .main *,[data-is="mk-drive-browser"] > .main *{user-select:none} mk-drive-browser > .main.fetching,[data-is="mk-drive-browser"] > .main.fetching{cursor:wait !important;} mk-drive-browser > .main.fetching *,[data-is="mk-drive-browser"] > .main.fetching *{pointer-events:none} mk-drive-browser > .main.fetching > .contents,[data-is="mk-drive-browser"] > .main.fetching > .contents{opacity:.5} mk-drive-browser > .main.uploading,[data-is="mk-drive-browser"] > .main.uploading{height:calc(100% - 38px - 100px)} mk-drive-browser > .main > .selection,[data-is="mk-drive-browser"] > .main > .selection{display:none;position:absolute;z-index:128;top:0;left:0;border:solid 1px #87bb35;background:rgba(135,187,53,0.5);pointer-events:none} mk-drive-browser > .main > .contents > .folders:after,[data-is="mk-drive-browser"] > .main > .contents > .folders:after{content:"";display:block;clear:both} mk-drive-browser > .main > .contents > .folders > .folder,[data-is="mk-drive-browser"] > .main > .contents > .folders > .folder{float:left} mk-drive-browser > .main > .contents > .files:after,[data-is="mk-drive-browser"] > .main > .contents > .files:after{content:"";display:block;clear:both} mk-drive-browser > .main > .contents > .files > .file,[data-is="mk-drive-browser"] > .main > .contents > .files > .file{float:left} mk-drive-browser > .main > .contents > .empty,[data-is="mk-drive-browser"] > .main > .contents > .empty{padding:16px;text-align:center;color:#999;pointer-events:none;} mk-drive-browser > .main > .contents > .empty > p,[data-is="mk-drive-browser"] > .main > .contents > .empty > p{margin:0} mk-drive-browser > .main > .fetching .spinner,[data-is="mk-drive-browser"] > .main > .fetching .spinner{margin:100px auto;width:40px;height:40px;text-align:center;animation:sk-rotate 2s infinite linear} mk-drive-browser > .main > .fetching .dot1,[data-is="mk-drive-browser"] > .main > .fetching .dot1,mk-drive-browser > .main > .fetching .dot2,[data-is="mk-drive-browser"] > .main > .fetching .dot2{width:60%;height:60%;display:inline-block;position:absolute;top:0;background-color:rgba(0,0,0,0.3);border-radius:100%;animation:sk-bounce 2s infinite ease-in-out} mk-drive-browser > .main > .fetching .dot2,[data-is="mk-drive-browser"] > .main > .fetching .dot2{top:auto;bottom:0;animation-delay:-1s}@-moz-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-webkit-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-o-keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@keyframes sk-rotate{ 100%{transform:rotate(360deg)}}@-moz-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@-webkit-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@-o-keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}}@keyframes sk-bounce{ 0%,100%{transform:scale(0)} 50%{transform:scale(1)}} mk-drive-browser > .dropzone,[data-is="mk-drive-browser"] > .dropzone{position:absolute;left:0;top:38px;width:100%;height:calc(100% - 38px);border:dashed 2px rgba(135,187,53,0.5);pointer-events:none} mk-drive-browser > mk-uploader,[data-is="mk-drive-browser"] > mk-uploader{height:100px;padding:16px;background:#fff} mk-drive-browser > input,[data-is="mk-drive-browser"] > input{display:none}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.files = [];
		this.folders = [];
		this.hierarchyFolders = [];
		this.selectedFiles = [];

		this.uploads = [];

		this.folder = null;

		this.multiple = this.opts.multiple != null ? this.opts.multiple : false;

		this.draghover = false;

		this.isDragSource = false;

		this.on('mount', () => {
			this.refs.uploader.on('uploaded', file => {
				this.addFile(file, true);
			});

			this.refs.uploader.on('change-uploads', uploads => {
				this.update({
					uploads: uploads
				});
			});

			this.stream.on('drive_file_created', this.onStreamDriveFileCreated);
			this.stream.on('drive_file_updated', this.onStreamDriveFileUpdated);
			this.stream.on('drive_folder_created', this.onStreamDriveFolderCreated);
			this.stream.on('drive_folder_updated', this.onStreamDriveFolderUpdated);

			if (this.opts.folder && this.opts.folder != '') {
				this.move(this.opts.folder);
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

		this.onmousedown = e => {
			if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__["a" /* default */])(this.refs.foldersContainer, e.target) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__["a" /* default */])(this.refs.filesContainer, e.target)) return true;

			const rect = this.refs.main.getBoundingClientRect();

			const left = e.pageX + this.refs.main.scrollLeft - rect.left - window.pageXOffset
			const top = e.pageY + this.refs.main.scrollTop - rect.top - window.pageYOffset

			const move = e => {
				this.refs.selection.style.display = 'block';

				const cursorX = e.pageX + this.refs.main.scrollLeft - rect.left - window.pageXOffset;
				const cursorY = e.pageY + this.refs.main.scrollTop - rect.top - window.pageYOffset;
				const w = cursorX - left;
				const h = cursorY - top;

				if (w > 0) {
					this.refs.selection.style.width = w + 'px';
					this.refs.selection.style.left = left + 'px';
				} else {
					this.refs.selection.style.width = -w + 'px';
					this.refs.selection.style.left = cursorX + 'px';
				}

				if (h > 0) {
					this.refs.selection.style.height = h + 'px';
					this.refs.selection.style.top = top + 'px';
				} else {
					this.refs.selection.style.height = -h + 'px';
					this.refs.selection.style.top = cursorY + 'px';
				}
			};

			const up = e => {
				document.documentElement.removeEventListener('mousemove', move);
				document.documentElement.removeEventListener('mouseup', up);

				this.refs.selection.style.display = 'none';
			};

			document.documentElement.addEventListener('mousemove', move);
			document.documentElement.addEventListener('mouseup', up);
		};

		this.pathOncontextmenu = e => {
			e.preventDefault();
			e.stopImmediatePropagation();
			return false;
		};

		this.ondragover = e => {
			e.preventDefault();
			e.stopPropagation();

			if (!this.isDragSource) {

				e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed == 'all' ? 'copy' : 'move';
				this.draghover = true;
			} else {

				e.dataTransfer.dropEffect = 'none';
				return false;
			}
		};

		this.ondragenter = e => {
			e.preventDefault();
			if (!this.isDragSource) this.draghover = true;
		};

		this.ondragleave = e => {
			this.draghover = false;
		};

		this.ondrop = e => {
			e.preventDefault();
			e.stopPropagation();

			this.draghover = false;

			if (e.dataTransfer.files.length > 0) {
				e.dataTransfer.files.forEach(file => {
					this.upload(file, this.folder);
				});
				return false;
			}

			const data = e.dataTransfer.getData('text');
			if (data == null) return false;

			const obj = JSON.parse(data);

			if (obj.type == 'file') {
				const file = obj.id;
				if (this.files.some(f => f.id == file)) return false;
				this.removeFile(file);
				this.api('drive/files/update', {
					file_id: file,
					folder_id: this.folder ? this.folder.id : null
				});

			} else if (obj.type == 'folder') {
				const folder = obj.id;

				if (this.folder && folder == this.folder.id) return false;
				if (this.folders.some(f => f.id == folder)) return false;
				this.removeFolder(folder);
				this.api('drive/folders/update', {
					folder_id: folder,
					parent_id: this.folder ? this.folder.id : null
				}).then(() => {

				}).catch(err => {
					switch (err) {
						case 'detected-circular-definition':
							__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_dialog__["default"])('<i class="fa fa-exclamation-triangle"></i>操作を完了できません',
								'移動先のフォルダーは、移動するフォルダーのサブフォルダーです。', [{
								text: 'OK'
							}]);
							break;
						default:
							alert('不明なエラー' + err);
					}
				});
			}

			return false;
		};

		this.oncontextmenu = e => {
			e.preventDefault();
			e.stopImmediatePropagation();

			const ctx = riot.mount(document.body.appendChild(document.createElement('mk-drive-browser-base-contextmenu')), {
				browser: this
			})[0];
			ctx.open({
				x: e.pageX - window.pageXOffset,
				y: e.pageY - window.pageYOffset
			});

			return false;
		};

		this.selectLocalFile = () => {
			this.refs.fileInput.click();
		};

		this.urlUpload = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_input_dialog__["a" /* default */])('URLアップロード', 'アップロードしたいファイルのURL', null, url => {
				this.api('drive/files/upload_from_url', {
					url: url,
					folder_id: this.folder ? this.folder.id : undefined
				});

				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_dialog__["default"])('<i class="fa fa-check"></i>アップロードをリクエストしました',
					'アップロードが完了するまで時間がかかる場合があります。', [{
					text: 'OK'
				}]);
			});
		};

		this.createFolder = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_input_dialog__["a" /* default */])('フォルダー作成', 'フォルダー名', null, name => {
				this.api('drive/folders/create', {
					name: name,
					folder_id: this.folder ? this.folder.id : undefined
				}).then(folder => {
					this.addFolder(folder, true);
					this.update();
				});
			});
		};

		this.changeFileInput = () => {
			this.refs.fileInput.files.forEach(file => {
				this.upload(file, this.folder);
			});
		};

		this.upload = (file, folder) => {
			if (folder && typeof folder == 'object') folder = folder.id;
			this.refs.uploader.upload(file, folder);
		};

		this.chooseFile = file => {
			const isAlreadySelected = this.selectedFiles.some(f => f.id == file.id);
			if (this.multiple) {
				if (isAlreadySelected) {
					this.selectedFiles = this.selectedFiles.filter(f => f.id != file.id);
				} else {
					this.selectedFiles.push(file);
				}
				this.update();
				this.trigger('change-selection', this.selectedFiles);
			} else {
				if (isAlreadySelected) {
					this.trigger('selected', file);
				} else {
					this.selectedFiles = [file];
					this.trigger('change-selection', [file]);
				}
			}
		};

		this.newWindow = folderId => {
			riot.mount(document.body.appendChild(document.createElement('mk-drive-browser-window')), {
				folder: folderId
			});
		};

		this.move = target => {
			if (target == null) {
				this.goRoot();
				return;
			} else if (typeof target == 'object') {
				target = target.id;
			}

			this.update({
				fetching: true
			});

			this.api('drive/folders/show', {
				folder_id: target
			}).then(folder => {
				this.folder = folder;
				this.hierarchyFolders = [];

				const dive = folder => {
					this.hierarchyFolders.unshift(folder);
					if (folder.parent) dive(folder.parent);
				};

				if (folder.parent) dive(folder.parent);

				this.update();
				this.fetch();
			});
		};

		this.addFolder = (folder, unshift = false) => {
			const current = this.folder ? this.folder.id : null;
			if (current != folder.parent_id) return;

			if (this.folders.some(f => f.id == folder.id)) {
				const exist = this.folders.map(f => f.id).indexOf(folder.id);
				this.folders[exist] = folder;
				this.update();
				return;
			}

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

			if (this.folder == null) return;

			this.update({
				folder: null,
				hierarchyFolders: []
			});
			this.fetch();
		};

		this.fetch = () => {
			this.update({
				folders: [],
				files: [],
				moreFolders: false,
				moreFiles: false,
				fetching: true
			});

			let fetchedFolders = null;
			let fetchedFiles = null;

			const foldersMax = 30;
			const filesMax = 30;

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
				} else {
					flag = true;
				}
			};
		};

		this.fetchMoreFiles = () => {
			this.update({
				fetching: true
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
					fetching: false
				});
			});
		};

});

    
  

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_copy_to_clipboard__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_dialog__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_input_dialog__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scripts_update_avatar__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scripts_not_implemented_exception__ = __webpack_require__(253);

    var riot = __webpack_require__(0)
    




riot.tag2('mk-drive-browser-file-contextmenu', '<mk-contextmenu ref="ctx"><ul><li onclick="{parent.rename}"><p><i class="fa fa-i-cursor"></i>名前を変更</p></li><li onclick="{parent.copyUrl}"><p><i class="fa fa-link"></i>URLをコピー</p></li><li><a href="{parent.file.url + \'?download\'}" download="{parent.file.name}" onclick="{parent.download}"><i class="fa fa-download"></i>ダウンロード</a></li><li class="separator"></li><li onclick="{parent.delete}"><p><i class="fa fa-trash-o"></i>削除</p></li><li class="separator"></li><li class="has-child"><p>その他...<i class="fa fa-caret-right"></i></p><ul><li onclick="{parent.setAvatar}"><p>アバターに設定</p></li><li onclick="{parent.setBanner}"><p>バナーに設定</p></li></ul></li><li class="has-child"><p>アプリで開く...<i class="fa fa-caret-right"></i></p><ul><li onclick="{parent.addApp}"><p>アプリを追加...</p></li></ul></li></ul></mk-contextmenu>', '', '', function(opts) {

		this.mixin('i');
		this.mixin('api');

		this.browser = this.opts.browser;
		this.file = this.opts.file;

		this.on('mount', () => {
			this.refs.ctx.on('closed', () => {
				this.trigger('closed');
				this.unmount();
			});
		});

		this.open = pos => {
			this.refs.ctx.open(pos);
		};

		this.rename = () => {
			this.refs.ctx.close();

			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_input_dialog__["a" /* default */])('ファイル名の変更', '新しいファイル名を入力してください', this.file.name, name => {
				this.api('drive/files/update', {
					file_id: this.file.id,
					name: name
				})
			});
		};

		this.copyUrl = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_copy_to_clipboard__["a" /* default */])(this.file.url);
			this.refs.ctx.close();
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_dialog__["default"])('<i class="fa fa-check"></i>コピー完了',
				'ファイルのURLをクリップボードにコピーしました', [{
				text: 'わー'
			}]);
		};

		this.download = () => {
			this.refs.ctx.close();
		};

		this.setAvatar = () => {
			this.refs.ctx.close();
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__scripts_update_avatar__["a" /* default */])(this.I, null, this.file);
		};

		this.setBanner = () => {
			this.refs.ctx.close();
			updateBanner(this.I, null, this.file);
		};

		this.addApp = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__scripts_not_implemented_exception__["a" /* default */])();
		};
});

    
  

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__ = __webpack_require__(69);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-drive-browser-file', '<div class="label" if="{I.avatar_id == file.id}"><img src="/assets/label.svg"><p>アバター</p></div><div class="label" if="{I.banner_id == file.id}"><img src="/assets/label.svg"><p>バナー</p></div><div class="label" if="{I.data.wallpaper == file.id}"><img src="/assets/label.svg"><p>壁紙</p></div><div class="thumbnail"><img riot-src="{file.url + \'?thumbnail&size=128\'}" alt=""></div><p class="name"><span>{file.name.lastIndexOf(\'.\') != -1 ? file.name.substr(0, file.name.lastIndexOf(\'.\')) : file.name}</span><span class="ext" if="{file.name.lastIndexOf(\'.\') != -1}">{file.name.substr(file.name.lastIndexOf(\'.\'))}</span></p>', 'mk-drive-browser-file,[data-is="mk-drive-browser-file"]{display:block;margin:4px;padding:8px 0 0 0;width:144px;height:180px;border-radius:4px;} mk-drive-browser-file,[data-is="mk-drive-browser-file"],mk-drive-browser-file *,[data-is="mk-drive-browser-file"] *{cursor:pointer} mk-drive-browser-file:hover,[data-is="mk-drive-browser-file"]:hover{background:rgba(0,0,0,0.05);} mk-drive-browser-file:hover > .label:before,[data-is="mk-drive-browser-file"]:hover > .label:before,mk-drive-browser-file:hover > .label:after,[data-is="mk-drive-browser-file"]:hover > .label:after{background:#0b65a5} mk-drive-browser-file:active,[data-is="mk-drive-browser-file"]:active{background:rgba(0,0,0,0.1);} mk-drive-browser-file:active > .label:before,[data-is="mk-drive-browser-file"]:active > .label:before,mk-drive-browser-file:active > .label:after,[data-is="mk-drive-browser-file"]:active > .label:after{background:#0b588c} mk-drive-browser-file[data-is-selected],[data-is="mk-drive-browser-file"][data-is-selected]{background:#87bb35;} mk-drive-browser-file[data-is-selected]:hover,[data-is="mk-drive-browser-file"][data-is-selected]:hover{background:#95c942} mk-drive-browser-file[data-is-selected]:active,[data-is="mk-drive-browser-file"][data-is-selected]:active{background:#7aa830} mk-drive-browser-file[data-is-selected] > .label:before,[data-is="mk-drive-browser-file"][data-is-selected] > .label:before,mk-drive-browser-file[data-is-selected] > .label:after,[data-is="mk-drive-browser-file"][data-is-selected] > .label:after{display:none} mk-drive-browser-file[data-is-selected] > .name,[data-is="mk-drive-browser-file"][data-is-selected] > .name{color:#fff} mk-drive-browser-file[data-is-contextmenu-showing=\'true\']:after,[data-is="mk-drive-browser-file"][data-is-contextmenu-showing=\'true\']:after{content:"";pointer-events:none;position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;border:2px dashed rgba(135,187,53,0.3);border-radius:4px} mk-drive-browser-file > .label,[data-is="mk-drive-browser-file"] > .label{position:absolute;top:0;left:0;pointer-events:none;} mk-drive-browser-file > .label:before,[data-is="mk-drive-browser-file"] > .label:before{content:"";display:block;position:absolute;z-index:1;top:0;left:57px;width:28px;height:8px;background:#0c7ac9} mk-drive-browser-file > .label:after,[data-is="mk-drive-browser-file"] > .label:after{content:"";display:block;position:absolute;z-index:1;top:57px;left:0;width:8px;height:28px;background:#0c7ac9} mk-drive-browser-file > .label > img,[data-is="mk-drive-browser-file"] > .label > img{position:absolute;z-index:2;top:0;left:0} mk-drive-browser-file > .label > p,[data-is="mk-drive-browser-file"] > .label > p{position:absolute;z-index:3;top:19px;left:-28px;width:120px;margin:0;text-align:center;line-height:28px;color:#fff;transform:rotate(-45deg)} mk-drive-browser-file > .thumbnail,[data-is="mk-drive-browser-file"] > .thumbnail{width:128px;height:128px;left:8px;} mk-drive-browser-file > .thumbnail > img,[data-is="mk-drive-browser-file"] > .thumbnail > img{display:block;position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;max-width:128px;max-height:128px;pointer-events:none} mk-drive-browser-file > .name,[data-is="mk-drive-browser-file"] > .name{display:block;margin:4px 0 0 0;font-size:.8em;text-align:center;word-break:break-all;color:#444;overflow:hidden;} mk-drive-browser-file > .name > .ext,[data-is="mk-drive-browser-file"] > .name > .ext{opacity:.5}', 'data-is-selected="{isSelected}" data-is-contextmenu-showing="{isContextmenuShowing.toString()}" onclick="{onclick}" oncontextmenu="{oncontextmenu}" draggable="true" ondragstart="{ondragstart}" ondragend="{ondragend}" title="{title}"', function(opts) {

		this.mixin('i');

		this.file = this.opts.file;
		this.browser = this.parent;
		this.title = `${this.file.name}\n${this.file.type} ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_bytes_to_size__["a" /* default */])(this.file.datasize)}`;
		this.isContextmenuShowing = false;
		this.isSelected = this.browser.selectedFiles.some(f => f.id == this.file.id);

		this.browser.on('change-selection', selections => {
			this.isSelected = selections.some(f => f.id == this.file.id);
			this.update();
		});

		this.onclick = () => {
			this.browser.chooseFile(this.file);
		};

		this.oncontextmenu = e => {
			e.preventDefault();
			e.stopImmediatePropagation();

			this.update({
				isContextmenuShowing: true
			});
			const ctx = riot.mount(document.body.appendChild(document.createElement('mk-drive-browser-file-contextmenu')), {
				browser: this.browser,
				file: this.file
			})[0];
			ctx.open({
				x: e.pageX - window.pageXOffset,
				y: e.pageY - window.pageYOffset
			});
			ctx.on('closed', () => {
				this.update({
					isContextmenuShowing: false
				});
			});
			return false;
		};

		this.ondragstart = e => {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', JSON.stringify({
				type: 'file',
				id: this.file.id,
				file: this.file
			}));
			this.isDragging = true;

			this.browser.isDragSource = true;
		};

		this.ondragend = e => {
			this.isDragging = false;
			this.browser.isDragSource = false;
		};
});

    
  

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_input_dialog__ = __webpack_require__(70);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-drive-browser-folder-contextmenu', '<mk-contextmenu ref="ctx"><ul><li onclick="{parent.move}"><p><i class="fa fa-arrow-right"></i>このフォルダへ移動</p></li><li onclick="{parent.newWindow}"><p><i class="fa fa-share-square-o"></i>新しいウィンドウで表示</p></li><li class="separator"></li><li onclick="{parent.rename}"><p><i class="fa fa-i-cursor"></i>名前を変更</p></li><li class="separator"></li><li onclick="{parent.delete}"><p><i class="fa fa-trash-o"></i>削除</p></li></ul></mk-contextmenu>', '', '', function(opts) {

		this.mixin('api');

		this.browser = this.opts.browser;
		this.folder = this.opts.folder;

		this.open = pos => {
			this.refs.ctx.open(pos);

			this.refs.ctx.on('closed', () => {
				this.trigger('closed');
				this.unmount();
			});
		};

		this.move = () => {
			this.browser.move(this.folder.id);
			this.refs.ctx.close();
		};

		this.newWindow = () => {
			this.browser.newWindow(this.folder.id);
			this.refs.ctx.close();
		};

		this.createFolder = () => {
			this.browser.createFolder();
			this.refs.ctx.close();
		};

		this.rename = () => {
			this.refs.ctx.close();

			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_input_dialog__["a" /* default */])('フォルダ名の変更', '新しいフォルダ名を入力してください', this.folder.name, name => {
				this.api('drive/folders/update', {
					folder_id: this.folder.id,
					name: name
				});
			});
		};
});

    
  

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_dialog__ = __webpack_require__(57);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-drive-browser-folder', '<p class="name"><i class="fa fa-fw {fa-folder-o: !hover, fa-folder-open-o: hover}"></i>{folder.name}</p>', 'mk-drive-browser-folder,[data-is="mk-drive-browser-folder"]{display:block;margin:4px;padding:8px;width:144px;height:64px;background:#f9fcf4;border-radius:4px;} mk-drive-browser-folder,[data-is="mk-drive-browser-folder"],mk-drive-browser-folder *,[data-is="mk-drive-browser-folder"] *{cursor:pointer} mk-drive-browser-folder *,[data-is="mk-drive-browser-folder"] *{pointer-events:none} mk-drive-browser-folder:hover,[data-is="mk-drive-browser-folder"]:hover{background:#f3f9ea} mk-drive-browser-folder:active,[data-is="mk-drive-browser-folder"]:active{background:#edf6df} mk-drive-browser-folder[data-is-contextmenu-showing=\'true\']:after,[data-is="mk-drive-browser-folder"][data-is-contextmenu-showing=\'true\']:after,mk-drive-browser-folder[data-draghover=\'true\']:after,[data-is="mk-drive-browser-folder"][data-draghover=\'true\']:after{content:"";pointer-events:none;position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;border:2px dashed rgba(135,187,53,0.3);border-radius:4px} mk-drive-browser-folder[data-draghover=\'true\'],[data-is="mk-drive-browser-folder"][data-draghover=\'true\']{background:#f3f9ea} mk-drive-browser-folder > .name,[data-is="mk-drive-browser-folder"] > .name{margin:0;font-size:.9em;color:#5f8325;} mk-drive-browser-folder > .name > i,[data-is="mk-drive-browser-folder"] > .name > i{margin-right:4px} mk-drive-browser-folder > .name margin-left 2px,[data-is="mk-drive-browser-folder"] > .name margin-left 2px{text-align:left}', 'data-is-contextmenu-showing="{isContextmenuShowing.toString()}" data-draghover="{draghover.toString()}" onclick="{onclick}" onmouseover="{onmouseover}" onmouseout="{onmouseout}" ondragover="{ondragover}" ondragenter="{ondragenter}" ondragleave="{ondragleave}" ondrop="{ondrop}" oncontextmenu="{oncontextmenu}" draggable="true" ondragstart="{ondragstart}" ondragend="{ondragend}" title="{title}"', function(opts) {

		this.mixin('api');

		this.folder = this.opts.folder;
		this.browser = this.parent;

		this.title = this.folder.name;
		this.hover = false;
		this.draghover = false;
		this.isContextmenuShowing = false;

		this.onclick = () => {
			this.browser.move(this.folder);
		};

		this.onmouseover = () => {
			this.hover = true;
		};

		this.onmouseout = () => {
			this.hover = false
		};

		this.ondragover = e => {
			e.preventDefault();
			e.stopPropagation();

			if (!this.isDragging) {

				if (e.dataTransfer.effectAllowed === 'all') {
					e.dataTransfer.dropEffect = 'copy';
				} else {
					e.dataTransfer.dropEffect = 'move';
				}
			} else {

				e.dataTransfer.dropEffect = 'none';
			}
			return false;
		};

		this.ondragenter = e => {
			e.preventDefault();
			if (!this.isDragging) this.draghover = true;
		};

		this.ondragleave = () => {
			this.draghover = false;
		};

		this.ondrop = e => {
			e.preventDefault();
			e.stopPropagation();
			this.draghover = false;

			if (e.dataTransfer.files.length > 0) {
				e.dataTransfer.files.forEach(file => {
					this.browser.upload(file, this.folder);
				});
				return false;
			};

			const data = e.dataTransfer.getData('text');
			if (data == null) return false;

			const obj = JSON.parse(data);

			if (obj.type == 'file') {
				const file = obj.id;
				this.browser.removeFile(file);
				this.api('drive/files/update', {
					file_id: file,
					folder_id: this.folder.id
				});

			} else if (obj.type == 'folder') {
				const folder = obj.id;

				if (folder == this.folder.id) return false;
				this.browser.removeFolder(folder);
				this.api('drive/folders/update', {
					folder_id: folder,
					parent_id: this.folder.id
				}).then(() => {

				}).catch(err => {
					switch (err) {
						case 'detected-circular-definition':
							__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_dialog__["default"])('<i class="fa fa-exclamation-triangle"></i>操作を完了できません',
								'移動先のフォルダーは、移動するフォルダーのサブフォルダーです。', [{
								text: 'OK'
							}]);
							break;
						default:
							alert('不明なエラー' + err);
					}
				});
			}

			return false;
		};

		this.ondragstart = e => {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', JSON.stringify({
				type: 'folder',
				id: this.folder.id
			}));
			this.isDragging = true;

			this.browser.isDragSource = true;
		};

		this.ondragend = e => {
			this.isDragging = false;
			this.browser.isDragSource = false;
		};

		this.oncontextmenu = e => {
			e.preventDefault();
			e.stopImmediatePropagation();

			this.update({
				isContextmenuShowing: true
			});
			const ctx = riot.mount(document.body.appendChild(document.createElement('mk-drive-browser-folder-contextmenu')), {
				browser: this.browser,
				folder: this.folder
			})[0];
			ctx.open({
				x: e.pageX - window.pageXOffset,
				y: e.pageY - window.pageYOffset
			});
			ctx.on('closed', () => {
				this.update({
					isContextmenuShowing: false
				});
			});

			return false;
		};
});

    
  

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-drive-browser-nav-folder', '<i class="fa fa-cloud" if="{folder == null}"></i><span>{folder == null ? \'ドライブ\' : folder.name}</span>', 'mk-drive-browser-nav-folder[data-draghover],[data-is="mk-drive-browser-nav-folder"][data-draghover]{background:#eee}', 'data-draghover="{draghover}" onclick="{onclick}" ondragover="{ondragover}" ondragenter="{ondragenter}" ondragleave="{ondragleave}" ondrop="{ondrop}"', function(opts) {
		this.mixin('api');

		this.folder = this.opts.folder && this.opts.folder != '' ? this.opts.folder : null;
		this.browser = this.parent;

		this.hover = false;

		this.onclick = () => {
			this.browser.move(this.folder);
		};

		this.onmouseover = () => {
			this.hover = true
		};

		this.onmouseout = () => {
			this.hover = false
		};

		this.ondragover = e => {
			e.preventDefault();
			e.stopPropagation();

			if (this.folder == null && this.browser.folder == null) {
				e.dataTransfer.dropEffect = 'none';

			} else if (e.dataTransfer.effectAllowed == 'all') {
				e.dataTransfer.dropEffect = 'copy';
			} else {
				e.dataTransfer.dropEffect = 'move';
			}
			return false;
		};

		this.ondragenter = () => {
			if (this.folder || this.browser.folder) this.draghover = true;
		};

		this.ondragleave = () => {
			if (this.folder || this.browser.folder) this.draghover = false;
		};

		this.ondrop = e => {
			e.stopPropagation();
			this.draghover = false;

			if (e.dataTransfer.files.length > 0) {
				e.dataTransfer.files.forEach(file => {
					this.browser.upload(file, this.folder);
				});
				return false;
			};

			const data = e.dataTransfer.getData('text');
			if (data == null) return false;

			const obj = JSON.parse(data);

			if (obj.type == 'file') {
				const file = obj.id;
				this.browser.removeFile(file);
				this.api('drive/files/update', {
					file_id: file,
					folder_id: this.folder ? this.folder.id : null
				});

			} else if (obj.type == 'folder') {
				const folder = obj.id;

				if (this.folder && folder == this.folder.id) return false;
				this.browser.removeFolder(folder);
				this.api('drive/folders/update', {
					folder_id: folder,
					parent_id: this.folder ? this.folder.id : null
				});
			}

			return false;
		};
});

    
  

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ellipsis-icon', '<div></div><div></div><div></div>', 'mk-ellipsis-icon,[data-is="mk-ellipsis-icon"]{display:block;width:70px;margin:0 auto;text-align:center;} mk-ellipsis-icon > div,[data-is="mk-ellipsis-icon"] > div{display:inline-block;width:18px;height:18px;background-color:rgba(0,0,0,0.3);border-radius:100%;animation:bounce 1.4s infinite ease-in-out both;} mk-ellipsis-icon > div:nth-child(1),[data-is="mk-ellipsis-icon"] > div:nth-child(1){animation-delay:0s} mk-ellipsis-icon > div:nth-child(2),[data-is="mk-ellipsis-icon"] > div:nth-child(2){margin:0 6px;animation-delay:.16s} mk-ellipsis-icon > div:nth-child(3),[data-is="mk-ellipsis-icon"] > div:nth-child(3){animation-delay:.32s}@-moz-keyframes bounce{ 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}@-webkit-keyframes bounce{ 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}@-o-keyframes bounce{ 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}@keyframes bounce{ 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}', '', function(opts) {
});

    
  

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__ = __webpack_require__(63);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-follow-button', '<button class="{wait: wait, follow: !user.is_following, unfollow: user.is_following}" if="{!init}" onclick="{onclick}" disabled="{wait}" title="{user.is_following ? \'フォロー解除\' : \'フォローする\'}"><i class="fa fa-minus" if="{!wait && user.is_following}"></i><i class="fa fa-plus" if="{!wait && !user.is_following}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{wait}"></i></button><div class="init" if="{init}"><i class="fa fa-spinner fa-pulse fa-fw"></i></div>', 'mk-follow-button,[data-is="mk-follow-button"]{display:block;} mk-follow-button > button,[data-is="mk-follow-button"] > button,mk-follow-button > .init,[data-is="mk-follow-button"] > .init{display:block;cursor:pointer;padding:0;margin:0;width:32px;height:32px;font-size:1em;outline:none;border-radius:4px;} mk-follow-button > button *,[data-is="mk-follow-button"] > button *,mk-follow-button > .init *,[data-is="mk-follow-button"] > .init *{pointer-events:none} mk-follow-button > button:focus:after,[data-is="mk-follow-button"] > button:focus:after,mk-follow-button > .init:focus:after,[data-is="mk-follow-button"] > .init:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-follow-button > button.follow,[data-is="mk-follow-button"] > button.follow,mk-follow-button > .init.follow,[data-is="mk-follow-button"] > .init.follow{color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-follow-button > button.follow:hover,[data-is="mk-follow-button"] > button.follow:hover,mk-follow-button > .init.follow:hover,[data-is="mk-follow-button"] > .init.follow:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-follow-button > button.follow:active,[data-is="mk-follow-button"] > button.follow:active,mk-follow-button > .init.follow:active,[data-is="mk-follow-button"] > .init.follow:active{background:#ececec;border-color:#dcdcdc} mk-follow-button > button.unfollow,[data-is="mk-follow-button"] > button.unfollow,mk-follow-button > .init.unfollow,[data-is="mk-follow-button"] > .init.unfollow{color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-follow-button > button.unfollow:not(:disabled),[data-is="mk-follow-button"] > button.unfollow:not(:disabled),mk-follow-button > .init.unfollow:not(:disabled),[data-is="mk-follow-button"] > .init.unfollow:not(:disabled){font-weight:bold} mk-follow-button > button.unfollow:hover:not(:disabled),[data-is="mk-follow-button"] > button.unfollow:hover:not(:disabled),mk-follow-button > .init.unfollow:hover:not(:disabled),[data-is="mk-follow-button"] > .init.unfollow:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-follow-button > button.unfollow:active:not(:disabled),[data-is="mk-follow-button"] > button.unfollow:active:not(:disabled),mk-follow-button > .init.unfollow:active:not(:disabled),[data-is="mk-follow-button"] > .init.unfollow:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-follow-button > button.wait,[data-is="mk-follow-button"] > button.wait,mk-follow-button > .init.wait,[data-is="mk-follow-button"] > .init.wait{cursor:wait !important;opacity:.7}', '', function(opts) {

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
/* 117 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-following-setuper', '<p class="title">気になるユーザーをフォロー:</p><div class="users" if="{!fetching && users.length > 0}"><div class="user" each="{users}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + username}"><img class="avatar" riot-src="{avatar_url + \'?thumbnail&size=42\'}" alt="" data-user-preview="{id}"></a><div class="body"><a class="name" href="{CONFIG.url + \'/\' + username}" target="_blank" data-user-preview="{id}">{name}</a><p class="username">@{username}</p></div><mk-follow-button user="{this}"></mk-follow-button></div></div><p class="empty" if="{!fetching && users.length == 0}">おすすめのユーザーは見つかりませんでした。</p><p class="fetching" if="{fetching}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p><a class="refresh" onclick="{refresh}">もっと見る</a><button class="close" onclick="{close}" title="閉じる"><i class="fa fa-times"></i></button>', 'mk-following-setuper,[data-is="mk-following-setuper"]{display:block;padding:24px;} mk-following-setuper > .title,[data-is="mk-following-setuper"] > .title{margin:0 0 12px 0;font-size:1em;font-weight:bold;color:#888} mk-following-setuper > .users:after,[data-is="mk-following-setuper"] > .users:after{content:"";display:block;clear:both} mk-following-setuper > .users > .user,[data-is="mk-following-setuper"] > .users > .user{padding:16px;width:238px;float:left;} mk-following-setuper > .users > .user:after,[data-is="mk-following-setuper"] > .users > .user:after{content:"";display:block;clear:both} mk-following-setuper > .users > .user > .avatar-anchor,[data-is="mk-following-setuper"] > .users > .user > .avatar-anchor{display:block;float:left;margin:0 12px 0 0;} mk-following-setuper > .users > .user > .avatar-anchor > .avatar,[data-is="mk-following-setuper"] > .users > .user > .avatar-anchor > .avatar{display:block;width:42px;height:42px;margin:0;border-radius:8px;vertical-align:bottom} mk-following-setuper > .users > .user > .body,[data-is="mk-following-setuper"] > .users > .user > .body{float:left;width:calc(100% - 54px);} mk-following-setuper > .users > .user > .body > .name,[data-is="mk-following-setuper"] > .users > .user > .body > .name{margin:0;font-size:16px;line-height:24px;color:#555} mk-following-setuper > .users > .user > .body > .username,[data-is="mk-following-setuper"] > .users > .user > .body > .username{margin:0;font-size:15px;line-height:16px;color:#ccc} mk-following-setuper > .users > .user > mk-follow-button,[data-is="mk-following-setuper"] > .users > .user > mk-follow-button{position:absolute;top:16px;right:16px} mk-following-setuper > .empty,[data-is="mk-following-setuper"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-following-setuper > .fetching,[data-is="mk-following-setuper"] > .fetching{margin:0;padding:16px;text-align:center;color:#aaa;} mk-following-setuper > .fetching > i,[data-is="mk-following-setuper"] > .fetching > i{margin-right:4px} mk-following-setuper > .refresh,[data-is="mk-following-setuper"] > .refresh{display:block;margin:0 8px 0 0;text-align:right;font-size:.9em;color:#999} mk-following-setuper > .close,[data-is="mk-following-setuper"] > .close{cursor:pointer;display:block;position:absolute;top:6px;right:6px;z-index:1;margin:0;padding:0;font-size:1.2em;color:#999;border:none;outline:none;background:transparent;} mk-following-setuper > .close:hover,[data-is="mk-following-setuper"] > .close:hover{color:#555} mk-following-setuper > .close:active,[data-is="mk-following-setuper"] > .close:active{color:#222} mk-following-setuper > .close > i,[data-is="mk-following-setuper"] > .close > i{padding:14px}', '', function(opts) {
		this.mixin('api');
		this.mixin('user-preview');

		this.users = null;
		this.fetching = true;

		this.limit = 6;
		this.page = 0;

		this.on('mount', () => {
			this.fetch();
		});

		this.fetch = () => {
			this.update({
				fetching: true,
				users: null
			});

			this.api('users/recommendation', {
				limit: this.limit,
				offset: this.limit * this.page
			}).then(users => {
				this.fetching = false
				this.users = users
				this.update({
					fetching: false,
					users: users
				});
			});
		};

		this.refresh = () => {
			if (this.users.length < this.limit) {
				this.page = 0;
			} else {
				this.page++;
			}
			this.fetch();
		};

		this.close = () => {
			this.unmount();
		};
});

    
  

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-broadcast-home-widget', '<div class="icon"><svg height="32" version="1.1" viewbox="0 0 32 32" width="32"><path class="tower" d="M16.04,11.24c1.79,0,3.239-1.45,3.239-3.24S17.83,4.76,16.04,4.76c-1.79,0-3.24,1.45-3.24,3.24 C12.78,9.78,14.24,11.24,16.04,11.24z M16.04,13.84c-0.82,0-1.66-0.2-2.4-0.6L7.34,29.98h2.98l1.72-2h8l1.681,2H24.7L18.42,13.24 C17.66,13.64,16.859,13.84,16.04,13.84z M16.02,14.8l2.02,7.2h-4L16.02,14.8z M12.04,25.98l2-2h4l2,2H12.04z"></path><path class="wave a" d="M4.66,1.04c-0.508-0.508-1.332-0.508-1.84,0c-1.86,1.92-2.8,4.44-2.8,6.94c0,2.52,0.94,5.04,2.8,6.96 c0.5,0.52,1.32,0.52,1.82,0s0.5-1.36,0-1.88C3.28,11.66,2.6,9.82,2.6,7.98S3.28,4.3,4.64,2.9C5.157,2.391,5.166,1.56,4.66,1.04z"></path><path class="wave b" d="M9.58,12.22c0.5-0.5,0.5-1.34,0-1.84C8.94,9.72,8.62,8.86,8.62,8s0.32-1.72,0.96-2.38c0.5-0.52,0.5-1.34,0-1.84 C9.346,3.534,9.02,3.396,8.68,3.4c-0.32,0-0.66,0.12-0.9,0.38C6.64,4.94,6.08,6.48,6.08,8s0.58,3.06,1.7,4.22 C8.28,12.72,9.1,12.72,9.58,12.22z"></path><path class="wave c" d="M22.42,3.78c-0.5,0.5-0.5,1.34,0,1.84c0.641,0.66,0.96,1.52,0.96,2.38s-0.319,1.72-0.96,2.38c-0.5,0.52-0.5,1.34,0,1.84 c0.487,0.497,1.285,0.505,1.781,0.018c0.007-0.006,0.013-0.012,0.02-0.018c1.139-1.16,1.699-2.7,1.699-4.22s-0.561-3.06-1.699-4.22 c-0.494-0.497-1.297-0.5-1.794-0.007C22.424,3.775,22.422,3.778,22.42,3.78z"></path><path class="wave d" d="M29.18,1.06c-0.479-0.502-1.273-0.522-1.775-0.044c-0.016,0.015-0.029,0.029-0.045,0.044c-0.5,0.52-0.5,1.36,0,1.88 c1.361,1.4,2.041,3.24,2.041,5.08s-0.68,3.66-2.041,5.08c-0.5,0.52-0.5,1.36,0,1.88c0.509,0.508,1.332,0.508,1.841,0 c1.86-1.92,2.8-4.44,2.8-6.96C31.99,5.424,30.98,2.931,29.18,1.06z"></path></svg></div><h1>開発者募集中！</h1><p><a href="https://github.com/syuilo/misskey" target="_blank">Misskeyはオープンソースで開発されています。リポジトリはこちら。</a></p>', 'mk-broadcast-home-widget,[data-is="mk-broadcast-home-widget"]{display:block;padding:10px 10px 10px 50px;background:transparent;border-color:#4078c0 !important;} mk-broadcast-home-widget:after,[data-is="mk-broadcast-home-widget"]:after{content:"";display:block;clear:both} mk-broadcast-home-widget > .icon,[data-is="mk-broadcast-home-widget"] > .icon{display:block;float:left;margin-left:-40px;} mk-broadcast-home-widget > .icon > svg,[data-is="mk-broadcast-home-widget"] > .icon > svg{fill:currentColor;color:#4078c0;} mk-broadcast-home-widget > .icon > svg > .wave,[data-is="mk-broadcast-home-widget"] > .icon > svg > .wave{opacity:1;} mk-broadcast-home-widget > .icon > svg > .wave.a,[data-is="mk-broadcast-home-widget"] > .icon > svg > .wave.a{animation:wave 20s ease-in-out 2.1s infinite} mk-broadcast-home-widget > .icon > svg > .wave.b,[data-is="mk-broadcast-home-widget"] > .icon > svg > .wave.b{animation:wave 20s ease-in-out 2s infinite} mk-broadcast-home-widget > .icon > svg > .wave.c,[data-is="mk-broadcast-home-widget"] > .icon > svg > .wave.c{animation:wave 20s ease-in-out 2s infinite} mk-broadcast-home-widget > .icon > svg > .wave.d,[data-is="mk-broadcast-home-widget"] > .icon > svg > .wave.d{animation:wave 20s ease-in-out 2.1s infinite}@-moz-keyframes wave{ 0%{opacity:1} 1.5%{opacity:0} 3.5%{opacity:0} 5%{opacity:1} 6.5%{opacity:0} 8.5%{opacity:0} 10%{opacity:1}}@-webkit-keyframes wave{ 0%{opacity:1} 1.5%{opacity:0} 3.5%{opacity:0} 5%{opacity:1} 6.5%{opacity:0} 8.5%{opacity:0} 10%{opacity:1}}@-o-keyframes wave{ 0%{opacity:1} 1.5%{opacity:0} 3.5%{opacity:0} 5%{opacity:1} 6.5%{opacity:0} 8.5%{opacity:0} 10%{opacity:1}}@keyframes wave{ 0%{opacity:1} 1.5%{opacity:0} 3.5%{opacity:0} 5%{opacity:1} 6.5%{opacity:0} 8.5%{opacity:0} 10%{opacity:1}} mk-broadcast-home-widget > h1,[data-is="mk-broadcast-home-widget"] > h1{margin:0;font-size:.95em;font-weight:normal;color:#4078c0} mk-broadcast-home-widget > p,[data-is="mk-broadcast-home-widget"] > p{display:block;z-index:1;margin:0;font-size:.7em;color:#555;} mk-broadcast-home-widget > p a,[data-is="mk-broadcast-home-widget"] > p a{color:#555}', '', function(opts) {
});

    
  

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-calendar-home-widget', '<div class="calendar" data-is-holiday="{isHoliday}"><p class="month-and-year"><span class="year">{year}年</span><span class="month">{month}月</span></p><p class="day">{day}日</p><p class="week-day">{weekDay}曜日</p></div><div class="info"><div><p>今日:<b>{dayP.toFixed(1)}%</b></p><div class="meter"><div class="val" riot-style="{\'width:\' + dayP + \'%\'}"></div></div></div><div><p>今月:<b>{monthP.toFixed(1)}%</b></p><div class="meter"><div class="val" riot-style="{\'width:\' + monthP + \'%\'}"></div></div></div><div><p>今年:<b>{yearP.toFixed(1)}%</b></p><div class="meter"><div class="val" riot-style="{\'width:\' + yearP + \'%\'}"></div></div></div></div>', 'mk-calendar-home-widget,[data-is="mk-calendar-home-widget"]{display:block;padding:16px 0;color:#777;background:#fff;} mk-calendar-home-widget[data-special=\'on-new-years-day\'],[data-is="mk-calendar-home-widget"][data-special=\'on-new-years-day\']{border-color:#ef95a0 !important} mk-calendar-home-widget:after,[data-is="mk-calendar-home-widget"]:after{content:"";display:block;clear:both} mk-calendar-home-widget > .calendar,[data-is="mk-calendar-home-widget"] > .calendar{float:left;width:60%;text-align:center;} mk-calendar-home-widget > .calendar[data-is-holiday] > .day,[data-is="mk-calendar-home-widget"] > .calendar[data-is-holiday] > .day{color:#ef95a0} mk-calendar-home-widget > .calendar > p,[data-is="mk-calendar-home-widget"] > .calendar > p{margin:0;line-height:18px;font-size:14px;} mk-calendar-home-widget > .calendar > p > span,[data-is="mk-calendar-home-widget"] > .calendar > p > span{margin:0 4px} mk-calendar-home-widget > .calendar > .day,[data-is="mk-calendar-home-widget"] > .calendar > .day{margin:10px 0;line-height:32px;font-size:28px} mk-calendar-home-widget > .info,[data-is="mk-calendar-home-widget"] > .info{display:block;float:left;width:40%;padding:0 16px 0 0;} mk-calendar-home-widget > .info > div,[data-is="mk-calendar-home-widget"] > .info > div{margin-bottom:8px;} mk-calendar-home-widget > .info > div:last-child,[data-is="mk-calendar-home-widget"] > .info > div:last-child{margin-bottom:4px} mk-calendar-home-widget > .info > div > p,[data-is="mk-calendar-home-widget"] > .info > div > p{margin:0 0 2px 0;font-size:12px;line-height:18px;color:#888;} mk-calendar-home-widget > .info > div > p > b,[data-is="mk-calendar-home-widget"] > .info > div > p > b{margin-left:2px} mk-calendar-home-widget > .info > div > .meter,[data-is="mk-calendar-home-widget"] > .info > div > .meter{width:100%;overflow:hidden;background:#eee;border-radius:8px;} mk-calendar-home-widget > .info > div > .meter > .val,[data-is="mk-calendar-home-widget"] > .info > div > .meter > .val{height:4px;background:#87bb35} mk-calendar-home-widget > .info > div:nth-child(1) > .meter > .val,[data-is="mk-calendar-home-widget"] > .info > div:nth-child(1) > .meter > .val{background:#f7796c} mk-calendar-home-widget > .info > div:nth-child(2) > .meter > .val,[data-is="mk-calendar-home-widget"] > .info > div:nth-child(2) > .meter > .val{background:#a1de41} mk-calendar-home-widget > .info > div:nth-child(3) > .meter > .val,[data-is="mk-calendar-home-widget"] > .info > div:nth-child(3) > .meter > .val{background:#41ddde}', 'data-special="{special}"', function(opts) {
		this.draw = () => {
			const now = new Date();
			const nd = now.getDate();
			const nm = now.getMonth();
			const ny = now.getFullYear();

			this.year = ny;
			this.month = nm + 1;
			this.day = nd;
			this.weekDay = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

			this.dayNumer   = now - new Date(ny, nm, nd);
			this.dayDenom   = 1000  * 60  * 60  * 24 ;
			this.monthNumer = now - new Date(ny, nm, 1);
			this.monthDenom = new Date(ny, nm + 1, 1) - new Date(ny, nm, 1);
			this.yearNumer  = now - new Date(ny, 0, 1);
			this.yearDenom  = new Date(ny + 1, 0, 1) - new Date(ny, 0, 1);

			this.dayP   = this.dayNumer   / this.dayDenom   * 100;
			this.monthP = this.monthNumer / this.monthDenom * 100;
			this.yearP  = this.yearNumer  / this.yearDenom  * 100;

			this.isHoliday = now.getDay() == 0 || now.getDay() == 6;

			this.special =
				nm == 0 && nd == 1 ? 'on-new-years-day' :
				false;

			this.update();
		};

		this.draw();

		this.on('mount', () => {
			this.clock = setInterval(this.draw, 1000);
		});

		this.on('unmount', () => {
			clearInterval(this.clock);
		});
});

    
  

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-donation-home-widget', '<article><h1><i class="fa fa-heart"></i>Donation</h1><p>{\'To manage Misskey, we spend money for our domain, server, etc.. There\\\'s no incomes for us, so we need your tip. If you\\\'re interested, contact {}. Thank you for your contribution!\'.substr(0, \'To manage Misskey, we spend money for our domain, server, etc.. There\\\'s no incomes for us, so we need your tip. If you\\\'re interested, contact {}. Thank you for your contribution!\'.indexOf(\'{\'))}<a href="/syuilo" data-user-preview="@syuilo">@syuilo</a>{\'To manage Misskey, we spend money for our domain, server, etc.. There\\\'s no incomes for us, so we need your tip. If you\\\'re interested, contact {}. Thank you for your contribution!\'.substr(\'To manage Misskey, we spend money for our domain, server, etc.. There\\\'s no incomes for us, so we need your tip. If you\\\'re interested, contact {}. Thank you for your contribution!\'.indexOf(\'}\') + 1)}</p></article>', 'mk-donation-home-widget,[data-is="mk-donation-home-widget"]{display:block;background:#fff;border-color:#ead8bb !important;} mk-donation-home-widget > article,[data-is="mk-donation-home-widget"] > article{padding:20px;} mk-donation-home-widget > article > h1,[data-is="mk-donation-home-widget"] > article > h1{margin:0 0 5px 0;font-size:1em;color:#888;} mk-donation-home-widget > article > h1 > i,[data-is="mk-donation-home-widget"] > article > h1 > i{margin-right:.25em} mk-donation-home-widget > article > p,[data-is="mk-donation-home-widget"] > article > p{display:block;z-index:1;margin:0;font-size:.8em;color:#999}', '', function(opts) {
this.mixin('user-preview');
});

    
  

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-mentions-home-widget', '<header><span data-is-active="{mode == \'all\'}" onclick="{setMode.bind(this, \'all\')}">すべて</span><span data-is-active="{mode == \'following\'}" onclick="{setMode.bind(this, \'following\')}">フォロー中</span></header><div class="loading" if="{isLoading}"><mk-ellipsis-icon></mk-ellipsis-icon></div><p class="empty" if="{isEmpty}"><i class="fa fa-comments-o"></i><span if="{mode == \'all\'}">あなた宛ての投稿はありません。</span><span if="{mode == \'following\'}">あなたがフォローしているユーザーからの言及はありません。</span></p><mk-timeline ref="timeline"><yield to="footer"><i class="fa fa-moon-o" if="{!parent.moreLoading}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{parent.moreLoading}"></i></yield></mk-timeline>', 'mk-mentions-home-widget,[data-is="mk-mentions-home-widget"]{display:block;background:#fff;} mk-mentions-home-widget > header,[data-is="mk-mentions-home-widget"] > header{padding:8px 16px;border-bottom:solid 1px #eee;} mk-mentions-home-widget > header > span,[data-is="mk-mentions-home-widget"] > header > span{margin-right:16px;line-height:27px;font-size:18px;color:#555;} mk-mentions-home-widget > header > span:not([data-is-active]),[data-is="mk-mentions-home-widget"] > header > span:not([data-is-active]){color:#87bb35;cursor:pointer;} mk-mentions-home-widget > header > span:not([data-is-active]):hover,[data-is="mk-mentions-home-widget"] > header > span:not([data-is-active]):hover{text-decoration:underline} mk-mentions-home-widget > .loading,[data-is="mk-mentions-home-widget"] > .loading{padding:64px 0} mk-mentions-home-widget > .empty,[data-is="mk-mentions-home-widget"] > .empty{display:block;margin:0 auto;padding:32px;max-width:400px;text-align:center;color:#999;} mk-mentions-home-widget > .empty > i,[data-is="mk-mentions-home-widget"] > .empty > i{display:block;margin-bottom:16px;font-size:3em;color:#ccc}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');

		this.isLoading = true;
		this.isEmpty = false;
		this.moreLoading = false;
		this.mode = 'all';

		this.on('mount', () => {
			document.addEventListener('keydown', this.onDocumentKeydown);
			window.addEventListener('scroll', this.onScroll);

			this.fetch(() => this.trigger('loaded'));
		});

		this.on('unmount', () => {
			document.removeEventListener('keydown', this.onDocumentKeydown);
			window.removeEventListener('scroll', this.onScroll);
		});

		this.onDocumentKeydown = e => {
			if (e.target.tagName != 'INPUT' && tag != 'TEXTAREA') {
				if (e.which == 84) {
					this.refs.timeline.focus();
				}
			}
		};

		this.fetch = cb => {
			this.api('posts/mentions', {
				following: this.mode == 'following'
			}).then(posts => {
				this.update({
					isLoading: false,
					isEmpty: posts.length == 0
				});
				this.refs.timeline.setPosts(posts);
				if (cb) cb();
			});
		};

		this.more = () => {
			if (this.moreLoading || this.isLoading || this.refs.timeline.posts.length == 0) return;
			this.update({
				moreLoading: true
			});
			this.api('posts/mentions', {
				following: this.mode == 'following',
				max_id: this.refs.timeline.tail().id
			}).then(posts => {
				this.update({
					moreLoading: false
				});
				this.refs.timeline.prependPosts(posts);
			});
		};

		this.onScroll = () => {
			const current = window.scrollY + window.innerHeight;
			if (current > document.body.offsetHeight - 8) this.more();
		};

		this.setMode = mode => {
			this.update({
				mode: mode
			});
			this.fetch();
		};
});

    
  

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-nav-home-widget', '<a href="{CONFIG.aboutUrl}">Misskeyについて</a><i>・</i><a href="{CONFIG.aboutUrl + \'/status\'}">ステータス</a><i>・</i><a href="https://github.com/syuilo/misskey">リポジトリ</a><i>・</i><a href="{CONFIG.devUrl}">開発者</a><i>・</i><a href="https://twitter.com/misskey_xyz" target="_blank">Follow us on <i class="fa fa-twitter"></i></a>', 'mk-nav-home-widget,[data-is="mk-nav-home-widget"]{display:block;padding:16px;font-size:12px;color:#aaa;background:#fff;} mk-nav-home-widget a,[data-is="mk-nav-home-widget"] a{color:#999} mk-nav-home-widget i,[data-is="mk-nav-home-widget"] i{color:#ccc}', '', function(opts) {
});

    
  

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-notifications-home-widget', '<p class="title"><i class="fa fa-bell-o"></i>Notifications</p><button onclick="{settings}" title="Settings of notifications"><i class="fa fa-cog"></i></button><mk-notifications></mk-notifications>', 'mk-notifications-home-widget,[data-is="mk-notifications-home-widget"]{display:block;background:#fff;} mk-notifications-home-widget > .title,[data-is="mk-notifications-home-widget"] > .title{z-index:1;margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;box-shadow:0 1px rgba(0,0,0,0.07);} mk-notifications-home-widget > .title > i,[data-is="mk-notifications-home-widget"] > .title > i{margin-right:4px} mk-notifications-home-widget > button,[data-is="mk-notifications-home-widget"] > button{position:absolute;z-index:2;top:0;right:0;padding:0;width:42px;font-size:.9em;line-height:42px;color:#ccc;} mk-notifications-home-widget > button:hover,[data-is="mk-notifications-home-widget"] > button:hover{color:#aaa} mk-notifications-home-widget > button:active,[data-is="mk-notifications-home-widget"] > button:active{color:#999} mk-notifications-home-widget > mk-notifications,[data-is="mk-notifications-home-widget"] > mk-notifications{max-height:300px;overflow:auto}', '', function(opts) {
		this.settings = () => {
			const w = riot.mount(document.body.appendChild(document.createElement('mk-settings-window')))[0];
			w.switch('notification');
		};
});

    
  

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-photo-stream-home-widget', '<p class="title"><i class="fa fa-camera"></i>Photostream</p><p class="initializing" if="{initializing}"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading<mk-ellipsis></mk-ellipsis></p><div class="stream" if="{!initializing && images.length > 0}"><virtual each="{image in images}"><div class="img" riot-style="{\'background-image: url(\' + image.url + \'?thumbnail&size=256)\'}"></div></virtual></div><p class="empty" if="{!initializing && images.length == 0}">No photos</p>', 'mk-photo-stream-home-widget,[data-is="mk-photo-stream-home-widget"]{display:block;background:#fff;} mk-photo-stream-home-widget > .title,[data-is="mk-photo-stream-home-widget"] > .title{z-index:1;margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;box-shadow:0 1px rgba(0,0,0,0.07);} mk-photo-stream-home-widget > .title > i,[data-is="mk-photo-stream-home-widget"] > .title > i{margin-right:4px} mk-photo-stream-home-widget > .stream,[data-is="mk-photo-stream-home-widget"] > .stream{display:-webkit-flex;display:-moz-flex;display:-ms-flex;display:flex;justify-content:center;flex-wrap:wrap;padding:8px;} mk-photo-stream-home-widget > .stream > .img,[data-is="mk-photo-stream-home-widget"] > .stream > .img{flex:1 1 33%;width:33%;height:80px;background-position:center center;background-size:cover;border:solid 2px transparent;border-radius:4px} mk-photo-stream-home-widget > .initializing,[data-is="mk-photo-stream-home-widget"] > .initializing,mk-photo-stream-home-widget > .empty,[data-is="mk-photo-stream-home-widget"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa;} mk-photo-stream-home-widget > .initializing > i,[data-is="mk-photo-stream-home-widget"] > .initializing > i,mk-photo-stream-home-widget > .empty > i,[data-is="mk-photo-stream-home-widget"] > .empty > i{margin-right:4px}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.images = [];
		this.initializing = true;

		this.on('mount', () => {
			this.stream.on('drive_file_created', this.onStreamDriveFileCreated);

			this.api('drive/stream', {
				type: 'image/*',
				limit: 9
			}).then(images => {
				this.update({
					initializing: false,
					images: images
				});
			});
		});

		this.on('unmount', () => {
			this.stream.off('drive_file_created', this.onStreamDriveFileCreated);
		});

		this.onStreamDriveFileCreated = file => {
			if (/^image\/.+$/.test(file.type)) {
				this.images.unshift(file);
				if (this.images.length > 9) this.images.pop();
				this.update();
			}
		};
});

    
  

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_input_dialog__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_update_avatar__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_update_banner__ = __webpack_require__(76);

    var riot = __webpack_require__(0)
    


riot.tag2('mk-profile-home-widget', '<div class="banner" riot-style="{I.banner_url ? \'background-image: url(\' + I.banner_url + \'?thumbnail&size=256)\' : \'\'}" onclick="{setBanner}"></div><img class="avatar" riot-src="{I.avatar_url + \'?thumbnail&size=64\'}" onclick="{setAvatar}" alt="avatar" data-user-preview="{I.id}"><a class="name" href="{CONFIG.url + \'/\' + I.username}">{I.name}</a><p class="username">@{I.username}</p>', 'mk-profile-home-widget,[data-is="mk-profile-home-widget"]{display:block;overflow:hidden;background:#fff;} mk-profile-home-widget > .banner,[data-is="mk-profile-home-widget"] > .banner{height:100px;background-color:#f5f5f5;background-size:cover;background-position:center} mk-profile-home-widget > .avatar,[data-is="mk-profile-home-widget"] > .avatar{display:block;position:absolute;top:76px;left:16px;width:58px;height:58px;margin:0;border:solid 3px #fff;border-radius:8px;vertical-align:bottom} mk-profile-home-widget > .name,[data-is="mk-profile-home-widget"] > .name{display:block;margin:10px 0 0 84px;line-height:16px;font-weight:bold;color:#555} mk-profile-home-widget > .username,[data-is="mk-profile-home-widget"] > .username{display:block;margin:4px 0 8px 84px;line-height:16px;font-size:.9em;color:#999}', '', function(opts) {

		this.mixin('i');
		this.mixin('user-preview');

		this.setAvatar = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_update_avatar__["a" /* default */])(this.I);
		};

		this.setBanner = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__scripts_update_banner__["a" /* default */])(this.I);
		};
});

    
  

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-recommended-polls-home-widget', '<p class="title"><i class="fa fa-pie-chart"></i>Polls</p><button onclick="{fetch}" title="Show others"><i class="fa fa-refresh"></i></button><div class="poll" if="{!loading && poll != null}"><p class="text" if="{poll.text}">{poll.text}</p><mk-poll post="{poll}"></mk-poll></div><p class="empty" if="{!loading && poll == null}">Nothing</p><p class="loading" if="{loading}"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading<mk-ellipsis></mk-ellipsis></p>', 'mk-recommended-polls-home-widget,[data-is="mk-recommended-polls-home-widget"]{display:block;background:#fff;} mk-recommended-polls-home-widget > .title,[data-is="mk-recommended-polls-home-widget"] > .title{margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;border-bottom:solid 1px #eee;} mk-recommended-polls-home-widget > .title > i,[data-is="mk-recommended-polls-home-widget"] > .title > i{margin-right:4px} mk-recommended-polls-home-widget > button,[data-is="mk-recommended-polls-home-widget"] > button{position:absolute;z-index:2;top:0;right:0;padding:0;width:42px;font-size:.9em;line-height:42px;color:#ccc;} mk-recommended-polls-home-widget > button:hover,[data-is="mk-recommended-polls-home-widget"] > button:hover{color:#aaa} mk-recommended-polls-home-widget > button:active,[data-is="mk-recommended-polls-home-widget"] > button:active{color:#999} mk-recommended-polls-home-widget > .poll,[data-is="mk-recommended-polls-home-widget"] > .poll{padding:16px;font-size:12px;color:#555;} mk-recommended-polls-home-widget > .poll > p,[data-is="mk-recommended-polls-home-widget"] > .poll > p{margin:0 0 8px 0} mk-recommended-polls-home-widget > .empty,[data-is="mk-recommended-polls-home-widget"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-recommended-polls-home-widget > .loading,[data-is="mk-recommended-polls-home-widget"] > .loading{margin:0;padding:16px;text-align:center;color:#aaa;} mk-recommended-polls-home-widget > .loading > i,[data-is="mk-recommended-polls-home-widget"] > .loading > i{margin-right:4px}', '', function(opts) {
		this.mixin('api');

		this.poll = null;
		this.loading = true;

		this.offset = 0;

		this.on('mount', () => {
			this.fetch();
		});

		this.fetch = () => {
			this.update({
				loading: true,
				poll: null
			});
			this.api('posts/polls/recommendation', {
				limit: 1,
				offset: this.offset
			}).then(posts => {
				const poll = posts ? posts[0] : null;
				if (poll == null) {
					this.offset = 0;
				} else {
					this.offset++;
				}
				this.update({
					loading: false,
					poll: poll
				});
			});
		};
});

    
  

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-rss-reader-home-widget', '<p class="title"><i class="fa fa-rss-square"></i>RSS</p><button onclick="{settings}" title="設定"><i class="fa fa-cog"></i></button><div class="feed" if="{!initializing}"><virtual each="{item in items}"><a href="{item.link}" target="_blank">{item.title}</a></virtual></div><p class="initializing" if="{initializing}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p>', 'mk-rss-reader-home-widget,[data-is="mk-rss-reader-home-widget"]{display:block;background:#fff;} mk-rss-reader-home-widget > .title,[data-is="mk-rss-reader-home-widget"] > .title{margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;box-shadow:0 1px rgba(0,0,0,0.07);} mk-rss-reader-home-widget > .title > i,[data-is="mk-rss-reader-home-widget"] > .title > i{margin-right:4px} mk-rss-reader-home-widget > button,[data-is="mk-rss-reader-home-widget"] > button{position:absolute;top:0;right:0;padding:0;width:42px;font-size:.9em;line-height:42px;color:#ccc;} mk-rss-reader-home-widget > button:hover,[data-is="mk-rss-reader-home-widget"] > button:hover{color:#aaa} mk-rss-reader-home-widget > button:active,[data-is="mk-rss-reader-home-widget"] > button:active{color:#999} mk-rss-reader-home-widget > .feed,[data-is="mk-rss-reader-home-widget"] > .feed{padding:12px 16px;font-size:.9em;} mk-rss-reader-home-widget > .feed > a,[data-is="mk-rss-reader-home-widget"] > .feed > a{display:block;padding:4px 0;color:#666;border-bottom:dashed 1px #eee;} mk-rss-reader-home-widget > .feed > a:last-child,[data-is="mk-rss-reader-home-widget"] > .feed > a:last-child{border-bottom:none} mk-rss-reader-home-widget > .initializing,[data-is="mk-rss-reader-home-widget"] > .initializing{margin:0;padding:16px;text-align:center;color:#aaa;} mk-rss-reader-home-widget > .initializing > i,[data-is="mk-rss-reader-home-widget"] > .initializing > i{margin-right:4px}', '', function(opts) {
		this.mixin('api');

		this.url = 'http://news.yahoo.co.jp/pickup/rss.xml';
		this.items = [];
		this.initializing = true;

		this.on('mount', () => {
			this.fetch();
			this.clock = setInterval(this.fetch, 60000);
		});

		this.on('unmount', () => {
			clearInterval(this.clock);
		});

		this.fetch = () => {
			this.api('/api:rss', {
				url: this.url
			}).then(feed => {
				this.update({
					initializing: false,
					items: feed.rss.channel.item
				});
			});
		};

		this.settings = () => {
		};
});

    
  

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-timeline-home-widget', '<mk-following-setuper if="{noFollowing}"></mk-following-setuper><div class="loading" if="{isLoading}"><mk-ellipsis-icon></mk-ellipsis-icon></div><p class="empty" if="{isEmpty}"><i class="fa fa-comments-o"></i>自分の投稿や、自分がフォローしているユーザーの投稿が表示されます。</p><mk-timeline ref="timeline"><yield to="footer"><i class="fa fa-moon-o" if="{!parent.moreLoading}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{parent.moreLoading}"></i></yield></mk-timeline>', 'mk-timeline-home-widget,[data-is="mk-timeline-home-widget"]{display:block;background:#fff;} mk-timeline-home-widget > mk-following-setuper,[data-is="mk-timeline-home-widget"] > mk-following-setuper{border-bottom:solid 1px #eee} mk-timeline-home-widget > .loading,[data-is="mk-timeline-home-widget"] > .loading{padding:64px 0} mk-timeline-home-widget > .empty,[data-is="mk-timeline-home-widget"] > .empty{display:block;margin:0 auto;padding:32px;max-width:400px;text-align:center;color:#999;} mk-timeline-home-widget > .empty > i,[data-is="mk-timeline-home-widget"] > .empty > i{display:block;margin-bottom:16px;font-size:3em;color:#ccc}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.isLoading = true;
		this.isEmpty = false;
		this.moreLoading = false;
		this.noFollowing = this.I.following_count == 0;

		this.on('mount', () => {
			this.stream.on('post', this.onStreamPost);
			this.stream.on('follow', this.onStreamFollow);
			this.stream.on('unfollow', this.onStreamUnfollow);

			document.addEventListener('keydown', this.onDocumentKeydown);
			window.addEventListener('scroll', this.onScroll);

			this.load(() => this.trigger('loaded'));
		});

		this.on('unmount', () => {
			this.stream.off('post', this.onStreamPost);
			this.stream.off('follow', this.onStreamFollow);
			this.stream.off('unfollow', this.onStreamUnfollow);

			document.removeEventListener('keydown', this.onDocumentKeydown);
			window.removeEventListener('scroll', this.onScroll);
		});

		this.onDocumentKeydown = e => {
			if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
				if (e.which == 84) {
					this.refs.timeline.focus();
				}
			}
		};

		this.load = (cb) => {
			this.api('posts/timeline').then(posts => {
				this.update({
					isLoading: false,
					isEmpty: posts.length == 0
				});
				this.refs.timeline.setPosts(posts);
				if (cb) cb();
			});
		};

		this.more = () => {
			if (this.moreLoading || this.isLoading || this.refs.timeline.posts.length == 0) return;
			this.update({
				moreLoading: true
			});
			this.api('posts/timeline', {
				max_id: this.refs.timeline.tail().id
			}).then(posts => {
				this.update({
					moreLoading: false
				});
				this.refs.timeline.prependPosts(posts);
			});
		};

		this.onStreamPost = post => {
			this.update({
				isEmpty: false
			});
			this.refs.timeline.addPost(post);
		};

		this.onStreamFollow = () => {
			this.load();
		};

		this.onStreamUnfollow = () => {
			this.load();
		};

		this.onScroll = () => {
			const current = window.scrollY + window.innerHeight;
			if (current > document.body.offsetHeight - 8) this.more();
		};
});

    
  

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-tips-home-widget', '<p ref="tip"><i class="fa fa-lightbulb-o"></i><span ref="text"></span></p>', 'mk-tips-home-widget,[data-is="mk-tips-home-widget"]{display:block;background:transparent !important;border:none !important;overflow:visible !important;} mk-tips-home-widget > p,[data-is="mk-tips-home-widget"] > p{display:block;margin:0;padding:0 12px;text-align:center;font-size:.7em;color:#999;} mk-tips-home-widget > p > i,[data-is="mk-tips-home-widget"] > p > i{margin-right:4px} mk-tips-home-widget > p kbd,[data-is="mk-tips-home-widget"] > p kbd{display:inline;padding:0 6px;margin:0 2px;font-size:1em;font-family:inherit;border:solid 1px #999;border-radius:2px}', '', function(opts) {

		this.tips = [
			'<kbd>t</kbd>でタイムラインにフォーカスできます',
			'<kbd>p</kbd>または<kbd>n</kbd>で投稿フォームを開きます',
			'投稿フォームにはファイルをドラッグ&ドロップできます',
			'投稿フォームにクリップボードにある画像データをペーストできます',
			'ドライブにファイルをドラッグ&ドロップしてアップロードできます',
			'ドライブでファイルをドラッグしてフォルダ移動できます',
			'ドライブでフォルダをドラッグしてフォルダ移動できます',
			'ホームをカスタマイズできます(準備中)',
			'MisskeyはMIT Licenseです'
		]

		this.on('mount', () => {
			this.set();
			this.clock = setInterval(this.change, 20000);
		});

		this.on('unmount', () => {
			clearInterval(this.clock);
		});

		this.set = () => {
			this.refs.text.innerHTML = this.tips[Math.floor(Math.random() * this.tips.length)];
		};

		this.change = () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.tip,
				opacity: 0,
				duration: 500,
				easing: 'linear',
				complete: this.set
			});

			setTimeout(() => {
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.refs.tip,
					opacity: 1,
					duration: 500,
					easing: 'linear'
				});
			}, 500);
		};
});

    
  

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-trends-home-widget', '<p class="title"><i class="fa fa-fire"></i>Trend</p><button onclick="{fetch}" title="Show others"><i class="fa fa-refresh"></i></button><div class="post" if="{!loading && post != null}"><p class="text"><a href="/{post.user.username}/{post.id}">{post.text}</a></p><p class="author">―<a href="/{post.user.username}">@{post.user.username}</a></p></div><p class="empty" if="{!loading && post == null}">Nothing</p><p class="loading" if="{loading}"><i class="fa fa-spinner fa-pulse fa-fw"></i>-UNTRANSLATED-<mk-ellipsis></mk-ellipsis></p>', 'mk-trends-home-widget,[data-is="mk-trends-home-widget"]{display:block;background:#fff;} mk-trends-home-widget > .title,[data-is="mk-trends-home-widget"] > .title{margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;border-bottom:solid 1px #eee;} mk-trends-home-widget > .title > i,[data-is="mk-trends-home-widget"] > .title > i{margin-right:4px} mk-trends-home-widget > button,[data-is="mk-trends-home-widget"] > button{position:absolute;z-index:2;top:0;right:0;padding:0;width:42px;font-size:.9em;line-height:42px;color:#ccc;} mk-trends-home-widget > button:hover,[data-is="mk-trends-home-widget"] > button:hover{color:#aaa} mk-trends-home-widget > button:active,[data-is="mk-trends-home-widget"] > button:active{color:#999} mk-trends-home-widget > .post,[data-is="mk-trends-home-widget"] > .post{padding:16px;font-size:12px;font-style:oblique;color:#555;} mk-trends-home-widget > .post > p,[data-is="mk-trends-home-widget"] > .post > p{margin:0} mk-trends-home-widget > .post > .text > a,[data-is="mk-trends-home-widget"] > .post > .text > a,mk-trends-home-widget > .post > .author > a,[data-is="mk-trends-home-widget"] > .post > .author > a{color:inherit} mk-trends-home-widget > .empty,[data-is="mk-trends-home-widget"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-trends-home-widget > .loading,[data-is="mk-trends-home-widget"] > .loading{margin:0;padding:16px;text-align:center;color:#aaa;} mk-trends-home-widget > .loading > i,[data-is="mk-trends-home-widget"] > .loading > i{margin-right:4px}', '', function(opts) {
		this.mixin('api');

		this.post = null;
		this.loading = true;

		this.offset = 0;

		this.on('mount', () => {
			this.fetch();
		});

		this.fetch = () => {
			this.update({
				loading: true,
				post: null
			});
			this.api('posts/trend', {
				limit: 1,
				offset: this.offset,
				repost: false,
				reply: false,
				media: false,
				poll: false
			}).then(posts => {
				const post = posts ? posts[0] : null;
				if (post == null) {
					this.offset = 0;
				} else {
					this.offset++;
				}
				this.update({
					loading: false,
					post: post
				});
			});
		};
});

    
  

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-recommendation-home-widget', '<p class="title"><i class="fa fa-users"></i>Recommended users</p><button onclick="{refresh}" title="Show others"><i class="fa fa-refresh"></i></button><div class="user" if="{!loading && users.length != 0}" each="{_user in users}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + _user.username}"><img class="avatar" riot-src="{_user.avatar_url + \'?thumbnail&size=42\'}" alt="" data-user-preview="{_user.id}"></a><div class="body"><a class="name" href="{CONFIG.url + \'/\' + _user.username}" data-user-preview="{_user.id}">{_user.name}</a><p class="username">@{_user.username}</p></div><mk-follow-button user="{_user}"></mk-follow-button></div><p class="empty" if="{!loading && users.length == 0}">No one</p><p class="loading" if="{loading}"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading<mk-ellipsis></mk-ellipsis></p>', 'mk-user-recommendation-home-widget,[data-is="mk-user-recommendation-home-widget"]{display:block;background:#fff;} mk-user-recommendation-home-widget > .title,[data-is="mk-user-recommendation-home-widget"] > .title{margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;border-bottom:solid 1px #eee;} mk-user-recommendation-home-widget > .title > i,[data-is="mk-user-recommendation-home-widget"] > .title > i{margin-right:4px} mk-user-recommendation-home-widget > button,[data-is="mk-user-recommendation-home-widget"] > button{position:absolute;z-index:2;top:0;right:0;padding:0;width:42px;font-size:.9em;line-height:42px;color:#ccc;} mk-user-recommendation-home-widget > button:hover,[data-is="mk-user-recommendation-home-widget"] > button:hover{color:#aaa} mk-user-recommendation-home-widget > button:active,[data-is="mk-user-recommendation-home-widget"] > button:active{color:#999} mk-user-recommendation-home-widget > .user,[data-is="mk-user-recommendation-home-widget"] > .user{padding:16px;border-bottom:solid 1px #eee;} mk-user-recommendation-home-widget > .user:last-child,[data-is="mk-user-recommendation-home-widget"] > .user:last-child{border-bottom:none} mk-user-recommendation-home-widget > .user:after,[data-is="mk-user-recommendation-home-widget"] > .user:after{content:"";display:block;clear:both} mk-user-recommendation-home-widget > .user > .avatar-anchor,[data-is="mk-user-recommendation-home-widget"] > .user > .avatar-anchor{display:block;float:left;margin:0 12px 0 0;} mk-user-recommendation-home-widget > .user > .avatar-anchor > .avatar,[data-is="mk-user-recommendation-home-widget"] > .user > .avatar-anchor > .avatar{display:block;width:42px;height:42px;margin:0;border-radius:8px;vertical-align:bottom} mk-user-recommendation-home-widget > .user > .body,[data-is="mk-user-recommendation-home-widget"] > .user > .body{float:left;width:calc(100% - 54px);} mk-user-recommendation-home-widget > .user > .body > .name,[data-is="mk-user-recommendation-home-widget"] > .user > .body > .name{margin:0;font-size:16px;line-height:24px;color:#555} mk-user-recommendation-home-widget > .user > .body > .username,[data-is="mk-user-recommendation-home-widget"] > .user > .body > .username{display:block;margin:0;font-size:15px;line-height:16px;color:#ccc} mk-user-recommendation-home-widget > .user > mk-follow-button,[data-is="mk-user-recommendation-home-widget"] > .user > mk-follow-button{position:absolute;top:16px;right:16px} mk-user-recommendation-home-widget > .empty,[data-is="mk-user-recommendation-home-widget"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-user-recommendation-home-widget > .loading,[data-is="mk-user-recommendation-home-widget"] > .loading{margin:0;padding:16px;text-align:center;color:#aaa;} mk-user-recommendation-home-widget > .loading > i,[data-is="mk-user-recommendation-home-widget"] > .loading > i{margin-right:4px}', '', function(opts) {
		this.mixin('api');
		this.mixin('user-preview');

		this.users = null;
		this.loading = true;

		this.limit = 3;
		this.page = 0;

		this.on('mount', () => {
			this.fetch();
		});

		this.fetch = () => {
			this.update({
				loading: true,
				users: null
			});
			this.api('users/recommendation', {
				limit: this.limit,
				offset: this.limit * this.page
			}).then(users => {
				this.update({
					loading: false,
					users: users
				});
			});
		};

		this.refresh = () => {
			if (this.users.length < this.limit) {
				this.page = 0;
			} else {
				this.page++;
			}
			this.fetch();
		};
});

    
  

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-version-home-widget', '<p>ver{version}</p>', 'mk-version-home-widget,[data-is="mk-version-home-widget"]{display:block;background:transparent !important;border:none !important;overflow:visible !important;} mk-version-home-widget > p,[data-is="mk-version-home-widget"] > p{display:block;margin:0;padding:0 12px;text-align:center;font-size:.7em;color:#aaa}', '', function(opts) {
		this.version = "0.0.1490";
});

    
  

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-home', '<div class="main"><div class="left" ref="left"></div><main><mk-timeline-home-widget ref="tl" if="{mode == \'timeline\'}"></mk-timeline-home-widget><mk-mentions-home-widget ref="tl" if="{mode == \'mentions\'}"></mk-mentions-home-widget></main><div class="right" ref="right"></div></div>', 'mk-home,[data-is="mk-home"]{display:block;} mk-home > .main,[data-is="mk-home"] > .main{margin:0 auto;max-width:1200px;} mk-home > .main:after,[data-is="mk-home"] > .main:after{content:"";display:block;clear:both} mk-home > .main > *,[data-is="mk-home"] > .main > *{float:left;} mk-home > .main > * > *,[data-is="mk-home"] > .main > * > *{display:block;border:solid 1px rgba(0,0,0,0.075);border-radius:6px;} mk-home > .main > * > *:not(:last-child),[data-is="mk-home"] > .main > * > *:not(:last-child){margin-bottom:16px} mk-home > .main > main,[data-is="mk-home"] > .main > main{padding:16px;width:calc(100% - 275px * 2)} mk-home > .main > *:not(main),[data-is="mk-home"] > .main > *:not(main){width:275px} mk-home > .main > .left,[data-is="mk-home"] > .main > .left{padding:16px 0 16px 16px} mk-home > .main > .right,[data-is="mk-home"] > .main > .right{padding:16px 16px 16px 0}@media (max-width:1100px){ mk-home > .main > *:not(main),[data-is="mk-home"] > .main > *:not(main){display:none} mk-home > .main > main,[data-is="mk-home"] > .main > main{float:none;width:100%;max-width:700px;margin:0 auto}}', '', function(opts) {
		this.mixin('i');

		this.mode = this.opts.mode || 'timeline';

		if (this.mode == '') this.mode = 'timeline';

		const _home = {
			left: [
				'profile',
				'calendar',
				'rss-reader',
				'trends',
				'photo-stream',
				'version'
			],
			right: [
				'broadcast',
				'notifications',
				'user-recommendation',
				'recommended-polls',
				'donation',
				'nav',
				'tips'
			]
		};

		this.home = [];

		this.on('mount', () => {
			this.refs.tl.on('loaded', () => {
				this.trigger('loaded');
			});

			_home.left.forEach(widget => {
				const el = document.createElement(`mk-${widget}-home-widget`);
				this.refs.left.appendChild(el);
				this.home.push(riot.mount(el)[0]);
			});

			_home.right.forEach(widget => {
				const el = document.createElement(`mk-${widget}-home-widget`);
				this.refs.right.appendChild(el);
				this.home.push(riot.mount(el)[0]);
			});
		});

		this.on('unmount', () => {
			this.home.forEach(widget => {
				widget.unmount();
			});
		});
});

    
  

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-image-dialog', '<div class="bg" ref="bg" onclick="{close}"></div><img ref="img" riot-src="{image.url}" alt="{image.name}" title="{image.name}" onclick="{close}">', 'mk-image-dialog,[data-is="mk-image-dialog"]{display:block;position:fixed;z-index:2048;top:0;left:0;width:100%;height:100%;opacity:0;} mk-image-dialog > .bg,[data-is="mk-image-dialog"] > .bg{display:block;position:fixed;z-index:1;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7)} mk-image-dialog > img,[data-is="mk-image-dialog"] > img{position:fixed;z-index:2;top:0;right:0;bottom:0;left:0;max-width:100%;max-height:100%;margin:auto;cursor:zoom-out}', '', function(opts) {

		this.image = this.opts.image;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 1,
				duration: 100,
				easing: 'linear'
			});
		});

		this.close = () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 0,
				duration: 100,
				easing: 'linear',
				complete: () => this.unmount()
			});
		};
});

    
  

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-images-viewer', '<div class="image" ref="view" onmousemove="{mousemove}" riot-style="{\'background-image: url(\' + image.url + \'?thumbnail\'}" onclick="{click}"><img riot-src="{image.url + \'?thumbnail&size=512\'}" alt="{image.name}" title="{image.name}"></div>', 'mk-images-viewer,[data-is="mk-images-viewer"]{display:block;padding:8px;overflow:hidden;box-shadow:0 0 4px rgba(0,0,0,0.2);border-radius:4px;} mk-images-viewer > .image,[data-is="mk-images-viewer"] > .image{cursor:zoom-in;} mk-images-viewer > .image > img,[data-is="mk-images-viewer"] > .image > img{display:block;max-height:256px;max-width:100%;margin:0 auto} mk-images-viewer > .image:hover > img,[data-is="mk-images-viewer"] > .image:hover > img{visibility:hidden} mk-images-viewer > .image:not(:hover),[data-is="mk-images-viewer"] > .image:not(:hover){background-image:none !important}', '', function(opts) {
		this.images = this.opts.images;
		this.image = this.images[0];

		this.mousemove = e => {
			const rect = this.refs.view.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const xp = mouseX / this.refs.view.offsetWidth * 100;
			const yp = mouseY / this.refs.view.offsetHeight * 100;
			this.refs.view.style.backgroundPosition = xp + '% ' + yp + '%';
		};

		this.click = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-image-dialog')), {
				image: this.image
			});
		};
});

    
  

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-input-dialog', '<mk-window ref="window" is-modal="{true}" width="{\'500px\'}"><yield to="header"><i class="fa fa-i-cursor"></i>{parent.title} </yield><yield to="content"><div class="body"><input ref="text" oninput="{parent.update}" onkeydown="{parent.onKeydown}" placeholder="{parent.placeholder}"></div><div class="action"><button class="cancel" onclick="{parent.cancel}">キャンセル</button><button class="ok" disabled="{!parent.allowEmpty && refs.text.value.length == 0}" onclick="{parent.ok}">決定</button></div></yield></mk-window>', 'mk-input-dialog,[data-is="mk-input-dialog"]{display:block;} mk-input-dialog > mk-window [data-yield=\'header\'] > i,[data-is="mk-input-dialog"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-input-dialog > mk-window [data-yield=\'content\'] > .body,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .body{padding:16px;} mk-input-dialog > mk-window [data-yield=\'content\'] > .body > input,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .body > input{display:block;padding:8px;margin:0;width:100%;max-width:100%;min-width:100%;font-size:1em;color:#333;background:#fff;outline:none;border:solid 1px rgba(135,187,53,0.1);border-radius:4px;transition:border-color .3s ease;} mk-input-dialog > mk-window [data-yield=\'content\'] > .body > input:hover,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .body > input:hover{border-color:rgba(135,187,53,0.2);transition:border-color .1s ease} mk-input-dialog > mk-window [data-yield=\'content\'] > .body > input:focus,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .body > input:focus{color:#87bb35;border-color:rgba(135,187,53,0.5);transition:border-color 0s ease} mk-input-dialog > mk-window [data-yield=\'content\'] > .body > input::-webkit-input-placeholder,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .body > input::-webkit-input-placeholder{color:rgba(135,187,53,0.3)} mk-input-dialog > mk-window [data-yield=\'content\'] > .action,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action{height:72px;background:#f9fcf4;} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok,mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel{display:block;position:absolute;bottom:16px;cursor:pointer;padding:0;margin:0;width:120px;height:40px;font-size:1em;outline:none;border-radius:4px;} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok:focus:after,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok:focus:after,mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel:focus:after,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok:disabled,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok:disabled,mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel:disabled,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel:disabled{opacity:.7;cursor:default} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok{right:16px;color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok:not(:disabled),[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok:not(:disabled){font-weight:bold} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok:hover:not(:disabled),[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .ok:active:not(:disabled),[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .ok:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel{right:148px;color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel:hover,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-input-dialog > mk-window [data-yield=\'content\'] > .action .cancel:active,[data-is="mk-input-dialog"] > mk-window [data-yield=\'content\'] > .action .cancel:active{background:#ececec;border-color:#dcdcdc}', '', function(opts) {
		this.done = false;

		this.title = this.opts.title;
		this.placeholder = this.opts.placeholder;
		this.default = this.opts.default;
		this.allowEmpty = this.opts.allowEmpty != null ? this.opts.allowEmpty : true;

		this.on('mount', () => {
			this.text = this.refs.window.refs.text;
			if (this.default) this.text.value = this.default;
			this.text.focus();

			this.refs.window.on('closing', () => {
				if (this.done) {
					this.opts.onOk(this.text.value);
				} else {
					if (this.opts.onCancel) this.opts.onCancel();
				}
			});

			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});

		this.cancel = () => {
			this.done = false;
			this.refs.window.close();
		};

		this.ok = () => {
			if (!this.allowEmpty && this.text.value == '') return;
			this.done = true;
			this.refs.window.close();
		};

		this.onKeydown = e => {
			if (e.which == 13) {
				e.preventDefault();
				e.stopPropagation();
				this.ok();
			}
		};
});

    
  

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-list-user', '<a class="avatar-anchor" href="{CONFIG.url + \'/\' + user.username}"><img class="avatar" riot-src="{user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + user.username}">{user.name}</a><span class="username">@{user.username}</span></header><div class="body"><p class="followed" if="{user.is_followed}">フォローされています</p><div class="description">{user.description}</div></div></div><mk-follow-button user="{user}"></mk-follow-button>', 'mk-list-user,[data-is="mk-list-user"]{display:block;margin:0;padding:16px;font-size:16px;} mk-list-user:after,[data-is="mk-list-user"]:after{content:"";display:block;clear:both} mk-list-user > .avatar-anchor,[data-is="mk-list-user"] > .avatar-anchor{display:block;float:left;margin:0 16px 0 0;} mk-list-user > .avatar-anchor > .avatar,[data-is="mk-list-user"] > .avatar-anchor > .avatar{display:block;width:58px;height:58px;margin:0;border-radius:8px;vertical-align:bottom} mk-list-user > .main,[data-is="mk-list-user"] > .main{float:left;width:calc(100% - 74px);} mk-list-user > .main > header,[data-is="mk-list-user"] > .main > header{margin-bottom:2px;} mk-list-user > .main > header > .name,[data-is="mk-list-user"] > .main > header > .name{display:inline;margin:0;padding:0;color:#777;font-size:1em;font-weight:700;text-align:left;text-decoration:none;} mk-list-user > .main > header > .name:hover,[data-is="mk-list-user"] > .main > header > .name:hover{text-decoration:underline} mk-list-user > .main > header > .username,[data-is="mk-list-user"] > .main > header > .username{text-align:left;margin:0 0 0 8px;color:#ccc} mk-list-user > .main > .body > .followed,[data-is="mk-list-user"] > .main > .body > .followed{display:inline-block;margin:0 0 4px 0;padding:2px 8px;vertical-align:top;font-size:10px;color:#71afc7;background:#eefaff;border-radius:4px} mk-list-user > .main > .body > .description,[data-is="mk-list-user"] > .main > .body > .description{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.1em;color:#717171} mk-list-user > mk-follow-button,[data-is="mk-list-user"] > mk-follow-button{position:absolute;top:16px;right:16px}', '', function(opts) {
this.user = this.opts.user
});

    
  

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-messaging-room-window', '<mk-window ref="window" is-modal="{false}" width="{\'500px\'}" height="{\'560px\'}"><yield to="header"><i class="fa fa-comments"></i>メッセージ: {parent.user.name}</yield><yield to="content"><mk-messaging-room user="{parent.user}"></mk-messaging-room></yield></mk-window>', 'mk-messaging-room-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-messaging-room-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-messaging-room-window > mk-window [data-yield=\'content\'] > mk-messaging-room,[data-is="mk-messaging-room-window"] > mk-window [data-yield=\'content\'] > mk-messaging-room{height:100%;overflow:auto}', '', function(opts) {
		this.user = this.opts.user;

		this.on('mount', () => {
			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});
});

    
  

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-messaging-window', '<mk-window ref="window" is-modal="{false}" width="{\'500px\'}" height="{\'560px\'}"><yield to="header"><i class="fa fa-comments"></i>メッセージ</yield><yield to="content"><mk-messaging ref="index"></mk-messaging></yield></mk-window>', 'mk-messaging-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-messaging-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-messaging-window > mk-window [data-yield=\'content\'] > mk-messaging,[data-is="mk-messaging-window"] > mk-window [data-yield=\'content\'] > mk-messaging{height:100%;overflow:auto}', '', function(opts) {
		this.on('mount', () => {
			this.refs.window.on('closed', () => {
				this.unmount();
			});

			this.refs.window.refs.index.on('navigate-user', user => {
				riot.mount(document.body.appendChild(document.createElement('mk-messaging-room-window')), {
					user: user
				});
			});
		});
});

    
  

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__ = __webpack_require__(9);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-notifications', '<div class="notifications" if="{notifications.length != 0}"><virtual each="{notification, i in notifications}"><div class="notification {notification.type}"><mk-time time="{notification.created_at}"></mk-time><virtual if="{notification.type == \'reaction\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><mk-reaction-icon reaction="{notification.reaction}"></mk-reaction-icon><a href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}">{notification.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'repost\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-retweet"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}">{notification.post.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post.repost)}</a></div></virtual><virtual if="{notification.type == \'quote\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-quote-left"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'follow\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-user-plus"></i><a href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}">{notification.user.name}</a></p></div></virtual><virtual if="{notification.type == \'reply\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-reply"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'mention\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}"><img class="avatar" riot-src="{notification.post.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-at"></i><a href="{CONFIG.url + \'/\' + notification.post.user.username}" data-user-preview="{notification.post.user_id}">{notification.post.user.name}</a></p><a class="post-preview" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual><virtual if="{notification.type == \'poll_vote\'}"><a class="avatar-anchor" href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}"><img class="avatar" riot-src="{notification.user.avatar_url + \'?thumbnail&size=48\'}" alt="avatar"></a><div class="text"><p><i class="fa fa-pie-chart"></i><a href="{CONFIG.url + \'/\' + notification.user.username}" data-user-preview="{notification.user.id}">{notification.user.name}</a></p><a class="post-ref" href="{CONFIG.url + \'/\' + notification.post.user.username + \'/\' + notification.post.id}">{getPostSummary(notification.post)}</a></div></virtual></div><p class="date" if="{i != notifications.length - 1 && notification._date != notifications[i + 1]._date}"><span><i class="fa fa-angle-up"></i>{notification._datetext}</span><span><i class="fa fa-angle-down"></i>{notifications[i + 1]._datetext}</span></p></virtual></div><p class="empty" if="{notifications.length == 0 && !loading}">ありません！</p><p class="loading" if="{loading}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p>', 'mk-notifications,[data-is="mk-notifications"]{display:block;} mk-notifications > .notifications > .notification,[data-is="mk-notifications"] > .notifications > .notification{margin:0;padding:16px;overflow-wrap:break-word;font-size:.9em;border-bottom:solid 1px rgba(0,0,0,0.05);} mk-notifications > .notifications > .notification:last-child,[data-is="mk-notifications"] > .notifications > .notification:last-child{border-bottom:none} mk-notifications > .notifications > .notification > mk-time,[data-is="mk-notifications"] > .notifications > .notification > mk-time{display:inline;position:absolute;top:16px;right:12px;vertical-align:top;color:rgba(0,0,0,0.6);font-size:small} mk-notifications > .notifications > .notification:after,[data-is="mk-notifications"] > .notifications > .notification:after{content:"";display:block;clear:both} mk-notifications > .notifications > .notification > .avatar-anchor,[data-is="mk-notifications"] > .notifications > .notification > .avatar-anchor{display:block;float:left;position:-webkit-sticky;position:sticky;top:16px;} mk-notifications > .notifications > .notification > .avatar-anchor > img,[data-is="mk-notifications"] > .notifications > .notification > .avatar-anchor > img{display:block;min-width:36px;min-height:36px;max-width:36px;max-height:36px;border-radius:6px} mk-notifications > .notifications > .notification > .text,[data-is="mk-notifications"] > .notifications > .notification > .text{float:right;width:calc(100% - 36px);padding-left:8px;} mk-notifications > .notifications > .notification > .text p,[data-is="mk-notifications"] > .notifications > .notification > .text p{margin:0;} mk-notifications > .notifications > .notification > .text p i,[data-is="mk-notifications"] > .notifications > .notification > .text p i,mk-notifications > .notifications > .notification > .text p mk-reaction-icon,[data-is="mk-notifications"] > .notifications > .notification > .text p mk-reaction-icon{margin-right:4px} mk-notifications > .notifications > .notification .post-preview,[data-is="mk-notifications"] > .notifications > .notification .post-preview{color:rgba(0,0,0,0.7)} mk-notifications > .notifications > .notification .post-ref,[data-is="mk-notifications"] > .notifications > .notification .post-ref{color:rgba(0,0,0,0.7);} mk-notifications > .notifications > .notification .post-ref:before,[data-is="mk-notifications"] > .notifications > .notification .post-ref:before,mk-notifications > .notifications > .notification .post-ref:after,[data-is="mk-notifications"] > .notifications > .notification .post-ref:after{font-family:FontAwesome;font-size:1em;font-weight:normal;font-style:normal;display:inline-block;margin-right:3px} mk-notifications > .notifications > .notification .post-ref:before,[data-is="mk-notifications"] > .notifications > .notification .post-ref:before{content:"\\f10d"} mk-notifications > .notifications > .notification .post-ref:after,[data-is="mk-notifications"] > .notifications > .notification .post-ref:after{content:"\\f10e"} mk-notifications > .notifications > .notification.repost .text p i,[data-is="mk-notifications"] > .notifications > .notification.repost .text p i,mk-notifications > .notifications > .notification.quote .text p i,[data-is="mk-notifications"] > .notifications > .notification.quote .text p i{color:#77b255} mk-notifications > .notifications > .notification.follow .text p i,[data-is="mk-notifications"] > .notifications > .notification.follow .text p i{color:#53c7ce} mk-notifications > .notifications > .notification.reply .text p i,[data-is="mk-notifications"] > .notifications > .notification.reply .text p i,mk-notifications > .notifications > .notification.mention .text p i,[data-is="mk-notifications"] > .notifications > .notification.mention .text p i{color:#555} mk-notifications > .notifications > .date,[data-is="mk-notifications"] > .notifications > .date{display:block;margin:0;line-height:32px;text-align:center;font-size:.8em;color:#aaa;background:#fdfdfd;border-bottom:solid 1px rgba(0,0,0,0.05);} mk-notifications > .notifications > .date span,[data-is="mk-notifications"] > .notifications > .date span{margin:0 16px} mk-notifications > .notifications > .date i,[data-is="mk-notifications"] > .notifications > .date i{margin-right:8px} mk-notifications > .empty,[data-is="mk-notifications"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa} mk-notifications > .loading,[data-is="mk-notifications"] > .loading{margin:0;padding:16px;text-align:center;color:#aaa;} mk-notifications > .loading > i,[data-is="mk-notifications"] > .loading > i{margin-right:4px}', '', function(opts) {
		this.getPostSummary = __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_post_summary__["a" /* default */];

		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');
		this.mixin('user-preview');

		this.notifications = [];
		this.loading = true;

		this.on('mount', () => {
			this.api('i/notifications').then(notifications => {
				this.update({
					loading: false,
					notifications: notifications
				});
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
/* 141 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance', '<main><img src="/assets/title.svg" alt="Misskey"><mk-entrance-signin if="{mode == \'signin\'}"></mk-entrance-signin><mk-entrance-signup if="{mode == \'signup\'}"></mk-entrance-signup><div class="introduction" if="{mode == \'introduction\'}"><mk-introduction></mk-introduction><button onclick="{signin}">わかった</button></div></main><mk-forkit></mk-forkit><section class="tl"><h2>投稿を見てみよう</h2><mk-public-timeline></mk-public-timeline></section><footer><mk-copyright></mk-copyright></footer>', 'mk-entrance #wait,[data-is="mk-entrance"] #wait{right:auto;left:15px} mk-entrance,[data-is="mk-entrance"]{display:block;height:100%;} mk-entrance > main,[data-is="mk-entrance"] > main{display:block;padding-bottom:16px;} mk-entrance > main > img,[data-is="mk-entrance"] > main > img{display:block;width:160px;height:170px;margin:0 auto;pointer-events:none;user-select:none} mk-entrance > main > .introduction,[data-is="mk-entrance"] > main > .introduction{max-width:360px;margin:0 auto;color:#777;} mk-entrance > main > .introduction > mk-introduction,[data-is="mk-entrance"] > main > .introduction > mk-introduction{padding:32px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.2)} mk-entrance > main > .introduction > button,[data-is="mk-entrance"] > main > .introduction > button{display:block;margin:16px auto 0 auto;color:#666;} mk-entrance > main > .introduction > button:hover,[data-is="mk-entrance"] > main > .introduction > button:hover{text-decoration:underline} mk-entrance > .tl,[data-is="mk-entrance"] > .tl{padding:32px 0;background:#fff;} mk-entrance > .tl > h2,[data-is="mk-entrance"] > .tl > h2{display:block;margin:0;padding:0;text-align:center;font-size:20px;color:#5b6b73} mk-entrance > .tl > mk-public-timeline,[data-is="mk-entrance"] > .tl > mk-public-timeline{max-width:500px;margin:0 auto} mk-entrance > footer > mk-copyright,[data-is="mk-entrance"] > footer > mk-copyright{margin:0;text-align:center;line-height:64px;font-size:10px;color:rgba(0,0,0,0.5)}', '', function(opts) {
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
/* 142 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance-signin', '<a class="help" href="{CONFIG.aboutUrl + \'/help\'}" title="お困りですか？"><i class="fa fa-question"></i></a><div class="form"><h1><img if="{user}" riot-src="{user.avatar_url + \'?thumbnail&size=32\'}"><p>{user ? user.name : \'アカウント\'}</p></h1><mk-signin ref="signin"></mk-signin></div><div class="divider"><span>or</span></div><button class="signup" onclick="{parent.signup}">新規登録</button><a class="introduction" onclick="{introduction}">Misskeyについて</a>', 'mk-entrance-signin,[data-is="mk-entrance-signin"]{display:block;width:290px;margin:0 auto;text-align:center;} mk-entrance-signin:hover > .help,[data-is="mk-entrance-signin"]:hover > .help{opacity:1} mk-entrance-signin > .help,[data-is="mk-entrance-signin"] > .help{cursor:pointer;display:block;position:absolute;top:0;right:0;z-index:1;margin:0;padding:0;font-size:1.2em;color:#999;border:none;outline:none;background:transparent;opacity:0;transition:opacity .1s ease;} mk-entrance-signin > .help:hover,[data-is="mk-entrance-signin"] > .help:hover{color:#444} mk-entrance-signin > .help:active,[data-is="mk-entrance-signin"] > .help:active{color:#222} mk-entrance-signin > .help > i,[data-is="mk-entrance-signin"] > .help > i{padding:14px} mk-entrance-signin > .form,[data-is="mk-entrance-signin"] > .form{padding:10px 28px 16px 28px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.2);} mk-entrance-signin > .form > h1,[data-is="mk-entrance-signin"] > .form > h1{display:block;margin:0;padding:0;height:54px;line-height:54px;text-align:center;text-transform:uppercase;font-size:1em;font-weight:bold;color:rgba(0,0,0,0.5);border-bottom:solid 1px rgba(0,0,0,0.1);} mk-entrance-signin > .form > h1 > p,[data-is="mk-entrance-signin"] > .form > h1 > p{display:inline;margin:0;padding:0} mk-entrance-signin > .form > h1 > img,[data-is="mk-entrance-signin"] > .form > h1 > img{display:inline-block;top:10px;width:32px;height:32px;margin-right:8px;border-radius:100%;} mk-entrance-signin > .form > h1 > img[src=\'\'],[data-is="mk-entrance-signin"] > .form > h1 > img[src=\'\']{display:none} mk-entrance-signin > .divider,[data-is="mk-entrance-signin"] > .divider{padding:16px 0;text-align:center;} mk-entrance-signin > .divider:after,[data-is="mk-entrance-signin"] > .divider:after{content:"";display:block;position:absolute;top:50%;width:100%;height:1px;border-top:solid 1px rgba(0,0,0,0.1)} mk-entrance-signin > .divider > *,[data-is="mk-entrance-signin"] > .divider > *{z-index:1;padding:0 8px;color:rgba(0,0,0,0.5);background:#fdfdfd} mk-entrance-signin > .signup,[data-is="mk-entrance-signin"] > .signup{width:100%;line-height:56px;font-size:1em;color:#fff;background:#87bb35;border-radius:64px;} mk-entrance-signin > .signup:hover,[data-is="mk-entrance-signin"] > .signup:hover{background:#8fc638} mk-entrance-signin > .signup:active,[data-is="mk-entrance-signin"] > .signup:active{background:#80b232} mk-entrance-signin > .introduction,[data-is="mk-entrance-signin"] > .introduction{display:inline-block;margin-top:16px;font-size:12px;color:#666}', '', function(opts) {
		this.on('mount', () => {
			this.refs.signin.on('user', user => {
				this.update({
					user: user
				});
			});
		});

		this.introduction = () => {
			this.parent.introduction();
		};
});

    
  

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-entrance-signup', '<mk-signup></mk-signup><button class="cancel" type="button" onclick="{parent.signin}" title="キャンセル"><i class="fa fa-times"></i></button>', 'mk-entrance-signup,[data-is="mk-entrance-signup"]{display:block;width:368px;margin:0 auto;} mk-entrance-signup:hover > .cancel,[data-is="mk-entrance-signup"]:hover > .cancel{opacity:1} mk-entrance-signup > mk-signup,[data-is="mk-entrance-signup"] > mk-signup{padding:18px 32px 0 32px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.2)} mk-entrance-signup > .cancel,[data-is="mk-entrance-signup"] > .cancel{cursor:pointer;display:block;position:absolute;top:0;right:0;z-index:1;margin:0;padding:0;font-size:1.2em;color:#999;border:none;outline:none;box-shadow:none;background:transparent;opacity:0;transition:opacity .1s ease;} mk-entrance-signup > .cancel:hover,[data-is="mk-entrance-signup"] > .cancel:hover{color:#555} mk-entrance-signup > .cancel:active,[data-is="mk-entrance-signup"] > .cancel:active{color:#222} mk-entrance-signup > .cancel > i,[data-is="mk-entrance-signup"] > .cancel > i{padding:14px}', '', function(opts) {
});

    
  

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__ = __webpack_require__(9);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-home-page', '<mk-ui ref="ui" page="{page}"><mk-home ref="home" mode="{parent.opts.mode}"></mk-home></mk-ui>', 'mk-home-page,[data-is="mk-home-page"]{display:block}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.unreadCount = 0;

		this.page = this.opts.mode || 'timeline';

		this.on('mount', () => {
			this.refs.ui.refs.home.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].done();
			});
			document.title = 'Misskey';
			__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].start();
			this.stream.on('post', this.onStreamPost);
			document.addEventListener('visibilitychange', this.windowOnVisibilitychange, false);
		});

		this.on('unmount', () => {
			this.stream.off('post', this.onStreamPost);
			document.removeEventListener('visibilitychange', this.windowOnVisibilitychange);
		});

		this.onStreamPost = post => {
			if (document.hidden && post.user_id != this.I.id) {
				this.unreadCount++;
				document.title = `(${this.unreadCount}) ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_get_post_summary__["a" /* default */])(post)}`;
			}
		};

		this.windowOnVisibilitychange = () => {
			if (!document.hidden) {
				this.unreadCount = 0;
				document.title = 'Misskey';
			}
		};
});

    
  

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-not-found', '<mk-ui><main><h1>Not Found</h1></main></mk-ui>', 'mk-not-found,[data-is="mk-not-found"]{display:block}', '', function(opts) {
});

    
  

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-post-page', '<mk-ui ref="ui"><main><mk-post-detail ref="detail" post="{parent.post}"></mk-post-detail></main></mk-ui>', 'mk-post-page,[data-is="mk-post-page"]{display:block;} mk-post-page main,[data-is="mk-post-page"] main{padding:16px;} mk-post-page main > mk-post-detail,[data-is="mk-post-page"] main > mk-post-detail{margin:0 auto}', '', function(opts) {

		this.post = this.opts.post;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.detail.on('post-fetched', () => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].set(0.5);
			});

			this.refs.ui.refs.detail.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-search-page', '<mk-ui ref="ui"><mk-search ref="search" query="{parent.opts.query}"></mk-search></mk-ui>', 'mk-search-page,[data-is="mk-search-page"]{display:block}', '', function(opts) {

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.search.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__ = __webpack_require__(6);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-user-page', '<mk-ui ref="ui"><mk-user ref="user" user="{parent.user}" page="{parent.opts.page}"></mk-user></mk-ui>', 'mk-user-page,[data-is="mk-user-page"]{display:block}', '', function(opts) {

		this.user = this.opts.user;

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].start();

			this.refs.ui.refs.user.on('user-fetched', user => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].set(0.5);
				document.title = user.name + ' | Misskey'
			});

			this.refs.ui.refs.user.on('loaded', () => {
				__WEBPACK_IMPORTED_MODULE_0__common_scripts_loading__["a" /* default */].done();
			});
		});
});

    
  

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__ = __webpack_require__(68);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-post-detail-sub', '<a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar" data-user-preview="{post.user_id}"></a><div class="main"><header><div class="left"><a class="name" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}">{post.user.name}</a><span class="username">@{post.user.username}</span></div><div class="right"><a class="time" href="{\'/\' + this.post.user.username + \'/\' + this.post.id}"><mk-time time="{post.created_at}"></mk-time></a></div></header><div class="body"><div class="text" ref="text"></div><div class="media" if="{post.media}"><virtual each="{file in post.media}"><img riot-src="{file.url + \'?thumbnail&size=512\'}" alt="{file.name}" title="{file.name}"></virtual></div></div></div>', 'mk-post-detail-sub,[data-is="mk-post-detail-sub"]{display:block;margin:0;padding:20px 32px;background:#fdfdfd;} mk-post-detail-sub:after,[data-is="mk-post-detail-sub"]:after{content:"";display:block;clear:both} mk-post-detail-sub:hover > .main > footer > button,[data-is="mk-post-detail-sub"]:hover > .main > footer > button{color:#888} mk-post-detail-sub > .avatar-anchor,[data-is="mk-post-detail-sub"] > .avatar-anchor{display:block;float:left;margin:0 16px 0 0;} mk-post-detail-sub > .avatar-anchor > .avatar,[data-is="mk-post-detail-sub"] > .avatar-anchor > .avatar{display:block;width:44px;height:44px;margin:0;border-radius:4px;vertical-align:bottom} mk-post-detail-sub > .main,[data-is="mk-post-detail-sub"] > .main{float:left;width:calc(100% - 60px);} mk-post-detail-sub > .main > header,[data-is="mk-post-detail-sub"] > .main > header{margin-bottom:4px;white-space:nowrap;} mk-post-detail-sub > .main > header:after,[data-is="mk-post-detail-sub"] > .main > header:after{content:"";display:block;clear:both} mk-post-detail-sub > .main > header > .left,[data-is="mk-post-detail-sub"] > .main > header > .left{float:left;} mk-post-detail-sub > .main > header > .left > .name,[data-is="mk-post-detail-sub"] > .main > header > .left > .name{display:inline;margin:0;padding:0;color:#777;font-size:1em;font-weight:700;text-align:left;text-decoration:none;} mk-post-detail-sub > .main > header > .left > .name:hover,[data-is="mk-post-detail-sub"] > .main > header > .left > .name:hover{text-decoration:underline} mk-post-detail-sub > .main > header > .left > .username,[data-is="mk-post-detail-sub"] > .main > header > .left > .username{text-align:left;margin:0 0 0 8px;color:#ccc} mk-post-detail-sub > .main > header > .right,[data-is="mk-post-detail-sub"] > .main > header > .right{float:right;} mk-post-detail-sub > .main > header > .right > .time,[data-is="mk-post-detail-sub"] > .main > header > .right > .time{font-size:.9em;color:#c0c0c0} mk-post-detail-sub > .main > .body > .text,[data-is="mk-post-detail-sub"] > .main > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1em;color:#717171;} mk-post-detail-sub > .main > .body > .text > mk-url-preview,[data-is="mk-post-detail-sub"] > .main > .body > .text > mk-url-preview{margin-top:8px} mk-post-detail-sub > .main > .body > .media > img,[data-is="mk-post-detail-sub"] > .main > .body > .media > img{display:block;max-width:100%}', 'title="{title}"', function(opts) {

		this.mixin('api');
		this.mixin('user-preview');

		this.post = this.opts.post;
		this.title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__["a" /* default */])(this.post.created_at);

		this.on('mount', () => {
			if (this.post.text) {
				const tokens = this.post.ast;

				this.refs.text.innerHTML = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__["a" /* default */])(tokens);

				this.refs.text.children.forEach(e => {
					if (e.tagName == 'MK-URL') riot.mount(e);
				});
			}
		});

		this.like = () => {
			if (this.post.is_liked) {
				this.api('posts/likes/delete', {
					post_id: this.post.id
				}).then(() => {
					this.post.is_liked = false;
					this.update();
				});
			} else {
				this.api('posts/likes/create', {
					post_id: this.post.id
				}).then(() => {
					this.post.is_liked = true;
					this.update();
				});
			}
		};
});

    
  

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__ = __webpack_require__(68);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-post-detail', '<div class="fetching" if="{fetching}"><mk-ellipsis-icon></mk-ellipsis-icon></div><div class="main" if="{!fetching}"><button class="read-more" if="{p.reply_to && p.reply_to.reply_to_id && context == null}" title="会話をもっと読み込む" onclick="{loadContext}" disabled="{contextFetching}"><i class="fa fa-ellipsis-v" if="{!contextFetching}"></i><i class="fa fa-spinner fa-pulse" if="{contextFetching}"></i></button><div class="context"><virtual each="{post in context}"><mk-post-detail-sub post="{post}"></mk-post-detail-sub></virtual></div><div class="reply-to" if="{p.reply_to}"><mk-post-detail-sub post="{p.reply_to}"></mk-post-detail-sub></div><div class="repost" if="{isRepost}"><p><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=32\'}" alt="avatar"></a><i class="fa fa-retweet"></i><a class="name" href="{CONFIG.url + \'/\' + post.user.username}"> {post.user.name} </a> がRepost </p></div><article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + p.user.username}"><img class="avatar" riot-src="{p.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar" data-user-preview="{p.user.id}"></a><header><a class="name" href="{CONFIG.url + \'/\' + p.user.username}" data-user-preview="{p.user.id}">{p.user.name}</a><span class="username">@{p.user.username}</span><a class="time" href="{url}"><mk-time time="{p.created_at}"></mk-time></a></header><div class="body"><div class="text" ref="text"></div><div class="media" if="{p.media}"><virtual each="{file in p.media}"><img riot-src="{file.url + \'?thumbnail&size=512\'}" alt="{file.name}" title="{file.name}"></virtual></div><mk-poll if="{p.poll}" post="{p}"></mk-poll></div><footer><mk-reactions-viewer post="{p}"></mk-reactions-viewer><button onclick="{reply}" title="返信"><i class="fa fa-reply"></i><p class="count" if="{p.replies_count > 0}">{p.replies_count}</p></button><button onclick="{repost}" title="Repost"><i class="fa fa-retweet"></i><p class="count" if="{p.repost_count > 0}">{p.repost_count}</p></button><button class="{reacted: p.my_reaction != null}" onclick="{react}" ref="reactButton" title="リアクション"><i class="fa fa-plus"></i><p class="count" if="{p.reactions_count > 0}">{p.reactions_count}</p></button><button><i class="fa fa-ellipsis-h"></i></button></footer></article><div class="replies"><virtual each="{post in replies}"><mk-post-detail-sub post="{post}"></mk-post-detail-sub></virtual></div></div>', 'mk-post-detail,[data-is="mk-post-detail"]{display:block;margin:0;padding:0;width:640px;overflow:hidden;background:#fff;border:solid 1px rgba(0,0,0,0.1);border-radius:8px;} mk-post-detail > .fetching,[data-is="mk-post-detail"] > .fetching{padding:64px 0} mk-post-detail > .main > .read-more,[data-is="mk-post-detail"] > .main > .read-more{display:block;margin:0;padding:10px 0;width:100%;font-size:1em;text-align:center;color:#999;cursor:pointer;background:#fafafa;outline:none;border:none;border-bottom:solid 1px #eef0f2;border-radius:6px 6px 0 0;} mk-post-detail > .main > .read-more:hover,[data-is="mk-post-detail"] > .main > .read-more:hover{background:#f6f6f6} mk-post-detail > .main > .read-more:active,[data-is="mk-post-detail"] > .main > .read-more:active{background:#f0f0f0} mk-post-detail > .main > .read-more:disabled,[data-is="mk-post-detail"] > .main > .read-more:disabled{color:#ccc} mk-post-detail > .main > .context > *,[data-is="mk-post-detail"] > .main > .context > *{border-bottom:1px solid #eef0f2} mk-post-detail > .main > .repost,[data-is="mk-post-detail"] > .main > .repost{color:#9dbb00;background:linear-gradient(to bottom,#edfde2 0%,#fff 100%);} mk-post-detail > .main > .repost > p,[data-is="mk-post-detail"] > .main > .repost > p{margin:0;padding:16px 32px;} mk-post-detail > .main > .repost > p .avatar-anchor,[data-is="mk-post-detail"] > .main > .repost > p .avatar-anchor{display:inline-block;} mk-post-detail > .main > .repost > p .avatar-anchor .avatar,[data-is="mk-post-detail"] > .main > .repost > p .avatar-anchor .avatar{vertical-align:bottom;min-width:28px;min-height:28px;max-width:28px;max-height:28px;margin:0 8px 0 0;border-radius:6px} mk-post-detail > .main > .repost > p i,[data-is="mk-post-detail"] > .main > .repost > p i{margin-right:4px} mk-post-detail > .main > .repost > p .name,[data-is="mk-post-detail"] > .main > .repost > p .name{font-weight:bold} mk-post-detail > .main > .repost + article,[data-is="mk-post-detail"] > .main > .repost + article{padding-top:8px} mk-post-detail > .main > .reply-to,[data-is="mk-post-detail"] > .main > .reply-to{border-bottom:1px solid #eef0f2} mk-post-detail > .main > article,[data-is="mk-post-detail"] > .main > article{padding:28px 32px 18px 32px;} mk-post-detail > .main > article:after,[data-is="mk-post-detail"] > .main > article:after{content:"";display:block;clear:both} mk-post-detail > .main > article:hover > .main > footer > button,[data-is="mk-post-detail"] > .main > article:hover > .main > footer > button{color:#888} mk-post-detail > .main > article > .avatar-anchor,[data-is="mk-post-detail"] > .main > article > .avatar-anchor{display:block;width:60px;height:60px;} mk-post-detail > .main > article > .avatar-anchor > .avatar,[data-is="mk-post-detail"] > .main > article > .avatar-anchor > .avatar{display:block;width:60px;height:60px;margin:0;border-radius:8px;vertical-align:bottom} mk-post-detail > .main > article > header,[data-is="mk-post-detail"] > .main > article > header{position:absolute;top:28px;left:108px;width:calc(100% - 108px);} mk-post-detail > .main > article > header > .name,[data-is="mk-post-detail"] > .main > article > header > .name{display:inline-block;margin:0;line-height:24px;color:#777;font-size:18px;font-weight:700;text-align:left;text-decoration:none;} mk-post-detail > .main > article > header > .name:hover,[data-is="mk-post-detail"] > .main > article > header > .name:hover{text-decoration:underline} mk-post-detail > .main > article > header > .username,[data-is="mk-post-detail"] > .main > article > header > .username{display:block;text-align:left;margin:0;color:#ccc} mk-post-detail > .main > article > header > .time,[data-is="mk-post-detail"] > .main > article > header > .time{position:absolute;top:0;right:32px;font-size:1em;color:#c0c0c0} mk-post-detail > .main > article > .body,[data-is="mk-post-detail"] > .main > article > .body{padding:8px 0;} mk-post-detail > .main > article > .body > .text,[data-is="mk-post-detail"] > .main > article > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.5em;color:#717171;} mk-post-detail > .main > article > .body > .text .link:after,[data-is="mk-post-detail"] > .main > article > .body > .text .link:after{content:"\\f14c";display:inline-block;padding-left:2px;font-family:FontAwesome;font-size:.9em;font-weight:400;font-style:normal} mk-post-detail > .main > article > .body > .text > mk-url-preview,[data-is="mk-post-detail"] > .main > article > .body > .text > mk-url-preview{margin-top:8px} mk-post-detail > .main > article > .body > .media > img,[data-is="mk-post-detail"] > .main > article > .body > .media > img{display:block;max-width:100%} mk-post-detail > .main > article > footer,[data-is="mk-post-detail"] > .main > article > footer{font-size:1.2em;} mk-post-detail > .main > article > footer > button,[data-is="mk-post-detail"] > .main > article > footer > button{margin:0 28px 0 0;padding:8px;background:transparent;border:none;font-size:1em;color:#ddd;cursor:pointer;} mk-post-detail > .main > article > footer > button:hover,[data-is="mk-post-detail"] > .main > article > footer > button:hover{color:#666} mk-post-detail > .main > article > footer > button > .count,[data-is="mk-post-detail"] > .main > article > footer > button > .count{display:inline;margin:0 0 0 8px;color:#999} mk-post-detail > .main > article > footer > button.reacted,[data-is="mk-post-detail"] > .main > article > footer > button.reacted{color:#87bb35} mk-post-detail > .main > .replies > *,[data-is="mk-post-detail"] > .main > .replies > *{border-top:1px solid #eef0f2}', 'title="{title}"', function(opts) {

		this.mixin('api');
		this.mixin('user-preview');

		this.fetching = true;
		this.contextFetching = false;
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
					title: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__["a" /* default */])(p.created_at)
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
			riot.mount(document.body.appendChild(document.createElement('mk-post-form-window')), {
				reply: this.p
			});
		};

		this.repost = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-repost-form-window')), {
				post: this.p
			});
		};

		this.react = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-reaction-picker')), {
				source: this.refs.reactButton,
				post: this.p
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
/* 151 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-post-form-window', '<mk-window ref="window" is-modal="{true}"><yield to="header"><span if="{!parent.opts.reply}">New post</span><span if="{parent.opts.reply}">Reply</span><span class="files" if="{parent.files.length != 0}">{\'{} media attached\'.replace(\'{}\', parent.files.length)}</span><span class="uploading-files" if="{parent.uploadingFiles.length != 0}">{\'{} media uploading\'.replace(\'{}\', parent.uploadingFiles.length)}<mk-ellipsis></mk-ellipsis></span></yield><yield to="content"><div class="ref" if="{parent.opts.reply}"><mk-post-preview post="{parent.opts.reply}"></mk-post-preview></div><div class="body"><mk-post-form ref="form" reply="{parent.opts.reply}"></mk-post-form></div></yield></mk-window>', 'mk-post-form-window > mk-window [data-yield=\'header\'] > .files,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .files,mk-post-form-window > mk-window [data-yield=\'header\'] > .uploading-files,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .uploading-files{margin-left:8px;opacity:.8;} mk-post-form-window > mk-window [data-yield=\'header\'] > .files:before,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .files:before,mk-post-form-window > mk-window [data-yield=\'header\'] > .uploading-files:before,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .uploading-files:before{content:\'(\'} mk-post-form-window > mk-window [data-yield=\'header\'] > .files:after,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .files:after,mk-post-form-window > mk-window [data-yield=\'header\'] > .uploading-files:after,[data-is="mk-post-form-window"] > mk-window [data-yield=\'header\'] > .uploading-files:after{content:\')\'} mk-post-form-window > mk-window [data-yield=\'content\'] > .ref > mk-post-preview,[data-is="mk-post-form-window"] > mk-window [data-yield=\'content\'] > .ref > mk-post-preview{margin:16px 22px}', '', function(opts) {
		this.uploadingFiles = [];
		this.files = [];

		this.on('mount', () => {
			this.refs.window.refs.form.focus();

			this.refs.window.on('closed', () => {
				this.unmount();
			});

			this.refs.window.refs.form.on('post', () => {
				this.refs.window.close();
			});

			this.refs.window.refs.form.on('change-uploading-files', files => {
				this.update({
					uploadingFiles: files || []
				});
			});

			this.refs.window.refs.form.on('change-files', files => {
				this.update({
					files: files || []
				});
			});
		});
});

    
  

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_get_cat__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_notify__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_autocomplete__ = __webpack_require__(252);

    var riot = __webpack_require__(0)
    


riot.tag2('mk-post-form', '<div class="content"><textarea class="{with: (files.length != 0 || poll)}" ref="text" disabled="{wait}" oninput="{update}" onkeydown="{onkeydown}" onpaste="{onpaste}" placeholder="{placeholder}"></textarea><div class="medias {with: poll}" if="{files.length != 0}"><ul><li each="{files}"><div class="img" riot-style="background-image: url({url + \'?thumbnail&size=64\'})" title="{name}"></div><img class="remove" onclick="{removeFile}" src="/assets/desktop/remove.png" title="Cancel to attach" alt=""></li><li class="add" if="{files.length < 4}" title="Attach media from your pc" onclick="{selectFile}"><i class="fa fa-plus"></i></li></ul><p class="remain">{4 - files.length}/4</p></div><mk-poll-editor if="{poll}" ref="poll" ondestroy="{onPollDestroyed}"></mk-poll-editor></div><mk-uploader ref="uploader"></mk-uploader><button ref="upload" title="Attach media from your pc" onclick="{selectFile}"><i class="fa fa-upload"></i></button><button ref="drive" title="Attach media from the drive" onclick="{selectFileFromDrive}"><i class="fa fa-cloud"></i></button><button class="cat" title="Insert the cat" onclick="{cat}"><i class="fa fa-smile-o"></i></button><button class="poll" title="Create a poll" onclick="{addPoll}"><i class="fa fa-pie-chart"></i></button><p class="text-count {over: refs.text.value.length > 1000}">{\'{} chars remaining\'.replace(\'{}\', 1000 - refs.text.value.length)}</p><button class="{wait: wait}" ref="submit" disabled="{wait || (refs.text.value.length == 0 && files.length == 0 && !poll　&& !repost)}" onclick="{post}"> {wait ? \'Posting\' : submitText}<mk-ellipsis if="{wait}"></mk-ellipsis></button><input ref="file" type="file" accept="image/*" multiple="multiple" tabindex="-1" onchange="{changeFile}"><div class="dropzone" if="{draghover}"></div>', 'mk-post-form,[data-is="mk-post-form"]{display:block;padding:16px;background:#f9fcf4;} mk-post-form:after,[data-is="mk-post-form"]:after{content:"";display:block;clear:both} mk-post-form > .content [ref=\'text\'],[data-is="mk-post-form"] > .content [ref=\'text\']{display:block;padding:12px;margin:0;width:100%;max-width:100%;min-width:100%;min-height:calc(16px + 12px + 12px);font-size:16px;color:#333;background:#fff;outline:none;border:solid 1px rgba(135,187,53,0.1);border-radius:4px;transition:border-color .3s ease;} mk-post-form > .content [ref=\'text\']:hover,[data-is="mk-post-form"] > .content [ref=\'text\']:hover{border-color:rgba(135,187,53,0.2);transition:border-color .1s ease;} mk-post-form > .content [ref=\'text\']:hover + *,[data-is="mk-post-form"] > .content [ref=\'text\']:hover + *,mk-post-form > .content [ref=\'text\']:hover + * + *,[data-is="mk-post-form"] > .content [ref=\'text\']:hover + * + *{border-color:rgba(135,187,53,0.2);transition:border-color .1s ease} mk-post-form > .content [ref=\'text\']:focus,[data-is="mk-post-form"] > .content [ref=\'text\']:focus{color:#87bb35;border-color:rgba(135,187,53,0.5);transition:border-color 0s ease;} mk-post-form > .content [ref=\'text\']:focus + *,[data-is="mk-post-form"] > .content [ref=\'text\']:focus + *,mk-post-form > .content [ref=\'text\']:focus + * + *,[data-is="mk-post-form"] > .content [ref=\'text\']:focus + * + *{border-color:rgba(135,187,53,0.5);transition:border-color 0s ease} mk-post-form > .content [ref=\'text\']:disabled,[data-is="mk-post-form"] > .content [ref=\'text\']:disabled{opacity:.5} mk-post-form > .content [ref=\'text\']::-webkit-input-placeholder,[data-is="mk-post-form"] > .content [ref=\'text\']::-webkit-input-placeholder{color:rgba(135,187,53,0.3)} mk-post-form > .content [ref=\'text\'].with,[data-is="mk-post-form"] > .content [ref=\'text\'].with{border-bottom:solid 1px rgba(135,187,53,0.1) !important;border-radius:4px 4px 0 0} mk-post-form > .content > .medias,[data-is="mk-post-form"] > .content > .medias{margin:0;padding:0;background:#fdfefb;border:solid 1px rgba(135,187,53,0.1);border-top:none;border-radius:0 0 4px 4px;transition:border-color .3s ease;} mk-post-form > .content > .medias.with,[data-is="mk-post-form"] > .content > .medias.with{border-bottom:solid 1px rgba(135,187,53,0.1) !important;border-radius:0} mk-post-form > .content > .medias > .remain,[data-is="mk-post-form"] > .content > .medias > .remain{display:block;position:absolute;top:8px;right:8px;margin:0;padding:0;color:rgba(135,187,53,0.4)} mk-post-form > .content > .medias > ul,[data-is="mk-post-form"] > .content > .medias > ul{display:block;margin:0;padding:4px;list-style:none;} mk-post-form > .content > .medias > ul:after,[data-is="mk-post-form"] > .content > .medias > ul:after{content:"";display:block;clear:both} mk-post-form > .content > .medias > ul > li,[data-is="mk-post-form"] > .content > .medias > ul > li{display:block;float:left;margin:4px;padding:0;cursor:move;} mk-post-form > .content > .medias > ul > li:hover > .remove,[data-is="mk-post-form"] > .content > .medias > ul > li:hover > .remove{display:block} mk-post-form > .content > .medias > ul > li > .img,[data-is="mk-post-form"] > .content > .medias > ul > li > .img{width:64px;height:64px;background-size:cover;background-position:center center} mk-post-form > .content > .medias > ul > li > .remove,[data-is="mk-post-form"] > .content > .medias > ul > li > .remove{display:none;position:absolute;top:-6px;right:-6px;width:16px;height:16px;cursor:pointer} mk-post-form > .content > .medias > ul > .add,[data-is="mk-post-form"] > .content > .medias > ul > .add{display:block;float:left;margin:4px;padding:0;border:dashed 2px rgba(135,187,53,0.2);cursor:pointer;} mk-post-form > .content > .medias > ul > .add:hover,[data-is="mk-post-form"] > .content > .medias > ul > .add:hover{border-color:rgba(135,187,53,0.3);} mk-post-form > .content > .medias > ul > .add:hover > i,[data-is="mk-post-form"] > .content > .medias > ul > .add:hover > i{color:rgba(135,187,53,0.4)} mk-post-form > .content > .medias > ul > .add > i,[data-is="mk-post-form"] > .content > .medias > ul > .add > i{display:block;width:60px;height:60px;line-height:60px;text-align:center;font-size:1.2em;color:rgba(135,187,53,0.2)} mk-post-form > .content > mk-poll-editor,[data-is="mk-post-form"] > .content > mk-poll-editor{background:#fdfefb;border:solid 1px rgba(135,187,53,0.1);border-top:none;border-radius:0 0 4px 4px;transition:border-color .3s ease} mk-post-form > mk-uploader,[data-is="mk-post-form"] > mk-uploader{margin:8px 0 0 0;padding:8px;border:solid 1px rgba(135,187,53,0.2);border-radius:4px} mk-post-form [ref=\'file\'],[data-is="mk-post-form"] [ref=\'file\']{display:none} mk-post-form .text-count,[data-is="mk-post-form"] .text-count{pointer-events:none;display:block;position:absolute;bottom:16px;right:138px;margin:0;line-height:40px;color:rgba(135,187,53,0.5);} mk-post-form .text-count.over,[data-is="mk-post-form"] .text-count.over{color:#ec3828} mk-post-form [ref=\'submit\'],[data-is="mk-post-form"] [ref=\'submit\']{display:block;position:absolute;bottom:16px;right:16px;cursor:pointer;padding:0;margin:0;width:110px;height:40px;font-size:1em;color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);outline:none;border:solid 1px #9bcc4c;border-radius:4px;} mk-post-form [ref=\'submit\']:not(:disabled),[data-is="mk-post-form"] [ref=\'submit\']:not(:disabled){font-weight:bold} mk-post-form [ref=\'submit\']:hover:not(:disabled),[data-is="mk-post-form"] [ref=\'submit\']:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-post-form [ref=\'submit\']:active:not(:disabled),[data-is="mk-post-form"] [ref=\'submit\']:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-post-form [ref=\'submit\']:focus:after,[data-is="mk-post-form"] [ref=\'submit\']:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-post-form [ref=\'submit\']:disabled,[data-is="mk-post-form"] [ref=\'submit\']:disabled{opacity:.7;cursor:default} mk-post-form [ref=\'submit\'].wait,[data-is="mk-post-form"] [ref=\'submit\'].wait{background:linear-gradient(45deg,#7aa830 25%,#87bb35 25%,#87bb35 50%,#7aa830 50%,#7aa830 75%,#87bb35 75%,#87bb35);background-size:32px 32px;animation:stripe-bg 1.5s linear infinite;opacity:.7;cursor:wait;}@-moz-keyframes stripe-bg{ from{background-position:0 0} to{background-position:-64px 32px}}@-webkit-keyframes stripe-bg{ from{background-position:0 0} to{background-position:-64px 32px}}@-o-keyframes stripe-bg{ from{background-position:0 0} to{background-position:-64px 32px}}@keyframes stripe-bg{ from{background-position:0 0} to{background-position:-64px 32px}} mk-post-form [ref=\'upload\'],[data-is="mk-post-form"] [ref=\'upload\'],mk-post-form [ref=\'drive\'],[data-is="mk-post-form"] [ref=\'drive\'],mk-post-form .cat,[data-is="mk-post-form"] .cat,mk-post-form .poll,[data-is="mk-post-form"] .poll{display:inline-block;cursor:pointer;padding:0;margin:8px 4px 0 0;width:40px;height:40px;font-size:1em;color:rgba(135,187,53,0.5);background:transparent;outline:none;border:solid 1px transparent;border-radius:4px;} mk-post-form [ref=\'upload\']:hover,[data-is="mk-post-form"] [ref=\'upload\']:hover,mk-post-form [ref=\'drive\']:hover,[data-is="mk-post-form"] [ref=\'drive\']:hover,mk-post-form .cat:hover,[data-is="mk-post-form"] .cat:hover,mk-post-form .poll:hover,[data-is="mk-post-form"] .poll:hover{background:transparent;border-color:rgba(135,187,53,0.3)} mk-post-form [ref=\'upload\']:active,[data-is="mk-post-form"] [ref=\'upload\']:active,mk-post-form [ref=\'drive\']:active,[data-is="mk-post-form"] [ref=\'drive\']:active,mk-post-form .cat:active,[data-is="mk-post-form"] .cat:active,mk-post-form .poll:active,[data-is="mk-post-form"] .poll:active{color:rgba(135,187,53,0.6);background:linear-gradient(to bottom,#e7f3d5 0%,#f3f9ea 100%);border-color:rgba(135,187,53,0.5);box-shadow:0 2px 4px rgba(0,0,0,0.15) inset} mk-post-form [ref=\'upload\']:focus:after,[data-is="mk-post-form"] [ref=\'upload\']:focus:after,mk-post-form [ref=\'drive\']:focus:after,[data-is="mk-post-form"] [ref=\'drive\']:focus:after,mk-post-form .cat:focus:after,[data-is="mk-post-form"] .cat:focus:after,mk-post-form .poll:focus:after,[data-is="mk-post-form"] .poll:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-post-form > .dropzone,[data-is="mk-post-form"] > .dropzone{position:absolute;left:0;top:0;width:100%;height:100%;border:dashed 2px rgba(135,187,53,0.5);pointer-events:none}', 'ondragover="{ondragover}" ondragenter="{ondragenter}" ondragleave="{ondragleave}" ondrop="{ondrop}"', function(opts) {

		this.mixin('api');

		this.wait = false;
		this.uploadings = [];
		this.files = [];
		this.autocomplete = null;
		this.poll = false;

		this.inReplyToPost = this.opts.reply;

		if (this.inReplyToPost == '') this.inReplyToPost = null;

		this.repost = this.opts.repost;

		if (this.repost == '') this.repost = null;

		this.placeholder = this.repost
			? 'Quote this post...'
			: this.inReplyToPost
				? 'Reply to this post...'
				: 'What\'s happening?';

		this.submitText = this.repost
			? 'Repost'
			: this.inReplyToPost
				? 'Reply'
				: 'Post';

		this.draftId = this.repost
			? 'repost:' + this.repost.id
			: this.inReplyToPost
				? 'reply:' + this.inReplyToPost.id
				: 'post';

		this.on('mount', () => {
			this.refs.uploader.on('uploaded', file => {
				this.addFile(file);
			});

			this.refs.uploader.on('change-uploads', uploads => {
				this.trigger('change-uploading-files', uploads);
			});

			this.autocomplete = new __WEBPACK_IMPORTED_MODULE_2__scripts_autocomplete__["a" /* default */](this.refs.text);
			this.autocomplete.attach();

			const draft = JSON.parse(localStorage.getItem('drafts') || '{}')[this.draftId];
			if (draft) {
				this.refs.text.value = draft.data.text;
				this.files = draft.data.files;
				if (draft.data.poll) {
					this.poll = true;
					this.update();
					this.refs.poll.set(draft.data.poll);
				}
				this.trigger('change-files', this.files);
				this.update();
			}
		});

		this.on('unmount', () => {
			this.autocomplete.detach();
		});

		this.focus = () => {
			this.refs.text.focus();
		};

		this.clear = () => {
			this.refs.text.value = '';
			this.files = [];
			this.poll = false;
			this.trigger('change-files');
			this.update();
		};

		this.ondragover = e => {
			e.preventDefault();
			e.stopPropagation();
			this.draghover = true;
			e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed == 'all' ? 'copy' : 'move';
		};

		this.ondragenter = e => {
			this.draghover = true;
		};

		this.ondragleave = e => {
			this.draghover = false;
		};

		this.ondrop = e => {
			e.preventDefault();
			e.stopPropagation();
			this.draghover = false;

			if (e.dataTransfer.files.length > 0) {
				e.dataTransfer.files.forEach(this.upload);
			}
		};

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
			const i = riot.mount(document.body.appendChild(document.createElement('mk-select-file-from-drive-window')), {
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
			this.files.push(file);
			this.trigger('change-files', this.files);
			this.update();
		};

		this.removeFile = e => {
			const file = e.item;
			this.files = this.files.filter(x => x.id != file.id);
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

		this.post = e => {
			this.wait = true;

			const files = this.files && this.files.length > 0
				? this.files.map(f => f.id)
				: undefined;

			this.api('posts/create', {
				text: this.refs.text.value == '' ? undefined : this.refs.text.value,
				media_ids: files,
				reply_to_id: this.inReplyToPost ? this.inReplyToPost.id : undefined,
				repost_id: this.repost ? this.repost.id : undefined,
				poll: this.poll ? this.refs.poll.get() : undefined
			}).then(data => {
				this.clear();
				this.removeDraft();
				this.trigger('post');
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_notify__["a" /* default */])(this.repost
					? 'Reposted!'
					: this.inReplyToPost
						? 'Replied!'
						: 'Posted!');
			}).catch(err => {
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_notify__["a" /* default */])(this.repost
					? 'Failed to repost'
					: this.inReplyToPost
						? 'Failed to reply'
						: 'Failed to post');
			}).then(() => {
				this.update({
					wait: false
				});
			});
		};

		this.cat = () => {
			this.refs.text.value += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_get_cat__["a" /* default */])();
		};

		this.on('update', () => {
			this.saveDraft();
		});

		this.saveDraft = () => {
			const data = JSON.parse(localStorage.getItem('drafts') || '{}');

			data[this.draftId] = {
				updated_at: new Date(),
				data: {
					text: this.refs.text.value,
					files: this.files,
					poll: this.poll && this.refs.poll ? this.refs.poll.get() : undefined
				}
			}

			localStorage.setItem('drafts', JSON.stringify(data));
		};

		this.removeDraft = () => {
			const data = JSON.parse(localStorage.getItem('drafts') || '{}');

			delete data[this.draftId];

			localStorage.setItem('drafts', JSON.stringify(data));
		};
});

    
  

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_date_stringify__ = __webpack_require__(68);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-post-preview', '<article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar" data-user-preview="{post.user_id}"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}">{post.user.name}</a><span class="username">@{post.user.username}</span><a class="time" href="{CONFIG.url + \'/\' + post.user.username + \'/\' + post.id}"><mk-time time="{post.created_at}"></mk-time></a></header><div class="body"><mk-sub-post-content class="text" post="{post}"></mk-sub-post-content></div></div></article>', 'mk-post-preview,[data-is="mk-post-preview"]{display:block;margin:0;padding:0;font-size:.9em;background:#fff;} mk-post-preview > article:after,[data-is="mk-post-preview"] > article:after{content:"";display:block;clear:both} mk-post-preview > article:hover > .main > footer > button,[data-is="mk-post-preview"] > article:hover > .main > footer > button{color:#888} mk-post-preview > article > .avatar-anchor,[data-is="mk-post-preview"] > article > .avatar-anchor{display:block;float:left;margin:0 16px 0 0;} mk-post-preview > article > .avatar-anchor > .avatar,[data-is="mk-post-preview"] > article > .avatar-anchor > .avatar{display:block;width:52px;height:52px;margin:0;border-radius:8px;vertical-align:bottom} mk-post-preview > article > .main,[data-is="mk-post-preview"] > article > .main{float:left;width:calc(100% - 68px);} mk-post-preview > article > .main > header,[data-is="mk-post-preview"] > article > .main > header{display:flex;margin:4px 0;white-space:nowrap;} mk-post-preview > article > .main > header > .name,[data-is="mk-post-preview"] > article > .main > header > .name{margin:0 .5em 0 0;padding:0;color:#607073;font-size:1em;line-height:1.1em;font-weight:700;text-align:left;text-decoration:none;white-space:normal;} mk-post-preview > article > .main > header > .name:hover,[data-is="mk-post-preview"] > article > .main > header > .name:hover{text-decoration:underline} mk-post-preview > article > .main > header > .username,[data-is="mk-post-preview"] > article > .main > header > .username{text-align:left;margin:0 .5em 0 0;color:#d1d8da} mk-post-preview > article > .main > header > .time,[data-is="mk-post-preview"] > article > .main > header > .time{margin-left:auto;color:#b2b8bb} mk-post-preview > article > .main > .body > .text,[data-is="mk-post-preview"] > article > .main > .body > .text{cursor:default;margin:0;padding:0;font-size:1.1em;color:#717171}', 'title="{title}"', function(opts) {

		this.mixin('user-preview');

		this.post = this.opts.post;

		this.title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_date_stringify__["a" /* default */])(this.post.created_at);
});

    
  

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-progress-dialog', '<mk-window ref="window" is-modal="{false}" can-close="{false}" width="{\'500px\'}"><yield to="header">{parent.title} <mk-ellipsis></mk-ellipsis></yield><yield to="content"><div class="body"><p class="init" if="{isNaN(parent.value)}">待機中 <mk-ellipsis></mk-ellipsis></p><p class="percentage" if="{!isNaN(parent.value)}">{Math.floor((parent.value / parent.max) * 100)}</p><progress if="{!isNaN(parent.value) && parent.value < parent.max}" riot-value="{isNaN(parent.value) ? 0 : parent.value}" max="{parent.max}"></progress><div class="progress waiting" if="{parent.value >= parent.max}"></div></div></yield></mk-window>', 'mk-progress-dialog,[data-is="mk-progress-dialog"]{display:block;} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body{padding:18px 24px 24px 24px;} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .init,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .init{display:block;margin:0;text-align:center;color:rgba(0,0,0,0.7)} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .percentage,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .percentage{display:block;margin:0 0 4px 0;text-align:center;line-height:16px;color:rgba(135,187,53,0.7);} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .percentage:after,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .percentage:after{content:\'%\'} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > progress,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > progress,mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .progress,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .progress{display:block;margin:0;width:100%;height:10px;background:transparent;border:none;border-radius:4px;overflow:hidden;} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > progress::-webkit-progress-value,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > progress::-webkit-progress-value,mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .progress::-webkit-progress-value,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .progress::-webkit-progress-value{background:#87bb35} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > progress::-webkit-progress-bar,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > progress::-webkit-progress-bar,mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .progress::-webkit-progress-bar,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .progress::-webkit-progress-bar{background:rgba(135,187,53,0.1)} mk-progress-dialog > mk-window [data-yield=\'content\'] > .body > .progress,[data-is="mk-progress-dialog"] > mk-window [data-yield=\'content\'] > .body > .progress{background:linear-gradient(45deg,#acd56c 25%,#87bb35 25%,#87bb35 50%,#acd56c 50%,#acd56c 75%,#87bb35 75%,#87bb35);background-size:32px 32px;animation:progress-dialog-tag-progress-waiting 1.5s linear infinite;}@-moz-keyframes progress-dialog-tag-progress-waiting{ from{background-position:0 0} to{background-position:-64px 32px}}@-webkit-keyframes progress-dialog-tag-progress-waiting{ from{background-position:0 0} to{background-position:-64px 32px}}@-o-keyframes progress-dialog-tag-progress-waiting{ from{background-position:0 0} to{background-position:-64px 32px}}@keyframes progress-dialog-tag-progress-waiting{ from{background-position:0 0} to{background-position:-64px 32px}}', '', function(opts) {
		this.title = this.opts.title;
		this.value = parseInt(this.opts.value, 10);
		this.max = parseInt(this.opts.max, 10);

		this.on('mount', () => {
			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});

		this.updateProgress = (value, max) => {
			this.update({
				value: parseInt(value, 10),
				max: parseInt(max, 10)
			});
		};

		this.close = () => {
			this.refs.window.close();
		};
});

    
  

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-repost-form-window', '<mk-window ref="window" is-modal="{true}"><yield to="header"><i class="fa fa-retweet"></i>Are you sure you want to repost this post? </yield><yield to="content"><mk-repost-form ref="form" post="{parent.opts.post}"></mk-repost-form></yield></mk-window>', 'mk-repost-form-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-repost-form-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px}', '', function(opts) {
		this.onDocumentKeydown = e => {
			if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
				if (e.which == 27) {
					this.refs.window.close();
				}
			}
		};

		this.on('mount', () => {
			this.refs.window.refs.form.on('cancel', () => {
				this.refs.window.close();
			});

			this.refs.window.refs.form.on('posted', () => {
				this.refs.window.close();
			});

			document.addEventListener('keydown', this.onDocumentKeydown);

			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});

		this.on('unmount', () => {
			document.removeEventListener('keydown', this.onDocumentKeydown);
		});
});

    
  

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_notify__ = __webpack_require__(75);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-repost-form', '<mk-post-preview post="{opts.post}"></mk-post-preview><virtual if="{!quote}"><footer><a class="quote" if="{!quote}" onclick="{onquote}">Quote...</a><button class="cancel" onclick="{cancel}">Cancel</button><button class="ok" onclick="{ok}" disabled="{wait}">{wait ? \'Reposting...\' : \'Repost\'}</button></footer></virtual><virtual if="{quote}"><mk-post-form ref="form" repost="{opts.post}"></mk-post-form></virtual>', 'mk-repost-form > mk-post-preview,[data-is="mk-repost-form"] > mk-post-preview{margin:16px 22px} mk-repost-form > div,[data-is="mk-repost-form"] > div{padding:16px} mk-repost-form > footer,[data-is="mk-repost-form"] > footer{height:72px;background:#f9fcf4;} mk-repost-form > footer > .quote,[data-is="mk-repost-form"] > footer > .quote{position:absolute;bottom:16px;left:28px;line-height:40px} mk-repost-form > footer button,[data-is="mk-repost-form"] > footer button{display:block;position:absolute;bottom:16px;cursor:pointer;padding:0;margin:0;width:120px;height:40px;font-size:1em;outline:none;border-radius:4px;} mk-repost-form > footer button:focus:after,[data-is="mk-repost-form"] > footer button:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-repost-form > footer > .cancel,[data-is="mk-repost-form"] > footer > .cancel{right:148px;color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-repost-form > footer > .cancel:hover,[data-is="mk-repost-form"] > footer > .cancel:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-repost-form > footer > .cancel:active,[data-is="mk-repost-form"] > footer > .cancel:active{background:#ececec;border-color:#dcdcdc} mk-repost-form > footer > .ok,[data-is="mk-repost-form"] > footer > .ok{right:16px;font-weight:bold;color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-repost-form > footer > .ok:hover,[data-is="mk-repost-form"] > footer > .ok:hover{background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-repost-form > footer > .ok:active,[data-is="mk-repost-form"] > footer > .ok:active{background:#87bb35;border-color:#87bb35}', '', function(opts) {

		this.mixin('api');

		this.wait = false;
		this.quote = false;

		this.cancel = () => {
			this.trigger('cancel');
		};

		this.ok = () => {
			this.wait = true;
			this.api('posts/create', {
				repost_id: this.opts.post.id
			}).then(data => {
				this.trigger('posted');
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_notify__["a" /* default */])('Reposted!');
			}).catch(err => {
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_notify__["a" /* default */])('Repost failed');
			}).then(() => {
				this.update({
					wait: false
				});
			});
		};

		this.onquote = () => {
			this.update({
				quote: true
			});

			this.refs.form.on('post', () => {
				this.trigger('posted');
			});

			this.refs.form.focus();
		};
});

    
  

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-search-posts', '<div class="loading" if="{isLoading}"><mk-ellipsis-icon></mk-ellipsis-icon></div><p class="empty" if="{isEmpty}"><i class="fa fa-search"></i>「{query}」に関する投稿は見つかりませんでした。</p><mk-timeline ref="timeline"><yield to="footer"><i class="fa fa-moon-o" if="{!parent.moreLoading}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{parent.moreLoading}"></i></yield></mk-timeline>', 'mk-search-posts,[data-is="mk-search-posts"]{display:block;background:#fff;} mk-search-posts > .loading,[data-is="mk-search-posts"] > .loading{padding:64px 0} mk-search-posts > .empty,[data-is="mk-search-posts"] > .empty{display:block;margin:0 auto;padding:32px;max-width:400px;text-align:center;color:#999;} mk-search-posts > .empty > i,[data-is="mk-search-posts"] > .empty > i{display:block;margin-bottom:16px;font-size:3em;color:#ccc}', '', function(opts) {
		this.mixin('api');

		this.query = this.opts.query;
		this.isLoading = true;
		this.isEmpty = false;
		this.moreLoading = false;
		this.page = 0;

		this.on('mount', () => {
			document.addEventListener('keydown', this.onDocumentKeydown);
			window.addEventListener('scroll', this.onScroll);

			this.api('posts/search', {
				query: this.query
			}).then(posts => {
				this.update({
					isLoading: false,
					isEmpty: posts.length == 0
				});
				this.refs.timeline.setPosts(posts);
				this.trigger('loaded');
			});
		});

		this.on('unmount', () => {
			document.removeEventListener('keydown', this.onDocumentKeydown);
			window.removeEventListener('scroll', this.onScroll);
		});

		this.onDocumentKeydown = e => {
			if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
				if (e.which == 84) {
					this.refs.timeline.focus();
				}
			}
		};

		this.more = () => {
			if (this.moreLoading || this.isLoading || this.timeline.posts.length == 0) return;
			this.update({
				moreLoading: true
			});
			this.api('posts/search', {
				query: this.query,
				page: this.page + 1
			}).then(posts => {
				this.update({
					moreLoading: false,
					page: page + 1
				});
				this.refs.timeline.prependPosts(posts);
			});
		};

		this.onScroll = () => {
			const current = window.scrollY + window.innerHeight;
			if (current > document.body.offsetHeight - 16) this.more();
		};
});

    
  

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-search', '<header><h1>{query}</h1></header><mk-search-posts ref="posts" query="{query}"></mk-search-posts>', 'mk-search,[data-is="mk-search"]{display:block;padding-bottom:32px;} mk-search > header,[data-is="mk-search"] > header{width:100%;max-width:600px;margin:0 auto;color:#555} mk-search > mk-search-posts,[data-is="mk-search"] > mk-search-posts{max-width:600px;margin:0 auto;border:solid 1px rgba(0,0,0,0.075);border-radius:6px;overflow:hidden}', '', function(opts) {
		this.query = this.opts.query;

		this.on('mount', () => {
			this.refs.posts.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-select-file-from-drive-window', '<mk-window ref="window" is-modal="{true}" width="{\'800px\'}" height="{\'500px\'}"><yield to="header"><mk-raw content="{parent.title}"></mk-raw><span class="count" if="{parent.multiple && parent.files.length > 0}">({parent.files.length}ファイル選択中)</span></yield><yield to="content"><mk-drive-browser ref="browser" multiple="{parent.multiple}"></mk-drive-browser><div><button class="upload" title="PCからドライブにファイルをアップロード" onclick="{parent.upload}"><i class="fa fa-upload"></i></button><button class="cancel" onclick="{parent.close}">キャンセル</button><button class="ok" disabled="{parent.multiple && parent.files.length == 0}" onclick="{parent.ok}">決定</button></div></yield></mk-window>', 'mk-select-file-from-drive-window > mk-window [data-yield=\'header\'] > mk-raw > i,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'header\'] > mk-raw > i{margin-right:4px} mk-select-file-from-drive-window > mk-window [data-yield=\'header\'] .count,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'header\'] .count{margin-left:8px;opacity:.7} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > mk-drive-browser,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > mk-drive-browser{height:calc(100% - 72px)} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div{height:72px;background:#f9fcf4;} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .upload,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .upload{display:inline-block;position:absolute;top:8px;left:16px;cursor:pointer;padding:0;margin:8px 4px 0 0;width:40px;height:40px;font-size:1em;color:rgba(135,187,53,0.5);background:transparent;outline:none;border:solid 1px transparent;border-radius:4px;} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .upload:hover,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .upload:hover{background:transparent;border-color:rgba(135,187,53,0.3)} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .upload:active,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .upload:active{color:rgba(135,187,53,0.6);background:transparent;border-color:rgba(135,187,53,0.5);box-shadow:0 2px 4px rgba(68,93,27,0.15) inset} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .upload:focus:after,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .upload:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok,mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel{display:block;position:absolute;bottom:16px;cursor:pointer;padding:0;margin:0;width:120px;height:40px;font-size:1em;outline:none;border-radius:4px;} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok:focus:after,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok:focus:after,mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel:focus:after,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel:focus:after{content:"";pointer-events:none;position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid rgba(135,187,53,0.3);border-radius:8px} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok:disabled,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok:disabled,mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel:disabled,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel:disabled{opacity:.7;cursor:default} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok{right:16px;color:#fff;background:linear-gradient(to bottom,#a6d261 0%,#95c942 100%);border:solid 1px #9bcc4c;} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok:not(:disabled),[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok:not(:disabled){font-weight:bold} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok:hover:not(:disabled),[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok:hover:not(:disabled){background:linear-gradient(to bottom,#92c83d 0%,#7cac31 100%);border-color:#87bb35} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .ok:active:not(:disabled),[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .ok:active:not(:disabled){background:#87bb35;border-color:#87bb35} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel{right:148px;color:#888;background:linear-gradient(to bottom,#fff 0%,#f5f5f5 100%);border:solid 1px #e2e2e2;} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel:hover,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel:hover{background:linear-gradient(to bottom,#f9f9f9 0%,#ececec 100%);border-color:#dcdcdc} mk-select-file-from-drive-window > mk-window [data-yield=\'content\'] > div .cancel:active,[data-is="mk-select-file-from-drive-window"] > mk-window [data-yield=\'content\'] > div .cancel:active{background:#ececec;border-color:#dcdcdc}', '', function(opts) {
		this.files = [];

		this.multiple = this.opts.multiple != null ? this.opts.multiple : false;
		this.title = this.opts.title || '<i class="fa fa-file-o"></i>ファイルを選択';

		this.on('mount', () => {
			this.refs.window.refs.browser.on('selected', file => {
				this.files = [file];
				this.ok();
			});

			this.refs.window.refs.browser.on('change-selection', files => {
				this.update({
					files: files
				});
			});

			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});

		this.close = () => {
			this.refs.window.close();
		};

		this.upload = () => {
			this.refs.window.refs.browser.selectLocalFile();
		};

		this.ok = () => {
			this.trigger('selected', this.multiple ? this.files : this.files[0]);
			this.refs.window.close();
		};
});

    
  

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_update_avatar__ = __webpack_require__(71);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-set-avatar-suggestion', '<p><b>アバターを設定</b>してみませんか？ <button onclick="{close}"><i class="fa fa-times"></i></button></p>', 'mk-set-avatar-suggestion,[data-is="mk-set-avatar-suggestion"]{display:block;cursor:pointer;color:#fff;background:#a8cad0;} mk-set-avatar-suggestion:hover,[data-is="mk-set-avatar-suggestion"]:hover{background:#70abb5} mk-set-avatar-suggestion > p,[data-is="mk-set-avatar-suggestion"] > p{display:block;margin:0 auto;padding:8px;max-width:1024px;} mk-set-avatar-suggestion > p > a,[data-is="mk-set-avatar-suggestion"] > p > a{font-weight:bold;color:#fff} mk-set-avatar-suggestion > p > button,[data-is="mk-set-avatar-suggestion"] > p > button{position:absolute;top:0;right:0;padding:8px;color:#fff}', 'onclick="{set}"', function(opts) {

		this.mixin('i');

		this.set = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_update_avatar__["a" /* default */])(this.I);
		};

		this.close = e => {
			e.preventDefault();
			e.stopPropagation();
			this.unmount();
		};
});

    
  

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_update_banner__ = __webpack_require__(76);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-set-banner-suggestion', '<p><b>バナーを設定</b>してみませんか？ <button onclick="{close}"><i class="fa fa-times"></i></button></p>', 'mk-set-banner-suggestion,[data-is="mk-set-banner-suggestion"]{display:block;cursor:pointer;color:#fff;background:#a8cad0;} mk-set-banner-suggestion:hover,[data-is="mk-set-banner-suggestion"]:hover{background:#70abb5} mk-set-banner-suggestion > p,[data-is="mk-set-banner-suggestion"] > p{display:block;margin:0 auto;padding:8px;max-width:1024px;} mk-set-banner-suggestion > p > a,[data-is="mk-set-banner-suggestion"] > p > a{font-weight:bold;color:#fff} mk-set-banner-suggestion > p > button,[data-is="mk-set-banner-suggestion"] > p > button{position:absolute;top:0;right:0;padding:8px;color:#fff}', 'onclick="{set}"', function(opts) {

		this.mixin('i');

		this.set = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_update_banner__["a" /* default */])(this.I);
		};

		this.close = e => {
			e.preventDefault();
			e.stopPropagation();
			this.unmount();
		};
});

    
  

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-settings-window', '<mk-window ref="window" is-modal="{true}" width="{\'700px\'}" height="{\'550px\'}"><yield to="header"><i class="fa fa-cog"></i>設定</yield><yield to="content"><mk-settings></mk-settings></yield></mk-window>', 'mk-settings-window > mk-window [data-yield=\'header\'] > i,[data-is="mk-settings-window"] > mk-window [data-yield=\'header\'] > i{margin-right:4px} mk-settings-window > mk-window [data-yield=\'content\'],[data-is="mk-settings-window"] > mk-window [data-yield=\'content\']{overflow:hidden}', '', function(opts) {
		this.on('mount', () => {
			this.refs.window.on('closed', () => {
				this.unmount();
			});
		});

		this.close = () => {
			this.refs.window.close();
		};
});

    
  

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_update_avatar__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_notify__ = __webpack_require__(75);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-settings', '<div class="nav"><p class="{active: page == \'account\'}" onmousedown="{setPage.bind(null, \'account\')}"><i class="fa fa-fw fa-user"></i>アカウント</p><p class="{active: page == \'web\'}" onmousedown="{setPage.bind(null, \'web\')}"><i class="fa fa-fw fa-desktop"></i>Web</p><p class="{active: page == \'notification\'}" onmousedown="{setPage.bind(null, \'notification\')}"><i class="fa fa-fw fa-bell-o"></i>通知</p><p class="{active: page == \'drive\'}" onmousedown="{setPage.bind(null, \'drive\')}"><i class="fa fa-fw fa-cloud"></i>ドライブ</p><p class="{active: page == \'apps\'}" onmousedown="{setPage.bind(null, \'apps\')}"><i class="fa fa-fw fa-puzzle-piece"></i>アプリ</p><p class="{active: page == \'twitter\'}" onmousedown="{setPage.bind(null, \'twitter\')}"><i class="fa fa-fw fa-twitter"></i>Twitter</p><p class="{active: page == \'signin\'}" onmousedown="{setPage.bind(null, \'signin\')}"><i class="fa fa-fw fa-sign-in"></i>ログイン履歴</p><p class="{active: page == \'password\'}" onmousedown="{setPage.bind(null, \'password\')}"><i class="fa fa-fw fa-unlock-alt"></i>パスワード</p><p class="{active: page == \'api\'}" onmousedown="{setPage.bind(null, \'api\')}"><i class="fa fa-fw fa-key"></i>API</p></div><div class="pages"><section class="account" show="{page == \'account\'}"><h1>アカウント</h1><label class="avatar"><p>アバター</p><img class="avatar" riot-src="{I.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"><button class="style-normal" onclick="{avatar}">画像を選択</button></label><label><p>名前</p><input ref="accountName" type="text" riot-value="{I.name}"></label><label><p>場所</p><input ref="accountLocation" type="text" riot-value="{I.profile.location}"></label><label><p>自己紹介</p><textarea ref="accountDescription">{I.description}</textarea></label><label><p>誕生日</p><input ref="accountBirthday" riot-value="{I.profile.birthday}" type="{\'date\'}"></label><button class="style-primary" onclick="{updateAccount}">保存</button></section><section class="web" show="{page == \'web\'}"><h1>デザイン</h1></section><section class="web" show="{page == \'web\'}"></section><section class="apps" show="{page == \'apps\'}"><h1>アプリケーション</h1><mk-authorized-apps></mk-authorized-apps></section><section class="twitter" show="{page == \'twitter\'}"><h1>Twitter</h1><mk-twitter-setting></mk-twitter-setting></section><section class="signin" show="{page == \'signin\'}"><h1>ログイン履歴</h1><mk-signin-history></mk-signin-history></section><section class="api" show="{page == \'api\'}"><h1>API</h1><mk-api-info></mk-api-info></section></div>', 'mk-settings,[data-is="mk-settings"]{display:flex;width:100%;height:100%;} mk-settings input:not([type]),[data-is="mk-settings"] input:not([type]),mk-settings input[type=\'text\'],[data-is="mk-settings"] input[type=\'text\'],mk-settings input[type=\'password\'],[data-is="mk-settings"] input[type=\'password\'],mk-settings input[type=\'email\'],[data-is="mk-settings"] input[type=\'email\'],mk-settings textarea,[data-is="mk-settings"] textarea{padding:8px;width:100%;font-size:16px;color:#55595c;border:solid 1px #dadada;border-radius:4px;} mk-settings input:not([type]):hover,[data-is="mk-settings"] input:not([type]):hover,mk-settings input[type=\'text\']:hover,[data-is="mk-settings"] input[type=\'text\']:hover,mk-settings input[type=\'password\']:hover,[data-is="mk-settings"] input[type=\'password\']:hover,mk-settings input[type=\'email\']:hover,[data-is="mk-settings"] input[type=\'email\']:hover,mk-settings textarea:hover,[data-is="mk-settings"] textarea:hover{border-color:#aeaeae} mk-settings input:not([type]):focus,[data-is="mk-settings"] input:not([type]):focus,mk-settings input[type=\'text\']:focus,[data-is="mk-settings"] input[type=\'text\']:focus,mk-settings input[type=\'password\']:focus,[data-is="mk-settings"] input[type=\'password\']:focus,mk-settings input[type=\'email\']:focus,[data-is="mk-settings"] input[type=\'email\']:focus,mk-settings textarea:focus,[data-is="mk-settings"] textarea:focus{border-color:#aeaeae} mk-settings > .nav,[data-is="mk-settings"] > .nav{flex:0 0 200px;width:100%;height:100%;padding:16px 0 0 0;overflow:auto;border-right:solid 1px #ddd;} mk-settings > .nav > p,[data-is="mk-settings"] > .nav > p{display:block;padding:10px 16px;margin:0;color:#666;cursor:pointer;user-select:none;transition:margin-left .2s ease;} mk-settings > .nav > p > i,[data-is="mk-settings"] > .nav > p > i{margin-right:4px} mk-settings > .nav > p:hover,[data-is="mk-settings"] > .nav > p:hover{color:#555} mk-settings > .nav > p.active,[data-is="mk-settings"] > .nav > p.active{margin-left:8px;color:#87bb35 !important} mk-settings > .pages,[data-is="mk-settings"] > .pages{width:100%;height:100%;flex:auto;overflow:auto;} mk-settings > .pages > section,[data-is="mk-settings"] > .pages > section{padding:32px;} mk-settings > .pages > section h1,[data-is="mk-settings"] > .pages > section h1{display:block;margin:0;padding:0 0 8px 0;font-size:1em;color:#555;border-bottom:solid 1px #eee} mk-settings > .pages > section label,[data-is="mk-settings"] > .pages > section label{display:block;margin:16px 0;} mk-settings > .pages > section label:after,[data-is="mk-settings"] > .pages > section label:after{content:"";display:block;clear:both} mk-settings > .pages > section label > p,[data-is="mk-settings"] > .pages > section label > p{margin:0 0 8px 0;font-weight:bold;color:#373a3c} mk-settings > .pages > section label.checkbox > input,[data-is="mk-settings"] > .pages > section label.checkbox > input{position:absolute;top:0;left:0;} mk-settings > .pages > section label.checkbox > input:checked + p,[data-is="mk-settings"] > .pages > section label.checkbox > input:checked + p{color:#87bb35} mk-settings > .pages > section label.checkbox > p,[data-is="mk-settings"] > .pages > section label.checkbox > p{width:calc(100% - 32px);margin:0 0 0 32px;font-weight:bold;} mk-settings > .pages > section label.checkbox > p:last-child,[data-is="mk-settings"] > .pages > section label.checkbox > p:last-child{font-weight:normal;color:#999} mk-settings > .pages > section.account > .general > .avatar > img,[data-is="mk-settings"] > .pages > section.account > .general > .avatar > img{display:block;float:left;width:64px;height:64px;border-radius:4px} mk-settings > .pages > section.account > .general > .avatar > button,[data-is="mk-settings"] > .pages > section.account > .general > .avatar > button{float:left;margin-left:8px}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');

		this.page = 'account';

		this.setPage = page => {
			this.page = page;
		};

		this.avatar = () => {
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_update_avatar__["a" /* default */])(this.I);
		};

		this.updateAccount = () => {
			this.api('i/update', {
				name: this.refs.accountName.value,
				location: this.refs.accountLocation.value || undefined,
				description: this.refs.accountDescription.value || undefined,
				birthday: this.refs.accountBirthday.value || undefined
			}).then(() => {
				__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__scripts_notify__["a" /* default */])('プロフィールを更新しました');
			});
		};
});

    
  

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-sub-post-content', '<div class="body"><a class="reply" if="{post.reply_to_id}"><i class="fa fa-reply"></i></a><span ref="text"></span><a class="quote" if="{post.repost_id}" href="{\'/post:\' + post.repost_id}">RP: ...</a></div><details if="{post.media}"><summary>({post.media.length}つのメディア)</summary><mk-images-viewer images="{post.media}"></mk-images-viewer></details><details if="{post.poll}"><summary>投票</summary><mk-poll post="{post}"></mk-poll></details>', 'mk-sub-post-content,[data-is="mk-sub-post-content"]{display:block;overflow-wrap:break-word;} mk-sub-post-content > .body > .reply,[data-is="mk-sub-post-content"] > .body > .reply{margin-right:6px;color:#717171} mk-sub-post-content > .body > .quote,[data-is="mk-sub-post-content"] > .body > .quote{margin-left:4px;font-style:oblique;color:#a0bf46} mk-sub-post-content mk-poll,[data-is="mk-sub-post-content"] mk-poll{font-size:80%}', '', function(opts) {

		this.mixin('user-preview');

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
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_date_stringify__ = __webpack_require__(68);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-timeline-post-sub', '<article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar" data-user-preview="{post.user_id}"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}">{post.user.name}</a><span class="username">@{post.user.username}</span><a class="created-at" href="{CONFIG.url + \'/\' + post.user.username + \'/\' + post.id}"><mk-time time="{post.created_at}"></mk-time></a></header><div class="body"><mk-sub-post-content class="text" post="{post}"></mk-sub-post-content></div></div></article>', 'mk-timeline-post-sub,[data-is="mk-timeline-post-sub"]{display:block;margin:0;padding:0;font-size:.9em;} mk-timeline-post-sub > article,[data-is="mk-timeline-post-sub"] > article{padding:16px;} mk-timeline-post-sub > article:after,[data-is="mk-timeline-post-sub"] > article:after{content:"";display:block;clear:both} mk-timeline-post-sub > article:hover > .main > footer > button,[data-is="mk-timeline-post-sub"] > article:hover > .main > footer > button{color:#888} mk-timeline-post-sub > article > .avatar-anchor,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor{display:block;float:left;margin:0 14px 0 0;} mk-timeline-post-sub > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post-sub"] > article > .avatar-anchor > .avatar{display:block;width:52px;height:52px;margin:0;border-radius:8px;vertical-align:bottom} mk-timeline-post-sub > article > .main,[data-is="mk-timeline-post-sub"] > article > .main{float:left;width:calc(100% - 66px);} mk-timeline-post-sub > article > .main > header,[data-is="mk-timeline-post-sub"] > article > .main > header{display:flex;margin-bottom:2px;white-space:nowrap;line-height:21px;} mk-timeline-post-sub > article > .main > header > .name,[data-is="mk-timeline-post-sub"] > article > .main > header > .name{display:block;margin:0 .5em 0 0;padding:0;overflow:hidden;color:#607073;font-size:1em;font-weight:700;text-align:left;text-decoration:none;text-overflow:ellipsis;} mk-timeline-post-sub > article > .main > header > .name:hover,[data-is="mk-timeline-post-sub"] > article > .main > header > .name:hover{text-decoration:underline} mk-timeline-post-sub > article > .main > header > .username,[data-is="mk-timeline-post-sub"] > article > .main > header > .username{text-align:left;margin:0 .5em 0 0;color:#d1d8da} mk-timeline-post-sub > article > .main > header > .created-at,[data-is="mk-timeline-post-sub"] > article > .main > header > .created-at{margin-left:auto;color:#b2b8bb} mk-timeline-post-sub > article > .main > .body > .text,[data-is="mk-timeline-post-sub"] > article > .main > .body > .text{cursor:default;margin:0;padding:0;font-size:1.1em;color:#717171;} mk-timeline-post-sub > article > .main > .body > .text pre,[data-is="mk-timeline-post-sub"] > article > .main > .body > .text pre{max-height:120px;font-size:80%}', 'title="{title}"', function(opts) {

		this.mixin('user-preview');

		this.post = this.opts.post;
		this.title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_date_stringify__["a" /* default */])(this.post.created_at);
});

    
  

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_text_compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__ = __webpack_require__(68);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-timeline-post', '<div class="reply-to" if="{p.reply_to}"><mk-timeline-post-sub post="{p.reply_to}"></mk-timeline-post-sub></div><div class="repost" if="{isRepost}"><p><a class="avatar-anchor" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}"><img class="avatar" riot-src="{post.user.avatar_url + \'?thumbnail&size=32\'}" alt="avatar"></a><i class="fa fa-retweet"></i>{\'Reposted by {}\'.substr(0, \'Reposted by {}\'.indexOf(\'{\'))}<a class="name" href="{CONFIG.url + \'/\' + post.user.username}" data-user-preview="{post.user_id}">{post.user.name}</a>{\'Reposted by {}\'.substr(\'Reposted by {}\'.indexOf(\'}\') + 1)} </p><mk-time time="{post.created_at}"></mk-time></div><article><a class="avatar-anchor" href="{CONFIG.url + \'/\' + p.user.username}"><img class="avatar" riot-src="{p.user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar" data-user-preview="{p.user.id}"></a><div class="main"><header><a class="name" href="{CONFIG.url + \'/\' + p.user.username}" data-user-preview="{p.user.id}">{p.user.name}</a><span class="is-bot" if="{p.user.is_bot}">bot</span><span class="username">@{p.user.username}</span><div class="info"><span class="app" if="{p.app}">via <b>{p.app.name}</b></span><a class="created-at" href="{url}"><mk-time time="{p.created_at}"></mk-time></a></div></header><div class="body"><div class="text" ref="text"><a class="reply" if="{p.reply_to}"><i class="fa fa-reply"></i></a><p class="dummy"></p><a class="quote" if="{p.repost != null}">RP:</a></div><div class="media" if="{p.media}"><mk-images-viewer images="{p.media}"></mk-images-viewer></div><mk-poll if="{p.poll}" post="{p}" ref="pollViewer"></mk-poll><div class="repost" if="{p.repost}"><i class="fa fa-quote-right fa-flip-horizontal"></i><mk-post-preview class="repost" post="{p.repost}"></mk-post-preview></div></div><footer><mk-reactions-viewer post="{p}" ref="reactionsViewer"></mk-reactions-viewer><button onclick="{reply}" title="Reply"><i class="fa fa-reply"></i><p class="count" if="{p.replies_count > 0}">{p.replies_count}</p></button><button onclick="{repost}" title="Repost"><i class="fa fa-retweet"></i><p class="count" if="{p.repost_count > 0}">{p.repost_count}</p></button><button class="{reacted: p.my_reaction != null}" onclick="{react}" ref="reactButton" title="Add your reaction"><i class="fa fa-plus"></i><p class="count" if="{p.reactions_count > 0}">{p.reactions_count}</p></button><button><i class="fa fa-ellipsis-h"></i></button><button onclick="{toggleDetail}" title="%i18n:desktop.tags.mk-timeline-post.detail"><i class="fa fa-caret-down" if="{!isDetailOpened}"></i><i class="fa fa-caret-up" if="{isDetailOpened}"></i></button></footer></div></article><div class="detail" if="{isDetailOpened}"><mk-post-status-graph width="462" height="130" post="{p}"></mk-post-status-graph></div>', 'mk-timeline-post,[data-is="mk-timeline-post"]{display:block;margin:0;padding:0;background:#fff;} mk-timeline-post:focus,[data-is="mk-timeline-post"]:focus{z-index:1;} mk-timeline-post:focus:after,[data-is="mk-timeline-post"]:focus:after{content:"";pointer-events:none;position:absolute;top:2px;right:2px;bottom:2px;left:2px;border:2px solid rgba(135,187,53,0.3);border-radius:4px} mk-timeline-post > .repost,[data-is="mk-timeline-post"] > .repost{color:#9dbb00;background:linear-gradient(to bottom,#edfde2 0%,#fff 100%);} mk-timeline-post > .repost > p,[data-is="mk-timeline-post"] > .repost > p{margin:0;padding:16px 32px;line-height:28px;} mk-timeline-post > .repost > p .avatar-anchor,[data-is="mk-timeline-post"] > .repost > p .avatar-anchor{display:inline-block;} mk-timeline-post > .repost > p .avatar-anchor .avatar,[data-is="mk-timeline-post"] > .repost > p .avatar-anchor .avatar{vertical-align:bottom;width:28px;height:28px;margin:0 8px 0 0;border-radius:6px} mk-timeline-post > .repost > p i,[data-is="mk-timeline-post"] > .repost > p i{margin-right:4px} mk-timeline-post > .repost > p .name,[data-is="mk-timeline-post"] > .repost > p .name{font-weight:bold} mk-timeline-post > .repost > mk-time,[data-is="mk-timeline-post"] > .repost > mk-time{position:absolute;top:16px;right:32px;font-size:.9em;line-height:28px} mk-timeline-post > .repost + article,[data-is="mk-timeline-post"] > .repost + article{padding-top:8px} mk-timeline-post > .reply-to,[data-is="mk-timeline-post"] > .reply-to{padding:0 16px;background:rgba(0,0,0,0.013);} mk-timeline-post > .reply-to > mk-post-preview,[data-is="mk-timeline-post"] > .reply-to > mk-post-preview{background:transparent} mk-timeline-post > article,[data-is="mk-timeline-post"] > article{padding:28px 32px 18px 32px;} mk-timeline-post > article:after,[data-is="mk-timeline-post"] > article:after{content:"";display:block;clear:both} mk-timeline-post > article:hover > .main > footer > button,[data-is="mk-timeline-post"] > article:hover > .main > footer > button{color:#888} mk-timeline-post > article > .avatar-anchor,[data-is="mk-timeline-post"] > article > .avatar-anchor{display:block;float:left;margin:0 16px 10px 0;position:-webkit-sticky;position:sticky;top:74px;} mk-timeline-post > article > .avatar-anchor > .avatar,[data-is="mk-timeline-post"] > article > .avatar-anchor > .avatar{display:block;width:58px;height:58px;margin:0;border-radius:8px;vertical-align:bottom} mk-timeline-post > article > .main,[data-is="mk-timeline-post"] > article > .main{float:left;width:calc(100% - 74px);} mk-timeline-post > article > .main > header,[data-is="mk-timeline-post"] > article > .main > header{display:flex;margin-bottom:4px;white-space:nowrap;line-height:1.4;} mk-timeline-post > article > .main > header > .name,[data-is="mk-timeline-post"] > article > .main > header > .name{display:block;margin:0 .5em 0 0;padding:0;overflow:hidden;color:#777;font-size:1em;font-weight:700;text-align:left;text-decoration:none;text-overflow:ellipsis;} mk-timeline-post > article > .main > header > .name:hover,[data-is="mk-timeline-post"] > article > .main > header > .name:hover{text-decoration:underline} mk-timeline-post > article > .main > header > .is-bot,[data-is="mk-timeline-post"] > article > .main > header > .is-bot{text-align:left;margin:0 .5em 0 0;padding:1px 6px;font-size:12px;color:#aaa;border:solid 1px #ddd;border-radius:3px} mk-timeline-post > article > .main > header > .username,[data-is="mk-timeline-post"] > article > .main > header > .username{text-align:left;margin:0 .5em 0 0;color:#ccc} mk-timeline-post > article > .main > header > .info,[data-is="mk-timeline-post"] > article > .main > header > .info{margin-left:auto;text-align:right;font-size:.9em;} mk-timeline-post > article > .main > header > .info > .app,[data-is="mk-timeline-post"] > article > .main > header > .info > .app{margin-right:8px;padding-right:8px;color:#ccc;border-right:solid 1px #eaeaea} mk-timeline-post > article > .main > header > .info > .created-at,[data-is="mk-timeline-post"] > article > .main > header > .info > .created-at{color:#c0c0c0} mk-timeline-post > article > .main > .body > .text,[data-is="mk-timeline-post"] > article > .main > .body > .text{cursor:default;display:block;margin:0;padding:0;overflow-wrap:break-word;font-size:1.1em;color:#717171;} mk-timeline-post > article > .main > .body > .text > .dummy,[data-is="mk-timeline-post"] > article > .main > .body > .text > .dummy{display:none} mk-timeline-post > article > .main > .body > .text mk-url-preview,[data-is="mk-timeline-post"] > article > .main > .body > .text mk-url-preview{margin-top:8px} mk-timeline-post > article > .main > .body > .text .link:after,[data-is="mk-timeline-post"] > article > .main > .body > .text .link:after{content:"\\f14c";display:inline-block;padding-left:2px;font-family:FontAwesome;font-size:.9em;font-weight:400;font-style:normal} mk-timeline-post > article > .main > .body > .text > .reply,[data-is="mk-timeline-post"] > article > .main > .body > .text > .reply{margin-right:8px;color:#717171} mk-timeline-post > article > .main > .body > .text > .quote,[data-is="mk-timeline-post"] > article > .main > .body > .text > .quote{margin-left:4px;font-style:oblique;color:#a0bf46} mk-timeline-post > article > .main > .body > .text code,[data-is="mk-timeline-post"] > article > .main > .body > .text code{padding:4px 8px;margin:0 .5em;font-size:80%;color:#525252;background:#f8f8f8;border-radius:2px} mk-timeline-post > article > .main > .body > .text pre > code,[data-is="mk-timeline-post"] > article > .main > .body > .text pre > code{padding:16px;margin:0} mk-timeline-post > article > .main > .body > .text [data-is-me]:after,[data-is="mk-timeline-post"] > article > .main > .body > .text [data-is-me]:after{content:"you";padding:0 4px;margin-left:4px;font-size:80%;color:#fff;background:#87bb35;border-radius:4px} mk-timeline-post > article > .main > .body > .media > img,[data-is="mk-timeline-post"] > article > .main > .body > .media > img{display:block;max-width:100%} mk-timeline-post > article > .main > .body > mk-poll,[data-is="mk-timeline-post"] > article > .main > .body > mk-poll{font-size:80%} mk-timeline-post > article > .main > .body > .repost,[data-is="mk-timeline-post"] > article > .main > .body > .repost{margin:8px 0;} mk-timeline-post > article > .main > .body > .repost > i:first-child,[data-is="mk-timeline-post"] > article > .main > .body > .repost > i:first-child{position:absolute;top:-8px;left:-8px;z-index:1;color:#c0dac6;font-size:28px;background:#fff} mk-timeline-post > article > .main > .body > .repost > mk-post-preview,[data-is="mk-timeline-post"] > article > .main > .body > .repost > mk-post-preview{padding:16px;border:dashed 1px #c0dac6;border-radius:8px} mk-timeline-post > article > .main > footer > button,[data-is="mk-timeline-post"] > article > .main > footer > button{margin:0 28px 0 0;padding:0 8px;line-height:32px;font-size:1em;color:#ddd;background:transparent;border:none;cursor:pointer;} mk-timeline-post > article > .main > footer > button:hover,[data-is="mk-timeline-post"] > article > .main > footer > button:hover{color:#666} mk-timeline-post > article > .main > footer > button > .count,[data-is="mk-timeline-post"] > article > .main > footer > button > .count{display:inline;margin:0 0 0 8px;color:#999} mk-timeline-post > article > .main > footer > button.reacted,[data-is="mk-timeline-post"] > article > .main > footer > button.reacted{color:#87bb35} mk-timeline-post > article > .main > footer > button:last-child,[data-is="mk-timeline-post"] > article > .main > footer > button:last-child{position:absolute;right:0;margin:0} mk-timeline-post > .detail,[data-is="mk-timeline-post"] > .detail{padding-top:4px;background:rgba(0,0,0,0.013)}', 'tabindex="-1" title="{title}" onkeydown="{onKeyDown}"', function(opts) {

		this.mixin('api');
		this.mixin('stream');
		this.mixin('user-preview');

		this.isDetailOpened = false;

		this.set = post => {
			this.post = post;
			this.isRepost = this.post.repost && this.post.text == null && this.post.media_ids == null && this.post.poll == null;
			this.p = this.isRepost ? this.post.repost : this.post;
			this.p.reactions_count = this.p.reaction_counts ? Object.keys(this.p.reaction_counts).map(key => this.p.reaction_counts[key]).reduce((a, b) => a + b) : 0;
			this.title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_date_stringify__["a" /* default */])(this.p.created_at);
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
			riot.mount(document.body.appendChild(document.createElement('mk-post-form-window')), {
				reply: this.p
			});
		};

		this.repost = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-repost-form-window')), {
				post: this.p
			});
		};

		this.react = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-reaction-picker')), {
				source: this.refs.reactButton,
				post: this.p
			});
		};

		this.toggleDetail = () => {
			this.update({
				isDetailOpened: !this.isDetailOpened
			});
		};

		this.onKeyDown = e => {
			let shouldBeCancel = true;

			switch (true) {
				case e.which == 38:
				case e.which == 74:
				case e.which == 9 && e.shiftKey:
					focus(this.root, e => e.previousElementSibling);
					break;

				case e.which == 40:
				case e.which == 75:
				case e.which == 9:
					focus(this.root, e => e.nextElementSibling);
					break;

				case e.which == 81:
				case e.which == 69:
					this.repost();
					break;

				case e.which == 70:
				case e.which == 76:
					this.like();
					break;

				case e.which == 82:
					this.reply();
					break;

				default:
					shouldBeCancel = false;
			}

			if (shouldBeCancel) e.preventDefault();
		};

		function focus(el, fn) {
			const target = fn(el);
			if (target) {
				if (target.hasAttribute('tabindex')) {
					target.focus();
				} else {
					focus(target, fn);
				}
			}
		}
});

    
  

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-timeline', '<virtual each="{post, i in posts}"><mk-timeline-post post="{post}"></mk-timeline-post><p class="date" if="{i != posts.length - 1 && post._date != posts[i + 1]._date}"><span><i class="fa fa-angle-up"></i>{post._datetext}</span><span><i class="fa fa-angle-down"></i>{posts[i + 1]._datetext}</span></p></virtual><footer data-yield="footer"><yield from="footer"></yield></footer>', 'mk-timeline,[data-is="mk-timeline"]{display:block;} mk-timeline > mk-timeline-post,[data-is="mk-timeline"] > mk-timeline-post{border-bottom:solid 1px #eaeaea;} mk-timeline > mk-timeline-post:first-child,[data-is="mk-timeline"] > mk-timeline-post:first-child{border-top-left-radius:6px;border-top-right-radius:6px} mk-timeline > mk-timeline-post:last-of-type,[data-is="mk-timeline"] > mk-timeline-post:last-of-type{border-bottom:none} mk-timeline > .date,[data-is="mk-timeline"] > .date{display:block;margin:0;line-height:32px;font-size:14px;text-align:center;color:#aaa;background:#fdfdfd;border-bottom:solid 1px #eaeaea;} mk-timeline > .date span,[data-is="mk-timeline"] > .date span{margin:0 16px} mk-timeline > .date i,[data-is="mk-timeline"] > .date i{margin-right:8px} mk-timeline > footer,[data-is="mk-timeline"] > footer{padding:16px;text-align:center;color:#ccc;border-top:solid 1px #eaeaea;border-bottom-left-radius:4px;border-bottom-right-radius:4px}', '', function(opts) {
		this.posts = [];

		this.on('update', () => {
			this.posts.forEach(post => {
				const date = new Date(post.created_at).getDate();
				const month = new Date(post.created_at).getMonth() + 1;
				post._date = date;
				post._datetext = `${month}月 ${date}日`;
			});
		});

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

		this.clear = () => {
			this.posts = [];
			this.update();
		};

		this.focus = () => {
			this.root.children[0].focus();
		};

});

    
  

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_signout__ = __webpack_require__(11);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-ui-header-account', '<button class="header" data-active="{isOpen.toString()}" onclick="{toggle}"><span class="username">{I.username}<i class="fa fa-angle-down" if="{!isOpen}"></i><i class="fa fa-angle-up" if="{isOpen}"></i></span><img class="avatar" riot-src="{I.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></button><div class="menu" if="{isOpen}"><ul><li><a href="{\'/\' + I.username}"><i class="fa fa-user"></i>Your profile<i class="fa fa-angle-right"></i></a></li><li onclick="{drive}"><p><i class="fa fa-cloud"></i>Drive<i class="fa fa-angle-right"></i></p></li><li><a href="/i>mentions"><i class="fa fa-at"></i>Mentions<i class="fa fa-angle-right"></i></a></li></ul><ul><li onclick="{settings}"><p><i class="fa fa-cog"></i>Settings<i class="fa fa-angle-right"></i></p></li></ul><ul><li onclick="{signout}"><p><i class="fa fa-power-off"></i>Sign out<i class="fa fa-angle-right"></i></p></li></ul></div>', 'mk-ui-header-account,[data-is="mk-ui-header-account"]{display:block;float:left;} mk-ui-header-account > .header,[data-is="mk-ui-header-account"] > .header{display:block;margin:0;padding:0;color:#dbe2e0;border:none;background:transparent;cursor:pointer;} mk-ui-header-account > .header *,[data-is="mk-ui-header-account"] > .header *{pointer-events:none} mk-ui-header-account > .header:hover,[data-is="mk-ui-header-account"] > .header:hover,mk-ui-header-account > .header[data-active=\'true\'],[data-is="mk-ui-header-account"] > .header[data-active=\'true\']{color:#fff;} mk-ui-header-account > .header:hover > .avatar,[data-is="mk-ui-header-account"] > .header:hover > .avatar,mk-ui-header-account > .header[data-active=\'true\'] > .avatar,[data-is="mk-ui-header-account"] > .header[data-active=\'true\'] > .avatar{filter:saturate(150%)} mk-ui-header-account > .header > .username,[data-is="mk-ui-header-account"] > .header > .username{display:block;float:left;margin:0 12px 0 16px;max-width:16em;line-height:48px;font-weight:bold;font-family:Meiryo,sans-serif;text-decoration:none;} mk-ui-header-account > .header > .username i,[data-is="mk-ui-header-account"] > .header > .username i{margin-left:8px} mk-ui-header-account > .header > .avatar,[data-is="mk-ui-header-account"] > .header > .avatar{display:block;float:left;min-width:32px;max-width:32px;min-height:32px;max-height:32px;margin:8px 8px 8px 0;border-radius:4px;transition:filter 100ms ease} mk-ui-header-account > .menu,[data-is="mk-ui-header-account"] > .menu{display:block;position:absolute;top:56px;right:-2px;width:230px;font-size:.8em;background:#fff;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,0.25);} mk-ui-header-account > .menu:before,[data-is="mk-ui-header-account"] > .menu:before{content:"";pointer-events:none;display:block;position:absolute;top:-28px;right:12px;border-top:solid 14px transparent;border-right:solid 14px transparent;border-bottom:solid 14px rgba(0,0,0,0.1);border-left:solid 14px transparent} mk-ui-header-account > .menu:after,[data-is="mk-ui-header-account"] > .menu:after{content:"";pointer-events:none;display:block;position:absolute;top:-27px;right:12px;border-top:solid 14px transparent;border-right:solid 14px transparent;border-bottom:solid 14px #fff;border-left:solid 14px transparent} mk-ui-header-account > .menu ul,[data-is="mk-ui-header-account"] > .menu ul{display:block;margin:10px 0;padding:0;list-style:none;} mk-ui-header-account > .menu ul + ul,[data-is="mk-ui-header-account"] > .menu ul + ul{padding-top:10px;border-top:solid 1px #eee} mk-ui-header-account > .menu ul > li,[data-is="mk-ui-header-account"] > .menu ul > li{display:block;margin:0;padding:0;} mk-ui-header-account > .menu ul > li > a,[data-is="mk-ui-header-account"] > .menu ul > li > a,mk-ui-header-account > .menu ul > li > p,[data-is="mk-ui-header-account"] > .menu ul > li > p{display:block;z-index:1;padding:0 28px;margin:0;line-height:40px;color:#868c8c;cursor:pointer;} mk-ui-header-account > .menu ul > li > a *,[data-is="mk-ui-header-account"] > .menu ul > li > a *,mk-ui-header-account > .menu ul > li > p *,[data-is="mk-ui-header-account"] > .menu ul > li > p *{pointer-events:none} mk-ui-header-account > .menu ul > li > a > i:first-of-type,[data-is="mk-ui-header-account"] > .menu ul > li > a > i:first-of-type,mk-ui-header-account > .menu ul > li > p > i:first-of-type,[data-is="mk-ui-header-account"] > .menu ul > li > p > i:first-of-type{margin-right:6px} mk-ui-header-account > .menu ul > li > a > i:last-of-type,[data-is="mk-ui-header-account"] > .menu ul > li > a > i:last-of-type,mk-ui-header-account > .menu ul > li > p > i:last-of-type,[data-is="mk-ui-header-account"] > .menu ul > li > p > i:last-of-type{display:block;position:absolute;top:0;right:8px;z-index:1;padding:0 20px;font-size:1.2em;line-height:40px} mk-ui-header-account > .menu ul > li > a:hover,[data-is="mk-ui-header-account"] > .menu ul > li > a:hover,mk-ui-header-account > .menu ul > li > p:hover,[data-is="mk-ui-header-account"] > .menu ul > li > p:hover,mk-ui-header-account > .menu ul > li > a:active,[data-is="mk-ui-header-account"] > .menu ul > li > a:active,mk-ui-header-account > .menu ul > li > p:active,[data-is="mk-ui-header-account"] > .menu ul > li > p:active{text-decoration:none;background:#87bb35;color:#fff}', '', function(opts) {
		this.signout = __WEBPACK_IMPORTED_MODULE_1__common_scripts_signout__["a" /* default */];

		this.mixin('i');

		this.isOpen = false;

		this.on('before-unmount', () => {
			this.close();
		});

		this.toggle = () => {
			this.isOpen ? this.close() : this.open();
		};

		this.open = () => {
			this.update({
				isOpen: true
			});
			document.querySelectorAll('body *').forEach(el => {
				el.addEventListener('mousedown', this.mousedown);
			});
		};

		this.close = () => {
			this.update({
				isOpen: false
			});
			document.querySelectorAll('body *').forEach(el => {
				el.removeEventListener('mousedown', this.mousedown);
			});
		};

		this.mousedown = e => {
			e.preventDefault();
			if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__["a" /* default */])(this.root, e.target) && this.root != e.target) this.close();
			return false;
		};

		this.drive = () => {
			this.close();
			riot.mount(document.body.appendChild(document.createElement('mk-drive-browser-window')));
		};

		this.settings = () => {
			this.close();
			riot.mount(document.body.appendChild(document.createElement('mk-settings-window')));
		};

});

    
  

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-header-clock', '<div class="header"><time ref="time"><span class="yyyymmdd">{yyyy}/{mm}/{dd}</span><br><span class="hhnn">{hh}<span riot-style="visibility:{now.getSeconds() % 2 == 0 ? \'visible\' : \'hidden\'}">:</span>{nn}</span></time></div><div class="content"><mk-analog-clock></mk-analog-clock></div>', 'mk-ui-header-clock,[data-is="mk-ui-header-clock"]{display:inline-block;overflow:visible;} mk-ui-header-clock > .header,[data-is="mk-ui-header-clock"] > .header{padding:0 12px;text-align:center;font-size:10px;} mk-ui-header-clock > .header,[data-is="mk-ui-header-clock"] > .header,mk-ui-header-clock > .header *,[data-is="mk-ui-header-clock"] > .header *{cursor:default} mk-ui-header-clock > .header:hover,[data-is="mk-ui-header-clock"] > .header:hover{background:#899492;} mk-ui-header-clock > .header:hover + .content,[data-is="mk-ui-header-clock"] > .header:hover + .content{visibility:visible} mk-ui-header-clock > .header:hover > time,[data-is="mk-ui-header-clock"] > .header:hover > time{color:#fff !important;} mk-ui-header-clock > .header:hover > time *,[data-is="mk-ui-header-clock"] > .header:hover > time *{color:#fff !important} mk-ui-header-clock > .header:after,[data-is="mk-ui-header-clock"] > .header:after{content:"";display:block;clear:both} mk-ui-header-clock > .header > time,[data-is="mk-ui-header-clock"] > .header > time{display:table-cell;vertical-align:middle;height:48px;color:#dbe2e0;} mk-ui-header-clock > .header > time > .yyyymmdd,[data-is="mk-ui-header-clock"] > .header > time > .yyyymmdd{opacity:.7} mk-ui-header-clock > .content,[data-is="mk-ui-header-clock"] > .content{visibility:hidden;display:block;position:absolute;top:auto;right:0;z-index:3;margin:0;padding:0;width:256px;background:#899492}', '', function(opts) {
		this.now = new Date();

		this.draw = () => {
			const now = this.now = new Date();
			this.yyyy = now.getFullYear();
			this.mm = ('0' + (now.getMonth() + 1)).slice(-2);
			this.dd = ('0' + now.getDate()).slice(-2);
			this.hh = ('0' + now.getHours()).slice(-2);
			this.nn = ('0' + now.getMinutes()).slice(-2);
			this.update();
		};

		this.on('mount', () => {
			this.draw();
			this.clock = setInterval(this.draw, 1000);
		});

		this.on('unmount', () => {
			clearInterval(this.clock);
		});
});

    
  

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-header-nav', '<ul if="{SIGNIN}"><li class="home {active: page == \'home\'}"><a href="{CONFIG.url}"><i class="fa fa-home"></i><p>Home</p></a></li><li class="messaging"><a onclick="{messaging}"><i class="fa fa-comments"></i><p>Messaging</p><i class="fa fa-circle" if="{hasUnreadMessagingMessages}"></i></a></li><li class="info"><a href="https://twitter.com/misskey_xyz" target="_blank"><i class="fa fa-info"></i><p>Info</p></a></li><li class="live"><a href="https://misskey.tk" target="_blank"><i class="fa fa-television"></i><p>Live</p></a></li></ul>', 'mk-ui-header-nav,[data-is="mk-ui-header-nav"]{display:inline-block;margin:0;padding:0;line-height:3rem;vertical-align:top;} mk-ui-header-nav > ul,[data-is="mk-ui-header-nav"] > ul{display:inline-block;margin:0;padding:0;vertical-align:top;line-height:3rem;list-style:none;} mk-ui-header-nav > ul > li,[data-is="mk-ui-header-nav"] > ul > li{display:inline-block;vertical-align:top;height:48px;line-height:48px;} mk-ui-header-nav > ul > li.active > a,[data-is="mk-ui-header-nav"] > ul > li.active > a{border-bottom:solid 3px #87bb35} mk-ui-header-nav > ul > li > a,[data-is="mk-ui-header-nav"] > ul > li > a{display:inline-block;z-index:1;height:100%;padding:0 24px;font-size:13px;font-variant:small-caps;color:#dbe2e0;text-decoration:none;transition:none;cursor:pointer;} mk-ui-header-nav > ul > li > a *,[data-is="mk-ui-header-nav"] > ul > li > a *{pointer-events:none} mk-ui-header-nav > ul > li > a:hover,[data-is="mk-ui-header-nav"] > ul > li > a:hover{color:#fff;text-decoration:none} mk-ui-header-nav > ul > li > a > i:first-child,[data-is="mk-ui-header-nav"] > ul > li > a > i:first-child{margin-right:8px} mk-ui-header-nav > ul > li > a > i:last-child,[data-is="mk-ui-header-nav"] > ul > li > a > i:last-child{margin-left:5px;vertical-align:super;font-size:10px;color:#87bb35;}@media (max-width:1100px){ mk-ui-header-nav > ul > li > a > i:last-child,[data-is="mk-ui-header-nav"] > ul > li > a > i:last-child{margin-left:-5px}} mk-ui-header-nav > ul > li > a > p,[data-is="mk-ui-header-nav"] > ul > li > a > p{display:inline;margin:0;}@media (max-width:1100px){ mk-ui-header-nav > ul > li > a > p,[data-is="mk-ui-header-nav"] > ul > li > a > p{display:none}}@media (max-width:700px){ mk-ui-header-nav > ul > li > a,[data-is="mk-ui-header-nav"] > ul > li > a{padding:0 12px}}', '', function(opts) {
		this.mixin('i');
		this.mixin('api');
		this.mixin('stream');

		this.page = this.opts.page;

		this.on('mount', () => {
			this.stream.on('read_all_messaging_messages', this.onReadAllMessagingMessages);
			this.stream.on('unread_messaging_message', this.onUnreadMessagingMessage);

			this.api('messaging/unread').then(res => {
				if (res.count > 0) {
					this.update({
						hasUnreadMessagingMessages: true
					});
				}
			});
		});

		this.on('unmount', () => {
			this.stream.off('read_all_messaging_messages', this.onReadAllMessagingMessages);
			this.stream.off('unread_messaging_message', this.onUnreadMessagingMessage);
		});

		this.onReadAllMessagingMessages = () => {
			this.update({
				hasUnreadMessagingMessages: false
			});
		};

		this.onUnreadMessagingMessage = () => {
			this.update({
				hasUnreadMessagingMessages: true
			});
		};

		this.messaging = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-messaging-window')));
		};
});

    
  

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__ = __webpack_require__(62);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-ui-header-notifications', '<button class="header" data-active="{isOpen}" onclick="{toggle}"><i class="fa fa-bell-o"></i></button><div class="notifications" if="{isOpen}"><mk-notifications></mk-notifications></div>', 'mk-ui-header-notifications,[data-is="mk-ui-header-notifications"]{display:block;float:left;} mk-ui-header-notifications > .header,[data-is="mk-ui-header-notifications"] > .header{display:block;margin:0;padding:0;width:32px;color:#dbe2e0;border:none;background:transparent;cursor:pointer;} mk-ui-header-notifications > .header *,[data-is="mk-ui-header-notifications"] > .header *{pointer-events:none} mk-ui-header-notifications > .header:hover,[data-is="mk-ui-header-notifications"] > .header:hover,mk-ui-header-notifications > .header[data-active=\'true\'],[data-is="mk-ui-header-notifications"] > .header[data-active=\'true\']{color:#fff} mk-ui-header-notifications > .header > i,[data-is="mk-ui-header-notifications"] > .header > i{font-size:1.2em;line-height:48px} mk-ui-header-notifications > .notifications,[data-is="mk-ui-header-notifications"] > .notifications{display:block;position:absolute;top:56px;right:-72px;width:300px;background:#fff;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,0.25);} mk-ui-header-notifications > .notifications:before,[data-is="mk-ui-header-notifications"] > .notifications:before{content:"";pointer-events:none;display:block;position:absolute;top:-28px;right:74px;border-top:solid 14px transparent;border-right:solid 14px transparent;border-bottom:solid 14px rgba(0,0,0,0.1);border-left:solid 14px transparent} mk-ui-header-notifications > .notifications:after,[data-is="mk-ui-header-notifications"] > .notifications:after{content:"";pointer-events:none;display:block;position:absolute;top:-27px;right:74px;border-top:solid 14px transparent;border-right:solid 14px transparent;border-bottom:solid 14px #fff;border-left:solid 14px transparent} mk-ui-header-notifications > .notifications > mk-notifications,[data-is="mk-ui-header-notifications"] > .notifications > mk-notifications{max-height:350px;font-size:1rem;overflow:auto}', '', function(opts) {

		this.isOpen = false;

		this.toggle = () => {
			this.isOpen ? this.close() : this.open();
		};

		this.open = () => {
			this.update({
				isOpen: true
			});
			document.querySelectorAll('body *').forEach(el => {
				el.addEventListener('mousedown', this.mousedown);
			});
		};

		this.close = () => {
			this.update({
				isOpen: false
			});
			document.querySelectorAll('body *').forEach(el => {
				el.removeEventListener('mousedown', this.mousedown);
			});
		};

		this.mousedown = e => {
			e.preventDefault();
			if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_contains__["a" /* default */])(this.root, e.target) && this.root != e.target) this.close();
			return false;
		};
});

    
  

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-header-post-button', '<button onclick="{post}" title="新規投稿"><i class="fa fa-pencil-square-o"></i></button>', 'mk-ui-header-post-button,[data-is="mk-ui-header-post-button"]{display:inline-block;padding:8px;height:100%;vertical-align:top;} mk-ui-header-post-button > button,[data-is="mk-ui-header-post-button"] > button{display:inline-block;margin:0;padding:0 10px;height:100%;font-size:1.2em;font-weight:normal;text-decoration:none;color:#fff;background:#87bb35 !important;outline:none;border:none;border-radius:2px;transition:background .1s ease;cursor:pointer;} mk-ui-header-post-button > button *,[data-is="mk-ui-header-post-button"] > button *{pointer-events:none} mk-ui-header-post-button > button:hover,[data-is="mk-ui-header-post-button"] > button:hover{background:#95c942 !important} mk-ui-header-post-button > button:active,[data-is="mk-ui-header-post-button"] > button:active{background:#7aa830 !important;transition:background 0s ease}', '', function(opts) {
		this.post = e => {
			this.parent.parent.openPostForm();
		};
});

    
  

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-header-search', '<form class="search" onsubmit="{onsubmit}"><input ref="q" type="search" placeholder="&#xf002; Search"><div class="result"></div></form>', 'mk-ui-header-search > form,[data-is="mk-ui-header-search"] > form{display:block;float:left;} mk-ui-header-search > form > input,[data-is="mk-ui-header-search"] > form > input{user-select:text;cursor:auto;margin:0;padding:6px 18px;width:14em;height:48px;font-size:1em;line-height:calc(48px - 12px);background:transparent;outline:none;border:none;border-radius:0;transition:color .5s ease,border .5s ease;font-family:FontAwesome,sans-serif;} mk-ui-header-search > form > input::-webkit-input-placeholder,[data-is="mk-ui-header-search"] > form > input::-webkit-input-placeholder{color:#9eaba8}', '', function(opts) {
		this.mixin('page');

		this.onsubmit = e => {
			e.preventDefault();
			this.page('/search:' + this.refs.q.value);
		};
});

    
  

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui-header', '<mk-donation if="{SIGNIN && I.data.no_donation != \'true\'}"></mk-donation><mk-special-message></mk-special-message><div class="main"><div class="backdrop"></div><div class="main"><div class="container"><div class="left"><mk-ui-header-nav page="{opts.page}"></mk-ui-header-nav></div><div class="right"><mk-ui-header-search></mk-ui-header-search><mk-ui-header-account if="{SIGNIN}"></mk-ui-header-account><mk-ui-header-notifications if="{SIGNIN}"></mk-ui-header-notifications><mk-ui-header-post-button if="{SIGNIN}"></mk-ui-header-post-button><mk-ui-header-clock></mk-ui-header-clock></div></div></div></div>', 'mk-ui-header,[data-is="mk-ui-header"]{display:block;position:-webkit-sticky;position:sticky;top:0;z-index:1024;width:100%;box-shadow:0 1px 1px rgba(0,0,0,0.075);} mk-ui-header > .main > .backdrop,[data-is="mk-ui-header"] > .main > .backdrop{position:absolute;top:0;z-index:1023;width:100%;height:48px;backdrop-filter:blur(12px);background:#313a40;} mk-ui-header > .main > .backdrop:after,[data-is="mk-ui-header"] > .main > .backdrop:after{content:"";display:block;width:100%;height:48px;background-image:url("/assets/desktop/header-logo-white.svg");background-size:64px;background-position:center;background-repeat:no-repeat} mk-ui-header > .main > .main,[data-is="mk-ui-header"] > .main > .main{z-index:1024;margin:0;padding:0;background-clip:content-box;font-size:.9rem;user-select:none;} mk-ui-header > .main > .main > .container,[data-is="mk-ui-header"] > .main > .main > .container{width:100%;max-width:1300px;margin:0 auto;} mk-ui-header > .main > .main > .container:after,[data-is="mk-ui-header"] > .main > .main > .container:after{content:"";display:block;clear:both} mk-ui-header > .main > .main > .container > .left,[data-is="mk-ui-header"] > .main > .main > .container > .left{float:left;height:3rem} mk-ui-header > .main > .main > .container > .right,[data-is="mk-ui-header"] > .main > .main > .container > .right{float:right;height:48px;}@media (max-width:1100px){ mk-ui-header > .main > .main > .container > .right > mk-ui-header-search,[data-is="mk-ui-header"] > .main > .main > .container > .right > mk-ui-header-search{display:none}}', '', function(opts) {
this.mixin('i');
});

    
  

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-ui-notification', '<p>{opts.message}</p>', 'mk-ui-notification,[data-is="mk-ui-notification"]{display:block;position:fixed;z-index:10000;top:-128px;left:0;right:0;margin:0 auto;padding:128px 0 0 0;width:500px;color:rgba(0,0,0,0.6);background:rgba(255,255,255,0.9);border-radius:0 0 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,0.2);transform:translateY(-64px);opacity:0;} mk-ui-notification > p,[data-is="mk-ui-notification"] > p{margin:0;line-height:64px;text-align:center}', '', function(opts) {

		this.on('mount', () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 1,
				translateY: [-64, 0],
				easing: 'easeOutElastic',
				duration: 500
			});

			setTimeout(() => {
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.root,
					opacity: 0,
					translateY: -64,
					duration: 500,
					easing: 'easeInElastic',
					complete: () => this.unmount()
				});
			}, 6000);
		});
});

    
  

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-ui', '<mk-ui-header page="{opts.page}"></mk-ui-header><mk-set-avatar-suggestion if="{SIGNIN && I.avatar_id == null}"></mk-set-avatar-suggestion><mk-set-banner-suggestion if="{SIGNIN && I.banner_id == null}"></mk-set-banner-suggestion><div class="content"><yield></yield></div><mk-stream-indicator></mk-stream-indicator>', 'mk-ui,[data-is="mk-ui"]{display:block}', '', function(opts) {
		this.mixin('i');

		this.openPostForm = () => {
			riot.mount(document.body.appendChild(document.createElement('mk-post-form-window')));
		};

		this.on('mount', () => {
			document.addEventListener('keydown', this.onkeydown);
		});

		this.on('unmount', () => {
			document.removeEventListener('keydown', this.onkeydown);
		});

		this.onkeydown = e => {
			if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') return;

			if (e.which == 80 || e.which == 78) {
				e.preventDefault();
				this.openPostForm();
			}
		};
});

    
  

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-followers-window', '<mk-window is-modal="{false}" width="{\'400px\'}" height="{\'550px\'}"><yield to="header"><img riot-src="{parent.user.avatar_url + \'?thumbnail&size=64\'}" alt="">{parent.user.name}のフォロワー</yield><yield to="content"><mk-user-followers user="{parent.user}"></mk-user-followers></yield></mk-window>', 'mk-user-followers-window > mk-window [data-yield=\'header\'] > img,[data-is="mk-user-followers-window"] > mk-window [data-yield=\'header\'] > img{display:inline-block;vertical-align:bottom;height:calc(100% - 10px);margin:5px;border-radius:4px}', '', function(opts) {
this.user = this.opts.user
});

    
  

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-followers', '<mk-users-list fetch="{fetch}" count="{user.followers_count}" you-know-count="{user.followers_you_know_count}" no-users="{\'フォロワーはいないようです。\'}"></mk-users-list>', 'mk-user-followers,[data-is="mk-user-followers"]{display:block;height:100%}', '', function(opts) {
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
});

    
  

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-following-window', '<mk-window is-modal="{false}" width="{\'400px\'}" height="{\'550px\'}"><yield to="header"><img riot-src="{parent.user.avatar_url + \'?thumbnail&size=64\'}" alt="">{parent.user.name}のフォロー</yield><yield to="content"><mk-user-following user="{parent.user}"></mk-user-following></yield></mk-window>', 'mk-user-following-window > mk-window [data-yield=\'header\'] > img,[data-is="mk-user-following-window"] > mk-window [data-yield=\'header\'] > img{display:inline-block;vertical-align:bottom;height:calc(100% - 10px);margin:5px;border-radius:4px}', '', function(opts) {
this.user = this.opts.user
});

    
  

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-following', '<mk-users-list fetch="{fetch}" count="{user.following_count}" you-know-count="{user.following_you_know_count}" no-users="{\'フォロー中のユーザーはいないようです。\'}"></mk-users-list>', 'mk-user-following,[data-is="mk-user-following"]{display:block;height:100%}', '', function(opts) {
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
});

    
  

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-graphs', '<section><h1>投稿</h1><mk-user-posts-graph user="{opts.user}"></mk-user-posts-graph></section><section><h1>フォロー/フォロワー</h1><mk-user-friends-graph user="{opts.user}"></mk-user-friends-graph></section><section><h1>いいね</h1><mk-user-likes-graph user="{opts.user}"></mk-user-likes-graph></section>', 'mk-user-graphs,[data-is="mk-user-graphs"]{display:block;} mk-user-graphs > section,[data-is="mk-user-graphs"] > section{margin:16px 0;background:#fff;border:solid 1px rgba(0,0,0,0.1);border-radius:4px;} mk-user-graphs > section > h1,[data-is="mk-user-graphs"] > section > h1{margin:0 0 8px 0;padding:0 16px;line-height:40px;font-size:1em;color:#666;border-bottom:solid 1px #eee} mk-user-graphs > section > *:not(h1),[data-is="mk-user-graphs"] > section > *:not(h1){margin:0 auto 16px auto}', '', function(opts) {
		this.on('mount', () => {
			this.trigger('loaded');
		});
});

    
  

/***/ }),
/* 182 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_update_banner__ = __webpack_require__(76);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-user-header', '<div class="banner" ref="banner" riot-style="{user.banner_url ? \'background-image: url(\' + user.banner_url + \'?thumbnail&size=1024)\' : \'\'}" onclick="{onUpdateBanner}"></div><img class="avatar" riot-src="{user.avatar_url + \'?thumbnail&size=150\'}" alt="avatar"><div class="title"><p class="name" href="{CONFIG.url + \'/\' + user.username}">{user.name}</p><p class="username">@{user.username}</p><p class="location" if="{user.profile.location}"><i class="fa fa-map-marker"></i>{user.profile.location}</p></div><footer><a href="{\'/\' + user.username}">投稿</a><a href="{\'/\' + user.username + \'/media\'}">メディア</a><a href="{\'/\' + user.username + \'/graphs\'}">グラフ</a></footer>', 'mk-user-header,[data-is="mk-user-header"]{display:block;background:#fff;} mk-user-header[data-is-dark-background] > .banner,[data-is="mk-user-header"][data-is-dark-background] > .banner{background-color:#383838} mk-user-header[data-is-dark-background] > .title,[data-is="mk-user-header"][data-is-dark-background] > .title{color:#fff;background:linear-gradient(transparent,rgba(0,0,0,0.7));} mk-user-header[data-is-dark-background] > .title > .name,[data-is="mk-user-header"][data-is-dark-background] > .title > .name{text-shadow:0 0 8px #000} mk-user-header > .banner,[data-is="mk-user-header"] > .banner{height:280px;background-color:#f5f5f5;background-size:cover;background-position:center} mk-user-header > .avatar,[data-is="mk-user-header"] > .avatar{display:block;position:absolute;bottom:16px;left:16px;z-index:2;width:150px;height:150px;margin:0;border:solid 3px #fff;border-radius:8px;box-shadow:1px 1px 3px rgba(0,0,0,0.2)} mk-user-header > .title,[data-is="mk-user-header"] > .title{position:absolute;bottom:58px;left:0;width:100%;padding:0 0 8px 195px;color:#656565;font-family:\'游ゴシック\',\'YuGothic\',\'ヒラギノ角ゴ ProN W3\',\'Hiragino Kaku Gothic ProN\',\'Meiryo\',\'メイリオ\',sans-serif;} mk-user-header > .title > .name,[data-is="mk-user-header"] > .title > .name{display:block;margin:0;line-height:40px;font-weight:bold;font-size:2em} mk-user-header > .title > .username,[data-is="mk-user-header"] > .title > .username,mk-user-header > .title > .location,[data-is="mk-user-header"] > .title > .location{display:inline-block;margin:0 16px 0 0;line-height:20px;opacity:.8;} mk-user-header > .title > .username > i,[data-is="mk-user-header"] > .title > .username > i,mk-user-header > .title > .location > i,[data-is="mk-user-header"] > .title > .location > i{margin-right:4px} mk-user-header > footer,[data-is="mk-user-header"] > footer{z-index:1;height:58px;padding-left:195px;background:#fff;} mk-user-header > footer > a,[data-is="mk-user-header"] > footer > a{display:inline-block;margin:0;width:100px;line-height:58px;color:#555} mk-user-header > footer > button,[data-is="mk-user-header"] > footer > button{display:block;position:absolute;top:0;right:0;margin:8px;padding:0;width:42px;line-height:40px;font-size:1.2em;color:#777;border:solid 1px #eee;border-radius:4px;} mk-user-header > footer > button:hover,[data-is="mk-user-header"] > footer > button:hover{color:#555;border:solid 1px #ddd}', 'data-is-dark-background="{user.banner_url != null}"', function(opts) {

		this.mixin('i');

		this.user = this.opts.user;

		this.on('mount', () => {
			window.addEventListener('load', this.scroll);
			window.addEventListener('scroll', this.scroll);
			window.addEventListener('resize', this.scroll);
		});

		this.on('unmount', () => {
			window.removeEventListener('load', this.scroll);
			window.removeEventListener('scroll', this.scroll);
			window.removeEventListener('resize', this.scroll);
		});

		this.scroll = () => {
			const top = window.scrollY;
			const height = 280 ;

			const pos = 50 - ((top / height) * 50);
			this.refs.banner.style.backgroundPosition = `center ${pos}%`;

			const blur = top / 32
			if (blur <= 10) this.refs.banner.style.filter = `blur(${blur}px)`;
		};

		this.onUpdateBanner = () => {
			if (!this.SIGNIN || this.I.id != this.user.id) return;

			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scripts_update_banner__["a" /* default */])(this.I, i => {
				this.user.banner_url = i.banner_url;
				this.update();
			});
		};
});

    
  

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-home', '<div class="side"><mk-user-profile user="{user}"></mk-user-profile><mk-user-photos user="{user}"></mk-user-photos></div><main><mk-user-timeline ref="tl" user="{user}"></mk-user-timeline></main>', 'mk-user-home,[data-is="mk-user-home"]{display:flex;justify-content:center;} mk-user-home > * > *,[data-is="mk-user-home"] > * > *{display:block;border:solid 1px rgba(0,0,0,0.075);border-radius:6px;} mk-user-home > * > *:not(:last-child),[data-is="mk-user-home"] > * > *:not(:last-child){margin-bottom:16px} mk-user-home > main,[data-is="mk-user-home"] > main{flex:1 1 560px;max-width:560px;margin:0;padding:16px 0 16px 16px} mk-user-home > .side,[data-is="mk-user-home"] > .side{flex:1 1 270px;max-width:270px;margin:0;padding:16px 0 16px 0}', '', function(opts) {
		this.user = this.opts.user;

		this.on('mount', () => {
			this.refs.tl.on('loaded', () => {
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__ = __webpack_require__(63);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-user-photos', '<p class="title"><i class="fa fa-camera"></i>フォト</p><p class="initializing" if="{initializing}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p><div class="stream" if="{!initializing && images.length > 0}"><virtual each="{image in images}"><div class="img" riot-style="{\'background-image: url(\' + image.url + \'?thumbnail&size=256)\'}"></div></virtual></div><p class="empty" if="{!initializing && images.length == 0}">写真はありません</p>', 'mk-user-photos,[data-is="mk-user-photos"]{display:block;background:#fff;} mk-user-photos > .title,[data-is="mk-user-photos"] > .title{z-index:1;margin:0;padding:0 16px;line-height:42px;font-size:.9em;font-weight:bold;color:#888;box-shadow:0 1px rgba(0,0,0,0.07);} mk-user-photos > .title > i,[data-is="mk-user-photos"] > .title > i{margin-right:4px} mk-user-photos > .stream,[data-is="mk-user-photos"] > .stream{display:-webkit-flex;display:-moz-flex;display:-ms-flex;display:flex;justify-content:center;flex-wrap:wrap;padding:8px;} mk-user-photos > .stream > .img,[data-is="mk-user-photos"] > .stream > .img{flex:1 1 33%;width:33%;height:80px;background-position:center center;background-size:cover;background-clip:content-box;border:solid 2px transparent} mk-user-photos > .initializing,[data-is="mk-user-photos"] > .initializing,mk-user-photos > .empty,[data-is="mk-user-photos"] > .empty{margin:0;padding:16px;text-align:center;color:#aaa;} mk-user-photos > .initializing > i,[data-is="mk-user-photos"] > .initializing > i,mk-user-photos > .empty > i,[data-is="mk-user-photos"] > .empty > i{margin-right:4px}', '', function(opts) {

		this.mixin('api');

		this.images = [];
		this.initializing = true;
		this.user = null;
		this.userPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__["a" /* default */])(this.opts.user)
			? this.opts.user
			: Promise.resolve(this.opts.user);

		this.on('mount', () => {
			this.userPromise.then(user => {
				this.update({
					user: user
				});

				this.api('users/posts', {
					user_id: this.user.id,
					with_media: true,
					limit: 9
				}).then(posts => {
					this.initializing = false;
					posts.forEach(post => {
						post.media.forEach(media => {
							if (this.images.length < 9) this.images.push(media);
						});
					});
					this.update();
				});
			});
		});
});

    
  

/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-user-preview', '<virtual if="{user != null}"><div class="banner" riot-style="{user.banner_url ? \'background-image: url(\' + user.banner_url + \'?thumbnail&size=512)\' : \'\'}"></div><a class="avatar" href="{CONFIG.url + \'/\' + user.username}" target="_blank"><img riot-src="{user.avatar_url + \'?thumbnail&size=64\'}" alt="avatar"></a><div class="title"><p class="name">{user.name}</p><p class="username">@{user.username}</p></div><div class="description">{user.description}</div><div class="status"><div><p>投稿</p><a>{user.posts_count}</a></div><div><p>フォロー</p><a>{user.following_count}</a></div><div><p>フォロワー</p><a>{user.followers_count}</a></div></div><mk-follow-button if="{SIGNIN && user.id != I.id}" user="{userPromise}"></mk-follow-button></virtual>', 'mk-user-preview,[data-is="mk-user-preview"]{display:block;position:absolute;z-index:2048;margin-top:-8px;width:250px;background:#fff;background-clip:content-box;border:solid 1px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;opacity:0;} mk-user-preview > .banner,[data-is="mk-user-preview"] > .banner{height:84px;background-color:#f5f5f5;background-size:cover;background-position:center} mk-user-preview > .avatar,[data-is="mk-user-preview"] > .avatar{display:block;position:absolute;top:62px;left:13px;} mk-user-preview > .avatar > img,[data-is="mk-user-preview"] > .avatar > img{display:block;width:58px;height:58px;margin:0;border:solid 3px #fff;border-radius:8px} mk-user-preview > .title,[data-is="mk-user-preview"] > .title{display:block;padding:8px 0 8px 82px;} mk-user-preview > .title > .name,[data-is="mk-user-preview"] > .title > .name{display:block;margin:0;font-weight:bold;line-height:16px;color:#656565} mk-user-preview > .title > .username,[data-is="mk-user-preview"] > .title > .username{display:block;margin:0;line-height:16px;font-size:.8em;color:#999} mk-user-preview > .description,[data-is="mk-user-preview"] > .description{padding:0 16px;font-size:.7em;color:#555} mk-user-preview > .status,[data-is="mk-user-preview"] > .status{padding:8px 16px;} mk-user-preview > .status > div,[data-is="mk-user-preview"] > .status > div{display:inline-block;width:33%;} mk-user-preview > .status > div > p,[data-is="mk-user-preview"] > .status > div > p{margin:0;font-size:.7em;color:#aaa} mk-user-preview > .status > div > a,[data-is="mk-user-preview"] > .status > div > a{font-size:1em;color:#87bb35} mk-user-preview > mk-follow-button,[data-is="mk-user-preview"] > mk-follow-button{position:absolute;top:92px;right:8px}', '', function(opts) {

		this.mixin('i');
		this.mixin('api');

		this.u = this.opts.user;
		this.user = null;
		this.userPromise =
			typeof this.u == 'string' ?
				new Promise((resolve, reject) => {
					this.api('users/show', {
						user_id: this.u[0] == '@' ? undefined : this.u,
						username: this.u[0] == '@' ? this.u.substr(1) : undefined
					}).then(resolve);
				})
			: Promise.resolve(this.u);

		this.on('mount', () => {
			this.userPromise.then(user => {
				this.update({
					user: user
				});
				this.open();
			});
		});

		this.open = () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 1,
				'margin-top': 0,
				duration: 200,
				easing: 'easeOutQuad'
			});
		};

		this.close = () => {
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.root,
				opacity: 0,
				'margin-top': '-8px',
				duration: 200,
				easing: 'easeOutQuad',
				complete: () => this.unmount()
			});
		};
});

    
  

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user-profile', '<div class="friend-form" if="{SIGNIN && I.id != user.id}"><mk-big-follow-button user="{user}"></mk-big-follow-button><p class="followed" if="{user.is_followed}">フォローされています</p></div><div class="description" if="{user.description}">{user.description}</div><div class="birthday" if="{user.profile.birthday}"><p><i class="fa fa-birthday-cake"></i>{user.profile.birthday.replace(\'-\', \'年\').replace(\'-\', \'月\') + \'日\'} ({age(user.profile.birthday)}歳)</p></div><div class="twitter" if="{user.twitter}"><p><i class="fa fa-twitter"></i><a href="{\'https://twitter.com/\' + user.twitter.screen_name}" target="_blank">@{user.twitter.screen_name}</a></p></div><div class="friends"><p class="following"><i class="fa fa-angle-right"></i><a onclick="{showFollowing}">{user.following_count}</a>人を<b>フォロー</b></p><p class="followers"><i class="fa fa-angle-right"></i><a onclick="{showFollowers}">{user.followers_count}</a>人の<b>フォロワー</b></p></div>', 'mk-user-profile,[data-is="mk-user-profile"]{display:block;background:#fff;} mk-user-profile > *:first-child,[data-is="mk-user-profile"] > *:first-child{border-top:none !important} mk-user-profile > .friend-form,[data-is="mk-user-profile"] > .friend-form{padding:16px;border-top:solid 1px #eee;} mk-user-profile > .friend-form > mk-big-follow-button,[data-is="mk-user-profile"] > .friend-form > mk-big-follow-button{width:100%} mk-user-profile > .friend-form > .followed,[data-is="mk-user-profile"] > .friend-form > .followed{margin:12px 0 0 0;padding:0;text-align:center;line-height:24px;font-size:.8em;color:#71afc7;background:#eefaff;border-radius:4px} mk-user-profile > .description,[data-is="mk-user-profile"] > .description{padding:16px;color:#555;border-top:solid 1px #eee} mk-user-profile > .birthday,[data-is="mk-user-profile"] > .birthday{padding:16px;color:#555;border-top:solid 1px #eee;} mk-user-profile > .birthday > p,[data-is="mk-user-profile"] > .birthday > p{margin:0;} mk-user-profile > .birthday > p > i,[data-is="mk-user-profile"] > .birthday > p > i{margin-right:8px} mk-user-profile > .twitter,[data-is="mk-user-profile"] > .twitter{padding:16px;color:#555;border-top:solid 1px #eee;} mk-user-profile > .twitter > p,[data-is="mk-user-profile"] > .twitter > p{margin:0;} mk-user-profile > .twitter > p > i,[data-is="mk-user-profile"] > .twitter > p > i{margin-right:8px} mk-user-profile > .friends,[data-is="mk-user-profile"] > .friends{padding:16px;color:#555;border-top:solid 1px #eee;} mk-user-profile > .friends > p,[data-is="mk-user-profile"] > .friends > p{margin:8px 0;} mk-user-profile > .friends > p > i,[data-is="mk-user-profile"] > .friends > p > i{margin-left:8px;margin-right:8px}', '', function(opts) {
		this.age = __webpack_require__(73);

		this.mixin('i');

		this.user = this.opts.user;

		this.showFollowing = () => {
 			riot.mount(document.body.appendChild(document.createElement('mk-user-following-window')), {
				user: this.user
			});
		};

		this.showFollowers = () => {
 			riot.mount(document.body.appendChild(document.createElement('mk-user-followers-window')), {
				user: this.user
			});
		};
});

    
  

/***/ }),
/* 187 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__ = __webpack_require__(63);

    var riot = __webpack_require__(0)
    
riot.tag2('mk-user-timeline', '<header><span data-is-active="{mode == \'default\'}" onclick="{setMode.bind(this, \'default\')}">投稿</span><span data-is-active="{mode == \'with-replies\'}" onclick="{setMode.bind(this, \'with-replies\')}">投稿と返信</span></header><div class="loading" if="{isLoading}"><mk-ellipsis-icon></mk-ellipsis-icon></div><p class="empty" if="{isEmpty}"><i class="fa fa-comments-o"></i>このユーザーはまだ何も投稿していないようです。</p><mk-timeline ref="timeline"><yield to="footer"><i class="fa fa-moon-o" if="{!parent.moreLoading}"></i><i class="fa fa-spinner fa-pulse fa-fw" if="{parent.moreLoading}"></i></yield></mk-timeline>', 'mk-user-timeline,[data-is="mk-user-timeline"]{display:block;background:#fff;} mk-user-timeline > header,[data-is="mk-user-timeline"] > header{padding:8px 16px;border-bottom:solid 1px #eee;} mk-user-timeline > header > span,[data-is="mk-user-timeline"] > header > span{margin-right:16px;line-height:27px;font-size:18px;color:#555;} mk-user-timeline > header > span:not([data-is-active]),[data-is="mk-user-timeline"] > header > span:not([data-is-active]){color:#87bb35;cursor:pointer;} mk-user-timeline > header > span:not([data-is-active]):hover,[data-is="mk-user-timeline"] > header > span:not([data-is-active]):hover{text-decoration:underline} mk-user-timeline > .loading,[data-is="mk-user-timeline"] > .loading{padding:64px 0} mk-user-timeline > .empty,[data-is="mk-user-timeline"] > .empty{display:block;margin:0 auto;padding:32px;max-width:400px;text-align:center;color:#999;} mk-user-timeline > .empty > i,[data-is="mk-user-timeline"] > .empty > i{display:block;margin-bottom:16px;font-size:3em;color:#ccc}', '', function(opts) {

		this.mixin('api');

		this.user = null;
		this.userPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_scripts_is_promise__["a" /* default */])(this.opts.user)
			? this.opts.user
			: Promise.resolve(this.opts.user);
		this.isLoading = true;
		this.isEmpty = false;
		this.moreLoading = false;
		this.unreadCount = 0;
		this.mode = 'default';

		this.on('mount', () => {
			document.addEventListener('keydown', this.onDocumentKeydown);
			window.addEventListener('scroll', this.onScroll);

			this.userPromise.then(user => {
				this.update({
					user: user
				});

				this.fetch(() => this.trigger('loaded'));
			});
		});

		this.on('unmount', () => {
			document.removeEventListener('keydown', this.onDocumentKeydown);
			window.removeEventListener('scroll', this.onScroll);
		});

		this.onDocumentKeydown = e => {
			if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
				if (e.which == 84) {
					this.refs.timeline.focus();
				}
			}
		};

		this.fetch = cb => {
			this.api('users/posts', {
				user_id: this.user.id,
				with_replies: this.mode == 'with-replies'
			}).then(posts => {
				this.update({
					isLoading: false,
					isEmpty: posts.length == 0
				});
				this.refs.timeline.setPosts(posts);
				if (cb) cb();
			});
		};

		this.more = () => {
			if (this.moreLoading || this.isLoading || this.refs.timeline.posts.length == 0) return;
			this.update({
				moreLoading: true
			});
			this.api('users/posts', {
				user_id: this.user.id,
				with_replies: this.mode == 'with-replies',
				max_id: this.refs.timeline.tail().id
			}).then(posts => {
				this.update({
					moreLoading: false
				});
				this.refs.timeline.prependPosts(posts);
			});
		};

		this.onScroll = () => {
			const current = window.scrollY + window.innerHeight;
			if (current > document.body.offsetHeight - 16 ) {
				this.more();
			}
		};

		this.setMode = mode => {
			this.update({
				mode: mode
			});
			this.fetch();
		};
});

    
  

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-user', '<div class="user" if="{!fetching}"><header><mk-user-header user="{user}"></mk-user-header></header><div class="body"><mk-user-home if="{page == \'home\'}" user="{user}"></mk-user-home><mk-user-graphs if="{page == \'graphs\'}" user="{user}"></mk-user-graphs></div></div>', 'mk-user,[data-is="mk-user"]{display:block;background:#fff;} mk-user > .user > header,[data-is="mk-user"] > .user > header{max-width:830px;margin:0 auto;padding:0 16px;} mk-user > .user > header > mk-user-header,[data-is="mk-user"] > .user > header > mk-user-header{border:solid 1px rgba(0,0,0,0.075);border-top:none;border-radius:0 0 6px 6px;overflow:hidden} mk-user > .user > .body,[data-is="mk-user"] > .user > .body{max-width:830px;margin:0 auto;padding:0 16px}', '', function(opts) {
		this.mixin('api');

		this.username = this.opts.user;
		this.page = this.opts.page ? this.opts.page : 'home';
		this.fetching = true;
		this.user = null;

		this.on('mount', () => {
			this.api('users/show', {
				username: this.username
			}).then(user => {
				this.update({
					fetching: false,
					user: user
				});
				this.trigger('loaded');
			});
		});
});

    
  

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('mk-users-list', '<nav><div><span data-is-active="{mode == \'all\'}" onclick="{setMode.bind(this, \'all\')}">すべて<span>{opts.count}</span></span><span if="{SIGNIN && opts.youKnowCount != \'\'}" data-is-active="{mode == \'iknow\'}" onclick="{setMode.bind(this, \'iknow\')}">知り合い<span>{opts.youKnowCount}</span></span></div></nav><div class="users" if="{!fetching && users.length != 0}"><div each="{users}"><mk-list-user user="{this}"></mk-list-user></div></div><button class="more" if="{!fetching && next != null}" onclick="{more}" disabled="{moreFetching}"><span if="{!moreFetching}">もっと</span><span if="{moreFetching}">読み込み中<mk-ellipsis></mk-ellipsis></span></button><p class="no" if="{!fetching && users.length == 0}">{opts.noUsers}</p><p class="fetching" if="{fetching}"><i class="fa fa-spinner fa-pulse fa-fw"></i>読み込んでいます <mk-ellipsis></mk-ellipsis></p>', 'mk-users-list,[data-is="mk-users-list"]{display:block;height:100%;background:#fff;} mk-users-list > nav,[data-is="mk-users-list"] > nav{z-index:1;box-shadow:0 1px 0 rgba(0,0,0,0.1);} mk-users-list > nav > div,[data-is="mk-users-list"] > nav > div{display:flex;justify-content:center;margin:0 auto;max-width:600px;} mk-users-list > nav > div > span,[data-is="mk-users-list"] > nav > div > span{display:block;flex:1 1;text-align:center;line-height:52px;font-size:14px;color:#657786;border-bottom:solid 2px transparent;cursor:pointer;} mk-users-list > nav > div > span *,[data-is="mk-users-list"] > nav > div > span *{pointer-events:none} mk-users-list > nav > div > span[data-is-active],[data-is="mk-users-list"] > nav > div > span[data-is-active]{font-weight:bold;color:#87bb35;border-color:#87bb35;cursor:default} mk-users-list > nav > div > span > span,[data-is="mk-users-list"] > nav > div > span > span{display:inline-block;margin-left:4px;padding:2px 5px;font-size:12px;line-height:1;color:#888;background:#eee;border-radius:20px} mk-users-list > .users,[data-is="mk-users-list"] > .users{height:calc(100% - 54px);overflow:auto;} mk-users-list > .users > *,[data-is="mk-users-list"] > .users > *{border-bottom:solid 1px rgba(0,0,0,0.05);} mk-users-list > .users > * > *,[data-is="mk-users-list"] > .users > * > *{max-width:600px;margin:0 auto} mk-users-list > .no,[data-is="mk-users-list"] > .no{margin:0;padding:16px;text-align:center;color:#aaa} mk-users-list > .fetching,[data-is="mk-users-list"] > .fetching{margin:0;padding:16px;text-align:center;color:#aaa;} mk-users-list > .fetching > i,[data-is="mk-users-list"] > .fetching > i{margin-right:4px}', '', function(opts) {
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
			this.opts.fetch(this.mode == 'iknow', this.limit, this.cursor, obj => {
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
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_animejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_animejs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_scripts_contains__ = __webpack_require__(62);

    var riot = __webpack_require__(0)
    

riot.tag2('mk-window', '<div class="bg" ref="bg" show="{isModal}" onclick="{bgClick}"></div><div class="main" ref="main" tabindex="-1" data-is-modal="{isModal}" onmousedown="{onBodyMousedown}" onkeydown="{onKeydown}"><div class="body"><header ref="header" onmousedown="{onHeaderMousedown}"><h1 data-yield="header"><yield from="header"></yield></h1><button class="close" if="{canClose}" onmousedown="{repelMove}" onclick="{close}" title="閉じる"><i class="fa fa-times"></i></button></header><div class="content" data-yield="content"><yield from="content"></yield></div></div><div class="handle top" if="{canResize}" onmousedown="{onTopHandleMousedown}"></div><div class="handle right" if="{canResize}" onmousedown="{onRightHandleMousedown}"></div><div class="handle bottom" if="{canResize}" onmousedown="{onBottomHandleMousedown}"></div><div class="handle left" if="{canResize}" onmousedown="{onLeftHandleMousedown}"></div><div class="handle top-left" if="{canResize}" onmousedown="{onTopLeftHandleMousedown}"></div><div class="handle top-right" if="{canResize}" onmousedown="{onTopRightHandleMousedown}"></div><div class="handle bottom-right" if="{canResize}" onmousedown="{onBottomRightHandleMousedown}"></div><div class="handle bottom-left" if="{canResize}" onmousedown="{onBottomLeftHandleMousedown}"></div></div>', 'mk-window,[data-is="mk-window"]{display:block;} mk-window > .bg,[data-is="mk-window"] > .bg{display:block;position:fixed;z-index:2048;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);opacity:0;pointer-events:none} mk-window > .main,[data-is="mk-window"] > .main{display:block;position:fixed;z-index:2048;top:15%;left:0;margin:0;opacity:0;pointer-events:none;} mk-window > .main:focus:not([data-is-modal]) > .body,[data-is="mk-window"] > .main:focus:not([data-is-modal]) > .body{box-shadow:0 0 0 1px rgba(135,187,53,0.5),0 2px 6px 0 rgba(0,0,0,0.2)} mk-window > .main > .handle,[data-is="mk-window"] > .main > .handle{position:absolute;} mk-window > .main > .handle.top,[data-is="mk-window"] > .main > .handle.top{top:-8px;left:0;width:100%;height:8px;cursor:ns-resize} mk-window > .main > .handle.right,[data-is="mk-window"] > .main > .handle.right{top:0;right:-8px;width:8px;height:100%;cursor:ew-resize} mk-window > .main > .handle.bottom,[data-is="mk-window"] > .main > .handle.bottom{bottom:-8px;left:0;width:100%;height:8px;cursor:ns-resize} mk-window > .main > .handle.left,[data-is="mk-window"] > .main > .handle.left{top:0;left:-8px;width:8px;height:100%;cursor:ew-resize} mk-window > .main > .handle.top-left,[data-is="mk-window"] > .main > .handle.top-left{top:-8px;left:-8px;width:16px;height:16px;cursor:nwse-resize} mk-window > .main > .handle.top-right,[data-is="mk-window"] > .main > .handle.top-right{top:-8px;right:-8px;width:16px;height:16px;cursor:nesw-resize} mk-window > .main > .handle.bottom-right,[data-is="mk-window"] > .main > .handle.bottom-right{bottom:-8px;right:-8px;width:16px;height:16px;cursor:nwse-resize} mk-window > .main > .handle.bottom-left,[data-is="mk-window"] > .main > .handle.bottom-left{bottom:-8px;left:-8px;width:16px;height:16px;cursor:nesw-resize} mk-window > .main > .body,[data-is="mk-window"] > .main > .body{height:100%;overflow:hidden;background:#fff;border-radius:6px;box-shadow:0 2px 6px 0 rgba(0,0,0,0.2);} mk-window > .main > .body > header,[data-is="mk-window"] > .main > .body > header{z-index:128;overflow:hidden;cursor:move;background:#fff;border-radius:6px 6px 0 0;box-shadow:0 1px 0 rgba(0,0,0,0.1);} mk-window > .main > .body > header,[data-is="mk-window"] > .main > .body > header,mk-window > .main > .body > header *,[data-is="mk-window"] > .main > .body > header *{user-select:none} mk-window > .main > .body > header > h1,[data-is="mk-window"] > .main > .body > header > h1{pointer-events:none;display:block;margin:0;height:40px;text-align:center;font-size:1em;line-height:40px;font-weight:normal;color:#666} mk-window > .main > .body > header > .close,[data-is="mk-window"] > .main > .body > header > .close{cursor:pointer;display:block;position:absolute;top:0;right:0;z-index:1;margin:0;padding:0;font-size:1.2em;color:rgba(0,0,0,0.4);border:none;outline:none;background:transparent;} mk-window > .main > .body > header > .close:hover,[data-is="mk-window"] > .main > .body > header > .close:hover{color:rgba(0,0,0,0.6)} mk-window > .main > .body > header > .close:active,[data-is="mk-window"] > .main > .body > header > .close:active{color:#000} mk-window > .main > .body > header > .close > i,[data-is="mk-window"] > .main > .body > header > .close > i{padding:0;width:40px;line-height:40px} mk-window > .main > .body > .content,[data-is="mk-window"] > .main > .body > .content{height:100%} mk-window:not([flexible]) > .main > .body > .content,[data-is="mk-window"]:not([flexible]) > .main > .body > .content{height:calc(100% - 40px)}', 'data-flexible="{isFlexible}" ondragover="{ondragover}"', function(opts) {

		this.minHeight = 40;
		this.minWidth = 200;

		this.isModal = this.opts.isModal != null ? this.opts.isModal : false;
		this.canClose = this.opts.canClose != null ? this.opts.canClose : true;
		this.isFlexible = this.opts.height == null;
		this.canResize = !this.isFlexible;

		this.on('mount', () => {
			this.refs.main.style.width = this.opts.width || '530px';
			this.refs.main.style.height = this.opts.height || 'auto';

			this.refs.main.style.top = '15%';
			this.refs.main.style.left = (window.innerWidth / 2) - (this.refs.main.offsetWidth / 2) + 'px';

			this.refs.header.addEventListener('contextmenu', e => {
				e.preventDefault();
			});

			window.addEventListener('resize', this.onBrowserResize);

			this.open();
		});

		this.on('unmount', () => {
			window.removeEventListener('resize', this.onBrowserResize);
		});

		this.onBrowserResize = () => {
			const position = this.refs.main.getBoundingClientRect();
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.refs.main.offsetWidth;
			const windowHeight = this.refs.main.offsetHeight;
			if (position.left < 0) this.refs.main.style.left = 0;
			if (position.top < 0) this.refs.main.style.top = 0;
			if (position.left + windowWidth > browserWidth) this.refs.main.style.left = browserWidth - windowWidth + 'px';
			if (position.top + windowHeight > browserHeight) this.refs.main.style.top = browserHeight - windowHeight + 'px';
		};

		this.open = () => {
			this.trigger('opening');

			this.top();

			if (this.isModal) {
				this.refs.bg.style.pointerEvents = 'auto';
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.refs.bg,
					opacity: 1,
					duration: 100,
					easing: 'linear'
				});
			}

			this.refs.main.style.pointerEvents = 'auto';
			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.main,
				opacity: 1,
				scale: [1.1, 1],
				duration: 200,
				easing: 'easeOutQuad'
			});

			setTimeout(() => {
				this.trigger('opened');
			}, 300);
		};

		this.close = () => {
			this.trigger('closing');

			if (this.isModal) {
				this.refs.bg.style.pointerEvents = 'none';
				__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
					targets: this.refs.bg,
					opacity: 0,
					duration: 300,
					easing: 'linear'
				});
			}

			this.refs.main.style.pointerEvents = 'none';

			__WEBPACK_IMPORTED_MODULE_0_animejs___default()({
				targets: this.refs.main,
				opacity: 0,
				scale: 0.8,
				duration: 300,
				easing: [0.5, -0.5, 1, 0.5]
			});

			setTimeout(() => {
				this.trigger('closed');
			}, 300);
		};

		this.top = () => {
			let z = 0;

			const ws = document.querySelectorAll('mk-window');
			ws.forEach(w => {
				if (w == this.root) return;
				const m = w.querySelector(':scope > .main');
				const mz = Number(document.defaultView.getComputedStyle(m, null).zIndex);
				if (mz > z) z = mz;
			});

			if (z > 0) {
				this.refs.main.style.zIndex = z + 1;
				if (this.isModal) this.refs.bg.style.zIndex = z + 1;
			}
		};

		this.repelMove = e => {
			e.stopPropagation();
			return true;
		};

		this.bgClick = () => {
			if (this.canClose) this.close();
		};

		this.onBodyMousedown = () => {
			this.top();
		};

		this.onHeaderMousedown = e => {
			e.preventDefault();

			if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_scripts_contains__["a" /* default */])(this.refs.main, document.activeElement)) this.refs.main.focus();

			const position = this.refs.main.getBoundingClientRect();

			const clickX = e.clientX;
			const clickY = e.clientY;
			const moveBaseX = clickX - position.left;
			const moveBaseY = clickY - position.top;
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.refs.main.offsetWidth;
			const windowHeight = this.refs.main.offsetHeight;

			dragListen(me => {
				let moveLeft = me.clientX - moveBaseX;
				let moveTop = me.clientY - moveBaseY;

				if (moveTop < 0) moveTop = 0;

				if (moveLeft < 0) moveLeft = 0;

				if (moveTop + windowHeight > browserHeight) moveTop = browserHeight - windowHeight;

				if (moveLeft + windowWidth > browserWidth) moveLeft = browserWidth - windowWidth;

				this.refs.main.style.left = moveLeft + 'px';
				this.refs.main.style.top = moveTop + 'px';
			});
		};

		this.onTopHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientY;
			const height = parseInt(getComputedStyle(this.refs.main, '').height, 10);
			const top = parseInt(getComputedStyle(this.refs.main, '').top, 10);

			dragListen(me => {
				const move = me.clientY - base;
				if (top + move > 0) {
					if (height + -move > this.minHeight) {
						this.applyTransformHeight(height + -move);
						this.applyTransformTop(top + move);
					} else {
						this.applyTransformHeight(this.minHeight);
						this.applyTransformTop(top + (height - this.minHeight));
					}
				} else {
					this.applyTransformHeight(top + height);
					this.applyTransformTop(0);
				}
			});
		};

		this.onRightHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientX;
			const width = parseInt(getComputedStyle(this.refs.main, '').width, 10);
			const left = parseInt(getComputedStyle(this.refs.main, '').left, 10);
			const browserWidth = window.innerWidth;

			dragListen(me => {
				const move = me.clientX - base;
				if (left + width + move < browserWidth) {
					if (width + move > this.minWidth) {
						this.applyTransformWidth(width + move);
					} else {
						this.applyTransformWidth(this.minWidth);
					}
				} else {
					this.applyTransformWidth(browserWidth - left);
				}
			});
		};

		this.onBottomHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientY;
			const height = parseInt(getComputedStyle(this.refs.main, '').height, 10);
			const top = parseInt(getComputedStyle(this.refs.main, '').top, 10);
			const browserHeight = window.innerHeight;

			dragListen(me => {
				const move = me.clientY - base;
				if (top + height + move < browserHeight) {
					if (height + move > this.minHeight) {
						this.applyTransformHeight(height + move);
					} else {
						this.applyTransformHeight(this.minHeight);
					}
				} else {
					this.applyTransformHeight(browserHeight - top);
				}
			});
		};

		this.onLeftHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientX;
			const width = parseInt(getComputedStyle(this.refs.main, '').width, 10);
			const left = parseInt(getComputedStyle(this.refs.main, '').left, 10);

			dragListen(me => {
				const move = me.clientX - base;
				if (left + move > 0) {
					if (width + -move > this.minWidth) {
						this.applyTransformWidth(width + -move);
						this.applyTransformLeft(left + move);
					} else {
						this.applyTransformWidth(this.minWidth);
						this.applyTransformLeft(left + (width - this.minWidth));
					}
				} else {
					this.applyTransformWidth(left + width);
					this.applyTransformLeft(0);
				}
			});
		};

		this.onTopLeftHandleMousedown = e => {
			this.onTopHandleMousedown(e);
			this.onLeftHandleMousedown(e);
		};

		this.onTopRightHandleMousedown = e => {
			this.onTopHandleMousedown(e);
			this.onRightHandleMousedown(e);
		};

		this.onBottomRightHandleMousedown = e => {
			this.onBottomHandleMousedown(e);
			this.onRightHandleMousedown(e);
		};

		this.onBottomLeftHandleMousedown = e => {
			this.onBottomHandleMousedown(e);
			this.onLeftHandleMousedown(e);
		};

		this.applyTransformHeight = height => {
			this.refs.main.style.height = height + 'px';
		};

		this.applyTransformWidth = width => {
			this.refs.main.style.width = width + 'px';
		};

		this.applyTransformTop = top => {
			this.refs.main.style.top = top + 'px';
		};

		this.applyTransformLeft = left => {
			this.refs.main.style.left = left + 'px';
		};

		function dragListen(fn) {
			window.addEventListener('mousemove',  fn);
			window.addEventListener('mouseleave', dragClear.bind(null, fn));
			window.addEventListener('mouseup',    dragClear.bind(null, fn));
		}

		function dragClear(fn) {
			window.removeEventListener('mousemove',  fn);
			window.removeEventListener('mouseleave', dragClear);
			window.removeEventListener('mouseup',    dragClear);
		}

		this.ondragover = e => {
			e.dataTransfer.dropEffect = 'none';
		};

		this.onKeydown = e => {
			if (e.which == 27) {
				if (this.canClose) {
					e.preventDefault();
					e.stopPropagation();
					this.close();
				}
			}
		};

});

    
  

/***/ }),
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Clipboardに値をコピー(TODO: 文字列以外も対応)
 */
/* harmony default export */ __webpack_exports__["a"] = (val => {
	const form = document.createElement('textarea');
	form.textContent = val;
	document.body.appendChild(form);
	form.select();
	const result = document.execCommand('copy');
	document.body.removeChild(form);

	return result;
});


/***/ }),
/* 249 */,
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);


__WEBPACK_IMPORTED_MODULE_0_riot__["mixin"]('user-preview', {
	init: function() {
		const scan = () => {
			this.root.querySelectorAll('[data-user-preview]:not([data-user-preview-attached])')
				.forEach(attach.bind(this));
		};
		this.on('mount', scan);
		this.on('updated', scan);
	}
});

function attach(el) {
	el.setAttribute('data-user-preview-attached', true);

	const user = el.getAttribute('data-user-preview');
	let tag = null;
	let showTimer = null;
	let hideTimer = null;

	el.addEventListener('mouseover', () => {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		showTimer = setTimeout(show, 500);
	});

	el.addEventListener('mouseleave', () => {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		hideTimer = setTimeout(close, 500);
	});

	this.on('unmount', () => {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		close();
	});

	const show = () => {
		if (tag) return;
		const preview = document.createElement('mk-user-preview');
		const rect = el.getBoundingClientRect();
		const x = rect.left + el.offsetWidth + window.pageXOffset;
		const y = rect.top + window.pageYOffset;
		preview.style.top = y + 'px';
		preview.style.left = x + 'px';
		preview.addEventListener('mouseover', () => {
			clearTimeout(hideTimer);
		});
		preview.addEventListener('mouseleave', () => {
			clearTimeout(showTimer);
			hideTimer = setTimeout(close, 500);
		});
		tag = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](document.body.appendChild(preview), {
			user: user
		})[0];
	};

	const close = () => {
		if (tag) {
			tag.close();
			tag = null;
		}
	};
}


/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_styl__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_riot__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__boot__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__router__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scripts_fuck_ad_block__ = __webpack_require__(81);
/**
 * Desktop Client
 */

// Style


__webpack_require__(82);
__webpack_require__(79);





/**
 * Boot
 */
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__boot__["a" /* default */])(me => {
	/**
	 * Fuck AD Block
	 */
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__scripts_fuck_ad_block__["a" /* default */])();

	/**
	 * Init Notification
	 */
	if ('Notification' in window) {
		// 許可を得ていなかったらリクエスト
		if (Notification.permission == 'default') {
			Notification.requestPermission();
		}
	}

	// Start routing
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__router__["a" /* default */])(me);
});


/***/ }),
/* 252 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_riot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_riot__);
const getCaretCoordinates = __webpack_require__(256);


/**
 * オートコンプリートを管理するクラス。
 */
class Autocomplete {

	/**
	 * 対象のテキストエリアを与えてインスタンスを初期化します。
	 */
	constructor(textarea) {
		// BIND ---------------------------------
		this.onInput =  this.onInput.bind(this);
		this.complete = this.complete.bind(this);
		this.close =    this.close.bind(this);
		// --------------------------------------

		this.suggestion = null;
		this.textarea = textarea;
	}

	/**
	 * このインスタンスにあるテキストエリアの入力のキャプチャを開始します。
	 */
	attach() {
		this.textarea.addEventListener('input', this.onInput);
	}

	/**
	 * このインスタンスにあるテキストエリアの入力のキャプチャを解除します。
	 */
	detach() {
		this.textarea.removeEventListener('input', this.onInput);
		this.close();
	}

	/**
	 * [Private] テキスト入力時
	 */
	onInput() {
		this.close();

		const caret = this.textarea.selectionStart;
		const text = this.textarea.value.substr(0, caret);

		const mentionIndex = text.lastIndexOf('@');

		if (mentionIndex == -1) return;

		const username = text.substr(mentionIndex + 1);

		if (!username.match(/^[a-zA-Z0-9-]+$/)) return;

		this.open('user', username);
	}

	/**
	 * [Private] サジェストを提示します。
	 */
	open(type, q) {
		// 既に開いているサジェストは閉じる
		this.close();

		// サジェスト要素作成
		const tag = document.createElement('mk-autocomplete-suggestion');

		// ~ サジェストを表示すべき位置を計算 ~

		const caretPosition = getCaretCoordinates(this.textarea, this.textarea.selectionStart);

		const rect = this.textarea.getBoundingClientRect();

		const x = rect.left + window.pageXOffset + caretPosition.left;
		const y = rect.top + window.pageYOffset + caretPosition.top;

		tag.style.left = x + 'px';
		tag.style.top = y + 'px';

		// 要素追加
		const el = document.body.appendChild(tag);

		// マウント
		this.suggestion = __WEBPACK_IMPORTED_MODULE_0_riot__["mount"](el, {
			textarea: this.textarea,
			complete: this.complete,
			close: this.close,
			type: type,
			q: q
		})[0];
	}

	/**
	 * [Private] サジェストを閉じます。
	 */
	close() {
		if (this.suggestion == null) return;

		this.suggestion.unmount();
		this.suggestion = null;

		this.textarea.focus();
	}

	/**
	 * [Private] オートコンプリートする
	 */
	complete(user) {
		this.close();

		const value = user.username;

		const caret = this.textarea.selectionStart;
		const source = this.textarea.value;

		const before = source.substr(0, caret);
		const trimmedBefore = before.substring(0, before.lastIndexOf('@'));
		const after = source.substr(caret);

		// 結果を挿入する
		this.textarea.value = trimmedBefore + '@' + value + ' ' + after;

		// キャレットを戻す
		this.textarea.focus();
		const pos = caret + value.length;
		this.textarea.setSelectionRange(pos, pos);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Autocomplete);


/***/ }),
/* 253 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog__ = __webpack_require__(57);


/* harmony default export */ __webpack_exports__["a"] = (() => {
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dialog__["default"])('<i class="fa fa-exclamation-triangle"></i>Not implemented yet',
		'要求された操作は実装されていません。<br>→<a href="https://github.com/syuilo/misskey" target="_blank">Misskeyの開発に参加する</a>', [{
		text: 'OK'
	}]);
});


/***/ }),
/* 254 */,
/* 255 */,
/* 256 */
/***/ (function(module, exports) {

/* jshint browser: true */

(function () {

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if(!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if ( el ) { el.parentNode.removeChild(el); }
  }

  // mirrored div
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT')
    style.wordWrap = 'break-word';  // only for textarea-s

  // position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (element.nodeName === 'INPUT')
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // for inputs, just '.' would be enough, but why bother?
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser){
  window.getCaretCoordinates = getCaretCoordinates;
}

}());


/***/ })
/******/ ]);