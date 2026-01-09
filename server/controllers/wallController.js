const db = require('../db/database');
const fs = require('fs');
const path = require('path');

exports.getAllWalls = (req, res) => {
    const query = `
        SELECT w.*, wi.image_path as gallery_image
        FROM walls w
        LEFT JOIN wall_images wi ON w.id = wi.wall_id
        ORDER BY w.created_at DESC, wi.id ASC
    `;
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const wallsMap = {};
        rows.forEach(row => {
            if (!wallsMap[row.id]) {
                wallsMap[row.id] = {
                    ...row,
                    image: row.type === 'example' ? row.image_path : `/uploads/${row.image_path}`,
                    images: []
                };
                delete wallsMap[row.id].gallery_image;
            }
            if (row.gallery_image) {
                wallsMap[row.id].images.push({
                    url: `/uploads/${row.gallery_image}`,
                    path: row.gallery_image
                });
            }
        });
        res.json(Object.values(wallsMap));
    });
};

exports.createWall = (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
    }

    const { name } = req.body;
    const wallId = 'w_' + Date.now();
    const coverImage = files[0].filename;

    db.serialize(() => {
        db.run(
            'INSERT INTO walls (id, name, image_path, type) VALUES (?, ?, ?, ?)',
            [wallId, name || `Muro #${Date.now()}`, coverImage, 'user']
        );

        const stmt = db.prepare('INSERT INTO wall_images (wall_id, image_path) VALUES (?, ?)');
        files.forEach(file => {
            stmt.run(wallId, file.filename);
        });

        stmt.finalize((err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                id: wallId,
                name,
                image: `/uploads/${coverImage}`,
                images: files.map(f => ({ url: `/uploads/${f.filename}`, path: f.filename })),
                type: 'user'
            });
        });
    });
};
