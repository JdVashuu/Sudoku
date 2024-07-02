const N = 9;
let K ;
const SRN = 3;
let mat = new Array(N);
for(let i = 0; i < N; i++){
    mat[i] = new Array(N);
    mat[i].fill(0);
}
console.log(mat);

//creating the board and giving each one of them unique ID
const board = document.getElementById("grid-container");
var count = 1;

for(let i = 0; i < 9; i++){
    const parentdiv = document.createElement(`div`);
    parentdiv.classList.add('parent')
    parentdiv.id = `parent${i}`;

    for(let j = 0; j < 9; j++){
        const childDiv = document.createElement(`div`);
        const value = document.createTextNode("");

        childDiv.classList.add("child");
        childDiv.id = count;
        childDiv.appendChild(value);
        count++;
        parentdiv.appendChild(childDiv);
    }
    board.appendChild(parentdiv);
}


//to set a particular value of the tile
function setValue(place , value){
    const tile = document.getElementById(place);
    const val = document.createTextNode(value);
    tile.appendChild(val);
    
}

function rng(){
    return Math.floor((Math.random() * 9) + 1);
}


function generateBoard(){
    console.log("generating the sudoku");
    fillDiagonal();
    //fillremaining(0, SRN);
    //removeElement();
    matrixConvert();
    console.log("finished genning sudoku");
}

function fillDiagonal(){
    for(let i = 0; i < N; i += SRN){
        fillBox(i, i);
    }
    console.log(mat);
}

function unUsedInBox(rowStart, colStart, num){
    for(let i = 0; i < SRN; i++){
        for(let j = 0; j < SRN; j++){  
            if(mat[rowStart + i][colStart + j] === num){
                return false;
            }
        }
    }
    return true;
}

function unUsedInRow(i, num){
    for(let j = 0; j < N; j++){
        if(mat[i][j] === num){
            return false;
        }
    }
    return true;
}

function unUsedInCol(j, num){
    for(let i = 0; i < N; i++){
        if(mat[i][j] === num){
            return false;
        }
    }
    return true;
}

function fillBox(row, col){
    let num = 0;
    for(let i = 0; i < SRN; i++){
        for(let j = 0; j < SRN; j++){
            while(true){
                num = rng();
                if(unUsedInBox(row, col, num)) {
                    break;
                }
            }
            mat[row + i][col + j] = num;
        }
    }
}

function matrixConvert(){
    let place = 0;
    for(let i = 0; i < N; i++){
        for(let j = 0; j < N; j++){
            place = (i-1)*3 + j;
            let value = mat[i][j];
            if(value === null){
                value == 0;
            }
            setValue(place, value);
        }
    }

}






//when a div is clicked
// document.querySelectorAll('.child').forEach(div => {
//     div.addEventListener('click', function(){
//         this.classList.toggle('clicked');
//     });
// });