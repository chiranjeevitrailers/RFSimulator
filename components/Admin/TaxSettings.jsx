import React, { useState } from 'react';
import { Save, Percent } from 'lucide-react';

const TaxSettings = () => {
  const [tax, setTax] = useState({ enabled: true, name: 'GST', ratePercent: 18, inclusive: false, country: 'IN' });

  const update = (field, value) => setTax(prev => ({ ...prev, [field]: value }));

  const save = () => {
    // TODO: Persist tax settings to backend
    console.log('Saving tax settings', tax);
    alert('Tax settings saved (mock). Connect to backend to persist.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tax / GST Settings</h3>
        <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <span className="text-sm text-gray-700">Enable Tax</span>
          <input type="checkbox" checked={tax.enabled} onChange={(e) => update('enabled', e.target.checked)} />
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-xs text-gray-600 mb-1">Tax Name</label>
          <input value={tax.name} onChange={(e) => update('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-xs text-gray-600 mb-1">Rate (%)</label>
          <input type="number" value={tax.ratePercent} onChange={(e) => update('ratePercent', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <span className="text-sm text-gray-700">Inclusive Pricing</span>
          <input type="checkbox" checked={tax.inclusive} onChange={(e) => update('inclusive', e.target.checked)} />
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-xs text-gray-600 mb-1">Country</label>
          <select value={tax.country} onChange={(e) => update('country', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="EU">European Union</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        Example: If enabled and rate is 18%, a $100 plan becomes ${tax.inclusive ? '100' : '118'} with GST added.
      </div>
    </div>
  );
};

export default TaxSettings;