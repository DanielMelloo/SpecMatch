// let dadosHardware = null
// let gamesData = null


// ========== //
// Excel Data //
// ========== //

document.addEventListener('DOMContentLoaded', function() {
    carregarDadosExcel('./dataBases/basededados-games.xlsx', function(json) {
        gamesData = json
        processarDadosGames() // Isso atualiza gamesList internamente
    })
})

function carregarDadosExcel(url, callback) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            let workbook = XLSX.read(buffer, {type: 'buffer'})
            let firstSheetName = workbook.SheetNames[0]
            let worksheet = workbook.Sheets[firstSheetName]
            let json = XLSX.utils.sheet_to_json(worksheet)
            callback(json)
        })
        .catch(error => console.error('Error loading data:', error))
}


function processarDadosGames() {
    if (Array.isArray(gamesData)) {
        gamesList = gamesData.map(dicionario => Object.values(dicionario));

    } else {
        console.error("Dados de Games não estão em formato esperado.")
    }
}


// =========== //
// Games Catch //
// =========== //


function filterGames(digitedText) {
    let filteredGames = [];

    if (digitedText === '.') {
        // Se o texto for apenas um ponto, exibir o primeiro elemento de cada sublista
        filteredGames = gamesList.map(lista => lista[0]);
    } else if (digitedText) {
        // Filtrar baseado em todas as variações dos nomes
        gamesList.forEach(sublista => {
            if (sublista.some(variacao => variacao.toLowerCase().includes(digitedText.toLowerCase()))) {
                // Adicionar o nome mais popular (primeiro elemento) se alguma variação corresponder
                filteredGames.push(sublista[0]);
            }
        });
    }

    showGames(filteredGames);
}

function showGames(games) {
    let container = document.getElementById('lista-jogos')
    container.innerHTML = ''

    games.forEach(game => {
        let div = document.createElement('div')
        div.textContent = game
        container.appendChild(div)
    })
}


// === //
// PSR //
// === //


    