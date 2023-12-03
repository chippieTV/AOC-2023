const fs = require('node:fs');

fs.readFile('./data', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');
console.log(lines.length)
    // 0-9 == 48-58
    const sum = lines.reduce((acc, line) => {
        let first = 0;
        let last = 0;

        console.log("--", line, "--")

        for (let i = 0; i <= line.length; i++) {
            console.log(first, line.charAt(i), last, line.charAt(line.length - i));

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
        console.log(first, last)
        try {
            acc += parseInt(`${first}${last}`, 10);
            return acc;
        } catch(e) {
            console.error(e);
        }
    }, 0);
    
    // console.log(data);
    console.log(sum);
});
