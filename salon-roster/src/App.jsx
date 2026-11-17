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
  BellRing,
  Search,
  MapPin,
  QrCode,
  Printer,
  Edit3,
  Globe,
  Check,
  Copy,
  Tv,
  Power,
  CheckCircle,
  XCircle,
  Phone,
  Lock,
  User
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    appName: 'SalonRoster',
    tagline: 'Live chairs. Zero wait.',
    signInHeader: 'Welcome back',
    signUpHeader: 'Create an account',
    phone: 'Phone Number',
    password: 'PIN / Password',
    fullName: 'Full Name',
    accountRole: 'I am a...',
    customerRole: 'Customer',
    ownerRole: 'Salon Owner',
    ownerPasscode: 'Owner Admin Passcode',
    signInBtn: 'Sign In',
    signUpBtn: 'Sign Up',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    ownerDashboard: 'Salon Owner Panel',
    registerSalon: 'Register Your Salon',
    salonName: 'Salon Name',
    address: 'Location / Address',
    totalSeats: 'Total Styling Chairs',
    openingTime: 'Opening Time',
    closingTime: 'Closing Time',
    goLive: 'Go Live Now',
    deskQr: 'Desk QR & Display',
    tvView: 'TV Waiting Room View',
    shopOpen: '● Shop Open',
    shopClosed: '● Shop Closed',
    pauseWaitlist: 'Pause Waitlist',
    resumeWaitlist: 'Resume Waitlist',
    liveOccupancy: 'Live Occupancy',
    chairsOccupied: 'chairs occupied',
    seatsAvailable: 'chairs currently available for walk-ins',
    walkInCustomerName: 'Walk-In Customer Name',
    customerNamePlaceholder: 'Customer name',
    phoneOptionalLabel: 'Phone (Optional)',
    phoneShortPlaceholder: 'Phone',
    chairsLabel: 'Chairs',
    chairSingular: 'Chair',
    chairPlural: 'Chairs',
    addWalkInBtn: 'Add Walk-In',
    walkInWaitlist: 'Walk-In Waitlist',
    partiesWaiting: 'parties waiting',
    addQueue: '+ Add to Queue',
    seatNow: 'Seat Now',
    callIn: 'Call In',
    complete: 'Complete',
    leaveLine: 'Leave Line',
    favorites: 'Favorites',
    allSalons: 'All Salons',
    allAreas: 'All Areas',
    searchPlaceholder: 'Search salon name or street...',
    joinWaitlist: 'Join Waitlist',
    inLine: 'In Line',
    paused: 'Paused',
    closedBadge: 'Closed for the Day',
    bookingPausedBadge: 'Online Booking Paused',
    acceptingBadge: 'Accepting Customers',
    scanQrDesc: 'Scan at front desk to join the live salon waitlist',
    close: 'Close',
    hiUser: 'Hi',
    calledInAlert: "IT'S YOUR TURN! Please step into the salon now.",
    firstInQueueAlert: 'YOU ARE #1 IN LINE! Please be ready—the stylist will call you shortly.',
    nowConsulting: 'Now Serving',
    yourActiveAppointment: 'Your Active Appointment',
    queuePosition: 'Queue Position'
  },
  ta: {
    appName: 'SalonRoster',
    tagline: 'நேரடி இருக்கைகள். காத்திருப்பு இல்லை.',
    signInHeader: 'உள்நுழையவும்',
    signUpHeader: 'புதிய கணக்கை உருவாக்கவும்',
    phone: 'தொலைபேசி எண்',
    password: 'கடவுச்சொல் / பின்',
    fullName: 'முழுப் பெயர்',
    accountRole: 'கணக்கு வகை',
    customerRole: 'வாடிக்கையாளர்',
    ownerRole: 'சலூன் உரிமையாளர்',
    ownerPasscode: 'உரிமையாளர் கடவுச்சொல்',
    signInBtn: 'உள்நுழைக',
    signUpBtn: 'பதிவு செய்க',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    ownerDashboard: 'சலூன் நிர்வாகப் பக்கம்',
    registerSalon: 'உங்கள் சலூனைப் பதிவு செய்யுங்கள்',
    salonName: 'சலூன் பெயர்',
    address: 'முகவரி / பகுதி',
    totalSeats: 'மொத்த இருக்கைகள்',
    openingTime: 'திறக்கும் நேரம்',
    closingTime: 'மூடும் நேரம்',
    goLive: 'லைவ் செய்',
    deskQr: 'QR & காட்சி',
    tvView: 'டிவி காத்திருப்பு அறை காட்சி',
    shopOpen: '● கடை திறந்துள்ளது',
    shopClosed: '● கடை மூடப்பட்டுள்ளது',
    pauseWaitlist: 'வரிசையை நிறுத்து',
    resumeWaitlist: 'வரிசையைத் தொடங்கு',
    liveOccupancy: 'தற்போதைய இருக்கைகள்',
    chairsOccupied: 'நாற்காலிகள் நிரம்பியுள்ளன',
    seatsAvailable: 'நாற்காலிகள் காலியாக உள்ளன',
    walkInCustomerName: 'நேரடி வாடிக்கையாளர் பெயர்',
    customerNamePlaceholder: 'வாடிக்கையாளர் பெயர்',
    phoneOptionalLabel: 'தொலைபேசி (விருப்பம்)',
    phoneShortPlaceholder: 'தொலைபேசி',
    chairsLabel: 'நாற்காலிகள்',
    chairSingular: 'நாற்காலி',
    chairPlural: 'நாற்காலிகள்',
    addWalkInBtn: 'நேரடி வாடிக்கையாளரைச் சேர்',
    walkInWaitlist: 'நேரடி காத்திருப்புப் பட்டியல்',
    partiesWaiting: 'குழுக்கள் காத்திருக்கின்றன',
    addQueue: '+ வரிசையில் சேர்',
    seatNow: 'இப்போது அமரச் செய்',
    callIn: 'உள்ளே அழைக்கவும்',
    complete: 'முடிந்தது',
    leaveLine: 'வரிசையை விட்டு வெளியேறு',
    favorites: 'பிடித்தவை',
    allSalons: 'அனைத்து சலூன்களும்',
    allAreas: 'அனைத்து பகுதிகளும்',
    searchPlaceholder: 'சலூன் பெயர் மூலம் தேடவும்...',
    joinWaitlist: 'வரிசையில் இணையவும்',
    inLine: 'வரிசையில் உள்ளீர்கள்',
    paused: 'நிறுத்தப்பட்டுள்ளது',
    closedBadge: 'இன்று சலூன் மூடப்பட்டுள்ளது',
    bookingPausedBadge: 'ஆன்லைன் முன்பதிவு நிறுத்தப்பட்டுள்ளது',
    acceptingBadge: 'வாடிக்கையாளர்கள் ஏற்கப்படுகிறார்கள்',
    scanQrDesc: 'நேரடி வரிசையில் இணைய வரவேற்பறையில் ஸ்கேன் செய்யவும்',
    close: 'மூடு',
    hiUser: 'வணக்கம்',
    calledInAlert: 'உங்கள் முறை வந்துவிட்டது! தயவுசெய்து இப்போது உள்ளே செல்லவும்.',
    firstInQueueAlert: 'நீங்கள் வரிசையில் #1 இடத்தில் உள்ளீர்கள்! தயாராக இருங்கள்—ஸ்டைலிஸ்ட் உங்களை விரைவில் அழைப்பார்.',
    nowConsulting: 'சேவை நடைபெறுகிறது',
    yourActiveAppointment: 'உங்கள் தற்போதைய முன்பதிவு',
    queuePosition: 'வரிசையில் இடம்'
  }
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('salonroster_lang') || 'en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const tvSalonId = urlParams.get('tv');

  function toggleLanguage(selectedLang) {
    setLang(selectedLang);
    localStorage.setItem('salonroster_lang', selectedLang);
  }

  function LanguageSwitcher() {
    return (
      <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
        <Globe className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
        <button
          type="button"
          onClick={() => toggleLanguage('en')}
          className={`px-2 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
            lang === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => toggleLanguage('ta')}
          className={`px-2 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
            lang === 'ta' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          தமிழ்
        </button>
      </div>
    );
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfile(data);
    setLoading(false);
  }

  function openTvView(salonId) {
    const url = new URL(window.location.href);
    url.searchParams.set('tv', salonId);
    window.history.pushState({}, '', url);
    window.location.reload();
  }

  if (tvSalonId) {
    return <TvDisplay salonId={tvSalonId} t={t} />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading SalonRoster...</div>;
  }

  if (!session) {
    return <AuthScreen onProfileCreated={(newProfile) => setProfile(newProfile)} t={t} LanguageSwitcher={LanguageSwitcher} />;
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
              salon<span className="text-blue-600">roster</span> <span className="text-xs font-normal text-slate-400">v2.1</span>
            </h1>
            <p className="text-xs text-slate-400">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 hidden sm:inline">
            {profile?.role === 'owner' ? t.ownerRole : t.customerRole}
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
          <OwnerDashboard user={session.user} profile={profile} t={t} openTvView={openTvView} />
        ) : (
          <CustomerDashboard user={session.user} profile={profile} t={t} />
        )}
      </main>
    </div>
  );
}

