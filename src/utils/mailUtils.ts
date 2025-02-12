import nodemailer from 'nodemailer';
import chalk from 'chalk';

export const sendEmail = (emailContent: string, subject: string) => {
  // Set up the email transport configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const developmentMailList = ['timvdd@hotmail.com'];

  const to =
    process.env.NODE_ENV === 'development'
      ? developmentMailList
      : ['familydice@ziggo.nl', ...developmentMailList];

  const mailOptions = {
    from: 'xediixx@gmail.com',
    to: developmentMailList,
    subject: subject,
    text: emailContent,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(chalk.red('Error sending email:', error));
    } else {
      console.log(chalk.blue.dim('Email sent'));
    }
  });
};
