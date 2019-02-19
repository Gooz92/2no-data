/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./view/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./data/bw/house-7x7.json":
/*!********************************!*\
  !*** ./data/bw/house-7x7.json ***!
  \********************************/
/*! exports provided: 0, 1, 2, default */
/***/ (function(module) {

eval("module.exports = [[[1],[3],[2,2],[2,2],[5],[1,1,1],[1,3]],[[1],[5],[2,1],[2,3],[2,1,1],[5],[1]],[0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,1,1,0,1,1,0,1,1,0,0,0,1,1,0,1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,0]];\n\n//# sourceURL=webpack:///./data/bw/house-7x7.json?");

/***/ }),

/***/ "./solve.js":
/*!******************!*\
  !*** ./solve.js ***!
  \******************/
/*! exports provided: buildNonogram, solve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"buildNonogram\", function() { return buildNonogram; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solve\", function() { return solve; });\n// const { forEachFile } = require('./file.utils.js');\n\nfunction generateArray(length, generateItem) {\n  const array = [];\n\n  for (let i = 0; i < length; i++) {\n    array.push(generateItem(i));\n  }\n\n  return array;\n}\n\nfunction getBounds(clues, length) {\n  const maxLefts = [ 0 ];\n  const maxRights = [ length - 1 ];\n\n  let left = 0, right = length - 1;\n\n  for (let i = 0; i < clues.length - 1; i++) {\n    maxLefts.push(left += clues[i] + 1);\n    maxRights.unshift(right -= clues[clues.length - i - 1] + 1);\n  }\n\n  const max = maxLefts.map((left, index) => [ left, maxRights[index] ]);\n\n  return {\n    max,\n    min: max.map((bounds, index) => {\n      const lmin = index > 0 ? max[index - 1][1] + 1 : 0;\n      const rmin = index < max.length - 1 ? max[index + 1][0] - 1 : length - 1;\n\n      return [ lmin, rmin ]; // lmin may be > rmin\n    })\n  };\n}\n\nfunction step(line, bounds) {\n  line.clues.forEach((clue, index) => {\n    const [ left, right ] = bounds.min[index];\n\n    let blockLength = 0, startIndex = left;\n\n    for (let i = left; i <= right; i++) {\n      if (line.cells[i].value === 1) {\n        if (blockLength === 0) startIndex = i;\n        ++blockLength;\n      } else if (blockLength === clue) {\n        line.cells[i].value = 2;\n      }\n    }\n\n    if (blockLength !== clue) {\n      return;\n    }\n\n    if (startIndex - 1 >= 0) line.cells[startIndex - 1].value = 2;\n\n    for (let i = left; i < startIndex; i++) {\n      line.cells[i].value = 2;\n    }\n  });\n}\n\nfunction buildNonogram(rowClues, colClues) {\n\n  const rows = generateArray(rowClues.length, rowIndex => ({\n    clues: rowClues[rowIndex],\n    cells: generateArray(colClues.length, () => ({}))\n  }));\n  \n  const cols = generateArray(colClues.length, colIndex => ({\n    clues: colClues[colIndex],\n    cells: []\n  }));\n\n  for (let i = 0; i < rowClues.length; i++) {\n    for (let j = 0; j < colClues.length; j++) {\n      cols[j].cells[i] = rows[i].cells[j];\n    }\n  }\n\n  return {\n    rowClues, colClues,\n    rows, cols,\n    lines: [ ...rows, ...cols ]\n  };\n}\n\nfunction solve(nonogram) {\n  nonogram.lines.forEach(line => {\n    line.bounds = getBounds(line.clues, line.cells.length);\n\n    line.bounds.max.forEach(([ left, right ], index) => {\n      const clue = line.clues[index];\n\n      for (let i = right - clue + 1; i < left + clue; i++) {\n        line.cells[i].value = 1;\n      }\n\n    });\n\n  });\n\n  nonogram.lines.forEach(line => {\n    debugger;\n    step(line, line.bounds);\n  });\n}\n\nconst bounds = getBounds([ 3, 2 ], 9);\n\nconsole.log(bounds);\n\n//# sourceURL=webpack:///./solve.js?");

/***/ }),

