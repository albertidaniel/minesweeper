let row = document.querySelector("#row");
let col = document.querySelector("#col");
let generate = document.querySelector("#generate_board");
let board = document.getElementById("board");

let mineFinder = {
    Total : 0,
    Remaining : 0,
    Found : 0,
    numRow : 0,
    numCol : 0,
    mineField : []
}

let countOpen = 0; //counts how many cells are open
let countMine = 0; //counts how many mines are marked
 
const move_j = [-1, 0, 1, -1, 1, -1, 0, 1];
const move_i = [-1, -1, -1, 0, 0, 1, 1, 1]; 

function bombFound (row, col){
    for (let i = 0; i < mineFinder.numRow; i++)
    for (let j = 0; j < mineFinder.numCol; j++){
        let box = document.querySelector(`#r${i}_c${j}`);
        let bomb = document.createElement("img");

        if (box.classList.contains("open")) continue;
        if (i == row && j == col) bomb.setAttribute("src", "images/bomb_red.jpg");
        else if (box.firstChild && mineFinder.mineField[i][j] == 9){
            box.removeEventListener("contextmenu", mark_cell);
            box.removeEventListener("click", open_cell);    
            continue;
        }
        else if (box.firstChild && mineFinder.mineField[i][j] != 9){
            box.removeChild(box.firstChild);
            let wrong_bomb = document.createElement("img");
            wrong_bomb.setAttribute("src", "images/wrong_bomb.png");
            box.appendChild(wrong_bomb);
        }
        else if (!box.firstChild && mineFinder.mineField[i][j] == 9) bomb.setAttribute("src", "images/bomb.png");
       
        box.appendChild(bomb);
        box.removeEventListener("contextmenu", mark_cell);
        box.removeEventListener("click", open_cell);
    }        
}

function zeroFound(row, col){
    //debugger;
    let me = document.querySelector(`#r${row}_c${col}`);
    me.classList.add("open"); countOpen++;
    let x = parseInt(row, 10);
    let y = parseInt(col, 10);
    for (let k = 0; k < 8; k++){
        let new_x = x + move_i[k];
        let new_y = y + move_j[k];

        // check index inside the grid
        if (new_x < 0 || new_x > mineFinder.numRow-1 || new_y < 0 || new_y > mineFinder.numCol-1) continue;
        
        let son = document.querySelector(`#r${new_x}_c${new_y}`);
        
        if (son.classList.contains("open")) continue;
        if (mineFinder.mineField[new_x][new_y] != 0){
            son.innerHTML = mineFinder.mineField[new_x][new_y];
            countOpen++;
            son.classList.add ("open"); 
            son.classList.add ("c" + mineFinder.mineField[new_x][new_y]);
        } else {
            zeroFound(new_x, new_y);
        }
    }
    
}

function open_cell(event){ //left click event
    if (event.type == "click"){

        event.stopPropagation();
        event.preventDefault();
        let box = event.currentTarget;
        let row = box.dataset.row;
        let col = box.dataset.col;
        if (!box.firstChild){//check that is not marked with a flag
            if (mineFinder.mineField[row][col] > 0 && mineFinder.mineField[row][col] < 9 && !box.classList.contains("open")){
                box.innerHTML = mineFinder.mineField[row][col];
                countOpen++;
                box.classList.add ("open");
                box.classList.add ("c" + mineFinder.mineField[row][col]);
            } else if (mineFinder.mineField[row][col] == 9){//if you click on a bomb
                bombFound(row, col);
            } else if (mineFinder.mineField[row][col] == 0){//if you click on a position with no bombs around
                zeroFound(row, col);
            }
        }
        if ((countMine + countOpen) == (mineFinder.numRow  * mineFinder.numCol)) alert("you won!!!!!");
    }
}

function mark_cell(event){ //right click event
    if (event.type == "contextmenu"){
        
        event.stopPropagation;
        event.preventDefault();
        let box = event.currentTarget;
        if (!box.classList.contains("open")){
            if (!box.firstChild){//if the box is empty put a flag
                let flag = document.createElement("img");
                flag.setAttribute("src", "images/flag.png");
                flag.dataset.type = "flag";
                box.appendChild(flag);
                countMine++;
            }else if (box.firstChild.dataset.type == "flag"){ //if there is a flag, make the box empty
                box.removeChild(box.firstChild);
                countMine--;
            }     
        }
        if ((countMine + countOpen) == (mineFinder.numRow  * mineFinder.numCol)) alert("you won!!!!!");
    }  
}

