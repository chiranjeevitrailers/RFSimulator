import React, { useEffect, useState } from 'react';
import { Download, Mail } from 'lucide-react';

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // TODO: Fetch from backend
    setInvoices([
      { id: 'INV-2024-001', date: '2024-09-10', email: 'user@example.com', plan: 'Pro', amount: 99, tax: 17.82, total: 116.82, currency: 'USD', status: 'paid' },
      { id: 'INV-2024-002', date: '2024-10-10', email: 'user@example.com', plan: 'Pro', amount: 99, tax: 0, total: 99, currency: 'USD', status: 'paid' }
    ]);
  }, []);

  const downloadPdf = (invoiceId) => {
    // TODO: Call backend to generate and stream PDF
    console.log('Download PDF for', invoiceId);
    alert(`Invoice ${invoiceId} PDF generation (mock)`);
  };

  const resendEmail = (invoiceId) => {
    // TODO: Call backend to resend invoice email
    console.log('Resend email for', invoiceId);
    alert(`Invoice ${invoiceId} email resent (mock)`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.plan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${inv.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${inv.tax.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${inv.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button onClick={() => downloadPdf(inv.id)} className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 mr-2">
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button onClick={() => resendEmail(inv.id)} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesTable;