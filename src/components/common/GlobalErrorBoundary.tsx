import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ResQ Grid Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F9FF] text-slate-900 flex items-center justify-center p-6">
          <div className="max-w-xl w-full resq-card p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#EF4444] text-[#EF4444] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Something went wrong
            </h1>

            <p className="text-lg text-slate-700 leading-relaxed">
              Please reload the page to continue checking Chennai flood alerts and safe routes.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="btn-main inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reload page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
