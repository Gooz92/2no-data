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

/***/ "./data/bw/snail.json":
/*!****************************!*\
  !*** ./data/bw/snail.json ***!
  \****************************/
/*! exports provided: 0, 1, 2, default */
/***/ (function(module) {

eval("module.exports = [[[1,1],[3,2],[5,2],[1,3,2],[6],[6]],[[2,1],[2,2],[5],[5],[4],[1,2],[4],[3],[1]],[0,0,0,0,0,1,0,0,1,0,1,1,1,0,0,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0]];\n\n//# sourceURL=webpack:///./data/bw/snail.json?");

/***/ }),

/***/ "./nono.js":
/*!*****************!*\
  !*** ./nono.js ***!
  \*****************/
/*! exports provided: buildNonogram, solve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"buildNonogram\", function() { return buildNonogram; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solve\", function() { return solve; });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./utils.js\");\n\n\nconst buildSideClues = sideClues => (\n  sideClues.map(lineClues => (\n    lineClues.map(clue => ({ value: clue }))\n  ))\n);\n\nfunction calculateBounds(clues, length) {\n  const maxLefts = [ 0 ];\n  const maxRights = [ length - 1 ];\n\n  let left = 0, right = length - 1;\n\n  for (let i = 0; i < clues.length - 1; i++) {\n    maxLefts.push(left += clues[i].value + 1);\n    maxRights.unshift(right -= clues[clues.length - i - 1].value + 1);\n  }\n\n  clues.forEach((clue, index) => {\n    clue.bounds = {\n      max: {\n        left: maxLefts[index],\n        right: maxRights[index]\n      },\n      min: {\n        left: index > 0 ? maxRights[index - 1] + 1 : 0,\n        right: index < clues.length - 1 ? maxLefts[index + 1] - 1 : length - 1\n      }\n    }\n  });\n}\n\nfunction solveBounds(line) {\n  const filled = [];\n\n  line.clues.forEach(({ value, bounds: { max: { left, right } } }) => {\n    for (let i = right - value + 1; i < left + value; i++) {\n      line.cells[i].value = 1;\n      filled.push(i);\n    }\n  });\n\n  return filled;\n}\n\nfunction joinBlocks(line) {\n  const filled = [];\n\n  line.clues.forEach(({ bounds: { min: { left, right } } }) => {\n    let startIndex = left,\n      endIndex = left;\n\n    for (let i = left; i <= right; i++) {\n      if (line.cells[i].value === 1) {\n        if (startIndex === left) startIndex = i;\n        endIndex = i;\n      }\n    }\n\n    if (startIndex === endIndex) return;\n\n    for (let i = startIndex; i <= endIndex; i++) {\n      line.cells[i].value = 1;\n      filled.push(i);\n    }\n  });\n\n  return filled;\n}\n\nfunction findEmptySpaces(line) {\n  const emptyCells = [];\n\n  line.clues.forEach(({ value, bounds }) => {\n\n    const { left, right } = bounds.min;\n\n    let blockLength = 0, startIndex = left;\n\n    for (let i = left; i <= right; i++) {\n      if (line.cells[i].value === 1) {\n        if (blockLength === 0) startIndex = i;\n        ++blockLength;\n      }\n    }\n\n    if (blockLength === 0) return;\n\n    const delta = value - blockLength;\n\n    const start = startIndex - delta;\n    const end = startIndex + blockLength + delta;\n\n    if (blockLength === value) {\n      if (startIndex - 1 >= 0) {\n        emptyCells.push(startIndex - 1);\n        line.cells[startIndex - 1].value = 2;\n\n      }\n      if (end < line.cells.length) {\n        emptyCells.push(end);\n        line.cells[end].value = 2;\n      }\n    }\n\n    for (let i = left; i < start; i++) {\n      emptyCells.push(i);\n      line.cells[i].value = 2;\n    }\n\n    for (let i = right; i >= end; i--) {\n      emptyCells.push(i);\n      line.cells[i].value = 2;\n    }\n  });\n\n  return emptyCells;\n}\n\nfunction narrowBounds(line) {\n  line.clues.forEach((({ value, bounds }) => {\n    let { left, right } = bounds.max;\n\n    while (line.cells[left].value === 2) {\n      ++left;\n    }\n\n    while (line.cells[right].value === 2) {\n      --right;\n    }\n\n    bounds.max.left = left;\n    bounds.max.right = right;\n\n    if (left > bounds.min.left) {\n     \n      bounds.min.left = left;\n\n      if (bounds.min.right - bounds.min.left + 1 < value) {\n        bounds.min.right = bounds.min.left + value - 1;\n      }\n    }\n\n    if (right < bounds.min.right) {\n      bounds.min.right = right;\n\n      if (bounds.min.right - bounds.min.left + 1 < value) {\n        bounds.min.left = bounds.min.right - value + 1;\n      }\n    }\n  }));\n}\n\nfunction buildNonogram(rawRowClues, rawColClues) {\n\n  const rowClues = buildSideClues(rawRowClues);\n  const colClues = buildSideClues(rawColClues);\n\n  const rows = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(rowClues.length, rowIndex => {\n    calculateBounds(rowClues[rowIndex], colClues.length);\n    return {\n      clues: rowClues[rowIndex],\n      cells: Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(colClues.length, () => ({}))\n    };\n  });\n  \n  const cols = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(colClues.length, colIndex => {\n    calculateBounds(colClues[colIndex], rowClues.length);\n    return {\n      clues: colClues[colIndex],\n      cells: []\n    };\n  });\n\n  for (let i = 0; i < rowClues.length; i++) {\n    for (let j = 0; j < colClues.length; j++) {\n      cols[j].cells[i] = rows[i].cells[j];\n    }\n  }\n\n  return {\n    rowClues, colClues,\n    rows, cols,\n    lines: [ ...rows, ...cols ]\n  };\n}\n\nfunction solve(nonogram, onFill, onEmpty) {\n\n  nonogram.rows.forEach((line, index) => {\n  \n    const filled = solveBounds(line).map(i => [ index, i ]);\n\n    onFill(filled);\n  });\n\n  let i = 1000;\n\n  do {\n\n    nonogram.cols.forEach((line, index) => {\n\n      const filled = solveBounds(line).map(i => [ i, index ]);\n\n      onFill(filled);\n\n      const joined = joinBlocks(line).map(i => [ i, index ]);\n\n      onFill(joined);\n\n      const empty = findEmptySpaces(line).map(i => [ i, index ]);\n\n      onEmpty(empty);\n\n      narrowBounds(line);\n\n    });\n\n    nonogram.rows.forEach((line, index) => {\n\n      const filled = solveBounds(line).map(i => [ index, i ]);\n\n      onFill(filled);\n\n      const joined = joinBlocks(line).map(i => [ index, i ]);\n\n      onFill(joined);\n\n      const empty = findEmptySpaces(line);\n\n      onEmpty(empty.map(i => [ index, i ]));\n\n      narrowBounds(line);\n    });\n  } while (i-- > 0);\n\n}\n\n//# sourceURL=webpack:///./nono.js?");

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! exports provided: identity, generateArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"identity\", function() { return identity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateArray\", function() { return generateArray; });\nconst identity = value => value;\n\nfunction generateArray(length, generateItem = identity) {\n  const array = [];\n\n  for (let i = 0; i < length; i++) {\n    array.push(generateItem(i));\n  }\n\n  return array;\n}\n\n//# sourceURL=webpack:///./utils.js?");

/***/ }),

