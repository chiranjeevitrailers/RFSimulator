import React, { useState } from 'react';
import { Save, EyeOff, Eye, Globe } from 'lucide-react';

const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState({
    stripe: { enabled: true, publishableKey: '', secretKey: '' },
    razorpay: { enabled: true, keyId: '', keySecret: '' },
    paypal: { enabled: false, clientId: '', clientSecret: '' }
  });
  const [showSecrets, setShowSecrets] = useState(false);

  const update = (name, field, value) => {
    setGateways(prev => ({ ...prev, [name]: { ...prev[name], [field]: value } }));
  };

  const save = () => {
    // TODO: Persist to secure storage (Supabase secrets/kv)
    console.log('Saving gateways', gateways);
    alert('Payment gateways saved (mock). Connect to backend to persist.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Gateways</h3>
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

      {['stripe', 'razorpay', 'paypal'].map((gw) => (
        <div key={gw} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900 capitalize">{gw}</h4>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Enabled</label>
              <input type="checkbox" checked={gateways[gw].enabled} onChange={(e) => update(gw, 'enabled', e.target.checked)} />
            </div>
          </div>

          {gw === 'stripe' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Publishable Key</label>
                <input value={gateways.stripe.publishableKey} onChange={(e) => update('stripe', 'publishableKey', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Secret Key</label>
                <input type={showSecrets ? 'text' : 'password'} value={gateways.stripe.secretKey} onChange={(e) => update('stripe', 'secretKey', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
            </div>
          )}

          {gw === 'razorpay' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Key ID</label>
                <input value={gateways.razorpay.keyId} onChange={(e) => update('razorpay', 'keyId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Key Secret</label>
                <input type={showSecrets ? 'text' : 'password'} value={gateways.razorpay.keySecret} onChange={(e) => update('razorpay', 'keySecret', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
            </div>
          )}

          {gw === 'paypal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Client ID</label>
                <input value={gateways.paypal.clientId} onChange={(e) => update('paypal', 'clientId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Client Secret</label>
                <input type={showSecrets ? 'text' : 'password'} value={gateways.paypal.clientSecret} onChange={(e) => update('paypal', 'clientSecret', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentGatewaySettings;