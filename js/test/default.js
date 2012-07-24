//    - jquery.event.fastfix.js
(function ($, undefined) {
  var set, special;
  
  if(!Object.defineProperties){
    return false;
  }
  
	// http://bitovi.com/blog/2012/04/faster-jquery-event-fix.html
	// https://gist.github.com/2377196

	// IE 8 has Object.defineProperty but it only defines DOM Nodes. According to
	// http://kangax.github.com/es5-compat-table/#define-property-ie-note
	// All browser that have Object.defineProperties also support Object.defineProperty properly
  // Use defineProperty on an object to set the value and return it
	set = function (obj, prop, val) {
			if(val !== undefined) {
				Object.defineProperty(obj, prop, {
					value : val
				});
			}
			return val;
  };
  
	// special converters
	special = {
		pageX : function (original) {
			var eventDoc = this.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;
			return original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
		},
		pageY : function (original) {
			var eventDoc = this.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;
			return original.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0 );
		},
		relatedTarget : function (original) {
			if(!original) {
				return;
			}
			return original.fromElement === this.target ? original.toElement : original.fromElement;
		},
		metaKey : function (originalEvent) {
			return originalEvent.ctrlKey;
		},
		which : function (original) {
			return original.charCode != null ? original.charCode : original.keyCode;
		}
	};

	// Get all properties that should be mapped
	$.each($.event.keyHooks.props.concat($.event.mouseHooks.props).concat($.event.props), function (i, prop) {
		if (prop !== "target") {
			(function () {
				Object.defineProperty($.Event.prototype, prop, {
					get : function () {
						// get the original value, undefined when there is no original event
						var originalValue = this.originalEvent && this.originalEvent[prop];
						// overwrite getter lookup
						return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,
							// if we have a special function and no value
							special[prop] && originalValue === undefined ?
								// call the special function
								special[prop].call(this, this.originalEvent) :
								// use the original value
								originalValue)
					},
					set : function (newValue) {
						// Set the property with underscore prefix
						this['_' + prop] = newValue;
					}
				});
			})();
		}
	});

	$.event.fix = function (event) {
		if (event[ $.expando ]) {
			return event;
		}
		// Create a $ event with at minimum a target and type set
		var originalEvent = event,
			  event = $.Event(originalEvent);
		event.target = originalEvent.target;
		
		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if (!event.target) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if (event.target.nodeType === 3) {
			event.target = event.target.parentNode;
		}

		return event;
	}
	
})(jQuery);
/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexbox_legacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function C(a){j.cssText=a}function D(a,b){return C(n.join(a+";")+(b||""))}function E(a,b){return typeof a===b}function F(a,b){return!!~(""+a).indexOf(b)}function G(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function H(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:E(f,"function")?f.bind(d||b):f}return!1}function I(a,b,c){var d=a.charAt(0).toUpperCase()+a.substr(1),e=(a+" "+p.join(d+" ")+d).split(" ");return E(b,"string")||E(b,"undefined")?G(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),H(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:/^color$/.test(f)?(g.appendChild(k),g.offsetWidth,e=k.value!=l,g.removeChild(k)):e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.5.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),k.appendChild(j);return f=["&#173;","<style>",a,"</style>"].join(""),k.id=h,(l?k:m).innerHTML+=f,m.appendChild(k),l||(m.style.background="",g.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},z=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=E(e[d],"function"),E(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),A={}.hasOwnProperty,B;!E(A,"undefined")&&!E(A.call,"undefined")?B=function(a,b){return A.call(a,b)}:B=function(a,b){return b in a&&E(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e});var J=function(c,d){var f=c.join(""),g=d.length;y(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9,e.csstransforms3d=(j.csstransforms3d&&j.csstransforms3d.offsetLeft)===9&&j.csstransforms3d.offsetHeight===3,e.generatedcontent=(j.generatedcontent&&j.generatedcontent.offsetHeight)>=1,e.fontface=/src/i.test(h)&&h.indexOf(d.split(" ")[0])===0},g,d)}(['@font-face {font-family:"font";src:url("https://")}',["@media (",n.join("touch-enabled),("),h,")","{#touch{top:9px;position:absolute}}"].join(""),["@media (",n.join("transform-3d),("),h,")","{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join(""),['#generatedcontent:after{content:"',l,'";visibility:hidden}'].join("")],["fontface","touch","csstransforms3d","generatedcontent"]);s.flexbox=function(){return I("flexOrder")},s["flexbox-legacy"]=function(){return I("boxDirection")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!E(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){try{var d=b.createElement("canvas"),e;e=!(!a.WebGLRenderingContext||!d.getContext("experimental-webgl")&&!d.getContext("webgl")),d=c}catch(f){e=!1}return e},s.touch=function(){return e.touch},s.geolocation=function(){return!!navigator.geolocation},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!I("indexedDB",a)},s.hashchange=function(){return z("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){for(var b=-1,c=p.length;++b<c;)if(a[p[b]+"WebSocket"])return!0;return"WebSocket"in a},s.rgba=function(){return C("background-color:rgba(150,255,150,.5)"),F(j.backgroundColor,"rgba")},s.hsla=function(){return C("background-color:hsla(120,40%,100%,.5)"),F(j.backgroundColor,"rgba")||F(j.backgroundColor,"hsla")},s.multiplebgs=function(){return C("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return I("backgroundSize")},s.borderimage=function(){return I("borderImage")},s.borderradius=function(){return I("borderRadius")},s.boxshadow=function(){return I("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return D("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return I("animationName")},s.csscolumns=function(){return I("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return C((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),F(j.backgroundImage,"gradient")},s.cssreflections=function(){return I("boxReflect")},s.csstransforms=function(){return!!I("transform")},s.csstransforms3d=function(){var a=!!I("perspective");return a&&"webkitPerspective"in g.style&&(a=e.csstransforms3d),a},s.csstransitions=function(){return I("transition")},s.fontface=function(){return e.fontface},s.generatedcontent=function(){return e.generatedcontent},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)B(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),C(""),i=k=null,function(a,b){function g(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function h(){var a=k.elements;return typeof a=="string"?a.split(" "):a}function i(a){var b={},c=a.createElement,e=a.createDocumentFragment,f=e();a.createElement=function(a){var e=(b[a]||(b[a]=c(a))).cloneNode();return k.shivMethods&&e.canHaveChildren&&!d.test(a)?f.appendChild(e):e},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+h().join().replace(/\w+/g,function(a){return b[a]=c(a),f.createElement(a),'c("'+a+'")'})+");return n}")(k,f)}function j(a){var b;return a.documentShived?a:(k.shivCSS&&!e&&(b=!!g(a,"article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}")),f||(b=!i(a)),b&&(a.documentShived=b),a)}var c=a.html5||{},d=/^<|^(?:button|form|map|select|textarea)$/i,e,f;(function(){var a=b.createElement("a");a.innerHTML="<xyz></xyz>",e="hidden"in a,f=a.childNodes.length==1||function(){try{b.createElement("a")}catch(a){return!0}var c=b.createDocumentFragment();return typeof c.cloneNode=="undefined"||typeof c.createDocumentFragment=="undefined"||typeof c.createElement=="undefined"}()})();var k={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:j};a.html5=k,j(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.hasEvent=z,e.testProp=function(a){return G([a])},e.testAllProps=I,e.testStyles=y,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return o.call(a)=="[object Function]"}function e(a){return typeof a=="string"}function f(){}function g(a){return!a||a=="loaded"||a=="complete"||a=="uninitialized"}function h(){var a=p.shift();q=1,a?a.t?m(function(){(a.t=="c"?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){a!="img"&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l={},o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};y[c]===1&&(r=1,y[c]=[],l=b.createElement(a)),a=="object"?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),a!="img"&&(r||y[c]===2?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i(b=="c"?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),p.length==1&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&o.call(a.opera)=="[object Opera]",l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return o.call(a)=="[object Array]"},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,i){var j=b(a),l=j.autoCallback;j.url.split(".").pop().split("?").shift(),j.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]||h),j.instead?j.instead(a,e,f,g,i):(y[j.url]?j.noexec=!0:y[j.url]=1,f.load(j.url,j.forceCSS||!j.forceJS&&"css"==j.url.split(".").pop().split("?").shift()?"c":c,j.noexec,j.attrs,j.timeout),(d(e)||d(l))&&f.load(function(){k(),e&&e(j.origUrl,i,g),l&&l(j.origUrl,i,g),y[j.url]=2})))}function i(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var j,l,m=this.yepnope.loader;if(e(a))g(a,0,m,0);else if(w(a))for(j=0;j<a.length;j++)l=a[j],e(l)?g(l,0,m,0):w(l)?B(l):Object(l)===l&&i(l,m);else Object(a)===a&&i(a,m)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));
/**
 * @author Stephen Rhyne
 */
//template engine
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
!function(GLOBAL){
  
  var $ = GLOBAL.jQuery;
  
  
  $.fn.swipe = function(selector, cb){ 
    var _selector, _page, offset, start, move, end;
     
    _selector = selector + ":not(.pages-0)"; //don't overide original selector
    offset = null;  
    
    
    start = function(e) {  
      var orig, pos, _this;
      
      //e.stopPropagation();
      _page = this;
      
      orig = e.originalEvent;  
      _this = $(this);
            
      pos = _this.position();  
       
      offset = {  
        prevX : pos.left,
        prevY : pos.top,
        x : orig.changedTouches[0].pageX,
        y : orig.changedTouches[0].pageY
      };  
            
      
    };  
    
    move = function(e){  
      var orig, y;
    
      if(_page !== this){
        return true;
      }
      
      //e.stopPropagation();
      orig = e.originalEvent;  
      offset.diffX = offset.x - orig.changedTouches[0].pageX;
      offset.diffY = offset.y - orig.changedTouches[0].pageY;
      
    };  
    
    end = function(e){
      var _this, _anim, parentPage, dir, parentWidth, x;
      
      
      if(Math.abs(offset.diffY) > 40 && _page !== this){
        return true
      }
      
      e.stopPropagation();
      
      _this = $(this);
      _anim = $.extend({}, {
  			  leaveTransforms : true,
    			useTranslate3d : true
      });
      
      // var posDiff = _this.position().left - offset.prevX;
      dir = offset.diffX >= 40 ? "left" : offset.diffX <= -40 ? "right" : false;
      parentWidth = _this.parents(selector).eq(0).width();
      x = dir === 'right' ? parentWidth + 1 : dir === 'left' ? 0 : offset.prevX;
       
    //dragging from left to right
		_anim.left = x;
		_this.addClass('sliding').animate(_anim, 500, "easeOutCirc",function(){
      var classMethod = dir === 'left' ? 'add' : 'remove';
			//add or remove class depedning on direction	
			_this[classMethod+"Class"]('closed').removeClass('sliding');
  	});
  	
  };
  
  
    this
      .on('touchstart', _selector, start)
      .on("touchmove", _selector, move) 
      .on('touchend', _selector, end);
  };
  
  
  $.fn.tap = function(selector, cb){
    
    var _moved, _start, _end;

    if(!Modernizr.touch){
      return this.on('click', selector, cb);
    }

    _moved = false;
    
    //TODO namespace this.. 
    this
    .on('touchstart.tappable', selector, function(e){
      _start = this;
    })
    .on('touchmove.tappable', selector, function(e){
      _moved = true;
    })
    .on('touchend.tappable', selector, function(e){
      if(_moved === false && _start === this){
       cb.apply(this, arguments)  
      }
      
      _moved = false;
      _start = undefined;
      _end = undefined;
    });
    
    return this;
  }
  
  

  
}(window);


/*************************************************
jquery.animate-enhanced plugin v0.80
Author: www.benbarnett.net || @benpbarnett

Copyright (c) 2011 Ben Barnett
Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php
**************************************************/
(function(a,b,c){function u(a,b,c,d){var e=h.exec(b),f=a.css(c)==="auto"?0:a.css(c),g=typeof f=="string"?A(f):f,i=typeof b=="string"?A(b):b,j=d===!0?0:g,k=a.is(":hidden"),l=a.translation();c=="left"&&(j=parseInt(g,10)+l.x),c=="right"&&(j=parseInt(g,10)+l.x),c=="top"&&(j=parseInt(g,10)+l.y),c=="bottom"&&(j=parseInt(g,10)+l.y),!e&&b=="show"?(j=1,k&&a.css({display:"block",opacity:0})):!e&&b=="hide"&&(j=0);if(e){var m=parseFloat(e[2]);return e[1]&&(m=(e[1]==="-="?-1:1)*m+parseInt(j,10)),m}return j}function v(a,b,c){return(c===!0||n==!0&&c!=!1)&&t?"translate3d("+a+"px,"+b+"px,0)":"translate("+a+"px,"+b+"px)"}function w(b,c,d,f,g,h,i,l){var m=b.data(k)?z(b.data(k))?a.extend(!0,{},j):b.data(k):a.extend(!0,{},j),n=g,o=a.inArray(c,e)>-1;if(o){var p=m.meta,q=A(b.css(c))||0,r=c+"_o";n=g-q,p[c]=n,p[r]=b.css(c)=="auto"?0+n:q+n||0,m.meta=p,i&&n===0&&(n=0-p[r],p[c]=n,p[r]=0)}return b.data(k,x(m,c,d,f,n,h,i,l))}function x(a,b,c,d,e,g,h,i){a=typeof a=="undefined"?{}:a,a.secondary=typeof a.secondary=="undefined"?{}:a.secondary;for(var j=f.length-1;j>=0;j--)typeof a[f[j]+"transition-property"]=="undefined"&&(a[f[j]+"transition-property"]=""),a[f[j]+"transition-property"]+=", "+(g===!0&&h===!0?f[j]+"transform":b),a[f[j]+"transition-duration"]=c+"ms",a[f[j]+"transition-timing-function"]=d,a.secondary[g===!0&&h===!0?f[j]+"transform":b]=g===!0&&h===!0?v(a.meta.left,a.meta.top,i):e;return a}function y(a){for(var b in a)if((b=="width"||b=="height")&&(a[b]=="show"||a[b]=="hide"||a[b]=="toggle"))return!0;return!1}function z(a){for(var b in a)return!1;return!0}function A(a){return parseFloat(a.replace(/px/i,""))}function B(b,c,e){var f=a.inArray(b,d)>-1;return(b=="width"||b=="height")&&c===parseFloat(e.css(b))&&(f=!1),f}var d=["top","right","bottom","left","opacity","height","width"],e=["top","right","bottom","left"],f=["","-webkit-","-moz-","-o-"],g=["avoidTransforms","useTranslate3d","leaveTransforms"],h=/^([+-]=)?([\d+-.]+)(.*)$/,i=/([A-Z])/g,j={secondary:{},meta:{top:0,right:0,bottom:0,left:0}},k="jQe",l="cubic-bezier(",m=")",n=!1,o=null,p=document.body||document.documentElement,q=p.style,r=q.WebkitTransition!==undefined?"webkitTransitionEnd":q.OTransition!==undefined?"oTransitionEnd":"transitionend",s=q.WebkitTransition!==undefined||q.MozTransition!==undefined||q.OTransition!==undefined||q.transition!==undefined,t=n="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix;a.expr&&a.expr.filters&&(o=a.expr.filters.animated,a.expr.filters.animated=function(b){return a(b).data("events")&&a(b).data("events")[r]?!0:o.call(this,b)}),a.extend({toggle3DByDefault:function(){n=!n}}),a.fn.translation=function(){if(!this[0])return null;var a=this[0],b=window.getComputedStyle(a,null),c={x:0,y:0};for(var d=f.length-1;d>=0;d--){var e=b.getPropertyValue(f[d]+"transform");if(e&&/matrix/i.test(e)){var g=e.replace(/^matrix\(/i,"").split(/, |\)$/g);c={x:parseInt(g[4],10),y:parseInt(g[5],10)};break}}return c},a.fn.animate=function(c,d,h,i){c=c||{};var j=typeof c.bottom=="undefined"&&typeof c.right=="undefined",n=a.speed(d,h,i),o=this,p=0,q=function(){p--,p===0&&typeof n.complete=="function"&&n.complete.apply(o[0],arguments)};return!s||z(c)||y(c)||n.duration<=0||a.fn.animate.defaults.avoidTransforms===!0&&c.avoidTransforms!==!1?b.apply(this,arguments):this[n.queue===!0?"queue":"each"](function(){var d=a(this),h=a.extend({},n),i=function(){var a={};for(var b=f.length-1;b>=0;b--)a[f[b]+"transition-property"]="none",a[f[b]+"transition-duration"]="",a[f[b]+"transition-timing-function"]="";d.unbind(r);if(!c.leaveTransforms==!0){var g=d.data(k)||{},h={};for(b=f.length-1;b>=0;b--)h[f[b]+"transform"]="";if(j&&typeof g.meta!="undefined")for(var i=0,l;l=e[i];++i)h[l]=g.meta[l+"_o"]+"px";d.css(a).css(h)}c.opacity==="hide"&&d.css("display","none"),d.data(k,null),q.call(d)},o={bounce:l+"0.0, 0.35, .5, 1.3"+m,linear:"linear",swing:"ease-in-out",easeInQuad:l+"0.550, 0.085, 0.680, 0.530"+m,easeInCubic:l+"0.550, 0.055, 0.675, 0.190"+m,easeInQuart:l+"0.895, 0.030, 0.685, 0.220"+m,easeInQuint:l+"0.755, 0.050, 0.855, 0.060"+m,easeInSine:l+"0.470, 0.000, 0.745, 0.715"+m,easeInExpo:l+"0.950, 0.050, 0.795, 0.035"+m,easeInCirc:l+"0.600, 0.040, 0.980, 0.335"+m,easeOutQuad:l+"0.250, 0.460, 0.450, 0.940"+m,easeOutCubic:l+"0.215, 0.610, 0.355, 1.000"+m,easeOutQuart:l+"0.165, 0.840, 0.440, 1.000"+m,easeOutQuint:l+"0.230, 1.000, 0.320, 1.000"+m,easeOutSine:l+"0.390, 0.575, 0.565, 1.000"+m,easeOutExpo:l+"0.190, 1.000, 0.220, 1.000"+m,easeOutCirc:l+"0.075, 0.820, 0.165, 1.000"+m,easeInOutQuad:l+"0.455, 0.030, 0.515, 0.955"+m,easeInOutCubic:l+"0.645, 0.045, 0.355, 1.000"+m,easeInOutQuart:l+"0.770, 0.000, 0.175, 1.000"+m,easeInOutQuint:l+"0.860, 0.000, 0.070, 1.000"+m,easeInOutSine:l+"0.445, 0.050, 0.550, 0.950"+m,easeInOutExpo:l+"1.000, 0.000, 0.000, 1.000"+m,easeInOutCirc:l+"0.785, 0.135, 0.150, 0.860"+m},s={},t=o[h.easing||"swing"]?o[h.easing||"swing"]:h.easing||"swing";for(var v in c)if(a.inArray(v,g)===-1){var x=a.inArray(v,e)>-1,y=u(d,c[v],v,x&&c.avoidTransforms!==!0);c.avoidTransforms!==!0&&B(v,y,d)?w(d,v,h.duration,t,x&&c.avoidTransforms===!0?y+"px":y,x&&c.avoidTransforms!==!0,j,c.useTranslate3d===!0):s[v]=c[v]}var A=d.data(k)||{};for(var C=f.length-1;C>=0;C--)typeof A[f[C]+"transition-property"]!="undefined"&&(A[f[C]+"transition-property"]=A[f[C]+"transition-property"].substr(2));d.data(k,A).unbind(r);if(!z(d.data(k))&&!z(d.data(k).secondary)){p++,d.css(d.data(k));var D=d.data(k).secondary;setTimeout(function(){d.bind(r,i).css(D)})}else h.queue=!1;return z(s)||(p++,b.apply(d,[s,{duration:h.duration,easing:a.easing[h.easing]?h.easing:a.easing.swing?"swing":"linear",complete:q,queue:h.queue}])),!0})},a.fn.animate.defaults={},a.fn.stop=function(b,d,e){if(!s)return c.apply(this,[b,d]);b&&this.queue([]);var g={};for(var h=f.length-1;h>=0;h--)g[f[h]+"transition-property"]="none",g[f[h]+"transition-duration"]="",g[f[h]+"transition-timing-function"]="";return this.each(function(){var h=a(this),j=window.getComputedStyle(this,null),l={},m;if(!z(h.data(k))&&!z(h.data(k).secondary)){var n=h.data(k);if(d){l=n.secondary;if(!e&&typeof n.meta.left_o!==undefined||typeof n.meta.top_o!==undefined){l.left=typeof n.meta.left_o!==undefined?n.meta.left_o:"auto",l.top=typeof n.meta.top_o!==undefined?n.meta.top_o:"auto";for(m=f.length-1;m>=0;m--)l[f[m]+"transform"]=""}}else for(var o in h.data(k).secondary){o=o.replace(i,"-$1").toLowerCase(),l[o]=j.getPropertyValue(o);if(!e&&/matrix/i.test(l[o])){var p=l[o].replace(/^matrix\(/i,"").split(/, |\)$/g);l.left=parseFloat(p[4])+parseFloat(h.css("left"))+"px"||"auto",l.top=parseFloat(p[5])+parseFloat(h.css("top"))+"px"||"auto";for(m=f.length-1;m>=0;m--)l[f[m]+"transform"]=""}}h.unbind(r).css(g).css(l).data(k,null)}else c.apply(h,[b,d])}),this}})(jQuery,jQuery.fn.animate,jQuery.fn.stop)
!function($){
	
	//option obj, $ window, "div."+ns
	var _opts, _window, _content, selector, currentPage,
	
		//private methods
    _collapse, _fb, _open, _pushHistory, _popHistory, _all, _isSinglePage,
		
		//exported methods
		expand, find, init, repaint, add, drop, back, forward,
		
		//public methods object
		methods, 
		
		//plugin namespace
		ns = 'pages';
		
		//options
	_opts = {
		cls : "page", 
		//animate 
		css3 : {
			leaveTransforms : true,
			useTranslate3d : true	
		},
    twoPageMinWidth : 767, //change to 768 to go 1 page on ipad in portrait
		time :  1000	
	};
	
	//closes all pages that aren't currently animated
	//TODO return object
	_collapse = function(pages, time, cb){
	  var _anim, notClosed, _selector;
	  
    _anim = $.extend({}, _opts.css3, {left : 0});
    _selector = "."+ns+"-0, .closed";
			//took out :animated from filter because it was causing problems inside the profile.
    notClosed = pages.not(_selector); 
    
		cb = typeof cb === 'function' ? cb : function(){ return false; };	
		time = time <= _opts.time ? time : _opts.time;
		
		!notClosed[0] && cb();
	
		notClosed && notClosed.animate(_anim, time, 'easeOutCirc',function(){
      notClosed.addClass('closed');
			cb();
		});

		return pages;
	};
	
	
	_fb = function(dir, cb){
		var _pages = _all(),
			method = dir === 'back' ? "parents" : "children"; 
			toOpen = _pages.filter("."+ns+"-0, .closed").last()[method](selector).eq(0); 	
		return open(toOpen, cb);
	};
	
	_open2 = function(){
		var _this, _pages;
		
		_this = _open2._this;
	
		//don't use children here. We want all not the last one
		_pages = _this.find(selector);
    
		if(!_pages[0]){
			return false;
		}
		
		_open2._this = null;					
		return _pages.removeClass('closed').updateX();
	};
	
	_open = function(){
		var toClose = this.parents(selector).andSelf();
		_open2._this = this;
		_collapse(toClose, _opts.time,  _open2); 
	};
	
	_pushHistory = function(){
    var name = (this.data(ns) || {}).name || "First Page";
    history.pushState({ name : name }, name);
	};
	
  _all = function(){
    return _content.find(selector);
  };
  
  _isSinglePage = function(){
    return (_window.width() <= _opts.twoPageMinWidth ? true : false);    
  };
  
	//----------------------------------------------private methods exported----------------------------//

	//check for animate
	//TODO check for double init
	init = function(customOpts, callback){
		var og = window.location.origin + '/';

		//set closure vars (See TOP);
		_window = $(window);
		selector = "div."+_opts.cls;
		
		//TODO I don't think you need to re-assign that here. 
		_opts = $.extend(_opts, customOpts || {}, true);	
		// add opts data to scope
	
		//testing this
		
	  Modernizr.load([
      {
        test : Modernizr.touch, 
        nope : [og + 'pages/js/min/sans_touch.min.js'], 
        yep : [og + 'pages/js/min/touch.min.js']
	    }
	  ]);
	  
	  //even though iScroll is in touch/sans_touch interfaces, don't add swipe 
	  //to desktop.
    Modernizr.touch && _content.swipe(selector);
		
		return $[ns];
	};
	
	
  //repaint the animation offsets of the panels..
	repaint = function(){
    var pages;
    
	  pages = _all();
	  
	  if(pages.length === 0){
	    return false;
	  }
	  
    pages.slice(1).filter(':not(.closed)').updateX();
    
    if( !_isSinglePage() ){
      return false;
    }
    
    _open.call( pages.last() );

	};
	
	
	//@param el $ object or html that's being i	nserted into the new page
	// this in callback refers to the el being added NOT .page (TODO change this?)
	add = function(el, name, callback){
		var _el, w, pages, pageCount, lastPage,
		    container, singlePage, offset, _anim, 
		    pageContent, _page;
		
		//make a jquery collection even if it is already
		_el = $(el); 
		//get all pages
		pages = _all(); 
		pageCount = pages.size();
		//close pages before adding
		if(pageCount !== 0){
			_collapse(pages);
		}
		
		//get last div.page if their is one
		lastPage = pages.last();
		//if there is a current div.page this will be our container NOT our scope this object
		container = lastPage[0] ? lastPage : this;
		
		//get width of container //cache this?
		singlePage = _isSinglePage();
		offset = pageCount === 0 || singlePage ? 0 : lastPage.width();
										
		// offset = Math.round(offset);
		
		_anim = {
			left : offset
		};
		
		//testing
		
		_anim = $.extend({}, _opts.css3, _anim);
		
    pageContent = $('<div/>', { 
		    'class' : 'page-content',
		    html : _el
		});
		  
    _page = $("<div/>",{
      id : ns+"-"+pageCount,
			'class' : _opts.cls +" "+ ns+"-"+pageCount, //dont take off index class!
			html : pageContent, 
		})
		.data({
			pages : { 
				offset : singlePage ? 0 : offset,  
				name : name ? name : ns+"_"+pageCount
			} 	
		})
		.slide(this.width(), {
		  right : 0, 
			left : 0,
			"z-index" : 2
		})
		.appendTo(container)
		.animate(_anim, _opts.time, "easeOutCirc", function(){ 
		  var scrollers;
		  
		  if(typeof iScroll !== 'undefined'){
        scrollers = _el.find('.scroller');
        //if there other scrollers use that not the whole page..
        if(scrollers[0]){
          scrollers.each(function(){
            //TODO add a way to pass in iscroll data from the template
            // i.e. data-scrollers-vScrollbar or something.. 
            iScroll['_'+this.id] = new iScroll(this,{ vScrollbar : false });
          });
        }
        else{
          new iScroll(pageContent[0],{ vScrollbar : false });
        }
		  }//enf of if iScroll
      
      return typeof callback === 'function' && callback.call(_el);
		});
		
		_pushHistory.call(_page);
    
    //this could faster instead of using selector..
		return $[ns]; //singlePage ? $[ns]('expand', ':last') : $[ns];
	};
	
	
	//@param s mixed selector int index, string searches for $(selector).data('key'+ns);
	find = function(s, callback){
		var _pages, _page;
		//no page or number passed
		if(typeof s === 'undefined'){
			console.log('no element or selector passed for selection');
			return $[ns];
		}
		_pages = _all();
		_page = typeof s === 'number' 
				? _pages.eq(s) 
					: s instanceof jQuery ? s : _pages.filter(s);
					
		//call with page as context			
		typeof callback === 'function' && callback.call(_page);			
		return $[ns];			
	};
	
	
	drop = function(s, callback){
		return find(s,function(){
			this.remove();
			typeof callback === 'function' && callback();
		});
	};
	
	//TODO you need a cb here!
	open = function(s){
		return find(s, _open);
	};
	
	back = function(cb){
		return _fb('back', cb);
	};
	
	forward = function(cb){
		return _fb('forward', cb);	
	};
	
	names = function(cb){
		var _names = [];
    _all().each(function(i){
			var data = $(this).data(ns) || {};
			_names.push(data.name || ns + " " + i);
		});
		return _names;
	};
			
	methods = {
		init : init, 
		repaint : repaint,
		add : add, 
		drop : drop, 
		find : find, 
		open : open, 
		expand : expand,
		back : back, 
		forward : forward, 
		names : names
	};
	
	
	//:pages(name)
	$.expr[':'][ns] = function(a, i, m){
		var pageData = $(a).data(ns) || {};
		return pageData.name === m[3];
	};

  $.fn.log = function(){
    console.log(this);
    return this;
  };
	
	//apply a x transform..
	$.fn.slide = function(x, css){
	  var styles;
	  
    styles = $.extend({
      "-webkit-transform" : "translate3d("+x+"px,0,0)",
			"-moz-transform" : "translate("+x+"px,0)",
    }, css || {})
    
	  return this.css(styles);
	}
	
	//reposition x tranform based on parent
  $.fn.updateX = function(){
    
    this.each(function(){
      var _this, pWidth;
      _this = $(this);
      pWidth = _this.parents(selector).eq(0).width();
      _this.slide(pWidth);
    });
    
    return this;
  }
	
  
	
	$[ns] = function( method ) {
		_content = _content === undefined ? $('#content') : _content;
	    if(methods[method]){
	      return methods[method].apply( _content, Array.prototype.slice.call( arguments, 1 ));
	    } 
		return $.error( 'Method ' +  method + ' does not exist on jQuery.' + ns );
	};
	
	window.addEventListener('popstate',function(e){
    var name = (e.state || {}).name || false;
    name && open(":"+ns+"('"+name+"')");
	})

}(window.jQuery);
!function(GLOBAL){
  var dom, $;
  
  dom = {};
  $ = GLOBAL.jQuery;

  //cache selectors
  function cache(){
    dom.body = $("body");
    dom.header = $("#header");
		dom.wrapper = dom.body.find("#wrapper");
    dom.menu = dom.wrapper.find('#menu');
		dom.content = dom.wrapper.find("#content");
		dom.history = dom.body.find('#history');
    dom.historyList = dom.history.next('#history-list');
		dom.win = $(window);
  }
  
  
  function pagesInit(){
    
    //start pages
		$.pages('init', {
		  time : dom.win.width() <= 320 ? 500 : 700
		});
		
		//export do
    $.pages.dom = dom;
    $.publish('pages.init');
  }
  
  
  function init(){
    cache();
    addEvents();
    pagesInit();
  }
  
  function addEvents(){
    
    dom.win.resize(function(){
      $.pages('repaint');
    })
    //ugly nav code
    $("#nav")
    .tap('a[data-page]',function(e){
      var dir = $(this).data('page');
      window.history[dir]();
    });
        
    dom.history.click(function(){
  		var html = "";
  		$.pages('names').forEach(function(name){
  			html += "<li><a href='#' data-page='"+name+"'>"+name+"</a></li>";
  		});
      dom.historyList.html(html);
  	});

    dom.historyList.delegate("a", "click", function(e){
  		var page = $(this).data('page');
  		$.pages('open', ":pages("+page+")");
  		e.stopPropagation();
  	});
      
    dom.menu
      .delegate("li", "click",function(e){
        var _this = $(this), dir, _sibs;
  				dir = _this.data('dir');
  				_sibs = _this.siblings().removeClass('highlighted').end().addClass('highlighted');
  				e.stopPropagation();
      });
      
    dom.content
    .tap('tr[data-page]',function(e){
      var _this, data;
      
      _this = $(this);
      data = _this.data();
      
      //add selection
      _this.addClass('selected').siblings().removeClass('selected');
      
      $.publish('pages.new', [data])
      e.stopPropagation();
    });
    
  }
  

  $(init);
  
}(window);
/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(a){a(function(){"use strict",a.support.transition=function(){var a=function(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},c;for(c in b)if(a.style[c]!==undefined)return b[c]}();return a&&{end:a}}()})}(window.jQuery),!function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function f(){e.trigger("closed").remove()}var c=a(this),d=c.attr("data-target"),e;d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),e=a(d),b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger(b=a.Event("close"));if(b.isDefaultPrevented())return;e.removeClass("in"),a.support.transition&&e.hasClass("fade")?e.on(a.support.transition.end,f):f()},a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("alert");e||d.data("alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a(function(){a("body").on("click.alert.data-api",b,c.prototype.close)})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.button.defaults,c)};b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.data(),e=c.is("input")?"val":"html";a+="Text",d.resetText||c.data("resetText",c[e]()),c[e](d[a]||this.options[a]),setTimeout(function(){a=="loadingText"?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.parent('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active"),this.$element.toggleClass("active")},a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("button"),f=typeof c=="object"&&c;e||d.data("button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.defaults={loadingText:"loading..."},a.fn.button.Constructor=b,a(function(){a("body").on("click.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=c,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.prototype={cycle:function(b){return b||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},to:function(b){var c=this.$element.find(".active"),d=c.parent().children(),e=d.index(c),f=this;if(b>d.length-1||b<0)return;return this.sliding?this.$element.one("slid",function(){f.to(b)}):e==b?this.pause().cycle():this.slide(b>e?"next":"prev",a(d[b]))},pause:function(a){return a||(this.paused=!0),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(b,c){var d=this.$element.find(".active"),e=c||d[b](),f=this.interval,g=b=="next"?"left":"right",h=b=="next"?"first":"last",i=this,j=a.Event("slide");this.sliding=!0,f&&this.pause(),e=e.length?e:this.$element.find(".item")[h]();if(e.hasClass("active"))return;if(a.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(j);if(j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),this.$element.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)})}else{this.$element.trigger(j);if(j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return f&&this.cycle(),this}},a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("carousel"),f=a.extend({},a.fn.carousel.defaults,typeof c=="object"&&c);e||d.data("carousel",e=new b(this,f)),typeof c=="number"?e.to(c):typeof c=="string"||(c=f.slide)?e[c]():f.interval&&e.cycle()})},a.fn.carousel.defaults={interval:5e3,pause:"hover"},a.fn.carousel.Constructor=b,a(function(){a("body").on("click.carousel.data-api","[data-slide]",function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=!e.data("modal")&&a.extend({},e.data(),c.data());e.carousel(f),b.preventDefault()})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.collapse.defaults,c),this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var a=this.$element.hasClass("width");return a?"width":"height"},show:function(){var b,c,d,e;if(this.transitioning)return;b=this.dimension(),c=a.camelCase(["scroll",b].join("-")),d=this.$parent&&this.$parent.find("> .accordion-group > .in");if(d&&d.length){e=d.data("collapse");if(e&&e.transitioning)return;d.collapse("hide"),e||d.data("collapse",null)}this.$element[b](0),this.transition("addClass",a.Event("show"),"shown"),this.$element[b](this.$element[0][c])},hide:function(){var b;if(this.transitioning)return;b=this.dimension(),this.reset(this.$element[b]()),this.transition("removeClass",a.Event("hide"),"hidden"),this.$element[b](0)},reset:function(a){var b=this.dimension();return this.$element.removeClass("collapse")[b](a||"auto")[0].offsetWidth,this.$element[a!==null?"addClass":"removeClass"]("collapse"),this},transition:function(b,c,d){var e=this,f=function(){c.type=="show"&&e.reset(),e.transitioning=0,e.$element.trigger(d)};this.$element.trigger(c);if(c.isDefaultPrevented())return;this.transitioning=1,this.$element[b]("in"),a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,f):f()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("collapse"),f=typeof c=="object"&&c;e||d.data("collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.defaults={toggle:!0},a.fn.collapse.Constructor=b,a(function(){a("body").on("click.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e).data("collapse")?"toggle":c.data();a(e).collapse(f)})})}(window.jQuery),!function(a){function d(){a(b).parent().removeClass("open")}"use strict";var b='[data-toggle="dropdown"]',c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),e,f,g;if(c.is(".disabled, :disabled"))return;return f=c.attr("data-target"),f||(f=c.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,"")),e=a(f),e.length||(e=c.parent()),g=e.hasClass("open"),d(),g||e.toggleClass("open"),!1}},a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a(function(){a("html").on("click.dropdown.data-api",d),a("body").on("click.dropdown",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown.data-api",b,c.prototype.toggle)})}(window.jQuery),!function(a){function c(){var b=this,c=setTimeout(function(){b.$element.off(a.support.transition.end),d.call(b)},500);this.$element.one(a.support.transition.end,function(){clearTimeout(c),d.call(b)})}function d(a){this.$element.hide().trigger("hidden"),e.call(this)}function e(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(a.proxy(this.hide,this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),e?this.$backdrop.one(a.support.transition.end,b):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,a.proxy(f,this)):f.call(this)):b&&b()}function f(){this.$backdrop.remove(),this.$backdrop=null}function g(){var b=this;this.isShown&&this.options.keyboard?a(document).on("keyup.dismiss.modal",function(a){a.which==27&&b.hide()}):this.isShown||a(document).off("keyup.dismiss.modal")}"use strict";var b=function(b,c){this.options=c,this.$element=a(b).delegate('[data-dismiss="modal"]',"click.dismiss.modal",a.proxy(this.hide,this))};b.prototype={constructor:b,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var b=this,c=a.Event("show");this.$element.trigger(c);if(this.isShown||c.isDefaultPrevented())return;a("body").addClass("modal-open"),this.isShown=!0,g.call(this),e.call(this,function(){var c=a.support.transition&&b.$element.hasClass("fade");b.$element.parent().length||b.$element.appendTo(document.body),b.$element.show(),c&&b.$element[0].offsetWidth,b.$element.addClass("in"),c?b.$element.one(a.support.transition.end,function(){b.$element.trigger("shown")}):b.$element.trigger("shown")})},hide:function(b){b&&b.preventDefault();var e=this;b=a.Event("hide"),this.$element.trigger(b);if(!this.isShown||b.isDefaultPrevented())return;this.isShown=!1,a("body").removeClass("modal-open"),g.call(this),this.$element.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?c.call(this):d.call(this)}},a.fn.modal=function(c){return this.each(function(){var d=a(this),e=d.data("modal"),f=a.extend({},a.fn.modal.defaults,d.data(),typeof c=="object"&&c);e||d.data("modal",e=new b(this,f)),typeof c=="string"?e[c]():f.show&&e.show()})},a.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},a.fn.modal.Constructor=b,a(function(){a("body").on("click.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({},e.data(),c.data());b.preventDefault(),e.modal(f)})})}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("tooltip",a,b)};b.prototype={constructor:b,init:function(b,c,d){var e,f;this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.enabled=!0,this.options.trigger!="manual"&&(e=this.options.trigger=="hover"?"mouseenter":"focus",f=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(e,this.options.selector,a.proxy(this.enter,this)),this.$element.on(f,this.options.selector,a.proxy(this.leave,this))),this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(b){return b=a.extend({},a.fn[this.type].defaults,b,this.$element.data()),b.delay&&typeof b.delay=="number"&&(b.delay={show:b.delay,hide:b.delay}),b},enter:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.show)return c.show();clearTimeout(this.timeout),c.hoverState="in",this.timeout=setTimeout(function(){c.hoverState=="in"&&c.show()},c.options.delay.show)},leave:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.hide)return c.hide();clearTimeout(this.timeout),c.hoverState="out",this.timeout=setTimeout(function(){c.hoverState=="out"&&c.hide()},c.options.delay.hide)},show:function(){var a,b,c,d,e,f,g;if(this.hasContent()&&this.enabled){a=this.tip(),this.setContent(),this.options.animation&&a.addClass("fade"),f=typeof this.options.placement=="function"?this.options.placement.call(this,a[0],this.$element[0]):this.options.placement,b=/in/.test(f),a.remove().css({top:0,left:0,display:"block"}).appendTo(b?this.$element:document.body),c=this.getPosition(b),d=a[0].offsetWidth,e=a[0].offsetHeight;switch(b?f.split(" ")[1]:f){case"bottom":g={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"top":g={top:c.top-e,left:c.left+c.width/2-d/2};break;case"left":g={top:c.top+c.height/2-e/2,left:c.left-d};break;case"right":g={top:c.top+c.height/2-e/2,left:c.left+c.width}}a.css(g).addClass(f).addClass("in")}},isHTML:function(a){return typeof a!="string"||a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(a)},setContent:function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.isHTML(b)?"html":"text"](b),a.removeClass("fade in top bottom left right")},hide:function(){function d(){var b=setTimeout(function(){c.off(a.support.transition.end).remove()},500);c.one(a.support.transition.end,function(){clearTimeout(b),c.remove()})}var b=this,c=this.tip();c.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d():c.remove()},fixTitle:function(){var a=this.$element;(a.attr("title")||typeof a.attr("data-original-title")!="string")&&a.attr("data-original-title",a.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(b){return a.extend({},b?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||(typeof c.title=="function"?c.title.call(b[0]):c.title),a},tip:function(){return this.$tip=this.$tip||a(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}},a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("tooltip"),f=typeof c=="object"&&c;e||d.data("tooltip",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype,{constructor:b,setContent:function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.isHTML(b)?"html":"text"](b),a.find(".popover-content > *")[this.isHTML(c)?"html":"text"](c),a.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-content")||(typeof c.content=="function"?c.content.call(b[0]):c.content),a},tip:function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip}}),a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("popover"),f=typeof c=="object"&&c;e||d.data("popover",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.defaults=a.extend({},a.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(a){function b(b,c){var d=a.proxy(this.process,this),e=a(b).is("body")?a(window):a(b),f;this.options=a.extend({},a.fn.scrollspy.defaults,c),this.$scrollElement=e.on("scroll.scroll.data-api",d),this.selector=(this.options.target||(f=a(b).attr("href"))&&f.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=a("body").on("click.scroll.data-api",this.selector,d),this.refresh(),this.process()}"use strict",b.prototype={constructor:b,refresh:function(){var b=this,c;this.offsets=a([]),this.targets=a([]),c=this.$body.find(this.selector).map(function(){var b=a(this),c=b.data("target")||b.attr("href"),d=/^#\w/.test(c)&&a(c);return d&&c.length&&[[d.position().top,c]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},process:function(){var a=this.$scrollElement.scrollTop()+this.options.offset,b=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,c=b-this.$scrollElement.height(),d=this.offsets,e=this.targets,f=this.activeTarget,g;if(a>=c)return f!=(g=e.last()[0])&&this.activate(g);for(g=d.length;g--;)f!=e[g]&&a>=d[g]&&(!d[g+1]||a<=d[g+1])&&this.activate(e[g])},activate:function(b){var c,d;this.activeTarget=b,a(this.selector).parent(".active").removeClass("active"),d=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',c=a(d).parent("li").addClass("active"),c.parent(".dropdown-menu")&&(c=c.closest("li.dropdown").addClass("active")),c.trigger("activate")}},a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("scrollspy"),f=typeof c=="object"&&c;e||d.data("scrollspy",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.defaults={offset:10},a(function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),!function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype={constructor:b,show:function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target"),e,f,g;d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));if(b.parent("li").hasClass("active"))return;e=c.find(".active a").last()[0],g=a.Event("show",{relatedTarget:e}),b.trigger(g);if(g.isDefaultPrevented())return;f=a(d),this.activate(b.parent("li"),c),this.activate(f,f.parent(),function(){b.trigger({type:"shown",relatedTarget:e})})},activate:function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),f?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g):g(),e.removeClass("in")}},a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("tab");e||d.data("tab",e=new b(this)),typeof c=="string"&&e[c]()})},a.fn.tab.Constructor=b,a(function(){a("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.typeahead.defaults,c),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=a(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};b.prototype={constructor:b,select:function(){var a=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(a)).change(),this.hide()},updater:function(a){return a},show:function(){var b=a.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:b.top+b.height,left:b.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(b){var c=this,d,e;return this.query=this.$element.val(),this.query?(d=a.grep(this.source,function(a){return c.matcher(a)}),d=this.sorter(d),d.length?this.render(d.slice(0,this.options.items)).show():this.shown?this.hide():this):this.shown?this.hide():this},matcher:function(a){return~a.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(a){var b=[],c=[],d=[],e;while(e=a.shift())e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?c.push(e):d.push(e):b.push(e);return b.concat(c,d)},highlighter:function(a){var b=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return a.replace(new RegExp("("+b+")","ig"),function(a,b){return"<strong>"+b+"</strong>"})},render:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).attr("data-value",d),b.find("a").html(c.highlighter(d)),b[0]}),b.first().addClass("active"),this.$menu.html(b),this},next:function(b){var c=this.$menu.find(".active").removeClass("active"),d=c.next();d.length||(d=a(this.$menu.find("li")[0])),d.addClass("active")},prev:function(a){var b=this.$menu.find(".active").removeClass("active"),c=b.prev();c.length||(c=this.$menu.find("li").last()),c.addClass("active")},listen:function(){this.$element.on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this)),(a.browser.webkit||a.browser.msie)&&this.$element.on("keydown",a.proxy(this.keypress,this)),this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this))},keyup:function(a){switch(a.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}a.stopPropagation(),a.preventDefault()},keypress:function(a){if(!this.shown)return;switch(a.keyCode){case 9:case 13:case 27:a.preventDefault();break;case 38:if(a.type!="keydown")break;a.preventDefault(),this.prev();break;case 40:if(a.type!="keydown")break;a.preventDefault(),this.next()}a.stopPropagation()},blur:function(a){var b=this;setTimeout(function(){b.hide()},150)},click:function(a){a.stopPropagation(),a.preventDefault(),this.select()},mouseenter:function(b){this.$menu.find(".active").removeClass("active"),a(b.currentTarget).addClass("active")}},a.fn.typeahead=function(c){return this.each(function(){var d=a(this),e=d.data("typeahead"),f=typeof c=="object"&&c;e||d.data("typeahead",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>'},a.fn.typeahead.Constructor=b,a(function(){a("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(b){var c=a(this);if(c.data("typeahead"))return;b.preventDefault(),c.typeahead(c.data())})})}(window.jQuery);