import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, Check, AlertCircle, Loader } from 'lucide-react';

const PaymentForm = ({ 
  plan, 
  onPaymentSuccess, 
  onPaymentError,
  userEmail,
  userName 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: userEmail || '',
    name: userName || '',
    country: 'US',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentGateway, setPaymentGateway] = useState('stripe'); // stripe, razorpay, paypal

  // Payment gateway configuration
  const gateways = {
    stripe: {
      name: 'Stripe',
      description: 'Secure payment processing',
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'GR', 'JP', 'SG', 'HK', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'UY', 'ZA', 'NG', 'KE', 'GH', 'EG', 'MA', 'TN', 'DZ', 'LY', 'SD', 'ET', 'UG', 'TZ', 'ZW', 'BW', 'NA', 'ZM', 'MW', 'MZ', 'AO', 'CM', 'CI', 'SN', 'ML', 'BF', 'NE', 'TD', 'CF', 'GA', 'CG', 'CD', 'RW', 'BI', 'DJ', 'SO', 'ER', 'SS', 'GM', 'GN', 'GW', 'LR', 'SL', 'TG', 'BJ', 'MR', 'CV', 'ST', 'GQ', 'SC', 'MU', 'KM', 'MG', 'YT', 'RE', 'SH', 'AC', 'TA', 'EH', 'AQ', 'BV', 'HM', 'TF', 'GS', 'FK', 'GI', 'AD', 'MC', 'SM', 'VA', 'LI', 'IS', 'FO', 'GL', 'SJ', 'AX', 'IM', 'JE', 'GG', 'PM', 'BL', 'MF', 'SX', 'CW', 'AW', 'BQ', 'TC', 'VG', 'AI', 'MS', 'KN', 'AG', 'DM', 'LC', 'VC', 'GD', 'BB', 'TT', 'JM', 'BS', 'CU', 'DO', 'HT', 'PR', 'VI', 'GP', 'MQ', 'BL', 'MF', 'SX', 'CW', 'AW', 'BQ', 'TC', 'VG', 'AI', 'MS', 'KN', 'AG', 'DM', 'LC', 'VC', 'GD', 'BB', 'TT', 'JM', 'BS', 'CU', 'DO', 'HT', 'PR', 'VI']
    },
    razorpay: {
      name: 'Razorpay',
      description: 'Payment gateway for India',
      supportedCountries: ['IN']
    },
    paypal: {
      name: 'PayPal',
      description: 'Global payment solution',
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'GR', 'JP', 'SG', 'HK', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'UY', 'ZA', 'NG', 'KE', 'GH', 'EG', 'MA', 'TN', 'DZ', 'LY', 'SD', 'ET', 'UG', 'TZ', 'ZW', 'BW', 'NA', 'ZM', 'MW', 'MZ', 'AO', 'CM', 'CI', 'SN', 'ML', 'BF', 'NE', 'TD', 'CF', 'GA', 'CG', 'CD', 'RW', 'BI', 'DJ', 'SO', 'ER', 'SS', 'GM', 'GN', 'GW', 'LR', 'SL', 'TG', 'BJ', 'MR', 'CV', 'ST', 'GQ', 'SC', 'MU', 'KM', 'MG', 'YT', 'RE', 'SH', 'AC', 'TA', 'EH', 'AQ', 'BV', 'HM', 'TF', 'GS', 'FK', 'GI', 'AD', 'MC', 'SM', 'VA', 'LI', 'IS', 'FO', 'GL', 'SJ', 'AX', 'IM', 'JE', 'GG', 'PM', 'BL', 'MF', 'SX', 'CW', 'AW', 'BQ', 'TC', 'VG', 'AI', 'MS', 'KN', 'AG', 'DM', 'LC', 'VC', 'GD', 'BB', 'TT', 'JM', 'BS', 'CU', 'DO', 'HT', 'PR', 'VI', 'GP', 'MQ', 'BL', 'MF', 'SX', 'CW', 'AW', 'BQ', 'TC', 'VG', 'AI', 'MS', 'KN', 'AG', 'DM', 'LC', 'VC', 'GD', 'BB', 'TT', 'JM', 'BS', 'CU', 'DO', 'HT', 'PR', 'VI']
    }
  };

  // Auto-detect payment gateway based on country
  useEffect(() => {
    if (formData.country === 'IN') {
      setPaymentGateway('razorpay');
    } else {
      setPaymentGateway('stripe');
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Please enter zip code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would integrate with actual payment gateways
      const paymentResult = await processPayment({
        plan,
        paymentMethod,
        paymentGateway,
        formData
      });

      if (paymentResult.success) {
        onPaymentSuccess(paymentResult);
      } else {
        onPaymentError(paymentResult.error);
      }
    } catch (error) {
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (paymentData) => {
    // This would be replaced with actual payment gateway integration
    console.log('Processing payment:', paymentData);
    
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
          amount: paymentData.plan.price,
          currency: 'USD',
          status: 'completed'
        });
      }, 2000);
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-form">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
          <p className="text-gray-600">Secure payment processing with industry-standard encryption</p>
        </div>

        {/* Plan Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
              <div className="text-sm text-gray-600">/{plan.period}</div>
            </div>
          </div>
        </div>

        {/* Payment Gateway Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(gateways).map(([key, gateway]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPaymentGateway(key)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  paymentGateway === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{gateway.name}</div>
                <div className="text-sm text-gray-600">{gateway.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Card Information */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setFormData(prev => ({ ...prev, cardNumber: formatted }));
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={19}
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setFormData(prev => ({ ...prev, expiryDate: formatted }));
                    }}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                )}
              </div>
            </div>
          )}

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="IE">Ireland</option>
                  <option value="PT">Portugal</option>
                  <option value="LU">Luxembourg</option>
                  <option value="MT">Malta</option>
                  <option value="CY">Cyprus</option>
                  <option value="EE">Estonia</option>
                  <option value="LV">Latvia</option>
                  <option value="LT">Lithuania</option>
                  <option value="SI">Slovenia</option>
                  <option value="SK">Slovakia</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="HU">Hungary</option>
                  <option value="PL">Poland</option>
                  <option value="RO">Romania</option>
                  <option value="BG">Bulgaria</option>
                  <option value="HR">Croatia</option>
                  <option value="GR">Greece</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                  <option value="HK">Hong Kong</option>
                  <option value="MY">Malaysia</option>
                  <option value="TH">Thailand</option>
                  <option value="ID">Indonesia</option>
                  <option value="PH">Philippines</option>
                  <option value="VN">Vietnam</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="CO">Colombia</option>
                  <option value="PE">Peru</option>
                  <option value="UY">Uruguay</option>
                  <option value="ZA">South Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lock className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Complete Payment - ${plan.price}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;