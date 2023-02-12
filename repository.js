// node File System modul behívása
const fs = require("fs");

// Class -ként egy univerzális lemezkezelő lett megírva, mely egy mappanevet vár argumentumként
class Repository {
    constructor(dir) {
        this.dir = dir; // a class -ban rögzítse a mappanevet "dir" név alatt

        if (!this.dir) { // ha nem lett dir argumentum megadva, konzolban jelezze ezt.
            console.log("Creating a folder requires a folder name");
        }

        if (!fs.existsSync(this.dir)) { // Ha nem tud hozzáférni a mappához (nem létezik) -> hozza létre
            console.log("Cant access database, creating...");
            fs.mkdirSync(this.dir);
        }
    }

    // Szükséges funckiók létrehozása method-ként

    // Header betöltése async function
    async getHeader(week) {
        const contents = JSON.parse(await fs.promises.readFile(`./${this.dir}/${week}_week/header.json`)); // fájl olvasása async művelet -> alakítsa vissza JSON formátumból
        return contents;
    }
 
    // Header kiírása async function
    async writeHeader(data, week) {
        await fs.promises.writeFile(`./${this.dir}/${week}_week/header.json`, JSON.stringify(data, null, 2)); // írja ki JSON stringgé alakítva az adatokat async
    }

    // Külön fileokban az egyes játékszámokat (1-90) tartalmazó szelvény id-k rögzítése
    async writeFile(data, week) {
        try {
            await fs.promises.stat(`./${this.dir}/${week}_week`)

        } catch(err) {
            await fs.promises.mkdir(`./${this.dir}/${week}_week`);  
        }

        for (let key in data) {
            await fs.promises.writeFile(`./${this.dir}/${week}_week/${key}.json`, JSON.stringify(data[key]));
        }
    }

    // A nyerőszámokkal egyező, tehát min. 1 találatos szelvény id-k betöltése
    async readFile(nums, week) {
        try {
            await fs.promises.stat(`./${this.dir}/${week}_week`); // Megpróbálja megnyitni a kért hét mappáját
        } catch(err) {
            throw new Error ("Cant access"); // Ha nem sikerül, hibát dob vissza
        }

        // Ha sikerül, akkor egy objectot feltölt a nyerőszámokkal egyező nevű JSON file-ok adataival (ez 5 db file 5 db nyerőszámhoz. Össz. 90 file van)
        const obj = {};

        for (let num of nums) { // Az obj adott nyerőszám nevű key-jel legyen egyenlő a JSON file -ban lévő szelvény id-kkel
            obj[num] = JSON.parse(await fs.promises.readFile(`./${this.dir}/${week}_week/${num}.json`));
        }
        return obj; // visszaadja a teljes objectot, mely tartalmazza az összes legalább 1 db találatos szelvény id-jét a nyerőszámokhoz csoportosítva
    }

    // A mappa teljes tartalmának kiolvasása
    async readAllFiles() {
        const data = await fs.promises.readdir(this.dir);
        return data;
    }

    // Logfile létrehozása
    async createLog(data) {
        
        let log;

        try {
            log = await this.getLog(); // Ha már van log file -> ne írja felül

        } catch(err) { // Ha még nem volt, hozza létre, egy iterálható tömbként
            const arr = [];
            arr.push(data);
            await fs.promises.writeFile(`./${this.dir}/log.json`, JSON.stringify(arr, null, 2));
            return;
        }

        try {
            await this.updateLog(data); // Tehát ha már volt log file, akkor updatelje azt

        } catch (err) {
            console.log(err);
        }
    }

    // Logfile betöltése
    async getLog() {
        return JSON.parse(await fs.promises.readFile(`./${this.dir}/log.json`)); 
    }

    // Logfile -ba új heti adatok beírása
    async updateLog(data) {
        const log = await this.getLog();

        log.push(data);
        await fs.promises.writeFile(`./${this.dir}/log.json`, JSON.stringify(log, null, 2));
    }

    // 1db hét adatainak kikeresése a log file-ból
    async getOneFromLog(weekId) {
        
        let log;

        try {
            log = await this.getLog(); 

        } catch(err) {
            throw new Error ("Couldnt access database");
        } 

        const result = log.filter(data => data.week === parseInt(weekId));

        if (result.length===0) {
            throw new Error ("No data for that week in log, getWin needed");
        } 

        return result[0]; // A további munkához az objectra van szükség, nem egy tömbre, ezért csak az object-t továbbítom "[0]"
    }
}

// module.exports használatával egy darab "instance" -t ebből a classból exportálunk fixen database mappanévvel dolgozva
// (Azért "module.exports =", mert az eredeti "exports" van, hogy bugosan viselkedik) 
// B opció magát a class-t exportálni, de ez a megoldás így kevesebb hibalehetőséget hordoz magában, jelenleg jobb választás
module.exports = new Repository("database"); 