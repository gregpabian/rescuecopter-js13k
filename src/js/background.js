function Background( map ) {
    this.c = utils.makeCs();
    this.c.width = this.w = map.w / 2;
    this.c.height = this.h = map.h;
    this.s = map.seed;
    this.ctx = utils.ctx( this.c );
    this.draw( defs.bgs[ map.f.b || 0 ] );
}

Background.prototype.draw = function ( cols ) {
    var gradient = this.ctx.createLinearGradient( 0, 0, 0, this.h ),
        count = ~~ ( this.w * this.h / 2000 ),
        s = this.s,
        size,
        x,
        y,
        i;

    cols.forEach( function ( color, index ) {
        gradient.addColorStop( index / ( cols.length - 1 ), '#' + color );
    } );

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect( 0, 0, this.w, this.h );

    utils.rnd( s, 1 );

    for ( i = 0; i < count; i++ ) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, ' + utils.rnd( s ) * 0.5 + ')';
        size = ~~ ( utils.rnd( s ) * 3 ) + 1;
        x = utils.rnd( s ) * this.w;
        y = utils.rnd( s ) * this.h;
        this.ctx.fillRect( ~~x, ~~y, size, size );
    }
};