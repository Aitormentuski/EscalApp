const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const wallController = require('./controllers/wallController');
const routeController = require('./controllers/routeController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
// Walls
app.get('/api/walls', wallController.getAllWalls);
app.post('/api/walls', upload.array('images', 10), wallController.createWall);

// Routes (Climbing routes)
app.get('/api/routes', routeController.getRoutes);
app.post('/api/routes', routeController.createRoute);
app.put('/api/routes/:id', routeController.updateRoute);
app.delete('/api/routes/:id', routeController.deleteRoute);

// Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
