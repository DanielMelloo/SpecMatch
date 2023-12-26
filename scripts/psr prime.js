// Suponha que temos os dados em arrays de objetos JavaScript
let dadosCPUs = [
    { jogo: "Red Dead Redemption 2", cpu: "i5-12450", maxFPS: 68.6 }
    // ... outros dados
]
  
let dadosGPUs2 = [
    {
      jogo: "Red Dead Redemption 2",
      videoCard: "RTX 3050",
      resolucoes: {
        "720p": { Low: null, Medium: null, High: null, Ultra: null },
        "1080p": { Low: 184.5, Medium: 114.8, High: 79.9, Ultra: 45 },
        // ... outras resoluções e qualidades
      }
    }
    // ... outros dados
]


let dadosGPUs = []

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
  
// Função para buscar combinações de hardware que satisfaçam as restrições
function buscarCombinacoes(dadosCPUs, dadosGPUs, requisitos) {
    let combinacoes = []
    for (let cpu of dadosCPUs) {
        for (let gpu of dadosGPUs) {
            if (cpu.jogo === requisitos.jogo && gpu.jogo === requisitos.jogo) {
                let fps = gpu.resolucoes[requisitos.resolucao][requisitos.qualidade]
                if (fps && fps >= requisitos.taxaDeFrames) {
                    combinacoes.push({ cpu: cpu.cpu, videoCard: gpu.videoCard })
                }
            }
        }
    }
    return combinacoes
}



// Function to read Excel file and convert to desired JSON format
async function readExcelFile(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" })
    
  
    // Assuming the workbook's first sheet is the one we need
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    // Start at 1 to skip the header row, and assume certain columns
    const gpuReadData = jsonData.slice(4).map((row) => ({
        jogo: row[0],
        videoCard: row[1],
        resolucoes: {
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
        dadosGPUs = await readExcelFile('./dataBases/dataBase-videoCard.xlsx');
        afterDataLoaded(); // Chame uma função que precisa dos dados após eles estarem carregados
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}



let requisitos = {
    jogo: "Red Dead Redemption 2",
    resolucao: "1080p",
    qualidade: "High",
    taxaDeFrames: 60
}

function afterDataLoaded() {
    
    let possiveisCombinacoes = buscarCombinacoes(dadosCPUs, dadosGPUs2, requisitos)
    console.log('Daniel Log - afterDataLoaded - possiveisCombinacoes:', possiveisCombinacoes);

}


handleExcelData();
