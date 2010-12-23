HTMLElement.prototype.setStyle = function(oStyle) {
	for (var sPropertyName in oStyle) {
		this.style[sPropertyName.camelize()] = oStyle[
			sPropertyName
		];
	}
	return this;
};

HTMLElement.prototype.hasClass = function(sClassName) {
	return new RegExp('(\\s|^)' + sClassName + '(\\s|$)').test(this.className);
};

HTMLElement.prototype.addClass = function(sClassName) {
	if (this.hasClass(sClassName)) return;
	this.className = (this.className + ' ' + sClassName);
};


HTMLElement.prototype.removeClass = function(sClass) {
	this.replaceClass(sClass, '');
};

HTMLElement.prototype.replaceClass = function(sFromClass, sToClass) {
	this.className = this.className.replace(
		new RegExp('(\\s|^)' + sFromClass + '(\\s|$)'),
		sToClass
	);
};
