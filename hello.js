var VpaidVideoPlayer = function() {
    this._slot = null;
    this._eventsCallbacks = {};
    this._parameters = {};

};

VpaidVideoPlayer.prototype.initAd = function(width, height, viewMode,
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


VpaidVideoPlayer.prototype._adClickTrough = function() {
    this._callEvent('AdClickThru');
};



/**
 * Returns the versions of VPAID ad supported.
 */
VpaidVideoPlayer.prototype.handshakeVersion = function(version) {
    return '2.0';
};


/**
 * Called by the wrapper to start the ad.
 */
VpaidVideoPlayer.prototype.startAd = function() {
    //add overlay image
    var img = document.createElement('img');
    img.src = "http://ds.serving-sys.com/BurstingRes/Site-67593/Type-0/1ef22bf9-1958-4993-a30c-0d8ac43efdc3.jpg";
    img.addEventListener('click', this._adClickTrough.bind(this), false);
    this._slot.appendChild(img);

    //add close button for non linear ad
    var closeButton = document.createElement('button');
    closeButton.appendChild(document.createTextNode("Close"));
    closeButton.addEventListener('click', this._closeAd.bind(this), false);
    this._slot.appendChild(closeButton);
};

/**
 * Called by the wrapper to stop the ad.
 */
VpaidVideoPlayer.prototype.stopAd = function() {
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through
    var callback = this._callEvent.bind(this);
    setTimeout(callback, 75, ['AdStopped']);
};


/**
 * @param {number} value The volume in percentage.
 */
VpaidVideoPlayer.prototype.setAdVolume = function(value) {
    this._attributes['volume'] = value;
    this._callEvent('AdVolumeChanged');
};


/**
 * @return {number} The volume of the ad.
 */
VpaidVideoPlayer.prototype.getAdVolume = function() {
    return this._attributes['volume'];
};


/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
VpaidVideoPlayer.prototype.resizeAd = function(width, height, viewMode) {
    this._attributes['width'] = width;
    this._attributes['height'] = height;
    this._attributes['viewMode'] = viewMode;

    this._callEvent('AdSizeChange');
};

/**
 * Expands the ad.
 */
VpaidVideoPlayer.prototype.expandAd = function() {
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
VpaidVideoPlayer.prototype.getAdExpanded = function() {
    return this._attributes['expanded'];
};

/**
 * Collapses the ad.
 */
VpaidVideoPlayer.prototype.collapseAd = function() {
    this._attributes['expanded'] = false;
};

/**
 * Skips the ad.
 */
VpaidVideoPlayer.prototype.skipAd = function() {
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
VpaidVideoPlayer.prototype.subscribe = function(aCallback, eventName, aContext) {
    var callBack = aCallback.bind(aContext);
    this._eventsCallbacks[eventName] = callBack;
};


/**
 * Removes a callback based on the eventName.
 *
 * @param {string} eventName The callback type.
 */
VpaidVideoPlayer.prototype.unsubscribe = function(eventName) {
    this._eventsCallbacks[eventName] = null;
};


/**
 * @return {number} The ad width.
 */
VpaidVideoPlayer.prototype.getAdWidth = function() {
    return this._attributes['width'];
};


/**
 * @return {number} The ad height.
 */
VpaidVideoPlayer.prototype.getAdHeight = function() {
    return this._attributes['height'];
};


/**
 * @return {number} The time remaining in the ad.
 */
VpaidVideoPlayer.prototype.getAdRemainingTime = function() {
    return this._attributes['remainingTime'];
};


/**
 * @return {number} The duration of the ad.
 */
VpaidVideoPlayer.prototype.getAdDuration = function() {
    return this._attributes['duration'];
};


/**
 * @return {string} List of companions in vast xml.
 */
VpaidVideoPlayer.prototype.getAdCompanions = function() {
    return this._attributes['companions'];
};


/**
 * @return {string} A list of icons.
 */
VpaidVideoPlayer.prototype.getAdIcons = function() {
    return this._attributes['icons'];
};


/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
VpaidVideoPlayer.prototype.getAdLinear = function() {
    return this._attributes['linear'];
};

/**
 * Calls an event if there is a callback.
 * @param {string} eventType
 */
VpaidVideoPlayer.prototype._callEvent = function(eventType) {
    if (eventType in this._eventsCallbacks) {
        this._eventsCallbacks[eventType]();
    }
};

VpaidVideoPlayer.prototype._closeAd = function() {
    this._callEvent('AdUserClose');
    this.stopAd();
}

/**
 * Main function called by wrapper to get the VPAID ad.
 */
var getVPAIDAd = function() {
    return new VpaidVideoPlayer();
};