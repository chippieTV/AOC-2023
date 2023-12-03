const fs = require('node:fs');

const parseLine = (input) => {
    // this will return either gameId if valid or 0 if not
    // const gameId = parseInt(input.split(":")[0].split(" ")[1], 10);
    const picks = input.split(":")[1].split(";").flatMap(run => run.split(","));

    const out = {red: 0, green: 0, blue: 0};

    for (pick of picks) {
        // console.log(pick, pick.split(" "))
        const [_, _v, k] = pick.split(" ");
        const v = parseInt(_v, 10);
        // console.log(v, k)

        // console.log("before", out);
        switch(k) {
            case "red":
                if (v > out.red) {
                    out.red = v;
                }
                break;
            case "green":
                if (v > out.green) {
                    out.green = v;
                }
                break;
            case "blue":
                if (v > out.blue) {
                    out.blue = v;
                }
                break;
        }
        // console.log("after", out);
    }
    console.log(picks, out, out.red * out.green * out.blue);


    return out.red * out.green * out.blue;
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