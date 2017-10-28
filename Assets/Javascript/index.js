var canvas = document.getElementById("canv");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});
window.addEventListener("scroll", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPointDist(x1, x2, y1, y2) {
    var distX = x2-x1;
    var distY = y2-y1;
    //Pythagoras
    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
};
var Circles = [];

/*var mouse = {
    x: 10,
    y: 10
}
window.addEventListener('mousemove', mouseUp);
function mouseUp(e) {
    mouse.x = e.x;
    mouse.y = e.y;
}*/
function lastOperator(string) {
    let lastOperator;
    let i = 0;
    while(i < string.length) {
        if (string[i] === "-" || string[i] === "/" || string[i] === "+" || string[i] === "*"){
            lastOperator = string[i];
        }
        i++;
    }
    return lastOperator;
}



function rotateCircle(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function circleCollision(circle1, circle2) {
    const xVelDiff = circle1.vel.x - circle2.vel.x;
    const yVelDiff = circle1.vel.y - circle2.vel.y;
    const xDiff = circle2.x - circle1.x;
    const yDiff = circle2.y - circle1.y;

    if (xVelDiff * xDiff + yVelDiff * yDiff >= 0) {
        const angl = -Math.atan2(circle2.y - circle1.y, circle2.x - circle1.y);

        const c1m = circle1.mass;
        const c2m = circle2.mass;
        const c1u = rotateCircle(circle1.vel, angl);
        const c2u = rotateCircle(circle2.vel, angl);

        const v1 = { x: c1u.x * (c1m - c2m) / (c1m + c2m) + c2u.x * 2 * c2m / (c1m + c2m), y: c1u.y };
        const v2 = { x: c2u.x * (c1m - c2m) / (c1m + c2m) + c1u.x * 2 * c2m / (c1m + c2m), y: c2u.y };

        const trueV1 = rotateCircle(v1, -angl);
        const trueV2 = rotateCircle(v2, -angl);

        circle1.vel.x = trueV1.x;
        circle1.vel.y = trueV1.y;
        
        circle2.vel.x = trueV2.x;
        circle2.vel.y = trueV2.y;
    }
}
function circleEat(circle1, circle2) {
    let bigCircle;
    let smallCircle;
    let operator = lastOperator(chainString);
    if (operator !== undefined) {
        circle1.radius > circle2.radius ? (bigCircle = circle1, smallCircle = circle2) : (smallCircle = circle1, bigCircle = circle2);
        
            operator === "-" || operator === "/" ? (bigCircle.radius = bigCircle.radius - (smallCircle.radius / 2)) : bigCircle.radius = bigCircle.radius + (smallCircle.radius / 2)
            //evalRadString = (bigCircle.radius).toString() + operator + (smallCircle.radius / 2).toString();
           //bigCircle.radius = eval(evalRadString);
        
            evalTextString = bigCircle.numText.toString() + operator + smallCircle.numText.toString();
            bigCircle.numText = (eval(evalTextString))
            console.log(bigCircle.numText + "calc")
            if (operator === "/" || operator === "/" ) {
                bigCircle.numText = bigCircle.numText.toFixed(1)
            }
            
            Circles.splice(Circles.indexOf(smallCircle), 1);
    }
    
    



}

function Circle(x, y, radius, numText) {
    this.x = x;
    this.y = y;
    this.vel = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
    }
    this.radius = radius;
    this.numText = numText.toString();
    //this.numValue = parseInt(this.numText);
    this.mass = radius / 2;
    this.color = `rgb(${getRandomInt(50, 255)}, ${getRandomInt(50, 255)}, ${getRandomInt(50, 255)})`;
    
    this.fontSize = this.radius;
    this.fontYOffset = this.fontSize / 2;


    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgb(200, 200, 200)";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
        this.fontSize = this.radius;
        this.fontYOffset = this.fontSize / 2;
        ctx.beginPath();
        ctx.font = `${this.fontSize}pt Sans-Serif`;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = "3";
        ctx.textAlign = "center";
        ctx.strokeText(this.numText, this.x, this.y + this.fontYOffset);
        ctx.fillText(this.numText, this.x, this.y + this.fontYOffset);
        
        ctx.closePath();
    }
    this.update = Circles => {
        this.x += this.vel.x;
        this.y += this.vel.y;

        for (var i = 0; i < Circles.length; i++) {
            if (this === Circles[i]) {
                continue;
            }
            if (getPointDist(this.x, Circles[i].x, this.y, Circles[i].y) - (this.radius + Circles[i].radius) < 0) {
                /*circleCollision(this, Circles[i]);
                this.color = `rgb(${getRandomInt(50, 255)}, ${getRandomInt(50, 255)}, ${getRandomInt(50, 255)})`
                Circles[i].color = `rgb(${getRandomInt(50, 255)}, ${getRandomInt(50, 255)}, ${getRandomInt(50, 255)})`*/
                circleEat(this, Circles[i]);


            }
        }
        


        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.vel.x = -this.vel.x;
        }
        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.vel.y = -this.vel.y;
        }
        
        this.draw();
    }
}
function produceCircle(circleTxt) {
        var txt = circleTxt;
        let radius = (parseInt(txt) + 1) * 6.5;
        let x = getRandomInt(3 + radius, canvas.width - radius - 3);
        let y = getRandomInt(3 + radius, canvas.height - radius - 3);
        
        if (Circles.length >= 1) {
        for (var i = 0; i < Circles.length; i++) {
            if (getPointDist(x, Circles[i].x, y, Circles[i].y) - (radius + Circles[i].radius) < 0 ) {
                
               
                x = getRandomInt(3 + radius, canvas.width - radius - 3);
                y = getRandomInt(3 + radius, canvas.height - radius - 3);
                i = -1;
                              
            }
        }
            
            return new Circle(x, y, radius, txt);
            
        }
        else {
            
            return new Circle(x, y, radius, txt);
        }

}


