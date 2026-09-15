"use client";

import { X, Package, FileText, Truck, Box } from "lucide-react";
import { OrderHistoryEvent, statusLabel } from "@/types/order";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The order's real status transitions, oldest first. */
  history: OrderHistoryEvent[];
  /** "cod" orders never pass through `paid`, so that stage is not shown. */
  paymentMethod: string;
}

/**
 * One row of the detail list, derived from a transition the backend recorded.
 * Nothing is predicted: a stage the order has not reached has no row and no
 * date, because we do not know when — or whether — it will happen.
 */
type TimelineRow = { status: string; date: string; time: string };

export function TrackOrderModal({ isOpen, onClose, history, paymentMethod }: TrackOrderModalProps) {
  if (!isOpen) return null;

  const reached = new Set(history.map((h) => h.toStatus));

  const timeline: TimelineRow[] = history.map((event) => {
    const at = new Date(event.at);
    return {
      status: statusLabel(event.toStatus),
      date: at.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      time: at.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" }),
    };
  });

  // Custom Icon for Delivered (Box with Check)
  const BoxCheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="M16.5 24l2.5-2.5L22.5 24" /> {/* check inside or outside, adapting to generic check */}
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
      <polyline points="16 16 18 18 22 14" />
    </svg>
  );

  // The stages the backend's order machine actually has — no invented
  // "Ready to ship" step that nothing ever sets.
  const steps = [
    { label: "Placed", icon: Package, completed: true },
    ...(paymentMethod === "cod"
      ? []
      : [{ label: "Paid", icon: FileText, completed: reached.has("paid") }]),
    { label: "Confirmed", icon: Box, completed: reached.has("confirmed") },
    { label: "Shipped", icon: Truck, completed: reached.has("shipped") },
    { label: "Delivered", icon: BoxCheckIcon, completed: reached.has("delivered") },
  ];

  // Group timeline by date
  const groupedTimeline = timeline.reduce((acc: Record<string, TimelineRow[]>, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // For the mockup fidelity, let's reverse the dates so newest is on top
  const dates = Object.keys(groupedTimeline).reverse();

  // Find current active status for the top right label
  const activeStatusText = timeline.length ? timeline[timeline.length - 1].status : "Placed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#333333] hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        <div className="p-6 pb-2 text-center">
          <h2 className="text-[17px] font-bold text-[#333333] dark:text-white">Track Order</h2>
        </div>

        <div className="p-6 pt-4">
          {/* Horizontal Timeline Steps */}
          <div className="mb-8">
            <h3 className="text-[14px] font-medium text-[#9FA7CF] text-center mb-6">Order Timeline</h3>
            
            <div className="flex justify-between items-center mb-5 px-1">
              <span className="text-[13px] font-medium text-[#9FA7CF]">Status</span>
              <span className="text-[14px] font-bold text-[#4A85F6]">{activeStatusText}</span>
            </div>

            <div className="flex items-center justify-between relative px-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                  {/* Icon */}
                  <div className={`mb-4 ${
                    step.completed ? "text-[#333333] dark:text-white" : "text-[#9FA7CF]"
                  }`}>
                    <step.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-[52px] left-[60%] w-[80%] border-t-[2px] border-dashed border-[#DEE2F3] -z-10" />
                  )}
                  
                  {/* Checkmark Circle */}
                  <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border-[2px] ${
                    step.completed 
                      ? "bg-[#333333] border-[#333333] text-white" 
                      : "bg-white dark:bg-gray-900 border-[#9FA7CF] text-[#9FA7CF]"
                  }`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-[#F3F4F8] dark:border-gray-800 my-6" />

          {/* Vertical Details */}
          <div>
            <h3 className="text-[14px] font-medium text-[#9FA7CF] text-center mb-6">Order Status Details</h3>
            
            <div className="space-y-6">
              {dates.map((date, dateIndex) => (
                <div key={date}>
                  <div className="text-[13px] font-bold text-[#333333] dark:text-white mb-5">
                    {date}
                  </div>
                  <div className="pl-6 space-y-6">
                    {[...groupedTimeline[date]].reverse().map((event, idx) => {
                      const isLastItemInDate = idx === groupedTimeline[date].length - 1;
                      const isLastDate = dateIndex === dates.length - 1;
                      const showLine = !(isLastItemInDate && isLastDate);

                      return (
                        <div key={idx} className="relative flex justify-between items-start">
                          {/* Vertical dashed line connecting all items */}
                          {showLine && (
                            <div className="absolute left-[-16px] top-[20px] bottom-[-30px] w-0 border-l-[2px] border-dashed border-[#DEE2F3]" />
                          )}
                          
                          {/* Dot */}
                          <div className="absolute left-[-23px] top-[2px] w-[16px] h-[16px] rounded-full flex items-center justify-center z-10 bg-[#333333] text-white">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          
                          <div className="text-[14px] font-semibold text-[#333333] dark:text-white">
                            {event.status}
                          </div>
                          <div className="text-[13px] font-medium text-[#333333] dark:text-white">
                            {event.time}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
