// COPY THIS CODE INTO YOUR GOOGLE APPS SCRIPT EDITOR
// See the setup guide for step-by-step deployment instructions.
// --------------------------------------------------

const SHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

const BOOKINGS_SHEET = 'Bookings';
const CONTACT_SHEET = 'Contact';

const BOOKINGS_HEADERS = [
  'Timestamp', 'Name', 'Phone', 'Email', 'CheckIn', 'CheckOut', 'Guests', 'Requirements', 'Status'
];
const CONTACT_HEADERS = [
  'Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message'
];

/**
 * Run this once from the Apps Script editor (select `setup` in the function
 * dropdown, then click Run) to create both sheets with the right headers.
 * Safe to re-run: it only creates what's missing.
 */
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  ensureSheet(ss, BOOKINGS_SHEET, BOOKINGS_HEADERS);
  ensureSheet(ss, CONTACT_SHEET, CONTACT_HEADERS);
}

function ensureSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return responseJSON({ status: 'error', message: 'Server busy, please try again.' });
  }

  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (!e.postData) {
      return handleGetAvailability(ss);
    }

    const contents = JSON.parse(e.postData.contents);

    if (contents.action === 'booking') {
      return handleBooking(ss, contents);
    }

    if (contents.action === 'contact') {
      return handleContact(ss, contents);
    }

    return responseJSON({ status: 'error', message: 'Unknown action.' });
  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --- GET: availability, derived directly from confirmed bookings ---
function handleGetAvailability(ss) {
  const bookedDates = getBookedDateSet(ss);
  return responseJSON({ booked: Array.from(bookedDates) });
}

// Returns a Set<string> of every "yyyy-MM-dd" date covered by a Confirmed
// booking. Cancelled bookings (Status column) are excluded.
function getBookedDateSet(ss) {
  const sheet = ss.getSheetByName(BOOKINGS_SHEET);
  const booked = new Set();
  if (!sheet || sheet.getLastRow() < 2) return booked;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, BOOKINGS_HEADERS.length).getValues();
  for (const row of rows) {
    const [, , , , checkIn, checkOut, , , status] = row;
    if (String(status).trim().toLowerCase() === 'cancelled') continue;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      booked.add(Utilities.formatDate(d, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd'));
    }
  }
  return booked;
}

// --- POST action=booking ---
function handleBooking(ss, contents) {
  const { name, phone, email, checkIn, checkOut, guests, req } = contents;

  if (!name || !phone || !email || !checkIn || !checkOut) {
    return responseJSON({ status: 'error', message: 'Missing required booking fields.' });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return responseJSON({ status: 'error', message: 'Invalid check-in/check-out dates.' });
  }

  // Re-validate against current bookings under the lock, so two near-simultaneous
  // requests for the same dates can't both succeed.
  const bookedDates = getBookedDateSet(ss);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = Utilities.formatDate(d, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
    if (bookedDates.has(dateStr)) {
      return responseJSON({ status: 'error', message: 'Selected dates are no longer available.' });
    }
  }

  const bookingsSheet = ss.getSheetByName(BOOKINGS_SHEET);
  if (!bookingsSheet) {
    return responseJSON({ status: 'error', message: `Sheet "${BOOKINGS_SHEET}" not found. Run setup() first.` });
  }

  bookingsSheet.appendRow([
    new Date(),
    name,
    phone,
    email,
    "'" + Utilities.formatDate(start, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd'),
    "'" + Utilities.formatDate(end, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd'),
    guests || '',
    req || '',
    'Confirmed'
  ]);

  return responseJSON({ status: 'success', message: 'Booking confirmed' });
}

// --- POST action=contact ---
function handleContact(ss, contents) {
  const { name, email, phone, subject, message } = contents;

  if (!name || !email) {
    return responseJSON({ status: 'error', message: 'Missing required contact fields.' });
  }

  const contactSheet = ss.getSheetByName(CONTACT_SHEET);
  if (!contactSheet) {
    return responseJSON({ status: 'error', message: `Sheet "${CONTACT_SHEET}" not found. Run setup() first.` });
  }

  contactSheet.appendRow([new Date(), name, email, phone || '', subject || '', message || '']);
  return responseJSON({ status: 'success', message: 'Message sent' });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
