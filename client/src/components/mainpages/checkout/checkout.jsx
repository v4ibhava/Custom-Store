import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMapPin, FiPackage, FiCreditCard, FiArrowRight } from 'react-icons/fi'

const loadRazorpayScript = () => {
	return new Promise((resolve) => {
		if (document.getElementById('razorpay-sdk')) return resolve(true)
		const script = document.createElement('script')
		script.id = 'razorpay-sdk'
		script.src = 'https://checkout.razorpay.com/v1/checkout.js'
		script.onload = () => resolve(true)
		script.onerror = () => resolve(false)
		document.body.appendChild(script)
	})
}

const Checkout = () => {
	const navigate = useNavigate()
	const state = useContext(GlobalState)
	const [token] = state.token
	const [cart] = state.userAPI.cart
	const [user] = state.userAPI.user
	const [selectedAddressId, setSelectedAddressId] = useState('')

	const [settings] = state?.settingsAPI?.settings || [{}];
	const storeName = settings?.storeName || 'Cake Avenue';


	useEffect(() => {
		const addrs = user?.addresses || []
		if (!addrs.length) return
		const def = addrs.find(a => a.isDefault) || addrs[0]
		const defId = def?._id?.toString?.() || def?._id || ''
		setSelectedAddressId(prev => prev || defId)
	}, [user])

	const totalAmount = useMemo(() => {
		return (cart || []).reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
	}, [cart])

	const handlePay = async () => {
		if (!token) return toast.error('Please login to continue')
		if (!cart?.length) return toast.error('Your cart is empty')
		const address = (user?.addresses || []).find(a => (a._id?.toString?.() || a._id) === selectedAddressId)
		if (!address) return toast.error('Select a delivery address')

		const ok = await loadRazorpayScript()
		if (!ok) return toast.error('Razorpay SDK failed to load.')

		try {
			const items = cart.map(c => ({
				productId: c._id,
				name: c.title || c.name,
				price: c.price,
				quantity: c.quantity || 1,
				image: c.images?.url || c.image
			}))

			const { data } = await axios.post('/api/payment/order', {
				amount: totalAmount,
				currency: 'INR',
				items,
				address: {
					street: address.street,
					city: address.city,
					state: address.state,
					postalCode: address.postalCode,
					country: address.country
				}
			}, { headers: { Authorization: token } })

			const { order, dbOrderId } = data
			const { data: config } = await axios.get('/api/payment/config')
			const key = config?.key
			if (!key) return toast.error('Razorpay key is not configured')
			const options = {
				key,
				amount: order.amount,
				currency: order.currency,
				name: storeName,

				description: 'Order Payment',
				order_id: order.id,
				prefill: { name: user?.name || '', email: user?.email || '' },
				handler: async function (response) {
					try {
						await axios.post('/api/payment/verify', {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature
						}, { headers: { Authorization: token } })
						toast.success('Payment successful!')
						navigate(`/orders/${dbOrderId}`)
					} catch (e) {
						toast.error(e?.response?.data?.msg || 'Payment verification failed')
					}
				}
			}
			const rzp = new window.Razorpay(options)
			rzp.open()
		} catch (err) {
			toast.error(err?.response?.data?.msg || 'Unable to start payment')
		}
	}

	return (
		<div className="min-h-screen bg-[#FAF0E6] pb-8">
			<div className="bg-white border-b border-pink-50">
				<div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
					<h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Checkout</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-0.5">Review and complete your order</p>
				</div>
			</div>

			<div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
				{/* Address */}
				<div className="bg-white rounded-2xl shadow-sm border border-pink-50/40 overflow-hidden">
					<div className="px-4 py-3 border-b border-pink-50/60 flex items-center gap-3">
						<div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
							<FiMapPin className="text-pink-500 size-4" />
						</div>
						<h2 className="font-bold text-gray-900 text-sm">Delivery Address</h2>
					</div>
					<div className="p-4">
						{user?.addresses?.length ? (
							<select
								value={selectedAddressId}
								onChange={e => setSelectedAddressId(e.target.value)}
								className="w-full px-4 py-3 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 font-medium"
							>
								{user.addresses.map(addr => (
									<option key={addr._id} value={addr._id}>
										{addr.street}, {addr.city}, {addr.state} {addr.postalCode} {addr.isDefault ? '(Default)' : ''}
									</option>
								))}
							</select>
						) : (
							<div className="text-center py-4">
								<p className="text-sm text-gray-500 mb-2">No address found.</p>
								<button onClick={() => navigate('/profile')} className="text-sm text-pink-600 font-bold hover:underline">
									Add in Profile
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Order Items */}
				<div className="bg-white rounded-2xl shadow-sm border border-pink-50/40 overflow-hidden">
					<div className="px-4 py-3 border-b border-pink-50/60 flex items-center gap-3">
						<div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
							<FiPackage className="text-pink-500 size-4" />
						</div>
						<h2 className="font-bold text-gray-900 text-sm">Order Items</h2>
						<span className="ml-auto text-xs text-gray-400">{cart?.length || 0} items</span>
					</div>
					<div className="divide-y divide-pink-50/60">
						{cart?.map(item => (
							<div key={item._id} className="px-4 py-3 flex items-center gap-3">
								<div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
									<img src={item.images?.url || item.image} alt={item.title} className="w-full h-full object-cover" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-bold text-gray-900 truncate">{item.title || item.name}</p>
									<p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
								</div>
								<span className="text-sm font-bold text-pink-600 shrink-0">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>

				{/* Summary */}
				<div className="bg-white rounded-2xl shadow-sm border border-pink-50/40 overflow-hidden">
					<div className="px-4 py-3 border-b border-pink-50/60 flex items-center gap-3">
						<div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
							<FiCreditCard className="text-pink-500 size-4" />
						</div>
						<h2 className="font-bold text-gray-900 text-sm">Payment Summary</h2>
					</div>
					<div className="p-4 sm:p-5">
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-500">Subtotal</span>
								<span className="font-medium">₹{totalAmount.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">Shipping</span>
								<span className="font-medium text-green-600">Free</span>
							</div>
							<hr className="border-pink-100" />
							<div className="flex justify-between">
								<span className="font-bold text-gray-900">Total</span>
								<span className="font-black text-lg text-pink-600">₹{totalAmount.toFixed(2)}</span>
							</div>
						</div>
						<button
							onClick={handlePay}
							disabled={!user?.addresses?.length}
							className="w-full mt-5 py-3.5 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200/50 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Pay with Razorpay
							<FiArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout
