const verificationOTPTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

          <tr>
            <td style="background:#0f172a;padding:25px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;">
                NIT KKR Academic Portal
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#111827;">
                Verify your email
              </h2>

              <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                Welcome to the NIT KKR Academic Portal.
              </p>

              <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                Use the following One-Time Password to verify your account.
              </p>

              <div style="margin:35px 0;text-align:center;">

                <span
                  style="
                    display:inline-block;
                    padding:18px 40px;
                    font-size:34px;
                    letter-spacing:8px;
                    font-weight:bold;
                    background:#eff6ff;
                    color:#2563eb;
                    border-radius:8px;
                  "
                >
                  ${otp}
                </span>

              </div>

              <p style="color:#6b7280;">
                This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES} minutes.
              </p>

              <p style="color:#6b7280;">
                If you didn't request this email, you can safely ignore it.
              </p>

            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:13px;color:#6b7280;">
              © ${new Date().getFullYear()} NIT KKR Academic Portal
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};

module.exports = verificationOTPTemplate;