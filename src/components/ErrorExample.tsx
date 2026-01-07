// Ejemplo de uso del sistema de errores global
// Este archivo muestra cómo usar el hook useGlobalError

import { useGlobalError } from "@/context/ErrorContext";

function ExampleComponent() {
  const { showError } = useGlobalError();

  const handleTestError = async () => {
    try {
      // Simular un error HTTP 409 (conflicto)
      const mockError = new Error("A user with this email already exists");
      (mockError as any).status = 409;
      throw mockError;
    } catch (error) {
      // El error se mostrará automáticamente en la UI
      showError(error);
    }
  };

  const handleCustomError = () => {
    // Mostrar un error personalizado
    showError(null, "Esta es una prueba del sistema de errores");
  };

  return (
    <div>
      <button onClick={handleTestError}>
        Probar Error 409 (Usuario ya existe)
      </button>
      <button onClick={handleCustomError}>
        Probar Error Personalizado
      </button>
    </div>
  );
}

export default ExampleComponent;