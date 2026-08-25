import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || '"VENTERSHOP" <noreply@ventershop.ca>';

// Check if credentials are placeholders or empty
const isDummySmtp =
  !SMTP_HOST ||
  SMTP_HOST === 'placeholder' ||
  !SMTP_USER ||
  SMTP_USER === 'placeholder';

let cachedTransporter: nodemailer.Transporter | null = null;
let creatingTransporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (isDummySmtp) {
    if (!creatingTransporterPromise) {
      creatingTransporterPromise = (async () => {
        console.log('[SMTP] Generating dynamic Ethereal test account credentials...');
        try {
          const testAccount = await nodemailer.createTestAccount();
          console.log(`[SMTP] Ethereal test account generated successfully. User: ${testAccount.user}`);
          cachedTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // TLS
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          return cachedTransporter;
        } catch (e) {
          console.error('[SMTP] Failed to generate Ethereal test account. Falling back to basic console logger.', e);
          // Return a dummy transporter that doesn't crash but logs
          return {
            sendMail: async (options: any) => {
              console.log('--- FALLBACK MAIL LOGGER ---');
              console.log('To:', options.to);
              console.log('Subject:', options.subject);
              console.log('----------------------------');
              return { messageId: 'fallback-dummy-id' };
            }
          } as any;
        }
      })();
    }
    return creatingTransporterPromise;
  }

  // Real configured SMTP
  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // 465 is secure, others use TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
  return cachedTransporter;
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const transporter = await getTransporter();
    
    const mailOptions = {
      from: isDummySmtp ? '"VENTERSHOP Test Mail" <noreply@ventershop.ca>' : SMTP_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Message ID:', info.messageId);

    if (isDummySmtp && info.messageId !== 'fallback-dummy-id') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('========================================================================');
      console.log(`[ETHEREAL TEST EMAIL SENT TO: ${to}]`);
      console.log(`Subject: ${subject}`);
      console.log(`Click preview link to view email: ${previewUrl}`);
      console.log('========================================================================');
    }

    return info;
  } catch (error) {
    console.error('Nodemailer sendEmail error:', error);
    throw new Error('Failed to send email');
  }
}
