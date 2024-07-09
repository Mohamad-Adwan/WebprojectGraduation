import axios from "axios";
import { toast } from "react-toastify";

async function login(username, password) {
  console.log("Attempting login...");

  let User = {
    name: "",
    email: "",
    isAdmin: "",
    isPaid: "",
    majored: "",
    error: "",
  };

  try {
    const response = await axios.post("http://localhost:3002/login", {
      username,
      password
    })

    if (response.data.success) {
      console.log(response.data.success,"wewweae");

      User.name = response.data.username;
      User.email = response.data.email;
      User.isAdmin = response.data.isAdmin;
      User.isPaid = response.data.isPaid;
      User.majored = response.data.majored;
      User.error = '';
      console.log("Login successful.");
    } else {
      User.error = response.data.message || "Invalid credentials";
      console.log("Login failed:", User.error);
    }
  } catch (error) {
    User.error = "Network error, please try again later.";
    console.error("Login error:", error);
  }

  return User;
}

export default login;
