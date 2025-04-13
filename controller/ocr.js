const { processOCR } = require("../Utility/Processing");

exports.uploadImage = async (req, res) => {
  try {
    const result = await processOCR(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "OCR processing failed" });
  }
};
