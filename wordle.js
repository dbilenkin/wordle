
let currentGuess = 0;
let currentLetter = 0;
let word;
const alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

function getWord() {
    const index = Math.floor(Math.random() * words.length);
    word = words[index].toLocaleUpperCase();
    // word = "GUESS";
}

function init() {
    const guessesDiv = $("#guesses");
    for (let i = 0; i < 6; i++) {
        const guessDiv = $(`<div class="guess" id="guess${i + 1}"></div>`);
        for (let j = 0; j < 5; j++) {
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

    getWord();
}

init();

function clearGuess() {
    for (let i = 0; i < 5; i++) {
        const letterDiv = $(`#letter${currentGuess}${i}`);
        letterDiv.text("");
        letterDiv.removeClass("entered");
        currentLetter = 0;
    }
    $(`#letter${currentGuess}${currentLetter}`).addClass("selected");
}

function findMatches() {
    let lettersGuessed = 0;
    for (let i = 0; i < 5; i++) {
        const letter = $(`#letter${currentGuess}${i}`);
        const letterVal = letter.text();
        letterIndex = word.indexOf(letterVal);
        if (word[i] === letterVal) { //exact match
            console.log("exact match", letterVal);
            letter.addClass("exactMatch");
            lettersGuessed++
            $(`#${letterVal}`).addClass("exactMatch");
        } else if (letterIndex !== -1) { //partial match
            console.log("partial match", letterVal);
            letter.addClass("partialMatch");
            $(`#${letterVal}`).addClass("partialMatch");
        } else {
            console.log("no match", letterVal);
            $(`#${letterVal}`).addClass("guessed");

        }
    }

    if (lettersGuessed === 5) {
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
    for (let i = 0; i < 5; i++) {
        guessWord += $(`#letter${currentGuess}${i}`).text();
    }

    const guessLower = guessWord.toLocaleLowerCase();

    if (!words.includes(guessLower) && !allWords.includes(guessLower)) {
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
    if (currentLetter < 5) {
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
    } else if (currentLetter < 5) {
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
    } else if (currentLetter < 5) {
        const key = String.fromCharCode(e.which).toLocaleUpperCase();
        if (alphabet.includes(key)) {
            enterLetter(key);
        }
    }
});
