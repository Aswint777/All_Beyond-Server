import { sendEmail } from "../../infrastructure/utils/nodeMailerConfig";

const generateInstructorEmail = (instructorName: string, email: string, status: "approved" | "rejected"): string => {
  const isApproved = status === "approved";
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructor Application ${isApproved ? "Approval" : "Update"} Notification</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); }
      .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px 20px; text-align: center; }
      .content { padding: 30px 25px; color: #333; }
      .footer { background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      h1 { margin: 0; font-size: 24px; font-weight: 600; }
      .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #6366f1); color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: 500; margin-top: 15px; text-align: center; }
      .instructor-info { background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin: 20px 0; }
      .social-links { margin-top: 20px; }
      .social-links a { margin: 0 10px; color: #6b7280; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>${isApproved ? "Congratulations! 🎉" : "Application Update"}</h1>
      </div>
      <div class="content">
        <p>Dear ${instructorName},</p>
        <p>We're writing to inform you that your application to become an instructor on our platform has been <strong>${status}</strong>.</p>
        
        ${isApproved ? `
          <div class="instructor-info">
            <p><strong>Your Details:</strong></p>
            <p>Email: ${email}</p>
            <p>Status: Approved</p>
            <p>Access Level: Instructor</p>
          </div>
          <p>You can now start creating and publishing courses. We're thrilled to have you join our community of educators making a difference.</p>
          <p>To get started, simply log in to your account and access the instructor dashboard.</p>
          <a href="https://yourplatform.com/instructor/dashboard" class="button">Go to Instructor Dashboard</a>
        ` : `
          <p>We appreciate your interest in joining our platform as an instructor. Unfortunately, your application did not meet our current requirements.</p>
          <p>If you have any questions or need further clarification regarding this decision, please feel free to reach out to our support team.</p>
        `}

        <p style="margin-top: 25px;">Best regards,<br>The All Beyond Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} All Beyond. All rights reserved.</p>
        <div class="social-links">
          <a href="#">Twitter</a> | <a href="#">Facebook</a> | <a href="#">Instagram</a>
        </div>
        <p style="margin-top: 15px; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </body>
  </html>`;
};

export const notification = async (
  username: string,
  email?: string,
  status: "approved" | "rejected" = "approved"
): Promise<{ success: boolean }> => {
  if (!email) {
    console.warn("No email provided for notification.");
    return { success: false };
  }

  try {
    const subject = status === "approved" ? "Instructor Approval Notification" : "Instructor Application Update";
    const text = status === "approved"
      ? `Dear ${username}, you are approved as an instructor.`
      : `Dear ${username}, your application to become an instructor has been rejected.`;

    const result = await sendEmail({
      to: email,
      subject,
      html: generateInstructorEmail(username, email, status),
      text,
    });

    if (result.success) {
      return { success: true };
    } else {
      console.error("Failed to send email.");
      return { success: false };
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false };
  }
};