function init() {
    testCircle =  new Circle(200, 100, 40, "8");
    testCircle2 = new Circle(200, 300, 80, "0");
   
}


var animationSwitch;
function animate() {
    animationSwitch = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    
    for (var i = 0; i < Circles.length; i++) {
        Circles[i].update(Circles);
    }

}
init();
animate();

document.getElementsByClassName("AnimationOff")[0].addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animationSwitch);
    
    console.log("animation off");
})



var mainDisplay = document.getElementsByClassName("mainDisplay")[0];
var mainString = "0";
var chainDisplay = document.getElementsByClassName("chainDisplay")[0];
var chainString= "0";
updateDisplay();

var memory = "0";

var chainLastChar = "num";
var decimalCheck = false;


function lastEntry() {
    return chainString[chainString.length -1];
}

function updateDisplay() {
    mainDisplay.textContent = mainString;
    chainDisplay.textContent = chainString;
}
// display limit
function checkLimit() {
    const mainMax = 14;
   // const chainMax = 27;
    function isOverflown(element) {
         return element.scrollWidth > element.clientWidth;
    }
    if (mainString.length > mainMax || isOverflown(chainDisplay)){
        mainString = "ERROR";
        chainString = "Digit Limit Exceeded"
        setTimeout(ClearEntry, 2000);
    }
}
// M+ button 
document.getElementsByClassName("M+")[0].addEventListener('click', memAdd);
function memAdd() {
    memory = eval(memory + mainString).toString();
}
// M- button 
document.getElementsByClassName("M-")[0].addEventListener('click', memMinus);
function memMinus() {
    memory = eval(memory - mainString).toString();
}
// MRC button 
document.getElementsByClassName("MRC")[0].addEventListener('click', memRecall);
function memRecall() {
    if (chainString === "0") {
        chainString = "";
    }
    else if (memory.indexOf(".") !== 0) {
        decimalCheck = true;
    }
    chainLastChar = "num";
    chainString += memory;
    checkLimit();
    updateDisplay();
}

