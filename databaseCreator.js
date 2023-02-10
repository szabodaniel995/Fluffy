const repository = require("./repository");

const hrtime = process.hrtime;
const start = hrtime.bigint();

// Az eheti nyeremény és szelvényszám definiálása. Ezen paraméterek változtatásával konfigurálható a program
const ticketCount = 4992576;
const prize = 1447849535;


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

        playerNumbers.sort((a, b) => a-b);

        return 
    }
// 


// Az adathalmaz feltöltése a megadott számú szelvénnyel
for (let i=1; i<=ticketCount; i++) {
    getPlayerNumbers(i);
}

// Egy header létrehozása
const header = {
    ticketCount,
    prize
};

// A lemezkezelő meghívása, az adathalmaz lemezre írása
async function writer2() {

    await repository.writeFile(database);

    // Egy általános információkat tartalmazó fájl létrehozása, mely rögzíti a heti nyereményt, a szelvények számát
    await repository.writeAll(header);
    
    
    console.log("Database created");

    const end = hrtime.bigint();

    // Az időszükséglet kiírása konzolba
    console.log(`Creating the database took ${end - start} nanoseconds`);
}

writer2();

