var loader = {
    s: {},

    load: function ( done ) {
        var that = this,
            spritesheet;

        function makeSprite( name, data ) {
            var sprite = that.s[ name ] = {
                img: utils.makeCs(),
                fs: data[ 4 ] || 1
            };

            sprite.img.width = data[ 2 ];
            sprite.img.height = data[ 3 ];

            sprite.w = data[ 2 ] / sprite.fs;
            sprite.h = data[ 3 ];

            sprite.img.getContext( '2d' ).drawImage(
                spritesheet,
                data[ 0 ], data[ 1 ],
                data[ 2 ], data[ 3 ],
                0, 0,
                data[ 2 ], data[ 3 ]
            );
        }

        spritesheet = new Image();
        spritesheet.onload = function () {
            for ( var name in sprites ) makeSprite( name, sprites[ name ] );
            done();
        };
        spritesheet.src = 'img/sprites.png';
    },

    get: function ( name ) {
        return new Sprite( this.s[ name ] );
    }
};