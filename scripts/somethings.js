let requisitions = {
    game: null,
    resolution: null,
    quality: null,
    fps: null
}

let cpusData[
    {game: row[0]}, // Índice 0 para o nome do jogo
    {cpu: row[1]},   // Índice 1 para o modelo da CPU
    {maxFPS: row[2]} ? parseFloat(row[0])
]

let gpusData = [
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
]