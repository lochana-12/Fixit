// backend/controllers/taskController.js
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User'); // Used to confirm user existence if needed, though protect middleware handles auth

// Helper function to calculate next due date based on last completion and frequency
const calculateNextDueDate = (lastCompleted, frequency) => {
    let nextDate = lastCompleted ? new Date(lastCompleted) : new Date(); // If no lastCompleted, use current date
    switch (frequency) {
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
        case 'semi-annually':
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
        case 'annually':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            // For tasks without a specific recurrence, no automatic nextDueDate
            return null;
    }
    return nextDate;
};


// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const { room, status, priority } = req.query; // Get filters from query parameters
    const userId = req.user._id;

    let filter = { user: userId };

    if (room) {
        filter.room = room;
    }
    if (priority) {
        filter.priority = priority;
    }

    let tasks;
    if (status === 'overdue') {
        // Find tasks that are 'pending' and whose nextDueDate is in the past
        filter.status = 'pending';
        filter.nextDueDate = { $lt: new Date() };
        tasks = await Task.find(filter).sort({ nextDueDate: 1 });
    } else if (status) {
        filter.status = status;
        tasks = await Task.find(filter).sort({ nextDueDate: 1 });
    } else {
        // If no status filter, get all tasks for the user and sort
        tasks = await Task.find(filter).sort({ nextDueDate: 1 });

        // Update status for overdue tasks dynamically for current retrieval (not persistent in DB yet)
        tasks = tasks.map(task => {
            if (task.status === 'pending' && task.nextDueDate && task.nextDueDate < new Date()) {
                // Return a new object to avoid modifying the Mongoose document directly if not saving
                return { ...task.toObject(), status: 'overdue' };
            }
            return task.toObject(); // Convert Mongoose document to plain object
        });
    }

    res.status(200).json(tasks);
});


// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { taskName, room, appliance, frequency, priority, notes } = req.body;

    if (!taskName || !room || !appliance || !frequency || !priority) {
        res.status(400).json({ message: 'Please add all required fields for the task.' });
        return;
    }

    const task = await Task.create({
        user: req.user._id,
        taskName,
        room,
        appliance,
        frequency,
        priority,
        notes,
        status: 'pending', // New tasks are always pending
        lastCompleted: null, // Initially, no last completion date
        // nextDueDate is calculated by the pre-save hook in the Task model
    });

    res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const { status, lastCompleted, ...updateData } = req.body; // Destructure status and lastCompleted separately
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    // Make sure the logged-in user owns the task
    if (task.user.toString() !== userId.toString()) {
        res.status(403).json({ message: 'User not authorized to update this task' });
        return;
    }

    // Handle marking as complete
    if (status === 'completed') {
        updateData.status = 'completed';
        updateData.lastCompleted = new Date(); // Set last completion to now
        updateData.nextDueDate = calculateNextDueDate(updateData.lastCompleted, task.frequency); // Recalculate next due date
    } else if (status === 'pending') {
        updateData.status = 'pending';
        // If changing from completed to pending, you might want to clear lastCompleted or revert nextDueDate based on original creation
        // For simplicity, let's just make it pending again without changing dates for now unless explicitly provided.
        // A more complex system might re-evaluate based on initial creation date or a specific "reset" mechanism.
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });

    res.status(200).json(updatedTask);
});


// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    // Make sure the logged-in user owns the task
    if (task.user.toString() !== userId.toString()) {
        res.status(403).json({ message: 'User not authorized to delete this task' });
        return;
    }

    await Task.deleteOne({ _id: taskId }); // Using deleteOne or findByIdAndDelete

    res.status(200).json({ id: taskId, message: 'Task removed successfully' });
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};