var VpaidNonLinearPlayer = function() {
    this._slot = null;
    this._eventsCallbacks = {};
    this._parameters = {};

};

VpaidNonLinearPlayer.prototype.initAd = function(width, height, viewMode,
                                             desiredBitrate, creativeData, environmentVars) {

    this._slot = environmentVars.slot;

    this._attributes = {
        "companions" : "",
        "desiredBitrate" : 256,
        "duration":10,
        "expanded" : false,
        "height" : 0,
        "icons" : "",
        "linear" : false,
        "remainingTime" : 10,
        "skippableState" : false,
        "viewMode" : "normal",
        "width" : 0,
        "volume" : 1.0
    };

    this._attributes['width'] = width;
    this._attributes['height'] = height;
    this._attributes['viewMode'] = viewMode;
    this._attributes['desiredBitrate'] = desiredBitrate;


    this._callEvent('AdLoaded');
};


VpaidNonLinearPlayer.prototype._adClickTrough = function() {
    this._callEvent('AdClickThru');
};



/**
 * Returns the versions of VPAID ad supported.
 */
VpaidNonLinearPlayer.prototype.handshakeVersion = function(version) {
    return '2.0';
};



/**
 * Called by the wrapper to stop the ad.
 */
VpaidNonLinearPlayer.prototype.stopAd = function() {
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through
    var callback = this._callEvent.bind(this);
    setTimeout(callback, 75, ['AdStopped']);
};


/**
 * @param {number} value The volume in percentage.
 */
VpaidNonLinearPlayer.prototype.setAdVolume = function(value) {
    this._attributes['volume'] = value;
    this._callEvent('AdVolumeChanged');
};


/**
 * @return {number} The volume of the ad.
 */
VpaidNonLinearPlayer.prototype.getAdVolume = function() {
    return this._attributes['volume'];
};


/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
VpaidNonLinearPlayer.prototype.resizeAd = function(width, height, viewMode) {
    this._attributes['width'] = width;
    this._attributes['height'] = height;
    this._attributes['viewMode'] = viewMode;

    this._callEvent('AdSizeChange');
};


/**
 * Pauses the ad.
 */
VpaidNonLinearPlayer.prototype.pauseAd = function() {
    this._callEvent('AdPaused');
};


/**
 * Resumes the ad.
 */
VpaidNonLinearPlayer.prototype.resumeAd = function() {
    this._callEvent('AdResumed');
};


/**
 * Expands the ad.
 */
VpaidNonLinearPlayer.prototype.expandAd = function() {
    this._attributes['expanded'] = true;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    this._callEvent('AdExpanded');
};


/**
 * Returns true if the ad is expanded.
 * @return {boolean}
 */
VpaidNonLinearPlayer.prototype.getAdExpanded = function() {
    return this._attributes['expanded'];
};


/**
 * Returns the skippable state of the ad.
 * @return {boolean}
 */
VpaidNonLinearPlayer.prototype.getAdSkippableState = function() {
    return this._attributes['skippableState'];
};


/**
 * Collapses the ad.
 */
VpaidNonLinearPlayer.prototype.collapseAd = function() {
    this._attributes['expanded'] = false;
};


/**
 * Skips the ad.
 */
VpaidNonLinearPlayer.prototype.skipAd = function() {
    var skippableState = this._attributes['skippableState'];
    if (skippableState) {
        this._eventsCallbacks['AdSkipped']();
        this._eventsCallbacks['AdVideoComplete']();
        var callback = this._callEvent.bind(this);
        setTimeout(callback, 75, ['AdStopped']);
    }
};


/**
 * Registers a callback for an event.
 * @param {Function} aCallback The callback function.
 * @param {string} eventName The callback type.
 * @param {Object} aContext The context for the callback.
 */
VpaidNonLinearPlayer.prototype.subscribe = function(aCallback, eventName, aContext) {
    var callBack = aCallback.bind(aContext);
    this._eventsCallbacks[eventName] = callBack;
};


/**
 * Removes a callback based on the eventName.
 *
 * @param {string} eventName The callback type.
 */
VpaidNonLinearPlayer.prototype.unsubscribe = function(eventName) {
    this._eventsCallbacks[eventName] = null;
};


/**
 * @return {number} The ad width.
 */
VpaidNonLinearPlayer.prototype.getAdWidth = function() {
    return this._attributes['width'];
};


/**
 * @return {number} The ad height.
 */
VpaidNonLinearPlayer.prototype.getAdHeight = function() {
    return this._attributes['height'];
};


/**
 * @return {number} The time remaining in the ad.
 */
VpaidNonLinearPlayer.prototype.getAdRemainingTime = function() {
    return this._attributes['remainingTime'];
};


/**
 * @return {number} The duration of the ad.
 */
VpaidNonLinearPlayer.prototype.getAdDuration = function() {
    return this._attributes['duration'];
};


/**
 * @return {string} List of companions in vast xml.
 */
VpaidNonLinearPlayer.prototype.getAdCompanions = function() {
    return this._attributes['companions'];
};


/**
 * @return {string} A list of icons.
 */
VpaidNonLinearPlayer.prototype.getAdIcons = function() {
    return this._attributes['icons'];
};


/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
VpaidNonLinearPlayer.prototype.getAdLinear = function() {
    return this._attributes['linear'];
};

/**
 * Calls an event if there is a callback.
 * @param {string} eventType
 */
VpaidNonLinearPlayer.prototype._callEvent = function(eventType) {
    if (eventType in this._eventsCallbacks) {
        this._eventsCallbacks[eventType]();
    }
};

VpaidNonLinearPlayer.prototype._closeAd = function() {
    this._callEvent('AdUserClose');
    this.stopAd();
}

/**
 * Main function called by wrapper to get the VPAID ad.
 */
var getVPAIDAd = function() {
    return new VpaidNonLinearPlayer();
};