import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { GlobalState } from '../../../../GlobalState';
import { settingsService } from '../../../../services';
import { FiGlobe, FiCreditCard, FiTruck, FiSave, FiLock, FiCheckCircle, FiMapPin, FiExternalLink, FiImage, FiCloud, FiHardDrive, FiDatabase, FiPieChart } from 'react-icons/fi';

const AdminSettings = () => {
  const state = useContext(GlobalState);
  const [token] = state.userAPI.token;

  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageStats, setStorageStats] = useState({
    cloudName: '',
    isConfigured: false,
    folder: 'cake-avenue',
    totalProducts: 0,
    usage: null
  });

  const [formData, setFormData] = useState({
    storeName: 'Cake Avenue',
    tagline: 'Handcrafted Fresh Baked Delights',
    supportEmail: '',
    supportPhone: '',
    address: '',
    googleMapsUrl: '',
    googleMapsText: 'View Store on Google Maps',
    currencySymbol: '₹',
    currencyCode: 'INR',
    colorTheme: 'blush',
    uiStyle: 'curvy',
    darkMode: false,
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    cloudinaryFolder: 'cake-avenue',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    isRazorpayEnabled: true,
    isCodEnabled: true,
    minOrderAmount: 0,
    flatDeliveryFee: 0,
    freeDeliveryThreshold: 500,
    isMaintenanceMode: false
  });

  const fetchStorageStats = async () => {
    try {
      if (token) {
        const stats = await settingsService.getStorageStats(token);
        setStorageStats(stats);
      }
    } catch (err) {
      console.error("Error fetching storage stats:", err);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        setFormData((prev) => ({
          ...prev,
          ...data,
          razorpayKeySecret: '', // Keep empty unless updating secret
          cloudinaryApiSecret: '' // Keep empty unless updating secret
        }));
        await fetchStorageStats();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...formData };
      // Do not send blank password unless intended
      if (!payload.razorpayKeySecret) {
        delete payload.razorpayKeySecret;
      }
      if (!payload.cloudinaryApiSecret) {
        delete payload.cloudinaryApiSecret;
      }

      await settingsService.updateSettings(payload, token);
      await fetchStorageStats();
      toast.success('Store settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">Manage branding, payment gateways, photo storage, and business controls</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Segmented Pill Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-2 overflow-x-auto w-fit border border-gray-200/60">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <FiGlobe /> Branding & General
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all cursor-pointer ${
            activeTab === 'payment'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <FiCreditCard /> Payment Gateway
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all cursor-pointer ${
            activeTab === 'storage'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <FiImage /> Photo & Media Storage
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all cursor-pointer ${
            activeTab === 'shipping'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <FiTruck /> Shipping & Rules
        </button>
      </div>


      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {/* TAB 1: BRANDING & APPEARANCE */}
        {activeTab === 'branding' && (
          <div className="space-y-8">

            {/* --- Section 1: Color Theme (accent palette) --- */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-gray-900 mb-1">
                Color Theme
              </label>
              <p className="text-xs text-gray-500 mb-4 font-medium">
                Choose the accent color palette for your store. All themes work in both light and dark mode.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blush Pink */}
                <div
                  onClick={() => {
                    const newTheme = 'blush';
                    setFormData({ ...formData, colorTheme: newTheme });
                    document.documentElement.setAttribute('data-theme', newTheme);
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, colorTheme: newTheme }));
                    } catch (e) {}
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.colorTheme === 'blush' || !formData.colorTheme
                      ? 'border-pink-600 bg-pink-50/40 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-pink-600"></div>
                      <div className="w-5 h-5 rounded-full bg-rose-300"></div>
                      <div className="w-5 h-5 rounded-full bg-pink-100 border"></div>
                    </div>
                    {(formData.colorTheme === 'blush' || !formData.colorTheme) && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-pink-600 text-white rounded-full">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Blush Pink</h4>
                  <p className="text-xs text-gray-500 mt-1">Warm rose tones, soft and inviting.</p>
                </div>

                {/* Ocean Blue */}
                <div
                  onClick={() => {
                    const newTheme = 'ocean';
                    setFormData({ ...formData, colorTheme: newTheme });
                    document.documentElement.setAttribute('data-theme', newTheme);
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, colorTheme: newTheme }));
                    } catch (e) {}
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.colorTheme === 'ocean'
                      ? 'border-sky-600 bg-sky-50/40 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-sky-600"></div>
                      <div className="w-5 h-5 rounded-full bg-sky-300"></div>
                      <div className="w-5 h-5 rounded-full bg-sky-100 border"></div>
                    </div>
                    {formData.colorTheme === 'ocean' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-sky-600 text-white rounded-full">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Ocean Blue</h4>
                  <p className="text-xs text-gray-500 mt-1">Cool, calm, professional blue tones.</p>
                </div>

                {/* Emerald Green */}
                <div
                  onClick={() => {
                    const newTheme = 'emerald';
                    setFormData({ ...formData, colorTheme: newTheme });
                    document.documentElement.setAttribute('data-theme', newTheme);
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, colorTheme: newTheme }));
                    } catch (e) {}
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.colorTheme === 'emerald'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-600"></div>
                      <div className="w-5 h-5 rounded-full bg-emerald-300"></div>
                      <div className="w-5 h-5 rounded-full bg-emerald-100 border"></div>
                    </div>
                    {formData.colorTheme === 'emerald' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-600 text-white rounded-full">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Emerald Green</h4>
                  <p className="text-xs text-gray-500 mt-1">Rich organic green, luxury feel.</p>
                </div>
              </div>
            </div>

            {/* --- Section 2: UI Style (shape language) --- */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-black uppercase tracking-wider text-gray-900 mb-1">
                UI Style
              </label>
              <p className="text-xs text-gray-500 mb-4 font-medium">
                Choose the shape language for buttons, cards, and inputs across your storefront.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Curvy */}
                <div
                  onClick={() => {
                    const newStyle = 'curvy';
                    setFormData({ ...formData, uiStyle: newStyle });
                    document.documentElement.setAttribute('data-style', newStyle);
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, uiStyle: newStyle }));
                    } catch (e) {}
                  }}
                  className={`p-5 border-2 rounded-2xl transition-all cursor-pointer ${
                    formData.uiStyle === 'curvy' || !formData.uiStyle
                      ? 'border-pink-600 bg-pink-50/30 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded-full bg-gray-200 border"></div>
                      <div className="w-8 h-8 rounded-2xl bg-gray-200 border"></div>
                      <div className="w-16 h-4 rounded-full bg-gray-200 border"></div>
                    </div>
                    {(formData.uiStyle === 'curvy' || !formData.uiStyle) && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-pink-600 text-white rounded-full">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Curvy</h4>
                  <p className="text-xs text-gray-500 mt-1">Soft, rounded corners. Friendly and modern look.</p>
                </div>

                {/* Edgy */}
                <div
                  onClick={() => {
                    const newStyle = 'edgy';
                    setFormData({ ...formData, uiStyle: newStyle });
                    document.documentElement.setAttribute('data-style', newStyle);
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, uiStyle: newStyle }));
                    } catch (e) {}
                  }}
                  className={`p-5 border-2 rounded-2xl transition-all cursor-pointer ${
                    formData.uiStyle === 'edgy'
                      ? 'border-pink-600 bg-pink-50/30 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded-none bg-gray-200 border-2"></div>
                      <div className="w-8 h-8 rounded-none bg-gray-200 border-2"></div>
                      <div className="w-16 h-4 rounded-none bg-gray-200 border-2"></div>
                    </div>
                    {formData.uiStyle === 'edgy' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-pink-600 text-white rounded-full">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Edgy</h4>
                  <p className="text-xs text-gray-500 mt-1">Sharp, square corners. Bold and geometric look.</p>
                </div>
              </div>
            </div>

            {/* --- Section 3: Dark Mode Toggle --- */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-200 bg-white">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Dark Mode</h4>
                  <p className="text-xs text-gray-500 mt-1">Switch between light and dark background for the entire storefront.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !formData.darkMode;
                    setFormData({ ...formData, darkMode: next });
                    document.documentElement.setAttribute('data-mode', next ? 'dark' : 'light');
                    try {
                      const cur = JSON.parse(localStorage.getItem('ca_visual') || '{}');
                      localStorage.setItem('ca_visual', JSON.stringify({ ...cur, darkMode: next }));
                    } catch (e) {}
                  }}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    formData.darkMode ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                    formData.darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}></span>
                </button>
              </div>
            </div>


            {/* --- Store Info Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g. Cake Avenue"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
                />
              </div>



            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tagline / Slogan</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Handcrafted Fresh Baked Delights"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                placeholder="support@yourstore.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Support Phone Number</label>
              <input
                type="text"
                name="supportPhone"
                value={formData.supportPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Currency Symbol</label>
              <input
                type="text"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                placeholder="e.g. ₹ or $"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Currency Code</label>
              <input
                type="text"
                name="currencyCode"
                value={formData.currencyCode}
                onChange={handleChange}
                placeholder="e.g. INR or USD"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
              />
            </div>


            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Physical Store Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Store address..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FiMapPin className="text-pink-600" />
                    Google Maps Location Link (URL)
                  </label>
                  <input
                    type="url"
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://maps.google.com/?q=..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Google Maps Link Button Text
                  </label>
                  <input
                    type="text"
                    name="googleMapsText"
                    value={formData.googleMapsText}
                    onChange={handleChange}
                    placeholder="e.g. View Store on Google Maps"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>
              </div>

              {formData.googleMapsUrl && (
                <div className="p-3.5 bg-pink-50/60 rounded-xl border border-pink-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <FiMapPin className="text-pink-600 size-4 shrink-0" />
                    <span className="font-medium">Live Link Button Preview:</span>
                  </div>
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                  >
                    <FiMapPin size={14} />
                    {formData.googleMapsText || 'View Store on Google Maps'}
                    <FiExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



        {/* TAB 2: PAYMENT GATEWAY */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <FiLock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Configure your Razorpay API Credentials here. Entering these keys in the UI overrides the server <code className="bg-amber-100 px-1 rounded">.env</code> values.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Razorpay Key ID</label>
                <input
                  type="text"
                  name="razorpayKeyId"
                  value={formData.razorpayKeyId}
                  onChange={handleChange}
                  placeholder="rzp_live_xxxxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Razorpay Key Secret</label>
                <input
                  type="password"
                  name="razorpayKeySecret"
                  value={formData.razorpayKeySecret}
                  onChange={handleChange}
                  placeholder={formData.hasKeySecret ? '•••••••••••••••• (Configured)' : 'Enter Secret Key'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isRazorpayEnabled"
                  checked={formData.isRazorpayEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-bold text-gray-800">Enable Razorpay (Online Payments)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCodEnabled"
                  checked={formData.isCodEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-bold text-gray-800">Enable Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: PHOTO & MEDIA STORAGE (CLOUDINARY) */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 flex items-start gap-3">
              <FiCloud className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
              <p className="text-xs text-sky-900 leading-relaxed font-medium">
                Configure your <strong>Cloudinary Media Storage Credentials</strong> here. Entering these keys in the Admin UI overrides server <code className="bg-sky-100 px-1.5 py-0.5 rounded text-sky-800 font-bold">.env</code> values, allowing you to manage media storage without code edits.
              </p>
            </div>

            {/* Storage Usage Metrics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-pink-600/20 shrink-0">
                  <FiDatabase size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-600">Total Catalog Images</span>
                  <h4 className="text-2xl font-black text-gray-900 mt-0.5">{storageStats.totalProducts} Assets</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Linked in product database</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                  <FiCloud size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Cloud Status</span>
                  <h4 className="text-base font-black text-gray-900 mt-0.5 flex items-center gap-2">
                    {storageStats.isConfigured ? (
                      <span className="text-emerald-600 flex items-center gap-1 text-sm"><FiCheckCircle /> Connected</span>
                    ) : (
                      <span className="text-amber-600 text-sm">Default / Pending</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium font-mono truncate max-w-[150px]">
                    {formData.cloudinaryCloudName || storageStats.cloudName || 'Not Set'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                  <FiHardDrive size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Free Storage Quota</span>
                  <h4 className="text-lg font-black text-gray-900 mt-0.5">25 GB Quota</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Cloudinary free tier</p>
                </div>
              </div>
            </div>

            {/* Credential Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cloudinary Cloud Name</label>
                <input
                  type="text"
                  name="cloudinaryCloudName"
                  value={formData.cloudinaryCloudName}
                  onChange={handleChange}
                  placeholder="e.g. cake-avenue-cloud"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cloudinary API Key</label>
                <input
                  type="text"
                  name="cloudinaryApiKey"
                  value={formData.cloudinaryApiKey}
                  onChange={handleChange}
                  placeholder="e.g. 123456789012345"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cloudinary API Secret</label>
                <input
                  type="password"
                  name="cloudinaryApiSecret"
                  value={formData.cloudinaryApiSecret}
                  onChange={handleChange}
                  placeholder={formData.hasCloudinarySecret ? '•••••••••••••••• (Configured)' : 'Enter Secret Key'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Target Folder</label>
                <input
                  type="text"
                  name="cloudinaryFolder"
                  value={formData.cloudinaryFolder}
                  onChange={handleChange}
                  placeholder="e.g. cake-avenue"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        )}


        {/* TAB 3: SHIPPING & RULES */}
        {activeTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Order Amount ({formData.currencySymbol})</label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Flat Delivery Fee ({formData.currencySymbol})</label>
              <input
                type="number"
                name="flatDeliveryFee"
                value={formData.flatDeliveryFee}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Free Delivery Threshold ({formData.currencySymbol})</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={formData.freeDeliveryThreshold}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>

            <div className="md:col-span-3 pt-4 border-t border-gray-100 flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isMaintenanceMode"
                  checked={formData.isMaintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-bold text-rose-600">Enable Maintenance Mode (Restricts store checkout)</span>
              </label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettings;
