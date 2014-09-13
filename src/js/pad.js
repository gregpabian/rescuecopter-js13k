function Pad( x, y ) {
    this._ = 'pad';
    this.spr = loader.get( 'pad' );
    this.init( x, y );
}

Pad.prototype = BodyMixin.mix( {
    draw: function ( ctx ) {
        this.spr.render( ctx, this.x, this.y, this.w, this.h );
    }
} );