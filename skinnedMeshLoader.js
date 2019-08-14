//  skinnedMeshLoader.js (v6.3)

    var male = {};
    var female = {};
    var skeleton;

    localPlayerHandler("/turn/back");

//  Disable outfit direction visible on startup.
//  localPlayer.outfit.direction.visible = false;


Promise.all([

//  male.

    db.collection("male").find().forEach(
        function(doc){
            male[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return localPlayer.outfit.fromJSON(male);
    }).then(function(outfit){
        male = outfit;
        debugMode && console.log({"male":male});
    }),

//  female.

    db.collection("female").find().forEach(
        function(doc){
            female[doc._id] = doc;
        }, 
        function(err){
            if (err) throw err;
        }
    ).catch(function(err){
        console.error(err);
    }).then(function(){
        return localPlayer.outfit.fromJSON(female);
    }).then(function(outfit){
        female = outfit;
        debugMode && console.log({"female":female});
    }),

//  skeleton.

    db.collection("skeleton")
    .findOne({_id:"body"}, function(err){
        if (err) throw err;
    }).then(function(doc){
        return doc;
    }).catch(function(err){
        console.error(err);
    }).then(function(doc){
        return localPlayer.outfit.fromJSON({skeleton:doc});
    }).then(function(outfit){
        skeleton = outfit.skeleton;
        debugMode && console.log({"skeleton":skeleton});
    }),

]).then(function(){

//  Startup.

//  localPlayerHandler("/turn/back");
    localPlayerHandler("/gender/female");

//  Enable outfit direction visible.
    localPlayer.outfit.direction.visible = true;

//  Hide loading bar.
    if (window.bootbox) window.bootbox.hideAll();

}).catch(function(err){
    console.error(err);
});
