//  localPlayerHandler.js (v3.4)
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

        function add(){

            var gender = localPlayer.outfit.getGender();

            if (!gender) return;

            for (var arg in arguments) {
                var name = arguments[arg];
                localPlayer.outfit.add({[name]:window[gender][name]});
            }

            for (var key in window[gender]) {
                if ( !key ) return;
                window[gender][ key ].material.needsUpdate = true;
            }

        }

        function remove(){
            for (var arg in arguments) {
                var name = arguments[arg];
                localPlayer.outfit.remove(name);
            }
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

                        }

                        if ( localPlayer.outfit.getGender("male") ) {

                            localPlayer.outfit.add(
                                {"body": male.body},
                                {"eyes": male.eyes},
                                {"hairs":male.hairs},
                                {"tshirt":male.tshirt},
                                {"trousers":male.trousers},
                                {"shoes":male.shoes},
                            );

                        } 

                        if ( localPlayer.outfit.getGender("female") ) {

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
                        var gender = localPlayer.outfit.getGender();
                        if ( !gender ) return;
                        for (var key in window[gender]) {
                            if ( key == undefined ) return;
                        //  if ( window[gender][ key ] == undefined ) return;
                            window[gender][ key ].material.needsUpdate = true;
                        }

                    })();

                break;

            //  OUTFIT.

                case "/outfit/body":

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

                            var gender = localPlayer.outfit.getGender();

                            localPlayer.outfit.removeAll();

                            localPlayer.outfit.add(
                                {"body": window[gender].body},
                                {"eyes": window[gender].eyes},
                                {"hairs":window[gender].hairs},
                                {"underwears":window[gender].underwears},
                                {"shoes":window[gender].shoes},
                            );

                            updatetoIdling();

                            for (var key in window[gender]) {
                                if ( key == undefined ) return;
                            //  if ( window[gender][ key ] == undefined ) return;
                                window[gender][ key ].material.needsUpdate = true;
                            }

                        })();

                        break;

                    }

                break;

                case "/outfit/hairs":

                    if ( !localPlayer.outfit.hairs ) {

                        add("hairs");

                    } else {

                        remove("hairs");
                    }

                break;

                case "/outfit/stockings":

                    if ( !localPlayer.outfit.getGender("female") ) break;

                    if ( !localPlayer.outfit.stockings ) {

                        add("stockings");

                    } else {

                        remove("stockings");

                    }

                break;

                case "/outfit/underwears":

                    if ( !localPlayer.outfit.underwears ) {

                        add("underwears");

                    } else {

                        remove("underwears");

                    }

                break;

                case "/outfit/costume":

                    if ( localPlayer.outfit.getGender("female") ) {
                        localPlayer.outfit.remove("dress");
                    }

                    if ( !localPlayer.outfit.costume ) {

                        add("costume");

                    } else {

                        remove("costume");

                    }

                break;

                case "/outfit/tshirt":

                    if ( !localPlayer.outfit.tshirt ) {

                        add("tshirt");

                    } else {

                        remove("tshirt");

                    }

                break;

                case "/outfit/trousers":

                    if ( localPlayer.outfit.getGender("female") ) {
                        localPlayer.outfit.remove("dress");
                    }

                    if ( !localPlayer.outfit.trousers ) {

                        add("trousers");

                    } else {

                        remove("trousers");

                    }

                break;

                case "/outfit/dress":

                    if ( !localPlayer.outfit.getGender("female") ) break;

                    localPlayer.outfit.remove("costume");
                    localPlayer.outfit.remove("trousers");

                    if ( !localPlayer.outfit.dress ) {

                        add("dress");

                    } else {

                        remove("dress");

                    }

                break;

                case "/outfit/shoes":

                    if ( !localPlayer.outfit.shoes ) {

                        add("shoes");

                    } else {

                        remove("shoes");

                    }

                break;

            //  outfitSelectHandler.js

                case "/select/":
                case "/select/NaN":
                case "/select/null":
                case "/select/false":
                case "/select/undefined":
                    localPlayer.outfit.removeAll();
                    localPlayer.outfit.add({skeleton:skeleton});
                break;

                case "/select/body":
                    remove("skeleton", "costume", "tshirt", "trousers", "dress", "shoes");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                break;

                case "/select/eyes":
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                break;

                case "/select/hairs":
                    remove("skeleton");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                break;

                case "/select/stockings":
                    if ( !localPlayer.outfit.getGender("female") ) break;
                    remove("skeleton", "costume", "trousers");
                    if ( !localPlayer.outfit.stockings ) add("stockings");
                break;

                case "/select/underwears":
                    remove("skeleton", "costume", "tshirt", "trousers", "dress");
                    if ( !localPlayer.outfit.underwears ) add("underwears");
                break;

                case "/select/costume":
                    remove("skeleton", "tshirt", "trousers", "dress");
                    if ( !localPlayer.outfit.costume ) add("costume");
                break;

                case "/select/tshirt":
                    remove("skeleton", "costume", "dress");
                    if ( !localPlayer.outfit.tshirt ) add("tshirt");
                break;

                case "/select/trousers":
                    remove("skeleton", "costume", "dress");
                    if ( !localPlayer.outfit.trousers ) add("trousers");
                break;

                case "/select/dress":
                    if ( !localPlayer.outfit.getGender("female") ) break;
                    remove("skeleton", "costume", "trousers", "tshirt");
                    if ( !localPlayer.outfit.dress ) add("dress");
                break;

                case "/select/shoes":
                    remove("skeleton");
                    if ( !localPlayer.outfit.shoes ) add("shoes");
                break;

            }

        }

        return localPlayer.outfit.toJSON();

    }


