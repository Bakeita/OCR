const Tesseract = require("tesseract.js");

exports.processOCR = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  });
  return result.data.text;
};
