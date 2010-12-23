var TSprite = Class.create({
	map: null,
	sprite: null,
	posX: 0,
	posY: 0,
	rotationDeg: 0,
	rotationRad: 0,
	constructor: function(oMapRef, sClassName) {
		this.map = oMapRef;
		this.sprite = document.createElement('div');
		this.sprite.setStyle({'display': 'none'});
		this.sprite.className = sClassName;
	},
	
	onCollide: function() {},
	onOffScreen: function() {},
	
	rotate: function(iAngleDeg) {
		if (iAngleDeg == this.rotationDeg) return;
		if (iAngleDeg < 0) iAngleDeg = 360;
		if (iAngleDeg > 360) iAngleDeg = 0;
		this.rotationDeg = iAngleDeg;
		this.rotationRad = Math.deg2rad(iAngleDeg);
		this.sprite.setStyle({
			'webkit-transform': 'rotate(' + this.rotationDeg + 'deg)'
		});
	},
	
	rotateTo: function(iAngleDeg) {
		this.rotate(this.rotationDeg + iAngleDeg);
	},
	
	move: function(x, y) {
		
		if ((this.posX == x) && (this.posY == y)) return;
		
		if (this.map.isColliding(this, x, y)) {
			if (this.map.isColliding(this, this.posX, y)) {
				if (!this.map.isColliding(this, x, this.posY)) this.posX = x;
			} else this.posY = y;
		} else {
			this.posX = x;
			this.posY = y;
		}
		
		if (this.posX < 0) this.onOffScreen();
		if (this.posY < 0) this.onOffScreen();
		if (this.posX > this.map.viewPort.offsetWidth) this.onOffScreen();
		if (this.posY > this.map.viewPort.offsetHeight) this.onOffScreen();
		
		this.sprite.setStyle({
			'left': this.posX + 'px',
			'top': this.posY + 'px'
		});
	},
	moveTo: function(x, y) {
		this.move(
			this.posX + x,
			this.posY + y
		);
	},
	moveForward: function(px) {
		this.moveTo(
			-Math.sin(this.rotationRad) * px,
			Math.cos(this.rotationRad) * px
		);
	},
	show: function() {
		this.sprite.setStyle({'display': 'block'});
	}
});

var TBullet = Class.create(TSprite, {
	show: function() {
		this.base();
		var oThis = this;
		this.moving = setInterval(function() {
			oThis.moveForward(4);
		}, 0);
	},
	onOffScreen: function() {
		clearInterval(this.moving);
		this.map.removeSprite(this);
	},
	onCollide: function(oSprite) {
		clearInterval(this.moving);
		this.map.removeSprite(oSprite);
		this.map.removeSprite(this);
	}
});

