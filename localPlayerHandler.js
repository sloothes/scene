//  localPlayerHandler.js (v3.2)
// hot "add/remove" from AW3D v0.3.7 and later.

    function localPlayerHandler(){
    //  Returns: localPlayer.outfit.toJSON();

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

        function add(name){

            localPlayer.outfit.add({[name]:window[gender][name]});
        //  startIdling();  // hot "add" from AW3D v0.3.7 and later.

            for (var key in window[gender]) {
                if ( !key ) return;
            //  if ( window[gender][ key ] == undefined ) return;
                window[gender][ key ].material.needsUpdate = true;
            }

        }

        function remove(name){

            localPlayer.outfit.remove(name);
        //  startIdling();  // hot "remove" from AW3D v0.3.7 and later.

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

                case "/gender/":
                case "/gender/NaN":
                case "/gender/null":
                case "/gender/false":
                case "/gender/undefined":

                case "/gender/male":
                case "/gender/trans":
                case "/gender/female":
                case "/gender/shemale":

                    (function(){

                        var gender = data.split("/").pop();
                        debugMode && console.log(`set gender to ${gender}`);
                        debugMode && console.log("gender match:", localPlayer.outfit.getGender(gender));

                        if ( localPlayer.outfit.getGender(gender) ) return;

                    /*
                        localPlayer.outfit.direction.visible = false;
                        $(localPlayer.outfit).one("change", function(){
                            setTimeout(function(){
                                localPlayer.outfit.direction.visible = true;
                            }, 250);
                        });
                    */

                    //  Remove.
                        localPlayer.outfit.removeAll();

                    //  Set gender.
                        localPlayer.outfit.setGender(gender);

                    //  Add outfits.
                        if ( !localPlayer.outfit.getGender() ) {

                            localPlayer.outfit.add(
                                {"skeleton": skeleton}
                            );

                        } else if ( localPlayer.outfit.getGender("male") ) {

                            localPlayer.outfit.add(
                                {"body": male.body},
                                {"eyes": male.eyes},
                                {"hairs":male.hairs},
                                {"tshirt":male.tshirt},
                                {"trousers":male.trousers},
                                {"shoes":male.shoes},
                            );

                        } else if ( localPlayer.outfit.getGender("female") ) {

                            localPlayer.outfit.add(
                                {"body": female.body},
                                {"eyes": female.eyes},
                                {"hairs":female.hairs},
                                {"underwears":female.underwears},
                                {"dress":female.dress},
                                {"shoes":female.shoes},
                            );
                        }

                    //  Update controller.
                        updatetoIdling();

                    //  Update materials.
                        for (var key in window[gender]) {
                            if ( window[gender][ key ] == undefined ) return;
                            window[gender][ key ].material.needsUpdate = true;
                        }

                    })();

                break;

            //  OUTFIT.

                case "/outfit/body":

                    var gender = localPlayer.outfit.getGender();

                    if ( localPlayer.outfit.body ) {

                        (function(){

                            localPlayer.outfit.removeAll();

                            localPlayer.outfit.add( {"skeleton": skeleton} );

                            updatetoIdling();  // important!

                            skeleton.material.needsUpdate = true;

                        })();

                        break;

                    } else {

                        (function(){

                            localPlayer.outfit.removeAll();

                            localPlayer.outfit.add(
                                {"body": window[gender].body},
                                {"eyes": window[gender].eyes},
                                {"hairs":window[gender].hairs},
                                {"underwears":window[gender].underwears},
                                {"shoes":window[gender].shoes},
                            );

                            updatetoIdling();  // important!

                            for (var key in window[gender]) {
                                if ( window[gender][ key ] == undefined ) return;
                                window[gender][ key ].material.needsUpdate = true;
                            }

                        })();

                        break;

                    }

                break;

                case "/outfit/hairs":

                    var gender = localPlayer.outfit.getGender();

                    if ( !localPlayer.outfit.hairs ) {

                        add("hairs");

                    } else {

                        remove("hairs");
                    }

                break;

                case "/outfit/stockings":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender != "female" ) break;

                    if ( !localPlayer.outfit.stockings ) {

                        add("stockings");

                    } else {

                        remove("stockings");

                    }

                break;

                case "/outfit/underwears":

                    var gender = localPlayer.outfit.getGender();

                    if ( !localPlayer.outfit.underwears ) {

                        add("underwears");

                    } else {

                        remove("underwears");

                    }

                break;

                case "/outfit/costume":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender == "female" ) {
                        localPlayer.outfit.remove("dress");
                    }

                    if ( !localPlayer.outfit.costume ) {

                        add("costume");

                    } else {

                        remove("costume");

                    }

                break;

                case "/outfit/tshirt":

                    var gender = localPlayer.outfit.getGender();

                    if ( !localPlayer.outfit.tshirt ) {

                        add("tshirt");

                    } else {

                        remove("tshirt");

                    }

                break;

                case "/outfit/trousers":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender == "female" ) {
                        localPlayer.outfit.remove("dress");
                    }

                    if ( !localPlayer.outfit.trousers ) {

                        add("trousers");

                    } else {

                        remove("trousers");

                    }

                break;

                case "/outfit/dress":

                    var gender = localPlayer.outfit.getGender();

                    if ( gender != "female" ) break;

                    localPlayer.outfit.remove("costume");
                    localPlayer.outfit.remove("trousers");

                    if ( !localPlayer.outfit.dress ) {

                        add("dress");

                    } else {

                        remove("dress");

                    }

                break;

                case "/outfit/shoes":

                    var gender = localPlayer.outfit.getGender();

                    if ( !localPlayer.outfit.shoes ) {

                        add("shoes");

                    } else {

                        remove("shoes");

                    }

                break;

            }

        }

        return localPlayer.outfit.toJSON();

    }

