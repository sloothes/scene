
//  localPlayerHandler.js (v3)
//  Use signals.js with AW3D v0.3.5 and above.

//  Also see material "depthFunc" property:

    //  "material.depthFunc" defines which depth function the material uses 
    //  to compare incoming pixels Z-depth against the current Z-depth buffer value. 
    //  If the result of the comparison is true, the pixel will be drawn.

    //  Default is LessEqualDepth [3].

//  Depth mode constants for all possible values are:

    //  [0] NeverDepth will never return true.
    //  [1] AlwaysDepth will always return true.
    //  [2] LessDepth will return true if the incoming pixel Z-depth is less than the current buffer Z-depth.
    //  [3] LessEqualDepth is the default and will return true if the incoming pixel Z-depth is less than or equal to the current buffer Z-depth.
    //  [4] Undefined: Propably never returns true ( equal to [0] NeverDepth ).
    //  [5] GreaterEqualDepth will return true if the incoming pixel Z-depth is greater than or equal to the current buffer Z-depth.
    //  [6] GreaterDepth will return true if the incoming pixel Z-depth is greater than the current buffer Z-depth.
    //  [7] NotEqualDepth will return true if the incoming pixel Z-depth is not equal to the current buffer Z-depth.


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
                    //  debugMode && console.log(`outfit removed.`);

                        localPlayer.outfit.setGender(gender);
                    //  debugMode && console.log(`gender changed to ${gender}` );

                    //  Order of children in localPlayer.outfit.direction.children array DOES MATTER.
                    //  OutfitManager.add() must take care for localPlayer.oufit.direction.children order.

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


            //  OUTFIT.


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

                        break; // important!

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

                        break; // important!

                    }

                break;

                case "/outfit/hairs":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.hairs ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("hairs");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add({"hairs":window[gender].hairs});

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    }

                break;

                case "/outfit/stockings":

                    if ( localPlayer.outfit.getGender("female") ) {

                        if ( localPlayer.outfit.stockings ) {

                            (function(){

                                localPlayer.outfit.direction.visible = false;
                                $(localPlayer.outfit).one("change", function(){
                                    setTimeout(function(){
                                        localPlayer.outfit.direction.visible = true;
                                    }, 250);
                                });

                                localPlayer.outfit.remove("stockings");

                                localPlayer.outfit.direction.children.forEach(function(item){
                                    item.material.needsUpdate = true;
                                });

                            })();

                        } else {

                            (function(){

                                localPlayer.outfit.direction.visible = false;
                                $(localPlayer.outfit).one("change", function(){
                                    setTimeout(function(){
                                        localPlayer.outfit.direction.visible = true;
                                    }, 250);
                                });

                                localPlayer.outfit.add({"stockings":female.stockings});

                                localPlayer.outfit.direction.children.forEach(function(item){
                                    item.material.needsUpdate = true;
                                });

                            })();

                        }

                    }

                break;

                case "/outfit/underwears":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.underwears ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("underwears");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add(
                                {"underwears":window[gender].underwears}
                            );

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    }

                break;


                case "/outfit/dress":

                    if ( localPlayer.outfit.getGender("female") ) {

                        localPlayer.outfit.remove("costume");
                        localPlayer.outfit.remove("trousers");

                        if ( localPlayer.outfit.dress ) {

                            (function(){

                                localPlayer.outfit.direction.visible = false;
                                $(localPlayer.outfit).one("change", function(){
                                    setTimeout(function(){
                                        localPlayer.outfit.direction.visible = true;
                                    }, 250);
                                });

                                localPlayer.outfit.remove("dress");

                                localPlayer.outfit.direction.children.forEach(function(item){
                                    item.material.needsUpdate = true;
                                });

                            })();

                        } else {

                            (function(){

                                localPlayer.outfit.direction.visible = false;
                                $(localPlayer.outfit).one("change", function(){
                                    setTimeout(function(){
                                        localPlayer.outfit.direction.visible = true;
                                    }, 250);
                                });

                            //  Female "dress" uses "localPlayer.outfit.dress" slot.
                                localPlayer.outfit.add({"dress":female.dress});

                                localPlayer.outfit.direction.children.forEach(function(item){
                                    item.material.needsUpdate = true;
                                });

                            })();

                        }

                    }

                break;

                case "/outfit/costume":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender == "female" ) {
                        localPlayer.outfit.remove("dress");
                    }


                    if ( localPlayer.outfit.costume ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("costume");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add({"costume":window[gender].costume});

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    }


                break;

                case "/outfit/tshirt":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.tshirt ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("tshirt");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add({"tshirt":window[gender].tshirt});

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();
                    }

                break;

                case "/outfit/trousers":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender == "female" ) {
                        localPlayer.outfit.remove("dress");
                    }

                    if ( localPlayer.outfit.trousers ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("trousers");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add({"trousers":window[gender].trousers});

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    }

                break;

                case "/outfit/shoes":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.shoes ) {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.remove("shoes");

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    } else {

                        (function(){

                            localPlayer.outfit.direction.visible = false;
                            $(localPlayer.outfit).one("change", function(){
                                setTimeout(function(){
                                    localPlayer.outfit.direction.visible = true;
                                }, 250);
                            });

                            localPlayer.outfit.add({"shoes":window[gender].shoes});

                            localPlayer.outfit.direction.children.forEach(function(item){
                                item.material.needsUpdate = true;
                            });

                        })();

                    }

                break;

            }

        }

        return localPlayer.outfit.toJSON();

    }


    /*
        function updatetoIdling(){
        //  After "...outfit.add({object}), 
        //  always action "idle" triggers.
            localPlayer.controller.isIdling  = true;
            localPlayer.controller.isRunning = false;
            localPlayer.controller.isWalking = false;
            localPlayer.controller.movementSpeed = 0;
        }
    */

