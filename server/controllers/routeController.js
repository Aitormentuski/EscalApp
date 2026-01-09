const db = require('../db/database');

exports.getRoutes = (req, res) => {
    const { wallId } = req.query;
    let query = 'SELECT * FROM routes';
    const params = [];

    if (wallId) {
        query += ' WHERE wall_id = ?';
        params.push(wallId);
    }

    query += ' ORDER BY last_modified DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const routes = rows.map(r => ({
            ...r,
            holds: JSON.parse(r.holds_data),
            images: r.images_data ? JSON.parse(r.images_data) : null,
            tags: r.tags_data ? JSON.parse(r.tags_data) : []
        }));
        res.json(routes);
    });
};

exports.createRoute = (req, res) => {
    const { wallId, title, grade, status, gradingSystem, description, holds, tags, images } = req.body;

    const id = 'r_' + Date.now();
    const holdsData = JSON.stringify(holds);
    const tagsData = JSON.stringify(tags || []);
    const imagesData = JSON.stringify(images || null);

    db.run(`
        INSERT INTO routes (id, wall_id, title, grade, status, grading_system, description, holds_data, tags_data, images_data, sent_count, last_modified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, wallId, title, grade, status, gradingSystem, description, holdsData, tagsData, imagesData, req.body.sent_count || 0, Date.now()],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, ...req.body });
        });
};

exports.updateRoute = (req, res) => {
    const { id } = req.params;
    const { title, grade, status, gradingSystem, description, holds, tags, images } = req.body;

    db.run(`
        UPDATE routes 
        SET title = ?, grade = ?, status = ?, grading_system = ?, description = ?, holds_data = ?, tags_data = ?, images_data = ?, sent_count = ?, last_modified = ?
        WHERE id = ?
    `, [title, grade, status, gradingSystem, description, JSON.stringify(holds), JSON.stringify(tags), JSON.stringify(images || null), req.body.sent_count || 0, Date.now(), id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, ...req.body });
        });
};

exports.deleteRoute = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM routes WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
};
