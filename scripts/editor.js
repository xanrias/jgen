var TEditor = Class.create({
	
	map: null,
	objects: {},
	selectedObject: null,
	
	constructor: function() {
		var oThis = this;
		document.addEventListener('mousedown', function(oEvent) {
			var oSender = oEvent.target;
			var oLibraryItem = oSender.queryAncestor('.paletteItem');
			if (oLibraryItem) {
				var oSelectedElement = oLibraryItem.parentNode.querySelector('.paletteItem.selected');
				if (oSelectedElement) oSelectedElement.removeClass('selected');
				oLibraryItem.addClass('selected');
				oThis.selectedObject = oThis.objects[oLibraryItem.category][oLibraryItem.name];
				return;
			}
			var oLibraryCategory = oSender.queryAncestor('.paletteCategoryName');
			if (oLibraryCategory) {
				var oCategory = oSender.queryAncestor('.paletteCategory');
				if (oCategory.queryMatches('.selected')) return;
				var oSelectedCategory = oCategory.parentNode.querySelector('.paletteCategory.selected');
				oSelectedCategory.removeClass('selected');
				oCategory.addClass('selected');
			}
		});
	},
	
	loadLibrary: function(sLibraryUrl, fCallBack) {
		var oThis = this;
		var oXMLHttpRequest = new XMLHttpRequest;
		oXMLHttpRequest.open("GET", sLibraryUrl, true);
		oXMLHttpRequest.onreadystatechange = function() {
			if (this.readyState != 4) return;
			var oDocument = this.responseXML;
			var aBaseURI = oDocument.baseURI.split('/');
			var sBaseURI = (aBaseURI.slice(0, aBaseURI.length - 1).join('/') + '/');
			oThis.parseLibrary(sBaseURI, this.responseXML, fCallBack);
		}
		oXMLHttpRequest.send(null);
	},
	
	parseLibrary: function(sBaseURI, oLibraryDocument, fCallBack) {
		var oThis = this;
		var iObjectsToLoad = 0;
		for (var oLibraryObjects = oLibraryDocument.evaluate(
			'category/object',
			oLibraryDocument.documentElement,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null
		), i = 0; i < oLibraryObjects.snapshotLength; i++) {
			var oLibraryObject = oLibraryObjects.snapshotItem(i);
			new function() {
				iObjectsToLoad++;
				var sCategoryName = oLibraryObject.parentNode.getAttribute('name');
				var sObjectId = oLibraryObject.getAttribute('id');
				var sObjectUri = oLibraryObject.getAttribute('uri');
				var oObjectPreloader = document.createElement('img');
				oObjectPreloader.name = sObjectId;
				oObjectPreloader.onload = oObjectPreloader.onerror = function(oEvent) {
					if (!oThis.objects[sCategoryName]) oThis.objects[sCategoryName] = {};
					oThis.objects[sCategoryName][sObjectId] = oObjectPreloader;
					if (!--iObjectsToLoad) fCallBack.call(oThis);
				};
				oObjectPreloader.src = (sBaseURI + sObjectUri);
			}
		}
	},
	
	renderPalette: function(oElement) {
		var oPalette = oElement.ownerDocument.createElement('div');
		oPalette.className = 'palette';
		for (var sCategoryName in this.objects) {
			if (!oCategoryElement) {
				var oCategoryElement = oElement.ownerDocument.createElement('div');
				oCategoryElement.className = 'selected';
			} else oCategoryElement = oElement.ownerDocument.createElement('div');
			
			oCategoryElement.addClass('paletteCategory');
			
			var oCategoryNameElement = oElement.ownerDocument.createElement('div');
			oCategoryNameElement.className = 'paletteCategoryName';
			
			oCategoryNameElement.innerHTML = (sCategoryName + ' (' + Object.keys(this.objects[sCategoryName]).length + ')');
			oCategoryElement.appendChild(oCategoryNameElement);
		
			var oCategoryItemsElement = oElement.ownerDocument.createElement('div');
			oCategoryItemsElement.className = 'paletteCategoryItems';
			oCategoryElement.appendChild(oCategoryItemsElement);
			
			for (var sObjectId in this.objects[sCategoryName]) {
				var oObjectRef = this.objects[sCategoryName][sObjectId];
				var oPaletteItem = oElement.ownerDocument.createElement('div');
				oPaletteItem.className = 'paletteItem';
				oPaletteItem.name = sObjectId;
				oPaletteItem.category = sCategoryName;
				oPaletteItem.appendChild(
					oElement.ownerDocument.createElement('div').setStyle({
						'background-image': 'url("' + oObjectRef.src + '")'
					})
				);
				oCategoryItemsElement.appendChild(oPaletteItem);
			}
			
			oPalette.appendChild(oCategoryElement);
		}
		oElement.appendChild(oPalette);
	},
	
	drawGrid: function(iTileWidth, iTileHeight, sColor, oElement) {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext("2d");
		oCanvas.setAttribute('width', iTileWidth);
		oCanvas.setAttribute('height', iTileHeight);
		oContext.strokeStyle = sColor;
		oContext.moveTo(iTileWidth / 2, 0);
		oContext.lineTo(0, iTileHeight / 2);
		oContext.lineTo(iTileWidth / 2, iTileHeight);
		oContext.lineTo(iTileWidth, iTileHeight / 2);
		oContext.lineTo(iTileWidth / 2, 0);
		oContext.stroke();
		oElement.setStyle({'background-image': 'url("'+oCanvas.toDataURL()+'")'});
	},
	
	renderWorkspace: function(oElement) {
		var iTileWidth = 64;
		var iTileHeight = 32;
		this.map = new TMap(oElement, oElement.offsetWidth, oElement.offsetHeight);
		this.map.initMap(iTileWidth, iTileHeight, 100, 100);
		this.drawGrid(iTileWidth, iTileHeight, '#CDCDCD', oElement);
		
		//this.map.loadMap('map.xml', function() {
		//	this.render(0, 0);
		//});
	},
	
	renderMap: function(iScrollX, iScrollY) {
		this.map.render(iScrollX, iScrollY);
		
		var iGridX = iScrollX % this.map.tileWidth;
		iGridX = (iGridX >= 0 ? -iGridX : this.map.tileWidth - iGridX);
		
		var iGridY = iScrollY % this.map.tileHeight;
		iGridY = (iGridY >= 0 ? -iGridY : this.map.tileHeight - iGridY);
		
		this.map.viewPort.parentNode.setStyle({
			'background-position': iGridX + 'px ' + iGridY + 'px'
		});
	},
	
});