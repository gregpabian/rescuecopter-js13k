var BodyMixin = {
    mix: function ( target ) {
        Object.keys( BodyMixin ).forEach( function ( name ) {
            if ( name === 'mix' ) return;
            target[ name ] = BodyMixin[ name ];
        } );

        return target;
    },

    init: function ( x, y ) {
        this.x = x;
        this.y = y;
        this.w = this.spr.w * scale;
        this.h = this.spr.h * scale;
    },
    getLeft: function () {
        return this.x - this.w / 2;
    },

    getRight: function () {
        return this.x + this.w / 2;
    },

    getTop: function () {
        return this.y - this.h / 2;
    },

    getBottom: function () {
        return this.y + this.h / 2;
    },

    distanceTo: function ( target ) {
        return Math.sqrt(
            ( this.x - target.x ) * ( this.x - target.x ) +
            ( this.y - target.y ) * ( this.y - target.y )
        );
    },

    hasPoint: function ( x, y ) {
        return !( x < this.getLeft() || x > this.getRight() || y < this.getTop() || y > this.getBottom() );
    },

    intersects: function ( target ) {
        return !(
            this.getRight() < target.getLeft() ||
            this.getLeft() > target.getRight() ||
            this.getBottom() < target.getTop() ||
            this.getTop() > target.getBottom()
        );
    },

    mtd: function ( target ) {
        var dl = target.getLeft() - this.getRight(),
            dr = target.getRight() - this.getLeft(),
            dt = target.getTop() - this.getBottom(),
            db = target.getBottom() - this.getTop(),
            x, y;

        if ( dl > 0 || dr < 0 || dt > 0 || db < 0 ) return 0;

        x = Math.abs( dl ) < dr ? dl : dr;
        y = Math.abs( dt ) < db ? dt : db;

        if ( Math.abs( x ) > Math.abs( y ) ) {
            x = 0;
        } else {
            y = 0;
        }

        return {
            x: x,
            y: y
        };
    }
};