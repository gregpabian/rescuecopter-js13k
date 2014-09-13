function Tree( x, y ) {
    this._ = 'tree';
    this.spr = loader.get( 'tree' );
    this.init( x, y );
    this.y -= this.h / 2;

    states.play.c.push( new Flame( x, this.y - this.h / 2 - 6 ) );
}

Tree.prototype = BodyMixin.mix( {
    draw: function ( ctx ) {
        this.spr.render( ctx, this.x, this.y, this.w, this.h );
    }
} );