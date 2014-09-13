function Guy( x, y ) {
    this._ = 'guy';
    this.spr = loader.get( 'guy' );
    this.spr.f = ~~ ( Math.random() * this.spr.fs );
    this.init( x, y );

    this.y -= this.h / 2 + 6;
}

Guy.prototype = BodyMixin.mix( {
    render: function ( ctx ) {
        if ( this.x > player.x + w || this.x < player.x - w ) return;
        this.spr.render( ctx, this.x, this.y, this.w, this.h );
    },

    update: function ( dt ) {
        this.spr.update( dt );
    }
} );