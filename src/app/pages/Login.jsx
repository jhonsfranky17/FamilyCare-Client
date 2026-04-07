import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, joinFamily, createFamily, register } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      
      if (inviteCode && inviteCode.trim().length > 0) {
        await joinFamily(inviteCode.trim());
        alert("Account created and successfully joined the family!");
      } else {
        const result = await createFamily(`${name}'s Family`);
        alert(`Account & Family created! Invite code: ${result.inviteCode || result.family?.familyCode || 'Check Dashboard'}`);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await joinFamily(inviteCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to join family (Are you signed in?)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Left side - Branding */}
          <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <span className="font-semibold text-xl">FamilyCare</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Keep loved ones <span className="text-teal-600">healthy</span>
              <br />
              <span className="text-teal-600">together</span>
            </h1>

            <p className="text-gray-600 mb-8">
              Coordinate medication schedules, track health, and stay connected with your family's care — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-teal-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>HIPAA aware design</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-teal-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Real-time family sync</span>
              </div>
            </div>
          </div>

          {/* Right side - Forms */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">

              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'signin'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                  {activeTab === 'signin' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>

                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'register'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                  {activeTab === 'register' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>

                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'join'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('join')}
                >
                  Join Family
                  {activeTab === 'join' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                  <p className="text-gray-600 mb-6">Sign in to manage your family's health</p>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                  </form>

                  <div className="mt-6">
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Don't have an account or family group yet?
                    </p>

                    <button
                      onClick={() => setActiveTab('register')}
                      disabled={loading}
                      className="w-full border border-teal-600 text-teal-600 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Family Group
                    </button>
                  </div>
                </div>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
                  <p className="text-gray-600 mb-6">Register to create or join a family group</p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invite Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="Leave blank to create new family"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Registering...' : 'Register & Continue →'}
                    </button>
                  </form>
                </div>
              )}

              {/* Join Family Form */}
              {activeTab === 'join' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Join your family</h2>
                  <p className="text-gray-600 mb-6">You must be signed in to join a family. Sign in first, or register above, then come back here if your family already exists.</p>

                  <form onSubmit={handleJoinFamily} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Family Invite Code
                      </label>

                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="ABCD1234"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-xl font-mono tracking-widest"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Joining...' : 'Join Family →'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}