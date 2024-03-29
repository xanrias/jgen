/**
 * jGen - JavaScript Game Engine.
 * http://code.google.com/p/jgen/
 * Copyright (c) 2011 Ruslan Matveev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

jsface.namespace("jgen");

jsface.def({

	$meta: {
		name: "Selector",
		namespace: jgen,
		singleton: true
	},

	query: function(oElement, sSelector) {
		return oElement.querySelector(sSelector);
	},

	queryAll: function(oElement, sSelector) {
		return oElement.querySelectorAll(sSelector);
	},

	matches: function(oElement, sSelector) {
		return oElement.webkitMatchesSelector(sSelector);
	},

	queryAncestor: function(oElement, sSelector) {
		if (this.matches(oElement, sSelector)) return oElement;
		if ((oElement.parentNode) && (oElement.parentNode.nodeType == 1)) {
			return this.queryAncestor(oElement.parentNode, sSelector);
		}
		return null;
	}

});
