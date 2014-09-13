function Sprite( data ) {
    this.img = data.img;
    this.w = data.w;
    this.h = data.h;
    this.fs = data.fs;
    this.f = 0;
    this.ft = this.fd = 100;
    this.r = 1;
}

Sprite.prototype.render = function ( ctx, x, y, w, h, s ) {
    w = w || this.w;
    h = h || this.h;
    s = s || 1;

    ctx.drawImage(
        this.img,
        this.w * this.f, 0,
        this.w, this.h,
        x - w * s / 2, y - h * s / 2,
        w * s, h * s
    );
};

Sprite.prototype.update = function ( dt ) {
    if ( this.fs === 1 ) return;

    if ( this.ft > 0 ) this.ft -= dt * 1000;

    if ( this.ft > 0 ) return;

    if ( ++this.f >= this.fs && this.r ) this.f = 0;

    this.ft = this.fd;
};