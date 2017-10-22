
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
}
// C button
document.getElementsByClassName("C")[0].addEventListener('click', Clear);
function Clear() {
    if (lastEntry() === ".") {
        decimalCheck = false;
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
        chainString = "0";
        setTimeout(ClearEntry, 2000);
    }
    else {
    chainString = "0";
    checkLimit();
    chainLastChar = "num";
    updateDisplay();
    }
}

}

