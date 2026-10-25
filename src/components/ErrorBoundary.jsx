import React from 'react';

/**
 * Top-level React Error Boundary for TVK ERA.
 * Catches JavaScript errors anywhere in child component trees,
 * logs the error, and displays a user-friendly recovery UI in Tamil & English.
 * Prevents the application from crashing to a blank white screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TVK ERA Application Error Caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center font-sans antialiased">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-amber-300 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#EF4444] flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
              ⚠️
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                பயன்பாட்டில் சிறு கோளாறு / Something went wrong
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                செயலியை புதுப்பிக்க கீழே உள்ள பொத்தானை அழுத்தவும் (Please reload the application).
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full h-11 rounded-xl bg-[#EF4444] hover:bg-red-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔄</span>
                <span>பக்கத்தை புதுப்பிக்கவும் (Reload App)</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetStorage}
                className="w-full h-10 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                தரவை மீட்டமைத்து தொடங்கவும் (Reset Data)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
