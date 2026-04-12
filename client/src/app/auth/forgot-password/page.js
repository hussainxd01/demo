"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, Lock, Loader, ArrowLeft, Eye, EyeOff } from "lucide-react";
import authService from "@/lib/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(`An OTP has been sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please write a valid email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      // Data may be nested depending on apiClient implementation
      const data = response?.data ?? response; 
      
      if (data.accessToken && data.refreshToken) {
        // Log the user in with their new password automatically assuming apiClient handled it
        if (login && data.user) {
          await login(data.user);
        }
      }
      
      setSuccess("Password has been successfully reset! Redirecting...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Failed to reset password. The OTP might be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        
        <div className="mb-6">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? "Enter your email address and we'll send you a 6-digit OTP to reset your password."
              : "Enter the OTP sent to your email and your new password."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors tracking-widest font-mono text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success.includes("Redirecting")}
              className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
            
            <div className="text-center mt-4">
               <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-black hover:underline"
               >
                 Didn't receive the OTP? Try again.
               </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
