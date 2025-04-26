import React, { useState, useEffect, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';

function OrderHistory({ isAdmin }) {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getHistory = async () => {
            try {
                const res = await axios.get('/user/order-history', {
                    headers: { Authorization: token }
                });
                setHistory(res.data);
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        };
        getHistory();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">
                {isAdmin ? 'All Orders' : 'Order History'}
            </h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {history.map((order) => (
                            <tr key={order.orderId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.orderId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.title} x {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {history.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
