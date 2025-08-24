'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, joinSession } from '@/lib/sessions';

export default function Home() {
  const [mode, setMode] = useState<'join' | 'create' | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateSession = async () => {
    if (!code.trim()) {
      setError('Session code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionId = await createSession(code.trim(), password.trim() || undefined);
      router.push(`/session/${sessionId}`);
    } catch (err) {
      setError('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!code.trim()) {
      setError('Session code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionId = await joinSession(code.trim(), password.trim() || undefined);
      if (sessionId) {
        router.push(`/session/${sessionId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join session');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-poker-green mb-2">🎰</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Poker Chips</h2>
          <p className="text-gray-600">Track chips for all players</p>
        </div>

        {!mode ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-poker-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Create New Session
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-poker-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Join Existing Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-poker-green focus:border-transparent"
                  maxLength={6}
                />
                {mode === 'create' && (
                  <button
                    onClick={generateRandomCode}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    type="button"
                  >
                    🎲
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty for no password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-poker-green focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode(null);
                  setCode('');
                  setPassword('');
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={mode === 'create' ? handleCreateSession : handleJoinSession}
                disabled={loading || !code.trim()}
                className="flex-1 bg-poker-green text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : mode === 'create' ? 'Create' : 'Join'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}