var cm = utils.getEl( 'cm' ),
    cbg = utils.getEl( 'cbg' ),
    cfg = utils.getEl( 'cfg' ),
    wrap = utils.getEl( 'wrap' ),
    w = cm.width = cfg.width = cbg.width = wrap.width = defs.width,
    h = cm.height = cfg.height = cbg.height = wrap.height = defs.height,
    ctx = utils.ctx( cm ),
    ctxbg = utils.ctx( cbg ),
    ctxfg = utils.ctx( cfg ),
    scr = {
        x: 0,
        y: 0,
        ox: 0,
        oy: 0
    },

    scale = 2,
    step = 1 / 60,
    dt = 0,
    last,

    states = {},
    state = '',

    level = 0,
    loaded = 0,
    tutorial = 1,
    points = 0,
    lastPoints = 0,
    bMute,
    player,
    map,
    bg;

utils.dis( ctx );
utils.dis( ctxbg );
utils.dis( ctxfg );

wrap.style.cssText = 'width:' + w + 'px;height:' + h + 'px;margin:-' + ( h / 2 ) + 'px 0 0 -' + ( w / 2 ) + 'px;';

function setState( name ) {
    state = name;
    states[ state ].init();
}

/**
 * Menu
 */
states.menu = {
    init: function () {
        if ( !loaded ) {
            this.l = loader.get( 'logo' );
            this.ln = new Label( w / 2, h / 2 + 90, 'pixel chinchilla studio', 4 );
            this.ls = new Label( w / 2, h / 2 + 112, 'presents', 2 );
            this.lt = 0;
        }

        level = points = lastPoints = 0;

        ctx.globalAlpha = loaded ? 1 : 0;

        this.bStart = new Button( w / 2, 265, 'start', replay );

        this.bCredits = new Button( w / 2, 335, 'credits', function () {
            setState( 'credits' );
        } );

        this.bg = new Background( {
            w: w * 2,
            h: h,
            seed: 1,
            f: {}
        } );

        this.ui = [
            new Label( w / 2, 100, 'rescue copter', 12 ),
            new Label( w / 2, 155, 'to the rescue!', 4, '9cf' ),
            this.bStart,
            this.bCredits,
            new Label( 45, 465, 'controls:' ),
            new Button( 80, 510, 'w', 0, 40, 40, 1 ),
            new Button( 80, 560, 's', 0, 40, 40, 1 ),
            new Button( 30, 560, 'a', 0, 40, 40, 1 ),
            new Button( 130, 560, 'd', 0, 40, 40, 1 ),
            new Button( 265, 560, 'space / l', 0, 170, 40, 1 ),
            new Button( 415, 560, 'esc', 0, 70, 40, 1 ),
        ];
    },

    update: function ( dt ) {
        if ( loaded ) {
            this.bStart.update();
            this.bCredits.update();

            if ( controls.k.ent ) {
                controls.k.ent = 0;
                replay();
            }
        } else {
            if ( ctx.globalAlpha < 1 ) ctx.globalAlpha += 5 * dt;

            this.lt += dt;

            if ( this.lt > 1 && !this.s ) {
                sound.play( 'points' );
                this.s = 1;
            }

            if ( this.lt > 3 ) {
                loaded = 1;
            }
        }
    },

    render: function () {
        if ( loaded ) {
            ctxbg.drawImage( this.bg.c, 0, 0 );
            this.ui.forEach( function ( elem ) {
                elem.render( ctxfg );
            } );
        } else {
            this.l.render( ctx, w / 2, h / 2, 0, 0, 4 );
            this.ln.render( ctx );
            if ( this.lt > 1 ) this.ls.render( ctx );
        }
    }
};

/**
 * Gameplay
 */
