import React, { useState } from 'react';
import { Save, EyeOff, Eye, Key } from 'lucide-react';

const ApiConfigSettings = () => {
  const [configs, setConfigs] = useState({
    publicApiBase: '',
    internalServiceKey: '',
    webhookSecretStripe: '',
    webhookSecretRazorpay: ''
  });
  const [showSecrets, setShowSecrets] = useState(false);

  const update = (field, value) => setConfigs(prev => ({ ...prev, [field]: value }));

  const save = () => {
    // TODO: Persist securely to backend
    console.log('Saving API configs', configs);
    alert('API configuration saved (mock). Connect to backend to persist.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
        <div className="space-x-2">
          <button onClick={() => setShowSecrets(!showSecrets)} className="px-3 py-2 bg-gray-100 rounded-lg inline-flex items-center space-x-2 text-gray-800 hover:bg-gray-200">
            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showSecrets ? 'Hide' : 'Show'} Secrets</span>
          </button>
          <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Public API Base URL</label>
          <input value={configs.publicApiBase} onChange={(e) => update('publicApiBase', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Internal Service Key</label>
          <input type={showSecrets ? 'text' : 'password'} value={configs.internalServiceKey} onChange={(e) => update('internalServiceKey', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Stripe Webhook Secret</label>
            <input type={showSecrets ? 'text' : 'password'} value={configs.webhookSecretStripe} onChange={(e) => update('webhookSecretStripe', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Razorpay Webhook Secret</label>
            <input type={showSecrets ? 'text' : 'password'} value={configs.webhookSecretRazorpay} onChange={(e) => update('webhookSecretRazorpay', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigSettings;