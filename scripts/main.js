
// ========================================================================================= //
//  -                                                                                     -  //
//  Autor: Daniel de Oliveira Mello                                                          //
//  Data: 25/12/2023                                                                         //
//  -                                                                                     -  //
//  Objetivo do script:                                                                      //
//  Implementar o algoritmo de satisfação de restrição para encontrar a melhor configuração  //
//  para um jogo em determinado cenário.                                                     //
//  -                                                                                     -  //
//  Nome: SpecMatch - PSR                                                                    //
//  -                                                                                     -  //
//  Observações:                                                                             //
//  -                                                                                     -  //
//  -                                                                                     -  //
// ========================================================================================= //



// ================== // 
//  Global Variables  //
// ================== // 


let dataBasesAdress = {
    cpu: './dataBases/dataBase-cpu.xlsx',
    gpu: './dataBases/dataBase-videoCard.xlsx',
    games: './dataBases/dataBase-games.xlsx',
}

let requisitions = {
    game: null,
    resolution: null,
    quality: null,
    fps: null
}

let gpusData = []

let gamesList = []
let cpusData = []



// ======================= //
//  Read Games From excel  //
// ======================= //



document.addEventListener('DOMContentLoaded', function() {
    loadDataFromExcelGames(dataBasesAdress.games, function(json) {
        gamesData = json
        processReadGameData() // Isso atualiza gamesList internamente
    })

    loadDataFromExcelCPU(dataBasesAdress.cpu, function(json) {
        cpuData = json
        processReadCPUData() // Isso atualiza cpusList internamente
    })
})

function loadDataFromExcelGames(url, callback) {
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

function processReadGameData() {
    if (Array.isArray(gamesData)) {
        gamesList = gamesData.map(dicionario => Object.values(dicionario))

    } else {
        console.error("Dados de Games não estão em formato esperado.")
    }
}

// ======================= //
//  Read Games From excel  //
// ======================= //


function loadDataFromExcelCPU(url, callback) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            let workbook = XLSX.read(buffer, {type: 'buffer'})
            let firstSheetName = workbook.SheetNames[0]
            let worksheet = workbook.Sheets[firstSheetName]
            // Aqui, passamos a opção header:1 para obter um array de arrays.
            let json = XLSX.utils.sheet_to_json(worksheet, {header:1})
            callback(json)
        })
        .catch(error => console.error('Error loading data:', error))
}


function processReadCPUData() {
    console.log('Iniciando processamento dos dados da CPU...')

    if (Array.isArray(cpuData) && cpuData.length > 1) {
        // Usamos slice(1) para pular a primeira linha que é o cabeçalho da tabela.
        cpusData = cpuData.slice(1).map(row => {
            // Certifique-se de que há dados em cada linha para evitar erros.
            if(row.length >= 3) {
                return {
                    game: row[0],  // Índice 0 para o nome do jogo
                    cpu: row[1],   // Índice 1 para o modelo da CPU
                    maxFPS: row[2] ? parseFloat(row[2]) : null // Índice 2 para Max FPS, convertido para float
                }
            }
        }).filter(item => item != null) // Filtramos as linhas onde não há dados suficientes
    } else {
        console.error("Dados de CPU não estão em formato esperado.")
    }
}




// =========================== //
//  Catch Data From Interface  //
// =========================== //

    // ============================ //
    //  Games Catch From Interface  //
    // ============================ //

        // ================= //
        //  Match Interface  //
        // ================= //



function showGameList() {
    document.getElementById('lista-jogos').style.display = 'block' // Mostra a lista
}


function hideGameList() {
    // Use um pequeno atraso para permitir a seleção do item antes de ocultar a lista
    setTimeout(() => {
        document.getElementById('lista-jogos').style.display = 'none' // Oculta a lista
    }, 200)
}


function filterGames(digitedText) {
    let filteredGames = []

    if (digitedText === '.') {
        // Se o texto for apenas um ponto, exibir o primeiro elemento de cada sublista
        filteredGames = gamesList.map(lista => lista[0])
    } else if (digitedText) {
        // Filtrar baseado em todas as variações dos nomes
        gamesList.forEach(sublista => {
            if (sublista.some(variacao => variacao.toLowerCase().includes(digitedText.toLowerCase()))) {
                // Adicionar o nome mais popular (primeiro elemento) se alguma variação corresponder
                filteredGames.push(sublista[0])
            }
        })
    }

    showGames(filteredGames)
}


function showGames(games) {
    let container = document.getElementById('lista-jogos')
    container.innerHTML = ''

    games.forEach(game => {
        let div = document.createElement('div')
        div.textContent = game
        div.onclick = function() {
            document.getElementById('game-search').value = game // Atualiza o campo de pesquisa
            // Adicione aqui qualquer outro indicativo de seleção, como alterar a cor de fundo
            highlightSelectedGame(div)

            requisitions.game = game             
        }
        container.appendChild(div)
    })
}


function highlightSelectedGame(selectedDiv) {
    // Remove a classe 'selected' de todos os jogos
    document.querySelectorAll('#lista-jogos div').forEach(div => {
        div.classList.remove('selected')
    })
    // Adiciona a classe 'selected' ao jogo clicado
    selectedDiv.classList.add('selected')
}


    // ============================ //
    //  Catch Specs From Interface  //
    // ============================ //

function updateResolution() {
    let selectedResolution = document.getElementById('resolution-search').value
    requisitions.resolution = selectedResolution
}

function updateGraphicQuality() {
    let selectedQuality = document.getElementById('graphic-quality-search').value
    requisitions.quality = selectedQuality
}

