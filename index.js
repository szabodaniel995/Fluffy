// szükséges fájl(ok) behívása
const repository = require("./repository");

// időmérés a process.hrtime segítségével
const hrtime = process.hrtime;


// Az adatok betöltéséhez idő kell -> async függvénybe burkolás
(async function wrapper() {
    
    const start = hrtime.bigint(); // különböző időpontokban rögzítem változókba az aktuális időt -> számolható az egyes műveletekhez szükséges idő

    // Minden futásnál új nyerőszámokat hozok létre
        const winningNumbers = [];
        let j=0;

        while (j<5) { 
            const randomNumber = Math.floor(Math.random()*90)+1; // véletlen szám [1, 90] között

            if (!winningNumbers.includes(randomNumber)) { // Egyezések kizárása, egy szám csak egyszer szerepelhet
                winningNumbers[j]=randomNumber;
                j++;
            } 
        }

        const wins = hrtime.bigint();
    // 

    // A nyerőszámok sorba rendezése sort segítségével
    winningNumbers.sort((a, b) => a-b);
    
    const sort = hrtime.bigint();
    

    // Az adatok, szelvények betöltése lokális JSON fájlból
    const dataset = await repository.getAll();

    const dataLoad = hrtime.bigint();

    const { ticketCount, prize } = dataset.header; // a feladott szelvények számának kivétele az adatokból destrukturálással

    // A találatok kiszámítása, 1 object-ben rögzítése key-value párokként
        const hits = {};

        for (let data of dataset.data) {            
            // Minden feladott szelvény számjegyein végigmegy, s "kiszórja" a tömbből azokat, amik nem egyeznek a nyerőszámokkal
            // -> A megmaradó tömb, azaz a szelvényből a nyerő szelvénnyel egyező számok tömbjének hosszát rögzítem
            const count = data.numbers.filter(num => winningNumbers.includes(num)).length;

            // Csak akkor nyerő a szelvény, ha legalább 2 találatos. A 0 és 1 találatosokat nem rögzítjük, jelenleg nem hordoz információt
            if (count >=2) {
                hits[count] ? hits[count]+=1 : hits[count]= 1; 
                // Megnézi van-e a találatok object-ban 2/3/4/stb találatos, ha igen, növeli a mennyiséget 1-el, 
                // ha nincs, akkor létrehoz egy ilyen key-t "1" value-val
            }
        }
    //

    
    const divider = Object.keys(hits).length; // Az Object.keys visszaadja a key-eket egy tömbben, a hits object keys tömbjének hossza megmondja,
    // hogy hány felé osztandó a teljes nyeremény egyenlő arányban. Ez lesz az osztó.

    const ops = hrtime.bigint();

    // Az eheti adatok rögzítése egy objectban
        const prizes = {
            prize, // Ha a key és a value azonos, nem szükséges kiírni hogy "prize: prize", rövidíthető
            ticketCount,
            winningNumbers,
            twos: {
                Prize: hits[2]? Math.round((prize/divider)/(hits[2])) : 0, // Volt 2-es találat? -> kerekítve azt írja ki. Ha nem volt, legyen ez 0
                Count: hits[2]? hits[2] : 0, // volt 2-es találat? -> annak darabszámát írja ki. Ha nem volt, legyen ez 0
            },
            threes: {
                Prize: hits[3]? Math.round((prize/divider)/(hits[3])) : 0,
                Count: hits[3]? hits[3] : 0,
            },
            fours: {
                Prize: hits[4]? Math.round((prize/divider)/(hits[4])) : 0,
                Count: hits[4]? hits[4] : 0,
            },
            fives: {
                Prize: hits[5]? Math.round((prize/divider)/(hits[5])) : 0,
                Count: hits[5]? hits[5] : 0,
            },
            timeEfficiency: {
                calcWinningNumbers: wins - start, // korábban adott időpontban definiált változók segítségével az időszükségletek számolása nanosec-ben
                sortWinningNumbers: sort - wins,
                loadDataSet: dataLoad - sort,
                operationsOnDataset: ops - dataLoad,
            }
        };
    // 

    // Az eredmények kiírása konzolba
    console.log("Results: ", prizes);

    const end = hrtime.bigint();

    // A teljes futásidő kiírása konzolba
    console.log(`Total runtime: ${end - start} nanoseconds`);
})(); // Az egész functiont zárójelbe téve a function így rögtön meg is hívható egy "()" segítségével