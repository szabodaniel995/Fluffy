// node File System behívása
const fs = require("fs");

// Class -ként egy univerzális lemezkezelő írása, mely egy fájlnevet vár argumentumként
class Repository {
    constructor(filename) {
        this.filename = filename; // a class -ban rögzítse a filename -t "filename" név alatt

        if (!this.filename) { // ha nem lett filename argumentum megadva konzolban jelezze ezt.
            console.log("Creating a repository requires a filename");
        }

        try {
            fs.accessSync(this.filename); // megpróbál hozzáférni a megadott nevű fájlhoz, ha nem tud = nincs ilyen fájl
        } catch (err) {
            console.log("Cant access file, creating..."); // hibakezelés: hozza létre ezt a fájlt

            try {
                fs.writeFileSync(this.filename, "[]"); // constructor functionban nem szabad async-t használni -> sync változat
            } catch (err) {
                console.log("Couldnt create file"); // Ha bármi miatt nem sikerült létrehozni a fájlt -> jelezze konzolban
            }
        }
    }

    // Jelenleg 4 funkcióra van szükség, 1: töltsük be headert, 2: készítsünk új headert, írjuk ki a szelvényeket, olvassuk be a szelvényeket

    // Header betöltése async function
    async getAll() {
        const contents = JSON.parse(await fs.promises.readFile(`header.json`)); // fájl olvasása async művelet -> alakítsa vissza JSON formátumból
        return contents;
    }
 
    // Header kiírása async function
    async writeAll(data) {
        await fs.promises.writeFile(`header.json`, JSON.stringify(data, null, 2)); // írja ki JSON stringgé alakítva az adatokat async
    }

    // Külön fileokban az egyes játékszámokat (1-90) tartalmazó szelvény id-k rögzítése
    async writeFile(data) {
        for (let key in data) {
            await fs.promises.writeFile(`${key}.json`, JSON.stringify(data[key]));
        }
    }

    // A nyerőszámokkal egyező, tehát min. 1 találatos szelvény id-k betöltése
    async readFile(nums) {
        const obj = {};
        for (let num of nums) {
            obj[num] = JSON.parse(await fs.promises.readFile(`${num}.json`));
        }
        return obj;
    }
}

// module.exports használatával egy darab "instance" -t ebből a classból exportálunk fixen database.json filenévvel dolgozva
// (Azért "module.exports =", mert az eredeti "exports" van, hogy bugosan viselkedik) 
// B opció magát a class-t exportálni, de ez a megoldás így kevesebb hibalehetőséget hordoz magában, jelenleg jobb választás
module.exports = new Repository("database.json"); 