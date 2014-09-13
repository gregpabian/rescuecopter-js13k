function Timer( time ) {
    this.v = this.t = time;
    this.write();
}

Timer.prototype.write = function () {
    var m = ~~ ( this.v / 60 ),
        s = Math.abs( this.v - m * 60 );

    s = ( s < 10 ? '0' : '' ) + s;
    s = s.length > 3 ? s.substr( 0, 4 ) : s + '.0';

    this.txt = m + ':' + s;
};

Timer.prototype.update = function ( dt ) {
    this.v -= dt;
    if ( this.v < 0 ) this.v = 0;
    this.write();
};