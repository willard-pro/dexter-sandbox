const express = require('express');
const math = require('mathjs');

const app = express();
app.use(express.json());

app.post('/calculate', (req, res) => {
  const { expression } = req.body;

  if (expression === undefined || expression === null) {
    return res.status(400).json({ error: 'Expression is required' });
  }

  if (typeof expression !== 'string') {
    return res.status(400).json({ error: 'Expression must be a string' });
  }

  // Reject expressions with consecutive identical operators (e.g. 2++2, 3--1)
  // Strip whitespace before checking to catch "2+ +2" as well
  const stripped = expression.replace(/\s/g, '');
  if (/\+\+|--|\*\*|\/\//.test(stripped)) {
    return res.status(400).json({ error: 'Invalid expression: consecutive operators' });
  }

  try {
    const result = math.evaluate(expression);

    // mathjs returns Infinity for division by zero rather than throwing,
    // so we handle it as an invalid expression per acceptance criteria
    if (!isFinite(result)) {
      return res.status(400).json({ error: 'Invalid expression: division by zero' });
    }

    return res.json({ result });
  } catch (err) {
    return res.status(400).json({ error: `Invalid expression: ${err.message}` });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Calculator API running on port ${PORT}`));
}

module.exports = app;
