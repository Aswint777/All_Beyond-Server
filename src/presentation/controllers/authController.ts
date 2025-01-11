
import { Request,Response } from "express";
// import { LoginUseCase } from "../../application/use-Cases/LoginUseCase"
// import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl"

// const userRepository = new UserRepositoryImpl();
// const loginUseCase = new LoginUseCase(userRepository);

//////////////////////////////////////////////////////////////////////////////////////

// export class AuthController {
//   static async login(req: Request, res: Response): Promise<void> {
//     console.log('haai from the auth controller');
    
//   //   try {
//   //     const { email, password } = req.body;
//   //     const token = await loginUseCase.execute({ email, password });
//   //     res.json({ token });
//   //   } catch (error: any) {
//   //     res.status(400).json({ error: error.message });
//   //   }
//   }

//   static async SignUp(req: Request, res: Response): Promise<void> {

//     console.log('haai from the auth controller signUp');
//     console.log(req.body,"   === yap ===");
    
//   }

// }


export const signUp = async (req: Request, res: Response): Promise<void> => {

  try {
    console.log("Hello from the auth controller signUp");

    console.log(req.body, "  === Received Data ===");

    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
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

  } catch (error: any) {

    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }

};


// Login Function
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("Hello from the auth controller login");
  
  // Uncomment and customize the code below when adding logic
  // try {
  //   const { email, password } = req.body;
  //   const token = await loginUseCase.execute({ email, password });
  //   res.json({ token });
  // } catch (error: any) {
  //   res.status(400).json({ error: error.message });
  // }
};