var TMap = Class.create({
	
	resources: {},
	viewPort: null,
	viewPortBuffer: null,
	viewPortWidthPx: 0,
	viewPortHeightPx: 0,
	viewPortWidthTiles: 0,
	viewPortHeightTiles: 0,
	
	tile: null,
	tileWidth: 0,
	tileHeight: 0,
	tileHalfWidth: 0,
	tileHalfHeight: 0,
	
	mapData: {},
	scrollX: 0,
	scrollY: 0,
	mapWidthTiles: 0,
	mapHeightTiles: 0,
	sprites: [],
	spritesViewPort: null,
	
	constructor: function(oViewPort, iViewPortWidth, iViewPortHeight) {
		var oViewPortElement = oViewPort.ownerDocument.createElement('div').setStyle({
			'position': 'absolute',
			'width': '100%',
			'height': '100%'
		});
		this.viewPort = oViewPort.appendChild(oViewPortElement);
		this.spritesViewPort = oViewPort.appendChild(oViewPortElement.cloneNode(true));
		this.viewPortWidthPx = iViewPortWidth;
		this.viewPortHeightPx = iViewPortHeight;
		this.viewPortBuffer = document.createDocumentFragment();
	},
	
	loadMap: function(sMapUrl, fCallBack) {
		var oThis = this;
		var oXMLHttpRequest = new XMLHttpRequest;
		oXMLHttpRequest.open("GET", sMapUrl, true);
		oXMLHttpRequest.onreadystatechange = function() {
			if (this.readyState != XMLHttpRequest.DONE) return;
			oThis.processMap(this.responseXML.documentElement, fCallBack);
		}
		oXMLHttpRequest.send(null);
	},
	
	processMap: function(oMapData, fCallBack) {
		var oThis = this;
		this.tileWidth = parseInt(oMapData.getAttribute('tile-width'), 10);
		this.tileHeight = parseInt(oMapData.getAttribute('tile-height'), 10);
		this.tileHalfWidth = (this.tileWidth / 2);
		this.tileHalfHeight = (this.tileHeight / 2);
		this.viewPortWidthTiles = Math.ceil(this.viewPortWidthPx / this.tileWidth);
		this.viewPortHeightTiles = Math.ceil(this.viewPortHeightPx / this.tileHeight * 2);
		this.mapWidthTiles = parseInt(oMapData.getAttribute('map-width'), 10);
		this.mapHeightTiles = parseInt(oMapData.getAttribute('map-height'), 10);
		this.processResources(oMapData, function() {
			oThis.renderMap(function() {
				fCallBack.call(oThis);
			});
		});
	},
	
	processResources: function(oMapData, fCallBack) {
		var oThis = this;
		var oOwnerDocument = this.viewPort.ownerDocument;
		var aResouces = oMapData.ownerDocument.evaluate('resources/resource', oMapData, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var iResourcesCount = iResourcesToLoad = aResouces.snapshotLength;
		for (var i = 0; i < iResourcesCount; i++) {
			var oResource = aResouces.snapshotItem(i);
			new function() {
				var sResourceId = oResource.getAttribute('id');
				var sResourceUri = oResource.getAttribute('uri');
				var oResourceElement = oOwnerDocument.createElement('img');
				oResourceElement.src = sResourceUri;
				oResourceElement.onload = oResourceElement.onerror = function() {
					iResourcesToLoad--;
					oThis.resources[sResourceId] = oResourceElement;
					if (!iResourcesToLoad) fCallBack.call(oThis);
				}
			}
		}
	},
	
	renderMap: function(fCallBack) {
		
		var iFragmentWidth = this.viewPortWidthPx;
		var iFragmentHeight = this.viewPortHeightPx;
		var oCanvas = document.createElement('canvas');
		oCanvas.setAttribute('width', this.mapWidthTiles * this.tileWidth - this.tileHalfWidth);
		oCanvas.setAttribute('height', this.mapHeightTiles * this.tileHeight / 2 - this.tileHalfHeight);
		var oContext = oCanvas.getContext("2d");
		/*
		var iFragmentsH = (this.mapWidthTiles * this.tileWidth - this.tileHalfWidth) / iFragmentWidth;
		var iFragmentsV = (this.mapHeightTiles * this.tileHeight / 2 - this.tileHalfHeight) / iFragmentHeight;
		
		
		for (var v = 0; v < iFragmentsV; v++) {
			for (var h = 0; h < iFragmentsH; h++) {
				var iFragmentLeft = (h * iFragmentWidth);
				var iFragmentTop = (v * iFragmentHeight);
				var iFragmentRight = (iFragmentLeft + iFragmentWidth);
				var iFragmentBottom = (iFragmentTop + iFragmentHeight);
				
				var oFragment = this.calcViewPort(
					iFragmentLeft,
					iFragmentTop,
					iFragmentWidth,
					iFragmentHeight
				);
				
				var iTileOffsetX = (this.tileHalfWidth + iFragmentLeft);
				var iTileOffsetY = (this.tileHalfHeight + iFragmentTop);
				
				var iFromRow = oFragment.fromRow;
				var iToRow = oFragment.toRow;
				
				for (var iRow = iFromRow; iRow < iToRow; iRow++) {
					if (iRow % 2) {
						var iOffset = this.tileHalfWidth;
						var iFromCell = oFragment.fromCellOdd;
						var iToCell = oFragment.toCellOdd;
					} else {
						var iOffset = 0;
						var iFromCell = oFragment.fromCellEven;
						var iToCell = oFragment.toCellEven;
					}
					var iTileTop = (this.tileHeight * iRow - this.tileHalfHeight * iRow) - iTileOffsetY;
					for (var iCell = iFromCell; iCell < iToCell; iCell++) {
						var iTileLeft = (this.tileWidth * iCell + iOffset) - iTileOffsetX;
						var oResource = this.resources['ground'];
				if (iRow == 15 && iCell == 6) oResource = this.resources['tree'];
				if (iRow == 14 && iCell == 6) oResource = this.resources['cube'];
				if (iRow > 20 && iCell > 20) oResource = this.resources['grass'];
						var iHeight = (oResource.height - this.tileHeight);
						oContext.drawImage(
							oResource,
							iTileLeft,
							iTileTop - iHeight,
							oResource.width,
							oResource.height
						);
					}
				}
				
				var oFrag = this.viewPort.ownerDocument.createElement('div');
				oFrag.setStyle({
					'position': 'absolute',
					'left': iFragmentLeft + 'px',
					'top': iFragmentTop + 'px',
					'width': iFragmentWidth + 'px',
					'height': iFragmentHeight + 'px',
					'border': '1px solid red',
					'background-image': 'url("' + oCanvas.toDataURL() + '")'
				});
				this.viewPort.appendChild(oFrag);
				
				oContext.clearRect(0, 0, iFragmentWidth, iFragmentHeight);
				
				//var oStyle = this.viewPort.ownerDocument.createElement('style');
				//oStyle.setAttribute('type', 'text/css');
				//oStyle.innerText = '.fragment-' + h + '-' + v + ' {' + 'background-image:url("' + oCanvas.toDataURL() + '");background-repeat:no-repeat;}';
				//this.viewPort.ownerDocument.body.appendChild(oStyle);
				//this.viewPort.className = 'fragment-0-0';
				
			}
		}*/
		
		for (var iRow = 0; iRow < this.mapHeightTiles; iRow++) {
			for (var iCell = 0; iCell < this.mapWidthTiles; iCell++) {
				
				var aTilePos = this.map2screen(iCell, iRow);
				var oResource = this.resources['ground'];
				
				if (iRow == 15 && iCell == 6) oResource = this.resources['tree'];
				if (iRow == 14 && iCell == 6) oResource = this.resources['cube'];
				if (iRow > 20 && iCell > 20) oResource = this.resources['grass'];
				
				var iHeight = (oResource.height - this.tileHeight);
				
				oContext.drawImage(
					oResource,
					aTilePos[0] - this.tileHalfWidth,
					aTilePos[1] - this.tileHalfHeight - iHeight,
					oResource.width,
					oResource.height
				);
				
			}
		}
		
		this.viewPort.setStyle({'background-repeat': 'no-repeat', 'background-image': 'url("' + oCanvas.toDataURL() + '")'});
		
		
		fCallBack.call(this);
		
	},
	
	/*
	renderMap: function(fCallBack) {
		var oMapRect = this.calcViewPort(this.scrollX, this.scrollY);
		
		var iFromRow = oMapRect.fromRow;
		var iToRow = oMapRect.toRow;
		
		var iTileOffsetX = (this.tileHalfWidth + this.scrollX);
		var iTileOffsetY = (this.tileHalfHeight + this.scrollY);
		
		for (var iRow = iFromRow; iRow < iToRow; iRow++) {
			if (iRow % 2) {
				var iOffset = this.tileHalfWidth;
				var iFromCell = oMapRect.fromCellOdd;
				var iToCell = oMapRect.toCellOdd;
			} else {
				var iOffset = 0;
				var iFromCell = oMapRect.fromCellEven;
				var iToCell = oMapRect.toCellEven;
			}
			var iTileTop = (this.tileHeight * iRow - this.tileHalfHeight * iRow) - iTileOffsetY;
			for (var iCell = iFromCell; iCell < iToCell; iCell++) {
				var iTileLeft = (this.tileWidth * iCell + iOffset) - iTileOffsetX;
				var oTile = this.resources['ground'].cloneNode(true);
				oTile.setStyle({
					'position': 'absolute',
					'left': iTileLeft + 'px',
					'top': iTileTop + 'px'
				});
				this.viewPort.appendChild(oTile);
			}
		}
		
		fCallBack.call(this);
		
	},
	*/
	
	calcViewPort: function(iScrollX, iScrollY, width, height) {
		var iViewPortWidth = (width ? width : this.viewPortWidthPx);
		var iViewPortHeight = (height ? height : this.viewPortHeightPx);
		return {
			fromRow: Math.ceil(iScrollY / this.tileHalfHeight) - 1,
			toRow: Math.ceil((iScrollY + iViewPortHeight) / this.tileHalfHeight) + 1,
			fromCellEven: Math.round(iScrollX / this.tileWidth),
			toCellEven: Math.round((iScrollX + iViewPortWidth) / this.tileWidth) + 1,
			fromCellOdd: Math.round((iScrollX - this.tileHalfWidth) / this.tileWidth),
			toCellOdd: Math.round((iScrollX + iViewPortWidth + this.tileHalfWidth) / this.tileWidth)
		};
	},
	
	clearViewPort: function() {
		var oViewPort = this.viewPort.cloneNode(false);
		this.viewPort.parentNode.replaceChild(oViewPort, this.viewPort);
		this.viewPort = oViewPort;
	},
	
	screen2map: function(clientX, clientY, iScrollX, iScrollY) {
		var sx = clientX + iScrollX;  
		var sy = clientY + iScrollY;
		var xmouseA = Math.round(sx / this.tileWidth + sy / this.tileHeight);
		var ymouseA = Math.round(-sx / this.tileWidth + sy / this.tileHeight);
		var iRow = (xmouseA + ymouseA);
		var iCell = Math.round(iRow % 2 ?
			(sx - this.tileHeight) / this.tileWidth :
			(sx / this.tileWidth)
		);
		return [iCell, iRow];
	},
	
	map2screen: function(iCell, iRow) {
		var x = (iCell * this.tileWidth);
		var y = (iRow * this.tileHalfHeight);
		if (iRow % 2 != 0) x = (iCell * this.tileWidth) + this.tileHalfWidth;
		return [x, y];
	},
	
	addSprite: function(oSprite) {
		this.sprites.push(oSprite);
		oSprite.sprite = this.spritesViewPort.appendChild(
			this.spritesViewPort.ownerDocument.importNode(
				oSprite.sprite
			)
		);
		return oSprite;
	},
	
	removeSprite: function(oSprite) {
		for (var c = 0; c < this.sprites.length; c++) {
			if (this.sprites[c] == oSprite) {
				this.sprites.splice(c, 1);
				oSprite.sprite.parentNode.removeChild(oSprite.sprite);
				break;
			}
		}
	},
	
	isColliding: function(oSprite, x, y) {
		for (var c = 0; c < this.sprites.length; c++) {
			if (this.sprites[c] != oSprite) {
				var oTargetSprite = this.sprites[c];
				var iTargetDistance = Math.ceil(Math.point_distance(
					(x + oSprite.sprite.offsetWidth / 2),
					(y + oSprite.sprite.offsetHeight / 2),
					(oTargetSprite.posX + oTargetSprite.sprite.offsetWidth / 2),
					(oTargetSprite.posY + oTargetSprite.sprite.offsetHeight / 2)
				));
				if (iTargetDistance < 30) {
					oSprite.onCollide(oTargetSprite);
					return true;
				}
			}
		}
	},
	
	render: function() {
		
		var oCanvas = this.viewPort.appendChild(document.createElement('canvas'));
		oCanvas.setAttribute('width', (this.mapWidthTiles * this.tileWidth));
		oCanvas.setAttribute('height', (this.mapHeightTiles * this.tileHeight));
		var oContext = oCanvas.getContext("2d");
		
		//var oNewMapRect = this.calcViewPort(this.scrollX, this.scrollY);
		var oNewMapRect = {
			fromRow: 0,
			toRow: this.mapHeightTiles,
			fromCellEven: 0,
			toCellEven: this.mapWidthTiles,
			fromCellOdd: 0,
			toCellOdd: this.mapWidthTiles
		};
		var oFragment = this.viewPortBuffer.cloneNode(false);
		var iFromRow = oNewMapRect.fromRow;
		var iToRow = oNewMapRect.toRow;
		var iTileOffsetX = (this.tileHalfWidth + this.scrollX);
		var iTileOffsetY = (this.tileHalfHeight + this.scrollY);
		for (var iRow = iFromRow; iRow < iToRow; iRow++) {
			if (iRow % 2) {
				var iOffset = this.tileHalfWidth;
				var iFromCell = oNewMapRect.fromCellOdd;
				var iToCell = oNewMapRect.toCellOdd;
			} else {
				var iOffset = 0;
				var iFromCell = oNewMapRect.fromCellEven;
				var iToCell = oNewMapRect.toCellEven;
			}
			var iTileTop = (this.tileHeight * iRow - this.tileHalfHeight * iRow) - iTileOffsetY;
			for (var iCell = iFromCell; iCell < iToCell; iCell++) {
				if ((this.mapData[iCell]) && (this.mapData[iCell][iRow])) {
					var sClassName = this.mapData[iCell][iRow].file;
				} else {
					var sClassName = this.mapData[2][17].file;
				}
				
				if (sClassName) {
					var iTileLeft = (this.tileWidth * iCell + iOffset) - iTileOffsetX;
					oContext.drawImage(sClassName, iTileLeft, iTileTop, sClassName.width, sClassName.height);
				
				//var oTile = this.tile.cloneNode(false);
				//oTile.style.left = iTileLeft + 'px';
				//oTile.style.top = iTileTop + 'px';
				//oTile.addClass(sClassName);
				//oFragment.appendChild(oTile);
				
				}
			}
		}
		var s = oCanvas.toDataURL('image/png');
		this.clearViewPort();
		this.viewPort.style.backgroundImage = "url('" + s + "')";
		this.viewPort.style.backgroundRepeat = 'no-repeat';
		
		
		//this.viewPort.appendChild(oFragment);
	},
	
	scroll: function(iScrollX, iScrollY) {
		if (!iScrollX && !iScrollY) return; 
		if (iScrollX) this.scrollX += iScrollX;
		if (iScrollY) this.scrollY += iScrollY;
		this.render();
	}
});
