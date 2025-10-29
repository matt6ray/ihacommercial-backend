import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface QuoteRequestEmailData {
  name: string;
  email: string;
  phone?: string | null;
  propertyType?: string | null;
  message?: string | null;
}

export async function sendQuoteRequestEmail(data: QuoteRequestEmailData) {
  const emailHtml = `
    <h2>New Quote Request from IHA Commercial Website</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
    ${data.propertyType ? `<p><strong>Property Type:</strong> ${data.propertyType}</p>` : ''}
    ${data.message ? `<p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
    <hr>
    <p><small>This email was sent from the IHA Commercial contact form.</small></p>
  `;

  const emailText = `
New Quote Request from IHA Commercial Website

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.propertyType ? `Property Type: ${data.propertyType}` : ''}
${data.message ? `Message:\n${data.message}` : ''}

---
This email was sent from the IHA Commercial contact form.
  `;

  try {
    const result = await resend.emails.send({
      from: 'IHA Commercial <contact@ihacommercial.com>',
      to: [
        'info@hotelappraisals.com',
        'mattgray@hotelappraisals.com',
        'russreynolds@hotmail.com'
      ],
      subject: `New Quote Request from ${data.name}`,
      html: emailHtml,
      text: emailText,
    });

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
