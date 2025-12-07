import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
          ChatBot Frontend
        </h1>
        <p className="text-gray-600 text-center mb-8">
          React + Tailwind CSS Setup
        </p>
        
        <div className="bg-indigo-50 rounded-lg p-6 mb-6">
          <p className="text-center text-2xl font-semibold text-indigo-800 mb-4">
            Count: {count}
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
          >
            Increment Counter
          </button>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p className="flex items-center justify-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            React is running
          </p>
          <p className="flex items-center justify-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Tailwind CSS is configured
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
