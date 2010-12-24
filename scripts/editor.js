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
		for (var sCategoryName in this.objects) {
			if (!oCategoryElement) {
				var oCategoryElement = oElement.ownerDocument.createElement('div');
				oCategoryElement.className = 'selected';
			} else oCategoryElement = oElement.ownerDocument.createElement('div');
			
			oCategoryElement.addClass('paletteCategory');
			
			var oCategoryNameElement = oElement.ownerDocument.createElement('div');
			oCategoryNameElement.className = 'paletteCategoryName';
			oCategoryNameElement.innerHTML = sCategoryName;
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
			
			oElement.appendChild(oCategoryElement);
		}
		
	},
	
	renderWorkspace: function(oElement) {
		this.map = new TMap(oElement, oElement.offsetWidth, oElement.offsetHeight);
		this.map.loadMap('map.xml', function() {
			this.render(0, 0);
		});
	},
	
});
