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
				oThis.selectedObject = oThis.objects[oLibraryItem.name];
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
			'object',
			oLibraryDocument.documentElement,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null
		), i = 0; i < oLibraryObjects.snapshotLength; i++) {
			var oLibraryObject = oLibraryObjects.snapshotItem(i);
			new function() {
				iObjectsToLoad++;
				var sObjectId = oLibraryObject.getAttribute('id');
				var sObjectUri = oLibraryObject.getAttribute('uri');
				var oObjectPreloader = document.createElement('img');
				oObjectPreloader.name = sObjectId;
				oObjectPreloader.onload = oObjectPreloader.onerror = function(oEvent) {
					oThis.objects[sObjectId] = oObjectPreloader;
					if (!--iObjectsToLoad) fCallBack.call(oThis);
				};
				oObjectPreloader.src = (sBaseURI + sObjectUri);
			}
		}
	},
	
	renderPalette: function(oElement) {
		for (var sObjectId in this.objects) {
			var oObjectRef = this.objects[sObjectId];
			var oPaletteItem = oElement.ownerDocument.createElement('div');
			oPaletteItem.className = 'paletteItem';
			oPaletteItem.name = sObjectId;
			oPaletteItem.appendChild(
				oElement.ownerDocument.createElement('div').setStyle({
					'background-image': 'url("' + oObjectRef.src + '")'
				})
			);
			oElement.appendChild(oPaletteItem);
		}
	},
	
	renderWorkspace: function(oElement) {
		this.map = new TMap(oElement, oElement.offsetWidth, oElement.offsetHeight);
		this.map.loadMap('map.xml', function() {
			this.render(0, 0);
		});
	},
	
});
