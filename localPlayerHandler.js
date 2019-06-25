//  localPlayerHandler.js (v3.1)

    function localPlayerHandler(){
    //  Returns: localPlayer.outfit.toJSON();
    //  debugMode && console.log( arguments );

        function startIdling(){
            localPlayer.outfit.AnimationsHandler.stop();
            localPlayer.controller.isIdling  = true;
            localPlayer.controller.isRunning = false;
            localPlayer.controller.isWalking = false;
            localPlayer.controller.movementSpeed = 0;
            localPlayer.outfit.AnimationsHandler.play("idle");
            localPlayer.controller.dispatchEvent({type:"startIdling"});
        }

        function startWalking(){
            localPlayer.outfit.AnimationsHandler.stop();
            localPlayer.controller.isIdling  = false;
            localPlayer.controller.isRunning = true;
            localPlayer.controller.isWalking = true;
            localPlayer.controller.movementSpeed = 28;
            localPlayer.outfit.AnimationsHandler.play("walk");
            // "startRunning" event dispatches from "MWtps.js"!
        }

        function startRunning(){
            localPlayer.outfit.AnimationsHandler.stop();
            localPlayer.controller.isIdling  = false;
            localPlayer.controller.isRunning = true;
            localPlayer.controller.isWalking = false;
            localPlayer.controller.movementSpeed = 45;
            localPlayer.outfit.AnimationsHandler.play("run");
            // "startRunning" event dispatches from "MWtps.js"!
        }

        for (var arg in arguments){

            var data = arguments[arg];

            switch (data) {

            //  ACTIONS.

                case "/action/idle":

                    if ( localPlayer.controller.isIdling ) break;
                    if ( localPlayer.controller.isJumping ) break;
                    if ( localPlayer.controller.isOnSlope ) break;
                    if ( !localPlayer.controller.isGrounded ) break;

                    startIdling();

                break;


                case "/action/walk":

                    if ( localPlayer.controller.isJumping ) break;
                    if ( localPlayer.controller.isOnSlope ) break;
                    if ( !localPlayer.controller.isGrounded ) break;

                    startWalking();

                break;


                case "/action/run":

                    if ( localPlayer.controller.isJumping ) break;
                    if ( localPlayer.controller.isOnSlope ) break;
                    if ( !localPlayer.controller.isGrounded ) break;

                    startRunning();

                break;


                case "/action/jump":

                    if ( localPlayer.controller.isJumping ) break;
                    if ( localPlayer.controller.isOnSlope ) break;
                    if ( !localPlayer.controller.isGrounded ) break;

                    localPlayer.controller.jump();
                    localPlayer.outfit.AnimationsHandler.jump();

                break;


            //  CONTROLS.

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

            //  GENDER.

                case "/gender/male":
                case "/gender/female":

                    var gender = data.split("/").pop();
                    debugMode && console.log(`set gender to ${gender}`);
                    debugMode && console.log("gender match:", localPlayer.outfit.getGender(gender));

                    if ( localPlayer.outfit.getGender(gender) ) break;

                    (async function(){

                        localPlayer.outfit.direction.visible = false;
                        $(localPlayer.outfit).one("change", function(){
                            setTimeout(function(){
                                localPlayer.outfit.direction.visible = true;
                            }, 250);
                        });

                        localPlayer.outfit.removeAll();

                        localPlayer.outfit.setGender(gender);

                        localPlayer.outfit.add(
                            {"body": window[gender].body},
                            {"eyes": window[gender].eyes},
                            {"hairs":window[gender].hairs},
                            {"underwears":window[gender].underwears},
                            {"shoes":window[gender].shoes},
                        );

                        localPlayer.outfit.direction.children.forEach(function(item){
                            item.material.needsUpdate = true;
                        });

                    })();

                break;

                case "/outfit/body":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.body ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.removeAll(); // important!

                        //  Skeleton uses ".outfit.skeleton" slot.
                            localPlayer.outfit.add( {"skeleton": skeleton} );

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                        break;

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.removeAll(); // important!

                            localPlayer.outfit.add(
                                {"body": window[gender].body},
                                {"eyes": window[gender].eyes},
                                {"hairs":window[gender].hairs},
                                {"underwears":window[gender].underwears},
                                {"shoes":window[gender].shoes},
                            );

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                        break;

                    }

                break;