//  localPlayerMaterialHandler.js (v1.3)

    function localPlayerMaterialHandler(){

        for (var arg in arguments) {

            var data = arguments[arg];

        //  var key = data.key;
        //  var slot = data.slot;
        //  var value = data.value;
        //  var gender = data.gender;

            var material = window[ data.gender ][ data.slot ].material;

            switch (data.key) {

            //  Colors.

                case "color":
                case "emissive":
                    material[data.key].setHex(data.value);
                break;

            //  Textures.

                case "map":
                case "aoMap":
                case "envMap":
                case "bumpMap":
                case "alphaMap":
                case "lightMap":
                case "normalMap":
                case "emissiveMap":
                case "metalnessMap":
                case "roughnessMap":
                case "displacementMap":

                //  costumized version of texturefromJSON(data.value);

                    if (data.value == null) {

                        if ( material[ data.key ] ) {
                            var oldTexture = material[ data.key ];
                            material[ data.key ] = null;
                            material.needsUpdate = true;
                            oldTexture.dispose();
                        }

                    } else {

                        var oldTexture;
                        if (material[ data.key ] != null) oldTexture = material[data.key];

                        var newTexture = new THREE.Texture();

                        for ( var name in data.value ){
                            switch (name){

                            //  case "image": // no image case.

                            //  sourceFile.
                                case "sourceFile":
                                    newTexture.sourceFile = data.value[ name ];
                                    debugMode && console.log({[name]:data.value[name]});
                                    var url = data.value.sourceFile || data.value.image.src || data.value.image;
                                    var img = new Image();
                                    img.crossOrigin = "anonymous";
                                    $(img).one("load", function(){
                                        var canvas = makePowerOfTwo( img, true );
                                        newTexture.image = canvas;
                                        material[data.key] = newTexture;
                                        material[data.key].needsUpdate = true;
                                        material.needsUpdate = true;
                                        if (canvas) $(img).remove();
                                        if (oldTexture) oldTexture.dispose();
                                    });
                                    img.src = url;
                                break;

                            //  array to vector2.
                                case "offset":
                                case "repeat":
                                    if ( typeof(data.value[ name ]) != "array" ) break;
                                    if ( data.value[ name ].length != 2) break;
                                    newTexture[ name ] = new THREE.Vector2();
                                    newTexture[ name ].fromArray( data.value[ name ] );
                                break;

                            //  wrapS & wrapT.
                                case "wrap":
                                    if ( typeof(data.value[ name ]) != "array" ) break;
                                    if ( data.value[ name ].length != 2) break;
                                    newTexture.wrapS = data.value[ name ][0];
                                    newTexture.wrapT = data.value[ name ][1];
                                break;

                                default:
                                    newTexture[ name ] = data.value[ name ];
                                break;
                            }
                        }
                    }

                break;

                default:
                    material[data.key] = data.value;
                break;

            }

        }

    }

