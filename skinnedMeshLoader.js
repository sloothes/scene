//  skinnedMeshLoader.js

    var bones, 
        skeleton;

    var male = {
        body:null,
        eyes:null,
        hairs:null,
        underwears:null,
        costume:null,
        tshirt:null,
        trousers:null,
        shoes:null,
    };

    var female = {
        body:null,
        eyes:null,
        hairs:null,
        stockings:null,
        underwears:null,
        dress:null,
        costume:null,
        tshirt:null,
        trousers:null,
        shoes:null,
    };


    function loadSkinnedFrom(json){

        var loader = new THREE.JSONLoader();
        var object = loader.parse( json );

        var geometry = object.geometry;
        geometry.sourceFile = json.sourceFile;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        var material = new THREE.MeshStandardMaterial({skinning:true});
        var skinned =  new THREE.SkinnedMesh( geometry, material );

        skinned.renderDepth = 1;
        skinned.frustumCulled = false;
        skinned.scale.set( 1, 1, 1 );
        skinned.position.set( 0, 0, 0 );
        skinned.rotation.set( 0, 0, 0 ); 

        return skinned;
    }


//  Cache skinned meshes (from indexedDB).

    (async function(){

    //  BONES.

        bones = await db.collection("skeleton")
        .findOne({_id:"bones"}, function(err, doc){
            if (err) throw err;
        }).then(function(json){
            return json; // bones = json;
        }).catch(function(err){
            console.error(err);
        });

    //  MALE.

        await db.collection("male").find()
        .forEach( async function(doc){

            var key = doc.name;
            var json = {[key]:doc};
            var object = await recoverfromJson(json, key);
            male[key] = object[key];

        }, function(err){
            if (err) throw err;
        }).catch(function(err){
            console.error(err);
        });

    //  FEMALE.

        await db.collection("female").find()
        .forEach( async function(doc){

            var key = doc.name;
            var json = {[key]:doc};
            var object = await recoverfromJson(json, key);

            object[key].name = doc.name;
            female[key] = object[key];

        }, function(err){
            if (err) throw err;
        }).catch(function(err){
            console.error(err);
        });

    //  SKELETON.

        skeleton = await db.collection("skeleton")
        .findOne({_id:"skeleton"}, function(err, doc){
            if (err) throw err;
        }).then(async function(doc){
            var key = doc.name;
            var json = {[key]:doc};
            var object = await recoverfromJson(json, key);
            return object[key];
        }).catch(function(err){
            console.error(err);
        });

    })().then(function(){

    //  Start up.
        localPlayerHandler( "/turn/back" );
        localPlayerHandler( store("Sex") || "/gender/male" );

    }).catch(function(err){
        console.error(err);
    });
