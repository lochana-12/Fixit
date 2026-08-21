// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Link to the User model
            required: true,
            ref: 'User', // Reference the 'User' model
        },
        taskName: {
            type: String,
            required: [true, 'Please add a task name'],
            trim: true,
        },
        room: {
            type: String,
            required: [true, 'Please select a room'],
            enum: ['living-room', 'kitchen', 'bedroom', 'bathroom', 'garage', 'basement', 'attic', 'outdoor']
        },
        appliance: {
            type: String,
            required: [true, 'Please select an appliance/system'],
            enum: ['ac', 'plumbing', 'electrical', 'heating', 'refrigerator', 'dishwasher', 'washer', 'dryer', 'water-heater', 'furnace', 'general']
        },
        frequency: {
            type: String,
            required: [true, 'Please select a frequency'],
            enum: ['weekly', 'monthly', 'quarterly', 'semi-annually', 'annually']
        },
        priority: {
            type: String,
            required: [true, 'Please select a priority'],
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        notes: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'overdue'], // 'overdue' status will be calculated dynamically or by a background job
            default: 'pending'
        },
        lastCompleted: {
            type: Date,
            default: null // Will store the last completion date for recurring tasks
        },
        nextDueDate: {
            type: Date,
            // This will be calculated on creation and update based on frequency and lastCompleted
            // We'll calculate this in the controller or a pre-save hook
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Pre-save hook to calculate nextDueDate
taskSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('frequency') || this.isModified('lastCompleted')) {
        const now = new Date();
        let nextDate = this.lastCompleted ? new Date(this.lastCompleted) : new Date(this.createdAt || now);

        switch (this.frequency) {
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
                break;
        }
        this.nextDueDate = nextDate;
    }
    next();
});


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;