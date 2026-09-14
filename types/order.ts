export interface OrderProduct {
  id: string;
  title: string;
  price: number;
  image: string;
}

export interface OrderItem {
  id: string;
  product: OrderProduct;
  quantity: number;
  seller?: string;
}

export interface OrderTimelineEvent {
  status: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    billingAddress: string;
    orderNote?: string;
  };
  payment: {
    deliveryType: string;
    paymentMethod: string;
    cardDetails?: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: "In progress" | "Delivered" | "Canceled" | "order-initiate" | "paid" | string;
  timeline?: OrderTimelineEvent[];
  createdAt: string;
}
