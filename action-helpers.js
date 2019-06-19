    function mod( a, n ) { return ( a % n + n ) % n;  } // important!

    function degIntDirection(){
        return parseInt( THREE.Math.radToDeg( localPlayer.controller.direction ) ) % 360;
    }

    function getDeltaAngle( current, target ) {
        var a = mod( ( current - target ), 2 * Math.PI );
        var b = mod( ( target - current ), 2 * Math.PI );
        return a < b ? -a : b;
    }

    function updateDirectionControls(deg){

        try {

        //  Update control tab direction controls.
        //  "directionOutput" and "directionSlider" 
        //  has been parsed by control-tab.

            directionOutput.value = mod(deg, 360);
            directionSlider.value = mod(deg, 360);

        } 

        catch(err){;}

    }

    function turnTo( rad, immediate ){

        var deltaAngle = getDeltaAngle( localPlayer.controller.direction, rad );

        return function turn(){
            windowAnimationFrameRequestID = requestAnimationFrame( turn );

            if ( isNaN( deltaAngle ) ) {
                cancelAnimationFrame( windowAnimationFrameRequestID );
                localPlayer.outfit.update(); return;
            }

            if ( immediate ) {
                localPlayer.controller.direction += deltaAngle;
                cancelAnimationFrame( windowAnimationFrameRequestID );
                localPlayer.outfit.update(); return;
            }

            if ( Math.abs( deltaAngle ) < 0.000017453292519943296  ) {
                cancelAnimationFrame( windowAnimationFrameRequestID );
                updateDirectionControls( round( THREE.Math.radToDeg(localPlayer.controller.direction), 0 ) ); // deg.
                localPlayer.outfit.update(); return;
            }

            localPlayer.controller.direction = mod( localPlayer.controller.direction += ( deltaAngle *= 0.5 ), 2 * Math.PI );
            updateDirectionControls( round( THREE.Math.radToDeg(localPlayer.controller.direction), 0 ) ); // deg.

        }

    }

