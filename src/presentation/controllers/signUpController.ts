import { Request,Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { checkByNameUseCase } from "../../application/use-Cases/auth_Use-case";
import { httpStatusCode } from "../../_lib/common/HttpStatusCode";
import { User } from "../../infrastructure/database/model/userModel";



export const signUpController = (dependencies : IDependencies) =>{
     const {useCases} = dependencies;
     const { /*createOtpUseCase, findByEmailUseCase,*/ checkByNameUseCase } = useCases;
    return async (req: Request, res: Response) => {
    
      try {
        console.log(req.body, "  === Received Data ===");
    
        const { name, email, password, confirmPassword } = req.body;
    
        // Validate required fields
        // if (!name || !email || !password || !confirmPassword) {
        //   res.status(400).json({ error: "All fields are required." });
        //   return;
        // }
    
        // // Validate password match
        // if (password !== confirmPassword) {
        //   res.status(400).json({ error: "Passwords do not match." });
        //   return;
        // }
    
        // // Validate password length
        // if (password.length < 6) {
        //   console.log("Password must be at least 6 characters long");
          
        //   res.status(400).json({ error: "Password must be at least 6 characters long." });
        //   return;
        // }
        console.log(typeof name, typeof email, typeof password)
        await User.create({
          username: name,
          email,
          password: password,
        });
          const nameResult = await checkByNameUseCase(dependencies).execute(name)
        if(nameResult){
          res.status(httpStatusCode.CONFLICT).json({
            success : false,
            massage: "UserName is already taken , Try alternative "
          })
          return
        }
    
        // Hash the password (use bcrypt or similar library)
        // const hashedPassword = await bcrypt.hash(password, 10); // Uncomment when bcrypt is used
    
        // Create the user object (using plain password for now, hash it in production)
        const newUser = {
          name,
          email,
          password, // Replace with hashedPassword once hashed
        };
        
        // Simulate saving to a database (replace this with actual DB code)
        console.log("User created:", newUser);
    
        res.status(201).json({ message: "User registered successfully!", user: newUser });
        return;
      } catch (error: any) {
    
        console.error("Error during signup:", error.message);
        res.status(500).json({ error: "Internal server error. Please try again later." });
      }
    
    };
    }