const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * @param {string} recipientName 
 * @returns {string}
 */
const generateEmailTemplate = (recipientName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Procom 2025 Registration</title>
          <script src="https://kit.fontawesome.com/22953d4dcf.js" crossorigin="anonymous"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Martel+Sans:wght@200;300;400;600;700;800;900&family=Montserrat:ital,wght@1,900&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      </head>
      
      <body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; color: #ffffff; background-color: #0a1f44;">
          <div style="display: block; width: 100%; justify-content: center; align-items: center; background-color: #0a1f44;">
              <img src="https://res.cloudinary.com/drrz1wz3s/image/upload/v1737905331/procom_header_kgr95b.png" style="width: 100%; margin: -40px auto; display: block;" alt="Procom 2025 logo">
              <div style="text-align: left; padding: 16px; margin-top: 12px; background-color: #132b5b; border-radius: 8px; max-width: 600px; margin: 20px auto;">
                  <div style="margin-bottom: 16px; font-size: 18px;">Greetings <span style="font-weight: 600; color: #4da6ff;">Team ${recipientName} Leader</span>,</div>
                  <div style="font-size: 16px; line-height: 1.5;">
                      Thank you for registering for <span style="font-weight: 600; color: #4da6ff;">Procom 2025</span>. We're thrilled to have you on board for this exciting event. You will be notified as soon as payment is verified.
                  </div>
                  <div style="margin-top: 12px; font-size: 16px;">
                      Please feel free to contact us at <a href="mailto:procom.net@nu.edu.pk" style="color: #4da6ff; text-decoration: none; font-weight: 500;">procom.net@nu.edu.pk</a> or at +92&nbsp;370&nbsp;2743866 for any queries.
                  </div>
              </div>
          </div>
      
          <footer style="background-color: #091c3a; padding: 20px 0; margin-top: 20px; text-align: center;">
              <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 12px;">
                  <i class="fa-brands fa-2x fa-facebook" style="color: #4da6ff;"></i>
                  <i class="fa-brands fa-2x fa-linkedin" style="color: #4da6ff;"></i>
                  <i class="fa-brands fa-2x fa-square-instagram" style="color: #4da6ff;"></i>
              </div>
              <div style="background-color: #4da6ff; height: 1px; margin: 0 20px;"></div>
              <div style="padding: 12px 0; color: #bed2d7; font-family: monospace; font-size: 14px;">
                   © 2025 PROCOM™. All Rights Reserved.
              </div>
          </footer>
      </body>
      
      </html>
    `;
  };
  
  

/**
 * @param {string} recipientEmail
 * @param {string} recipientName 
 * @returns {Promise<void>}
 */
const sendEmail = async (recipientEmail, recipientName) => {
  const senderEmail = 'procom.net@nu.edu.pk';
  const appPassword =  process.env.APP_PASSWORD;
  const subject = 'PROCOM \'25 onboarding';
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      html: generateEmailTemplate(recipientName),
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {sendEmail};
