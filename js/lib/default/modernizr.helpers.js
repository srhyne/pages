(function(M, md){

  //this is a custom test for of Modernizr.touch test! This is used to
  //remove the touch detection on windows 8 laptops that use both
  //touch & mouse events (the pointer events)
  //see http://www.html5rocks.com/en/mobile/touchandmouse/

  M.addTest('mobile', function () {
    return md.mobile();
  });

  M.addTest('windows', function(){
    return (/win/i).test(window.navigator.platform);
  });

  M.addTest('chromeos', function(){
    return (/CrOS/).test(window.navigator.userAgent);
  });

  //in Modernzir 3 this is 'touchevents'
  M.addTest('touchy', function() {
    //we should probably remove this, what about windows phones?
    if (M.windows) {
      return false;
    }

    //if touchevent is present but so is mouseevent, go with mousevent
    if (M.touch && !M.mobile && ('MouseEvent' in window)) {
      return false;
    }

    return M.touch;
  });

  M.addTest('standalone', function(){
    return window.navigator.standalone;
  });


  function hyphenate (str) {

    if(str === false){
      return false;
    }

    return str.replace(/([A-Z])/g, function(str,m1){
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
  }


  //return a list of prefix
  M.prefixedAttrs = function(){
    var self, args, l, attrs, prefixed, format, style;

    self = this;
    args = [].slice.call( arguments, 0 ).reverse();
    l  = args.length;
    attrs = this._prefixed_attrs = (this._prefixed_attrs || {});
    prefixed = [];

    while(l--){
      style = args[l];
      attrs[style] = (attrs[style] !== undefined)
                    ? attrs[style]
                    : this.prefixed( style );

      prefixed.push( hyphenate(attrs[style]) );
    }


    return prefixed.length === 1 ? prefixed[0] : prefixed;
  }

})(Modernizr, new MobileDetect(window.navigator.userAgent));