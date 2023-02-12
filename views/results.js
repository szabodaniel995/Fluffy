const template = require("./template");

module.exports = (data) => {
    return template({
        content: `
                <h1 class="winningTitle">
                <span><a href="/results/${data.week-1}"><button class="btn btn-warning"><i class="fa-solid fa-angles-left"></i></button></a></span>
    
                <span>${data.week}. hét nyerőszámai:</span> 

                <span><a href="/results/${data.week+1}"><button class="btn btn-warning"><i class="fa-solid fa-angles-right"></i></button></a></span>
                </h1>    

                <div class="container winning">
                    <div class="winningDiv"><div class="theWinningNums">${data.winningNumbers[0]}</div></div>
                    <div class="winningDiv"><div class="theWinningNums">${data.winningNumbers[1]}</div></div>
                    <div class="winningDiv"><div class="theWinningNums">${data.winningNumbers[2]}</div></div>
                    <div class="winningDiv"><div class="theWinningNums">${data.winningNumbers[3]}</div></div>
                    <div class="winningDiv"><div class="theWinningNums">${data.winningNumbers[4]}</div></div>
                </div>
               
                <div class=" tableWrap mx-auto">
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Találat</th>
                            <th scope="col">Darabszám</th>
                            <th scope="col">Nyeremény</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>5</td>
                                <td>${data.fives.Count.toLocaleString()} db</td>
                                <td>${data.fives.Prize.toLocaleString()} Ft</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>${data.fours.Count.toLocaleString()} db</td>
                                <td>${data.fours.Prize.toLocaleString()} Ft</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>${data.threes.Count.toLocaleString()} db</td>
                                <td>${data.threes.Prize.toLocaleString()} Ft</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>${data.twos.Count.toLocaleString()} db</td>
                                <td>${data.twos.Prize.toLocaleString()} Ft</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                
                <div class="container-fluid">
                    <div class="weekButtonsDiv">
                        <a href="/results/${data.week-1}"><button class="btn btn-warning">Előző hét</button></a>
                        <a href="/results/${data.week+1}"><button class="btn btn-warning">Következő hét</button></a>
                    </div>
                </div>



                <div class="runtimeInfo">
                <a class="btn btn-light" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    További információ (futásidők)
                </a>
                </div>

                <div class="collapseWrapper mx-auto mt-1 mb-2 mt-md-3">
                    <div class="collapse " id="collapseExample">
                        <div class="card card-body">
                            <div>Feladott szelvények száma: ${parseInt(data.ticketCount).toLocaleString()} db</div>
                            <div class="mt-2">Időhatékonyság:</div>
                            <ul>
                            <li>Adatbázis létrehozása: ${(data.efficiency.time/Math.pow(10, 9)).toFixed(4)} másodperc</li>
                            <li>Adatbázis betöltése: ${(data.efficiency.loadData/Math.pow(10, 9)).toFixed(4)} másodperc</li>
                            <li>Nyertes szelvények összeszámolása: ${(data.efficiency.operateOnData/Math.pow(10, 9)).toFixed(4)} másodperc</li>
                            <li>Tesztfeladat végrehajtásának teljes időszükséglete: ${(data.efficiency.total/Math.pow(10, 9)).toFixed(4)} másodperc</li>
                            </ul> 
                        </div>
                    </div>
                </div>
    `
    }) 
}




           