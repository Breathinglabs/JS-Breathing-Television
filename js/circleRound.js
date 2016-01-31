var circle = new Sonic({

    width: 150,
    height: 150,
    padding: 2,

    strokeColor: 'white',

    pointDistance: .01,
    stepsPerFrame: 3,
    trailLength: 1.1,

    step: 'fader',

    setup: function() {
    	this._.lineWidth = 2;
    },

    path: [
        ['arc', 11, 10, 8, 0, 360]
    ]

});



document.getElementById("roundBut").appendChild(circle.canvas);

