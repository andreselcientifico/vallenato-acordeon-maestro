import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL } from "@/config/api";

function PaypalCheckout({ course }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture", // importante para que PayPal capture el pago al aprobar
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        
        // Se ejecuta cuando el usuario hace clic y se va a crear la orden en tu backend
        createOrder={async () => {
          const res = await fetch(
            `${API_URL}/api/courses/${course.id}/create-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await res.json();
          return data.orderID; // PayPal requiere que devuelvas orderID aquí
        }}

        // Se ejecuta cuando PayPal aprueba el pago
        onApprove={async (data) => {
          // “data.orderID” es enviado por PayPal, y lo pasamos a nuestro backend para capturar el pago
          const res = await fetch(
            `${API_URL}/api/paypal/capture/${data.orderID}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          const captureData = await res.json();
          if (captureData.status === "COMPLETED") {
            // Aquí puedes actualizar tu UI, mostrar mensaje de éxito, etc.
            alert("¡Pago completado con éxito!");
          } else {
            alert("Hubo un error al capturar el pago.");
          }
        }}

        onError={(err) => {
          console.error("PayPal error:", err);
          alert("Ocurrió un error durante el pago.");
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalCheckout;
