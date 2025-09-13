const { google } = require('googleapis');
const { OAuth2 } = google.auth;

class GoogleCalendarService {
  constructor() {
    this.calendar = google.calendar({
      version: 'v3',
      auth: process.env.GOOGLE_CALENDAR_API_KEY
    });
    this.oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
    }
  }

  async createMeeting(appointmentData) {
    try {
      const { patientName, doctorName, date, time, duration = 30 } = appointmentData;
      
      // Combine date and time into a single datetime string
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const event = {
        summary: `Doctor Appointment: ${doctorName} - ${patientName}`,
        description: `Appointment with ${doctorName} for ${patientName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        conferenceData: {
          createRequest: {
            requestId: `appointment-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        attendees: [
          { email: appointmentData.patientEmail, displayName: patientName },
          { email: appointmentData.doctorEmail, displayName: doctorName },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        auth: this.oauth2Client,
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      });

      const { hangoutLink, conferenceId } = response.data.conferenceData.entryPoints[0];
      
      return {
        meetingLink: hangoutLink,
        meetingId: conferenceId,
        startTime: startDateTime,
        endTime: endDateTime,
        eventId: response.data.id
      };
    } catch (error) {
      console.error('Error creating Google Meet:', error);
      throw new Error('Failed to create Google Meet');
    }
  }

  async cancelMeeting(eventId) {
    try {
      await this.calendar.events.delete({
        auth: this.oauth2Client,
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
      });
      return true;
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      throw new Error('Failed to cancel meeting');
    }
  }
}

module.exports = new GoogleCalendarService();
