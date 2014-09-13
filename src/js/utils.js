var utils = {
    h2r: function ( hex ) {
        function dec( h ) {
            return parseInt( h + '' + h, 16 );
        }

        return {
            r: dec( hex[ 0 ] ),
            g: dec( hex[ 1 ] ),
            b: dec( hex[ 2 ] )
        };
    },

    ctx: function ( canvas ) {
        return canvas.getContext( '2d' );
    },

    makeCs: function () {
        return document.createElement( 'canvas' );
    },

    getEl: function ( id ) {
        return document.getElementById( id );
    },

    listen: function ( event, callback, target ) {
        ( target || window ).addEventListener( event, callback );
    },

    timestamp: window.performance && window.performance.now ? function () {
        return window.performance.now();
    } : function () {
        return +new Date();
    },

    dis: function ( ctx ) {
        [ 'mozImageSmoothingEnabled', 'webkitImageSmoothingEnabled',
            'msImageSmoothingEnabled', 'imageSmoothingEnabled'
        ].forEach( function ( name ) {
            ctx[ name ] = false;
        } );
    },

    rngs: {},

    rnd: function ( seed, reset ) {
        var rng;

        function RNG( seed ) {
            this.s = seed;
        }

        RNG.prototype.rnd = function () {
            var result = Math.sin( this.s++ ) * 10000;

            return result - Math.floor( result );
        };

        if ( !( rng = this.rngs[ seed ] ) || reset ) rng = this.rngs[ seed ] = new RNG( seed );

        return rng.rnd();
    },

    rndInt: function ( seed, max ) {
        return Math.floor( this.rnd( seed ) * max );
    },

    rndRange: function ( seed, min, max ) {
        return this.rndInt( seed, max - min ) + min;
    },

    zrs: function ( v ) {
        v = v + '';

        var l = 7 - ( v ).length + 1;

        return ( new Array( l < 0 ? 0 : l ) ).join( '0' ) + v;
    }
};