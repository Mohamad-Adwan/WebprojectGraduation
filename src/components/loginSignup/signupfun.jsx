import axios from "axios";
import { toast, Bounce } from "react-toastify";

async function login(username, password, email, isadmin, islogin, selectedMajored) {
  console.log("Attempting login...");

  let signuser = {
    name: "",
    isAdmin: "",
    isPaid: "",
    majored: "",
    selectedMajored,
    error: "",
  };

  try {

    const response = await axios.post('http://localhost:3002/signup', {
      username,
      password,
      email,
      isadmin,
      islogin,
      selectedMajored

    }

    );
    toast.success('SignUp Successfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    signuser.error = response.data.message || "Invalid credentials";
  }

  catch (error) {

    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  }

  return signuser;
}

export default login;
