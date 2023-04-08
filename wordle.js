
let currentGuess = 0;
let currentLetter = 0;
let word;
let wordList;
let allWordList;

const numLetters = 5;
const alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

function getWord() {
    const index = Math.floor(Math.random() * wordList.length);
    word = wordList[index].toLocaleUpperCase();
}

function init() {
    const guessesDiv = $("#guesses");
    for (let i = 0; i < 6; i++) {
        const guessDiv = $(`<div class="guess" id="guess${i + 1}"></div>`);
        for (let j = 0; j < numLetters; j++) {
            const letterDiv = $(`<div class="letter" id="letter${i}${j}"></div>`);
            guessDiv.append(letterDiv);
        }
        guessesDiv.append(guessDiv);
    }

    const enterKey = $(`<div class="key" id="enter">ENTER</div>`);
    $("#keyboard2").append(enterKey);

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const key = $(`<div class="key" id="${letter}">${letter}</div>`);
        if (i < 10) {
            $("#keyboard0").append(key);
        } else if (i < 19) {
            $("#keyboard1").append(key);
        } else {
            $("#keyboard2").append(key);
        }
    }

    const delKey = $(`<div class="key" id="delete">DELETE</div>`);
    $("#keyboard2").append(delKey);

    const letterDiv = $(`#letter${currentGuess}${currentLetter}`);
    letterDiv.addClass("selected");

    const fourLetterWords = words20k.filter(word => word.length === 4);
    console.log(fourLetterWords);
    console.log(fourLetterWords.length);

    wordList = numLetters === 4 ? fourLetterWords : words;
    allWordList = numLetters === 4 ? allFourLetterWords : allWords;

    getWord();
}

init();

function clearGuess() {
    for (let i = 0; i < numLetters; i++) {
        const letterDiv = $(`#letter${currentGuess}${i}`);
        letterDiv.text("");
        letterDiv.removeClass("entered");
        currentLetter = 0;
    }
    $(`#letter${currentGuess}${currentLetter}`).addClass("selected");
}

function findMatches() {
    let lettersGuessed = 0;
    let wordClone = word.slice(0);
    for (let i = 0; i < numLetters; i++) { //go through first to get exact matches
        const letter = $(`#letter${currentGuess}${i}`);
        const letterVal = letter.text();
        letterIndex = wordClone.indexOf(letterVal);
        if (wordClone[i] === letterVal) { //exact match
            // console.log("exact match", letterVal);
            letter.addClass("exactMatch");
            lettersGuessed++
            $(`#${letterVal}`).addClass("exactMatch");
            wordClone = wordClone.substring(0, i) + "*" + wordClone.substring(i+1); //to avoid multiple partial matches
        }  
    }

    for (let i = 0; i < numLetters; i++) { //then go through for partials to fix multiple partial bug
        const letter = $(`#letter${currentGuess}${i}`);
        const letterVal = letter.text();
        letterIndex = wordClone.indexOf(letterVal);
        if (letterIndex !== -1) { //partial match
            // console.log("partial match", letterVal);
            letter.addClass("partialMatch");
            $(`#${letterVal}`).addClass("partialMatch");
            wordClone = wordClone.substring(0, letterIndex) + "*" + wordClone.substring(letterIndex + 1); //to avoid multiple partial matches
        } else {
            // console.log("no match", letterVal);
            $(`#${letterVal}`).addClass("guessed");
    
        }
    }





    if (lettersGuessed === numLetters) {
        const guesses = currentGuess + 1;
        $("#wonMessage").text("You won! :)");
    } else if (currentGuess === 5) {
        $("#wonMessage").text("You lost :(");
    } else {
        currentGuess++;
        currentLetter = 0;
        const letterDiv = $(`#letter${currentGuess}${currentLetter}`);
        letterDiv.addClass("selected");
    }
}

function checkGuess() {

    let guessWord = "";
    for (let i = 0; i < numLetters; i++) {
        guessWord += $(`#letter${currentGuess}${i}`).text();
    }

    const guessLower = guessWord.toLocaleLowerCase();

    if (!wordList.includes(guessLower) && !allWordList.includes(guessLower)) {
        clearGuess();
    } else {
        findMatches();
    }
}

function deleteLetter() {
    if (currentLetter !== 0) {
        const letterDiv = $(`#letter${currentGuess}${currentLetter}`);
        letterDiv.removeClass("selected");
        letterDiv.removeClass("entered");
        currentLetter--;
    }
    const letterDiv = $(`#letter${currentGuess}${currentLetter}`);
    letterDiv.text("");
    letterDiv.addClass("selected");
    letterDiv.removeClass("entered");
}

function enterLetter(key) {
    const letterDiv = $(`#letter${currentGuess}${currentLetter}`);
    letterDiv.text(key);
    letterDiv.removeClass("selected");
    letterDiv.addClass("entered");

    currentLetter++;
    if (currentLetter < numLetters) {
        const nextLetterDiv = $(`#letter${currentGuess}${currentLetter}`);
        nextLetterDiv.addClass("selected");
    }
}

$(".key").click(e => {
    // console.log(e.target.id);
    const key = e.target.id;
    if (key === "delete") {
        deleteLetter();
    } else if (key === "enter") {
        checkGuess();
    } else if (currentLetter < numLetters) {
        enterLetter(key);
    }

});

$(".content").keyup(e => {
    e.preventDefault();
    console.log(e.which);
    if (e.which == 8) {
        deleteLetter();
    } else if (e.which === 13) {
        checkGuess();
    } else if (currentLetter < numLetters) {
        const key = String.fromCharCode(e.which).toLocaleUpperCase();
        if (alphabet.includes(key)) {
            enterLetter(key);
        }
    }
});
