function Lake( x, y ) {
    this._ = 'lake';
    this.w = 192;
    this.h = 32;
    this.x = x;
    this.y = y;
}

Lake.prototype = BodyMixin.mix( {
    draw: function ( ctx ) {
        var gradient = ctx.createLinearGradient( this.x, this.y, this.x, ( this.y + this.h ) );

        gradient.addColorStop( 0, '#4bf' );
        gradient.addColorStop( 1, '#06b' );

        ctx.fillStyle = gradient;
        ctx.fillRect( this.getLeft(), this.y, this.w, this.h );
    }
} );