import emailjs from '@emailjs/browser';

interface EmailParams {
  to_email: string;
  subject: string;
  message: string;
  template_params?: Record<string, unknown>;
}

export const sendEmail = async ({ to_email, subject, message, template_params = {} }: EmailParams) => {
  try {
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email,
        subject,
        message,
        ...template_params
      },
      'YOUR_PUBLIC_KEY'
    );
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendNewsletterUpdate = async (subscribers: string[], update: { title: string; content: string }) => {
  try {
    const emailPromises = subscribers.map(email => 
      sendEmail({
        to_email: email,
        subject: `Arkham Archives Update: ${update.title}`,
        message: update.content
      })
    );
    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
};

export const sendInvestorUpdate = async (investors: string[], update: { title: string; content: string; metrics: any }) => {
  try {
    const emailPromises = investors.map(email => 
      sendEmail({
        to_email: email,
        subject: `Arkham Archives Investor Update: ${update.title}`,
        message: update.content,
        template_params: {
          metrics: update.metrics
        }
      })
    );
    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error sending investor update:', error);
    throw error;
  }
};