import { PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/api/subscriptions";

interface PaypalSubscriptionProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

function PaypalSubscription({ plan, onClose, onSuccess }: PaypalSubscriptionProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 my-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Suscribirse a {plan.name}
        </h2>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Plan: {plan.name}
          </p>
          <p className="text-2xl font-bold text-primary mb-2">
            ${plan.price} / {plan.duration_months} {plan.duration_months === 1 ? 'mes' : 'meses'}
          </p>
          <div className="text-sm space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <PayPalButtons
          style={{ layout: "vertical", height: 40 }}
          createSubscription={async (data, actions) => {
            const res = await fetch(
              `${API_URL}/api/subscriptions/create`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  plan_id: plan.paypal_plan_id,
                }),
              }
            );

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Error al crear la suscripción");
            }

            const subscriptionData = await res.json();
            return subscriptionData.id;
          }}
          onApprove={async (data, actions) => {
            // Verificar la suscripción en el backend
            const res = await fetch(
              `${API_URL}/api/subscriptions/verify/${data.subscriptionID}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );

            const verificationData = await res.json();

            if (verificationData.status === "ACTIVE") {
              toast.success(`¡Suscripción a ${plan.name} activada!`);
              onSuccess();
            } else {
              toast.error("La suscripción no se pudo activar");
            }
          }}
          onCancel={onClose}
          onError={(err) => {
            console.error("PayPal subscription error:", err);
            toast.error("Error durante la suscripción");
          }}
        />

        <button
          onClick={onClose}
          className="w-full mt-4 border rounded py-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default PaypalSubscription;