var sound = {
    s: {},

    mute: 0,

    setMute: function ( val ) {
        this.mute = val;
        localStorage.setItem( 'copter-mute', val );
    },

    play: function ( name ) {
        if ( this.mute ) return;

        var s = sound.s[ name ];

        s.p[ s.t ].play();
        s.t = s.t + 1 < s.c ? s.t + 1 : 0;
    }
};

sound.mute = +localStorage.getItem( 'copter-mute' ) || 0;

Object.keys( defs.sounds ).forEach( function ( name ) {
    var s = defs.sounds[ name ],
        a, i;

    sound.s[ name ] = {
        t: 0,
        c: s.c,
        p: []
    };

    for ( i = 0; i < s.c; i++ ) {
        a = new Audio();
        a.src = jsfxr( s.s );
        sound.s[ name ].p.push( a );
    }
} );