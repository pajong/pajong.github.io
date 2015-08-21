var VpaidVideoPlayer = function() {
    this._slot = null;
    this._videoSlot = null;
    this._eventsCallbacks = {};
    this._parameters = {};
};

VpaidVideoPlayer.prototype.initAd = function(width, height, viewMode,
                                             desiredBitrate, creativeData, environmentVars) {

    this._slot = environmentVars.slot;
    this._videoSlot = environmentVars.videoSlot;

    // Parse the incoming parameters
    this._parameters = JSON.parse(creativeData['AdParameters']);

    this._attributes = this._parameters['attributes'];

    this._attributes['width'] = width;
    this._attributes['height'] = height;
    this._attributes['viewMode'] = viewMode;
    this._attributes['desiredBitrate'] = desiredBitrate;

    if (this._attributes['linear']) {
        this._updateVideoSlot();
        this._videoSlot.addEventListener('ended', this.stopAd.bind(this),false);
    }

    this._callEvent('AdLoaded');
};


VpaidVideoPlayer.prototype._adClickTrough = function() {
    this._callEvent('AdClickThru');
};


VpaidVideoPlayer.prototype._updateVideoSlot = function() {
    if (this._videoSlot == null) {
        this._videoSlot = document.createElement('videoAd');
        this._slot.appendChild(this._videoSlot);
    }

    var foundSource = false;
    var videos = this._parameters.videos || [];
    for (var i = 0; i < videos.length; i++) {
        // Choose the first video with a supported mimetype.
        if (this._videoSlot.canPlayType(videos[i].mimetype) != '') {
            this._videoSlot.setAttribute('src', videos[i].url);
            foundSource = true;
            break;
        }
    }
    if (!foundSource) {
        // Unable to find a source video.
        this._callEvent('AdError');
    }
};

/**
 * Returns the versions of VPAID ad supported.
 */
VpaidVideoPlayer.prototype.handshakeVersion = function(version) {
    return '2.0';
};

VpaidVideoPlayer.prototype.overlayOnClick_ = function() {
  this._callEvent('AdClickThru');
};


/**
 * Called by the wrapper to start the ad.
 */
VpaidVideoPlayer.prototype.startAd = function() {
    //add overlay image 
    var img = document.createElement('img');
  img.src = this._parameters.overlay || '';
  this._slot.appendChild(img);
  img.addEventListener('click', this.overlayOnClick_.bind(this), false);

    //start video for linear ad
    if (this._attributes['linear']) {
        this._videoSlot.play();
        this._slot.addEventListener('click', this._callEvent('AdClickThru', this), false);

        // add skip button if skippable
        if (this.getAdSkippableState()) {
            this._skipButton = document.createElement('button');
            this._skipButton.innerHTML = "Skip in 5";
            this._slot.appendChild(this._skipButton);

            this._skipUpdating = true;
            this._videoSlot.addEventListener('timeupdate', 
            this._timeUpdateHandler.bind(this), false);
        }

        this._callEvent('AdStarted');
        return;
    } 

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
    // if linear, resize video
    if (this._attribute['linear']) {
        try {
            this._videoSlot.setAttribute('width', width);
            this._videoSlot.setAttribute('height', height);
            this._videoSlot.style.width = width + 'px';
            this._videoSlot.style.height = height + 'px';
        } catch (e) {
            console.log('Could not resize video ad');
        }
    }

    this._callEvent('AdSizeChange');
};


/**
 * Pauses the ad.
 */
VpaidVideoPlayer.prototype.pauseAd = function() {
    this._videoSlot.pause();
    this._callEvent('AdPaused');
};


/**
 * Resumes the ad.
 */
VpaidVideoPlayer.prototype.resumeAd = function() {
    this._videoSlot.play();
    this._callEvent('AdResumed');
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
 * Returns the skippable state of the ad.
 * @return {boolean}
 */
VpaidVideoPlayer.prototype.getAdSkippableState = function() {
    return this._attributes['skippableState'];
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

VpaidVideoPlayer.prototype._timeUpdateHandler = function() {
  if (this._skipUpdating) {
    if (this._videoSlot.currentTime < 5) {
      this._skipButton.innerHTML = "Skip in " + Math.ceil(5 - this._videoSlot.currentTime);
    }
    else {
      this._skipButton.innerHTML = "Skip";
      this._skipButton.addEventListener('click', this.skipAd.bind(this), false);
      this._skipUpdating = false;
    }
  }  
};


/**
 * Main function called by wrapper to get the VPAID ad.
 */
var getVPAIDAd = function() {
    return new VpaidVideoPlayer();
};