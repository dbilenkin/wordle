const fs = require("fs");
fs.readFile('words_dictionary.json', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
    const words = JSON.parse(data);
    let fourLetterWords = Object.keys(words).filter(word => word.length === 4);
    writeFourLetterFile(fourLetterWords);
});

function writeFourLetterFile(fourLetterWords) {
    fs.writeFile('allFourLetterWords.txt', fourLetterWords, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

