const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json()); // Evita que req.body sea undefined

// GET /health - Ruta de verificación previa
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// GET /tasks/stats - Ruta de estadísticas previa
app.get('/tasks/stats', async (req, res, next) => {
  try {
    const [generalStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
      FROM tasks
    `);
    const [priorityStats] = await db.query(`
      SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority
    `);
    const byPriority = { alta: 0, media: 0, baja: 0 };
    priorityStats.forEach(row => { if (byPriority.hasOwnProperty(row.priority)) byPriority[row.priority] = row.count; });
    
    res.status(200).json({
      total: generalStats[0].total || 0,
      completed: generalStats[0].completed || 0,
      pending: generalStats[0].pending || 0,
      byPriority: byPriority
    });
  } catch (error) {
    next(error);
  }
});

// 1. GET /tasks - Obtener todas con Paginación (Reto Bonus)
app.get('/tasks', async (req, res, next) => {
  try {
    // Parámetros de paginación opcionales con valores por defecto
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Consulta de datos limitados
    const [tasks] = await db.query(
      'SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Consulta del conteo total para calcular las páginas
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM tasks');
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: tasks,
      total,
      page,
      totalPages
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /tasks/:id - Obtener una sola tarea por su ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// 3. POST /tasks - Crear una nueva tarea con validación de entrada
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// 3. POST /tasks - Crear una nueva tarea con validación de entrada
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    // Validación básica requerida en los criterios de aceptación
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'El título es obligatorio y debe tener al menos 3 caracteres' 
      });
    }

    const taskPriority = priority || 'media';

    const [result] = await db.query(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      [title, description || null, taskPriority]
    );

    // Recuperamos la tarea recién insertada para devolverla completa
    const [newInserted] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, data: newInserted[0] });
  } catch (error) {
    next(error);
  }
});

// 4. PUT /tasks/:id - Actualizar campos de una tarea existente
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    // Comprobamos si el recurso existe previamente
    const [exists] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    // Validación si se intenta actualizar el título
    if (title !== undefined && title.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'El título debe tener al menos 3 caracteres' });
    }

    // Actualizamos dinámicamente manteniendo los valores antiguos si no se envían
    const updatedTitle = title !== undefined ? title : exists[0].title;
    const updatedDescription = description !== undefined ? description : exists[0].description;
    const updatedCompleted = completed !== undefined ? completed : exists[0].completed;
    const updatedPriority = priority !== undefined ? priority : exists[0].priority;

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ?, priority = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedCompleted, updatedPriority, id]
    );

    const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ success: true, data: updatedTask[0] });
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /tasks/:id - Eliminar una tarea por ID
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

// Middleware centralizado para el manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Algo salió mal en el servidor interno' });
});

// Inicialización del puerto
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
