//  skinnedMeshLoader.js (v6.1)

var male, female, skeleton;

(async function(){

    localPlayerHandler("/turn/back");

//  Disable outfit direction visible on startup.
//  localPlayer.outfit.direction.visible = false;

//  skeleton.
    var skeletonOutfit = new AW3D.OutfitManager();
    skeleton = await db.collection("skeleton")
    .findOne({_id:"body"}, function(err){
        if (err) throw err;
    }).then(function(doc){
        return doc;
    }).catch(function(err){
        console.error(err);
    }).then(function(doc){
        return skeletonOutfit.fromJSON({skeleton:doc});
    }).then(function(outfit){
         return outfit.skeleton;
    });
    debugMode && console.log({"skeleton":skeleton});


    var mjson = {};
    var maleOutfit = new AW3D.OutfitManager();
    male = await db.collection("male")
    .find().forEach(
        function(doc){
            mjson[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return maleOutfit.fromJSON(mjson);
    }).then(function(outfit){
        return outfit;
    });
    debugMode && console.log({"male":male});


    var fjson = {};
    var femaleOutfit = new AW3D.OutfitManager();
    female = await db.collection("female")
    .find().forEach(
        function(doc){
            fjson[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return femaleOutfit.fromJSON(fjson);
    }).then(function(outfit){
        return outfit;
    });
    debugMode && console.log({"female":female});


//  Startup.

//  localPlayerHandler("/turn/back");
    localPlayerHandler("/gender/female");

//  Enable outfit direction visible.
    localPlayer.outfit.direction.visible = true;

})();