function updateFrameRate() {
    let selectedFrameRate = document.getElementById('frame-rate-search').value
    requisitions.fps = parseFloat(selectedFrameRate)
}



// ========= // 
//  Classes  //
// ========= // 



// Representa uma variável no PSR
class Variavel {
    constructor(nome, dominio) {
        this.nome = nome
        this.dominio = dominio // Lista de possíveis valores
    }
}
  

// Representa uma restrição no PSR
class Restricao {
    constructor(escopo, funcao) {
        this.escopo = escopo // Variáveis que a restrição se aplica
        this.funcao = funcao // Função que verifica a restrição
}
  
    satisfaz(atribuicao) {
        return this.funcao(atribuicao)
    }
}



// ===================== // 
//  Read GPUs From Excel //
// ===================== // 


function searchCombinations(CPUsDataEntry, GPUsDataEntry, requisitionsEntry) {
    let copmbinations = []
    for (let cpu of CPUsDataEntry) {
        for (let gpu of GPUsDataEntry) {
            if (cpu.game === requisitionsEntry.game && gpu.game === requisitionsEntry.game) {
                let fps = gpu.resolutions[requisitionsEntry.resolution][requisitionsEntry.quality]
                if (fps && fps >= requisitionsEntry.fps) {
                    copmbinations.push({ cpu: cpu.cpu, videoCard: gpu.videoCard })
                }
            }
        }
    }
    return copmbinations
}

// Function to read Excel file and convert to desired JSON format
async function readExcelFileGPUSpecs(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" })
    
  
    // Assuming the workbook's first sheet is the one we need
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    // Start at 1 to skip the header row, and assume certain columns
    const gpuReadData = jsonData.slice(4).map((row) => ({
        game: row[0],
        videoCard: row[1],
        resolutions: {
            "720p": {
                Low: (row[2] === 'null' || row[2] === '') ? null : parseFloat(row[2]),
                Medium: (row[3] === 'null' || row[3] === '') ? null : parseFloat(row[3]),
                High: (row[4] === 'null' || row[4] === '') ? null : parseFloat(row[4]),
                Ultra: (row[5] === 'null' || row[5] === '') ? null : parseFloat(row[5]),
              },
              "1080p": {
                Low: (row[6] === 'null' || row[6] === '') ? null : parseFloat(row[6]),
                Medium: (row[7] === 'null' || row[7] === '') ? null : parseFloat(row[7]),
                High: (row[8] === 'null' || row[8] === '') ? null : parseFloat(row[8]),
                Ultra: (row[9] === 'null' || row[9] === '') ? null : parseFloat(row[9]),
              },
              "1440p": {
                Low: (row[10] === 'null' || row[10] === '') ? null : parseFloat(row[10]),
                Medium: (row[11] === 'null' || row[11] === '') ? null : parseFloat(row[11]),
                High: (row[12] === 'null' || row[12] === '') ? null : parseFloat(row[12]),
                Ultra: (row[13] === 'null' || row[13] === '') ? null : parseFloat(row[13]),
              },
              "2160p": {
                Low: (row[14] === 'null' || row[14] === '') ? null : parseFloat(row[14]),
                Medium: (row[15] === 'null' || row[15] === '') ? null : parseFloat(row[15]),
                High: (row[16] === 'null' || row[16] === '') ? null : parseFloat(row[16]),
                Ultra: (row[17] === 'null' || row[17] === '') ? null : parseFloat(row[17]),
            },
        },
    }))
  
    return gpuReadData
}

async function handleExcelData() {
    try {
        console.log('Carregando dados da GPU...')
        gpusData = await readExcelFileGPUSpecs( dataBasesAdress.gpu)
        console.log('Dados da GPU carregados:', gpusData)
        afterDataLoaded() // Chame uma função que precisa dos dados após eles estarem carregados
    } catch (error) {
        console.error('Erro ao carregar os dados:', error)
    }
}

function afterDataLoaded() {
    let potencialCombinations = searchCombinations(cpusData, gpusData, requisitions)

    if (potencialCombinations && potencialCombinations.length > 0) {
        console.log('Daniel Log ', potencialCombinations)
        displayPotentialCombinations(potencialCombinations)

    } else {
       console.warn('Nenhuma combinação encontrada **lembrar de adicionar verificações de erro para cada caso**')
       nonePotentialCombinations()

    }
    
}

function performSearch() {
    handleExcelData()
}


// ================ // 
//  Display Results //
// ================ // 


function resetTable() {
    const container = document.getElementById('combinations-container')
    container.innerHTML = '' // Limpa qualquer conteúdo existente
}

function nonePotentialCombinations() {
    resetTable() // Reseta a tabela

    const container = document.getElementById('combinations-container')
    const table = document.createElement('table')
    const row = table.insertRow()
    const cell = row.insertCell()

    cell.textContent = 'Nenhuma combinação compatível encontrada.'
    cell.style.textAlign = 'center' // Centraliza o texto na célula
    table.style.width = '100%' // Faz a tabela ocupar toda a largura do container

    container.appendChild(table) // Adiciona a nova tabela ao container
}

function displayPotentialCombinations(potencialCombinations) {
    const container = document.getElementById('combinations-container');
    resetTable(); // Clears any existing content

    // Check if potencialCombinations is an array and is not empty
    if (Array.isArray(potencialCombinations) && potencialCombinations.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['CPU', 'Placa de Vídeo'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        potencialCombinations.forEach(combination => {
            const row = document.createElement('tr');
            Object.values(combination).forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        container.appendChild(table); // Add the table to the container
    } else {
        // Handle case where no combinations are found or potencialCombinations is not an array
        container.innerHTML = '<p>Nenhuma combinação compatível encontrada.</p>';
    }
}
