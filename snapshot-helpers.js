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
