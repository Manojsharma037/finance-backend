const Record = require('./record.model');

// POST /api/records
exports.create = async (req, res) => {
  try {
    const { amount, type, category, date, notes, for_user_id } = req.body;

    if (!amount || !type || !category || !date)
      return res.status(400).json({ error: 'Missing required fields' });

    // Admin kisi bhi user ke liye record bana sake
    let userId = req.user._id;
    if (req.user.role === 'admin' && for_user_id) {
      userId = for_user_id;
    }

    const record = await Record.create({
      user_id: userId,
      amount, type, category, date, notes
    });

    res.status(201).json({ message: 'Record created', record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/records
exports.getAll = async (req, res) => {
  try {
    const { type, category, from, to } = req.query;
    const filter = {};

    // Viewer sirf apne records dekh sakta hai
    if (req.user.role === 'viewer') filter.user_id = req.user._id;
    if (type)     filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }

    const records = await Record.find(filter).sort({ date: -1 });
    res.json({ count: records.length, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/records/:id
exports.update = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record updated', record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/records/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};