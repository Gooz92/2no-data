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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"buildNonogram\", function() { return buildNonogram; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solve\", function() { return solve; });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./utils.js\");\n\r\n\r\nconst buildSideClues = sideClues => (\r\n  sideClues.map(lineClues => (\r\n    lineClues.map(clue => ({ value: clue }))\r\n  ))\r\n);\r\n\r\nfunction calculateBounds(clues, length) {\r\n  const maxLefts = [ 0 ];\r\n  const maxRights = [ length - 1 ];\r\n\r\n  let left = 0, right = length - 1;\r\n\r\n  for (let i = 0; i < clues.length - 1; i++) {\r\n    maxLefts.push(left += clues[i].value + 1);\r\n    maxRights.unshift(right -= clues[clues.length - i - 1].value + 1);\r\n  }\r\n\r\n  clues.forEach((clue, index) => {\r\n    clue.bounds = {\r\n      max: {\r\n        left: maxLefts[index],\r\n        right: maxRights[index]\r\n      },\r\n      min: {\r\n        left: index > 0 ? maxRights[index - 1] + 1 : 0,\r\n        right: index < clues.length - 1 ? maxLefts[index + 1] - 1 : length - 1\r\n      }\r\n    }\r\n  });\r\n}\r\n\r\nconst tokens = [ '-', '#', 'X' ];\r\n\r\nfunction stringifyLine(line, markIndex) {\r\n  const clues = line.clues\r\n    .map(clue => clue.value)\r\n    .join(' ');\r\n  \r\n  const cells = line.cells.map((cell, index) => (\r\n    index === markIndex ? '*' : tokens[cell.value || 0]\r\n  )).join('');\r\n\r\n  return `${clues}|${cells}`;\r\n}\r\n\r\nfunction markAsFilled(line, index, filled) {\r\n  const cell = line.cells[index];\r\n\r\n  if (!cell.value) {\r\n    cell.value = 1;\r\n    filled.push(index);\r\n  }\r\n}\r\n\r\nconst converters = [\r\n  (lineIndex, index) => [ lineIndex, index ],\r\n  (lineIndex, index) => [ index, lineIndex ]\r\n];\r\n\r\nconst absoluteIndexes = solveLine => (\r\n  line => solveLine(line).map(index => converters[line.side](line.index, index))\r\n);\r\n\r\nconst solveBounds = absoluteIndexes(line => {\r\n  const filled = [];\r\n\r\n  line.clues.forEach(({ value, bounds: { max: { left, right } } }) => {\r\n    for (let i = right - value + 1; i < left + value; i++) {\r\n      markAsFilled(line, i, filled);\r\n    }\r\n  });\r\n\r\n  return filled;\r\n});\r\n\r\nfunction joinBlocks(line) {\r\n  const filled = [];\r\n\r\n  line.clues.forEach(({ bounds: { min: { left, right } } }) => {\r\n    let startIndex = left,\r\n      endIndex = left;\r\n\r\n    for (let i = left; i <= right; i++) {\r\n      if (line.cells[i].value === 1) {\r\n        if (startIndex === left) startIndex = i;\r\n        endIndex = i;\r\n      }\r\n    }\r\n\r\n    if (startIndex === endIndex) return;\r\n\r\n    for (let i = startIndex; i <= endIndex; i++) {\r\n      markAsFilled(line, i, filled);\r\n    }\r\n  });\r\n\r\n  return filled;\r\n}\r\n\r\nfunction findEmptySpaces(line) {\r\n  const emptyCells = [];\r\n\r\n  line.clues.forEach(({ value, bounds }) => {\r\n\r\n    const { left, right } = bounds.min;\r\n\r\n    let blockLength = 0, startIndex = left;\r\n\r\n    for (let i = left; i <= right; i++) {\r\n      if (line.cells[i].value === 1) {\r\n        if (blockLength === 0) startIndex = i;\r\n        ++blockLength;\r\n      }\r\n    }\r\n\r\n    if (blockLength === 0) return;\r\n\r\n    const delta = value - blockLength;\r\n\r\n    const start = startIndex - delta;\r\n    const end = startIndex + blockLength + delta;\r\n\r\n    if (blockLength === value) {\r\n      if (startIndex - 1 >= 0) {\r\n        emptyCells.push(startIndex - 1);\r\n        line.cells[startIndex - 1].value = 2;\r\n\r\n      }\r\n      if (end < line.cells.length) {\r\n        emptyCells.push(end);\r\n        line.cells[end].value = 2;\r\n      }\r\n    }\r\n\r\n    for (let i = left; i < start; i++) {\r\n      emptyCells.push(i);\r\n      line.cells[i].value = 2;\r\n    }\r\n\r\n    for (let i = right; i >= end; i--) {\r\n      emptyCells.push(i);\r\n      line.cells[i].value = 2;\r\n    }\r\n  });\r\n\r\n  return emptyCells;\r\n}\r\n\r\nfunction narrowBounds(line) {\r\n  line.clues.forEach((({ value, bounds }) => {\r\n    let { left, right } = bounds.max;\r\n\r\n    while (line.cells[left].value === 2) {\r\n      ++left;\r\n    }\r\n\r\n    while (line.cells[right].value === 2) {\r\n      --right;\r\n    }\r\n\r\n    bounds.max.left = left;\r\n    bounds.max.right = right;\r\n\r\n    if (left > bounds.min.left) {\r\n     \r\n      bounds.min.left = left;\r\n\r\n      if (bounds.min.right - bounds.min.left + 1 < value) {\r\n        bounds.min.right = bounds.min.left + value - 1;\r\n      }\r\n    }\r\n\r\n    if (right < bounds.min.right) {\r\n      bounds.min.right = right;\r\n\r\n      if (bounds.min.right - bounds.min.left + 1 < value) {\r\n        bounds.min.left = bounds.min.right - value + 1;\r\n      }\r\n    }\r\n  }));\r\n}\r\n\r\nfunction toPlainField(rows) {\r\n  const field = [];\r\n\r\n  return rows.forEach(row => {\r\n    row.forEach(cell => {\r\n      field.push(cell.value || 0);\r\n    });\r\n  });\r\n}\r\n\r\nfunction isMatch(actual, solved) {\r\n  return solved.every((cell, index) => [\r\n    () => true,\r\n    cell => cell === 1,\r\n    cell => cell === 0\r\n  ][cell](solved[idnex]));\r\n}\r\n\r\nfunction buildNonogram(rawRowClues, rawColClues) {\r\n\r\n  const rowClues = buildSideClues(rawRowClues);\r\n  const colClues = buildSideClues(rawColClues);\r\n\r\n  const rows = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(rowClues.length, rowIndex => {\r\n    calculateBounds(rowClues[rowIndex], colClues.length);\r\n    return {\r\n      clues: rowClues[rowIndex],\r\n      cells: Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(colClues.length, () => ({})),\r\n      side: 0,\r\n      index: rowIndex\r\n    };\r\n  });\r\n  \r\n  const cols = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"generateArray\"])(colClues.length, colIndex => {\r\n    calculateBounds(colClues[colIndex], rowClues.length);\r\n    return {\r\n      clues: colClues[colIndex],\r\n      cells: [],\r\n      side: 1,\r\n      index: colIndex\r\n    };\r\n  });\r\n\r\n  for (let i = 0; i < rowClues.length; i++) {\r\n    for (let j = 0; j < colClues.length; j++) {\r\n      cols[j].cells[i] = rows[i].cells[j];\r\n    }\r\n  }\r\n\r\n  return {\r\n    rowClues, colClues,\r\n    rows, cols,\r\n    lines: [ ...rows, ...cols ]\r\n  };\r\n}\r\n\r\nfunction solve(nonogram, onFill, onEmpty) {\r\n\r\n  let changed, i = 0;\r\n\r\n  do {\r\n    changed = false;\r\n\r\n    nonogram.lines.forEach(line => {\r\n      const filled = solveBounds(line);\r\n\r\n      if (filled.length > 0) {\r\n        onFill(filled);\r\n        changed = true;\r\n      }\r\n    });\r\n    ++i;\r\n  } while (changed);\r\n\r\n  console.log(i);\r\n}\n\n//# sourceURL=webpack:///./nono.js?");

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! exports provided: identity, generateArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"identity\", function() { return identity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateArray\", function() { return generateArray; });\nconst identity = value => value;\r\n\r\nfunction generateArray(length, generateItem = identity) {\r\n  const array = [];\r\n\r\n  for (let i = 0; i < length; i++) {\r\n    array.push(generateItem(i));\r\n  }\r\n\r\n  return array;\r\n}\n\n//# sourceURL=webpack:///./utils.js?");

