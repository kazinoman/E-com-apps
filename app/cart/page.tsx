import { CartPage } from "@/features/Cart/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Zaag",
  description: "View and manage items in your shopping cart.",
};

export default function Page() {
  return <CartPage />;
}
