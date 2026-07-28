import { supabase } from './supabaseClient';

interface BookingRecord {
  name: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  requirements?: string;
  source: string;
}

interface LeadRecord {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  source: string;
}

// Best-effort dual-write to the admin dashboard's data store. Google Sheets
// (via Apps Script) is still the system of record for the actual booking/
// contact flow, so a Supabase failure here is logged and swallowed rather
// than surfaced to the guest.
export async function logBookingToSupabase(data: BookingRecord) {
  try {
    const { error } = await supabase.from('bookings').insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
      requirements: data.requirements || null,
      source: data.source,
    });
    if (error) console.error('Supabase booking sync failed:', error.message);
  } catch (error) {
    console.error('Supabase booking sync failed:', error);
  }
}

export async function logLeadToSupabase(data: LeadRecord) {
  try {
    const { error } = await supabase.from('leads').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message || null,
      source: data.source,
    });
    if (error) console.error('Supabase lead sync failed:', error.message);
  } catch (error) {
    console.error('Supabase lead sync failed:', error);
  }
}
