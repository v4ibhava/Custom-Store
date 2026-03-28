import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiTag,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiUsers,
  FiCheck,
  FiX,
  FiEdit2
} from 'react-icons/fi';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([
    {
      id: '1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      minOrder: 500,
      maxDiscount: 200,
      usageLimit: 100,
      usedCount: 45,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      isActive: true
    },
    {
      id: '2',
      code: 'SAVE50',
      type: 'fixed',
      value: 50,
      minOrder: 300,
      maxDiscount: 50,
      usageLimit: 200,
      usedCount: 120,
      validFrom: '2025-01-01',
      validUntil: '2025-06-30',
      isActive: true
    },
    {
      id: '3',
      code: 'FREESHIP',
      type: 'fixed',
      value: 100,
      minOrder: 1000,
      maxDiscount: 100,
      usageLimit: 50,
      usedCount: 50,
      validFrom: '2025-01-01',
      validUntil: '2025-03-31',
      isActive: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) {
      toast.error('Please fill in required fields');
      return;
    }

    const coupon = {
      ...newCoupon,
      id: Date.now().toString(),
      usedCount: 0,
      value: parseFloat(newCoupon.value),
      minOrder: parseFloat(newCoupon.minOrder) || 0,
      maxDiscount: parseFloat(newCoupon.maxDiscount) || 0,
      usageLimit: parseInt(newCoupon.usageLimit) || 100
    };

    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...coupon, id: editingCoupon.id, usedCount: editingCoupon.usedCount } : c));
      toast.success('Coupon updated successfully');
    } else {
      setCoupons([...coupons, coupon]);
      toast.success('Coupon created successfully');
    }

    setShowCreateModal(false);
    setEditingCoupon(null);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
      minOrder: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrder: coupon.minOrder.toString(),
      maxDiscount: coupon.maxDiscount.toString(),
      usageLimit: coupon.usageLimit.toString(),
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive
    });
    setShowCreateModal(true);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">Delete this coupon?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setCoupons(coupons.filter(c => c.id !== id));
              toast.success('Coupon deleted successfully');
            }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const toggleActive = (id) => {
    setCoupons(coupons.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
    toast.success('Coupon status updated');
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard');
  };

  const activeCoupons = coupons.filter(c => c.isActive);
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-xl">
              <FiTag className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeCoupons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.filter(c => !c.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Coupon Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingCoupon(null);
            setNewCoupon({
              code: '',
              type: 'percentage',
              value: '',
              minOrder: '',
              maxDiscount: '',
              usageLimit: '',
              validFrom: '',
              validUntil: '',
              isActive: true
            });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
        >
          <FiPlus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all ${
              !coupon.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Coupon Header */}
            <div className="p-5 border-b border-dashed border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    coupon.type === 'percentage'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {coupon.type === 'percentage' ? (
                      <span className="flex items-center gap-1">
                        <FiPercent className="w-3 h-3" />
                        {coupon.value}% OFF
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" />
                        ₹{coupon.value} OFF
                      </span>
                    )}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <code className="text-xl font-bold text-gray-900 tracking-wider bg-gray-100 px-4 py-2 rounded-lg">
                  {coupon.code}
                </code>
                <button
                  onClick={() => copyCouponCode(coupon.code)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy code"
                >
                  <FiCopy className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Coupon Details */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min. Order</span>
                <span className="font-medium text-gray-900">₹{coupon.minOrder}</span>
              </div>
              {coupon.maxDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Discount</span>
                  <span className="font-medium text-gray-900">₹{coupon.maxDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium text-gray-900">
                  {coupon.usedCount} / {coupon.usageLimit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"
                  style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                <FiCalendar className="w-4 h-4" />
                <span>{coupon.validFrom} - {coupon.validUntil}</span>
              </div>
            </div>

            {/* Coupon Actions */}
            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={() => toggleActive(coupon.id)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  coupon.isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleEdit(coupon)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiEdit2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingCoupon(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER25"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={newCoupon.type}
                    onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    placeholder={newCoupon.type === 'percentage' ? '20' : '100'}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min. Order Amount
                  </label>
                  <input
                    type="number"
                    value={newCoupon.minOrder}
                    onChange={e => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    placeholder="500"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount
                  </label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={e => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    placeholder="200"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                  placeholder="100"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={e => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={e => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newCoupon.isActive}
                  onChange={e => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Activate coupon immediately
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCoupon(null);
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="flex-1 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium"
              >
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
