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

//when a div is clicked
document.querySelectorAll('.child').forEach(div => {
    div.addEventListener('click', function(){
        this.classList.toggle('clicked');
    });
});





