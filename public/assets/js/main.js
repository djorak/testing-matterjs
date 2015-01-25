(function() {
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Composites = Matter.Composites
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

    var _engine,
        _gui,
        _mouseConstraint,
        _sceneEvents = [],
        _canvas;

    var Test = {};

    Test.init = function() {
        _canvas = document.querySelector('.canvas');
        _engine = Engine.create(_canvas);

        // run the engine
        Engine.run(_engine);

        document.querySelector('.reset-button').addEventListener('click', function(e) {
            Test.pyramid();
        });

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

        Test.reset();

        var stack = Composites.pyramid(100, 100, 15, 10, 0, 0, function(x, y, column, row) {
            return Bodies.circle(x, y, 20);
        });

        World.add(_world, stack);

        var renderOptions = _engine.render.options;
    };

    Test.reset = function() {
        var _world = _engine.world;

        World.clear(_world);
        Engine.clear(_engine);

        // clear all scene events
        for (var i = 0; i < _sceneEvents.length; i++)
            Events.off(_engine, _sceneEvents[i]);
        _sceneEvents = [];

        // reset mouse offset and scale (only required for Demo.views)
        Mouse.setScale(_engine.input.mouse, { x: 1, y: 1 });
        Mouse.setOffset(_engine.input.mouse, { x: 0, y: 0 });

        _engine.enableSleeping = false;
        _engine.world.gravity.y = 1;
        _engine.world.gravity.x = 0;
        _engine.timing.timeScale = 1;

        var offset = 25;
        var ground = Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
           ceiling = Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
          leftWall = Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
         rightWall = Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true });

        // add the limits to the world
        World.add(_engine.world, [
            ground,
            ceiling,
            leftWall,
            rightWall
        ]);

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_world, _mouseConstraint);
    };
})();
