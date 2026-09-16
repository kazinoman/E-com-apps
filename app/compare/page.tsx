import type { Metadata } from "next";
import { ComparePage } from "@/features/Compare/ComparePage";

export const metadata: Metadata = {
  title: "Compare Products | Zaag",
  description: "Line up to four products side by side and compare their specs.",
};

/*
 * No server fetch here: the tray is already resolved in app/layout.tsx and
 * handed to CompareProvider, so this page renders the real comparison on the
 * first byte of HTML rather than fetching it again.
 */
export default function Page() {
  return <ComparePage />;
}
