jsface.namespace("jgen");

jsface.def({
	
	$meta: {
		name: "Sprite",
		namespace: jgen,
		foo: 120
	},
	
	spriteArray: null,
	spriteFrame: 0,
	spriteVisible: false,
	spriteWidth: 0,
	spriteHeight: 0,
	spriteLeft: 0,
	spriteTop: 0,
	rotationBase: 0,
	spriteRotation: 0,
	spriteFrames: [],
	spriteElement: null,
	
	Sprite: function(oViewPort, sUrl, iWidth, iHeight, oSpriteArray) {
		this.spriteFrames = [];
		this.spriteArray = oSpriteArray;
		this.spriteWidth = iWidth;
		this.spriteHeight = iHeight;
		if (oViewPort) {
			this.spriteElement = oViewPort.appendChild(jgen.HTML.setStyle(
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
	
	addFrame: [
		function(iLayerLeft, iLayerTop) {
			return this.spriteFrames.push([-iLayerLeft, -iLayerTop]);
		},
		function(aFramePos) {
			return this.addFrame(aFramePos[0], aFramePos[1]);
		}
	],
	
	setFrame: function(iFrameNumber, iFrameTo) {
		if (this.spriteFrame != iFrameNumber) {
			var aFramePos = this.spriteFrames[this.spriteFrame = iFrameNumber];
			this.spriteArray.addEvent(this.spriteElement, {
				'background-position': aFramePos[0] + 'px ' + aFramePos[1] + 'px'
			});
		}
	},
	
	animateFrames: function(iFrom, iTo, iSkipFrames, fCallBack) {
		var oThis = this;
		this.setFrame(iFrom);
		this.spriteArray.addCallBack(this, function() {
			if (iFrom != iTo) {
				window.top.status = iFrom;
				this.animateFrames(iFrom + 1, iTo, iSkipFrames, fCallBack);
			} else if (fCallBack) fCallBack.call(this);
		}, iSkipFrames); 
	},
	
	animate: function(iFrom, iTo, iSkipFrames, fCallBack) {
		var oThis = this;
		if (!this.animating) {
			this.animating = true;
			
			if ((this.spriteFrame < iFrom) || (this.spriteFrame >= iTo)) this.spriteFrame = iFrom;
			this.setFrame(this.spriteFrame + 1);
			
			this.spriteArray.addCallBack(this, function() {
				oThis.animating = false;
				this.spriteArray.addCallBack(this, function() {
					if ((!oThis.animating) && (fCallBack)) fCallBack.call(oThis);
				}, iSkipFrames);
			}, iSkipFrames);
		}
	},
	
	
	
	
	
	
	
	
	setVisible: function(bVisible) {
		if (this.spriteVisible != bVisible) {
			this.spriteArray.addEvent(this.spriteElement, {
				'display': (this.spriteVisible = bVisible ? 'block' : 'none')
			});
		}
	},
	
	setRotationBase: function(iAngle) {
		this.rotationBase = iAngle;
	},
	
	setRotation: function(iAngle) {
		if (this.spriteRotation != iAngle) {
			this.spriteArray.addEvent(this.spriteElement, {
				'-webkit-transform': 'rotate(' + (
					this.spriteRotation = (iAngle + this.rotationBase)
				) + 'rad)'
			});
		}
	},
	
	rotate: function(iAngle) {
		this.setRotation(this.spriteRotation + iAngle);
	},
	
	setPosition: [
		function(iLeft, iTop) {
			if ((this.spriteLeft != iLeft) || (this.spriteTop != iTop)) {
				this.spriteArray.addEvent(this.spriteElement, {
					'left': (this.spriteLeft = iLeft) + 'px',
					'top': (this.spriteTop = iTop) + 'px'
				});
			}
		},
		function(aPoint) {
			this.setPosition(aPoint[0], aPoint[1]);
		}
	],
	
	moveForward: function(iDistance) {
		this.setPosition(jgen.Math.pointOnCircle(
			this.spriteLeft, this.spriteTop,
			this.spriteRotation, iDistance
		));
	},
	
	animateMove: function(iToX, iToY, fCallBack) {
		var oThis = this;
		this.moveForward(8);
		if ((oThis.spriteLeft <= iToX) && (oThis.spriteTop <= iToY)) {
			setTimeout(function() {
				oThis.animateMove(iToX, iToY, fCallBack);
			}, 0);
		} else if (fCallBack) fCallBack.call(this); 
	}
	
});
