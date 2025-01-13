import { Request,Response } from "express";
import bcrypt from 'bcrypt';
import { IDependencies } from "../../application/interfaces/IDependencies";
import { checkByNameUseCase } from "../../application/use-Cases/auth_Use-case";
import { httpStatusCode } from "../../_lib/common/HttpStatusCode";
import { User } from "../../infrastructure/database/model/userModel";
import nodemailer from 'nodemailer';
import { sendEmail } from "../../infrastructure/utils/nodeMailerConfig";



export const signUpController = (dependencies : IDependencies) =>{
  const {useCases} = dependencies;
  const { /*createOtpUseCase,*/ checkByEmailUseCase, checkByNameUseCase } = useCases;
  return async (req: Request, res: Response) => {
    
    try {
      console.log(req.body, "  === Received Data ===");
      
      const { name, email, password, confirmPassword } = req.body;
      
      // Validate required fields
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        res.status(httpStatusCode.CONFLICT).json({
          success : false,
          message: "All fields are required."
        })
        return;
      }
      
      // Validate password match
      if (password !== confirmPassword) {
        res.status(httpStatusCode.CONFLICT).json({
          success : false,
          message:  "Passwords do not match."
        })
        return;
      }
      
      // Validate password length
      if (password.length < 6) {
        console.log("Password must be at least 6 characters long");
        res.status(httpStatusCode.CONFLICT).json({
          success : false,
          message: "Password must be at least 6 characters long." 
        })
        return
        
      }
      console.log(typeof name, typeof email, typeof password)
      const nameResult = await checkByNameUseCase(dependencies).execute(name)
      console.log(nameResult,'nameResult');
      
      if(nameResult){
        res.status(httpStatusCode.CONFLICT).json({
          success : false,
          message: "UserName is already taken , Try alternative "
        })
        return
      }
      
      const emailResult = await checkByEmailUseCase(dependencies).execute(email)
      
      if(emailResult){
        res.status(httpStatusCode.CONFLICT).json({
          success : false,
          message: "this Email is already Logged , Try to Login "
        })
        return
      }
      
      // Hash the password (use bcrypt or similar library)
      const hashedPassword = await bcrypt.hash(password, 10); // Uncomment when bcrypt is used
      
      await User.create({
        username: name,
        email,
        password: hashedPassword,
        });
        // Create the user object (using plain password for now, hash it in production)
        const newUser = {
          name,
          email,
          password, // Replace with hashedPassword once hashed
        };
        
        // Generate an OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Send OTP via email
        const emailResponse = await sendEmail({
          to: email,
          subject: "OTP Verification",
          text: `Your OTP is: ${otp}`,
        });
        
        
        
        console.log("User created:", newUser);
        
        res.status(201).json({
          success: true,
          message: "User registered successfully!",
          user: newUser,
          requiresOTP: true,
        });
        console.log(res.status(201).json);
        
        return;
      } catch (error: any) {
        
        console.error("Error during signup:", error.message);
        res.status(500).json({ error: "Internal server error. Please try again later." });
      }
      
    };
  }