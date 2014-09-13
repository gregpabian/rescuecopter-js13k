function Copter( x, y ) {
    this._ = 'copter';
    this.spr = loader.get( 'copter' );

    this.init( x, y );

    this.vx = 0;
    this.vy = 0;

    this.dir = 1;
    this.a = 12;
    this.f = 0.07;
    this.dc = 100;
    this.dt = 0;
    this.st = this.sc = 250;
    this.bc = this.bt = 100;

    this.ppl = 0;
    this.mPpl = 5;
    this.wtr = 0;
    this.mWtr = 50;
    this.hp = 100;

    this.kills = 0;

    this.onWater = 0;
    this.onPad = 0;
    this.onDmg = 0;

    this.c = utils.makeCs();
    this.c.width = this.w;
    this.c.height = this.h;
    this.ctx = utils.ctx( this.c );
    utils.dis( this.ctx );
}

Copter.prototype = BodyMixin.mix( {
    update: function ( dt ) {
        this.spr.update( dt );

        var dirX = 0,
            dirY = 0;

        if ( this.dt > 0 ) this.dt -= dt * 1000;
        if ( this.bt > 0 ) this.bt -= dt * 1000;

        this.snd( dt );

        if ( controls.k.up ) dirY--;
        if ( controls.k.down ) dirY++;
        if ( controls.k.left ) dirX--;
        if ( controls.k.right ) dirX++;
        if ( controls.k.btn ) this.drop();

        if ( this.onWater ) this.pump();
        if ( this.onPad ) this.unload();
        if ( this.onDmg ) this.hurt();

        if ( dirX && this.dir !== dirX ) {
            this.dir = dirX;
            this.flip();
        }

        this.vx += dirX * this.a * dt - this.vx * this.f;
        this.vy += dirY * this.a * dt - this.vy * this.f;

        this.x += this.vx;
        this.y += this.vy;

        this.x = this.x < 0 + this.w / 2 ?
            0 + this.w / 2 :
            this.x > map.w - this.w / 2 ? map.w - this.w / 2 : this.x;

        this.y = this.y < 0 + this.h / 2 ?
            0 + this.h / 2 :
            this.y > map.h ? map.h : this.y;
    },

    drop: function () {
        if ( this.dt > 0 || !this.wtr || this.onWater ) return;

        this.dt = this.dc;

        states.play.c.push( new Water( this ) );
        this.wtr--;
        if ( this.wtr < 0 ) this.wtr = 0;
    },

    pump: function () {
        if ( this.wtr === this.mWtr ) return;
        this.wtr++;
    },

    unload: function () {
        if ( this.ppl > 0 ) {
            this.ppl--;
            addPts( 20 );
        }
    },

    hurt: function () {
        if ( this.bt > 0 ) return;

        this.hp--;
        sound.play( 'hurt' );

        if ( this.hp <= 0 ) this.dead = 1;

        this.bt = this.bc;
    },

    snd: function ( dt ) {
        this.st -= dt * 1000;

        if ( this.st <= 0 ) {
            sound.play( 'copter' );
            this.st = this.sc;
        }
    },

    renderFrame: function () {
        this.spr.render( this.ctx, this.w / scale, this.h / scale, this.w, this.h );
    },

    flip: function () {
        this.ctx.clearRect( 0, 0, this.w, this.h );
        this.ctx.translate( this.w, 0 );
        this.ctx.scale( -1, 1 );

        this.renderFrame();
    },

    render: function ( ctx ) {
        this.renderFrame();
        ctx.drawImage( this.c, this.x - this.w / scale, this.y - this.h / scale );
    },

    collide: function ( children ) {
        this.onPad = 0;
        this.onWater = 0;
        this.onDmg = 0;

        children.forEach( function ( child ) {
            var type = child._,
                b = this.getBottom(),
                l, c, r, v;

            if ( type === 'map' ) {
                l = child.getHeight( this.getLeft() );
                c = child.getHeight( this.x );
                r = child.getHeight( this.getRight() );

                if ( b > l || b > c || b > r ) {
                    this.y = Math.min( l, c, r ) - this.h / 2;
                }
            } else if ( this.distanceTo( child ) > w / 2 ) return;

            if ( type === 'lake' && b > child.y && this.getLeft() >= child.getLeft() && this.getRight() <= child.getRight() ) {
                this.y = child.y - this.h / 2;
                this.onWater = 1;
            }

            if ( type === 'tree' && ( v = this.mtd( child ) ) ) {
                this.x += v.x;
                this.y += v.y;

                if ( v.x ) {
                    this.vx *= -1;
                } else if ( v.y ) {
                    this.vy *= -1;
                }
            }

            if ( type === 'pad' && b >= child.getTop() && this.x > child.getLeft() && this.x < child.getRight() ) {
                this.onPad = 1;
            }

            if ( ( type === 'flame' || type === 'smoke' || type === 'bird' ) && this.intersects( child ) ) {
                if ( type === 'bird' ) child.dead = 1;
                this.onDmg = 1;
            }

            if ( type === 'guy' && this.intersects( child ) && this.ppl < this.mPpl ) {
                sound.play( 'pick' );
                child.dead = 1;
                this.ppl++;
            }

        }, this );
    }
} );