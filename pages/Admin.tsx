import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Loader2, LogOut, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BookingRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  check_in: string;
  check_out: string;
  guests: number;
  requirements: string | null;
  source: string;
  status: string;
}

interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  source: string;
}

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [tab, setTab] = useState<'bookings' | 'leads'>('bookings');
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      setDataLoading(true);
      setDataError('');
      const [bookingsRes, leadsRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
      ]);

      if (bookingsRes.error || leadsRes.error) {
        setDataError((bookingsRes.error || leadsRes.error)?.message || 'Failed to load data.');
      } else {
        setBookings(bookingsRes.data || []);
        setLeads(leadsRes.data || []);
      }
      setDataLoading(false);
    };

    loadData();
  }, [session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10 px-6">
        <form onSubmit={handleSignIn} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-5">
          <h1 className="font-serif italic text-3xl font-bold text-charcoal text-center">Admin Sign In</h1>
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-sand/30 border-none rounded-xl px-4 py-3 outline-none font-semibold text-charcoal"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sand/30 border-none rounded-xl px-4 py-3 outline-none font-semibold text-charcoal"
            />
          </div>
          <button
            type="submit"
            disabled={signingIn}
            className="w-full bg-forest text-white py-3.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-forestDeep transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {signingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  const rows = tab === 'bookings' ? bookings : leads;

  return (
    <div className="min-h-screen bg-sand/10 py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif italic text-3xl md:text-4xl font-bold text-charcoal">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-forest transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('bookings')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${tab === 'bookings' ? 'bg-forest text-white' : 'bg-white text-charcoal border border-gray-200'}`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTab('leads')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${tab === 'leads' ? 'bg-forest text-white' : 'bg-white text-charcoal border border-gray-200'}`}
          >
            Leads ({leads.length})
          </button>
        </div>

        {dataError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {dataError}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-x-auto">
          {dataLoading ? (
            <div className="p-16 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-forest" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
              No {tab} yet
            </div>
          ) : tab === 'bookings' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="p-4">Created</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Check-In</th>
                  <th className="p-4">Check-Out</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Requirements</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0">
                    <td className="p-4 whitespace-nowrap text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
                    <td className="p-4 font-bold text-charcoal">{b.name}</td>
                    <td className="p-4 text-gray-500">{b.phone}<br />{b.email}</td>
                    <td className="p-4">{b.check_in}</td>
                    <td className="p-4">{b.check_out}</td>
                    <td className="p-4">{b.guests}</td>
                    <td className="p-4 text-gray-500 max-w-xs">{b.requirements || '—'}</td>
                    <td className="p-4 text-gray-400">{b.source}</td>
                    <td className="p-4">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="p-4">Created</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Source</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-gray-50 last:border-0">
                    <td className="p-4 whitespace-nowrap text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-4 font-bold text-charcoal">{l.name}</td>
                    <td className="p-4 text-gray-500">{l.phone}<br />{l.email}</td>
                    <td className="p-4">{l.subject || '—'}</td>
                    <td className="p-4 text-gray-500 max-w-sm">{l.message || '—'}</td>
                    <td className="p-4 text-gray-400">{l.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
