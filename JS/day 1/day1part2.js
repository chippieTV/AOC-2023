const fs = require('node:fs');

// removing zero
const numberwords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const regexString = new RegExp(numberwords.join("|"), "gi");

function replaceStringNumbers(input) {
    return input.replace(regexString, (matched) => {
        return 1 + numberwords.indexOf(matched);
    });
}

// reverse regex..
// not the most efficient way (should figure out using Regex's lastIndex..) but hopefully works?
const reversedNumberwords = numberwords.map(word => word.split("").reverse().join(""))
const reversedRegexString = new RegExp(reversedNumberwords.join("|"), "gi");

function reverseReplaceStringNumbers(input) {
    return input.split("").reverse().join("")
        .replace(reversedRegexString, (matched) => {
            return 1 + reversedNumberwords.indexOf(matched);
        }
    ).split("").reverse().join("");
}

const findFirstAndLastNumbers = (input) => {
    let first = 0;
    let last = 0;

    // not the most efficient, but we can walk halfway backwards to find the 
    const line = replaceStringNumbers(input) + reverseReplaceStringNumbers(input);
    // const line = replaceStringNumbers(input) + reverseReplaceStringNumbers(input);


    for (let i = 0; i <= line.length / 2; i++) {
        // charCodes for 0-9 == 48-58

        // console.log(first, line.charAt(i), last, line.charAt(line.length - i));

        // first number
        if (first === 0 && line.charCodeAt(i) <= 58) {
            first = line.charAt(i);

            if (last !== 0) break;
        }
        
        // last number
        if (last === 0 && line.charCodeAt(line.length - i) <= 58) {
            last = line.charAt(line.length - i);

            if (first !== 0) break;
        }
    }

    const outString = `${first}${last}`;

    console.log(`${first}${last}`, "--", input, "-", line)
    
    return parseInt(outString, 10);
}



fs.readFile('./data', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');

    const sum = lines.reduce((acc, line) => {
        try {
            acc += findFirstAndLastNumbers(line);
            return acc;
        } catch(e) {
            console.error(e);
        }
    }, 0);
    
    // console.log(data);
    console.log(sum);
    console.log(reversedNumberwords)
});


