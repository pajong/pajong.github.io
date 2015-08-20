LinearAd = function() {
 // The slot is the div element on the main page that the ad is supposed to occupy
 this._slot = null;
 // The video slot is the video object that the creative can use to render and video element it
 this._videoSlot = null;
 }; 

 LinearAd.prototype.initAd = function(width, height, viewMode, desiredBitrate,
 creativeData, environmentVars) {
 // slot and videoSlot are passed as part of the environmentVars
 this._slot = environmentVars.slot;
 this._videoSlot = environmentVars.videoSlot;
 this._updateVideoSlot();
 this._videoSlot.addEventListener('ended', this.stopAd.bind(this),false);
 console.log("initAd");
 };


 LinearAd.prototype._updateVideoSlot = function() {
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

 LinearAd.prototype.startAd = function() {
 	this.startTime = new Date();
 console.log("Starting ad");
};

 LinearAd.prototype.stopAd = function(e, p) {
 console.log("Stopping ad");
 };

 LinearAd.prototype.setAdVolume = function(val) {
 console.log("setAdVolume");
 };
 LinearAd.prototype.getAdVolume = function() {
 console.log("getAdVolume");

 };
 LinearAd.prototype.resizeAd = function(width, height, viewMode) {
 console.log("resizeAd");
};

 LinearAd.prototype.pauseAd = function() {
 console.log("pauseAd");
 };
 LinearAd.prototype.resumeAd = function() {
 console.log("resumeAd");
 };
 LinearAd.prototype.expandAd = function() {
 console.log("expandAd");
 };
 LinearAd.prototype.getAdExpanded = function(val) {
 console.log("getAdExpanded");
 
 };
 LinearAd.prototype.getAdSkippableState = function(val) {
 console.log("getAdSkippableState");
 };
 LinearAd.prototype.collapseAd = function() {
 console.log("collapseAd");
 };

 LinearAd.prototype.skipAd = function() {
 console.log("skipAd");
};

LinearAd.prototype.subscribe = function(aCallback, eventName, aContext) {
 console.log("Subscribe");
 };
 // Callbacks are removed based on the eventName
 LinearAd.prototype.unsubscribe = function(eventName) {
 console.log("unsubscribe");
 };

 LinearAd.prototype.getAdLinear = function(first_argument) {
 	return true;
 };

 LinearAd.prototype.getAdRemainingTime = function() {
 	return 10000 - (new Date() - this.startTime);
 };

 LinearAd.prototype.getDuration = function() {
 	return 10;
 };

 LinearAd.prototype.handshakeVersion = function() {
 	return '2.0';
 }
getVPAIDAd = function() {
 return new LinearAd();
};












