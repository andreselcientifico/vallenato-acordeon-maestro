import { useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorInfo } from "@/hooks/useErrorHandler";

interface ErrorAlertProps {
  error: ErrorInfo | null;
  onClose: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const ErrorAlert = ({ error, onClose, autoHide = true, autoHideDelay = 5000 }: ErrorAlertProps) => {
  useEffect(() => {
    if (error && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [error, autoHide, autoHideDelay, onClose]);

  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (error.type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'destructive';
    }
  };

  const getClassName = () => {
    switch (error.type) {
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      default:
        return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
      <Alert className={`w-96 shadow-lg ${getClassName()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-sm font-semibold mb-1">
              {error.title}
              {error.code && (
                <span className="ml-2 text-xs opacity-75">
                  ({error.code})
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {error.message}
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default ErrorAlert;