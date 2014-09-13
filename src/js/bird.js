function Bird( x ) {
    this._ = 'bird';
    this.spr = loader.get( 'bird' );
    this.spr.f = ~~ ( Math.random() * this.spr.fs );
    this.vx = 1;
    this.lvl = Math.random() * 100 + 50;
    this.init( x, map.getHeight( x ) - this.l );
}

Bird.prototype = BodyMixin.mix( {
    update: function ( dt ) {
        this.spr.update( dt );

        this.x -= this.vx;
        if ( this.x < this.w / 2 ) this.dead = 1;

        this.y = Math.round( map.getHeight( this.x ) - this.lvl );
        if ( this.y < 20 ) this.y = 20;
    },

    render: function ( ctx ) {
        this.spr.render( ctx, this.x, this.y, 0, 0, 2 );
    }
} );