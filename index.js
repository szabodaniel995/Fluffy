// szükséges fájl(ok) behívása
const express = require("express");
const bodyParser = require('body-parser');
const ngrok = require('ngrok');

const repository = require("./repository");
const createDb = require("./databaseCreator");
const getWin = require("./winningNumbers");
const indexTemplate = require("./views/results");
const generateDataTemplate = require("./views/createDb");

const app = express();

// Public könyvtár elérhetővé tétele, így már innen a CSS file betölthető
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended:true})); // Post request-k body -ját parse-olni szükséges, megoldás jelenleg: külső library

// Főoldalról átirányít az adatbázis létrehozó oldalra, mert első megnyitásnál még nincs adatbázisunk
app.get("/", async (req, res) => {
    res.redirect("/createDatabase");
})

// ezen a címen visszaküld egy template HTML-t, itt lehet létrehozni tetszés szerinti adatokkal szelvényeket, stb
app.get("/createDatabase", async (req, res) => {
    const log = await repository.readAllFiles();

    // Rendezni és számmá alakítani szükséges, másképp a 11. heti adatot az 1. heti adat felett jelenítené meg.
    log.sort((a, b) => parseInt(a)-parseInt(b));
    
    // Visszaküld egy views mappában lementett html-t
    res.send(generateDataTemplate(log));
})

// POST request kap ezen a címen -> elindítja az adatbázis létrehozó .js -t, ami meghívja a repository.js -t -> elkészülnek a fileok a lemezen
app.post("/createDatabase", async (req, res) => {

    // req.body -ból a névvel rendelkező inputok értékei kivehetők POST request esetén
    const { week, prize, ticketCount } = req.body;

    await createDb(week, prize, ticketCount); // a body-ban beérkező adatok továbbadhatók, lehet velük dolgozni

    res.redirect(`/createDatabase`) // Ha elkészültek a fentiek, visszairányít az adatbázis kezelő oldalra
})

// Ha GET request-t kap a results oldalra, / -jel után tetszőleges számmal, akkor annak a számnak megfelelő heti adatokat tölti be
app.get("/results/:weekId", async (req, res) => {

    const week = req.params.weekId; // req.params tartalmazza a "/:..." .al megadott értékeket. URL-ben továbbítható így változó érték
    let data;

    try {
        data = await repository.getOneFromLog(week); // Próbáljon meg erre a hétre lementett eredményeket kikeresni a log file-ból
    } catch(err) { // Ha nem sikerül..
        try {
            data = await getWin(week); // Próbálja meg már meglévő szelvényekhez megállapítani, hogy hány találat van
        } catch(err) { // Ha nem sikerül (=még nincs arra a hétre szelvény adatbázis)
            return res.redirect("/createDatabase"); // Akkor irányítson át az adatbázis kezelő felületre, ahol létrehozható lesz
        }
    }

    res.send(indexTemplate(data)); // Ha sikerül -> nyissa meg a megfelelő heti eredmények oldalát, és prezentálja azt
})


// Nyissa meg a 80-as portot, localhost:80/ URL címen figyelje a beérkező requesteket
app.listen(80, () => { 
    console.log("Listening on localhost:80");
});

// Valamint a konzolba kiírt url címen tegye elérhetővé az oldalt más eszközök számára is
(async function() {
    const url = await ngrok.connect({ authtoken:"2L05wZSBvwhYkTsjez8JfjdEKJN_7XtLrVpXefdmnWAbwrDQr" });
    console.log("Hosted on: ", url);
})();