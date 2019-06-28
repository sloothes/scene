//  skinnedMeshLoader.js (v6.1)

var male, female, skeleton;

(async function(){

    localPlayerHandler("/turn/back");

//  Disable outfit direction visible on startup.
    localPlayer.outfit.direction.visible = false;


//  skeleton.

    skeleton = await db.collection("skeleton")
    .findOne({_id:"body"}, function(err){
        if (err) throw err;
    }).then(function(doc){
        return doc;
    }).catch(function(err){
        console.error(err);
    }).then(function(doc){
        return localPlayer.outfit.fromJSON({skeleton:doc});
    }).then(function(outfit){
         return outfit.skeleton;
    });
    debugMode && console.log({"skeleton":skeleton});


//  male.

    var mson = {};
    male = await db.collection("male")
    .find().forEach(
        function(doc){
            mson[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return localPlayer.outfit.fromJSON(mson);
    }).then(function(outfit){
        return outfit;
    });
    debugMode && console.log({"male":male});


//  female.

    var fson = {};
    female = await db.collection("female")
    .find().forEach(
        function(doc){
            fson[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return localPlayer.outfit.fromJSON(fson);
    }).then(function(outfit){
        return outfit;
    });
    debugMode && console.log({"female":female});


//  Startup.

//  localPlayerHandler("/turn/back");
    localPlayerHandler("/gender/male");

//  Enable outfit direction visible.
    localPlayer.outfit.direction.visible = true;

})();