/***/ "./view/app.js":
/*!*********************!*\
  !*** ./view/app.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./view/utils.js\");\n/* harmony import */ var _nono_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nono.js */ \"./nono.js\");\n\n\n\nconst [ hClues, vClues ] = __webpack_require__(/*! ../data/bw/snail.json */ \"./data/bw/snail.json\");\n\nfunction appendCells(field, colCount, rowCount, cellSize, getOptions = () => ({})) {\n\n  for (let i = 0; i < rowCount; i++) {\n    for (let j = 0; j < colCount; j++) {\n\n      const classes = [];\n\n      const isLastRow = i === rowCount - 1;\n      const isLastCol = j === colCount - 1;\n\n      if (!isLastRow) {\n        classes.push('bottom-border');\n      }\n\n      if (!isLastCol) {\n        classes.push('right-border');\n      }\n\n      const options = getOptions(i, j);\n      const attributes = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"omit\"])(options, ['styles', 'classes']);\n\n      const cell = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n        className: (options.classes || []).concat(classes).join(' '),\n        styles: {\n          width: cellSize - (isLastCol ? 0 : 1),\n          height: cellSize - (isLastRow ? 0 : 1),\n          ...options.styles\n        },\n        ...attributes\n      });\n  \n      field.appendChild(cell);\n    }\n  }\n}\n\nconst findLongestClueLength = clues => (\n  Math.max(...clues.map(clue => clue.length))\n);\n\nfunction appendVClues(container, clues, height) {\n  for (let i = 0; i < clues.length; i++) {\n    const dh = height - clues[i].length;\n    for (let j = 0; j < clues[i].length; j++) {\n      const index = clues.length * (dh + j) + i;\n      container.childNodes[index].innerHTML = clues[i][j].value;\n    }\n  }\n}\n\nfunction appendHClues(container, clues, width) {\n  for (let i = 0; i < clues.length; i++) {\n    const dw = width - clues[i].length;\n    for (let j = 0; j < clues[i].length; j++) {\n      const index = width * i + dw + j;\n      container.childNodes[index].innerHTML = clues[i][j].value;\n    }\n  }\n}\n\nfunction buildField(nonogram, cellSize) {\n\n  const vClues = nonogram.colClues;\n  const hClues = nonogram.rowClues;\n\n  const vCluesHeight = findLongestClueLength(vClues) * cellSize;\n  const hCluesWidth = findLongestClueLength(hClues) * cellSize;\n\n  const fieldWidth = vClues.length * cellSize;\n  const fieldHeight = hClues.length * cellSize;\n\n  const nonogramWidth = fieldWidth + hCluesWidth + 1;\n  const nonogramHeight = fieldHeight + vCluesHeight + 1;\n\n  const container = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'nonogram',\n    styles: {\n      width: nonogramWidth,\n      height: nonogramHeight\n    }\n  });\n\n  const corner = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'corner',\n    styles: {\n      width: hCluesWidth,\n      height: vCluesHeight\n    }\n  }); \n\n  const vCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'v-clues',\n    styles: {\n      width: fieldWidth,\n      height: vCluesHeight\n    }\n  });\n\n  const hCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'h-clues',\n    styles: {\n      width: hCluesWidth,\n      height: fieldHeight\n    }\n  });\n\n  const field = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\n    className: 'field',\n    styles: {\n      width: fieldWidth,\n      height: fieldHeight\n    }\n  });\n\n  appendCells(field, vClues.length, hClues.length, cellSize, (i, j) => ({\n    classes: [['unknown', 'filled', 'empty'][nonogram.rows[i].cells[j].value]],\n    id: `cell-${i}-${j}`,\n    onclick: e => {\n      e.target.classList.remove('empty');\n      e.target.classList.toggle('filled');\n    },\n    oncontextmenu: e => {\n      e.preventDefault();\n      e.target.classList.remove('filled');\n      e.target.classList.toggle('empty');\n    }\n  }));\n\n  appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);\n  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));\n  appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);\n  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));\n\n  container.appendChild(corner);\n  container.appendChild(vCluesContainer);\n  container.appendChild(hCluesContainer);\n  container.appendChild(field);\n\n  return container;\n}\n\nconst nonogram = Object(_nono_js__WEBPACK_IMPORTED_MODULE_1__[\"buildNonogram\"])(hClues, vClues);\nconst field = buildField(nonogram, 42);\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\n  document.body.appendChild(field);\n\n  setTimeout(() => {\n    Object(_nono_js__WEBPACK_IMPORTED_MODULE_1__[\"solve\"])(nonogram, filled => {\n      filled.forEach(([i, j]) => {\n        document.getElementById(`cell-${i}-${j}`).classList.add('filled');\n      });\n    }, empty => {\n      empty.forEach(([i, j]) => {\n        document.getElementById(`cell-${i}-${j}`).classList.add('empty');\n      });\n    });\n  });\n\n});\n\n\n//# sourceURL=webpack:///./view/app.js?");

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