states.play = {
    init: function () {
        this.c = [];

        points = lastPoints;

        map = new Map( level );
        bg = new Background( map );
        player = new Copter( map.pads[ 0 ].x, map.pads[ 0 ].y );

        this.bt = Math.ceil( Math.random() * 6 ) * 500;

        this.tmr = new Timer( 60 );

        ctx.globalAlpha = 1;

        this.c.unshift( map );
        this.c = this.c.concat( map.pads, map.lakes, map.trees, map.guys );

        this.ppl = map.guys.length;

        this.c.push( player );

        if ( tutorial ) {
            this.ttr = [
                new Label( w / 2, 100, '- fill your water tank in a lake' ),
                new Label( w / 2, 120, '- put out the fire' ),
                new Label( w / 2, 140, '- pick up the survivors' ),
                new Label( w / 2, 160, '- unload the survivors on landing pads' ),
                new Label( w / 2, 180, '- avoid flames, smokes and birds' ),
                new Label( w / 2, 200, 'good luck!' )
            ];
        }

        this.gWtr = new Gauge( 75, 545, 100, '4bf', player.mWtr );
        this.gPpl = new Gauge( 75, 560, 100, '090', player.mPpl );
        this.gPh = new Gauge( 75, 575, 100, 'c00', player.hp );
        this.lPts = new Label( 63, 20, points, 4 );
        this.lTmr = new Label( w / 2, 25, this.tmr.txt, 6 );

        this.ui = [
            new Label( 36, 550, 'water' ),
            new Label( 40, 565, 'people' ),
            new Label( 40, 580, 'health' ),
            this.lPts, this.lTmr, this.gWtr, this.gPpl, this.gPh
        ];
    },

    update: function ( dt ) {
        var c = this.c,
            i = c.length,
            ch;

        if ( !this.tmr.v ) player.dead = 1;

        while ( i-- ) {
            ch = this.c[ i ];
            if ( ch.dead ) {
                if ( ch._ === 'guy' ) this.ppl--;
                c.splice( i, 1 );
            }
        }

        c.forEach( function ( child ) {
            if ( child.update ) child.update( dt );
            if ( child.collide ) child.collide( c );
        } );

        this.tmr.update( dt );

        this.gWtr.v = player.wtr;
        this.gPpl.v = player.ppl;
        this.gPh.v = player.hp;
        this.lPts.set( utils.zrs( points ) );
        this.lTmr.set( this.tmr.txt, this.tmr.v < 15 ? 'c00' : this.tmr.v < 30 ? 'ff0' : 'fff' );

        this.updateScreen( dt );

        if ( !this.ppl && !player.ppl ) done();
        if ( player.dead ) over();
        if ( controls.k.pause ) pause();

        this.bt -= dt * 1000;
        if ( this.bt <= 0 ) {
            this.c.push( new Bird( player.x + w ) );
            this.bt = Math.ceil( Math.random() * 6 ) * 1000;
        }

        if ( tutorial && player.x > w ) tutorial = 0;
    },

    updateScreen: function ( dt ) {
        var px = player.x,
            py = player.y,
            mx, my;

        if ( px < w / 2 ) {
            mx = px / w;
        } else if ( px > map.w - w / 2 ) {
            mx = 1 - ( map.w - px ) / w;
        } else {
            mx = 0.5;
        }

        if ( py < h / 2 ) {
            my = py / h;
        } else if ( py > map.h - h / 2 ) {
            my = 1 - ( map.h - py ) / h;
        } else {
            my = 0.5;
        }

        scr.x += ( ( w * mx - px ) - scr.x ) * dt;
        scr.y += ( ( h * my - py ) - scr.y ) * dt;
    },

    render: function () {
        this.c.forEach( function ( child ) {
            if ( child.render ) child.render( ctx );
        } );

        this.ui.forEach( function ( elem ) {
            elem.render( ctxfg );
        } );

        ctxbg.save();
        ctxbg.translate( ~~( scr.x / 4 ), 0 );
        ctxbg.drawImage( bg.c, 0, 0 );
        ctxbg.restore();

        if ( tutorial ) {
            this.ttr.forEach( function ( elem ) {
                elem.render( ctxfg );
            } );
        }
    }
};

/**
 * Pause
 */