/***/ }),

/***/ "./view/app.js":
/*!*********************!*\
  !*** ./view/app.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./view/utils.js\");\n\r\nconst { buildNonogram, solve } = __webpack_require__(/*! ../nono.js */ \"./nono.js\");\r\n\r\nconst [ hClues, vClues ] = __webpack_require__(/*! ../data/bw/snail.json */ \"./data/bw/snail.json\");\r\n\r\nfunction appendCells(field, colCount, rowCount, cellSize, getOptions = () => ({})) {\r\n\r\n  for (let i = 0; i < rowCount; i++) {\r\n    for (let j = 0; j < colCount; j++) {\r\n\r\n      const classes = [];\r\n\r\n      const isLastRow = i === rowCount - 1;\r\n      const isLastCol = j === colCount - 1;\r\n\r\n      if (!isLastRow) {\r\n        classes.push('bottom-border');\r\n      }\r\n\r\n      if (!isLastCol) {\r\n        classes.push('right-border');\r\n      }\r\n\r\n      const options = getOptions(i, j);\r\n      const attributes = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"omit\"])(options, ['styles', 'classes']);\r\n\r\n      const cell = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n        className: (options.classes || []).concat(classes).join(' '),\r\n        styles: {\r\n          width: cellSize - (isLastCol ? 0 : 1),\r\n          height: cellSize - (isLastRow ? 0 : 1),\r\n          ...options.styles\r\n        },\r\n        ...attributes\r\n      });\r\n  \r\n      field.appendChild(cell);\r\n    }\r\n  }\r\n}\r\n\r\nconst findLongestClueLength = clues => (\r\n  Math.max(...clues.map(clue => clue.length))\r\n);\r\n\r\nfunction appendVClues(container, clues, height) {\r\n  for (let i = 0; i < clues.length; i++) {\r\n    const dh = height - clues[i].length;\r\n    for (let j = 0; j < clues[i].length; j++) {\r\n      const index = clues.length * (dh + j) + i;\r\n      container.childNodes[index].innerHTML = clues[i][j].value;\r\n    }\r\n  }\r\n}\r\n\r\nfunction appendHClues(container, clues, width) {\r\n  for (let i = 0; i < clues.length; i++) {\r\n    const dw = width - clues[i].length;\r\n    for (let j = 0; j < clues[i].length; j++) {\r\n      const index = width * i + dw + j;\r\n      container.childNodes[index].innerHTML = clues[i][j].value;\r\n    }\r\n  }\r\n}\r\n\r\nfunction buildField(nonogram, cellSize) {\r\n\r\n  const vClues = nonogram.colClues;\r\n  const hClues = nonogram.rowClues;\r\n\r\n  const vCluesHeight = findLongestClueLength(vClues) * cellSize;\r\n  const hCluesWidth = findLongestClueLength(hClues) * cellSize;\r\n\r\n  const fieldWidth = vClues.length * cellSize;\r\n  const fieldHeight = hClues.length * cellSize;\r\n\r\n  const nonogramWidth = fieldWidth + hCluesWidth + 1;\r\n  const nonogramHeight = fieldHeight + vCluesHeight + 1;\r\n\r\n  const container = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n    className: 'nonogram',\r\n    styles: {\r\n      width: nonogramWidth,\r\n      height: nonogramHeight\r\n    }\r\n  });\r\n\r\n  const corner = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n    className: 'corner',\r\n    styles: {\r\n      width: hCluesWidth,\r\n      height: vCluesHeight\r\n    }\r\n  }); \r\n\r\n  const vCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n    className: 'v-clues',\r\n    styles: {\r\n      width: fieldWidth,\r\n      height: vCluesHeight\r\n    }\r\n  });\r\n\r\n  const hCluesContainer = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n    className: 'h-clues',\r\n    styles: {\r\n      width: hCluesWidth,\r\n      height: fieldHeight\r\n    }\r\n  });\r\n\r\n  const field = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"createDiv\"])({\r\n    className: 'field',\r\n    styles: {\r\n      width: fieldWidth,\r\n      height: fieldHeight\r\n    }\r\n  });\r\n\r\n  appendCells(field, vClues.length, hClues.length, cellSize, (i, j) => ({\r\n    classes: [['unknown', 'filled', 'empty'][nonogram.rows[i].cells[j].value]],\r\n    id: `cell-${i}-${j}`,\r\n    onclick: e => {\r\n      e.target.classList.remove('empty');\r\n      e.target.classList.toggle('filled');\r\n    },\r\n    oncontextmenu: e => {\r\n      e.preventDefault();\r\n      e.target.classList.remove('filled');\r\n      e.target.classList.toggle('empty');\r\n    }\r\n  }));\r\n\r\n  appendCells(vCluesContainer, vClues.length, findLongestClueLength(vClues), cellSize);\r\n  appendVClues(vCluesContainer, vClues, findLongestClueLength(vClues));\r\n  appendCells(hCluesContainer, findLongestClueLength(hClues), hClues.length, cellSize);\r\n  appendHClues(hCluesContainer, hClues, findLongestClueLength(hClues));\r\n\r\n  container.appendChild(corner);\r\n  container.appendChild(vCluesContainer);\r\n  container.appendChild(hCluesContainer);\r\n  container.appendChild(field);\r\n\r\n  return container;\r\n}\r\n\r\nconst nonogram = buildNonogram(hClues, vClues);\r\nconst field = buildField(nonogram, 42);\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n\r\n  document.body.appendChild(field);\r\n  setTimeout(() => {\r\n    solve(nonogram, filled => {\r\n      filled.forEach(([i, j]) => {\r\n        document.getElementById(`cell-${i}-${j}`).classList.add('filled');\r\n      });\r\n    }, empty => {\r\n      empty.forEach(([i, j]) => {\r\n        document.getElementById(`cell-${i}-${j}`).classList.add('empty');\r\n      });\r\n    });\r\n  });\r\n\r\n});\r\n\n\n//# sourceURL=webpack:///./view/app.js?");

