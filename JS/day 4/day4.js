const fs = require('node:fs');

fs.readFile('./day4.data', 'utf8', (err, data) => {
    // ingest dataset
    const lines = data.split("\n")//.slice(0, 2);

    const total = lines.reduce((acc, line) => {
        
        const [winningNumbers, myNumbers] = line.split(":")[1].split("|").map(chunk => {
            return chunk.match(/[0-9]+/gi)
        });

        console.log(winningNumbers, myNumbers)

        const score = Math.floor(Math.pow(2, winningNumbers.filter(val => myNumbers.includes(val)).length -1));
        
        console.log(score)
        acc += score;
        return acc;
    }, 0);
    
    console.log(total)
});