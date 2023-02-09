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

    // Jelenleg 2 funkcióra van szükség, 1: töltsük be az összes adatot az adattárból, 2: készítsünk új adattárat

    // Összes adat betöltése async function
    async getAll() {
        const contents = JSON.parse(await fs.promises.readFile(this.filename)); // fájl olvasása async művelet -> alakítsa vissza JSON formátumból
        return contents;
    }
 
    // write all
    async writeAll(data) {
        await fs.promises.writeFile(this.filename, JSON.stringify(data)); // írja ki JSON stringgé alakítva az adatokat async
    }
}

// module.exports használatával egy darab "instance" -t ebből a classból exportálunk fixen database.json filenévvel dolgozva
// (Azért "module.exports =", mert az eredeti "exports" van, hogy bugosan viselkedik) 
// B opció magát a class-t exportálni, de ez a megoldás így kevesebb hibalehetőséget hordoz magában, jelenleg jobb választás
module.exports = new Repository("database.json"); 