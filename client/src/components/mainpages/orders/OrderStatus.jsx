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
			} catch (e) { console.error(e) }
		}
		if (token) fetchOrder()
	}, [id, token])

	const currentIdx = steps.indexOf(order?.status)

	return (
		<div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
			<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Order Status</h2>
			{order && (
				<div className="space-y-4">
					<div className="bg-white rounded-xl shadow-sm border border-pink-50/50 p-3 sm:p-4">
						<div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm mb-4">
							<div className="font-bold text-gray-900">Order: #{order._id.slice(-6).toUpperCase()}</div>
							<div className="text-gray-500">
								<span className="font-bold text-pink-600" style={{ color: '#E91E63' }}>₹{order.amount?.toFixed(2)}</span>
								{' • '}{order.paymentStatus} {order.paymentMode ? `(${order.paymentMode})` : ''}
							</div>
						</div>

						{/* Progress Steps */}
						<div className="flex items-center justify-between mb-4 overflow-x-auto">
							{steps.map((step, idx) => {
								const isActive = idx <= currentIdx
								const isDelivered = step === 'Delivered' && isActive
								return (
									<div key={step} className="flex-1 text-center min-w-0">
										<div className={`w-3 h-3 mx-auto mb-1 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-200'} ${isDelivered ? 'shadow-md shadow-green-300' : ''}`} />
										<div className={`text-[9px] sm:text-[10px] font-medium px-0.5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step}</div>
									</div>
								)
							})}
						</div>
					</div>

					{/* Items */}
					<div className="bg-white rounded-xl shadow-sm border border-pink-50/50 p-3 sm:p-4">
						<h3 className="text-sm font-bold text-gray-900 mb-2">Items</h3>
						{order.items?.map((it) => (
							<div key={it.productId} className="flex justify-between py-1.5 text-sm border-b border-pink-50 last:border-0">
								<span className="text-gray-700 truncate mr-2">{it.name} <span className="text-pink-400 text-xs">x {it.quantity}</span></span>
								<span className="font-bold text-pink-600 shrink-0" style={{ color: '#E91E63' }}>₹{(it.price * it.quantity).toFixed(2)}</span>
							</div>
						))}
					</div>

					{/* Delivery Address */}
					<div className="bg-white rounded-xl shadow-sm border border-pink-50/50 p-3 sm:p-4">
						<h3 className="text-sm font-bold text-gray-900 mb-1">Delivery Address</h3>
						<p className="text-xs text-gray-600">{order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.postalCode}, {order.address?.country}</p>
					</div>

					<div className="text-[10px] text-gray-400">
						Placed: {new Date(order.placedAt || order.createdAt).toLocaleString()} {order.deliveredAt ? `• Delivered: ${new Date(order.deliveredAt).toLocaleString()}` : ''}
					</div>
				</div>
			)}
		</div>
	)
}

export default OrderStatus
