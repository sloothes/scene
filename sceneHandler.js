    function sceneHandler(data){

        switch (data) {

            case "/snapshot/crop":

                var isVip = false;

                if ( isMobile ) {

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

                            if ( !isVip ) {
                                var watermarkUrl = "https://i.imgur.com/MrEaeSc.png";
                                return watermarkedSnapshot( snapshotdata, watermarkUrl );
                            } else {
                                return snapshotdata
                            }

                        }).then(function( snapshotdata ){

                            saveSnapshotDialog( snapshotdata );

                        });

                    });

                } else {

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

                                if ( !isVip ) {
                                    var watermarkUrl = "https://i.imgur.com/MrEaeSc.png";
                                    return watermarkedSnapshot( snapshotdata, watermarkUrl );
                                } else {
                                    return snapshotdata
                                }

                            }).then(function( snapshotdata ){
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

            break;

        }

        return;
    }
