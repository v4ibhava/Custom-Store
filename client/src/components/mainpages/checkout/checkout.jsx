import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { useNavigate } from 'react-router-dom'

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

	// Choose default address if present; fall back to first address
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
		if (!token) return alert('Please login to continue')
		if (!cart?.length) return alert('Your cart is empty')
		const address = (user?.addresses || []).find(a => (a._id?.toString?.() || a._id) === selectedAddressId)
		if (!address) return alert('Select a delivery address')

		const ok = await loadRazorpayScript()
		if (!ok) return alert('Razorpay SDK failed to load. Check your network.')

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
			if (!key) return alert('Razorpay key is not configured on the server')
			const options = {
				key,
				amount: order.amount,
				currency: order.currency,
				name: 'E-com Checkout',
				description: 'Order Payment',
				order_id: order.id,
				prefill: {
					name: user?.name || '',
					email: user?.email || ''
				},
				handler: async function (response) {
					try {
						await axios.post('/api/payment/verify', {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature
						}, { headers: { Authorization: token } })
						navigate(`/orders/${dbOrderId}`)
					} catch (e) {
						alert(e?.response?.data?.msg || 'Payment verification failed')
					}
				}
			}
			const rzp = new window.Razorpay(options)
			rzp.open()
		} catch (err) {
			alert(err?.response?.data?.msg || 'Unable to start payment')
		}
	}

	return (
		<div className="container" style={{ maxWidth: 900, margin: '20px auto' }}>
			<h2>Checkout</h2>
			<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
				<div>
					<h3>Delivery Address</h3>
					{user?.addresses?.length ? (
						<div>
							<select value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)} style={{ width: '100%', padding: 8 }}>
								{user.addresses.map(addr => (
									<option key={addr._id} value={addr._id}>
										{addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country} {addr.isDefault ? '(Default)' : ''}
									</option>
								))}
							</select>
						</div>
					) : (
						<p>Add an address in Profile to proceed.</p>
					)}

					<h3 style={{ marginTop: 20 }}>Order Items</h3>
					<div>
						{cart?.map(item => (
							<div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
								<span>{item.title} x {item.quantity || 1}</span>
								<span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>
				<div>
					<h3>Summary</h3>
					<div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>Total</span>
							<strong>₹{totalAmount.toFixed(2)}</strong>
						</div>
						<button onClick={handlePay} style={{ width: '100%', marginTop: 12, padding: 12, background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Pay with Razorpay</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout
