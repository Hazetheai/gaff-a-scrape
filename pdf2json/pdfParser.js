const fs = require("fs");
let PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData =>
  console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", pdfData => {
  return fs.writeFileSync("./json/raw/se-02.json", JSON.stringify(pdfData));
});

pdfParser.loadPDF("./pdf/SE-02_MIDI_Imple_Chart_eng01_W.pdf");
