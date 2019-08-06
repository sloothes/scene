//  localPlayerHandler.js (v3.5)
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

                    if ( !localPlayer.outfit.getGender() ) {
                        localPlayer.outfit.removeAll();
                        localPlayer.outfit.add({skeleton:skeleton});
                    }

                break;

                case "/select/body":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                break;

                case "/select/eyes":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                break;

                case "/select/hairs":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                break;

                case "/select/stockings":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.stockings ) add("stockings");
                break;

                case "/select/underwears":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.underwears ) add("underwears");
                break;

                case "/select/costume":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton", "dress");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.costume ) add("costume");
                break;

                case "/select/tshirt":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.tshirt ) add("tshirt");
                break;

                case "/select/trousers":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.trousers ) add("trousers");
                break;

                case "/select/dress":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton", "costume");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.dress ) add("dress");
                break;

                case "/select/shoes":
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.shoes ) add("shoes");
                break;

                default:
                    if ( !localPlayer.outfit.getGender() ) break;
                    remove("skeleton");
                    if ( !localPlayer.outfit.body ) add("body");
                    if ( !localPlayer.outfit.eyes ) add("eyes");
                    if ( !localPlayer.outfit.hairs ) add("hairs");
                    if ( !localPlayer.outfit.shoes ) add("shoes");
                break;

            }

        }

        return localPlayer.outfit.toJSON();

    }

//  localPlayerOutfitHandler.js (v0.1)

    function localPlayerOutfitHandler(data){

                    // TODO //

    }


//  localPlayerApplyMaterial.js (v1.0) --> localPlayerMaterialHandler.js

    function localPlayerApplyMaterial(data){

        if ( !data.slot ) return;
        if ( !data.gender ) return;
        if ( !data.material ) return;
        if ( !window[ data.gender ][ data.slot ] ) return;

        if ( "validator" in window ) {
            var str = JSON.stringify(data.material);
            if ( !validator.isJSON(str) ) return;
        }

    //  Dispose old material textures.

        var oldMaterial = window[ data.gender ][ data.slot ].material;

        if (oldMaterial && !oldMaterial.materials) {

            //  Single material.

            Object.keys(oldMaterial).filter( function(key){
                return oldMaterial[ key ] instanceof THREE.Texture;
            }).forEach( (key) => {
                oldMaterial[ key ].dispose();
                oldMaterial[ key ] = null;
            });

            oldMaterial.dispose();

        } else if (oldMaterial.materials && oldMaterial.materials.length) {

            //  Multimaterial.

            oldMaterial.materials.forEach(function(material){

                Object.keys(material).filter(function(key){
                    return material[ key ] instanceof THREE.Texture;
                }).forEach(function(key){
                    material[ key ].dispose();
                    material[ key ] = null;
                });

                material.dispose();

            });

        }

    //  New material.

        var material = materialfromJSON(data.material);

        window[ data.gender ][ data.slot ].material = material;
        
        debugMode && console.log(material);

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

            //  Shading.

                case "shading":
                case "skinning":
                    material[data.key] = data.value;
                    material.needsUpdate = true;
                break;

            //  Normal scale.

                case "normalScale":
                    material.normalScale.set( data.value, data.value );
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

//  localPlayerTextureHandler.js (v1.0)

    function localPlayerTextureHandler(){

        for (var arg in arguments) {

            var data = arguments[arg];

            //  var slot = data.slot;
            //  var maps = data.maps;     // array.
            //  var json = data.texture;  // json.
            //  var gender = data.gender;

        //  if (!window[ data.gender ][ data.slot ]) return;
        //  var material = window[ data.gender ][ data.slot ].material;

        /*
            if ( data.maps.findIndex(function(item){ 
                return item == "alphaMap"; }) > -1) {
                material.transparent = true;
            }
        */

            caches.open("textures").then(function(cache){

                if ( !data.slot ) throw "null data slot.";
                if ( !data.gender ) throw "null data gender.";
                if ( !data.texture.sourceFile ) throw "null data sourceFile.";
                if ( !window[data.gender][data.slot] ) throw "outfit not found.";

                var material = window[ data.gender ][ data.slot ].material;

                cache.keys().then(function(requests){
                    if ( requests.find(function(request){
                        return request.url = data.texture.sourceFile;
                    }) == undefined ) throw "cache request not found.";
                }).catch(function(err){
                    console.error(err);
                });

                cache.match(data.texture.sourceFile)
                .then(function(response){
                    if (!response) throw "null response returned from cache.";
                    return response.blob();

                }).then(function(blob){
                    if (!blob) throw "null blob returned from response.";

                    data.maps.forEach(function(map){
                        var img = new Image();
                        var oldTexture = material[map];
                        img.crossOrigin = "anonymous";
                        $(img).on("load", function(){
                            material[map] = null; // important!
                            material[map] = new THREE.Texture(img);
                            material[map].sourceFile = data.texture.sourceFile; // important!
                            material[map].needsUpdate = material.needsUpdate = true;
                            window.URL.revokeObjectURL(img.src);
                            if (oldTexture) oldTexture.dispose(); // important!
                            $(img).remove();
                        }).attr({src: window.URL.createObjectURL(blob)});
                    });

                }).catch(function(err){
                    console.error(err);
                });

            }).catch(function(err){
                console.error(err);
            });

        }

    }


//  localPlayerTextureRemoveHandler.js (v1.0)

    function localPlayerTextureRemoveHandler(){

        for (var arg in arguments) {

            var data = arguments[arg];

            //  var map = data.map;
            //  var slot = data.slot;
            //  var gender = data.gender;

            var material = window[ data.gender ][ data.slot ].material;

            if (material[ data.map ] == null) continue;  // important! (DO NOT USE "return")

            var oldTexture = material[ data.map ];

            material[ data.map ] = null; // important!
            material.needsUpdate = true; // important!

            if (oldTexture) oldTexture.dispose();

        }

    }


