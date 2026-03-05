'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
    const [tab, setTab] = useState<'login' | 'signup'>('login');

    // Login state
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    // Signup state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await signIn('credentials', {
                redirect: false,
                identifier,
                password,
            });
            if (res?.error) {
                setError('Invalid credentials. Check your username and password.');
            } else {
                onSuccess();
            }
        } catch (e) {
            setError('Connection error. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('https://perl-production.up.railway.app/api/auth/local/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password: signupPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error?.message || 'Registration failed.');
            } else {
                // Auto-login after signup
                const loginRes = await signIn('credentials', {
                    redirect: false,
                    identifier: username,
                    password: signupPassword,
                });
                if (loginRes?.error) {
                    setError('Registered but login failed. Try logging in manually.');
                } else {
                    onSuccess();
                }
            }
        } catch (e) {
            setError('Connection error. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md bg-[#0f172a] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-black text-xl uppercase tracking-tight">
                            {tab === 'login' ? 'Access Terminal' : 'Join the Network'}
                        </h2>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">
                            {tab === 'login' ? 'Authenticate to upvote' : 'Create your operative identity'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-white font-black text-xs uppercase tracking-widest border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        ✕ Close
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => { setTab('login'); setError(''); }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                            tab === 'login'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                                : 'text-gray-600 hover:text-gray-400'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setTab('signup'); setError(''); }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                            tab === 'signup'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                                : 'text-gray-600 hover:text-gray-400'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-black uppercase tracking-widest mb-5 text-center">
                            ⚠ {error}
                        </div>
                    )}

                    {tab === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Username or Email
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="operative_name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-lg uppercase text-xs tracking-widest transition-all shadow-lg disabled:opacity-50 active:scale-95 mt-2"
                            >
                                {isLoading ? 'Authenticating...' : 'Authenticate →'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Operative Handle
                                </label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="choose_your_alias"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Secure Channel (Email)
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operative@network.io"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Encryption Key (Password)
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    placeholder="min 6 characters"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-lg uppercase text-xs tracking-widest transition-all shadow-lg disabled:opacity-50 active:scale-95 mt-2"
                            >
                                {isLoading ? 'Registering...' : 'Join the Network →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}