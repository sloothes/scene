    function sceneHandler(data){

        var isVip = false;

        switch (data) {

            case "/snapshot/crop":

                if ( isMobile ) {
                    mobileSnapshot();
                } else {
                    desktopSnapshot();
                }

            break;

            case "/product/crop":

                return productSnapshot();

            break;

        }

        return;
    }

    function mobileSnapshot(){

        var width  = $(window).width();
        var height = $(window).height();

        var options = {};
        options.setSelect = [ 0, 0, width, height ];
        options.minSize = [ width, height ];
        options.maxSize = [ width, height ];
        options.onChange = function(coords){};
        options.onSelect = function(coords){};
        options.onRelease = function(){};

        $(renderer.domElement).Jcrop(options, function(){

            var jcropper = this;
            new Promise( function(resolve, reject){
                var selection = jcropper.tellSelect();
                var scaletion = jcropper.tellScaled();
                var img = renderer.domElement;
                var sourceX = selection.x;
                var sourceY = selection.y;
                var sourceWidth = img.width;
                var sourceHeight = img.height;
                var x = 0, y = 0;
                var width = $(window).width();
                var height = $(window).height();
                var canvas = document.createElement( "canvas" );
                var ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(
                    img,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    x, y,
                    width,
                    height
                );

                resolve( canvas );

            }).then(function( canvas ){

                jcropper.destroy();
                var element = renderer.domElement;
                var container = document.getElementById("scene-container");
                $(container).append(element);
                return canvas.toDataURL("image/jpeg");

            }).then(function( snapshotdata ){

            //  TODO: sloothes watermark.
            /*
                if ( !isVip ) {
                    var watermarkUrl = "https://i.imgur.com/MrEaeSc.png";
                    return watermarkedSnapshot( snapshotdata, watermarkUrl );
                }
            */
                return snapshotdata;

            }).then(function( snapshotdata ){

            //  from "/scene/snapshot-helpers.js".
                saveSnapshotDialog( snapshotdata );

            });

        });
    }

    function desktopSnapshot(){

        var width  = 375; // 420;
        var height = 570; // 570;

        var options = {
            aspectRatio: width / height,
            setSelect: [
                (renderer.domElement.width * 0.5)  - (width * 0.5),
                (renderer.domElement.height * 0.5) - (height * 0.5),
                (renderer.domElement.width * 0.5)  + (width * 0.5),
                (renderer.domElement.height * 0.5) + (height * 0.5),
            ],
            minSize: [width, height],
            maxSize: [width, height],
            onChange: function(coords){},
            onSelect: function(coords){},
            onRelease: function(){
                this.exit();
            },
        };

        $(renderer.domElement).Jcrop(options, function(){

            var container = document.getElementById("scene-container");
            var jcrop_tracker = $(container).find(".jcrop-tracker").get(0);
            $(jcrop_tracker).addClass("middle");
            $(jcrop_tracker).append(`<div id="crop-button" class="btn btn-primary">Crop</div>`);

            this.exit = exit;
            this.crop = crop;
            var jcropper = this;

            $(container).find("#crop-button").on( "click", function(){

                jcropper.crop(renderer.domElement).then(function( canvas ){

                    jcropper.exit();
                    $("img#loading").removeClass("hidden");
                    return canvas.toDataURL("image/jpeg");

                }).then(function( snapshotdata ){

                //  TODO: sloothes watermark.
                /*
                    if ( !isVip ) {
                        var watermarkUrl = "https://i.imgur.com/MrEaeSc.png";
                    //  from "/scene/snapshot-helpers.js".
                        return watermarkedSnapshot( snapshotdata, watermarkUrl );
                    }
                */
                    return snapshotdata;

                }).then(function( snapshotdata ){

                //  from "/scene/snapshot-helpers.js".
                    saveSnapshotDialog( snapshotdata );

                });

            });

            function crop(img){
                return new Promise( function(resolve, reject){
                    var selection = jcropper.tellSelect();
                    var scaletion = jcropper.tellScaled();
                    var sourceX = selection.x;
                    var sourceY = selection.y;
                    var sourceWidth = selection.w;
                    var sourceHeight = selection.h;
                    var x = 0, y = 0;
                    var width = selection.w;
                    var height = selection.h;
                    var canvas = document.createElement( "canvas" );
                    var ctx = canvas.getContext("2d");
                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(
                        img,
                        sourceX,
                        sourceY,
                        sourceWidth,
                        sourceHeight,
                        x, y,
                        width,
                        height
                    );

                    resolve( canvas );
                });
            }

            function exit(){
                this.destroy();
                $(container).append(renderer.domElement);
            };

        });
    }

    function productSnapshot(){

        return new Promise(function(resolve, reject){

            var width  = 570; // 600;
            var height = 570; // 600;

            var options = {

            //  aspectRatio: width / height,

                setSelect: [
                    (renderer.domElement.width * 0.5)  - (width * 0.5),
                    (renderer.domElement.height * 0.5) - (height * 0.5),
                    (renderer.domElement.width * 0.5)  + (width * 0.5),
                    (renderer.domElement.height * 0.5) + (height * 0.5),
                ],

            //  minSize: [width, height],
            //  maxSize: [width, height],

                onChange: function(coords){},
                onSelect: function(coords){},
                onRelease: function(){
                    this.exit();
                },

            };


            $(renderer.domElement).Jcrop(options, function(){

                var container = document.getElementById("scene-container");
                var jcrop_tracker = $(container).find(".jcrop-tracker").get(0);
                $(jcrop_tracker).addClass("middle");
                $(jcrop_tracker).append(`<div id="crop-button" class="btn btn-primary">Crop</div>`);

                this.exit = exit;
                this.crop = crop;
                var jcropper = this;

                $(container).find("#crop-button").on( "click", function(){

                    jcropper.crop(renderer.domElement).then(function( canvas ){

                        jcropper.exit();
                        $("img#loading").removeClass("hidden");
                        return canvas.toDataURL("image/jpeg");

                    }).then(function( snapshotdata ){

                        resolve( snapshotdata ); // resolve promise.

                    });

                });

                function crop(img){
                    return new Promise( function(resolve, reject){
                        var selection = jcropper.tellSelect();
                        var scaletion = jcropper.tellScaled();
                        var sourceX = selection.x;
                        var sourceY = selection.y;
                        var sourceWidth = selection.w;
                        var sourceHeight = selection.h;
                        var x = 0, y = 0;
                        var width = selection.w;
                        var height = selection.h;
                        var canvas = document.createElement( "canvas" );
                        var ctx = canvas.getContext("2d");
                        canvas.width = width;
                        canvas.height = height;

                        ctx.drawImage(
                            img,
                            sourceX,
                            sourceY,
                            sourceWidth,
                            sourceHeight,
                            x, y,
                            width,
                            height
                        );

                        resolve( canvas );
                    });
                }

                function exit(){
                    this.destroy();
                    $(container).append(renderer.domElement);
                };

            });

        }).then(function(dataUrl){
            return dataUrl;
        });

    }




