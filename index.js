// szükséges fájl(ok) behívása
const repository = require("./repository");
const hrtime = process.hrtime; // időmérés a process.hrtime segítségével


// Az adatok betöltéséhez idő kell. Meg akarom várni, hogy pl. az adat betöltő promise elkészüljön és az adat beérkezzen -> async függvénybe burkolás
async function wrapper() {
    
    // különböző időpontokban rögzítem változókba az aktuális időt -> később ezek segítségével számolható az egyes műveletekhez szükséges idő
    const start = hrtime.bigint(); 

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
    // 

    // A nyerőszámok sorba rendezése sort segítségével
        winningNumbers.sort((a, b) => a-b);
    // 

    // Az adatok, szelvények betöltése lokális JSON fájlokból
    // Mivel már az adatok rögzítése is tervezetten, strukturáltan történik, ezért ~5 millió rekord helyett elegendő csak a min. 1 találatos szelvények
    // halmazának betöltése. Ez ~4 másodpercről ~0,3 másodpercre csökkenti az adatok betöltésének időszükségletét
        const dataLoadStart = hrtime.bigint();

        const dataset = await repository.readFile(winningNumbers); // meghívja a repository.js-ben megírt readFile method-t

        const header = await repository.getAll(); // Header betöltése
        const dataLoadFinish = hrtime.bigint();
    // 


    // A találatok kiszámítása, 1 object-ben rögzítése key-value párokként, az időhatékonyság maximalizálásával 
        const opStart = hrtime.bigint();

        // minden szelvény id-t betöltök egy darab gyűjtő tömbbe. Az adathalmazban annyi szelvény id van, ahányszor az adott szelvény számai
        // egyeztek a nyerőszámokkal
            let collector = [];

            for (let key in dataset) {
                for (let id of dataset[key]) {
                    collector.push(id);
                }
            }

            // rendezem a tömb elemeit növekvő sorrendbe. Ez egy időhatékony művelet, később lehetővé teszi az időhatékony összeszámlálást
            collector.sort((a, b) => a-b);
        // 

        // Létrehozok egy üres objectot, melyben egyedi algoritmus segítségével összeszámlálom az egyes találatok mennyiségét
            const hits = {};
            let counter = 0;

            // A teljes gyűjtő tömbön végigmegyek, s mivel a gyűjtő tömböt növekvő sorrendbe rendeztem, ezért 1 db bejárással össze tudom számolni melyik szelvény hány találatos
            collector.forEach((element, index) => {

                if (collector[index+1]) { // A tömb utolsó eleménél járva már nincs mivel összehasonlítani, ezért erre szűrök
                    if (element === collector[index+1]) { // Ha a jelen elem azonos a következővel, növelje a számlálót 1-el
                        counter++;
                    } else { // Ha jelen elem nem azonos a következővel, akkor a megfelelő találatos key számát növelje 1-el 
                        hits[counter+1]? hits[counter+1]++ : hits[counter+1]=1; // Ha nincs még ilyen key az obj. -ben, hozza létre
                        counter=0; // Nullázza le a számlálót, mivel megszűnt az egyezések sorozata
                    }
                } else {
                    hits[counter+1]? hits[counter+1]++ : hits[counter+1]=1; // Az utolsó elemnél adja hozzá a számláló jelenlegi állását az obj.-hez
                }
            })
        // 
        const opFinish = hrtime.bigint();
        // 
        

    const { ticketCount, prize } = header; // a feladott szelvények számának és a heti nyeremény értékének kivétele a headerből destrukturálással

    // Az Object.keys visszaadja a key-eket egy tömbben. A hits object keys tömbjének hosszából egyet levonva (1-es találatokat kivéve) megkapjuk,
    // hogy hány felé osztandó a teljes nyeremény egyenlő arányban.
    const divider = Object.keys(hits).length-1; 

    // Az eheti adatok rögzítése egy objectban, mely később felhasználható - kiküldhető express segítségével
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
            }
        }; 


    // Az eredmények megjelenítése konzolban
    console.log("Results: ", prizes);

    const end = hrtime.bigint();

    // korábban adott időpontban definiált változók segítségével az időszükségletek számolása nanosec-ben. majd konzolba kiírása
    console.log(`${dataLoadFinish - dataLoadStart} nanoseconds to load the dataset`);
    console.log(`${opFinish - opStart} nanoseconds to complete operations on the dataset`);

    // A teljes futásidő kiírása konzolba
    console.log(`${end - start} nanoseconds total runtime`);
}

// A program lefuttatása
wrapper(); 