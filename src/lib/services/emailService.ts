import { sendEmail } from '@/lib/nodemailer/nodemailer';

// Helper for generic premium layout wrapper
function getEmailWrapper(title: string, bodyContent: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a2a4a; padding-bottom: 15px;">
        <h1 style="color: #1a2a4a; margin: 0; font-size: 28px; letter-spacing: 1px;">VENTERSHOP</h1>
        <p style="color: #E53935; margin: 5px 0 0; font-size: 13px; font-weight: bold; letter-spacing: 0.5px;">Your Trusted Online Store for Quality Products</p>
      </div>
      <div style="padding: 10px 0;">
        <h2 style="color: #1a2a4a; font-size: 20px; margin-top: 0; margin-bottom: 15px;">${title}</h2>
        ${bodyContent}
      </div>
      <div style="margin-top: 25px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 15px;">
        <p style="margin: 0 0 5px;">This is an automated message, please do not reply directly.</p>
        <p style="margin: 0; font-weight: bold;">© 2026 VENTERSHOP Canada. All rights reserved.</p>
      </div>
    </div>
  `;
}

export class EmailService {
  /**
   * Sends a Welcome email to a new user
   */
  static async sendWelcomeEmail(to: string, name: string) {
    const title = 'Welcome to VENTERSHOP!';
    const bodyContent = `
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Thank you for registering on VENTERSHOP. We are committed to providing you with quality products and a reliable shopping experience across Canada.</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Logged in to your dashboard, you can track orders, update delivery addresses, manage vouchers in your wallet, and explore custom benefits.</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #1a2a4a; color: #ffffff; padding: 12px 25px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Start Shopping</a>
      </div>
    `;

    await sendEmail({
      to,
      subject: 'Welcome to VENTERSHOP!',
      html: getEmailWrapper(title, bodyContent),
    });
  }

  /**
   * Sends order receipt confirmation
   */
  static async sendOrderConfirmation(to: string, name: string, order: any) {
    const title = `Order Confirmed - #${order.orderNumber}`;

    let itemsHtml = '';
    for (const item of order.items) {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `;
    }

    const bodyContent = `
      <p style="color: #333333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Thank you for your order! We have received your purchase and our fulfillment team is preparing it. Below is your order summary.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left; color: #1a2a4a;">Item</th>
            <th style="padding: 10px; text-align: center; color: #1a2a4a; width: 60px;">Qty</th>
            <th style="padding: 10px; text-align: right; color: #1a2a4a; width: 80px;">Price</th>
            <th style="padding: 10px; text-align: right; color: #1a2a4a; width: 90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="width: 100%; max-width: 300px; margin-left: auto; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #6b7280;">Subtotal:</td>
            <td style="padding: 5px 0; text-align: right; color: #333333;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          ${
            order.discount > 0
              ? `<tr>
            <td style="padding: 5px 0; color: #16803C;">Discount:</td>
            <td style="padding: 5px 0; text-align: right; color: #16803C;">-$${order.discount.toFixed(2)}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 5px 0; color: #6b7280;">Shipping:</td>
            <td style="padding: 5px 0; text-align: right; color: #333333;">${
              order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`
            }</td>
          </tr>
          <tr style="border-top: 2px solid #1a2a4a; font-weight: bold;">
            <td style="padding: 10px 0; color: #1a2a4a; font-size: 16px;">Total:</td>
            <td style="padding: 10px 0; text-align: right; color: #1a2a4a; font-size: 16px;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h4 style="margin-top: 0; color: #1a2a4a; margin-bottom: 8px;">Delivery Address</h4>
        <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.4;">
          <strong>${order.deliveryAddress.fullName}</strong><br />
          ${order.deliveryAddress.addressLine1}${
      order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''
    }<br />
          ${order.deliveryAddress.city}, ${order.deliveryAddress.province} ${order.deliveryAddress.postalCode}<br />
          Phone: ${order.deliveryAddress.phone}
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="background-color: #1a2a4a; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Track Order Status</a>
      </div>
    `;

    await sendEmail({
      to,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: getEmailWrapper(title, bodyContent),
    });
  }

  /**
   * Sends an email notification to user about status updates
   */
  static async sendOrderStatusUpdate(to: string, name: string, orderNumber: string, status: string) {
    const title = `Order Status Update: ${status.replace(/_/g, ' ')}`;

    // Prepare status friendly labels
    let statusDesc = '';
    switch (status) {
      case 'CONFIRMED':
        statusDesc = 'Your order has been confirmed by our staff and is now being packaged.';
        break;
      case 'PROCESSING':
        statusDesc = 'Your order is currently in processing status and is being assembled.';
        break;
      case 'SHIPPED':
        statusDesc = 'Good news! Your package has been handed over to the courier and is shipped.';
        break;
      case 'OUT_FOR_DELIVERY':
        statusDesc = 'Your package is out for delivery today and will reach your address shortly.';
        break;
      case 'DELIVERED':
        statusDesc = 'Your order has been successfully delivered. Thank you for shopping with VENTERSHOP!';
        break;
      case 'CANCELLED':
        statusDesc = 'Your order has been cancelled. If you believe this is an error, please contact customer support.';
        break;
      default:
        statusDesc = `Your order status has updated to: ${status}`;
    }

    const bodyContent = `
      <p style="color: #333333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">The status of your order <strong>#${orderNumber}</strong> has changed.</p>
      <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #1a2a4a; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; color: #1a2a4a; font-weight: bold;">Status: ${status.replace(/_/g, ' ')}</p>
        <p style="margin: 8px 0 0; color: #555555; font-size: 15px; line-height: 1.4;">${statusDesc}</p>
      </div>
      <p style="color: #333333; font-size: 15px;">You can view updates or receipts in your customer portal.</p>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="background-color: #1a2a4a; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">View Orders</a>
      </div>
    `;

    await sendEmail({
      to,
      subject: `Order #${orderNumber} Status Updated: ${status.replace(/_/g, ' ')}`,
      html: getEmailWrapper(title, bodyContent),
    });
  }

  /**
   * Community Application / Status Change Approval Email
   */
  static async sendCommunityApproval(to: string, name: string, communityName: string) {
    const title = 'Community Membership Approved!';
    const bodyContent = `
      <p style="color: #333333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">We are pleased to inform you that your request to join the <strong>${communityName}</strong> group has been approved by the administrators.</p>
      <div style="background-color: #f4fbf7; border: 1px solid #16803C; padding: 15px; border-radius: 6px; margin: 20px 0; color: #16803C;">
        <p style="margin: 0; font-weight: bold; font-size: 16px;">🎉 Community Pricing & Vouchers Unlocked!</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #333333; line-height: 1.4;">
          Exclusive community-level catalog pricing and vouchers targeting <strong>${communityName}</strong> are now active on your profile.
        </p>
      </div>
      <p style="color: #333333; font-size: 15px;">These benefits will be applied automatically when you log in and shop.</p>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background-color: #1a2a4a; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Shop Community Deals</a>
      </div>
    `;

    await sendEmail({
      to,
      subject: `Community Membership Confirmed - ${communityName}`,
      html: getEmailWrapper(title, bodyContent),
    });
  }

  /**
   * Wholesale B2B Application Status Approved Email
   */
  static async sendWholesaleApproval(to: string, name: string, businessName: string) {
    const title = 'Wholesale Account Approved!';
    const bodyContent = `
      <p style="color: #333333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">We are thrilled to let you know that your application for a Wholesale B2B buyer account for <strong>${businessName}</strong> has been <strong>approved</strong>.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #1a2a4a; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #1a2a4a; font-size: 16px; margin-bottom: 8px;">Your B2B Benefits</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.6;">
          <li>Wholesale-tier base pricing on eligible inventory</li>
          <li>Bulk-purchasing quantity discounts (multi-tier savings)</li>
          <li>Access to Wholesale-only product listings</li>
          <li>Targeted B2B voucher campaigns and offer structures</li>
        </ul>
      </div>

      <p style="color: #333333; font-size: 15px;">Simply log in to your account to view the catalog at wholesale pricing rates.</p>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background-color: #E53935; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Enter B2B Portal</a>
      </div>
    `;

    await sendEmail({
      to,
      subject: 'Wholesale B2B Account Approved - VENTERSHOP',
      html: getEmailWrapper(title, bodyContent),
    });
  }

  /**
   * Sends email notification to administrators about incoming sales
   */
  static async sendAdminNewOrderNotification(adminEmail: string, order: any) {
    const title = `Alert: New Order Placed - #${order.orderNumber}`;
    const bodyContent = `
      <p style="color: #333333; font-size: 16px;">Dear Admin,</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">A new order has been received on VENTERSHOP.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #6b7280; width: 120px; padding: 4px 0;">Order ID:</td>
            <td style="font-weight: bold; color: #333333; padding: 4px 0;">#${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 4px 0;">Customer Type:</td>
            <td style="color: #333333; padding: 4px 0; font-weight: bold;">${order.customerType}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 4px 0;">Total Amount:</td>
            <td style="color: #1a2a4a; padding: 4px 0; font-weight: bold;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" style="background-color: #1a2a4a; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Manage Orders in Admin Panel</a>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `[ADMIN ALERT] New Order Received: #${order.orderNumber}`,
      html: getEmailWrapper(title, bodyContent),
    });
  }
}
