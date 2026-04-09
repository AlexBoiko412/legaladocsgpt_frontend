'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('ErrorBoundary caught an error:', error, info.componentStack);
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 text-sm mb-4">
                        An unexpected error occurred. Please refresh the page.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
