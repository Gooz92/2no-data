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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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

/***/ "./view/app.js":
/*!*********************!*\
  !*** ./view/app.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const [ hClues, vClues ] = __webpack_require__(/*! ../data/bw/house-7x7.json */ \"./data/bw/house-7x7.json\");\n\nconst px = value => `${value}px`;\n\nconst valueFn = value => value;\n\nconst cssValueConverters = {\n  width: px,\n  height: px\n};\n\nfunction createElement(tagName, options = {}) {\n  const element = document.createElement(tagName);\n\n  const properties = Object.keys(options)\n    .filter(key => key !== 'styles')\n    .reduce((props, key) => ({\n      ...props,\n      [ key ]: options[key]\n    }), {});\n  \n  Object.assign(element, properties);\n  \n  const styles = options.styles || {};\n\n  const adaptedStyles = Object.keys(styles)\n    .reduce((acc, key) => ({\n      ...acc,\n      [key]: (cssValueConverters[key] || valueFn)(styles[key])\n    }), {})\n\n  Object.assign(element.style, adaptedStyles);\n\n  return element;\n}\n\nconst createDiv = options => createElement('div', options);\n\nfunction appendCells(field, colCount, rowCount, cellSize) {\n  const width = colCount * cellSize;\n  const height = rowCount * cellSize;\n\n  for (let i = 0; i < rowCount; i++) {\n    for (let j = 0; j < colCount; j++) {\n\n      const classes = [];\n\n      const isLastRow = i === rowCount - 1;\n      const isLastCol = j === colCount - 1;\n\n      if (!isLastRow) {\n        classes.push('bottom-border');\n      }\n\n      if (!isLastCol) {\n        classes.push('right-border');\n      }\n\n      const cell = createDiv({\n        styles: {\n          width: cellSize - (isLastCol ? 0 : 1),\n          height: cellSize - (isLastRow ? 0 : 1)\n        },\n        className: classes.join(' ')\n      });\n  \n      field.appendChild(cell);\n    }\n  }\n}\n\nconst findLongestClueLength = clues => (\n  Math.max(...clues.map(clue => clue.length))\n);\n\nfunction buildNonogram(hClues, vClues, cellSize) {\n  const vCluesHeight = findLongestClueLength(vClues) * cellSize;\n  const hCluesWidth = findLongestClueLength(hClues) * cellSize;\n\n  const fieldWidth = vClues.length * cellSize;\n  const fieldHeight = hClues.length * cellSize;\n\n  const nonogramWidth = fieldWidth + hCluesWidth + 1;\n  const nonogramHeight = fieldHeight + vCluesHeight + 1;\n\n  const nonogram = createDiv({\n    className: 'nonogram',\n    styles: {\n      width: nonogramWidth,\n      height: nonogramHeight\n    }\n  });\n\n  const corner = createDiv({\n    className: 'corner',\n    styles: {\n      width: hCluesWidth,\n      height: vCluesHeight\n    }\n  }); \n\n  const vCluesContainer = createDiv({\n    className: 'v-clues',\n    styles: {\n      width: fieldWidth,\n      height: vCluesHeight\n    }\n  });\n\n  const hCluesContainer = createDiv({\n    className: 'h-clues',\n    styles: {\n      width: hCluesWidth,\n      height: fieldHeight\n    }\n  });\n\n  const field = createDiv({\n    className: 'field',\n    styles: {\n      width: fieldWidth,\n      height: fieldHeight\n    }\n  });\n\n  appendCells(field, vClues.length, hClues.length, cellSize);\n\n  nonogram.appendChild(corner);\n  nonogram.appendChild(vCluesContainer);\n  nonogram.appendChild(hCluesContainer);\n  nonogram.appendChild(field);\n\n  return nonogram;\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  const nonogram = buildNonogram(hClues, vClues, 20);\n  document.body.appendChild(nonogram);\n});\n\n\n//# sourceURL=webpack:///./view/app.js?");

/***/ })

/******/ });