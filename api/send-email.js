// Install: npm install resend
import { Resend } from 'resend';

const resend = new Resend('re_dJE8N16x_JbsQcSmQQoq31QiPVFMVFYLM'); // Yahan apni actual key dalain

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Resend ka default ya verify domain
        to: 'asadmaqsoom77@gmail.com',  // Jahan email receive karni hai
        subject: `New Message from Portfolio: ${name}`,
        text: `From: ${email}\n\nMessage: ${message}`,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
