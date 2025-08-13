import React, { useState, useEffect } from 'react';

interface Payout {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: string;
  processed_at?: string;
  notes?: string;
}

const PayoutManagement: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/admin/payouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayouts(data);
      } else {
        setError('Failed to fetch payouts');
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      setError('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (payoutId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3001/api/admin/payouts/${payoutId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setPayouts(payouts.map(payout => 
          payout.id === payoutId ? { ...payout, status: newStatus as Payout['status'] } : payout
        ));
      } else {
        setError('Failed to update payout status');
      }
    } catch (error) {
      console.error('Error updating payout status:', error);
      setError('Failed to update payout status');
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'mark-paid') => {
    if (selectedPayouts.length === 0) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/admin/payouts/bulk-action', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          payout_ids: selectedPayouts, 
          action 
        })
      });

      if (response.ok) {
        setPayouts(payouts.map(payout => 
          selectedPayouts.includes(payout.id) 
            ? { ...payout, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'paid' as Payout['status'] }
            : payout
        ));
        setSelectedPayouts([]);
      } else {
        setError('Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      setError('Failed to perform bulk action');
    }
  };

  const filteredPayouts = payouts.filter(payout => 
    statusFilter === 'all' || payout.status === statusFilter
  );

  const handleSelectAll = () => {
    if (selectedPayouts.length === filteredPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(filteredPayouts.map(payout => payout.id));
    }
  };

  const handleSelectPayout = (payoutId: number) => {
    setSelectedPayouts(prev => 
      prev.includes(payoutId) 
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-200';
      case 'approved': return 'bg-blue-900 text-blue-200';
      case 'rejected': return 'bg-red-900 text-red-200';
      case 'paid': return 'bg-green-900 text-green-200';
      default: return 'bg-zinc-900 text-zinc-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-200">Error</h3>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-zinc-200">Payout Management</h2>
        <div className="flex space-x-2">
          {selectedPayouts.length > 0 && (
            <>
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 text-sm font-medium text-zinc-200 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Approve ({selectedPayouts.length})
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 text-sm font-medium text-zinc-200 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Reject ({selectedPayouts.length})
              </button>
              <button
                onClick={() => handleBulkAction('mark-paid')}
                className="px-3 py-1 text-sm font-medium text-zinc-200 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Paid ({selectedPayouts.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-zinc-900 shadow rounded-lg border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.length === filteredPayouts.length && filteredPayouts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-600 text-zinc-600 focus:ring-zinc-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900 divide-y divide-zinc-800">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-zinc-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={() => handleSelectPayout(payout.id)}
                      className="rounded border-zinc-600 text-zinc-600 focus:ring-zinc-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-zinc-200">
                            {payout.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-zinc-200">{payout.user_name}</div>
                        <div className="text-sm text-zinc-400">{payout.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-200">
                    ${payout.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                    {new Date(payout.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={payout.status}
                      onChange={(e) => handleStatusChange(payout.id, e.target.value)}
                      className="px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-zinc-200">{payouts.length}</div>
            <div className="text-sm text-zinc-400">Total Requests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-200">
              {payouts.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-zinc-400">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-200">
              {payouts.filter(p => p.status === 'approved').length}
            </div>
            <div className="text-sm text-zinc-400">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-200">
              {payouts.filter(p => p.status === 'rejected').length}
            </div>
            <div className="text-sm text-zinc-400">Rejected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-200">
              {payouts.filter(p => p.status === 'paid').length}
            </div>
            <div className="text-sm text-zinc-400">Paid</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-zinc-200">
                ${payouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-zinc-400">Total Amount Requested</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-200">
                ${payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-zinc-400">Total Amount Paid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutManagement; 