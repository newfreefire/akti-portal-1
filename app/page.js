'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
} from 'react-icons/fa';
import VideoBackground from '@/components/BackgroundVideo';
import MouseGlow from '@/components/MouseGlow';
import { useAuthToken } from '@/lib/useAuthToken';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { setAuthToken, isAuthenticated, isAdmin, isCSR } = useAuthToken();
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        router.push('/admin/dashboard');
      } else if (isCSR()) {
        router.push('/csr/csr-dashboard');
      }
    }
  }, [router]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Use our custom hook to store authentication data
        const userRole = data.isAdmin ? 'admin' : (data.isCSR ? 'csr' : 'user');
        setAuthToken(data.token, data.userId, userRole);
        console.log('Login successful:', data);
        
        // Redirect based on the server response
        router.push(data.redirect);
      } else {
        setLoginError(data.message || 'Invalid username or password');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoBackground>
      <MouseGlow />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex rounded-3xl items-center mt-5 justify-center min-h-full">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left Section - Welcome Content */}
                <div className="hidden md:block lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
                  <div className="mb-8 flex items-center justify-center">
                    <img
                      src="/logo.svg"
                      alt="website logo"
                      height={200}
                      width={200}
                    />
                  </div>

                  <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold lg:text-4xl text-center bg-gradient-to-r from-blue-800 to-black text-transparent bg-clip-text mb-4">
                      Welcome Back!
                    </h2>
                    <p className="text-md text-center text-gray-600 font-medium">
                      Access your Attendance Management Portal
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                        <FaBolt className="text-blue-600 text-2xl transition-transform duration-300 group-hover:rotate-[25deg] group-hover:scale-110" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        Quick Attendance
                      </h3>
                      <p className="text-sm text-gray-500 text-center">
                        Mark and review in seconds
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-green-200 transition-colors duration-300">
                        <FaShieldAlt className="text-green-600 text-2xl transition-transform duration-300 group-hover:rotate-[25deg] group-hover:scale-110" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        Secure & Reliable
                      </h3>
                      <p className="text-sm text-gray-500 text-center">
                        Role-based access
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors duration-300">
                        <FaCheckCircle className="text-purple-600 text-2xl transition-transform duration-300 group-hover:rotate-[25deg] group-hover:scale-110" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        Smart Reports
                      </h3>
                      <p className="text-sm text-gray-500 text-center">
                        Export detailed history
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="lg:w-1/2 bg-[#0a0e26] p-8 lg:p-12 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Sign In
                      </h2>
                      <p className="text-gray-400 font-medium">
                        Use your admin or trainer credentials
                      </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                      {/* Username Field */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="Username"
                          className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 
                                 focus:outline-none focus:shadow-[0_0_15px_rgba(59,130,246,0.6)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-800/70
                                 transition-all duration-300"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Password"
                          className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.6)]
                                 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-800/70
                                 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
                          )}
                        </button>
                      </div>

                      {/* Error Message */}
                      {loginError && (
                        <div className="bg-red-500 text-white p-3 rounded-md text-sm mb-4">
                          {loginError}
                        </div>
                      )}
                      
                      {/* Remember Me */}
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all duration-300 mr-3 flex items-center justify-center ${
                              rememberMe
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            {rememberMe && (
                              <FaCheckCircle className="text-white text-xs" />
                            )}
                          </div>
                          <span className="text-gray-300 font-medium">
                            Remember me
                          </span>
                        </label>
                      </div>

                      {/* Sign In Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-800 to-black text-white font-semibold py-4 px-6 rounded-xl
                               hover:shadow-[0_0_30px_rgba(148,163,184,0.7)] focus:outline-none focus:ring-2 focus:ring-blue-500/50
                               transform hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-70"
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                        {!loading && (
                          <svg
                            className="ml-2 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        )}
                      </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                      <div className="text-gray-400 font-medium mb-4">
                        Attendance Portal
                      </div>
                      <div className="flex justify-center space-x-6 text-sm">
                        <div className="flex items-center text-green-400">
                          <FaShieldAlt className="mr-1" />
                          Secure
                        </div>
                        <div className="flex items-center text-blue-400">
                          <FaBolt className="mr-1" />
                          Fast
                        </div>
                        <div className="flex items-center text-purple-400">
                          <FaCheckCircle className="mr-1" />
                          Reliable
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer w-full text-center mt-10 text-sm text-gray-500">
            &copy; Attendance Portal
          </div>
        </div>
      </div>
    </VideoBackground>
  );
}
