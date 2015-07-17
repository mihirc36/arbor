//
// simple.js
// Creates a simple graph using arbor.js
//
(function(){
  
  trace = arbor.etc.trace
  objmerge = arbor.etc.objmerge
  objcopy = arbor.etc.objcopy
  var parse = Parseur().parse

  var Simple = function(elt){
    var dom = $(elt)

    sys = arbor.ParticleSystem(2600, 512, 0.5)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
    sys.screenPadding(20)
    
    var _canvas = dom.find('#viewport').get(0)
    var _grabber = dom.find('#grabber')
    
    var _updateTimeout = null
    var _current = null // will be the id of the doc if it's been saved before
    var _editing = false // whether to undim the Save menu and prevent navigating away
    var _failures = null
    var _lorem = "; some example nodes\nhello {color:red, label:HELLO}\nworld {color:orange}\n\n; some edges\nhello -> world {color:yellow}\nfoo -> bar {weight:5}\nbar -> baz {weight:2}"
        
    var that = {
      
      init:function(){
        
        $(window).resize(that.resize)
        that.resize()
        that.updateLayout(Math.max(1, $(window).width()))
        return that
      },
      
      resize:function(){        
        var w = $(window).width() - 40
        var x = w
        that.updateLayout(x)
        sys.renderer.redraw()
      },
      
      updateGraph:function(e){
        var network = parse(_lorem)
        $.each(network.nodes, function(nname, ndata){
          if (ndata.label===undefined) ndata.label = nname
        })
        sys.merge(network)
        _updateTimeout = null
      },
      
      updateLayout:function(split){
        var w = dom.width()
        var h = _grabber.height()
        var split = split || _grabber.offset().left
        var splitW = _grabber.width()
        _grabber.css('left',split)

        var canvW = split - splitW
        var canvH = h
        _canvas.width = canvW
        _canvas.height = canvH
        sys.screenSize(canvW, canvH)
      },
      
      grabbed:function(e){
        $(window).bind('mousemove', that.dragged)
        $(window).bind('mouseup', that.released)
        return false
      },
      
      dragged:function(e){
        var w = dom.width()
        that.updateLayout(Math.max(10, Math.min(e.pageX-10, w)) )
        sys.renderer.redraw()
        return false
      },
      
      released:function(e){
        $(window).unbind('mousemove', that.dragged)
        return false
      },
      
      typing:function(e){
        var c = e.keyCode
        if ($.inArray(c, [37, 38, 39, 40, 16])>=0){
          return
        }
        
        if (!_editing){
          $.address.value("")
        }
        _editing = true
        
        if (_updateTimeout) clearTimeout(_updateTimeout)
        _updateTimeout = setTimeout(that.updateGraph, 900)
      }
    }
    
    return that.init()    
  }


  $(document).ready(function(){
    var mcp = Simple("#simple")    
  })

  
})()
