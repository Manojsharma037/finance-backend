const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  is_deleted: {
    type: Boolean,
    default: false   // soft delete
  }
}, { timestamps: true });

// Sirf non-deleted records fetch hone chahiye by default
// recordSchema.pre(/^find/, function (next) {
//   this.where({ is_deleted: false });
//   next();
// });

module.exports = mongoose.model('Record', recordSchema);