//  recoverfromJson.js

    function recoverfromJson( json, key ){

    //  Returns a resolved promise 
    //  object of type {key: skinnedMesh}.

    //  VERY IMPORTANT: need to be a copy of json explictly. VERY IMPORTANT //
        var json = JSON.stringify( json );  
        var json = JSON.parse( json );

    //  Copy json properties, to prevent overwritting.  //  IMPORTANT  //

        var object = {};
        object.name      = json[ key ].name;
        object.visible   = json[ key ].visible;
        object.materials = json[ key ].materials;
        object.geometry  = json[ key ].geometry;  // url.

        if ( !!json[ key ].scale ) {
            object.scale = new THREE.Vector3().fromArray( json[ key ].scale );
        } else {
            object.scale = new THREE.Vector3(1,1,1);
        }

    //  Copy key to prevent overwritting.
        var url = object.geometry;
        debugMode && console.log( {[key]: url} );

        return new Promise( function( resolve, reject ){

        //  Materials.
            var materials = [];

            object.materials.forEach(function( material, index ){
                materials.push( new Promise( function(resolve, reject){

                //  Restore normalScale vector.                  
                    if ( !!material.options.normalScale ){
                        material.options.normalScale = new THREE.Vector2()
                        .fromArray( material.options.normalScale ); // IMPORTANT //
                    }

                //  Textures.

                    var textures = [];

                    if (!!material.map) textures.push( loadMapTexture( "map" ) );
                    if (!!material.aoMap) textures.push( loadMapTexture( "aoMap" ) );
                    if (!!material.envMap) textures.push( loadMapTexture( "envMap" ) );
                    if (!!material.bumpMap) textures.push( loadMapTexture( "bumpMap" ) );
                    if (!!material.alphaMap) textures.push( loadMapTexture( "alphaMap" ) );
                    if (!!material.lightMap) textures.push( loadMapTexture( "lightMap" ) );
                    if (!!material.normalMap) textures.push( loadMapTexture( "normalMap" ) );
                    if (!!material.emissiveMap) textures.push( loadMapTexture( "emissiveMap" ) );
                    if (!!material.specularMap) textures.push( loadMapTexture( "specularMap" ) );
                    if (!!material.roughnessMap) textures.push( loadMapTexture( "roughnessMap" ) );
                    if (!!material.metalnessMap) textures.push( loadMapTexture( "metalnessMap" ) );
                    if (!!material.displacementMap) textures.push( loadMapTexture( "displacementMap" ) );

                //  debugMode && console.log( "textures promises:", textures );


                //  Materials.

                    Promise.all(textures).then(function( result ){

                        switch ( material.type ) {
                            case "MeshBasicMaterial":
                                resolve( new THREE.MeshBasicMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                break;
                            case "MeshDepthMaterial":
                                resolve( new THREE.MeshDepthMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                break;
                            case "MeshLambertMaterial":
                                resolve( new THREE.MeshLambertMaterial( material.options ) );  // multimaterialPromises.push resolve.
                                break;
                            case "MeshNormalMaterial":
                                resolve( new THREE.MeshNormalMaterial( material.options ) );   // multimaterialPromises.push resolve.
                                break;
                            case "MeshPhongMaterial":
                                resolve( new THREE.MeshPhongMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                break;
                            case "MeshPhysicalMaterial":
                                resolve( new THREE.MeshPhysicalMaterial( material.options ) ); // multimaterialPromises.push resolve.
                                break;
                            case "MeshStandardMaterial":
                                resolve( new THREE.MeshStandardMaterial( material.options ) ); // multimaterialPromises.push resolve.
                                break;
                            default:
                                resolve( new THREE.MeshStandardMaterial( material.options ));  // multimaterialPromises.push resolve.
                        }

                    });

                    function loadMapTexture( name ){
                        return new Promise(function(resolve, reject){
                            var src = material[ name ];
                            var img = new Image();
                            img.crossOrigin = "anonymous"; // IMPORTANT //
                            $(img).on("load", function(){
                            //  var canvas = makePowerOfTwo( this );
                                material.options[ name ] = new THREE.Texture(img); // or (canvas).
                                material.options[ name ].sourceFile = src;
                                material.options[ name ].needsUpdate = true;
                                $(this).remove();
                                resolve( material.options[ name ] );
                            });
                            img.src = src;
                        });
                    }

                }));

            });

        //  debugMode && console.log( "materials promises:", materials );

            Promise.all(materials).then(function( result ){

                if ( result.length == 0 )
                    var material = new THREE.MeshStandardMaterila({skinning:true});

                if ( result.length == 1 ) 
                    var material = result[0];

                if ( result.length > 1 )
                    var material = new THREE.MeshFaceMaterial( result );  //  MultiMaterial.

            //  debugMode && console.log( "material:", material );

            //  Geometry.

                w3.getHttpObject( url, function( obj ){

                    var loader = new THREE.JSONLoader();
                    var geometry = loader.parse( obj ).geometry;

                    geometry.sourceFile = url; // important!

                    geometry.computeFaceNormals();
                    geometry.computeVertexNormals();
                    geometry.computeBoundingBox();
                    geometry.computeBoundingSphere();
                    geometry.name = obj.name + ".geometry";

                    var skinned = new THREE.SkinnedMesh( geometry, material );

                    skinned.renderDepth = 1;
                    skinned.frustumCulled = false;
                    skinned.position.set( 0, 0, 0 );
                    skinned.rotation.set( 0, 0, 0 );
                    skinned.scale.copy( object.scale );
                    skinned.visible = object.visible; // overwrite object.visible = true.
                    skinned.castShadow = true;
                    skinned.name = obj.name;

                    resolve( {[key]: skinned} );

                });

            });

        });

    }