/* ---------------- TV WAITING ROOM DISPLAY ---------------- */
function TvDisplay({ salonId, t }) {
  const [salon, setSalon] = useState(null);
  const [queue, setQueue] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTvData();
    const channel = supabase
      .channel(`tv-display-${salonId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'salons', filter: `id=eq.${salonId}` }, () => fetchTvData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist', filter: `salon_id=eq.${salonId}` }, () => fetchTvData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [salonId]);

  async function fetchTvData() {
    const [{ data: salonData }, { data: queueData }] = await Promise.all([
      supabase.from('salons').select('*').eq('id', salonId).maybeSingle(),
      supabase.from('waitlist').select('*').eq('salon_id', salonId).in('status', ['waiting', 'in-consult']).order('created_at', { ascending: true })
    ]);
    if (salonData) setSalon(salonData);
    if (queueData) setQueue(queueData);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExit() {
    const url = new URL(window.location.href);
    url.searchParams.delete('tv');
    window.history.pushState({}, '', url);
    window.location.reload();
  }

  if (!salon) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">Loading Waiting Room...</div>;
  }

  const availableChairs = salon.total_seats - salon.occupied_seats;
  const inConsult = queue.filter(q => q.status === 'in-consult');
  const waitingList = queue.filter(q => q.status === 'waiting');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Live Waiting Room</span>
            <span className="text-slate-400 text-sm">• {salon.address}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{salon.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Available Chairs</p>
            <div className="text-5xl font-black text-emerald-400 mt-1">
              {salon.is_open ? availableChairs : 0} <span className="text-xl text-slate-400 font-normal">/ {salon.total_seats}</span>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy TV Link'}
          </button>
          <button
            onClick={handleExit}
            className="px-3.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold cursor-pointer"
          >
            Exit TV
          </button>
        </div>
      </div>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-500/40 rounded-3xl p-8 flex flex-col justify-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            Now Serving
          </div>
          {inConsult.length > 0 ? (
            <div className="space-y-4 animate-pulse mt-4 w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Please Step In</span>
              <div className={`grid gap-4 w-full ${inConsult.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-2'}`}>
                {inConsult.map(item => (
                  <div key={item.id} className="bg-blue-600 text-white px-5 py-5 rounded-2xl shadow-lg flex flex-col justify-center">
                    <h2 className="text-2xl lg:text-3xl font-black break-words">{item.customer_name}</h2>
                    <p className="text-xs text-blue-100 mt-1">Party of {item.seats_count || 1} chairs</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 space-y-2 mt-4">
              <UserCheck className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-lg font-medium">Ready for next customer</p>
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col">
          <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center justify-between">
            <span>Up Next in Queue</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{waitingList.length} parties waiting</span>
          </h3>

          {waitingList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Users className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-base">No queue at the moment. Walk-ins welcome!</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
              {waitingList.map((entry, idx) => (
                <div key={entry.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xl text-white">{entry.customer_name}</h4>
                      <p className="text-xs text-slate-400">Joined at {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300">
                    {entry.seats_count || 1} {entry.seats_count === 1 ? 'Chair' : 'Chairs'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
        <span>SalonRoster Live Queue System</span>
        <span>Scan desk QR code with your phone to join waitlist instantly</span>
      </div>
    </div>
  );
}

/* ---------------- AUTH SCREEN ---------------- */
function AuthScreen({ onProfileCreated, t, LanguageSwitcher }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [ownerPasscode, setOwnerPasscode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const isSignedOut = sessionStorage.getItem('justSignedOut');
    if (isSignedOut) {
      setSuccessMessage('You have been successfully signed out.');
      sessionStorage.removeItem('justSignedOut');
    }
  }, []);

  const cleanPhone = phone.replace(/\D/g, '');
  const syntheticEmail = `${cleanPhone || 'user'}@salonroster.local`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (cleanPhone.length < 10) {
      return setError('Please enter a valid 10-digit phone number.');
    }

    if (isSignUp) {
      if (role === 'owner') {
        const { data: isValid, error: rpcError } = await supabase.rpc('verify_owner_passcode', {
          input_passcode: ownerPasscode
        });

        if (rpcError || !isValid) {
          return setError('Invalid Salon Owner Secret Passcode.');
        }
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: syntheticEmail,
        password,
        options: { data: { full_name: fullName, role, phone: cleanPhone } }
      });
      if (signUpError) return setError(signUpError.message);

      if (data.user) {
        const { data: savedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (savedProfile && onProfileCreated) onProfileCreated(savedProfile);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password
      });
      if (signInError) setError('Invalid phone number or PIN/password. Please check and try again.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <Scissors className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">{t.appName}</h1>
          </div>
          <LanguageSwitcher />
        </div>

        <h2 className="text-lg font-semibold mb-1">{isSignUp ? t.signUpHeader : t.signInHeader}</h2>
        <p className="text-sm text-slate-500 mb-6">
          {isSignUp ? 'Register with your phone number and full name.' : 'Sign in using your registered phone number.'}
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
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.fullName}</label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm bg-transparent focus:outline-none"
                    placeholder="e.g., Karthika"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.accountRole}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium cursor-pointer ${
                      role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t.customerRole}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium cursor-pointer ${
                      role === 'owner' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t.ownerRole}
                  </button>
                </div>
              </div>

              {role === 'owner' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.ownerPasscode}</label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      required
                      value={ownerPasscode}
                      onChange={(e) => setOwnerPasscode(e.target.value)}
                      className="w-full text-sm bg-transparent focus:outline-none"
                      placeholder="Enter secure owner PIN"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.phone}</label>
            <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.password}</label>
            <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition cursor-pointer"
          >
            {isSignUp ? t.signUpBtn : t.signInBtn}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold hover:underline cursor-pointer">
            {isSignUp ? t.signInBtn : t.signUpBtn}
          </button>
        </p>
      </div>
    </div>
  );
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minStr} ${ampm}`;
}

/* ---------------- SALON OWNER DASHBOARD ---------------- */
function OwnerDashboard({ user, profile, t, openTvView }) {
  const [salon, setSalon] = useState(null);
  const [queue, setQueue] = useState([]);
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [totalSeats, setTotalSeats] = useState(4);
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('21:00');

  const [editingHours, setEditingHours] = useState(false);
  const [editOpenTime, setEditOpenTime] = useState('09:00');
  const [editCloseTime, setEditCloseTime] = useState('21:00');

  const [showQrModal, setShowQrModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInSeats, setWalkInSeats] = useState(1);
  const [addingWalkIn, setAddingWalkIn] = useState(false);

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
    if (data) {
      setSalon(data);
      setEditOpenTime(data.opening_time || '09:00');
      setEditCloseTime(data.closing_time || '21:00');
    }
  }

  async function fetchQueue(salonId) {
    const { data } = await supabase
      .from('waitlist')
      .select('*')
      .eq('salon_id', salonId)
      .in('status', ['waiting', 'in-consult'])
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
        booking_paused: false,
        opening_time: openingTime,
        closing_time: closingTime,
        is_open: true,
        is_closed: false
      }])
      .select()
      .single();
    if (data) {
      setSalon(data);
      setEditOpenTime(data.opening_time || '09:00');
      setEditCloseTime(data.closing_time || '21:00');
    }
  }

  async function saveOperatingHours(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('salons')
      .update({ opening_time: editOpenTime, closing_time: editCloseTime })
      .eq('id', salon.id);
    if (!error) {
      setSalon({ ...salon, opening_time: editOpenTime, closing_time: editCloseTime });
      setEditingHours(false);
    }
  }

  async function addWalkInCustomer(e) {
    e.preventDefault();
    if (!walkInName.trim()) return;
    setAddingWalkIn(true);

    const { error } = await supabase.from('waitlist').insert([
      {
        salon_id: salon.id,
        customer_id: null,
        customer_name: walkInName.trim(),
        customer_phone: walkInPhone.trim(),
        seats_count: walkInSeats,
        status: 'waiting'
      }
    ]);

    setAddingWalkIn(false);
    if (error) {
      alert('Could not add customer to queue: ' + error.message);
      return;
    }

    setWalkInName('');
    setWalkInPhone('');
    setWalkInSeats(1);
    fetchQueue(salon.id);
  }

  async function swapQueuePositions(indexA, indexB) {
    const itemA = queue[indexA];
    const itemB = queue[indexB];
    if (!itemA || !itemB) return;

    const updatedQueue = [...queue];
    const tempTime = itemA.created_at;
    updatedQueue[indexA] = { ...itemB, created_at: tempTime };
    updatedQueue[indexB] = { ...itemA, created_at: itemB.created_at };
    setQueue(updatedQueue);

    await Promise.all([
      supabase.from('waitlist').update({ created_at: itemB.created_at }).eq('id', itemA.id),
      supabase.from('waitlist').update({ created_at: tempTime }).eq('id', itemB.id)
    ]);

    fetchQueue(salon.id);
  }

  async function updateQueueStatus(entryId, newStatus) {
    await supabase.from('waitlist').update({ status: newStatus }).eq('id', entryId);
    fetchQueue(salon.id);
  }

  async function toggleCloseClinic() {
    const newClosedState = !salon.is_closed;
    setSalon({ ...salon, is_closed: newClosedState });
    await supabase.from('salons').update({ is_closed: newClosedState }).eq('id', salon.id);
  }

  async function togglePauseBooking() {
    const nextPaused = !salon.booking_paused;
    setSalon({ ...salon, booking_paused: nextPaused });
    await supabase.from('salons').update({ booking_paused: nextPaused }).eq('id', salon.id);
  }

  if (!salon) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">{t.registerSalon}</h2>
        <p className="text-sm text-slate-500 mb-6">Set up your shop details so customers can see your live chair availability.</p>
        <form onSubmit={createSalon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.salonName}</label>
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
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.address}</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              placeholder="e.g., Main Road, Nagercoil"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.totalSeats}</label>
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
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.openingTime}</label>
              <input
                type="time"
                required
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.closingTime}</label>
              <input
                type="time"
                required
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer">
            {t.goLive}
          </button>
        </form>
      </div>
    );
  }

  const availableSeats = salon.total_seats - salon.occupied_seats;
  const totalWaitingSeats = queue.reduce((sum, item) => sum + (item.seats_count || 1), 0);
  const directCheckInUrl = `${window.location.origin}/?salon=${salon.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(directCheckInUrl)}`;
  const isClosedForDay = salon.is_closed;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t.ownerDashboard}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isClosedForDay ? 'bg-red-100 text-red-800' : salon.booking_paused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isClosedForDay ? t.closedBadge : salon.booking_paused ? t.bookingPausedBadge : t.acceptingBadge}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{salon.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Good day, {profile?.full_name || 'Owner'} • {salon.address}
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Hours: {formatTime12h(salon.opening_time || '09:00')} – {formatTime12h(salon.closing_time || '21:00')}
              </span>
              <button
                onClick={() => setEditingHours(!editingHours)}
                className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1 ml-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openTvView(salon.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              {t.tvView}
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              {t.deskQr}
            </button>

            <button
              onClick={togglePauseBooking}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                salon.booking_paused ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {salon.booking_paused ? <><PlayCircle className="w-4 h-4" /> Resume Online</> : <><PauseCircle className="w-4 h-4" /> Pause Online</>}
            </button>

            <button
              onClick={toggleCloseClinic}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition cursor-pointer ${
                isClosedForDay ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Power className="w-4 h-4" /> {isClosedForDay ? 'Open Salon' : 'Close Salon'}
            </button>
          </div>
        </div>

        {editingHours && (
          <form onSubmit={saveOperatingHours} className="pt-3 border-t border-slate-100 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Opens At</label>
              <input
                type="time"
                required
                value={editOpenTime}
                onChange={(e) => setEditOpenTime(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Closes At</label>
              <input
                type="time"
                required
                value={editCloseTime}
                onChange={(e) => setEditCloseTime(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-1.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
            >
              Save Hours
            </button>
            <button
              type="button"
              onClick={() => setEditingHours(false)}
              className="text-slate-500 hover:text-slate-700 text-xs font-semibold px-3 py-2 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">{t.walkInWaitlist}</h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {queue.length} {t.partiesWaiting} ({totalWaitingSeats} chairs)
          </span>
        </div>

        <form onSubmit={addWalkInCustomer} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.walkInCustomerName}</label>
            <input
              required
              value={walkInName}
              onChange={e => setWalkInName(e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.phoneOptionalLabel}</label>
            <input
              value={walkInPhone}
              onChange={e => setWalkInPhone(e.target.value)}
              placeholder={t.phoneShortPlaceholder}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.chairsLabel}</label>
            <select
              value={walkInSeats}
              onChange={e => setWalkInSeats(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
            >
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? t.chairSingular : t.chairPlural}</option>)}
            </select>
          </div>
          <button
            type="submit"
            disabled={addingWalkIn}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> {t.addWalkInBtn}
          </button>
        </form>

        {queue.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No customers waiting in the digital queue right now.</p>
        ) : (
          <div className="space-y-3">
            {queue.map((entry, idx) => {
              const seatsRequested = entry.seats_count || 1;
              const isWalkIn = entry.customer_id === null;

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-3 ${
                    entry.status === 'in-consult' ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-900">{entry.customer_name}</p>
                        {isWalkIn ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                            Walk-In
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                            Online
                          </span>
                        )}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {seatsRequested} {seatsRequested === 1 ? t.chairSingular : t.chairPlural}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Joined at {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => swapQueuePositions(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => swapQueuePositions(idx, idx + 1)}
                      disabled={idx === queue.length - 1}
                      className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {entry.status === 'waiting' ? (
                      <button
                        onClick={() => updateQueueStatus(entry.id, 'in-consult')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        {t.callIn}
                      </button>
                    ) : (
                      <button
                        onClick={() => updateQueueStatus(entry.id, 'seated')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> {t.complete}
                      </button>
                    )}

                    <button
                      onClick={() => updateQueueStatus(entry.id, 'cancelled')}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{salon.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.scanQrDesc}</p>
            <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-200 mb-4">
              <img
                src={qrImageUrl}
                alt="Salon Waitlist QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print QR
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CUSTOMER DASHBOARD (With Real-time Call-In Alerts) ---------------- */
function CustomerDashboard({ user, profile, t }) {
  const [salons, setSalons] = useState([]);
  const [waitlists, setWaitlists] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filterTab, setFilterTab] = useState('all');
  const [seatedAlertSalon, setSeatedAlertSalon] = useState(null);
  const [selectedSeatsBySalon, setSelectedSeatsBySalon] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [highlightedSalonId, setHighlightedSalonId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scannedSalonId = params.get('salon');
    if (scannedSalonId) {
      setHighlightedSalonId(scannedSalonId);
      setFilterTab('all');
    }

    fetchData();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const salonChannel = supabase
      .channel('live-salons-and-waitlist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'salons' }, () => fetchData())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'waitlist' }, (payload) => {
        if (payload.new?.customer_id === user.id && payload.new?.status === 'in-consult') {
          triggerTurnNotification(payload.new.salon_id);
        }
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => fetchData())
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
      supabase.from('waitlist').select('*').in('status', ['waiting', 'in-consult']).order('created_at', { ascending: true }),
      supabase.from('favorites').select('salon_id').eq('customer_id', user.id)
    ]);
    if (salonsData) setSalons(salonsData);
    if (waitlistData) setWaitlists(waitlistData);
    if (favData) setFavoriteIds(favData.map((f) => f.salon_id));
  }

  async function toggleFavorite(salonId) {
    const isFav = favoriteIds.includes(salonId);

    await supabase.from('profiles').upsert([
      {
        id: user.id,
        full_name: profile?.full_name || 'Walk-in Guest',
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

  function updateSeatSelection(salonId, delta, maxAllowed) {
    setSelectedSeatsBySalon((prev) => {
      const current = prev[salonId] || 1;
      const next = Math.min(maxAllowed, Math.max(1, current + delta));
      return { ...prev, [salonId]: next };
    });
  }

  async function joinWaitlist(salonId) {
    setSeatedAlertSalon(null);
    const seatsCount = selectedSeatsBySalon[salonId] || 1;

    await supabase.from('profiles').upsert([
      {
        id: user.id,
        full_name: profile?.full_name || 'Walk-in Guest',
        role: 'customer'
      }
    ]);

    const { error } = await supabase.from('waitlist').insert([
      {
        salon_id: salonId,
        customer_id: user.id,
        customer_name: profile?.full_name || 'Walk-in Guest',
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

  const myActiveEntry = waitlists.find((w) => w.customer_id === user.id && ['waiting', 'in-consult'].includes(w.status));
  const mySalon = myActiveEntry ? salons.find((s) => s.id === myActiveEntry.salon_id) : null;
  const myPosition = myActiveEntry
    ? waitlists.filter((w) => w.salon_id === myActiveEntry.salon_id && w.status === 'waiting').findIndex((w) => w.id === myActiveEntry.id) + 1
    : 0;

  const uniqueAreas = Array.from(
    new Set(
      salons
        .map((s) => {
          if (!s.address) return null;
          const parts = s.address.split(',');
          return parts[parts.length - 1].trim();
        })
        .filter(Boolean)
    )
  ).sort();

  const displayedSalons = salons
    .filter((s) => (filterTab === 'favorites' ? favoriteIds.includes(s.id) : true))
    .filter((s) => {
      if (selectedArea === 'all') return true;
      return s.address?.toLowerCase().includes(selectedArea.toLowerCase());
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return s.name?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (highlightedSalonId) {
        if (a.id === highlightedSalonId) return -1;
        if (b.id === highlightedSalonId) return 1;
      }
      const aFav = favoriteIds.includes(a.id) ? 1 : 0;
      const bFav = favoriteIds.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });

  return (
    <div className="space-y-6">
      {seatedAlertSalon && (
        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <BellRing className="w-8 h-8 shrink-0 text-emerald-100" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Chair Ready</span>
              <h3 className="text-xl font-bold mt-1">It's Your Turn at {seatedAlertSalon}!</h3>
              <p className="text-sm text-emerald-50 mt-0.5">The stylist has called you in. Please step inside now.</p>
            </div>
          </div>
          <button
            onClick={() => setSeatedAlertSalon(null)}
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      )}

      {myActiveEntry && mySalon && myPosition === 1 && !seatedAlertSalon && myActiveEntry.status === 'waiting' && (
        <div className="bg-amber-500 text-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="bg-white/20 p-2.5 rounded-xl shrink-0 mt-0.5">
              <BellRing className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">You Are Next (#1)</span>
              <h3 className="text-lg font-bold mt-0.5">Please get ready for {mySalon.name}!</h3>
              <p className="text-sm text-amber-50 mt-0.5">You are #1 in line. The stylist will call you shortly.</p>
            </div>
          </div>
        </div>
      )}

      {myActiveEntry && mySalon && (
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">You Are In Line</span>
            <h3 className="text-xl font-bold mt-1">{mySalon.name}</h3>
            <p className="text-sm text-blue-100 mt-0.5">
              Position: <strong className="text-white">#{myPosition}</strong> •{' '}
              <strong className="text-white">{myActiveEntry.seats_count || 1} chairs</strong> • Status: <strong className="uppercase">{myActiveEntry.status}</strong>
            </p>
          </div>
          <button
            onClick={() => leaveWaitlist(myActiveEntry.id)}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            {t.leaveLine}
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Live Availability</span>
            <h2 className="text-2xl font-bold mt-1">Today's Salon Occupancy</h2>
            <p className="text-sm text-slate-500 mt-0.5">Good day, {profile?.full_name || 'Guest'} • Pin your favorite salons</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterTab('favorites')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                filterTab === 'favorites' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterTab === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
              {t.favorites} ({favoriteIds.length})
            </button>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.allSalons} ({salons.length})
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {uniqueAreas.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 sm:w-52">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none text-slate-700 font-medium cursor-pointer"
              >
                <option value="all">{t.allAreas}</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayedSalons.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
            {searchQuery || selectedArea !== 'all' ? 'No salons match your search.' : 'No salons registered yet.'}
          </div>
        ) : (
          displayedSalons.map((salon) => {
            const available = salon.total_seats - salon.occupied_seats;
            const salonQueue = waitlists.filter((w) => w.salon_id === salon.id);
            const salonQueueSeats = salonQueue.reduce((sum, w) => sum + (w.seats_count || 1), 0);
            const isFull = available === 0 || !salon.is_open;
            const isAlreadyHere = myActiveEntry?.salon_id === salon.id;
            const isFavorite = favoriteIds.includes(salon.id);
            const isPaused = Boolean(salon.booking_paused);
            const isClosedForDay = Boolean(salon.is_closed);
            const isQrScanned = highlightedSalonId === salon.id;
            const maxSelectableSeats = Math.min(6, Math.max(1, salon.total_seats));
            const selectedSeats = selectedSeatsBySalon[salon.id] || 1;

            return (
              <div
                key={salon.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  isQrScanned ? 'border-blue-500 ring-2 ring-blue-100' : isFavorite ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isFull ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base">{salon.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isClosedForDay ? 'bg-red-100 text-red-700' : isPaused ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isClosedForDay ? t.closedBadge : isPaused ? t.bookingPausedBadge : t.acceptingBadge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{salon.address}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hours: {formatTime12h(salon.opening_time || '09:00')} – {formatTime12h(salon.closing_time || '21:00')}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      {salonQueue.length} parties ({salonQueueSeats} chairs) in waitlist
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="sm:text-right mr-1">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {salon.is_open ? available : 0} <span className="text-sm font-normal text-slate-400">/ {salon.total_seats}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">chairs free</p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(salon.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    {!isAlreadyHere && !myActiveEntry && !isPaused && (
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2 py-1 border border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => updateSeatSelection(salon.id, -1, maxSelectableSeats)}
                          disabled={selectedSeats <= 1}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-1.5 min-w-[3.2rem] text-center">
                          {selectedSeats} chairs
                        </span>
                        <button
                          type="button"
                          onClick={() => updateSeatSelection(salon.id, 1, maxSelectableSeats)}
                          disabled={selectedSeats >= maxSelectableSeats}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => joinWaitlist(salon.id)}
                      disabled={Boolean(myActiveEntry) || isPaused}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isAlreadyHere
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isPaused
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white'
                      }`}
                    >
                      {isAlreadyHere ? t.inLine : isPaused ? t.paused : t.joinWaitlist}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}