/***/ "./view/app.js":
/*!*********************!*\
  !*** ./view/app.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./view/utils.js\");\n/* harmony import */ var _solve_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../solve.js */ \"./solve.js\");\n\n\n\nconst [ hClues, vClues ] = __webpack_require__(/*! ../data/bw/house-7x7.json */ \"./data/bw/house-7x7.json\");\n\nfunction appendCells(field, colCount, rowCount, cellSize, getOptions = () => ({})) {\n\n  for (let i = 0; i < rowCount; i++) {\n    for (let j = 0; j < colCount; j++) {\n\n      const classes = [];\n\n      const isLastRow = i === rowCount - 1;\n      const isLastCol = j === colCount - 1;\n\n      if (!isLastRow) {\n        classes.push('bottom-border');\n      }\n\n      if (!isLastCol) {\n        classes.push('right-border');\n      }\n\n      const options = getOptions(i, j);\n      const attributes = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"omit\"])(options, ['styles', 'classes']);\n\n      const cell = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n        className: (options.classes || []).concat(classes).join(' '),\n        styles: {\n          width: cellSize - (isLastCol ? 0 : 1),\n          height: cellSize - (isLastRow ? 0 : 1),\n          ...options.styles\n        },\n        ...attributes\n      });\n  \n      field.appendChild(cell);\n    }\n  }\n}\n\nconst findLongestClueLength = clues => (\n  Math.max(...clues.map(clue => clue.length))\n);\n\nfunction appendVClues(container, clues, height) {\n  for (let i = 0; i < clues.length; i++) {\n    const dh = height - clues[i].length;\n    for (let j = 0; j < clues[i].length; j++) {\n      const index = clues.length * (dh + j) + i;\n      container.childNodes[index].innerHTML = clues[i][j];\n    }\n  }\n}\n\nfunction appendHClues(container, clues, width) {\n  for (let i = 0; i < clues.length; i++) {\n    const dw = width - clues[i].length;\n    for (let j = 0; j < clues[i].length; j++) {\n      const index = width * i + dw + j;\n      container.childNodes[index].innerHTML = clues[i][j];\n    }\n  }\n}\n\nfunction buildField(nonogram, cellSize) {\n\n  const vClues = nonogram.colClues;\n  const hClues = nonogram.rowClues;\n\n  const vCluesHeight = findLongestClueLength(vClues) * cellSize;\n  const hCluesWidth = findLongestClueLength(hClues) * cellSize;\n\n  const fieldWidth = vClues.length * cellSize;\n  const fieldHeight = hClues.length * cellSize;\n\n  const nonogramWidth = fieldWidth + hCluesWidth + 1;\n  const nonogramHeight = fieldHeight + vCluesHeight + 1;\n\n  const container = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'nonogram',\n    styles: {\n      width: nonogramWidth,\n      height: nonogramHeight\n    }\n  });\n\n  const corner = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'corner',\n    styles: {\n      width: hCluesWidth,\n      height: vCluesHeight\n    }\n  }); \n\n  const vCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'v-clues',\n    styles: {\n      width: fieldWidth,\n      height: vCluesHeight\n    }\n  });\n\n  const hCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'h-clues',\n    styles: {\n      width: hCluesWidth,\n      height: fieldHeight\n    }\n  });\n\n  const field = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'field',\n    styles: {\n      width: fieldWidth,\n      height: fieldHeight\n    }\n  });\n\n  appendCells(field, vClues.length, hClues.length, cellSize, (i, j) => ({\n    classes: [['unknown', 'filled', 'empty'][nonogram.rows[i].cells[j].value]],\n    onclick: e => {\n      e.target.classList.remove('empty');\n      e.target.classList.toggle('filled');\n    },\n    oncontextmenu: e => {\n      e.preventDefault();\n      e.target.classList.remove('filled');\n      e.target.classList.toggle('empty');\n    }\n  }));\n\n  appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);\n  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));\n  appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);\n  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));\n\n  container.appendChild(corner);\n  container.appendChild(vCluesContainer);\n  container.appendChild(hCluesContainer);\n  container.appendChild(field);\n\n  return container;\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  const nonogram = Object(_solve_js__WEBPACK_IMPORTED_MODULE_1__[\"buildNonogram\"])(hClues, vClues);\n  Object(_solve_js__WEBPACK_IMPORTED_MODULE_1__[\"solve\"])(nonogram);\n  const field = buildField(nonogram, 42);\n  document.body.appendChild(field);\n});\n\n\n//# sourceURL=webpack:///./view/app.js?");

/***/ }),

/***/ "./view/utils.js":
/*!***********************!*\
  !*** ./view/utils.js ***!
  \***********************/
/*! exports provided: createElement, createDiv, omit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createDiv\", function() { return createDiv; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"omit\", function() { return omit; });\nconst px = value => `${value}px`;\n\nconst valueFn = value => value;\n\nconst cssValueConverters = {\n  width: px,\n  height: px\n};\n\nfunction createElement(tagName, options = {}) {\n  const element = document.createElement(tagName);\n\n  const properties = Object.keys(options)\n    .filter(key => key !== 'styles')\n    .reduce((props, key) => ({\n      ...props,\n      [ key ]: options[key]\n    }), {});\n  \n  Object.assign(element, properties);\n  \n  const styles = options.styles || {};\n\n  const adaptedStyles = Object.keys(styles)\n    .reduce((acc, key) => ({\n      ...acc,\n      [key]: (cssValueConverters[key] || valueFn)(styles[key])\n    }), {})\n\n  Object.assign(element.style, adaptedStyles);\n\n  return element;\n}\n\nconst createDiv = options => createElement('div', options);\n\nfunction omit(obj, propertyName) {\n  const omittedProps = Array.isArray(propertyName) ? propertyName : [ propertyName ];\n  return Object.keys(obj)\n    .filter(key => !omittedProps.includes(key))\n    .reduce((result, key) => ({\n      ...result,\n      [ key ] : obj[key]\n    }), {});\n}\n\n\n//# sourceURL=webpack:///./view/utils.js?");

/***/ })

/******/ });