module.exports = function(grunt){

  var _defaults, _sans;

  _defaults = [
  // 'jquery.event.fastfix.js',
   'mobile-detect.min.js',
   'modernizr.min.js',
   'modernizr.helpers.js',
   'tiny-pubsub.js',
   'tmpl.js',
   'jquery.gestures.js',
   'jquery.animate.js',
   'pages.js',
   'ui.js',
   'iscroll.js'
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

   concat : {

     "default" : {
       src : _defaults,
       dest : 'js/test/default.js'
     }
   },

   uglify : {

     options: {
        mangle : true,
        compress : true,
        // the banner is inserted at the top of the output
        banner: '/*! pages <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },

     "default" : {

      files : {
        'js/min/default.min.js' : ['<%= concat.default.dest %>']
      }

     },

     sans : {

       files : {
        'js/min/sans_touch.min.js' : _sans
       }
     }

   }//END OF UGLIFY
 });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', [
    'concat:default', 'uglify:default', 'uglify:sans'
  ]);



}