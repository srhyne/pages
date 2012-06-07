module.exports = function(grunt){
  var _defaults, _sans;
  
  _defaults = [
   'modernizr.min.js', 
   'tiny-pubsub.js', 
   'tmpl.js', 
   'jquery.gestures.js',
   'animate.min.js', 
   'pages.js', 
   'ui.js'
  ];
  
  _defaults = _defaults.map(function(file){
    return 'js/lib/default/'+file;
  })
  
  //not in default dir
  _defaults.push('bootstrap/js/bootstrap.min.js');
  

  _sans = ['jquery.hotkeys.js', 'hotkeys.js'].map(function(file){ 
    return "js/lib/sans_touch/"+file; 
  });
  
  
 
 grunt.initConfig({
   min : {
     
     _default : {
       src : _defaults, 
       dest : 'js/min/default.min.js'
     }, 
     
     _sans : {
       src : _sans, 
       dest : 'js/min/sans_touch.min.js'
     }, 
     
     _touches : {
       src : ['js/lib/touch/iscroll.js'], 
       dest : 'js/min/touch.min.js'
     }
     
   }
 });
 
 grunt.registerTask('default', 'min:_default min:_sans min:_touches');
 
 		
 		
}