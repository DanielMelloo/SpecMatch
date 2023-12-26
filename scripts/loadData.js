

// Function to read Excel file and convert to desired JSON format
// async function readExcelFile(url) {
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();
//     const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    
  
//     // Assuming the workbook's first sheet is the one we need
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//     // console.log('Daniel Log - readExcelFile - jsonData:', jsonData);
    
//     // const valid_worsheet = j
//     // Start at 1 to skip the header row, and assume certain columns
//     const dadosGPUs = jsonData.slice(4).map((row) => ({
//       Game: row[0],
//       videoCard: row[1],
//       resolucoes: {
//         "720p": {
//           Low: row[2] || null,
//           Medium: row[3] || null,
//           High: row[4] || null,
//           Ultra: row[5] || null,
//         },
//         "1080p": {
//           Low: row[6] || null,
//           Medium: row[7] || null,
//           High: row[8] || null,
//           Ultra: row[9] || null,
//         },
//         "1440p": {
//           Low: row[10] || null,
//           Medium: row[11] || null,
//           High: row[12] || null,
//           Ultra: row[13] || null,
//         },
//         "2160p": {
//           Low: row[14] || null,
//           Medium: row[15] || null,
//           High: row[16] || null,
//           Ultra: row[17] || null,
//         },
//       },
//     }));
  
//     return dadosGPUs;
//   }
  
//   // Call the function with the Excel file URL
//   readExcelFile('./dataBases/dataBase-videoCard.xlsx').then(dadosGPUs => {
//     console.log(dadosGPUs);
//   });