import type { Metadata } from "next"

import { OrderRecovery } from "@/features/store/components/order-recovery"

export const metadata: Metadata = {
  title: "Recover order",
  description:
    "Request a single-use recovery link or redeem your emailed link to view delivered credentials.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RecoverOrderPage() {
  return <OrderRecovery />
}
