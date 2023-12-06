let PartNumberSum = 0;

const checkSymbol = (x, y, lines) => {

    console.log("--------------------------- checking symbol", x, y)
    // 8 bit number
    let locations = 0;

    for (let v = -1, idx = 0; v <= 1; v++) {
        for (let u = -1; u <= 1; u++, idx++) {

            /// idx is 0 indexed, so below -1
            /// 1 2 3  || 0b00000001 0b00000010 0b00000100
            /// 4 * 5  || 0b00001000    SKIP    0b00010000
            /// 6 7 8  || 0b00100000 0b01000000 0b10000000

            // skip center
            if (u === 0 && v === 0) continue;
            
            const outX = x + u;
            const outY = y + v;

            const adjustedIdx = idx - (idx > 3 ? 1 : 0);

            if (!( // if not boundary, add to set
                outX < 0 ||
                outX > lines[0].length ||
                outY < 0 ||
                outY > lines.length ||
                (u === 0 && v === 0)
            )) {
                // *x,y == symbol location
                const charAtLocation = lines[outY][outX];

                if (isCharNumber(charAtLocation)) {
                    locations |= 1 << adjustedIdx;
                }
            }
        }
    }

    const fitsCriteria = has2SurroundingPartNumbers(locations);

    console.log(("00000000" + locations.toString(2)).slice(-8), fitsCriteria);

    if (fitsCriteria) {
        // we need to get the key numbers to get the two part number to then multiply together
        const partNoPairsToMultiply = [];
        const partLocatorPairs = fitsCriteria.map(coords => {
            return [y + coords[1], x + coords[0]];
        });

        // NOTE Y,X
        console.log("partLocatorPairs", partLocatorPairs)

        // we could try to dedupe lines but there's not that many for the effort
        partLocatorPairs.forEach((pair, pairIdx) => {

            console.log("pair", pair)

            for (partno of lines[pair[0]].matchAll(/[0-9]+/g)) {

                // skip part numbers that are past the end of the symbol +5 buffer (3 cells + 2 extra)
                if (partno.index > pair[1] + 5) break;

                // console.log(partno);
                // partno[0] is the matched string

                // get length of match string
                const len = partno[0].length;

                // careful off by 1
                for (let i = partno.index; i < partno.index + len; i++) {
                    // i is a position in the line of a number we want
                    // do we match a symbol pos? if yes, add this number to the sum!

                    // console.log(pair, i, partno)

                    // x == i
                    if (pair[1] === i) {
                        console.log("found partno - pushing", pairIdx, partno[0])
                        partNoPairsToMultiply.push(parseInt(partno[0], 10))
                        break;
                    }

                }

            }
            
        });
        console.log("partNoPairsToMultiply", partNoPairsToMultiply)

        PartNumberSum += partNoPairsToMultiply[0] * partNoPairsToMultiply[1];       
    }
}

const has2SurroundingPartNumbers = (locations) => {

    const top =     locations & 0b00000111;
    const left =   (locations & 0b00001000) >> 3;
    const right =  (locations & 0b00010000) >> 4;
    const bottom = (locations & 0b11100000) >> 5;
    
    if ((count3Row(top) + left + right + count3Row(bottom)) === 2) {
        // we have 2 part numbers in a row (positions 101)
        if (count3Row(top) === 2) return [[-1,-1],[1,-1]];
        if (count3Row(bottom) === 2) return [[-1,1],[1,1]];

        let out = [];
        if (left) out.push([-1,0]);
        if (right) out.push([1,0]);

        // we only have one so we only need 1 position from this row to find the part number
        if (top) {
            for (let i = 0; i < 3; i++) {
                if ((top >> i) & 0b1) {      
                    out.push([i-1,-1]);
                    break;
                }
            }
        }
        if (bottom) {
            for (let i = 0; i < 3; i++) {
                if ((bottom >> i) & 0b1) {
                    out.push([i-1,1]);
                    break;
                }
            }
        }
        return out;
    }
    return false;
}

const count3Row = (row) => {
    if (row === 0) return 0;
    if (row === 5) return 2;
    return 1;
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

    // find symbols
    for (let y = 0; y < height; y++) {
        const matched = lines[y].matchAll(/\*/gi);
        for (symbol of matched) {
            checkSymbol(symbol.index, y, lines);
        }
    }

    console.log(PartNumberSum)
});