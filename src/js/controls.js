var controls = {
    k: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        btn: 0,
        pause: 0,
        ent: 0
    },

    m: {
        27: 'pause', // esc
        32: 'btn', // space
        65: 'left', // a
        68: 'right', // d
        83: 'down', // s
        87: 'up', // w,
        76: 'btn', // l
        13: 'ent' // enter
    },

    mx: 0,
    my: 0,
    mb: 0
};

utils.listen( 'keydown', function ( event ) {
    var key = controls.m[ event.keyCode ];

    if ( key ) controls.k[ key ] = 1;
} );

utils.listen( 'keyup', function ( event ) {
    var key = controls.m[ event.keyCode ];

    if ( key ) controls.k[ key ] = 0;
} );

utils.listen( 'mousemove', function ( event ) {
    controls.mx = event.offsetX === undefined ? event.layerX : event.offsetX;
    controls.my = event.offsetY === undefined ? event.layerY : event.offsetY;
}, cfg );

utils.listen( 'mousedown', function () {
    controls.mb = 1;
} );

utils.listen( 'mouseup', function () {
    controls.mb = 0;
} );

utils.listen( 'blur', function () {
    for ( var n in controls.k ) controls.k[ n ] = 0;
} );