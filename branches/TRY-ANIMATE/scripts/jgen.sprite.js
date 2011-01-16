jsface.namespace("jgen");

jsface.def({
	
	$meta: {
		name: "sprite",
		namespace: jgen
	},
	
	spriteWidth: 0,
	spriteHeight: 0,
	spriteLeft: 0,
	spriteTop: 0,
	spriteRotation: 0,
	spriteFrames: [],
	spriteElement: null,
	
	sprite: function(oViewPort, sUrl, iWidth, iHeight) {
		this.spriteWidth = iWidth;
		this.spriteHeight = iHeight;
		if (oViewPort) {
			this.spriteElement = oViewPort.appendChild(jgen.html.setStyle(
				oViewPort.ownerDocument.createElement('div'), {
					'display': 'none',
					'position': 'absolute',
					'width': iWidth + 'px',
					'height': iHeight + 'px',
					'background-image': 'url("' + sUrl + '")',
					'background-repeat': 'no-repeat',
					'background-position': '0px 0px',
					'-webkit-origin': (
						(this.spriteWidth / 2) + 'px ' +
						(this.spriteHeight / 2) + 'px'
					)
				}
			));
		}
	},
	
	clone: function() {
		var oClone = new this.constructor();
		jsface.inherit(oClone, this);
		oClone.spriteElement = this.spriteElement.parentNode.appendChild(
			this.spriteElement.cloneNode(true)
		);
		return oClone;
	},
	
	destroy: function() {
		var oSpriteElement = this.spriteElement;
		this.spriteElement = null;
		oSpriteElement.parentNode.removeChild(oSpriteElement);
	},
	
	addFrame: function(iLayerLeft, iLayerTop) {
		this.spriteFrames.push([-iLayerLeft, -iLayerTop]);
	},
	
	setFrame: function(iFrameNumber) {
		var aFramePos = this.spriteFrames[iFrameNumber];
		jgen.html.setStyle(this.spriteElement, {
			'background-position': aFramePos[0] + 'px ' + aFramePos[1] + 'px'
		});
	},
	
	animateFrames: function(iFrom, iTo, fCallBack) {
		var oThis = this;
		this.setFrame(iFrom);
		if (iFrom != iTo) setTimeout(function() {
			oThis.animateFrames(iFrom + 1, iTo, fCallBack);
		}, 50); else if (fCallBack) fCallBack.call(this);
	},
	
	animateMove: function(iToX, iToY, fCallBack) {
		var oThis = this;
		this.moveForward(8);
		if ((oThis.spriteLeft <= iToX) && (oThis.spriteTop <= iToY)) {
			setTimeout(function() {
				oThis.animateMove(iToX, iToY, fCallBack);
			}, 0);
		} else if (fCallBack) fCallBack.call(this); 
	},
	
	setVisible: function(bVisible) {
		jgen.html.setStyle(this.spriteElement, {
			'display': (bVisible ? 'block' : 'none')
		});
	},
	
	setRotationBase: function(iAngle) {
		this.rotationBase = iAngle;
	},
	
	setRotation: function(iAngle) {
		this.spriteRotation = iAngle;
		jgen.html.setStyle(this.spriteElement, {
			'-webkit-transform': 'rotate(' + (
				this.spriteRotation + (this.rotationBase || 0)
			) + 'rad)'
		});
	},
	
	setPosition: [
		function(iLeft, iTop) {
			jgen.html.setStyle(this.spriteElement, {
				'left': (this.spriteLeft = iLeft) + 'px',
				'top': (this.spriteTop = iTop) + 'px'
			});
		},
		function(aPoint) {
			this.setPosition(aPoint[0], aPoint[1]);
		}
	],
	
	rotate: function(iAngle) {
		this.setRotation(this.spriteRotation += iAngle);
	},
	
	moveForward: function(iDistance) {
		this.setPosition(jgen.math.pointOnCircle(
			this.spriteLeft, this.spriteTop,
			this.spriteRotation, iDistance
		));
	}
	
});
