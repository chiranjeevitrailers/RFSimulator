import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

const defaultPlans = [
  { id: 'free', name: 'Free', priceMonthly: 0, priceYearly: 0, active: true, features: ['3 test cases', 'Basic analysis'], limits: { testCases: 3, users: 1 } },
  { id: 'pro', name: 'Pro', priceMonthly: 99, priceYearly: 990, active: true, features: ['1000+ test cases', 'Advanced analysis', 'Export', 'API'], limits: { testCases: 1000, users: 5 } },
  { id: 'enterprise', name: 'Enterprise', priceMonthly: 299, priceYearly: 2990, active: true, features: ['Unlimited', 'Custom integrations', 'SLA'], limits: { testCases: -1, users: -1 } }
];

const PlansSettings = () => {
  const [plans, setPlans] = useState(defaultPlans);

  const updatePlan = (index, field, value) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const addFeature = (index) => {
    const feature = prompt('Add feature');
    if (!feature) return;
    const updated = [...plans];
    updated[index] = { ...updated[index], features: [...updated[index].features, feature] };
    setPlans(updated);
  };

  const removePlan = (index) => {
    const updated = plans.filter((_, i) => i !== index);
    setPlans(updated);
  };

  const addPlan = () => {
    setPlans([...plans, { id: `custom_${Date.now()}`, name: 'New Plan', priceMonthly: 0, priceYearly: 0, active: false, features: [], limits: { testCases: 0, users: 1 } }]);
  };

  const savePlans = () => {
    // TODO: persist via API to Supabase/config table
    console.log('Saving plans:', plans);
    alert('Plans saved (mock). Connect to backend to persist.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <div className="space-x-2">
          <button onClick={addPlan} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 inline-flex items-center space-x-2"><Plus className="w-4 h-4" /><span>New Plan</span></button>
          <button onClick={savePlans} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"><Save className="w-4 h-4" /><span>Save</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                value={plan.name}
                onChange={(e) => updatePlan(index, 'name', e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => removePlan(index)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Monthly ($)</label>
                <input type="number" value={plan.priceMonthly} onChange={(e) => updatePlan(index, 'priceMonthly', Number(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Yearly ($)</label>
                <input type="number" value={plan.priceYearly} onChange={(e) => updatePlan(index, 'priceYearly', Number(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Test Cases</label>
                <input type="number" value={plan.limits.testCases} onChange={(e) => updatePlan(index, 'limits', { ...plan.limits, testCases: Number(e.target.value) })} className="w-full px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Users</label>
                <input type="number" value={plan.limits.users} onChange={(e) => updatePlan(index, 'limits', { ...plan.limits, users: Number(e.target.value) })} className="w-full px-2 py-1 border border-gray-300 rounded" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-600 mb-1">Features</label>
              <ul className="space-y-1 text-sm text-gray-700 mb-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => addFeature(index)} className="text-xs text-blue-600 hover:text-blue-800">+ Add feature</button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Active</label>
              <input type="checkbox" checked={plan.active} onChange={(e) => updatePlan(index, 'active', e.target.checked)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansSettings;