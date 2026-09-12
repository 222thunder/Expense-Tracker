export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp, username) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Expense Tracker</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Hello ${username}!</h2>
                  <p style="color: #666666; font-size: 15px; line-height: 1.6; text-align: center; margin: 0 0 30px 0;">
                    Thank you for registering with Expense Tracker. Please use the following OTP to verify your account.
                  </p>
                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; text-align: center;">
                        <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Your OTP Code</p>
                        <p style="color: #333333; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #999999; font-size: 13px; text-align: center; margin: 25px 0 0 0;">
                    This OTP is valid for 10 minutes. Do not share this code with anyone.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © 2026 Expense Tracker. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
