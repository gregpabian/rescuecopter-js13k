function Button( x, y, text, cb, w, h, d ) {
    this.x = x;
    this.y = y;
    this.cb = cb;
    this.w = w || 200;
    this.h = h || 50;
    this.a = 0; // active
    this.d = d || 0; //disabled
    this.la = 0; // last active

    this.txt = new Label( x, y, text, 4 );
}

Button.prototype = BodyMixin.mix( {
    update: function () {
        if ( this.d ) return;

        this.a = this.hasPoint( controls.mx, controls.my );

        if ( this.a && !this.la ) sound.play( 'click' );
        if ( this.a && controls.mb ) {
            controls.mb = 0;
            this.cb();
        }

        this.la = this.a;
    },

    render: function ( ctx ) {
        ctx.beginPath();

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = this.a ? '#999' : '#666';
        ctx.rect( this.getLeft(), this.getTop(), this.w, this.h );
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        this.txt.render( ctx );
        ctx.restore();

        ctx.strokeStyle = this.a ? '#fff' : '#999';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
} );