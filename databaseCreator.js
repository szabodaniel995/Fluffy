const repository = require("./repository");

const hrtime = process.hrtime;
const start = hrtime.bigint();

// Az eheti nyeremény és szelvényszám definiálása. Ezen paraméterek változtatásával konfigurálható a program
const ticketCount = 4992576;
const prize = 1447849535;


// Egy object létrehozása, melyet a program feltölt adatokkal, majd JSON-ban letárol a merevlemezen
const database = {
    data: []
}

// Függvény 1 db szelvény létrehozására véletlenszám generálással
    function getPlayerNumbers() {
        const playerNumbers = [];
        let j=0;

        while (j<5) { 
            const randomNumber = Math.floor(Math.random()*90)+1;

            if (!playerNumbers.includes(randomNumber)) {
                playerNumbers[j]=randomNumber;
                j++;
            } 
        }

        playerNumbers.sort((a, b) => a-b);

        database.data.push({
            numbers: playerNumbers
        });

        return 
    }
// 


// Az adathalmaz feltöltése a megadott számú szelvénnyel
for (let i=1; i<=ticketCount; i++) {
    getPlayerNumbers();
}
 
// Az adathalmazba header beillesztése
database.header = {
    ticketCount,
    prize
};
 
// A lemezkezelő meghívása, az adathalmaz lemezre írása
(async function writer() {
    await repository.writeAll(database);
    console.log("Database created");

    const end = hrtime.bigint();

    // Az időszükséglet kiírása konzolba
    console.log(`Creating the database took ${end - start} nanoseconds`);
})();

