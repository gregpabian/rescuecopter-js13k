function Smoke( x, y ) {
    this._ = 'smoke';
    this.x = x;
    this.y = y / 2;

    this.w = loader.s.flame.w * scale;
    this.h = y;

    this.a = 1;
    this.p = [];

    this.st = 0;
    this.ms = 500;
}

Smoke.prototype = BodyMixin.mix( {
    update: function ( dt ) {
        var len = this.p.length,
            p;

        while ( len-- ) {
            p = this.p[ len ];
            if ( p.y < 0 ) {
                this.p.splice( len, 1 );
            } else {
                p.update( dt );
            }
        }

        this.st += dt * 1000;

        if ( this.st > this.ms ) {
            this.p.push( new SmokeParticle( this.x, this.h, this.w ) );
            this.st = 0;
        }
    },

    render: function ( ctx ) {
        if ( this.x > player.x + w || this.x < player.x - w ) return;

        ctx.fillStyle = '#999';
        this.p.forEach( function ( particle ) {
            particle.render( ctx );
        } );
    }
} );

function SmokeParticle( x, y, w ) {
    this.x = Math.round( x + ( Math.random() * w - w / 2 ) );
    this.y = this.sy = y;
    this.s = this.ss = 4;
    this.ms = 16;
    this.l = 0;
    this.vy = Math.round( Math.random() * 2 ) * 0.5 + 0.5;
}

SmokeParticle.prototype.update = function () {
    this.l = 1 - this.y / this.sy;
    if ( this.l < 0 ) this.l = 0;
    this.s = Math.round( this.ss + ( this.ms - this.ss ) * this.l );
    this.a = 1 - this.l;
    this.y = this.y - this.vy;
};

SmokeParticle.prototype.render = function ( ctx ) {
    var s = this.s;

    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.beginPath();
    ctx.fillRect( Math.round( this.x - s / 2 ), Math.round( this.y - s / 2 ), s, s );
    ctx.restore();
};