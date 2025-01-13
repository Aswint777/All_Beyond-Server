// import { sendEmail } from "../../config/nodeMailerConfig";

// const otp = Math.floor(100000 + Math.random() * 900000).toString();

// try {
//   const emailResponse = await sendEmail({
//     to: email,
//     subject: "OTP Verification",
//     text: `Your OTP is: ${otp}`,
//   });

//   if (!emailResponse.success) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP. Please try again later.",
//     });
//   }

//   console.log("OTP email sent successfully:", emailResponse.response);

//   return res.status(httpStatusCode.CREATED).json({
//     success: true,
//     message: "User registered successfully! Please verify your OTP.",
//     requiresOTP: true,
//   });
// } catch (error) {
//   console.error("Error sending OTP email:", error.message);
//   return res.status(500).json({
//     success: false,
//     message: "Internal server error. Please try again later.",
//   });
// }
