import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
export const sendDonationReceipt = async (donationData) => {
    const { donatorEmail, donator, amount, transactionId, donation_type, timestamp, receiptUrl } = donationData;
    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; margin: 20px 0; border-radius: 5px; }
                .receipt-details { background: white; padding: 20px; border-radius: 5px; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .detail-label { font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🙏 Thank You for Your Donation!</h1>
                </div>
                <div class="content">
                    <p>Dear ${donator},</p>
                    <p>Thank you for your generous donation! Your contribution will make a significant impact on our mission.</p>
                    
                    <div class="receipt-details">
                        <h2>Donation Receipt</h2>
                        <div class="detail-row">
                            <span class="detail-label">Transaction ID:</span>
                            <span>${transactionId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Donor Name:</span>
                            <span>${donator}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Amount:</span>
                            <span class="amount">₹${amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Donation Type:</span>
                            <span>${donation_type}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span>${new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</span>
                        </div>
                    </div>
                    
                    <p style="margin-top: 20px;"><strong>Note:</strong> This is a computer-generated receipt. Please save this for your records. You can also download the PDF version from your dashboard.</p>
                </div>
                <div class="footer">
                    <p>NGO Management System</p>
                    <p>For any queries, please contact us.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: donatorEmail,
        subject: `Donation Receipt - ${transactionId}`,
        html: receiptHTML
    };
    // Attach PDF if receiptUrl is available
    if (receiptUrl) {
        mailOptions.attachments = [
            {
                filename: `donation_receipt_${transactionId}.pdf`,
                path: receiptUrl
            }
        ];
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Donation receipt sent to ${donatorEmail}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};
export const sendMembershipReceipt = async (userData) => {
    const { email, name, membershipId, membershipFee } = userData;
    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to Our Organization!</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>Congratulations! Your membership has been activated.</p>
                    <p><strong>Membership ID:</strong> ${membershipId}</p>
                    <p><strong>Membership Fee:</strong> ₹${membershipFee}</p>
                    <p>You can now access all member benefits through your dashboard.</p>
                </div>
                <div class="footer">
                    <p>NGO Management System</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: `Membership Activated - ${membershipId}`,
        html: receiptHTML
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Membership receipt sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};
export const sendBirthdayWish = async (userData) => {
    const { email, name } = userData;
    const wishHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px; }
                .card { background: white; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                h1 { color: #667eea; font-size: 36px; margin-bottom: 20px; }
                p { font-size: 18px; color: #333; line-height: 1.6; }
                .cake { font-size: 60px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="cake">🎂</div>
                <h1>Happy Birthday, ${name}!</h1>
                <p>Wishing you a wonderful day filled with happiness and joy! 🎉</p>
                <p>Thank you for being a valued member of our organization.</p>
                <p>May this year bring you success and prosperity!</p>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: `🎂 Happy Birthday ${name}!`,
        html: wishHTML
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Birthday wish sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending birthday wish:', error);
        return false;
    }
};
export const sendCertificateEmail = async (userData) => {
    const { email, name, certificateTitle, certificateFile, verificationCode } = userData;
    const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .certificate-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
                .code { font-family: monospace; background: #e0e0e0; padding: 10px; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎖️ Certificate Awarded!</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>Congratulations! You have been awarded a certificate for your excellence and dedication.</p>
                    
                    <div class="certificate-box">
                        <h2>${certificateTitle}</h2>
                        <p>This certificate recognizes your outstanding contribution and commitment.</p>
                    </div>
                    
                    <p><strong>Verification Code:</strong></p>
                    <div class="code">${verificationCode}</div>
                    
                    <p>Please find the PDF certificate attached to this email. You can verify the authenticity using the verification code above on our portal.</p>
                </div>
                <div class="footer">
                    <p>NGO Management System</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: `Certificate: ${certificateTitle}`,
        html: certificateHTML
    };
    if (certificateFile) {
        mailOptions.attachments = [
            {
                filename: `certificate.pdf`,
                path: certificateFile
            }
        ];
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Certificate email sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending certificate email:', error);
        return false;
    }
};
export const sendEventRegistrationEmail = async (userData) => {
    const { email, name, eventTitle, eventDate, eventLocation, receiptFile } = userData;
    const eventHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                .event-details { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .detail-row { padding: 10px 0; border-bottom: 1px solid #ddd; }
                .detail-label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Event Registration Confirmed!</h1>
                </div>
                <div class="event-details">
                    <p>Dear ${name},</p>
                    <p>Thank you for registering for our event. Your registration has been confirmed.</p>
                    
                    <div class="detail-row">
                        <span class="detail-label">Event:</span> ${eventTitle}
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date & Time:</span> ${eventDate}
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span> ${eventLocation}
                    </div>
                    
                    <p style="margin-top: 20px;">Please arrive 15 minutes before the event starts. Bring this confirmation email or the attached receipt.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: `Event Registration: ${eventTitle}`,
        html: eventHTML
    };
    if (receiptFile) {
        mailOptions.attachments = [
            {
                filename: `event_receipt.pdf`,
                path: receiptFile
            }
        ];
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Event registration email sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending event registration email:', error);
        return false;
    }
};
export const sendMessageToMember = async (userData) => {
    const { email, name, messageTitle, messageContent, imageUrl } = userData;
    const messageHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
                .content { background: white; padding: 30px; }
                .message-image { max-width: 100%; height: auto; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${messageTitle}</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    ${imageUrl ? `<img src="${imageUrl}" alt="message image" class="message-image">` : ''}
                    <p>${messageContent}</p>
                </div>
                <div class="footer">
                    <p>NGO Management System</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: messageTitle,
        html: messageHTML
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Message sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending message:', error);
        return false;
    }
};
export const sendEnquiryResponseEmail = async (userData) => {
    const { email, name, response } = userData;
    const responseHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #27AE60; color: white; padding: 20px; text-align: center; }
                .response-box { background: #f0f8f0; padding: 20px; margin: 20px 0; border-left: 4px solid #27AE60; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Your Enquiry Has Been Addressed</h1>
                </div>
                <div class="response-box">
                    <p>Dear ${name},</p>
                    <p>Thank you for your enquiry. Here is our response:</p>
                    <p>${response}</p>
                    <p>If you have any further questions, please feel free to contact us.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: 'Response to Your Enquiry',
        html: responseHTML
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Enquiry response sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending enquiry response:', error);
        return false;
    }
};
export const sendCampaignUpdateEmail = async (userData) => {
    const { email, name, campaignTitle, progress, totalRaised, goal } = userData;
    const campaignHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .progress-bar { width: 100%; height: 30px; background: #e0e0e0; border-radius: 15px; overflow: hidden; margin: 20px 0; }
                .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); width: ${progress}%; text-align: center; color: white; line-height: 30px; font-weight: bold; }
                .stats { background: #f5f5f5; padding: 20px; border-radius: 5px; }
                .stat-item { padding: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Campaign Update: ${campaignTitle}</h1>
                </div>
                <div class="stats">
                    <p>Dear ${name},</p>
                    <p>We're excited to share an update on our campaign progress:</p>
                    
                    <div class="progress-bar">
                        <div class="progress-fill">${progress}%</div>
                    </div>
                    
                    <div class="stat-item"><strong>Amount Raised:</strong> ₹${totalRaised.toLocaleString('en-IN')}</div>
                    <div class="stat-item"><strong>Goal:</strong> ₹${goal.toLocaleString('en-IN')}</div>
                    <div class="stat-item"><strong>Remaining:</strong> ₹${(goal - totalRaised).toLocaleString('en-IN')}</div>
                </div>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
        to: email,
        subject: `Campaign Update: ${campaignTitle}`,
        html: campaignHTML
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Campaign update sent to ${email}`);
        return true;
    }
    catch (error) {
        console.error('❌ Error sending campaign update:', error);
        return false;
    }
};
