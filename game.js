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

class Tetromino {
    constructor() {
        this.x = grille.nbColumns/2*grille.widthUnit;
        this.y = 0;
        this.currentIndexBlock = jeu.getRandomInt();
        this.currentSpin = 0;
        this.fillColor = RED;
        this.BorderColor = BLACK;
        this.movingBlock = true;
    }
    
    getX() {
        return this.x;
    }
    
    getY() {
        return this.y;
    }
    
    drawBlock(){
        let block = allBlocks[this.currentIndexBlock];
        let i = this.currentSpin;
        if (i > 4) {
            i -= 4;
        }
        for (let j = 0;j < block[i].length;j++) {
            for (let k = 0;k < block[i][j].length;k++) {
                if (block[i][j][k] != 0) {
                    jeu.setColors(this.borderColor,this.fillColor);
                    jeu.drawRect((k*grille.widthUnit) + this.x,(j*grille.heightUnit)+
                    this.y,grille.widthUnit,grille.heightUnit);
                    }
                }
            }
        }
    
    getDownBlock() {
        let finalLine = canvas.height - grille.heightUnit;
        if (this.y < finalLine) {
            this.y+= grille.gravity;
        }
        else {
            this.y = finalLine; 
            this.movingBlock = false;
        }
        return this.y;
    }
    
    spinBlock() {
        if (this.movingBlock == true) {
            this.currentSpin+=1;
            if (this.currentSpin==4) {
                this.currentSpin = 0;
            }
        return this.currentSpin;
        }
    }
    checkCollision() {
        
    }

    move(sens) {
        if (this.x <= 0 || this.x >= 140 || this.y == 360){
            this.x += 0;
        }
        else {
            this.x += sens;
        }
    }
    
    stop() {
        this.x = 0;
    }

}

class Grid {
    constructor(nbRows,nbColumns) {
        let gridHeight = canvas.height;
        let gridWidth = canvas.width/2;
        this.nbRows = nbRows;
        this.nbColumns = nbColumns;
        this.heightUnit = gridHeight/nbRows;
        this.widthUnit = gridWidth/nbColumns;
        this.gravity = this.heightUnit;
    }
    
    createGrid() {
        // Cree un tableau 2D representant la grille de jeu
        for (var i = 0;i<this.nbRows;i++) {
            grid.push([]);
            for (var j = 0;j<this.nbColumns;j++) {
                    grid[i].push(0);
                }
            }
        }
        
    drawGrid(){
        jeu.setColors(BLACK,WHITE);
        for (var i = 0;i<this.nbColumns;i++) {
            for (var j = 0; j < this.nbRows;j++) {
                jeu.drawRect(coordXGridBlock,currentCoordYGridBlock,this.widthUnit,this.heightUnit);
                currentCoordYGridBlock+= this.heightUnit;
            }
            coordXGridBlock+= this.widthUnit;
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
    
    getRandomInt() {
        let min = 0;
        let max = 6;
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    displayInfos() {
        let textX = canvas.width/2+50;
        let textY = canvas.height/2;
        this.write("Press X to spin",textX,textY-50);
        this.write("Press Down to get the",textX,textY);
        this.write("tetromino down",textX,textY+50);
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
            bloc.drawBlock();
            bloc.getDownBlock();
        // Call main again
        jeu.start();
        }, timeInterval)
    }
}

let jeu = new Game();
let grille = new Grid(20,10);
let bloc = new Tetromino();
jeu.start();


document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Space
        case 32:
            bloc.stop();
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
                bloc.move(-grille.widthUnit);
            }
            break;
        //Up arrow
        case 38:
            bloc.spinBlock();
            break;
        //Right arrow
        case 39:
            if (coordXBlock == 240 || currentCoordYBlock == canvas.height - 40) {
                bloc.move(0);
            }
            else {
                bloc.move(grille.widthUnit);
            }
            break;
        //Down arrow
        case 40:
            bloc.y = canvas.height-40;
            break;
    }
};



