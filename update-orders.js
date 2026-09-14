const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data', 'orders.json');

try {
  let orders = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  orders = orders.map((order) => {
    // Determine a visual status based on the backend status
    let visualStatus = order.status;
    if (order.status === 'order shipped' || order.status === 'delivered') {
      visualStatus = 'Delivered';
    } else if (order.status === 'canceled') {
      visualStatus = 'Canceled';
    } else {
      visualStatus = 'In progress';
    }

    order.status = visualStatus;

    // Add seller info
    order.items = order.items.map(item => ({
      ...item,
      seller: item.seller || 'Gadget Electronics'
    }));

    // Add timeline info
    if (!order.timeline) {
      const baseDate = new Date(order.createdAt || '2023-01-21T11:45:00Z');
      
      const timeline = [
        {
          status: 'Order has been placed',
          date: baseDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: baseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: true,
        },
        {
          status: 'We received your order',
          date: new Date(baseDate.getTime() + 10 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 10 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: true,
        },
        {
          status: 'Order has been confirmed',
          date: new Date(baseDate.getTime() + 20 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 20 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: visualStatus === 'Delivered' || visualStatus === 'In progress',
        },
        {
          status: 'We are preparing your order',
          date: new Date(baseDate.getTime() + 25 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 25 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: visualStatus === 'Delivered' || visualStatus === 'In progress',
        },
        {
          status: 'Order is ready',
          date: new Date(baseDate.getTime() + 45 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 45 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: visualStatus === 'Delivered',
        },
        {
          status: 'Order is on the way',
          date: new Date(baseDate.getTime() + 50 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 50 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: visualStatus === 'Delivered',
        },
        {
          status: 'Order has been delivered',
          date: new Date(baseDate.getTime() + 65 * 60000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date(baseDate.getTime() + 65 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: visualStatus === 'Delivered',
        }
      ];
      order.timeline = timeline;
    }

    return order;
  });

  fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
  console.log('Successfully updated orders.json');
} catch (error) {
  console.error('Failed to update orders.json', error);
}
