import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

const statuses = ['Pending', 'Processing', 'Packed', 'Out for Delivery', 'Delivered']
const payStates = ['created', 'paid', 'failed', 'refunded']

const AdminOrders = () => {
	const state = useContext(GlobalState)
	const [token] = state.token
	const [orders, setOrders] = useState([])
	const [statusFilter, setStatusFilter] = useState('')
	const [paymentFilter, setPaymentFilter] = useState('')

	const params = useMemo(() => {
		const p = new URLSearchParams()
		if (statusFilter) p.set('status', statusFilter)
		if (paymentFilter) p.set('paymentStatus', paymentFilter)
		return p.toString()
	}, [statusFilter, paymentFilter])

	useEffect(() => {
		let timer
		const fetchOrders = async () => {
			try {
				const url = `/api/orders${params ? `?${params}` : ''}`
				const { data } = await axios.get(url, { headers: { Authorization: token } })
				setOrders(data)
			} catch (e) {
				console.error(e)
			}
		}
		if (token) {
			fetchOrders()
			timer = setInterval(fetchOrders, 10000)
		}
		return () => { if (timer) clearInterval(timer) }
	}, [params, token])

	const advanceStatus = async (order) => {
		const idx = statuses.indexOf(order.status)
		if (idx === -1 || idx === statuses.length - 1) return
		const next = statuses[idx + 1]
		try {
			const { data } = await axios.patch(`/api/orders/${order._id}/status`, { status: next }, { headers: { Authorization: token } })
			setOrders(prev => prev.map(o => o._id === order._id ? data : o))
		} catch (e) {
			alert(e?.response?.data?.msg || 'Failed to update status')
		}
	}

	return (
		<div className="container" style={{ maxWidth: 1100, margin: '20px auto' }}>
			<h2>Admin Orders</h2>
			<div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
				<select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
					<option value="">All Statuses</option>
					{statuses.map(s => <option key={s} value={s}>{s}</option>)}
				</select>
				<select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
					<option value="">All Payments</option>
					{payStates.map(s => <option key={s} value={s}>{s}</option>)}
				</select>
			</div>
			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
							<th>Customer</th>
							<th>Placed</th>
							<th>Total</th>
							<th>Address</th>
							<th>Mode</th>
							<th>Payment</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map(o => (
							<tr key={o._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
								<td>{o.user?.name || o.user?.email || 'User'}</td>
								<td>{new Date(o.placedAt || o.createdAt).toLocaleString()}</td>
								<td>₹{o.amount?.toFixed(2)}</td>
								<td style={{ maxWidth: 260 }}>{o.address?.street}, {o.address?.city}, {o.address?.state} {o.address?.postalCode}</td>
								<td>{o.paymentMode || '-'}</td>
								<td>{o.paymentStatus}</td>
								<td>{o.status}</td>
								<td>
									<button disabled={o.status === 'Delivered'} onClick={() => advanceStatus(o)} style={{ padding: '6px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Advance</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AdminOrders


