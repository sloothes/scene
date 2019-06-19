//  materialtoJson.js (v1.3)

//  MATERIAL TO JSON.
//  Return a promise with the 
//  material json object resolved.

    function materialtoJSON( material ){


    //  MULTIMATERIAL.

        if ( material.type == "MultiMaterial" ) {


        //  multimaterial to json.

            var multjson = {

                _id: "",
                type: material.type,
                uuid: material.uuid || THREE.Math.generateUUID(),

            };


        //  materials to json.

            multjson.materials = [];

            for ( var i = 0; i < material.materials.length; i++ ){

                multjson.materials.push( materialtoJSON( material.materials[i] ) );

            }


            debugMode && console.log( "multimaterial to json:", multjson );

            return multjson;

        }


    //  MATERIAL.

        var json = {};

        for ( var name in material ){

            if ( material[ name ] == undefined ) continue;         // important!
            if ( material[ name ] instanceof Function ) continue;  // important!

            switch( name ){

                case "defines":
                case "program":
                case "_listeners":
                case "needsUpdate":
                case "_needsUpdate":
                case "__webglShader":
                break;


            //  uuid.

                case "uuid":
                    json.uuid = material.uuid || THREE.Math.generateUUID();
                break;


            //  name && _id.

                case "name":
                    json._id = material[ name ];
                    json[ name ] = material[ name ];
                break;


            //  default.

                default:
                    json[ name ] = material[ name ];
                break;


            //  texture to json.

                case "map":
                case "bumpMap":
                case "alphaMap":
                case "normalMap":
                case "emissiveMap":
                case "displacementMap":
                case "metalnessMap":
                case "roughnessMap":
                case "specularMap":
                case "lightMap":
                case "aoMap":

                    if ( !(material[ name ] instanceof THREE.Texture) ) {
                        throw `${name} is not instance of THREE.Texture`;
                    }

                    json[ name ] = texturetoJSON( material[ name ] );

                break;


            //  three color to hex.

                case "color":
                case "emissive":
                case "specular":

                    if ( !(material[ name ] instanceof THREE.Color) ) {
                        throw `${name} is not instance of THREE.Color`;
                    }

                    json[ name ] = material[ name ].getHex();

                break;


            //  vector2 to array.

                case "normalScale":

                    if ( !(material[ name ] instanceof THREE.Vector2) ) {
                        throw `${name} is not instance of THREE.Vector2`;
                    }

                    json[ name ] = material[ name ].toArray();

                break;


            //  cube texture (TODO).

                case "envMap":

                    // TODO //

                break;

            }

        }


        debugMode && console.log( "material to json:", json );

        return json;

    }


//  TEXTURE TO JSON.
//  Return a promise resolved 
//  with the texture json object.

    function texturetoJSON( texture ){

        var json = {};

        for (var name in texture ){

            if ( texture[ name ] == undefined ) continue;
            if ( texture[ name ] instanceof Function ) continue;


            switch (name){

                case "_listeners":
                break;


            //  uuid.

                case "uuid":
                    json[ name ] = texture[ name ] || THREE.Math.generateUUID();
                break;


            //  default.

                default:
                    json[ name ] = texture[ name ];
                break;


            //  vector2 to array.

                case "offset":
                case "repeat":
                    json[ name ] = texture[ name ].toArray();
                break;


            //  image to json.

                case "image":
                    json[ name ] = texture.sourceFile || getDataURL( texture[ name ] ); // important!
                break;

            }

        }

        return json;

    }


//  IMAGE TO JSON.
//  Return a promise with the 
//  image json object resolved.

    function imagetoJSON( image ){

        return {
            uuid: THREE.Math.generateUUID(),
            url: image.src || getDataURL( image ),
        };

    }

    function getDataURL( image ){

        var canvas;

        if ( image.toDataURL != undefined ) {

            canvas = image;

        } else {

            canvas = document.createElementNS( "http://www.w3.org/1999/xhtml", "canvas" );
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext( "2d" ).drawImage( image, 0, 0, image.width, image.height );

        }

        if ( canvas.width > 2048 || canvas.height > 2048 ) {

            return canvas.toDataURL( "image/jpeg", 0.6 );

        } else {

            return canvas.toDataURL( "image/png" );
        }

    }


//  materialfromJson.js (v1.3)

