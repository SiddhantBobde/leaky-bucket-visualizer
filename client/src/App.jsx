import React, { useState, useEffect, useRef } from 'react';
import Bucket from './components/Bucket';
import TokenButton from './components/TokenButton';

function App() {
  const [maxTokens, setMaxTokens] = useState(5);
  const tokensRef = useRef(5);
  const [logs, setLogs] = useState([]);
  const intervalRef = useRef(null);
  const [leakRate, setLeakRate] = useState(1); // Tokens per second to refill
  const [bucketSizeInput, setBucketSizeInput] = useState(5);
  const [leakRateInput, setLeakRateInput] = useState(1);

  useEffect(() => {
    updateBucketConfig();
  }, [])

  // Effect to simulate token refill over time
  useEffect(() => {
    // Create the interval when component mounts
    intervalRef.current = setInterval(() => {
      // Only refill if not already full
      if (tokensRef.current < maxTokens) {
        // Calculate new token value, not exceeding maxTokens
        const currentTokens = tokensRef.current;
        const newTokens = Math.min(currentTokens + leakRate / 10, maxTokens);
        tokensRef.current = newTokens;

        // Only log when a full token is added
        if (Math.floor(newTokens) > Math.floor(currentTokens)) {
          setLogs(prev => [`🔄 Refilled: ${newTokens.toFixed(2)} tokens`, ...prev]);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [leakRate, maxTokens]);

  const sendRequest = async () => {
    try {
      const response = await fetch('http://localhost:3000/send');
      if (response.ok) {
        const data = await response.json();
        tokensRef.current = data.tokens;
        setLogs((prev) => [`✅ Allowed: ${data.tokens.toFixed(2)} tokens`, ...prev]);
      } else {
        setLogs((prev) => ['❌ Rejected: Bucket is empty', ...prev]);
      }
    } catch (err) {
      setLogs((prev) => [`⚠️ Error: ${err.message}`, ...prev]);
    }
  };

  const updateBucketConfig = async () => {
    try {
      const response = await fetch('http://localhost:3000/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketSize: Number(bucketSizeInput),
          leakRate: Number(leakRateInput)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMaxTokens(data.bucketSize);
        setLeakRate(data.leakRate);
        tokensRef.current = Math.min(tokensRef.current, data.bucketSize);
        setLogs((prev) => [`⚙️ Configuration updated: Bucket Size=${data.bucketSize}, Leak Rate=${data.leakRate}`, ...prev]);
      } else {
        console.log(response);
        setLogs((prev) => ['❌ Failed to update configuration', ...prev]);
      }
    } catch (err) {
      setLogs((prev) => [`⚠️ Error: ${err.message}`, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-3/4 m-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 self-center">Leaky Bucket Visualizer</h1>
      <div className="mb-6 p-4 bg-white rounded shadow flex flex-col items-center w-fit">
        <h2 className="font-semibold mb-3">Configure Leaky Bucket</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bucket Size</label>
            <input
              type="number"
              min="1"
              value={bucketSizeInput}
              onChange={(e) => setBucketSizeInput(e.target.value)}
              className="border rounded px-3 py-2 w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leak Rate (tokens/sec)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={leakRateInput}
              onChange={(e) => setLeakRateInput(e.target.value)}
              className="border rounded px-3 py-2 w-24"
            />
          </div>
          <div className="self-end">
            <button
              onClick={updateBucketConfig}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Configuration
            </button>
          </div>
        </div>
        <div className='self-start mt-1'>
          <span className='text-gray-600 text-sm'>
            Bucket size and leak rate must be greater than 0
          </span>
        </div>
      </div>
      <div className='flex flex-col items-center w-[100%]'>
        <TokenButton onClick={sendRequest} />

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Tokens refill at a rate of {leakRate} per second. Current tokens: {tokensRef.current.toFixed(2)}
          </p>
        </div>
        <Bucket tokens={tokensRef.current} maxTokens={maxTokens} />

        {/* Logs */}
        <div className="mt-6 w-full">
          <h2 className="font-semibold mb-2">Logs:</h2>
          <ul className="text-sm bg-white rounded p-4 shadow max-h-40 overflow-auto">
            {logs.map((log, index) => (
              <li key={index} className="py-1">{log}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default App;
