import express from "express"
import dotenv from "dotenv"
import router from "./presentation/routes/authRoutes";


dotenv.config();

const app = express()

app.use(express.json())

app.use('/auth',router)
  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  