    function localPlayerHandler(data){

        switch (data) {

            case "/gender/male":
            case "/gender/female":
                
                var gender = data.split("/").pop();
                debugMode && console.log(`set gender to ${gender}`);
                debugMode && console.log("gender match:", localPlayer.outfit.getGender(gender));
                if ( localPlayer.outfit.getGender(gender) ) return;

                localPlayer.outfit.AnimationsHandler.stop();
                localPlayer.controller.isRunning = false;
                localPlayer.controller.isWalking = false;
                localPlayer.controller.isIdling  = true;
                localPlayer.controller.movementSpeed = 0;

                localPlayer.outfit.setGender(gender);
                debugMode && console.log(`gender changed to ${localPlayer.outfit.getGender()}` );

                localPlayer.outfit.removeAll();
                debugMode && console.log(`outfit removed.`);

                localPlayer.outfit.add(
                    {"body": window[gender].body},
                    {"eyes": window[gender].eyes},
                    {"hairs":window[gender].hairs}

                );
                debugMode && console.log(`body added.`);

            break;


            case "/action/idle":

                if ( localPlayer.controller.isIdling ) return;
                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                localPlayer.outfit.AnimationsHandler.stop();
                localPlayer.controller.isRunning = false;
                localPlayer.controller.isWalking = false;
                localPlayer.controller.isIdling  = true;
                localPlayer.controller.movementSpeed = 0;
                localPlayer.outfit.AnimationsHandler.play("idle");
                localPlayer.controller.dispatchEvent({type:"startIdling"});

            break;


            case "/action/walk":

                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                localPlayer.outfit.AnimationsHandler.stop();
                localPlayer.controller.isRunning = true;
                localPlayer.controller.isWalking = true;

                localPlayer.controller.movementSpeed = 28;
                localPlayer.outfit.AnimationsHandler.play("walk");

            break;


            case "/action/run":

                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                localPlayer.outfit.AnimationsHandler.stop();
                localPlayer.controller.isRunning = true;
                localPlayer.controller.isWalking = false;

                localPlayer.controller.movementSpeed = 45;
                localPlayer.outfit.AnimationsHandler.play("run");

            break;


            case "/action/jump":

                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                localPlayer.controller.jump();
                localPlayer.outfit.AnimationsHandler.jump();

            break;


            case "/turn/front":
                var frontAngle = Math.PI - cameraControls.getFrontAngle();
                turnTo( frontAngle + Math.PI )();
            break;
            case "/turn/back":
                var frontAngle = Math.PI - cameraControls.getFrontAngle();
                turnTo( frontAngle )();
            break;
            case "/turn/left":
                var frontAngle = Math.PI - cameraControls.getFrontAngle();
                turnTo( frontAngle - Math.PI/2 )();
            break;
            case "/turn/right":
                var frontAngle = Math.PI - cameraControls.getFrontAngle();
                turnTo( frontAngle + Math.PI/2 )();
            break;

        }

        return;
    }
