/**
 * @constructor
 */
function Label( x, y, text, scl, color ) {
    this.x = x;
    this.y = y;
    this.s = scl || scale;
    this.spr = loader.get( 'font' );
    this.set( text, color );
}

Label.prototype.chars = 'abcdefghijklmnopqrstuvwxyz1234567890!?".,\'$()-:;=[]/';

Label.prototype.set = function ( text, color ) {
    this.txt = String( text ).toLowerCase().split( '' );
    this.clr = utils.h2r( color || 'fff' );
    this.write();
};

Label.prototype.write = function () {
    var s = this.spr,
        imageData,
        data,
        ctx,
        i;

    this.c = utils.makeCs();
    this.c.width = this.txt.length * 4 - 1; // 3 px for a char + 1px of space between chars
    this.c.height = s.h;
    ctx = utils.ctx( this.c );

    this.txt.forEach( function ( c, idx ) {
        i = this.chars.indexOf( c );

        if ( i > -1 ) ctx.drawImage( s.img, i * 3, 0, 3, s.h, idx * 4, 0, 3, s.h );
    }, this );

    imageData = ctx.getImageData( 0, 0, this.c.width, s.h );
    data = imageData.data;

    for ( i = 0; i < data.length; i += 4 ) {
        data[ i ] = this.clr.r;
        data[ i + 1 ] = this.clr.g;
        data[ i + 2 ] = this.clr.b;
    }

    ctx.putImageData( imageData, 0, 0 );

    this.w = this.c.width * this.s;
    this.h = s.h * this.s;
};

Label.prototype.render = function ( ctx ) {
    ctx.drawImage( this.c, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h );
};