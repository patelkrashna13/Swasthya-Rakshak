const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send appointment confirmation email with Google Meet link
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.patientName - Patient's name
 * @param {string} options.doctorName - Doctor's name
 * @param {string} options.date - Appointment date
 * @param {string} options.time - Appointment time
 * @param {string} options.meetLink - Google Meet link
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendAppointmentConfirmation = async ({
  to,
  patientName,
  doctorName,
  date,
  time,
  meetLink,
}) => {
  try {
    const mailOptions = {
      from: `"We3Coders Telemedicine" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: `Your Telemedicine Appointment with Dr. ${doctorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">Appointment Confirmed</h2>
          <p>Hello ${patientName},</p>
          
          <p>Your telemedicine appointment has been scheduled successfully.</p>
          
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          
          <p>Join your appointment using the button below:</p>
          
          <a href="${meetLink}" 
             style="display: inline-block; background: #1a56db; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 4px;
                    margin: 16px 0; font-weight: bold;">
            Join Video Call
          </a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1a56db;">${meetLink}</p>
          
          <p>Please join 5 minutes before your scheduled time to ensure everything is working properly.</p>
          
          <p>Best regards,<br>We3Coders Telemedicine Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Appointment confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    throw new Error('Failed to send appointment confirmation email');
  }
};

/**
 * Send Calendly appointment notification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.patientName - Patient's name
 * @param {string} options.patientEmail - Patient's email
 * @param {string} options.patientPhone - Patient's phone
 * @param {string} options.doctorName - Doctor's name
 * @param {string} options.doctorSpecialty - Doctor's specialty
 * @param {string} options.appointmentDate - Appointment date
 * @param {string} options.appointmentTime - Appointment time
 * @param {string} options.consultationType - Type of consultation
 * @param {string} options.symptoms - Patient symptoms
 * @param {string} options.calendlyLink - Calendly meeting link
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendCalendlyAppointmentNotification = async ({
  to,
  patientName,
  patientEmail,
  patientPhone,
  doctorName,
  doctorSpecialty,
  appointmentDate,
  appointmentTime,
  consultationType,
  symptoms,
  calendlyLink,
}) => {
  try {
    const mailOptions = {
      from: `"Swasthya Rakhsak Telemedicine" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: `Calendly Appointment Confirmation with ${doctorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #22c55e; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; color: white;">Appointment Confirmed!</h2>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p>Dear ${patientName},</p>
            <p>Your Calendly appointment has been scheduled successfully through Swasthya Rakhsak.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #22c55e; margin-top: 0;">Appointment Details:</h3>
              <p><strong>Doctor:</strong> ${doctorName} (${doctorSpecialty})</p>
              <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Consultation Type:</strong> ${consultationType}</p>
              <p><strong>Patient Phone:</strong> ${patientPhone}</p>
              ${symptoms ? `<p><strong>Symptoms/Reason:</strong> ${symptoms}</p>` : ''}
            </div>
            
            <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: white;">Join Your Consultation</h3>
              <a href="${calendlyLink}" 
                 style="color: white; text-decoration: none; font-weight: bold; 
                        background: rgba(255,255,255,0.2); padding: 10px 20px; 
                        border-radius: 4px; display: inline-block;">
                Click here to join your appointment
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>Important Reminders:</strong></p>
              <ul style="color: #92400e; margin: 10px 0;">
                <li>Please join 5 minutes before your scheduled time</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Have your medical history and current medications ready</li>
                <li>Test your camera and microphone beforehand</li>
              </ul>
            </div>
            
            <p style="margin-top: 20px;">
              Please save this email for your records. If you need to reschedule, 
              please contact us at least 24 hours in advance.
            </p>
            
            <p style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 30px;">
              Best regards,<br>
              <strong>Swasthya Rakhsak Team</strong><br>
              <em>Your Health, Our Priority</em>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Calendly appointment notification sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending Calendly appointment notification:', error);
    throw new Error('Failed to send Calendly appointment notification');
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendCalendlyAppointmentNotification,
};
