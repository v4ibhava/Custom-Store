import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

const steps = ['Pending', 'Processing', 'Packed', 'Out for Delivery', 'Delivered']

const OrderStatus = () => {
	const { id } = useParams()
	const state = useContext(GlobalState)
	const [token] = state.token
	const [order, setOrder] = useState(null)

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const { data } = await axios.get(`/api/orders/${id}`, { headers: { Authorization: token } })
				setOrder(data)
			} catch (e) {
				console.error(e)
			}
		}
		if (token) fetchOrder()
	}, [id, token])

	const currentIdx = steps.indexOf(order?.status)

	return (
		<div className="container" style={{ maxWidth: 900, margin: '20px auto' }}>
			<h2>Order Status</h2>
			{order && (
				<div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
						<div><strong>Order ID:</strong> {order._id}</div>
						<div><strong>Total:</strong> ₹{order.amount?.toFixed(2)} • <strong>Payment:</strong> {order.paymentStatus} {order.paymentMode ? `(${order.paymentMode})` : ''}</div>
					</div>
					<div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 8, alignItems: 'center' }}>
						{steps.map((step, idx) => {
							const isActive = idx <= currentIdx
							const isDelivered = step === 'Delivered' && isActive
							return (
								<div key={step} style={{ textAlign: 'center' }}>
									<div style={{
										width: 14,
										height: 14,
										margin: '0 auto 6px',
										borderRadius: '50%',
										background: isActive ? '#16a34a' : '#d1d5db',
										boxShadow: isDelivered ? '0 0 8px 3px rgba(34,197,94,0.8)' : 'none'
									}} />
									<div style={{ fontSize: 12, color: isActive ? '#111827' : '#6b7280' }}>{step}</div>
								</div>
							)
						})}
					</div>

					<h3 style={{ marginTop: 20 }}>Items</h3>
					{order.items?.map((it) => (
						<div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
							<span>{it.name} x {it.quantity}</span>
							<span>₹{(it.price * it.quantity).toFixed(2)}</span>
						</div>
					))}

					<h3 style={{ marginTop: 20 }}>Delivery Address</h3>
					<div>{order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.postalCode}, {order.address?.country}</div>

					<div style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
						Placed: {new Date(order.placedAt || order.createdAt).toLocaleString()} {order.deliveredAt ? `• Delivered: ${new Date(order.deliveredAt).toLocaleString()}` : ''}
					</div>
				</div>
			)}
		</div>
	)
}

export default OrderStatus


