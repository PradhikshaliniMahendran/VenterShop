'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Printer,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  CheckCircle,
  Truck,
} from 'lucide-react';

interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

interface IOrderAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

interface IOrderData {
  _id: string;
  orderNumber: string;
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: IOrderAddress;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Status Change local state values
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState({
    orderStatus: '',
    paymentStatus: '',
  });

  // Fetch orders from API
  const loadOrders = async () => {
    try {
      const url = `/api/admin/orders?status=${statusFilter}&q=${searchQuery}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const handleToggleExpand = (order: IOrderData) => {
    if (expandedId === order._id) {
      setExpandedId(null);
    } else {
      setExpandedId(order._id);
      setStatusForm({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      });
    }
  };

  const handleUpdateStatus = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderStatus: statusForm.orderStatus,
          paymentStatus: statusForm.paymentStatus,
        }),
      });

      if (res.ok) {
        alert('Order status updated successfully');
        loadOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (e) {
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Reusable print window helper
  const handlePrintInvoice = (order: IOrderData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let itemsRows = '';
    order.items.forEach((item) => {
      itemsRows += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} (${item.sku})</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `;
    });

    const customerName = order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest';

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #1a2a4a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 900; color: #1a2a4a; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; color: #1a2a4a; padding: 10px; text-align: left; }
            .totals { width: 300px; margin-left: auto; font-size: 14px; }
            .totals td { padding: 5px 0; }
            .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VENTERSHOP</div>
          </div>
          <div class="meta">
            <div>
              <h3>INVOICE</h3>
              <p><strong>Order ID:</strong> #${order.orderNumber}</p>
              <p><strong>Customer Name:</strong> ${customerName}</p>
              <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            </div>
            <div>
              <h3>Shipping Destination</h3>
              <p><strong>${order.deliveryAddress.fullName}</strong></p>
              <p>${order.deliveryAddress.addressLine1}</p>
              ${order.deliveryAddress.addressLine2 ? `<p>${order.deliveryAddress.addressLine2}</p>` : ''}
              <p>${order.deliveryAddress.city}, ${order.deliveryAddress.province} ${order.deliveryAddress.postalCode}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
          <div class="totals">
            <table style="width: 100%;">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">$${order.subtotal.toFixed(2)}</td>
              </tr>
              ${order.discount > 0 ? `<tr>
                <td style="color: green;">Discount:</td>
                <td style="text-align: right; color: green;">-$${order.discount.toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td>Shipping:</td>
                <td style="text-align: right;">$${order.deliveryFee.toFixed(2)}</td>
              </tr>
              <tr style="font-weight: bold; border-top: 1.5px solid #1a2a4a;">
                <td style="padding-top: 10px;">Total:</td>
                <td style="text-align: right; padding-top: 10px;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'CANCELLED':
        return 'text-red-700 bg-red-50 border-red-100';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'text-sky-700 bg-sky-50 border-sky-100';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs font-semibold">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-150 pb-4">
        <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#E53935]" />
          Store Orders Administration
        </h1>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
          />
        </div>

        {/* Status Tabs Selector */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto select-none">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`py-1.5 px-3 rounded-lg border transition-all ${
                statusFilter === st
                  ? 'bg-[#1A2A4A] text-white border-[#1A2A4A] shadow-xs'
                  : 'bg-white text-gray-600 border-gray-250 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Loader */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-20 border border-gray-150 p-4 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-gray-500 max-w-md mx-auto">
          No matching orders found in the database.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            const customerName = order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest User';
            const customerEmail = order.userId ? order.userId.email : '';

            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  isExpanded ? 'border-[#1A2A4A] shadow-xs' : 'border-gray-150 hover:border-gray-250'
                }`}
              >
                {/* Header button click wrapper */}
                <button
                  onClick={() => handleToggleExpand(order)}
                  className="w-full p-4 sm:p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow pr-4">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">ID</span>
                      <strong className="text-[#1A2A4A]">{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Customer</span>
                      <span className="text-gray-700 block truncate max-w-[120px]">{customerName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Date Placed</span>
                      <span className="text-gray-500 block">{formatDate(order.createdAt).split(' at')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total</span>
                      <span className="text-[#101A2D] font-bold block">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                    <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded details section */}
                {isExpanded && (
                  <div className="p-5 border-t border-gray-150 space-y-6 bg-white animate-fade-in">
                    
                    {/* Products Grid */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[#101A2D] uppercase tracking-wider">Ordered Products</h4>
                      <div className="divide-y divide-gray-100 border border-gray-150 rounded-lg p-3 bg-gray-50/50">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex justify-between items-center text-xs">
                            <div>
                              <p className="text-[#101A2D] font-bold">{item.name}</p>
                              <p className="text-[9px] text-gray-400">SKU: {item.sku} • Price: ${item.price.toFixed(2)}/unit</p>
                            </div>
                            <span className="font-bold text-[#101A2D]">{item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address & Status update grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Delivery and contact details */}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          Fulfillment Address & Contacts
                        </h4>
                        <div className="p-4 border border-gray-150 rounded-lg space-y-2 text-gray-600 bg-gray-50/20">
                          <p><strong>Recipient:</strong> {order.deliveryAddress.fullName}</p>
                          <p><strong>Address:</strong> {order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}</p>
                          <p><strong>Location:</strong> {order.deliveryAddress.city}, {order.deliveryAddress.province} {order.deliveryAddress.postalCode}</p>
                          <p><strong>Phone:</strong> {order.deliveryAddress.phone}</p>
                          <p><strong>Account Email:</strong> <a href={`mailto:${customerEmail}`} className="text-[#E53935] hover:underline">{customerEmail}</a></p>
                        </div>
                      </div>

                      {/* Status Management forms */}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          Order Status Verification
                        </h4>
                        
                        <div className="p-4 border border-gray-150 rounded-lg bg-gray-50/20 space-y-4">
                          {/* Fulfillment Status Select */}
                          <div className="space-y-1">
                            <label className="text-gray-400 uppercase tracking-wider text-[9px]">Fulfillment Stage</label>
                            <select
                              value={statusForm.orderStatus}
                              onChange={(e) => setStatusForm({ ...statusForm, orderStatus: e.target.value })}
                              className="w-full bg-white border border-gray-250 rounded-lg p-2 outline-none cursor-pointer text-gray-900 font-bold"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>

                          {/* Payment Status Select */}
                          <div className="space-y-1">
                            <label className="text-gray-400 uppercase tracking-wider text-[9px]">Payment Status</label>
                            <select
                              value={statusForm.paymentStatus}
                              onChange={(e) => setStatusForm({ ...statusForm, paymentStatus: e.target.value })}
                              className="w-full bg-white border border-gray-250 rounded-lg p-2 outline-none cursor-pointer text-gray-900 font-bold"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PAID">PAID</option>
                              <option value="FAILED">FAILED</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </div>

                          {/* Trigger Update */}
                          <button
                            onClick={() => handleUpdateStatus(order._id)}
                            disabled={updatingId === order._id}
                            className="w-full py-2 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors"
                          >
                            {updatingId === order._id ? 'Saving Updates...' : 'Update Order Status'}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Actions toolbar */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="flex items-center gap-1.5 py-1.5 px-4 border border-gray-250 hover:bg-gray-50 text-[#333333] rounded-lg font-bold"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
