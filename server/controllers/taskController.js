const Task = require('../models/Task');

// @desc    Get all tasks with search, filtering, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let query = {};

    // Role-based logic: User sees only their own tasks, Admin sees all tasks
    if (req.user.role !== 'Admin') {
      query.createdBy = req.user._id;
    }

    // Search by title (regex, case insensitive)
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Sorting (default to descending due date, or specified by sort query)
    let sort = {};
    if (req.query.sortBy === 'dueDateAsc') {
      sort.dueDate = 1;
    } else if (req.query.sortBy === 'dueDateDesc') {
      sort.dueDate = -1;
    } else if (req.query.sortBy === 'createdAtAsc') {
      sort.createdAt = 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email role')
      .sort(sort);

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user owns task or is Admin
    if (task.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide title and due date' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      createdBy: req.user._id,
    });

    // Populate createdBy details
    const populatedTask = await Task.findById(task._id).populate('createdBy', 'name email role');

    // Socket.io Real-time event trigger
    const io = req.app.get('socketio');
    if (io) {
      io.emit('task_created', {
        task: populatedTask,
        sender: req.user.name,
      });
    }

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user owns task or is Admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('createdBy', 'name email role');

    // Socket.io Real-time event trigger
    const io = req.app.get('socketio');
    if (io) {
      io.emit('task_updated', {
        task: populatedTask,
        sender: req.user.name,
      });
    }

    res.json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user owns task or is Admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Socket.io Real-time event trigger
    const io = req.app.get('socketio');
    if (io) {
      io.emit('task_deleted', {
        taskId: req.params.id,
        title: task.title,
        sender: req.user.name,
      });
    }

    res.json({ success: true, message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
