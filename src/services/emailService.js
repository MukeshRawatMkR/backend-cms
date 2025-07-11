// Example: stub for email integration
exports.sendEmail = async (to, subject, body) => {
  // integrate nodemailer/sendgrid here
  console.log(`Email sent to ${to}: ${subject}`);
  return true;
};