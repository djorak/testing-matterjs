(function() {
    var Bodies = Matter.Bodies,
        Body = Matter.Body,
        Common = Matter.Common,
        Composites = Matter.Composites,
        Engine = Matter.Engine,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        World = Matter.World;

    var _engine,
        _gui,
        _mouseConstraint,
        _sceneEvents = [],
        _canvas;

    var _keyboardMap = {
        32: 'SPACE',
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };

    var Test = {};

    Test.init = function() {
        _canvas = document.querySelector('.canvas');
        _engine = Engine.create(_canvas);

        // run the engine
        Engine.run(_engine);

        var renderOptions = _engine.render.options,
            canvas = _engine.render.canvas;

        renderOptions.wireframes = false;

        canvas.width = renderOptions.width = 960;
        canvas.height = renderOptions.height = 600;


        document.querySelector('.reset-button').addEventListener('click', function(e) {
            Test.car();
        });

        Test.car();
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

    Test.car = function() {
        var _world = _engine.world;

        Test.reset();

        var scale = .5;
        var car = Composites.car(150, 500, 150 * scale, 60 * scale, 45 * scale);
        World.add(_world, car);

        var renderOptions = _engine.render.options;
        renderOptions.showAngleIndicator = true;

        document.onkeydown = function(e) {
            e = e || window.event;

            var carBody = car.bodies[0],
                forceMagnitude = 0.04 * carBody.mass,
                force = { x: 0, y: 0 };

            switch(_keyboardMap[e.keyCode]) {
                case 'UP':
                case 'RIGHT':
                    force.x = forceMagnitude;
                    break;
                case 'DOWN':
                case 'LEFT':
                    force.x = -forceMagnitude;
                    break;
            }

            Body.applyForce(carBody, { x: 0, y: 0 }, force);
        };
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

        var offset = -10,
            canvas = _engine.render.canvas;

        var ground = Bodies.rectangle(canvas.width / 2, canvas.height + offset, canvas.width, 50, { isStatic: true }),
           ceiling = Bodies.rectangle(canvas.width / 2, -offset, canvas.width, 50, { isStatic: true }),
          leftWall = Bodies.rectangle(-offset, canvas.height / 2, 50, canvas.height, { isStatic: true }),
         rightWall = Bodies.rectangle(canvas.width + offset, canvas.height / 2, 50, canvas.height, { isStatic: true });

        // add the limits to the world
        World.add(_engine.world, [
            ground,
            //ceiling,
            //leftWall,
            //rightWall
        ]);

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_world, _mouseConstraint);
    };
})();
