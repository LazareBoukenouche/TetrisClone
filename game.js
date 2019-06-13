let canvas = document.getElementById('canvas'); // Create the canvas window, where the game will be played.
let context = canvas.getContext('2d');
let startingCount = 1;
let timeInterval = 500;
const TOP = 0;
const LEFT = 0;
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const GRAY = "#666666";
const RED = "#FF0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";
const YELLOW = "#FFFF00";
const ORANGE = "#FF7000";
const AQUA = "0000AA";
const HEIGHT_PLAYER = canvas.height/20;
const WIDTH_PLAYER = canvas.width/20;
const GRAVITY = canvas.height/20;
var currentSpin = 0;
const block_Z = [
        [
            [0,1,1,0],
            [0,0,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,0,1],
            [0,0,1,1],
            [0,0,1,0],
            [0,0,0,0]
        ]
        ];
const block_S = [
        [
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,0,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ]
        ];
const block_J = [
        [
            [0,1,0,0],
            [0,1,0,0],
            [1,1,0,0],
            [0,0,0,0]
        ],
        [
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,1,0],
            [0,0,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ]];
const block_L = [
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,1,0],
            [0,0,0,0]
        ],
        [
            [0,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,1,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ]];
const block_T = [
        [
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,0,0,0],
            [1,1,0,0],
            [1,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,0,0],
            [0,1,0,0],
            [1,1,1,0],
            [0,0,0,0]
        ],
        [
            [0,0,1,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ]
        ];
const block_I = [
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
        [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ]];
const block_O = [
        [
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ]];

let body = document.querySelector("body");
let div = document.querySelector("div");

let grid = []; // Representation du tableau

let coordXBlock = 0; // Coordonnée horizontale du bloc
let initialCoordYBlock = 0; // Coordonnée verticale initiale du bloc
let currentCoordYBlock = 0; // Coordonnée verticale actualisee du bloc

let coordXNewBlock = 0;
let initialCoordYNewBlock = 0;
let currentCoordYNewBlock = 0;

let coordXGridBlock = 0; // Coordonnée horizontale du carre unitaire de la grille
let initialCoordYGridBlock = 0; // Coordonnée verticale initiale du carre unitaire de la grille
let currentCoordYGridBlock = 0; // Coordonnée verticale actualisee du carre unitaire de la grille

let icompteur = 0;
let compteurInfo = 0;
let finalLineY = canvas.height -80;
createGrid(); // Creation of the 10x10 grid


function main() {
    // Main Game loop, with an interval of time implemented with a setTimeout function
    startingCount = 0;
    setColors(BLACK,WHITE);
	setTimeout(function onTick(timeInterval) {
        clearCanvas(LEFT,TOP,canvas.width,canvas.height);
        drawBoard(); //  Display of the grid 
        drawBlock(WIDTH_PLAYER,HEIGHT_PLAYER,block_L);
        getDownBlock();
    // Call main again
    main();
    }, timeInterval)
  }

function createGrid() {
    // Cree un tableau 2D representant la grille de jeu
    for (var i = 0;i<10;i++) {
        grid.push([]);
        for (var j = 0;j<10;j++) {
            grid[i].push(0);
        }
    }
}

function clearCanvas(Xpos,Ypos,width,height) {
    // This function "clean" the canvas by drawing a white rectangle on the canvas.
    setColors(WHITE,WHITE);
    drawRect(Xpos,Ypos,width,height);
    initialCoordYGridBlock = 0;
    coordXGridBlock = 0;
    }

function setColors(colorBorder,colorFull){
    // Define the colors used when drawing a shape, the two parameters as the border color and the full color
    context.strokeStyle = colorBorder;
    context.fillStyle = colorFull;
    }

function drawRect(coordX,coordY,width,height){
    // fillRect() draw a full rectangle and strokeRect() draw a border
    context.fillRect(coordX,coordY,width,height);
    context.strokeRect(coordX,coordY,width,height);
    }

function drawBlock(width,height,block){
    let i = currentSpin;
    if (i > 1) {
        i -= 2;
    }
        for (let j = 0;j < block[i].length;j++) {
            for (let k = 0;k < block[i][j].length;k++) {
                if (block[i][j][k] != 0) {
                    setColors(BLACK,BLUE);
                    drawRect((k*WIDTH_PLAYER) + coordXBlock,(j*HEIGHT_PLAYER)+currentCoordYBlock,WIDTH_PLAYER,HEIGHT_PLAYER);
                    }
                }
            }
        }

function insertCirclesInsideSquare() {
    context.beginPath();
    context.arc(coordXGridBlock+20, currentCoordYGridBlock+20,10, 0, 2 * Math.PI);
    context.stroke();
}

function drawBoard(){
    setColors(BLACK,WHITE);
    for (var i = 0;i<10;i++) {
        while (currentCoordYGridBlock < canvas.height) {
            drawRect(coordXGridBlock,currentCoordYGridBlock,WIDTH_PLAYER,HEIGHT_PLAYER);
            currentCoordYGridBlock+= HEIGHT_PLAYER;
        }
        coordXGridBlock+=WIDTH_PLAYER;
        currentCoordYGridBlock= 0;
    }
}

function getDownBlock() {
    if (currentCoordYBlock < canvas.height - 60) {
        currentCoordYBlock+=HEIGHT_PLAYER;
    }
    else {
        currentCoordYBlock = canvas.height - 60;
    }
}

function spinBlock() {
    currentSpin+=1;
    if (currentSpin==4) {
        currentSpin = 0;
        }
    }

function move(sens) {
    coordXBlock += sens;
    console.log(coordXBlock);
}


document.getElementById("canvas").addEventListener("click", function( event ) {
    main();
  }, {once : true});

document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Pressing X for starting the game
        case 88:
            displayInfos( "y:"+currentCoordYBlock);   
            displayInfos( " x:"+coordXBlock); 
            /* Check if the game is  not already started before starting it
            if (startingCount === 1) {
            clearCanvas(TOP, LEFT,canvas.width,canvas.height);
            main();
            
            }*/
            break;
    // Keyboard keys for moving the block
        //Left arrow
        case 37:
            if (coordXBlock == -40 || currentCoordYBlock == canvas.height - 80) {
                move(0);
            }
            else {
                move(-WIDTH_PLAYER);
            }
            break;
        //Right arrow
        case 39:
            if (coordXBlock == 240 || currentCoordYBlock == canvas.height - 8) {
                move(0);
            }
            else {
                move(WIDTH_PLAYER);
            }
            break;
        //Down arrow
        case 40:
            spinBlock();
            break;
    }
};

main()