//  /scene/snapshot-helpers.js.

    function saveSnapshotDialog( data ){
        $(".snapshot-spinner").remove();
        var dialog = bootbox.dialog({
            className: "middle",
            closeButton: false,
            message: `<img src="${data}" id="snapshot-preview" class="img-thumbnail" style="width:325px;">`,
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default pull-left',
                    callback: function(){
                        $("img#loading").addClass("hidden");
                    }
                },
                imgur: {
                    label: 'Upload',
                    className: 'btn-success',
                    callback: function(){
                        var options = {};
                        uploadBase64( options ).then(function( imgurUrl ){
                            successCallback( imgurUrl );
                            $("img#loading").addClass("hidden");
                        });
                    }
                },
                save: {
                    label: 'Save',
                    className: 'btn-primary',
                    callback:  function(){
                        saveToDesktop();
                    }
                },
            }

        });

        function saveToDesktop(){
            return new Promise( function(resolve, reject){
                data.replace("image/jpeg", "image/octet-stream");
                var a = document.createElement("a");
                $(a).one("click", function(){
                    resolve();
                    $(this).remove();
                });
                a.download = ["snapshot", Date.now().toString(36)].join("-") + ".jpg";
                a.href = data;
                a.click();
            });
        }

        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }

        function uploadBase64( options ){

            var type = "image/jpeg";
            var data = $("#snapshot-preview").attr("src").replace("data:image/jpeg;base64,", "");
            var name = options.name || Date.now().toString(36);
            var filename = name + ".jpg"
            var title = options.title || "sloothes snapshot";
            var description = options.description || "Avatar snapshot direct from https://sloothes.com #anywhere3d";

            return new Promise( function(resolve, reject){

                var formdata = new FormData();
                formdata.append("type",  type);
                formdata.append("image", data);
                formdata.append("name",  filename);
                formdata.append("title", title);
                formdata.append("description", description);
                var clientid = "95e1ecaf14ca5e6";
                var endpoint = "https://api.imgur.com/3/image";
                var xhttp = new XMLHttpRequest();
                xhttp.open('POST', endpoint, true);
                xhttp.setRequestHeader('Authorization', 'Client-ID ' + clientid);
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        var response = "";
                        if (this.status >= 200 && this.status < 300) {
                            response = JSON.parse(this.responseText);
                            resolve( response ); // resolve promise.
                        } else {
                            var err = JSON.parse(this.responseText).data.error;
                            console.error( err.type, err );
                            var errmsg = `<h2 style="margin:0;">${err.type}</h2><br>${err.message.replace(". ", ".<br>")}`;
                            return bootboxErrorAlert(errmsg);
                        //  throw Error( err );
                        }
                    }
                };

                xhttp.send(formdata);
                xhttp = null;

            }).then( function( response ){

                var url = "/gallery/insert";
                var data = response.data;
                data._id = ObjectId();

            //  Add to cache.
                caches.open("gallery").then(function(cache){
                    cache.add(data.link);
                });

            //  Insert to indexedDB.
                db.open(function(err, database){
                    if (err) console.error( err );
                }).then( function(){

                    var collection = db.collection("gallery");
                    collection.insert( data, function(err){
                        if (err) throw err;
                    }).catch(function (err) {
                        throw err;
                    });

                }).catch(function (err) {
                    throw err;
                });


            //  Upload to gallery.

            /*
                $.ajax({

                    url: url,
                    data: data,
                    method: "POST",

                }).then( function( results ){

                    $("img#loading").addClass("hidden");
                    return results.success;

                }).done( function( success ){

                    data._id = success.insertedIds[0];

                }).fail(function(response){

                    debugMode && console.log(response);
                    failureCallback(response.responseText || response.statusText);
                });
            */

                return data.link;

            }).catch(function (err) {
                console.error("SnapshotUploadError:", err);
            });

        }

        function successCallback( url ){
            bootbox.confirm({
                size: "small",
                className: "middle",
                title: `<div class="alert-icon icon-success"></div><b>Snapshot uploaded successfully.</b>`,
                message: `<b>url: </b><span><a href="${url}" target="_blank">${url}</a></span>`,
                buttons: {
                    cancel: {
                        label: 'Close',
                        className: 'btn-default',
                    },
                    confirm: {
                        label: 'Open image',
                        className: 'btn-primary',
                    }
                },
                callback: function ( result ) {
                    if ( result ) window.open( url );
                }
            });
        }

        function failureCallback( html ){
            bootbox.dialog({
                size: "small",
                className: "middle",
                title: `<div class="alert-icon icon-error"></div><h2 style="margin:auto;">Error!</h2>`,
                message: html,
                buttons: {
                    cancel: {
                        label: 'Close',
                        className: 'btn-default',
                    },
                }
            });
        }

    }

/*    
    function watermarkedSnapshot( dataurl, wmUrl ){
        return new Promise( function(resolve, reject){
            var wm = new Watermark();
            var wmOptions = {
                position: [1,1],
                scale:   0.5,
                opacity: 1.0,
            };
            wm.setPicture( dataurl );
            wm.addWatermark(wmUrl, wmOptions);
            wm.render( function(){
                debugMode && console.log( "watermark.getImgs:", wm.getImgs( "image/jpeg", 0.9 ) );
                resolve( wm.getDataUrls( "image/jpeg", 0.9 )[0] );
            });
        });
    }
*/







