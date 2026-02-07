export async function handleApiError(
  res: Response,
  defaultMessage: string,
): Promise<never> {
  let message = defaultMessage;
  try {
    const errorData = await res.json();
    if (errorData && errorData.message) {
      message = errorData.message;
    }
  } catch (e) {
    // Si no se puede parsear el JSON, usamos el mensaje por defecto
    console.warn("No se pudo parsear el error del backend", e);
  }
  throw new Error(message);
}
