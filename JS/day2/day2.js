const fs = require('node:fs');

const parseLine = (input) => {
    // this will return either gameId if valid or 0 if not
    const gameId = parseInt(input.split(":")[0].split(" ")[1], 10);
    const picks = input.split(":")[1].split(";").flatMap(run => run.split(","));

    for (pick of picks) {
        const [_, _v, k] = pick.split(" ");
        // console.log(v, k)

        const v = parseInt(_v, 10);

        switch(k) {
            case "red":
                if (v > 12) return 0;
            case "green":
                if (v > 13) return 0;
            case "blue":
                if (v > 14) return 0;
        }
    }

    return gameId;
}

fs.readFile('./day2.data', 'utf8', (err, data) => {
    const lines = data.split("\n");

    // output is the sum of the id's of games with 12, 13, and 14 cubes
    const result = lines.reduce((acc, curr) => {
        acc += parseLine(curr);
        return acc;
    }, 0);

    console.log(result)
});