states.pause = {
    init: function () {
        this.bReturn = new Button( w / 2, 265, 'resume', resume );
        this.bRestart = new Button( w / 2, 335, 'restart', replay );
        this.bMenu = new Button( w / 2, 405, 'main menu', menu );

        this.ui = [
            new Label( w / 2, 100, 'game paused', 8 ),
            this.bMenu,
            this.bRestart,
            this.bReturn
        ];

        ctx.globalAlpha = 0;
    },

    update: function ( dt ) {
        if ( controls.k.pause || controls.k.ent ) return resume();
        this.bMenu.update();
        this.bRestart.update();
        this.bReturn.update();



        if ( ctx.globalAlpha < 1 ) ctx.globalAlpha += dt * 5;
    },

    render: function () {
        ctxbg.drawImage( this.bg, 0, 0 );
        ctx.drawImage( this.over, 0, 0 );
        this.ui.forEach( function ( elem ) {
            elem.render( ctxfg );
        } );
    }
};

/**
 * Game over
 */
states.over = {
    won: false,
    init: function () {
        this.bRestart = new Button( w / 2, 265, 'restart', restart );
        this.bMenu = new Button( w / 2, 335, 'main menu', menu );

        this.ui = [
            new Label( w / 2, 100, this.won ? 'congratulations' : 'game over', 8 ),
            new Label( w / 2, 150, 'your score: ' + utils.zrs( points ), 4, '9cf' ),
            this.bRestart,
            this.bMenu
        ];

        ctx.globalAlpha = 0;
    },

    update: function ( dt ) {
        if ( ctx.globalAlpha < 1 ) ctx.globalAlpha += dt * 5;
        this.bRestart.update();
        this.bMenu.update();
    },

    render: function () {
        ctxbg.drawImage( this.bg, 0, 0 );
        ctx.drawImage( this.over, 0, 0 );
        this.ui.forEach( function ( elem ) {
            elem.render( ctxfg );
        } );
    }
};

/**
 * Next level
 */
states.next = {
    init: function () {
        this.bReturn = new Button( w / 2, 265, 'next level', nextLevel );
        this.bRestart = new Button( w / 2, 335, 'restart', replay );
        this.bMenu = new Button( w / 2, 405, 'main menu', menu );

        this.ui = [
            new Label( w / 2, 100, 'level complete', 8 ),
            this.bMenu,
            this.bRestart,
            this.bReturn
        ];

        ctx.globalAlpha = 0;
    },

    update: function ( dt ) {
        this.bMenu.update();
        this.bRestart.update();
        this.bReturn.update();

        if ( ctx.globalAlpha < 1 ) ctx.globalAlpha += dt * 5;
        if ( controls.k.ent ) {
            controls.k.ent = 0;
            nextLevel();
        }
    },

    render: function () {
        ctxbg.drawImage( this.bg, 0, 0 );
        ctx.drawImage( this.over, 0, 0 );
        this.ui.forEach( function ( elem ) {
            elem.render( ctxfg );
        } );
    }
};

/**
 * Credits
 */
states.credits = {
    init: function () {
        this.bJS13 = new Button( w / 2, 430, 'js13kgames.com', function () {
            location.href = 'http://js13kgames.com';
        }, 250 );
        this.bClose = new Button( w / 2, 500, 'close', menu, 110 );
        this.ui = [
            new Label( w / 2, 50, 'rescue copter', 8 ),
            new Label( w / 2, 90, 'entry for js13k games 2014', 2, '9cf' ),
            new Label( w / 2, 180, 'created by', 4, '9cf' ),
            new Label( w / 2, 220, 'Greg Pabian', 6 ),
            new Label( w / 2, 260, 'pixelchinchilla.com', 4, '9cf' ),
            new Label( w / 2, 290, 'twitter: gregpabian', 4, '9cf' ),
            new Label( w / 2, 320, 'github: gregpabian', 4, '9cf' ),
            this.bJS13,
            this.bClose
        ];
    },

    update: function () {
        this.bJS13.update();
        this.bClose.update();
    },

    render: function () {
        this.ui.forEach( function ( elem ) {
            if ( elem.render ) elem.render( ctxfg );
        } );
        ctxbg.drawImage( states.menu.bg.c, 0, 0 );
    }
};

function restart() {
    level = points = lastPoints = 0;
    replay();
}

