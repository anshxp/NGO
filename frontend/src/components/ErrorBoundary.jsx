import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-4", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-red-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 mb-6", children: "We encountered an unexpected error. Please try reloading the page." }), this.state.error && (_jsx("div", { className: "bg-gray-100 p-4 rounded text-left overflow-auto max-h-40 mb-6 text-xs font-mono text-red-800", children: this.state.error.toString() })), _jsxs("div", { className: "flex gap-4 justify-center", children: [_jsx(Button, { onClick: () => window.location.href = '/', variant: "outline", children: "Go Home" }), _jsx(Button, { onClick: () => window.location.reload(), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Reload Page" })] })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
