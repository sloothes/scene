function localPlayerHandler(){

    function updatetoIdling(){
        localPlayer.controller.isIdling  = true;
        localPlayer.controller.isRunning = false;
        localPlayer.controller.isWalking = false;
        localPlayer.controller.movementSpeed = 0;
    }

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
    }

    function startRunning(){
        localPlayer.outfit.AnimationsHandler.stop();
        localPlayer.controller.isIdling  = false;
        localPlayer.controller.isRunning = true;
        localPlayer.controller.isWalking = false;
        localPlayer.controller.movementSpeed = 45;
        localPlayer.outfit.AnimationsHandler.play("run");
    }

    for (var arg in arguments){

        var data = arguments[arg];

        switch (data) {

            case "/gender/male":
            case "/gender/female":
                
                var gender = data.split("/").pop();

                if ( localPlayer.outfit.getGender(gender) ) return;

                localPlayer.outfit.setGender(gender);
                localPlayer.outfit.removeAll();
                localPlayer.outfit.add(
                    {"body":    window[gender].body},
                    {"eyes":    window[gender].eyes},
                    {"hairs":   window[gender].hairs},
                    {"shoes":   window[gender].shoes}
                    {"underwears": window[gender].underwears},
                );

                localPlayer.outfit.body.material.needsUpdate = true;
                localPlayer.outfit.eyes.material.needsUpdate = true;
                localPlayer.outfit.hairs.material.needsUpdate = true;
                localPlayer.outfit.hairs.material.needsUpdate = true;
                localPlayer.outfit.shoes.material.needsUpdate = true;
                localPlayer.outfit.underwears.material.needsUpdate = true;

                updatetoIdling();  //  important!

            break;


            case "/action/idle":

                if ( localPlayer.controller.isIdling ) return;
                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                startIdling();

            break;


            case "/action/walk":

                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                startWalking();

            break;


            case "/action/run":

                if ( localPlayer.controller.isJumping ) return;
                if ( localPlayer.controller.isOnSlope ) return;
                if ( !localPlayer.controller.isGrounded ) return;

                startRunning();

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


            case "/outfit/hairs":
                var gender = localPlayer.outfit.getGender();

                if ( localPlayer.outfit.hairs ) {
                    localPlayer.outfit.remove("hairs");
                } else {
                    localPlayer.outfit.add({"hairs":window[gender].hairs});
                    localPlayer.outfit.hairs.material.needsUpdate = true;
                    updatetoIdling();
                }
            break;

            case "/outfit/stockings":
                if ( !localPlayer.outfit.getGender("female") ) return;

                if ( localPlayer.outfit.stockings ) {
                    localPlayer.outfit.remove("stockings");
                } else {
                    localPlayer.outfit.add({"stockings":female.stockings});
                    localPlayer.outfit.stockings.material.needsUpdate = true;
                    updatetoIdling();
                }
            break;

            case "/outfit/underwears":
                var gender = localPlayer.outfit.getGender();

                if ( localPlayer.outfit.underwears ) {
                    localPlayer.outfit.remove("underwears");
                } else {
                    localPlayer.outfit.add({"underwears":window[gender].underwears});
                    localPlayer.outfit.underwears.material.needsUpdate = true;
                    updatetoIdling(); 
                }
            break;

            case "/outfit/dress":
                if ( !localPlayer.outfit.getGender("female") ) return;

                localPlayer.outfit.remove("trousers");
                localPlayer.outfit.add({"costume":female.dress});
                localPlayer.outfit.costume.material.needsUpdate = true;
                updatetoIdling();

            break;

            case "/outfit/costume":

                if ( localPlayer.outfit.getGender("female") ) {
                    localPlayer.outfit.remove("trousers");
                    localPlayer.outfit.add( {"costume":female.costume} );
                    localPlayer.outfit.costume.material.needsUpdate = true;
                    updatetoIdling();
                }

                if ( localPlayer.outfit.getGender("male") ) {

                    if ( localPlayer.outfit.costume ) {
                        localPlayer.outfit.remove("costume");
                    } else {
                        localPlayer.outfit.add( {"costume":male.costume} );
                        localPlayer.outfit.costume.material.needsUpdate = true;
                        updatetoIdling();
                    }
                }

            break;

            case "/outfit/tshirt":
                var gender = localPlayer.outfit.getGender();

                if ( localPlayer.outfit.tshirt ) {
                    localPlayer.outfit.remove("tshirt");
                } else {
                    localPlayer.outfit.add({"tshirt":window[gender].tshirt});
                    localPlayer.outfit.tshirt.material.needsUpdate = true;
                    updatetoIdling();
                }
            break;

            case "/outfit/trousers":
                var gender = localPlayer.outfit.getGender();

                if ( gender == "female" ) {
                    localPlayer.outfit.remove("costume");
                }

                if ( localPlayer.outfit.trousers ) {
                    localPlayer.outfit.remove("trousers");
                } else {
                    localPlayer.outfit.add({"trousers":window[gender].trousers});
                    localPlayer.outfit.trousers.material.needsUpdate = true;
                    updatetoIdling();
                }
            break;

            case "/outfit/shoes":
                var gender = localPlayer.outfit.getGender();

                if ( localPlayer.outfit.shoes ) {
                    localPlayer.outfit.remove("shoes");
                } else {
                    localPlayer.outfit.add({"shoes":window[gender].shoes});
                    localPlayer.outfit.shoes.material.needsUpdate = true;
                    updatetoIdling();
                }
            break;

        }

    }

    return localPlayer.outfit.toJSON();
}