//  MATERIAL FROM JSON.
//  Return a promise with the material resolved.

    function materialfromJSON( json ){

   //  MULTIMATERIAL.

       if ( json.type == "MultiMaterial" ) {


           var materials = [];

           for ( var i = 0; i < json.materials.length; i++ ){

               materials.push( materialfromJSON( json.materials[i] ) );

           }


       //  Create multimaterial.

           var multimaterial = new THREE.MeshFaceMaterial(materials);

           multimaterial.uuid = json.uuid || THREE.Math.generateUUID();

           return multimaterial;

        }


    //  MATERIAL.

        var options = {};

        for (var name in json){

            if ( json[ name ] == undefined ) continue; // important!

            switch (name){

                case "_id":
                break;

            //  uuid.

                case "uuid":
                    options.uuid = json.uuid || THREE.Math.generateUUID();
                break;


            //  default.

                default:
                    options[ name ] = json[ name ];
                break;


            //  texture from json.

                case "alphaMap":
                case "aoMap":
                case "bumpMap":
                case "displacementMap":
                case "emissiveMap":
                case "lightMap":
                case "map":
                case "metalnessMap":
                case "normalMap":
                case "roughnessMap":
                case "specularMap":

                        options[ name ] = texturefromJSON( json[ name ] );

                break;


            //  three color to hex.

                case "color":
                case "emissive":
                case "specular":

                    options[ name ] = new THREE.Color();
                    options[ name ].setHex( json[ name ] );

                break;


            //  vector2 from array.

                case "normalScale":

                    options[ name ] = new THREE.Vector2();
                    options[ name ].fromArray( json[ name ] );

                break;


            //  cube texture (TODO).

                case "envMap":

                    // TODO //

                break;

            }

        }

        return new THREE[ options.type ](options);

    }

//  TEXTURE FROM JSON.
//  Return a promise with the texture resolved.

    function texturefromJSON( json ){

        var texture = new THREE.Texture();

        for ( var name in json ){


            switch (name){


            //  default.

                default:
                    texture[ name ] = json[ name ];
                break;


            //  array to vector2.

                case "offset":
                case "repeat":

                    if ( json[ name ].length != 2) break;

                    texture[ name ] = new THREE.Vector2();
                    texture[ name ].fromArray( json[ name ] );

                break;


            //  wrapS & wrapT.

                case "wrap":

                    if ( json[ name ].length != 2) break;
                    if ( !( json[ name ] instanceof Array ) ) break;

                    texture.wrapS = json[ name ][0];
                    texture.wrapT = json[ name ][1];

                break;


            //  image from json.

                case "image":

                    (function (){

                        var img = new Image();
                        img.crossOrigin = "anonymous";
                        $(img).one("load", function(){
                            texture.image = this;
                            texture.needsUpdate = true;
                        }).attr({src: json.image});

                    })();

                break;

            }

        }

        return texture;

    }

//  IMAGE FROM JSON.
//  Return a promise with the image resolved.

    function imagefromJSON( json, onImageLoad ){

        var img = new Image();
        img.crossOrigin = "anonymous";

        if ( onImageLoad ) {
            img.addEventListener("load", onImageLoad);
        }

        img.src = json.url;

        return img;

    }

//  makePowerOfTwo.js

    function makePowerOfTwo( image, natural ) {
        var canvas = document.createElement( "canvas" );

        if ( natural ){
            canvas.width = THREE.Math.nearestPowerOfTwo( image.naturalWidth );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.naturalHeight );
        } else {
            canvas.width = THREE.Math.nearestPowerOfTwo( image.width );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.height );
        }
        var context = canvas.getContext( "2d" );
        context.drawImage( image, 0, 0, canvas.width, canvas.height );

    //  debugMode && console.warn( "outfitLoader:makePowerOfTwo(img):", 
    //  "Image resized to:", canvas.width, "x", canvas.height );

        return canvas;
    }

//  getDataURL.js

    function getDataURL( image ) {

        var canvas;

        if ( image.toDataURL !== undefined ) {

            canvas = image;

        } else {

            canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );
            canvas.width = image.width;
            canvas.height = image.height;

            canvas.getContext( '2d' ).drawImage( image, 0, 0, image.width, image.height );

        }

        if ( canvas.width > 2048 || canvas.height > 2048 ) {

            return canvas.toDataURL( 'image/jpeg', 0.6 );

        } else {

            return canvas.toDataURL( 'image/png' );

        }

    }
