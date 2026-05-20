const { query } = require('../../lib/db');

module.exports = async function handler(req, res) {
  try {
    const rows = await query('SELECT 1 + 1 AS result');
    const result = rows?.[0]?.result ?? null;

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Database query failed',
    });
  }
};