function double_click(event){
    event.stopPropagation;
    event.preventDefault();
    
    if (event.buttons == 3){
        //debugger;
        let box = event.currentTarget;
        let row = parseInt(box.dataset.row, 10);
        let col = parseInt(box.dataset.col, 10);
        let acc = 0;
        if (box.classList.contains("open")){
            for (let k = 0; k < 8; k++){ //checking that all elements around are ok
                let x = row + move_i[k];
                let y = col + move_j[k];
                if (x < 0 || x > (mineFinder.numRow - 1) || y < 0 || y > (mineFinder.numCol - 1)){ //index control
                    acc++;
                    continue;
                } else {
                    let son = document.querySelector(`#r${x}_c${y}`);
                    if (son.firstChild && mineFinder.mineField[x][y] == 9) acc++; //there is a bomb that has been marked correctly
                    else if (son.classList.contains("open")) acc++; //the cell is already open
                    else if (son.firstChild && mineFinder.mineField[x][y] != 9){
                        //debugger;
                        bombFound(1000, 1000);
                    }
                    else if (!son.classList.contains("open") && mineFinder.mineField[x][y] != 9 ) acc++; //the cell is empty
                }

            }
        }
        if (acc == 8){
            //alert("si");
            for (let k = 0; k < 8; k++){
                let x = row + move_i[k];
                let y = col + move_j[k];
                if (x < 0 || x > (mineFinder.numRow - 1) || y < 0 || y > (mineFinder.numCol - 1)) continue;
                else {
                    if (mineFinder.mineField[x][y] == 9) continue;
                    let son = document.querySelector(`#r${x}_c${y}`);
                    if (mineFinder.mineField[x][y] == 0 && !son.classList.contains("open")) zeroFound(x, y);
                    else if (!son.classList.contains("open")){
                        son.innerHTML = mineFinder.mineField[x][y];
                        countOpen++;
                        son.classList.add("open");
                        son.classList.add("c" + mineFinder.mineField[x][y]);
                    }
                }
            }
        }    
        if ((countMine + countOpen) == (mineFinder.numRow  * mineFinder.numCol)) alert("you won!!!!!");
    }
}

Create = (col_val, row_val) => {
    board.style.display = "grid";
    board.style["grid-template-columns"] = "repeat(" + col_val + ", 23px)";
    board.style["grid-template-rows"] = "repeat(" + row_val + ", 23px)";

    countOpen = 0; countMine = 0;
    mineFinder.numRow = row_val;
    mineFinder.numCol = col_val;
    if (col_val === 8) mineFinder.Total = 10;
    else if (col_val === 16) mineFinder.Total = 40;
    else mineFinder.Total = 99;
    mineFinder.Remaining = mineFinder.Total;
   
    while (board.firstChild){//Reset the board when changing dificulty
        board.firstChild.removeEventListener("contextmenu", mark_cell);
        board.firstChild.removeEventListener("click", open_cell);
        board.removeChild(board.firstChild);
    }

    //Generate Grid
    for (let i = 0; i < mineFinder.numRow; i++){
        for (let j = 0; j < mineFinder.numCol; j++){
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", `r${i}_c${j}` );
            newDiv.dataset.row = i;
            newDiv.dataset.col = j;
            newDiv.addEventListener("contextmenu", mark_cell );
            newDiv.addEventListener("click", open_cell );
            newDiv.addEventListener("mousedown", double_click);
            board.appendChild(newDiv);
        }
    }

    for (let i = 0; i < mineFinder.numRow; i++) //Creating the table 
        mineFinder.mineField[i] = new Array(mineFinder.numCol);
    
    for (let i = 0; i < mineFinder.numRow; i++) //Empting the table
     for (let j = 0; j < mineFinder.numCol; j++)
      mineFinder.mineField[i][j] = 0;

        
    for (let i = 0; i < mineFinder.Total; i++){ //Creating Mines
        let x = Math.floor(Math.random() * (mineFinder.numRow-1));
        let y = Math.floor(Math.random() * (mineFinder.numCol-1));
        
        while (mineFinder.mineField[x][y] != 0){
            x = Math.floor(Math.random() * (mineFinder.numRow-1));
            y = Math.floor(Math.random() * (mineFinder.numCol-1));    
        }

        mineFinder.mineField[x][y] = 9;
    }

    //count Mines
    
    for (let i = 0; i < mineFinder.numRow; i++) 
        for (let j = 0; j < mineFinder.numCol; j++){
            if (mineFinder.mineField[i][j] === 9) continue;
            let mineCount = 0
            for (let k = 0; k < 8; k++){
                let new_i = i + move_i[k];
                let new_j = j + move_j[k];
                
                if (new_i < 0 || new_i > mineFinder.numRow-1 || new_j < 0 || new_j > mineFinder.Col-1) continue;
                
                if (mineFinder.mineField[new_i][new_j] === 9) mineCount++;

            }
            mineFinder.mineField[i][j] = mineCount;
        }
        console.clear();
        //for (let i = 0; i < mineFinder.numRow; i++) console.log(mineFinder.mineField[i]);
}

// generate.addEventListener('click', () => { 
//     Create (row.value, col.value);
// })

document.getElementById("Small").addEventListener('click', () => { Create(8, 8); })
document.getElementById("Medium").addEventListener('click', () => { Create(16, 16); })
document.getElementById("Large").addEventListener('click', () => { Create(30, 16); })

