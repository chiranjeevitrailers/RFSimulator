import React, { useEffect, useState } from 'react';
import { Brain, RefreshCw, CheckCircle, XCircle, Activity, TrendingDown } from 'lucide-react';

const mockFetchRecommendations = async () => {
  // Replace with Supabase fetch from ml_recommendations
  return [
    {
      id: 'rec_1',
      run_id: 'run_123',
      test_case_id: 'NR/Attach/Basic',
      created_at: new Date().toISOString(),
      recommendation: 'Increase T3410 timer by 3s and retry.',
      confidence: 0.78,
      rationale: 'Frequent NAS timer timeouts detected with similar pattern in past runs.',
      applied: false,
      helpful: null,
      metadata: { has_timer_timeout: 1, num_errors: 6 }
    },
    {
      id: 'rec_2',
      run_id: 'run_124',
      test_case_id: 'IMS/Registration',
      created_at: new Date().toISOString(),
      recommendation: 'Verify UE auth keys; auth failure pattern matched.',
      confidence: 0.82,
      rationale: 'Auth failure signature and elevated error rate.',
      applied: false,
      helpful: null,
      metadata: { has_auth_failure: 1, num_errors: 8 }
    }
  ];
};

const MLInsights = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await mockFetchRecommendations();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const markHelpful = (id, helpful) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, helpful } : i));
    // TODO: persist to Supabase
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">ML Insights & Recommendations</h3>
        </div>
        <button onClick={loadData} className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Run: {item.run_id} • Test: {item.test_case_id}</div>
                  <div className="text-gray-900 font-medium mt-1">{item.recommendation}</div>
                  <div className="text-sm text-gray-600 mt-1">Reason: {item.rationale}</div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Activity className="w-4 h-4" />
                      <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                    </div>
                    {item.metadata?.num_errors !== undefined && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Errors: {item.metadata.num_errors}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => markHelpful(item.id, true)}
                    className={`px-3 py-2 rounded-md border ${item.helpful === true ? 'bg-green-50 border-green-300 text-green-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" /> Helpful
                  </button>
                  <button
                    onClick={() => markHelpful(item.id, false)}
                    className={`px-3 py-2 rounded-md border ${item.helpful === false ? 'bg-red-50 border-red-300 text-red-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" /> Not Helpful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MLInsights;

