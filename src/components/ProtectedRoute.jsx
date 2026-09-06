import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-3">
        <RefreshCw className="w-8 h-8 text-sienna-600 animate-spin" />
        <span className="text-xs text-stone-500 font-medium">Validating security tokens...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-ivory-300 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-sienna-100 text-sienna-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Access Restricted</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Your current persona ({user.role}) is not authorized to view this administrative terminal (SEC-03).
          Switch to an authorized role from the top navigation bar to access.
        </p>
        <div className="pt-2">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sienna-600 text-white font-semibold text-xs hover:bg-sienna-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Commuter Search
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
