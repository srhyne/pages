//note! this version is updated by Stephen Rhyne
//It's been modified in a few ways
// - the string operations have been moved to a function
// - ___ is being used instead of \t because \t gets replaced into a tab literal
// that caused problems in uglify and jsmin
(function(){
  var cache = {};

  var comp = function(str){
    return str.replace(/[\r\t\n]/g, " ")
          .split("<%").join("___")
          .replace(/((^|%>)[^___]*)'/g, "$1\r")
          .replace(/___=(.*?)%>/g, "',$1,'")
          .split("___").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
  };

  this.tmpl = function tmpl(str, data){
    var fn;

    fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) : ( new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+comp(str)+"');}return p.join('');") );
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

})();