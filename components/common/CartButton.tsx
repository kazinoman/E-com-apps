import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartButtonProps {
  cartCount: number;
  onOpenCart?: () => void;
}

export function CartButton({ cartCount, onOpenCart }: CartButtonProps) {
  return (
    <Button variant="destructive" size="icon" className="relative p-0 m-0 rounded-full" onClick={onOpenCart}>
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />

      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}

      <span className="sr-only">Open cart</span>
    </Button>
  );
}