/***/ }),

/***/ "./view/utils.js":
/*!***********************!*\
  !*** ./view/utils.js ***!
  \***********************/
/*! exports provided: createElement, createDiv, omit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createDiv\", function() { return createDiv; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"omit\", function() { return omit; });\nconst px = value => `${value}px`;\r\n\r\nconst valueFn = value => value;\r\n\r\nconst cssValueConverters = {\r\n  width: px,\r\n  height: px\r\n};\r\n\r\nfunction createElement(tagName, options = {}) {\r\n  const element = document.createElement(tagName);\r\n\r\n  const properties = Object.keys(options)\r\n    .filter(key => key !== 'styles')\r\n    .reduce((props, key) => ({\r\n      ...props,\r\n      [ key ]: options[key]\r\n    }), {});\r\n  \r\n  Object.assign(element, properties);\r\n  \r\n  const styles = options.styles || {};\r\n\r\n  const adaptedStyles = Object.keys(styles)\r\n    .reduce((acc, key) => ({\r\n      ...acc,\r\n      [key]: (cssValueConverters[key] || valueFn)(styles[key])\r\n    }), {})\r\n\r\n  Object.assign(element.style, adaptedStyles);\r\n\r\n  return element;\r\n}\r\n\r\nconst createDiv = options => createElement('div', options);\r\n\r\nfunction omit(obj, propertyName) {\r\n  const omittedProps = Array.isArray(propertyName) ? propertyName : [ propertyName ];\r\n  return Object.keys(obj)\r\n    .filter(key => !omittedProps.includes(key))\r\n    .reduce((result, key) => ({\r\n      ...result,\r\n      [ key ] : obj[key]\r\n    }), {});\r\n}\r\n\n\n//# sourceURL=webpack:///./view/utils.js?");

/***/ })

/******/ });