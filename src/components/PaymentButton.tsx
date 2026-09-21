import React from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";

export function PaymentButton() {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Safely access publishable key without throwing undefined errors
      const meta = import.meta as any;
      const publishableKey = meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

      if (!publishableKey || publishableKey === "pk_test_..." || publishableKey === "MY_STRIPE_PUBLISHABLE_KEY") {
        alert("Stripe is not configured yet. Please configure VITE_STRIPE_PUBLISHABLE_KEY in Settings to enable live payments.");
        return;
      }

      const stripe = await loadStripe(publishableKey);
      if (!stripe) {
        alert("Unable to initialize Stripe client. Please verify your network and credentials.");
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const session = await response.json();

      if (session.error) {
        alert(`Payment session notice: ${session.error}`);
        return;
      }

      if (session.url) {
        window.location.href = session.url;
      } else if (session.id) {
        (stripe as any).redirectToCheckout({ sessionId: session.id });
      }
    } catch (err: any) {
      console.log("[Stripe] Payment handling info:", err?.message || err);
      alert("Payment checkout is currently unavailable. Please verify Stripe configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="btn-secure-payment"
      onClick={handlePayment}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 bg-[#6366f1] text-white rounded hover:bg-[#4f46e5] disabled:opacity-60 transition-colors font-mono text-xs shadow-sm border border-white/10"
    >
      <CreditCard className="w-3.5 h-3.5" />
      {loading ? "Connecting..." : "Secure Payment"}
    </button>
  );
}
