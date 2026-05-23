const express = require('express');
const app = express();

app.use(express.json());

app.post('/calculate', (req, res) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({ error: 'Invalid expression' });
  }

  const match = expression.match(/^\s*(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)\s*$/);

  if (!match) {
    return res.status(400).json({ error: 'Invalid expression' });
  }

  const left = parseFloat(match[1]);
  const op = match[2];
  const right = parseFloat(match[3]);

  let result;
  switch (op) {
    case '+':
      result = left + right;
      break;
    case '-':
      result = left - right;
      break;
    case '*':
      result = left * right;
      break;
    case '/':
      if (right === 0) {
        return res.status(400).json({ error: 'Invalid expression' });
      }
      result = left / right;
      break;
    default:
      return res.status(400).json({ error: 'Invalid expression' });
  }

  return res.json({ result });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
