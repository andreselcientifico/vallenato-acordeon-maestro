import { useState, useCallback } from "react";

export interface ErrorInfo {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  code?: number;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const handleError = useCallback((error: any, customMessage?: string) => {
    console.error('Error handled:', error);

    let errorInfo: ErrorInfo;

    // Si es un error HTTP con respuesta
    if (error?.status) {
      errorInfo = getHttpErrorInfo(error.status, error.message || customMessage);
    }
    // Si es un error de fetch/response
    else if (error?.message) {
      errorInfo = {
        title: 'Error',
        message: customMessage || error.message,
        type: 'error'
      };
    }
    // Error genérico
    else {
      errorInfo = {
        title: 'Error inesperado',
        message: customMessage || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
        type: 'error'
      };
    }

    setError(errorInfo);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};

const getHttpErrorInfo = (status: number, message?: string): ErrorInfo => {
  switch (status) {
    case 400:
      return {
        title: 'Datos inválidos',
        message: message || 'Los datos proporcionados no son válidos. Por favor, verifica la información.',
        type: 'warning',
        code: 400
      };
    case 401:
      return {
        title: 'No autorizado',
        message: message || 'Debes iniciar sesión para realizar esta acción.',
        type: 'warning',
        code: 401
      };
    case 403:
      return {
        title: 'Acceso denegado',
        message: message || 'No tienes permisos para realizar esta acción.',
        type: 'error',
        code: 403
      };
    case 404:
      return {
        title: 'No encontrado',
        message: message || 'El recurso solicitado no fue encontrado.',
        type: 'warning',
        code: 404
      };
    case 409:
      return {
        title: 'Conflicto',
        message: message || 'Ya existe un registro con estos datos.',
        type: 'warning',
        code: 409
      };
    case 422:
      return {
        title: 'Datos inválidos',
        message: message || 'Los datos proporcionados no cumplen con los requisitos.',
        type: 'warning',
        code: 422
      };
    case 429:
      return {
        title: 'Demasiadas solicitudes',
        message: message || 'Has realizado demasiadas solicitudes. Por favor, espera un momento.',
        type: 'warning',
        code: 429
      };
    case 500:
      return {
        title: 'Error del servidor',
        message: message || 'Ha ocurrido un error en el servidor. Por favor, inténtalo más tarde.',
        type: 'error',
        code: 500
      };
    default:
      return {
        title: 'Error',
        message: message || `Ha ocurrido un error (${status}). Por favor, inténtalo de nuevo.`,
        type: 'error',
        code: status
      };
  }
};