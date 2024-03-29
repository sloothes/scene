//  runtime.js

    var $renders = $("input[type=hidden].render");
    var $updates = $("input[type=hidden].update");

    var clock = new THREE.Clock();

    function animate(){

        windowAnimationFrameRequestID = requestAnimationFrame( animate );

        for (var i = 0; i < $renders.length; i++){
            $renders[i].render();
        }

    }

    function updates(){

        windowAnimationFrameRequestID = requestAnimationFrame( updates );
        
        var dt = clock.getDelta();
        var time = clock.getElapsedTime();

        for ( var i = 0; i < $updates.length; i++ ){
            $updates[i].update( dt );
        }

    }

//  Settings.

    keyInputControls.On();

    if (isMobile) {
        cameraControls.radius = 15;
        cameraControls.offset.y = 19;
    }

//  Runtime.

    updates();
    animate();

