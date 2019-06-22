//  skinnedMeshLoader.js

    async function cacheSkinned( name ){

        var cachedOutfits = {};

        await db.collection( name ).find()
        .forEach( async function(data){ 

        //  Recover from json.
            var object = {};
            var key = data.name;

            object.name      = data.name;
            object.visible   = data.visible;
            object.material  = data.material;
            object.geometry  = data.geometry;  // url.

        //  Scale.
            var vector = new THREE.Vector3();
            object.scale = vector.fromArray( data.scale );

        //  Material.
            var material = materialfromJSON( object.material );

        //  Geometry.
            w3.getHttpObject( object.geometry, function( json ){

                var loader = new THREE.JSONLoader();
                var geometry = loader.parse( json ).geometry;

                geometry.sourceFile = object.geometry;  // important!

                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                geometry.name = json.name;

                var skinned = new THREE.SkinnedMesh( geometry, material );

                skinned.renderDepth = 1;
                skinned.frustumCulled = false;
                skinned.position.set( 0, 0, 0 );
                skinned.rotation.set( 0, 0, 0 );
                skinned.scale.copy( object.scale );
            //  overwrite object.visible = true.
                skinned.visible = object.visible; 
                skinned.castShadow = true;

                cachedOutfits[key] = skinned;

            });


        }, function(err){
            if (err) throw err;
        }).catch(function(err){
            console.error(err);
        });

        return cachedOutfits;
    }

    (async function(){

    //  BONES.

        bones = await db.collection("skeleton")
        .findOne({_id:"bones"}, function(err, doc){
            if (err) throw err;
        }).then(function(json){
            return json;
        }).catch(function(err){
            console.error(err);
        });

        debugMode && console.log({"bones": bones});


    //  MALE.
        male = await cacheSkinned("male");
        debugMode && console.log({"male": male});


    //  FEMALE.
        female = await cacheSkinned("female");
        debugMode && console.log({"female": female});


    //  SKELETON.

        await db.collection("skeleton")
        .findOne({_id:"body"}, function(err, doc){
            if (err) throw err;
        }).then(async function(data){

            var object = {};
            var key = data.name;

            object.name      = data.name;
            object.visible   = data.visible;
            object.material  = data.material;
            object.geometry  = data.geometry;  // url.

        //  Scale.
            var vector = new THREE.Vector3();
            object.scale = vector.fromArray( data.scale );

        //  Material.
            var material = materialfromJSON( object.material );

        //  Geometry.

            w3.getHttpObject( object.geometry, function( json ){

                var loader = new THREE.JSONLoader();
                var geometry = loader.parse( json ).geometry;

                geometry.sourceFile = object.geometry;  // important!

                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                geometry.name = json.name;

                var skinned = new THREE.SkinnedMesh( geometry, material );

                skinned.renderDepth = 1;
                skinned.frustumCulled = false;
                skinned.position.set( 0, 0, 0 );
                skinned.rotation.set( 0, 0, 0 );
                skinned.scale.copy( object.scale );
            //  overwrite object.visible = true.
                skinned.visible = object.visible; 
                skinned.castShadow = true;
                skinned.name = "skeleton";

                skeleton = skinned;
                debugMode && console.log({"skeleton": skeleton});

            });


        }).catch(function(err){
            console.error(err);
        });

    })();

