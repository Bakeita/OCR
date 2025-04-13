const express = require('express')
const multer = require("multer");
const path  = require('path')
const app = express()
const cors = require('cors')
app.use(express.static("public/static"));
app.use(cors())
// Route principale
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Get file extension
      const newName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext; // Unique filename
      cb(null, newName);
    }
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
      }
      cb(null, true);
    }
  });
  
  app.post("/uploads", (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle multer-specific errors (e.g., file too large)
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Handle general errors
        return res.status(500).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      res.json({ message: 'File uploaded successfully', filename: req.file.filename });
    });
  });
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
  
app.listen(5000)

