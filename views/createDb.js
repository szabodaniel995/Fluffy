const template = require("./template");

module.exports = (log) => {
    
    const newLog = log.map(data => {
        if (!data.includes("json")) {  
            return `
                <tr>
                    <td><a href="/results/${data.split("_")[0]}">${data.split("_")[0]}. hét</a></td>
                </tr>
            `  
        }
    }).join(" ");

    return template({
        content: `
            <div class="tableWrap mx-auto">
            <div class="tableTopper">
                <span>Elérhető adatok: </span>
                <button type="button" class="btn btn-warning topButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Adatbázis létrehozása
                </button>
            </div>
            <table class="table">

                <tbody>
                    ${newLog}
                </tbody>
            </table>
            <div class="tableBottom">
                <button type="button" class="btn btn-warning bottomButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Adatbázis létrehozása
                </button>
            </div>
        </div>

        <form method="POST" action="/createDatabase">
            <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Szelvények, játékhét generálása</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>


                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="p" class="form-label">Össznyeremény:</label>
                            <input type="number" class="form-control" name="prize" id="p" value="1447849535" placeholder="Heti nyeremény"/>
                        </div>
                    
                        <div class="mb-3">
                            <label for="tc" class="form-label">Feladott szelvények száma:</label>
                            <input type="text" class="form-control" name="ticketCount" id="tc" value="4992576" placeholder="Heti szelvények"/>
                        </div>
                    
                        <div class="mb-3">
                            <label for="w" class="form-label">Hét: </label>
                            <input type="text" class="form-control" name="week" id="w" value="1" placeholder="Adott hét száma"/>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button class="btn btn-primary modalSubmit">Új heti adatbázis létrehozása</button>
                    </div>
                </div>
            </div>
            </div>
        </form>

        <script>
            const button = document.querySelector(".modalSubmit");

            button.addEventListener("click", () => {
                button.classList.add("disabled");
            })
        </script>
        `
    }) 
}

