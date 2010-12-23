		
		var aCSSRules = [[
			'.tile {',
				'position: absolute;',
				'background-repeat: no-repeat;',
				'background-position: right bottom',
			'}',
			'.sprite {',
				'position: absolute;',
				'background-repeat: no-repeat;',
			'}'
		].join('')];
		
		var aSpriteDefinition = oMapData.getElementsByTagName('sprites');
		for (var i = 0; i < aSpriteDefinition.length; i++) {
			var aSpriteDefinitions = aSpriteDefinition[i].getElementsByTagName('sprite');
			for (var j = 0; j < aSpriteDefinitions.length; j++) {
				var oSpriteDefinition = aSpriteDefinitions[j];
				var sSpriteName = oSpriteDefinition.getAttribute('name');
				var sSpriteUrl = oSpriteDefinition.getAttribute('url');
				var iSpriteWidth = parseInt(oSpriteDefinition.getAttribute('width'), 10);
				var iSpriteHeight = parseInt(oSpriteDefinition.getAttribute('height'), 10);
				aCSSRules.push('.sprite-' + sSpriteName + '{' +
					'width:' + iSpriteWidth + 'px;' +
					'height:' + iSpriteHeight + 'px;' +
					'background-image:url("' + sSpriteUrl + '");' +
				'}');
				
				/*
				var aSpriteLayers = oSpriteDefinition.getElementsByTagName('layer');
				for (var c = 0; c < aSpriteLayers.length; c++) {
					var oSpriteLayer = aSpriteLayers[c];
					
					var iLayerX = parseInt(oSpriteLayer.getAttribute('x'), 10);
					var iLayerY = parseInt(oSpriteLayer.getAttribute('y'), 10);
					var iLayerWidth = parseInt(oSpriteLayer.getAttribute('width'), 10);
					var iLayerHeight = parseInt(oSpriteLayer.getAttribute('height'), 10);
				}
				*/
			}
		}
		
		var foo = {};
		
		var aTileDefinition = oMapData.getElementsByTagName('tiles');
		for (var i = 0; i < aTileDefinition.length; i++) {
			var aTileDefinitions = aTileDefinition[i].getElementsByTagName('tile');
			for (var j = 0; j < aTileDefinitions.length; j++) {
				var oTileDefinition = aTileDefinitions[j];
				var sTileName = oTileDefinition.getAttribute('name');
				var sTileUrl = oTileDefinition.getAttribute('url');
				var iTileWidth = parseInt(oTileDefinition.getAttribute('width'), 10);
				var iTileHeight = parseInt(oTileDefinition.getAttribute('height'), 10);
				if (!iTileWidth) iTileWidth = this.tileWidth;
				if (!iTileHeight) iTileHeight = this.tileHeight;
				//var iDeep = (parseInt(oTileDefinition.getAttribute('deep'), 10) || 0);
				
				var oImage =  document.createElement('img');
				oImage.src = sTileUrl;
				foo[sTileName] = this.viewPort.appendChild(oImage);
				
				aCSSRules.push('.tile-' + sTileName + '{' +
					'width:' + iTileWidth + 'px;' +
					'height:' + iTileHeight + 'px;' +
					'background-image:url("' + sTileUrl + '");' +
					'margin-top:-' + (iTileHeight - this.tileHeight) + 'px' +
				'}');
			}
		}
		
		var aMapDefinition = oMapData.getElementsByTagName('map');
		for (var i = 0; i < aMapDefinition.length; i++) {
			var aMapDefinitions = aMapDefinition[i].getElementsByTagName('*');
			for (var j = 0; j < aMapDefinitions.length; j++) {
				var oMapDefinition = aMapDefinitions[j];
				
				var sRefId = oMapDefinition.getAttribute('refid');
				var iMapPosX = parseInt(oMapDefinition.getAttribute('x'), 10);
				var iMapPosY = parseInt(oMapDefinition.getAttribute('y'), 10);
				
				if (oMapDefinition.tagName.toLowerCase() == 'tile') {
					if (!this.mapData[iMapPosX]) this.mapData[iMapPosX] = [];
					if (oMapDefinition.tagName.toLowerCase() == 'tile') {
						this.mapData[iMapPosX][iMapPosY] = {
							'tile': 'tile-' + sRefId,
							'file': foo[sRefId]
						};
					}
				} else if (oMapDefinition.tagName.toLowerCase() == 'sprite') {
					var iSpriteRotate = parseInt(oMapDefinition.getAttribute('rotate'), 10);
					var sSpriteClass = oMapDefinition.getAttribute('class');
					if (!sSpriteClass) sSpriteClass = 'TSprite';
					var oSpriteClass = (eval(sSpriteClass));
					var oSprite = this.addSprite(new oSpriteClass(this, 'sprite sprite-' + sRefId));
					var aSpritePos = this.map2screen(iMapPosX, iMapPosY);
					aSpritePos[0] -= 16;
					aSpritePos[1] -= 16;
					oSprite.move(aSpritePos[0], aSpritePos[1]);
					if (iSpriteRotate) oSprite.rotate(iSpriteRotate);
					oSprite.show();
				}
			}
		}
		
		console.info(this.mapData);
		
		var oOwnerDocument = this.viewPort.ownerDocument;
		var oHead = oOwnerDocument.getElementsByTagName('head')[0];
		var oStyle = oOwnerDocument.createElement('style');
		oStyle.setAttribute('type', 'text/css');
		oStyle.innerText += aCSSRules.join('');
		oHead.appendChild(oStyle);
		
		this.tile = document.createElement('div');
		this.tile.className = 'tile';