function replay() {
    points = lastPoints;
    scr.x = scr.y = 0;
    setState( 'play' );
}

/**
 * Pause game
 */
function pause() {
    if ( state === 'play' ) {
        controls.k.pause = 0;
        scr.ox = scr.x;
        scr.oy = scr.y;
        scr.x = scr.y = 0;
        states.pause.bg = screenshot();
        states.pause.over = blured( states.pause.bg );
        setState( 'pause' );
    }
}

/**
 * Resume game
 */
function resume() {
    ctx.globalAlpha = 1;
    controls.k.ent = controls.k.pause = 0;
    scr.x = scr.ox;
    scr.y = scr.oy;
    state = 'play';
}

/**
 * End game
 */
function over( success ) {
    states.over.won = success;
    if ( success ) {
        points += Math.floor( states.play.tmr.v * 10 );
    }
    scr.ox = scr.x = scr.oy = scr.y = 0;
    states.over.bg = screenshot();
    states.over.over = blured( states.over.bg );
    setState( 'over' );
}

/**
 * Done level
 */
function done() {
    if ( level + 1 > 11 ) {
        over( 1 );
    } else {
        scr.ox = scr.x = scr.oy = scr.y = 0;
        states.next.bg = screenshot();
        states.next.over = blured( states.next.bg );
        setState( 'next' );
    }
}

function nextLevel() {
    lastPoints = points;
    level++;
    replay();
}

function menu() {
    scr.ox = scr.oy = 0;
    setState( 'menu' );
}

function screenshot() {
    var output = utils.makeCs(),
        octx;

    output.width = w;
    output.height = h;

    octx = utils.ctx( output );
    octx.drawImage( cbg, 0, 0 );
    octx.drawImage( cm, 0, 0 );
    octx.drawImage( cfg, 0, 0 );

    return output;
}

function blured( src ) {
    var output = utils.makeCs(),
        offset = 0.5,
        octx,
        i;

    output.width = src.width;
    output.height = src.height;


    octx = utils.ctx( output );
    octx.drawImage( src, 0, 0 );
    octx.globalAlpha = 0.3;

    for ( i = 0; i < 8; i++ ) {
        octx.drawImage( output, i * offset, 0 );
        octx.drawImage( output, 0, i * offset );
        octx.drawImage( output, -i * offset, 0 );
        octx.drawImage( output, 0, -i * offset );
    }

    octx.fillStyle = '#000';
    octx.fillRect( 0, 0, w, h );

    return output;
}

function addPts( pts ) {
    points += pts;

    if ( points < 0 ) points = 0;

    sound.play( pts > 0 ? 'points' : 'kill' );
}

/**
 * Game loop
 */
function loop() {
    var now = utils.timestamp();

    dt += Math.min( 1, ( now - last ) / 1000 );

    last = now;

    while ( dt > step ) {
        dt -= step;
        states[ state ].update( step );
        if ( loaded ) bMute.update();
    }

    ctxbg.clearRect( 0, 0, w, h );
    ctx.clearRect( 0, 0, w, h );
    ctxfg.clearRect( 0, 0, w, h );

    ctx.save();
    ctx.translate( scr.x, scr.y );
    states[ state ].render();
    ctx.restore();

    if ( loaded ) bMute.render( ctxfg );

    requestAnimationFrame( loop );
}

loader.load( function () {
    // create icon from the spritesheet
    var icon = document.createElement( 'link' );
    icon.type = 'image/x-icon';
    icon.rel = 'shortcut icon';
    icon.href = loader.s.logo.img.toDataURL( 'image/x-icon' );
    document.head.appendChild( icon );

    utils.listen( 'blur', pause );

    bMute = new Button( w - 45, h - 40, 's', function () {
        sound.setMute( sound.mute ? 0 : 1 );
        bMute.txt.set( sound.mute ? 's:on' : 's:off' );
    }, 60, 40 );
    bMute.txt.s = 2;
    bMute.txt.set( sound.mute ? 's:on' : 's:off' );

    last = utils.timestamp();

    menu();
    loop();
} );