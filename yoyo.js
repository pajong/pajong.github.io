VPAIDWrapper = function(VPAIDCreative) {
 this._creative = VPAIDCreative;
 if(!this.checkVPAIDInterface(VPAIDCreative))
 {
 //The VPAIDCreative doesn't conform to the VPAID spec
 return;
 }
 this.setCallbacksForCreative();
 // This function registers the callbacks of each of the events

 VPAIDWrapper.prototype.setCallbacksForCreative = function() {
 var callbacks = {
 AdStarted : this.onStartAd,
 AdStopped : this.onStopAd,
 AdSkipped : this.onSkipAd,
 AdLoaded : this.onAdLoaded,
 AdLinearChange : this.onAdLinearChange,
 AdSizeChange : this.onAdSizeChange,
 AdExpandedChange : this.onAdExpandedChange,
 AdSkippableStateChange : this.onAdSkippableStateChange,
 AdDurationChange : this.onAdDurationChange,
 AdRemainingTimeChange : this.onAdRemainingTimeChange,
 AdVolumeChange : this.onAdVolumeChange,
 AdImpression : this.onAdImpression,
 AdClickThru : this.onAdClickThru,
 AdInteraction : this.onAdInteraction,
 AdVideoStart : this.onAdVideoStart,
 AdVideoFirstQuartile : this.onAdVideoFirstQuartile,
 AdVideoMidpoint : this.onAdVideoMidpoint,
 AdVideoThirdQuartile : this.onAdVideoThirdQuartile,
 AdVideoComplete : this.onAdVideoComplete,
 AdUserAcceptInvitation : this.onAdUserAcceptInvitation,
 AdUserMinimize : this.onAdUserMinimize,
 AdUserClose : this.onAdUserClose,
 AdPaused : this.onAdPaused,
 AdPlaying : this.onAdPlaying,
 AdError : this.onAdError,
 AdLog : this.onAdLog
 };

 for ( var eventName in callbacks) {
 this._creative.subscribe(callbacks[eventName],
 eventName, this);
 }
 };

 VPAIDWrapper.prototype.initAd = function(width, height,
 viewMode, desiredBitrate, creativeData,
 environmentVars) {
 this._creative.initAd(width, height, viewMode,
 desiredBitrate, creativeData,
 environmentVars);
 };

VPAIDWrapper.prototype.onAdPaused = function() {
 console.log("onAdPaused");
 };

 VPAIDWrapper.prototype.onStartAd = function() {
 console.log("Ad has started");
 };





