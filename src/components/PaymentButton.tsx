import React from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";

export function PaymentButton() {
  const handlePayment = async () => {
    const env = import.meta as any;
    const publishableKey = env.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey || publishableKey === "pk_test_...") {
        console.error("Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY.");
        return;
    }

    const stripe = await loadStripe(publishableKey);
    if (!stripe) return;

    const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const session = await response.json();

    if (session.error) {
        console.error(session.error);
        return;
    }

    (stripe as any).redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button
      onClick={handlePayment}
      className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white rounded hover:bg-[#4f46e5] transition-colors font-mono text-xs shadow-sm border border-white/10"
    >
      <CreditCard className="w-3.5 h-3.5" />
      Secure Payment
    </button>
  );
}
