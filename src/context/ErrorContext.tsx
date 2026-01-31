import React, { createContext, useContext, ReactNode } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface ErrorContextType {
  showError: (error: any, customMessage?: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useGlobalError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useGlobalError must be used within ErrorProvider");
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const { error, handleError, clearError } = useErrorHandler();

  const showError = (error: any, customMessage?: string) => {
    handleError(error, customMessage);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorAlert error={error} onClose={clearError} />
    </ErrorContext.Provider>
  );
};