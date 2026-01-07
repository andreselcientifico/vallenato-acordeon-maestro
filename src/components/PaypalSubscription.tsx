import { PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/api/subscriptions";
import { Check, X } from "lucide-react";

interface PaypalSubscriptionProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

 /**
   * Devuelve true si la feature es negativa
   */
  function isNegativeFeature(feature: string): boolean {
    return feature.startsWith("!");
  }

  /**
   * Devuelve el texto limpio para mostrar
   */
  function displayFeature(feature: string): string {
    return feature.replace(/^!/, "");
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
            {plan.features.map((feature, index) => {
              const negative = isNegativeFeature(feature);

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 ${
                    negative ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {negative ? (
                    <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}

                  <span className="text-sm">
                    {displayFeature(feature)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <PayPalButtons
          style={{ layout: "vertical", height: 40 }}

          createSubscription={(data, actions) => {
            if (!plan.paypal_plan_id) {
              throw new Error("El plan no tiene paypal_plan_id");
            }

            return actions.subscription.create({
              plan_id: plan.paypal_plan_id,
            });
          }}

          onApprove={async (data) => {
            // AQUÍ sí existe data.subscriptionID
            const res = await fetch(
              `${API_URL}/api/paypal/subscription/${data.subscriptionID}`,
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