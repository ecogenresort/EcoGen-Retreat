// COPY THIS CODE INTO YOUR GOOGLE APPS SCRIPT EDITOR
// --------------------------------------------------

const SHEET_ID = '1xxIfQXpGpyGZ8--ab-_FDLX3xgu1LKHTlQVaQiEriGE';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 30 seconds to avoid collisions
  if (lock.tryLock(30000)) {
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      
      // --- GET REQUEST: FETCH AVAILABILITY ---
      if (!e.postData) {
        // Try multiple names for safety
        const sheet = ss.getSheetByName("Availability") || ss.getSheetByName("EcoGen Booking Availability");
        if (!sheet) return responseJSON({ booked: [] });

        const data = sheet.getDataRange().getValues();
        const bookedDates = [];
        
        // Skip header, check Status column (Column B -> index 1)
        for (let i = 1; i < data.length; i++) {
          const status = String(data[i][1]).trim().toLowerCase();
          if (status === "booked") {
            let dateObj = new Date(data[i][0]);
            if (!isNaN(dateObj.getTime())) {
              // Format: YYYY-MM-DD
              bookedDates.push(Utilities.formatDate(dateObj, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd"));
            }
          }
        }
        return responseJSON({ booked: bookedDates });
      }

      // --- POST REQUEST: HANDLE SUBMISSION ---
      const contents = JSON.parse(e.postData.contents);
      const timestamp = new Date();

      // --- ACTION: BOOKING ---
      if (contents.action === "booking") {
        const bookingsSheet = ss.getSheetByName("Bookings") || ss.getSheetByName("EcoGen Booking Details");
        
        if (bookingsSheet) {
          // CRITICAL FIX: Find the first empty row in Column B (Name)
          // to ignore pre-filled dropdowns in Column I.
          const nameData = bookingsSheet.getRange("B1:B").getValues();
          let targetRow = nameData.length + 1;
          
          for (let i = 1; i < nameData.length; i++) {
            if (nameData[i][0] === "") {
              targetRow = i + 1; // +1 because array index 0 is row 1
              break;
            }
          }

          // Write data to specific cells
          // A: Timestamp, B: Name, C: Phone, D: Email, E: CheckIn, F: CheckOut, G: Guests, H: Req
          bookingsSheet.getRange(targetRow, 1).setValue(timestamp);
          bookingsSheet.getRange(targetRow, 2).setValue(contents.name);
          bookingsSheet.getRange(targetRow, 3).setValue(contents.phone);
          bookingsSheet.getRange(targetRow, 4).setValue(contents.email);
          bookingsSheet.getRange(targetRow, 5).setValue("'" + contents.checkIn); // Force string
          bookingsSheet.getRange(targetRow, 6).setValue("'" + contents.checkOut); // Force string
          bookingsSheet.getRange(targetRow, 7).setValue(contents.guests);
          bookingsSheet.getRange(targetRow, 8).setValue(contents.req);
          
          // Ensure "NO" is set if empty (Column I)
          if (bookingsSheet.getRange(targetRow, 9).getValue() === "") {
             bookingsSheet.getRange(targetRow, 9).setValue("NO");
          }
        }

        // BLOCK DATES in Availability Sheet
        const availSheet = ss.getSheetByName("Availability") || ss.getSheetByName("EcoGen Booking Availability");
        if (availSheet) {
          const range = availSheet.getDataRange();
          const values = range.getValues();
          const start = new Date(contents.checkIn);
          const end = new Date(contents.checkOut);
          start.setHours(0,0,0,0);
          end.setHours(0,0,0,0);

          for (let i = 1; i < values.length; i++) {
            let rowDate = new Date(values[i][0]);
            rowDate.setHours(0,0,0,0);
            
            // Block dates strictly between checkIn (inclusive) and checkOut (exclusive)
            if (rowDate.getTime() >= start.getTime() && rowDate.getTime() < end.getTime()) {
              availSheet.getRange(i + 1, 2).setValue("Booked");
              availSheet.getRange(i + 1, 2).setBackground("#B91C1C"); // Red
              availSheet.getRange(i + 1, 2).setFontColor("#FFFFFF"); // White
            }
          }
        }
        return responseJSON({ status: "success", message: "Booking confirmed" });
      }

      // --- ACTION: CONTACT ---
      if (contents.action === "contact") {
        const contactSheet = ss.getSheetByName("Contact") || ss.getSheetByName("EcoGen Contact Form");
        if (contactSheet) {
           // Contact sheet likely doesn't have pre-filled columns, so appendRow is safe,
           // but using getLastRow() + 1 is safer generally.
           contactSheet.appendRow([timestamp, contents.name, contents.email, contents.phone, contents.subject, contents.message]);
        }
        return responseJSON({ status: "success", message: "Message sent" });
      }

    } catch (error) {
      return responseJSON({ status: "error", message: error.toString() });
    } finally {
      lock.releaseLock();
    }
  } else {
    return responseJSON({ status: "error", message: "Server busy" });
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}