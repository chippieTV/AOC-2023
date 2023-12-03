// ideas
// create a 2D array so we can index x,y
// parse the 2D array and find locations and dimensions of part numbers
// so they can be treated as individual objects
// check if there are any non . chars within the bbox
// if yes add the number to the sum

// NOTE digits are ASCII 48-58
// . is 46
// everything else should be considered a symbol

// if we start with all the symbols, it's easier to check
// if there are any digits in the surrounding 8 cells,
// however this won't tell us the numbers or the other untouched numbers..
// since the goal is to add up the touched numbers we could get the location of the symbol
// then find the position of the touching numbers and walk left and right to the number boundaries
// to find the number..

// we can brute force loop through everything or we can find indices of symbols, we just don't have a full list
// and getting a list by looking at the characters is the same as loopin



// make a set of coordinate pairs to check to de-dupe checking

// these are "x,y" coordinates
const CoordsToCheck = new Set();

// these are {[y key]: Array<x=val>} coordinates
const PartNumbersToExpand = {};

const PartNumbers = [];
let PartNumberSum = 0;

const addSymbolToCoordsToCheck = (symbol, lines) => {
    const {x, y} = symbol;
    // console.log(symbol, x, y)

    // we can be smarter here but this is brute force and works
    for (let u = -1; u <= 1; u++) {
        for (let v = -1; v <= 1; v++) {
            const outX = x + u;
            const outY = y + v;

            // careful off by 1..
            if (!( // if not boundary, add to set
                outX < 0 ||
                outX > lines[0].length ||
                outY < 0 ||
                outY > lines.length ||
                (u === 0 && v === 0)
            )) {
                CoordsToCheck.add(`${outX},${outY}`);
            }
        }
    }
}

const isCharNumber = (char) => {
    const charCodeAtLocation = char.charCodeAt();

    return charCodeAtLocation >= 48 && charCodeAtLocation <= 58;
}

const fs = require('node:fs');

fs.readFile('./day3.data', 'utf8', (err, data) => {
    // ingest dataset
    const lines = data.split("\n")//.slice(0, 2);
    const height = lines.length;

    // the dataset has lines of the same width
    // just set as first line width
    const width = lines[0].length;

    // get the locations of symbols
    const symbols = [];

    // find symbols
    for (let y = 0; y < height; y++) {
        const matched = lines[y].matchAll(/[^0-9^\.]/gi);

        for (symbol of matched) {
            // symbols.push({x: symbol.index, y, symbol: symbol[0]})

            addSymbolToCoordsToCheck({x: symbol.index, y, symbol: symbol[0]}, lines);
        }
    }

    // we have symbols and surrounding coords,
    // check them for numbers and push to array for finding continguous blocks
    CoordsToCheck.forEach(location => {
        const [x, y] = location.split(",");

        if (isCharNumber(lines[y][x])) {
            
            if (!Array.isArray(PartNumbersToExpand[y])) {
                PartNumbersToExpand[y] = [];
            }
            PartNumbersToExpand[y].push(parseInt(x, 10))

            // Set version - try array instead
            // PartNumbersToExpand.add(`${x},${y}`);
        }
    });


    // console.log(PartNumbersToExpand[0])
    
    for (let y = 0; y < height; y++) {
    // for (let y = 0; y < 1; y++) {

        // get line array and sort it
        const linePosArr = PartNumbersToExpand[y];

        for (partno of lines[y].matchAll(/[0-9]+/g)) {
            // console.log(partno);

            // get length of match string
            const len = partno[0].length;

            // careful off by 1
            for (let i = partno.index; i < partno.index + len; i++) {
                // i is a position in the line of a number we want
                // do we match a symbol pos? if yes, add this number to the sum!

                // console.log(linePosArr, i, partno[0])

                if (linePosArr.includes(i)) {
                    PartNumbers.push(partno[0])
                    // console.log(partno[0])
                    PartNumberSum += parseInt(partno[0], 10);
                    break;
                }

            }

        }
        // console.log(line)
        

    }


    //     for (let x = 0; x < width; x++) {

    //     }

    // console.log(symbols)
    // console.log(CoordsToCheck.size)
    console.log(PartNumbers.length)
    console.log(PartNumberSum)



});