// CE Button
document.getElementsByClassName("CE")[0].addEventListener('click', ClearEntry);
function ClearEntry() {
    decimalCheck = false;
    memory = "0";
    mainString = "0";
    chainString = "0";
    updateDisplay();
    Circles = [];
}
// C button
document.getElementsByClassName("C")[0].addEventListener('click', Clear);
function Clear() {
    if (lastEntry() === ".") {
        decimalCheck = false;
    }
    if (isNaN(lastEntry()) !== true){
        if (Circles.length > 1) {
            Circles.pop();
        }
        else if (Circles.length = 1) {
            Circles = [];
        }
    }
    chainString = chainString.slice(0, -1);
    if (chainString.length < 1) {
        chainString = "0";
    }
    updateDisplay();
    
    
}
// ANS button 
document.getElementsByClassName("oANS")[0].addEventListener('click', ANS);
function ANS() {
    if (mainString.indexOf(".") !== 0){
        decimalCheck = true;
    }
    if (isNaN(lastEntry())){
        chainLastChar = "num";
        chainString += mainString;
        checkLimit();
        updateDisplay();
    }
    else if (chainString === "0") {
        chainLastChar = "num";
        chainString = mainString;
        checkLimit();
        updateDisplay();
    }
}
// / button 
document.getElementsByClassName("oDivide")[0].addEventListener('click', operatorDivide);
function operatorDivide() {
    decimalCheck = false;
    if (chainLastChar === "num") {
        chainLastChar = "operator";
        chainString += "/";
        checkLimit();
        updateDisplay();
    }
}
// * button 
document.getElementsByClassName("oTimes")[0].addEventListener('click', operatorTimes);
function operatorTimes() {
    decimalCheck = false;
    if (chainLastChar === "num") {
        chainLastChar = "operator";
        chainString += "*";
        checkLimit();
        updateDisplay();
    }
}



// + Button
document.getElementsByClassName("oPlus")[0].addEventListener('click', operatorPlus);
function operatorPlus() {
    decimalCheck = false;
    if (chainLastChar === "num") {
        chainLastChar = "operator";
        chainString += "+";
        checkLimit();
        updateDisplay();

    }
}
// - Button 
document.getElementsByClassName("oMinus")[0].addEventListener('click', operatorMinus);
function operatorMinus() {
    decimalCheck = false;
    if (lastEntry() !== "-" && chainString === "0") {
        chainLastChar = "operator";
        chainString = "-";
        updateDisplay();
    }
    else if (lastEntry() !== "-") {
        chainLastChar = "operator";
        chainString += "-";
        checkLimit();
        updateDisplay();
    }
}
// . button 
document.getElementsByClassName("oDecimal")[0].addEventListener('click', operatorDecimal);
function operatorDecimal() {
    if (decimalCheck !== true && isNaN(lastEntry()) !== true) {
        decimalCheck = true;
        chainLastChar = "operator";
        chainString += ".";
        checkLimit();
        updateDisplay();
    }
}

// numbered button's click events
var numBtns = [];
for (var i = 0; i < 10; i++) {
    var classString = "n" + i.toString();
    numBtns.push(document.getElementsByClassName(classString)[0]);
}
for (var i = 0; i < numBtns.length; i++) {
    numBtns[i].addEventListener('click', numButton(numBtns[i]))
}
function numButton(btnNode) {
    return function(e) {
            if (chainString === "0") {
                chainString = "";
            }                
                chainString += btnNode.textContent;
                Circles.push(produceCircle(btnNode.textContent));
                checkLimit();
                chainLastChar = "num";
                updateDisplay();

            
    }
}


// equal button 
document.getElementsByClassName("oEqual")[0].addEventListener('click', operatorEqual);
function operatorEqual() {
    if (chainLastChar === "num") {
    var answer = eval(chainString);
    mainString = answer.toString();
    if (mainString === "Infinity") {
        chainString = "Division by zero";
        mainString = "ERROR";
        updateDisplay();
        Circles = [];
        chainString = "0";
        setTimeout(ClearEntry, 2000);
    }
    else {
    chainString = "0";
    checkLimit();
    chainLastChar = "num";
    updateDisplay();
    Circles = [];
    }
}

}

