import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Container } from "@/components/common/Container";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-5 text-left text-[15px] md:text-base font-semibold transition-all hover:text-black dark:hover:text-white outline-none [&[data-state=open]_.plus]:hidden [&[data-state=open]_.minus]:block [&[data-state=open]_.icon-bg]:bg-black dark:[&[data-state=open]_.icon-bg]:bg-white [&[data-state=open]_.icon-bg]:text-white dark:[&[data-state=open]_.icon-bg]:text-black",
        className
      )}
      {...props}
    >
      {children}
      <div className="icon-bg ml-4 shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-secondary/40 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <Plus className="plus h-4 w-4 transition-transform duration-300" />
        <Minus className="minus hidden h-4 w-4 transition-transform duration-300" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
FAQAccordionTrigger.displayName = "FAQAccordionTrigger";

export const FAQSection = () => {
  return (
    <Container className="mt-12 mb-6 md:my-16 pb-2 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Everything you need to know about our wholesale marketplace, sourcing products from China, and our delivery process.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem
            value="item-1"
            className="bg-white dark:bg-secondary/20 border border-border/50 rounded-2xl px-6 overflow-hidden shadow-sm hover:shadow-md transition-all data-[state=open]:shadow-md data-[state=open]:border-black/20 dark:data-[state=open]:border-white/20"
          >
            <FAQAccordionTrigger>
              Welcome to Wholesale Marketplace!
            </FAQAccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] md:text-[15px] pb-6">
              We offer a vast selection of products from China, featuring hundreds of thousands of items. Our platform is crafted specifically for small to medium-sized entrepreneurs, retailers, and e-commerce businesses. Finding reliable manufacturers in China can be a challenge in product sourcing, but with us, you can buy directly from manufacturers at authentic wholesale prices. Simply search by product name or use a photo to quickly find your desired items.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="bg-white dark:bg-secondary/20 border border-border/50 rounded-2xl px-6 overflow-hidden shadow-sm hover:shadow-md transition-all data-[state=open]:shadow-md data-[state=open]:border-black/20 dark:data-[state=open]:border-white/20"
          >
            <FAQAccordionTrigger>
              Our Delivery Promise
            </FAQAccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] md:text-[15px] pb-6">
              After purchasing, your products will be delivered to the China warehouse and shipped to Bangladesh in 10–15 days by air or 30–40 days by sea. We manage all aspects of LC and customs, so you don’t have to. Shipping charges are only applicable upon product delivery.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="bg-white dark:bg-secondary/20 border border-border/50 rounded-2xl px-6 overflow-hidden shadow-sm hover:shadow-md transition-all data-[state=open]:shadow-md data-[state=open]:border-black/20 dark:data-[state=open]:border-white/20"
          >
            <FAQAccordionTrigger>
              Customer Support
            </FAQAccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] md:text-[15px] pb-6">
              Our dedicated and experienced customer service team is ready to assist you at every step. Whether it’s sourcing, order updates, or after-sales service, we ensure you get a seamless experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="bg-white dark:bg-secondary/20 border border-border/50 rounded-2xl px-6 overflow-hidden shadow-sm hover:shadow-md transition-all data-[state=open]:shadow-md data-[state=open]:border-black/20 dark:data-[state=open]:border-white/20"
          >
            <FAQAccordionTrigger>
              Why Choose Us
            </FAQAccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] md:text-[15px] pb-6">
              Start sourcing from us today and elevate your business to the next level!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  );
};
