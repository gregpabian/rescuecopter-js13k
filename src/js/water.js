function Water( parent ) {
    this._ = 'water';
    this.spr = loader.get( 'drop' );
    this.init( parent.x + parent.dir * parent.w / 2, parent.y + parent.h / 4 );

    this.y += this.h / 2;

    this.vx = parent.vx + parent.dir * 2;
    this.vy = parent.vy / 2;

    this.g = 11;
    this.f = 0.01;
}

Water.prototype = BodyMixin.mix( {

    update: function ( dt ) {
        this.spr.update( dt );

        this.vx -= this.vx * this.f;
        this.vy += this.g * dt;

        this.x += this.vx;
        this.y += this.vy;

        if ( this.y > h + this.h / 2 || this.spr.f > this.spr.fs ) this.dead = 1;
    },

    render: function ( ctx ) {
        this.spr.render( ctx, this.x, this.y, this.w, this.h );
    },

    collide: function ( children ) {
        if ( this.spl ) return;

        children.forEach( function ( child ) {
            var type = child._,
                b = this.getBottom(),
                x = this.x,
                y;

            if ( type === 'map' && b > ( y = child.getHeight( x ) ) ) {
                this.splash( y );
            }

            if ( type === 'lake' &&
                x >= child.getLeft() && x <= child.getRight() && b > child.y ) {
                this.splash( child.y );
            }

            if ( type === 'tree' && this.intersects( child ) ) {
                this.splash( child.y - child.h / 2 - 1 );
            }

            if ( ( type === 'flame' || type === 'bird' ) && this.intersects( child ) ) {
                addPts( 10 );
                if ( child.s ) child.s.dead = 1;
                child.dead = 1;
                this.dead = 1;
            }

            if ( type === 'guy' && this.intersects( child ) ) {
                addPts( -50 );
                child.dead = 1;
                this.dead = 1;
            }

        }, this );
    },

    splash: function ( y ) {
        sound.play( 'drop' );
        this.spr = window.splash = loader.get( 'splash' );
        this.spl = 1;
        this.spr.r = 0;
        this.spr.fd = 50;
        this.vx = this.vy = this.g = 0;
        this.init( this.x, y - this.spr.h );
    }
} );