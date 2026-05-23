import { useState } from 'react'
import './App.css'

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0']
const OPERATORS = ['+', '-', '*', '/']

function App() {
  const [display, setDisplay] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDigit = (digit) => {
    if (result !== null) {
      setDisplay(digit)
      setResult(null)
      setError(null)
    } else {
      setDisplay(display + digit)
      setError(null)
    }
  }

  const handleOperator = (op) => {
    if (display.length > 0 && /\d$/.test(display)) {
      if (result !== null) {
        setDisplay(result.toString() + op)
        setResult(null)
        setError(null)
      } else {
        setDisplay(display + op)
        setError(null)
      }
    }
  }

  const handleEquals = async () => {
    if (!display.trim()) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: display })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Invalid expression')
        setResult(null)
      } else {
        setResult(data.result)
        setError(null)
      }
    } catch (e) {
      setError('Network error — is the backend running?')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setDisplay('')
    setResult(null)
    setError(null)
  }

  const displayValue = error
    ? error
    : result !== null
      ? `= ${result}`
      : display || '0'

  const displayClass = error ? 'display error' : 'display'

  return (
    <div className="calculator">
      <div className={displayClass}>
        {loading && <span className="loading-indicator">...</span>}
        {!loading && displayValue}
        {display && !loading && !error && result === null && <span className="cursor">|</span>}
      </div>
      <div className="buttons">
        <button className="btn clear" onClick={handleClear}>
          C
        </button>
        {OPERATORS.map((op) => (
          <button
            key={op}
            className="btn operator"
            onClick={() => handleOperator(op)}
          >
            {op}
          </button>
        ))}
        {DIGITS.map((digit) => (
          <button
            key={digit}
            className={`btn digit ${digit === '0' ? 'zero' : ''}`}
            onClick={() => handleDigit(digit)}
          >
            {digit}
          </button>
        ))}
        <button className="btn equals" onClick={handleEquals}>
          =
        </button>
      </div>
    </div>
  )
}

export default App
