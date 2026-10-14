import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createReservationCheckout } from "@/lib/checkout.functions";

export type ReservationCheckoutProps = {
  base: number;
  gratuity: number;
  fee: number;
  greetMeet: number;
  extraPickups: number;
  description: string;
  customerName: string;
  customerEmail: string;
  bookingNumber: string;
};

export function ReservationCheckout(props: ReservationCheckoutProps) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createReservationCheckout({
      data: {
        ...props,
        origin: window.location.origin,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("The payment page did not start. Please try again.");
    return result.clientSecret;
  };

  return (
    <div id="reservation-checkout" style={{ marginTop: 16 }}>
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
