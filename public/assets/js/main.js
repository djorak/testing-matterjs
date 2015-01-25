(function() {
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Composites = Matter.Composites
        MouseConstraint = Matter.MouseConstraint;
    
    var _engine,
        _mouseConstraint,
        _sceneEvents = [];

    var Test = {};

    Test.init = function() {
    	_engine = Engine.create(document.body);

    	var offset = 25;
        var ground = Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
           ceiling = Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
          leftWall = Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
         rightWall = Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true });

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_engine.world, _mouseConstraint);

        // add all of the bodies to the world
        World.add(_engine.world, [ground, ceiling, leftWall, rightWall]);

        // run the engine
        Engine.run(_engine);

        Test.pyramid();
    };

    // call init when the page has loaded fully
    if (window.addEventListener) {
        window.addEventListener('load', Test.init);
    } else if (window.attachEvent) {
        window.attachEvent('load', Test.init);
    }

    Test.pyramid = function() {
        var _world = _engine.world;
        
        var stack = Composites.pyramid(100, 100, 15, 10, 0, 0, function(x, y, column, row) {
            return Bodies.circle(x, y, 20);
        });
        
        World.add(_world, stack);
        
        var renderOptions = _engine.render.options;
    };
})();
