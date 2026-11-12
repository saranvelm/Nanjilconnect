import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
  Scissors,
  Plus,
  Minus,
  LogOut,
  Store,
  CheckCircle2,
  Clock,
  UserCheck,
  X,
  Heart,
  PauseCircle,
  PlayCircle,
  Users,
  UserPlus,
  ArrowUp,
  ArrowDown,
  BellRing
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(user) {
    setLoading(true);
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    if (!data && user.user_metadata?.role) {
      const { data: created } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          full_name: user.user_metadata.full_name || 'User',
          role: user.user_metadata.role
        }])
        .select()
        .single();
      data = created;
    }

    setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading SalonRoster...</div>;
  }

  if (!session) {
    return <AuthScreen onProfileCreated={(newProfile) => setProfile(newProfile)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">
              salon<span className="text-blue-600">roster</span> <span className="text-xs font-normal text-slate-400">v1.3</span>
            </h1>
            <p className="text-xs text-slate-400">Live seats. Zero wait.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700">
            {profile?.role === 'owner' ? 'Salon Owner' : 'Customer'}
          </span>
          <button
            onClick={async () => {
              sessionStorage.setItem('justSignedOut', 'true');
              await supabase.auth.signOut();
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {profile?.role === 'owner' ? (
          <OwnerDashboard user={session.user} profile={profile} />
        ) : (
          <CustomerDashboard user={session.user} profile={profile} />
        )}
      </main>
    </div>
  );
}

/* ---------------- AUTH SCREEN (LOGIN / SIGNUP) ---------------- */
function AuthScreen({ onProfileCreated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const isSignedOut = sessionStorage.getItem('justSignedOut');
    if (isSignedOut) {
      setSuccessMessage('You have been successfully signed out.');
      sessionStorage.removeItem('justSignedOut');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } }
      });
      if (signUpError) return setError(signUpError.message);

      if (data.user) {
        const { data: savedProfile, error: profileError } = await supabase
          .from('profiles')
          .upsert([{ id: data.user.id, full_name: fullName, role }])
          .select()
          .single();

        if (profileError) return setError(profileError.message);
        if (savedProfile && onProfileCreated) onProfileCreated(savedProfile);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Scissors className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold">SalonRoster</h1>
        </div>

        <h2 className="text-lg font-semibold mb-1">{isSignUp ? 'Create an account' : 'Welcome back'}</h2>
        <p className="text-sm text-slate-500 mb-6">
          {isSignUp ? 'Choose whether you are a customer or a salon owner.' : 'Sign in to view or manage live salon seats.'}
        </p>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-xl mb-4 border border-emerald-100">
            ✓ {successMessage}
          </div>
        )}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                  placeholder="e.g., Karthika"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium cursor-pointer ${
                      role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium cursor-pointer ${
                      role === 'owner' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Salon Owner
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition cursor-pointer"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold hover:underline cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ---------------- SALON OWNER DASHBOARD ---------------- */
function OwnerDashboard({ user, profile }) {
  const [salon, setSalon] = useState(null);
  const [queue, setQueue] = useState([]);
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [totalSeats, setTotalSeats] = useState(4);
  const [walkInName, setWalkInName] = useState('');
  const [walkInSeats, setWalkInSeats] = useState(1);

  useEffect(() => {
    fetchMySalon();
  }, []);

  useEffect(() => {
    if (!salon) return;
    fetchQueue(salon.id);

    const channel = supabase
      .channel(`owner-waitlist-${salon.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist', filter: `salon_id=eq.${salon.id}` }, () => {
        fetchQueue(salon.id);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [salon?.id]);

  async function fetchMySalon() {
    const { data } = await supabase.from('salons').select('*').eq('owner_id', user.id).maybeSingle();
    if (data) setSalon(data);
  }

  async function fetchQueue(salonId) {
    const { data } = await supabase
      .from('waitlist')
      .select('*')
      .eq('salon_id', salonId)
      .eq('status', 'waiting')
      .order('created_at', { ascending: true });
    if (data) setQueue(data);
  }

  async function createSalon(e) {
    e.preventDefault();
    const { data } = await supabase
      .from('salons')
      .insert([{
        owner_id: user.id,
        name: shopName,
        address,
        total_seats: Number(totalSeats),
        occupied_seats: 0,
        booking_paused: false
      }])
      .select()
      .single();
    if (data) setSalon(data);
  }

  async function addWalkInCustomer(e) {
    e.preventDefault();
    const trimmedName = walkInName.trim();
    if (!trimmedName) return;

    const { error } = await supabase.from('waitlist').insert([
      {
        salon_id: salon.id,
        customer_id: user.id,
        customer_name: trimmedName,
        seats_count: walkInSeats,
        status: 'waiting'
      }
    ]);

    if (error) {
      alert('Could not add walk-in customer: ' + error.message);
      return;
    }

    setWalkInName('');
    setWalkInSeats(1);
    fetchQueue(salon.id);
  }

  async function updateOccupied(delta) {
    const nextOccupied = Math.min(salon.total_seats, Math.max(0, salon.occupied_seats + delta));
    setSalon({ ...salon, occupied_seats: nextOccupied });
    await supabase
      .from('salons')
      .update({ occupied_seats: nextOccupied, updated_at: new Date().toISOString() })
      .eq('id', salon.id);
  }

  async function seatCustomerFromWaitlist(entry) {
    const seatsNeeded = entry.seats_count || 1;
    await supabase.from('waitlist').update({ status: 'seated' }).eq('id', entry.id);
    if (salon.occupied_seats < salon.total_seats) {
      await updateOccupied(seatsNeeded);
    }
  }

  async function swapQueuePositions(indexA, indexB) {
    if (indexA < 0 || indexB < 0 || indexA >= queue.length || indexB >= queue.length) return;

    const itemA = queue[indexA];
    const itemB = queue[indexB];

    // Optimistic UI swap
    const updatedQueue = [...queue];
    updatedQueue[indexA] = { ...itemB, created_at: itemA.created_at };
    updatedQueue[indexB] = { ...itemA, created_at: itemB.created_at };
    setQueue(updatedQueue);

    // Swap timestamps in database to persist new queue order
    await Promise.all([
      supabase.from('waitlist').update({ created_at: itemB.created_at }).eq('id', itemA.id),
      supabase.from('waitlist').update({ created_at: itemA.created_at }).eq('id', itemB.id)
    ]);

    fetchQueue(salon.id);
  }

  async function removeFromWaitlist(entryId) {
    await supabase.from('waitlist').update({ status: 'cancelled' }).eq('id', entryId);
  }

  async function toggleOpenStatus() {
    const nextStatus = !salon.is_open;
    setSalon({ ...salon, is_open: nextStatus });
    await supabase.from('salons').update({ is_open: nextStatus }).eq('id', salon.id);
  }

  async function togglePauseBookings() {
    const nextPaused = !salon.booking_paused;
    setSalon({ ...salon, booking_paused: nextPaused });
    await supabase.from('salons').update({ booking_paused: nextPaused }).eq('id', salon.id);
  }

  if (!salon) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">Register Your Salon</h2>
        <p className="text-sm text-slate-500 mb-6">Set up your shop details so customers can see your live seat availability.</p>
        <form onSubmit={createSalon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Salon Name</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              placeholder="e.g., Royal Cuts & Spa"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Location / Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              placeholder="e.g., Main Road, Nagercoil"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Total Styling Chairs</label>
            <input
              type="number"
              min="1"
              max="30"
              required
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer">
            Go Live Now
          </button>
        </form>
      </div>
    );
  }

  const availableSeats = salon.total_seats - salon.occupied_seats;
  const totalQueuedSeats = queue.reduce((sum, entry) => sum + (entry.seats_count || 1), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Owner Control Panel</span>
          <h2 className="text-2xl font-bold mt-1">{salon.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Good day, {profile?.full_name || 'Owner'} • {salon.address}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {salon.is_open && (
            <button
              onClick={togglePauseBookings}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                salon.booking_paused
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {salon.booking_paused ? (
                <>
                  <PlayCircle className="w-4 h-4" /> Resume Waitlist
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4" /> Pause Waitlist
                </>
              )}
            </button>
          )}

          <button
            onClick={toggleOpenStatus}
            className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
              salon.is_open ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {salon.is_open ? '● Shop Open' : '● Shop Closed'}
          </button>
        </div>
      </div>

      {salon.is_open && salon.booking_paused && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-3.5 flex items-center justify-between text-sm">
          <span>
            <strong>Waitlist Paused:</strong> New customers cannot join the online queue until you resume bookings.
          </span>
          <button
            onClick={togglePauseBookings}
            className="text-xs font-bold uppercase tracking-wider text-amber-900 underline ml-4 cursor-pointer"
          >
            Resume Now
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Occupancy</p>
        <div className="my-4 flex items-baseline justify-center gap-2">
          <span className="text-5xl font-extrabold text-slate-900">{salon.occupied_seats}</span>
          <span className="text-xl text-slate-400 font-medium">/ {salon.total_seats} chairs occupied</span>
        </div>
        <p className="text-sm font-medium text-blue-600 mb-8">
          {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} currently available for walk-ins
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => updateOccupied(-1)}
            disabled={salon.occupied_seats === 0}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-base transition cursor-pointer"
          >
            <Minus className="w-5 h-5" /> Customer Finished
          </button>

          <button
            onClick={() => updateOccupied(1)}
            disabled={salon.occupied_seats === salon.total_seats}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-base transition cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Seat Walk-In
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">Walk-In Waitlist</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {queue.length} {queue.length === 1 ? 'party' : 'parties'} ({totalQueuedSeats} {totalQueuedSeats === 1 ? 'seat' : 'seats'})
            </span>
          </div>
        </div>

        {/* Manual Walk-In Customer Entry Form */}
        <form onSubmit={addWalkInCustomer} className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1">
            <input
              type="text"
              required
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              placeholder="Enter walk-in customer name..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setWalkInSeats((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Decrease seats"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold text-slate-800 whitespace-nowrap">
                {walkInSeats} {walkInSeats === 1 ? 'Seat' : 'Seats'}
              </span>
              <button
                type="button"
                onClick={() => setWalkInSeats((prev) => Math.min(salon.total_seats, prev + 1))}
                className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Increase seats"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add to Queue
            </button>
          </div>
        </form>

        {queue.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No customers waiting in the digital queue right now.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {queue.map((entry, idx) => {
              const seatsRequested = entry.seats_count || 1;
              const isManualWalkIn = entry.customer_id === user.id;

              return (
                <div key={entry.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-900">{entry.customer_name}</p>
                        {isManualWalkIn ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            Walk-In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            Online
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          <Users className="w-3 h-3" /> {seatsRequested} {seatsRequested === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Joined at {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5">
                    {/* Queue Swap Controls */}
                    {queue.length > 1 && (
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden mr-1">
                        <button
                          type="button"
                          onClick={() => swapQueuePositions(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move up in queue"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => swapQueuePositions(idx, idx + 1)}
                          disabled={idx === queue.length - 1}
                          className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent border-l border-slate-200 cursor-pointer"
                          title="Move down in queue"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => seatCustomerFromWaitlist(entry)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Seat Now
                    </button>
                    <button
                      onClick={() => removeFromWaitlist(entry.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer"
                      title="Cancel entry"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- CUSTOMER LIVE DIRECTORY, FAVORITES & WAITLIST ---------------- */
function CustomerDashboard({ user, profile }) {
  const [salons, setSalons] = useState([]);
  const [waitlists, setWaitlists] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filterTab, setFilterTab] = useState('all'); // 'all' or 'favorites'
  const [seatedAlertSalon, setSeatedAlertSalon] = useState(null);
  const [selectedSeatsBySalon, setSelectedSeatsBySalon] = useState({});

  useEffect(() => {
    fetchData();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const salonChannel = supabase
      .channel('live-salons-and-waitlist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'salons' }, () => fetchData())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'waitlist' }, (payload) => {
        if (payload.new?.customer_id === user.id && payload.new?.status === 'seated') {
          triggerTurnNotification(payload.new.salon_id);
        }
        fetchData();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(salonChannel);
    };
  }, [user.id]);

  async function triggerTurnNotification(salonId) {
    const { data: salonData } = await supabase.from('salons').select('name').eq('id', salonId).maybeSingle();
    const shopName = salonData?.name || 'the salon';
    setSeatedAlertSalon(shopName);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("It's Your Turn!", {
        body: `Your chair is ready at ${shopName}. Please head inside now!`
      });
    }
  }

  async function fetchData() {
    const [{ data: salonsData }, { data: waitlistData }, { data: favData }] = await Promise.all([
      supabase.from('salons').select('*').order('name'),
      supabase.from('waitlist').select('*').eq('status', 'waiting').order('created_at', { ascending: true }),
      supabase.from('favorites').select('salon_id').eq('customer_id', user.id)
    ]);
    if (salonsData) setSalons(salonsData);
    if (waitlistData) setWaitlists(waitlistData);
    if (favData) setFavoriteIds(favData.map((f) => f.salon_id));
  }

  function getSelectedSeats(salonId) {
    return selectedSeatsBySalon[salonId] || 1;
  }

  function adjustSelectedSeats(salonId, delta, maxSeats) {
    const current = getSelectedSeats(salonId);
    const next = Math.min(Math.max(1, maxSeats), Math.max(1, current + delta));
    setSelectedSeatsBySalon((prev) => ({ ...prev, [salonId]: next }));
  }

  async function toggleFavorite(salonId) {
    const isFav = favoriteIds.includes(salonId);

    await supabase.from('profiles').upsert([
      {
        id: user.id,
        full_name: profile?.full_name || user.email?.split('@')[0] || 'Walk-in Guest',
        role: 'customer'
      }
    ]);

    if (isFav) {
      setFavoriteIds((prev) => prev.filter((id) => id !== salonId));
      await supabase.from('favorites').delete().eq('customer_id', user.id).eq('salon_id', salonId);
    } else {
      setFavoriteIds((prev) => [...prev, salonId]);
      await supabase.from('favorites').insert([{ customer_id: user.id, salon_id: salonId }]);
    }
  }

  async function joinWaitlist(salon) {
    if (salon.booking_paused) return;
    setSeatedAlertSalon(null);

    const seatsCount = getSelectedSeats(salon.id);

    await supabase.from('profiles').upsert([
      {
        id: user.id,
        full_name: profile?.full_name || user.email?.split('@')[0] || 'Walk-in Guest',
        role: 'customer'
      }
    ]);

    const { error } = await supabase.from('waitlist').insert([
      {
        salon_id: salon.id,
        customer_id: user.id,
        customer_name: profile?.full_name || user.email?.split('@')[0] || 'Walk-in Guest',
        seats_count: seatsCount,
        status: 'waiting'
      }
    ]);

    if (error) {
      alert('Could not join waitlist: ' + error.message);
      return;
    }

    fetchData();
  }

  async function leaveWaitlist(entryId) {
    await supabase.from('waitlist').update({ status: 'cancelled' }).eq('id', entryId);
    fetchData();
  }

  const myActiveEntry = waitlists.find((w) => w.customer_id === user.id);
  const mySalon = myActiveEntry ? salons.find((s) => s.id === myActiveEntry.salon_id) : null;
  const myPosition = myActiveEntry
    ? waitlists.filter((w) => w.salon_id === myActiveEntry.salon_id).findIndex((w) => w.id === myActiveEntry.id) + 1
    : 0;

  const displayedSalons = salons
    .filter((s) => (filterTab === 'favorites' ? favoriteIds.includes(s.id) : true))
    .sort((a, b) => {
      const aFav = favoriteIds.includes(a.id) ? 1 : 0;
      const bFav = favoriteIds.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });

  return (
    <div className="space-y-6">
      {/* "It's Your Turn!" Live Alert Banner */}
      {seatedAlertSalon && (
        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md flex items-center justify-between animate-pulse">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Chair Ready</span>
            <h3 className="text-xl font-bold mt-1">It's Your Turn at {seatedAlertSalon}!</h3>
            <p className="text-sm text-emerald-50 mt-0.5">
              The salon owner is ready for you now. Please head to your chair.
            </p>
          </div>
          <button
            onClick={() => setSeatedAlertSalon(null)}
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      )}

      {/* Position #1 "Step Into Salon" Alert Banner */}
      {myActiveEntry && mySalon && myPosition === 1 && (
        <div className="bg-amber-500 text-white rounded-2xl p-5 shadow-md flex items-center gap-3.5">
          <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">You Are Next (#1)</span>
            <h3 className="text-lg font-bold leading-snug">Please step into {mySalon.name} — your turn will be soon!</h3>
            <p className="text-xs text-amber-50 mt-0.5">
              Make sure you are inside the shop so you don't miss your chair when called.
            </p>
          </div>
        </div>
      )}

      {/* Pinned "You Are In Line" Card */}
      {myActiveEntry && mySalon && (
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">You Are In Line</span>
            <h3 className="text-xl font-bold mt-1">{mySalon.name}</h3>
            <p className="text-sm text-blue-100 mt-0.5">
              Position: <strong className="text-white">#{myPosition} in queue</strong> •{' '}
              <strong className="text-white">
                {myActiveEntry.seats_count || 1} {(myActiveEntry.seats_count || 1) === 1 ? 'seat' : 'seats'}
              </strong>{' '}
              • Est. wait ~{myPosition * 15} mins
            </p>
          </div>
          <button
            onClick={() => leaveWaitlist(myActiveEntry.id)}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Leave Line
          </button>
        </div>
      )}

      {/* Header Card with Filter Tabs (Favorites on Left, All Salons on Right) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Live Availability</span>
          <h2 className="text-2xl font-bold mt-1">Today's Salon Occupancy</h2>
          <p className="text-sm text-slate-500 mt-0.5">Good day, {profile?.full_name || 'Guest'} • Pin your favorite salons for quick access</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('favorites')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              filterTab === 'favorites' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterTab === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
            Favorites ({favoriteIds.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Salons ({salons.length})
          </button>
        </div>
      </div>

      {/* Salons List */}
      <div className="space-y-3">
        {displayedSalons.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
            {filterTab === 'favorites'
              ? 'No favorite salons yet. Tap the heart icon on any salon card to save it here!'
              : 'No salons registered yet. Sign up as a Salon Owner to add the first shop!'}
          </div>
        ) : (
          displayedSalons.map((salon) => {
            const available = salon.total_seats - salon.occupied_seats;
            const salonQueue = waitlists.filter((w) => w.salon_id === salon.id);
            const salonQueueCount = salonQueue.length;
            const isFull = available === 0 || !salon.is_open;
            const isPaused = Boolean(salon.booking_paused);
            const isAlreadyHere = myActiveEntry?.salon_id === salon.id;
            const isFavorite = favoriteIds.includes(salon.id);
            const selectedSeats = getSelectedSeats(salon.id);
            const maxSelectableSeats = Math.min(6, salon.total_seats || 4);

            return (
              <div
                key={salon.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  isFavorite ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isFull ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base">{salon.name}</h3>
                      {!salon.is_open ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Closed</span>
                      ) : isPaused ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                          <PauseCircle className="w-3 h-3" /> Waitlist Paused
                        </span>
                      ) : available > 0 ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Open Seats
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Full
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{salon.address}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      {salonQueueCount} {salonQueueCount === 1 ? 'party' : 'parties'} in walk-in waitlist
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="sm:text-right mr-1">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {salon.is_open ? available : 0}{' '}
                      <span className="text-sm font-normal text-slate-400">/ {salon.total_seats}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">seats free</p>
                  </div>

                  {/* Favorite Heart Toggle Button */}
                  <button
                    onClick={() => toggleFavorite(salon.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  {salon.is_open && (
                    <div className="flex items-center gap-2">
                      {/* Multi-Seat Selector */}
                      {!myActiveEntry && !isPaused && (
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => adjustSelectedSeats(salon.id, -1, maxSelectableSeats)}
                            disabled={selectedSeats <= 1}
                            className="p-2 text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer"
                            title="Decrease seats"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 whitespace-nowrap">
                            {selectedSeats} {selectedSeats === 1 ? 'seat' : 'seats'}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustSelectedSeats(salon.id, 1, maxSelectableSeats)}
                            disabled={selectedSeats >= maxSelectableSeats}
                            className="p-2 text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer"
                            title="Increase seats"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => joinWaitlist(salon)}
                        disabled={Boolean(myActiveEntry) || isPaused}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isAlreadyHere
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPaused
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white'
                        }`}
                      >
                        {isAlreadyHere ? 'In Line' : isPaused ? 'Paused' : 'Join Waitlist'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
