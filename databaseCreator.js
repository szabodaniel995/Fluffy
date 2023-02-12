const JSONBig = require("json-bigint");

const repository = require("./repository");

const hrtime = process.hrtime;


module.exports = async (week, prize, ticketCount) => {

    const start = hrtime.bigint();

    // Egy object létrehozása, melyet a program feltölt adatokkal, majd JSON-ban letárol a merevlemezen
    const database = {};

    for (let i=1; i<=90; i++) {
        database[i]=[];
    }
    
    // Függvény 1 db szelvény létrehozására véletlenszám generálással
        function getPlayerNumbers(i) {
            const playerNumbers = [];
            let j=0;

            while (j<5) { 
                const randomNumber = Math.floor(Math.random()*90)+1;

                if (!playerNumbers.includes(randomNumber)) {
                    playerNumbers[j]=randomNumber;
                    j++;

                    database[randomNumber].push(i);
                } 
            }
        }
    // 


    // Az adathalmaz feltöltése a megadott számú szelvénnyel
    for (let i=1; i<=ticketCount; i++) {
        getPlayerNumbers(i);
    }

    // A lemezkezelő meghívása, az adathalmaz lemezre írása
    async function writer() {

        await repository.writeFile(database, week);

        const end = hrtime.bigint();

        const time = end - start;

        // Egy header létrehozása
        const header = {
            week,
            ticketCount,
            prize, 
            time: JSONBig.parse(JSONBig.stringify(time))
        };

        // Egy általános információkat tartalmazó fájl létrehozása, mely rögzíti a heti nyereményt, a szelvények számát
        await repository.writeHeader(header, week);
        
        
        console.log("Database created");

        // Az időszükséglet kiírása konzolba
        console.log(`Creating the database took ${end - start} nanoseconds`);
    }

    await writer();
}