const Record = require('../records/record.model');

exports.getSummary = async (req, res, next) => {
  try {
    // Income vs Expense totals
    const summary = await Record.aggregate([
      { $match: { is_deleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totals = { income: 0, expense: 0 };
    summary.forEach(s => { totals[s._id] = s.total; });

    // Category wise totals
    const byCategory = await Record.aggregate([
      { $match: { is_deleted: false } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly trends
    const monthly = await Record.aggregate([
      { $match: { is_deleted: false } },
      {
        $group: {
          _id: {
            year:  { $year: '$date' },
            month: { $month: '$date' },
            type:  '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Recent 5 records
    const recent = await Record.find({ is_deleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      total_income:    totals.income,
      total_expenses:  totals.expense,
      net_balance:     totals.income - totals.expense,
      by_category:     byCategory,
      monthly_trends:  monthly,
      recent_activity: recent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};