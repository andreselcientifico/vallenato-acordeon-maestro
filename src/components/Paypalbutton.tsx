import { PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL } from "@/config/api";
import { toast } from "sonner";

interface PaypalCheckoutProps {
  course: {
    id: string;
    title: string;
    price: number;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

function PaypalCheckout({ course, onClose, onSuccess }: PaypalCheckoutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 my-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Comprar {course.title}
        </h2>

        <PayPalButtons
          style={{ layout: "vertical", height: 40 }}

          createOrder={async () => {
            const res = await fetch(
              `${API_URL}/api/courses/${course.id}/createorder`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );
            if (!res.ok) {
              const errorData = await res.json();
              console.error("Error data:", errorData);
              throw new Error(errorData.message || "Error al crear la orden");
            }

            const data = await res.json();

            // Asegúrate de que el campo 'id' esté presente en la respuesta
            if (!data.id) {
              throw new Error("No se recibió un ID de orden válido");
            }

            return data.id;
          }}

          onApprove={async (data, actions) => {
            if (!actions) return;

            const res = await fetch(
              `${API_URL}/api/paypal/capture/${data.orderID}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );

            const captureData = await res.json();

            if (captureData.status === "COMPLETED") {
              toast.success(`Pago exitoso: ${course.title}`);
              onSuccess?.(); // Llamar a onSuccess si existe
              onClose(); // 👈 CERRAR PAYPAL AQUÍ
            } else {
              toast.error("El pago no se completó");
            }
          }}

          onCancel={onClose}
          onError={(err) => {
            console.error("PayPal error:", err);
            toast.error("Error durante el pago");
          }}
        />

        <button
          onClick={onClose}
          className="w-full mt-4 border rounded py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default PaypalCheckout;
