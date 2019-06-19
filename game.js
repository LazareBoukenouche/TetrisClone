const canvas = document.getElementById('canvas'); // Create the canvas window, where the game will be played.
const context = canvas.getContext('2d');
const startingCount = 1;
const timeInterval = 500;
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
const HEIGHT_UNIT = canvas.height/20;
const WIDTH_UNIT = canvas.width/20;
const GRAVITY = canvas.height/20;
const block_Z = [[[0,1,1,0],[0,0,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,0,1],[0,0,1,1],[0,0,1,0],[0,0,0,0]],
                [[0,0,0,0],[0,1,1,0],[0,0,1,1],[0,0,0,0]],[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]];
const block_S = [[[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
                [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]];
const block_J = [[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
                [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],[[1,1,1,0],[0,0,1,0],[0,0,0,0],[0,0,0,0]]];
const block_L = [[[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
                [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]]];
const block_T = [[[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,1,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]];
const block_I = [[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
                [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]]];
const block_O = [[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
                [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]];
const allBlocks = [block_Z,block_S,block_J,block_L,block_T,block_I,block_O];

let body = document.querySelector("body");
let div = document.querySelector("div");
let grid = []; // Representation du tableau
let coordXBlock = 0; // Coordonnée horizontale du bloc
let initialCoordYBlock = 0; // Coordonnée verticale initiale du bloc
let currentCoordYBlock = 0; // Coordonnée verticale actualisee du bloc
let coordXGridBlock = 0; // Coordonnée horizontale du carre unitaire de la grille
let initialCoordYGridBlock = 0; // Coordonnée verticale initiale du carre unitaire de la grille
let currentCoordYGridBlock = 0; // Coordonnée verticale actualisee du carre unitaire de la grille
let icompteur = 0;
let compteurInfo = 0;
let currentSpin = 0;

class Tetromino {
    constructor(x,y,blockArray,spinPosition,color) {
        this.x = x;
        this.y = y;
        this.blockArray = blockArray;
        this.spinPosition = spinPosition;
        this.color = color;
    }
    
    getX() {
        return this.x;
    }
    
    getY() {
        return this.y;
    }
    
    getDownBlock() {
        if (this.y < canvas.height - 40) {
            this.y+=HEIGHT_UNIT;
        }
        else {
            this.y = canvas.height - 40;
            let newBloc = new Tetromino(0,0,block_I,block_I[0],BLUE);
            newBloc.drawBlock(WIDTH_UNIT,HEIGHT_UNIT,allBlocks[4]);
            newBloc.getDownBlock();
        }
        return this.y;
    }
    
    drawBlock(width,height,block){
        let i = currentSpin;
        if (i > 4) {
            i -= 4;
        }
        for (let j = 0;j < block[i].length;j++) {
            for (let k = 0;k < block[i][j].length;k++) {
                if (block[i][j][k] != 0) {
                    jeu.setColors(BLACK,BLUE);
                    jeu.drawRect((k*WIDTH_UNIT) + this.x,(j*HEIGHT_UNIT)+this.y,WIDTH_UNIT,HEIGHT_UNIT);
                    }
                }
            }
        }
    
    spinBlock() {
        currentSpin+=1;
        if (currentSpin==4) {
            currentSpin = 0;
        }
        return currentSpin;
    }

    move(sens) {
        this.x += sens;
    }
    
    stop() {
        this.x = 0;
    }

}

class Grid {
    constructor(nbRows,nbColumns,heightUnit,widthUnit) {
        this.nbRows = nbRows;
        this.nbColumns = nbColumns;
        this.heightUnit = heightUnit;
        this.widthUnit = widthUnit;
    }
    
    createGrid() {
        // Cree un tableau 2D representant la grille de jeu
        for (var i = 0;i<10;i++) {
            grid.push([]);
            for (var j = 0;j<10;j++) {
                grid[i].push(0);
                }
            }
        }
        
    drawGrid(){
        jeu.setColors(BLACK,WHITE);
        for (var i = 0;i<10;i++) {
            while (currentCoordYGridBlock < canvas.height) {
                jeu.drawRect(coordXGridBlock,currentCoordYGridBlock,WIDTH_UNIT,HEIGHT_UNIT);
                currentCoordYGridBlock+= HEIGHT_UNIT;
                }
            coordXGridBlock+=WIDTH_UNIT;
            currentCoordYGridBlock= 0;
            }
        }
        
    updateGrid(){
        for (let i = 0;i<4;i++) {
            for (let j = 0;j < 1;j++) {
                for (let k = 0;k<4;k++) {
                    console.log(allBlocks[currentBlockForm][i][j][k]);
                }
            }
        }
    } 
    
    clearCanvas(Xpos,Ypos,width,height) {
        // This function "clean" the canvas by drawing a white rectangle on the canvas.
        jeu.setColors(WHITE,WHITE);
        jeu.drawRect(Xpos,Ypos,width,height);
        initialCoordYGridBlock = 0;
        coordXGridBlock = 0;
    }
}

class Game {
    constructor() {}
    
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    displayInfos() {
        this.write("Press X to spin",210,50);
        this.write("Press Down to get the",210,100);
        this.write("tetromino down",210,120);
    }

    setColors(colorBorder,colorFull){
        // Define the colors used when drawing a shape, the two parameters as the border color and the full color
        context.strokeStyle = colorBorder;
        context.fillStyle = colorFull;
    }

    drawRect(coordX,coordY,width,height){
        // fillRect() draw a full rectangle and strokeRect() draw a border
        context.fillRect(coordX,coordY,width,height);
        context.strokeRect(coordX,coordY,width,height);
    }

    write(message,x,y) {
        context.font = '16px serif';
        context.fillText(message, x, y);
    }
    
    start() {
        // Main Game loop, with an interval of time implemented with a setTimeout function
        //startingCount = 0;
        grille.createGrid(); // Creation of the 10x10 grid
        this.displayInfos();
        this.setColors(BLACK,WHITE);
	    setTimeout(function onTick(timeInterval) {
            grille.clearCanvas(LEFT,TOP,canvas.width,canvas.height);
            grille.drawGrid(); //  Display of the grid 
            bloc.drawBlock(WIDTH_UNIT,HEIGHT_UNIT,allBlocks[currentBlockForm]);
            bloc.getDownBlock();
        // Call main again
        jeu.start();
        }, timeInterval)
    }
}
let grille = new Grid(10,10,HEIGHT_UNIT,WIDTH_UNIT);
let bloc = new Tetromino(0,0,block_I,block_I[0],BLUE);
let jeu = new Game();
let currentBlockForm = jeu.getRandomInt(0,6);
jeu.start();

document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Space
        case 32:
            bloc.spinBlock();
        // Pressing X for starting the game
        case 88:
            grille.updateGrid();
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
                bloc.move(0);
            }
            else {
                bloc.move(-WIDTH_UNIT);
            }
            break;
        //Right arrow
        case 39:
            if (coordXBlock == 240 || currentCoordYBlock == canvas.height - 40) {
                bloc.move(0);
            }
            else {
                bloc.move(WIDTH_UNIT);
            }
            break;
        //Down arrow
        case 40:
            currentCoordYBlock = canvas.height-40;
            break;
    }
};



