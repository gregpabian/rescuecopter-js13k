function Flame( x, y ) {
    this._ = 'flame';
    this.spr = loader.get( 'flame' );
    this.spr.f = ~~ ( Math.random() * this.spr.fs );
    this.init( x, y );
    this.s = new Smoke( x, y );
    states.play.c.push( this.s );
}

Flame.prototype = BodyMixin.mix( {
    render: function ( ctx ) {
        if ( this.x > player.x + w || this.x < player.x - w ) return;
        this.spr.render( ctx, this.x, this.y, this.w, this.h );
    },

    update: function ( dt ) {
        this.spr.update( dt );
    }
} );