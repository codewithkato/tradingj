import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function DatabaseConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/test-db-connection`);
      setTestResult(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while testing the connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Database Connection Test</h2>
      <button onClick={testConnection} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && <p style={{ color: 'green' }}>{testResult}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default DatabaseConnectionTest;
