function Map( id ) {
    this._ = 'map';
    this.x = 0;
    this.y = 0;

    this.d = defs.map;
    this.f = defs.mtypes[ Math.floor( id / 4 ) ];

    this.img = loader.s[ this.f.t ].img;

    this.seed = id + 1;
    this.s = 128;
    this.bs = 16;
    this.pads = [];
    this.lakes = [];
    this.trees = [];
    this.guys = [];

    this.c = utils.makeCs();
    this.c.width = this.s * this.bs;
    this.c.height = h / 2;

    this.w = this.s * this.bs * scale;
    this.h = h;

    this.ctx = utils.ctx( this.c );
    utils.dis( this.ctx );

    this.p = this.generate( this.s, h / 2, h / 8, 0.7 );

    this.addChildren();

    this.draw();
}

Map.prototype.render = function ( ctx ) {
    ctx.drawImage( this.c, this.x, this.y, this.w, this.h );
};

Map.prototype.generate = function ( width, height, displace, roughness ) {
    var power = Math.pow( 2, Math.ceil( Math.log( width ) / Math.log( 2 ) ) ),
        points = [],
        s = this.seed,
        d, i, j;

    points[ 0 ] = height / 2 + utils.rnd( s, 1 ) * displace * 2 - displace;
    points[ power ] = height / 2 + utils.rnd( s ) * displace * 2 - displace;

    displace *= roughness;

    for ( i = 1; i < power; i *= 2 ) {
        d = power / i / 2;

        for ( j = d; j < power; j += power / i ) {
            points[ j ] = ( points[ j - d ] + points[ j + d ] ) / 2;
            points[ j ] += utils.rnd( s ) * displace * 2 - displace;
            points[ j ] = points[ j ] > height * 0.9 ? height * 0.9 : points[ j ] < height * 0.2 ? height * 0.2 : points[ j ];
        }

        displace *= roughness;
    }

    return points;
};

Map.prototype.makeChildren = function () {
    var p = [ 5, 64, 123 ];
};

Map.prototype.addChildren = function () {
    var d = this.d;

    d.l.forEach( this.makeLake, this );
    d.p.forEach( this.makePad, this );
    d.t.forEach( this.makeTree, this );
    d.g.forEach( this.makeGuy, this );
};

Map.prototype.makeLake = function ( pt ) {
    var p = this.p,
        avg = Math.round( ( p[ pt - 3 ] + p[ pt - 2 ] + p[ pt - 1 ] + p[ pt ] + p[ pt + 1 ] + p[ pt +
            2 ] + p[
            pt + 3 ] ) / 7 );

    p[ pt - 3 ] = p[ pt + 3 ] = avg;
    p[ pt - 2 ] = p[ pt + 2 ] = avg + 12;
    p[ pt - 1 ] = p[ pt + 1 ] = p[ pt ] = avg + 16;

    this.lakes.push( new Lake( pt * this.bs * scale, avg * scale ) );
};

Map.prototype.makePad = function ( pt ) {
    var p = this.p,
        h = Math.round( p[ pt ] );

    p[ pt - 1 ] = p[ pt + 1 ] = p[ pt ] = h;

    this.pads.push( new Pad( pt * this.bs * scale, h * scale ) );
};

Map.prototype.makeTree = function ( pt ) {
    var i;

    if ( typeof pt == 'string' ) {
        pt = pt.split( '-' );
        for ( i = +pt[ 0 ]; i <= +pt[ 1 ]; i++ ) {
            this.trees.push( new Tree( i * this.bs * scale, this.p[ i ] * scale ) );
        }
    } else {
        this.trees.push( new Tree( pt * this.bs * scale, this.p[ pt ] * scale ) );
    }
};

Map.prototype.makeGuy = function ( pt ) {
    this.guys.push( new Guy( pt * this.bs * scale, Math.round( this.p[ pt ] ) * scale ) );
};

Map.prototype.draw = function () {
    var ctx = this.ctx,
        h = this.c.height;

    ctx.clearRect( 0, 0, this.c.width, h );

    ctx.save();
    ctx.scale( 1 / scale, 1 / scale );
    this.lakes.forEach( function ( lake ) {
        lake.draw( ctx );
    } );
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo( 0, this.p[ 0 ] );

    this.p.forEach( function ( point, i ) {
        ctx.lineTo( i * this.bs, point );
    }, this );

    ctx.lineWidth = 7;
    ctx.strokeStyle = '#' + this.f.l;
    ctx.stroke();

    ctx.lineTo( this.w, h );
    ctx.lineTo( 0, h );
    ctx.closePath();

    ctx.save();
    ctx.shadowColor = '#' + this.f.d;
    ctx.shadowBlur = ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = -2;

    ctx.fillStyle = ctx.createPattern( this.img, 'repeat' );
    ctx.fill();
    ctx.restore();

    var gradient = ctx.createLinearGradient( 0, 2 * h / 3, 0, h );

    gradient.addColorStop( 0, 'rgba(0,0,0,0)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,0.7)' );
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();

    ctx.scale( 1 / scale, 1 / scale );

    this.pads.forEach( function ( child ) {
        child.draw( ctx );
    } );

    this.trees.forEach( function ( child ) {
        child.draw( ctx );
    } );

    ctx.restore();
};

Map.prototype.getHeight = function ( x ) {
    var b = this.bs * scale,
        p1 = ~~ ( ( x + 1 ) / b ),
        h1 = this.p[ p1 ],
        h2 = this.p[ p1 + 1 ] !== undefined ? this.p[ p1 + 1 ] : h1,
        d = ( x + 1 ) % b,
        h;

    if ( x === 0 || d === 0 || h1 === h2 ) return ( h1 - 3 ) * scale;

    h = h1 + ( h2 - h1 ) * d / b;

    return ( h - 3 ) * scale;
};