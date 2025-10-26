const db = require('../config/database');

// Get all projects for a user
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    // Fetch items for each project
    const projectsWithItems = await Promise.all(
      projects.map(async (project) => {
        const [items] = await db.query(
          `SELECT pi.*, p.name as product_name, p.unit as product_unit, p.price, p.category, p.image_url
           FROM project_items pi
           LEFT JOIN products p ON pi.product_id = p.id
           WHERE pi.project_id = ?`,
          [project.id]
        );
        return { ...project, items };
      })
    );

    res.json({ projects: projectsWithItems });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get single project with items
exports.getProject = async (req, res) => {
  try {
    const [projects] = await db.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [items] = await db.query(
      `SELECT pi.*, p.name as product_name, p.unit as product_unit
       FROM project_items pi
       LEFT JOIN products p ON pi.product_id = p.id
       WHERE pi.project_id = ?`,
      [req.params.id]
    );

    res.json({ project: { ...projects[0], items } });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, budget, start_date, end_date } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO projects (user_id, name, description, budget, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, name, description, budget, start_date, end_date]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: result.insertId,
        name,
        description,
        budget,
        start_date,
        end_date,
        status: 'planning',
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, budget, status, start_date, end_date } = req.body;

    const [result] = await db.query(
      'UPDATE projects SET name = ?, description = ?, budget = ?, status = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ?',
      [name, description, budget, status, start_date, end_date, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Add item to project
exports.addProjectItem = async (req, res) => {
  try {
    const { product_id, product_name, quantity, unit_price, notes } = req.body;

    // Verify project belongs to user
    const [projects] = await db.query(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [result] = await db.query(
      'INSERT INTO project_items (project_id, product_id, product_name, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, product_id, product_name, quantity, unit_price, notes]
    );

    res.status(201).json({
      message: 'Item added to project',
      item: {
        id: result.insertId,
        project_id: req.params.id,
        product_id,
        product_name,
        quantity,
        unit_price,
        notes
      }
    });
  } catch (error) {
    console.error('Add project item error:', error);
    res.status(500).json({ error: 'Failed to add item to project' });
  }
};

// Update project item
exports.updateProjectItem = async (req, res) => {
  try {
    const { quantity, unit_price, notes, is_purchased } = req.body;

    const [result] = await db.query(
      `UPDATE project_items pi
       JOIN projects p ON pi.project_id = p.id
       SET pi.quantity = ?, pi.unit_price = ?, pi.notes = ?, pi.is_purchased = ?
       WHERE pi.id = ? AND p.user_id = ?`,
      [quantity, unit_price, notes, is_purchased, req.params.itemId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Update project item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete project item
exports.deleteProjectItem = async (req, res) => {
  try {
    const [result] = await db.query(
      `DELETE pi FROM project_items pi
       JOIN projects p ON pi.project_id = p.id
       WHERE pi.id = ? AND p.user_id = ?`,
      [req.params.itemId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete project item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
