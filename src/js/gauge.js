function Gauge( x, y, w, c, m ) {
    this.x = x;
    this.y = y;
    this.s = w / m;
    this.h = 10;
    this.v = 0;
    this.m = m;
    this.c = '#' + c;
}

Gauge.prototype.render = function ( ctx ) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect( this.x, this.y, this.s * this.m, this.h );

    ctx.fillStyle = this.c;
    ctx.fillRect( this.x, this.y, this.s * this.v, this.h );
};