import "./Login.Module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../Contexts/User"
import axios from "axios";
import { toast, Bounce } from 'react-toastify';
import { MdOutlineCancel } from "react-icons/md";
import { object, string } from "yup";

export default function login() {
  // حالة لتخزين مدخلات المستخدم (اسم المستخدم وكلمة المرور)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const { user, setUser, setToken } = useContext(UserContext);
  const [forgetPassDiv, setForgetPassDiv] = useState(false);
  const [SendCodeDiv, setSendCodeDiv] = useState(false);

  // حالة لتخزين الرد من عملية تسجيل الدخول
  const [loginResult, setLoginResult] = useState(null);
  const [code, setCode] = useState(null);

  // دالة للتعامل مع إرسال النموذج
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // منع النموذج من إعادة التحميل

    try {// استدعاء الدالة التي تقوم بتسجيل الدخول وتخزين النتيجة
      const result = await axios.post("http://localhost:3002/login", {
        username,
        password
      });
      setToken(result.data.token);
      localStorage.setItem('userToken', result.data.token);
      toast.success('Login Successfully', {
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
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, {
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

  };

  const [forgetpass, setForgetPass] = useState({
    email: '',
    code: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleForgetChange = (e) => {
    const { name, value } = e.target;
    setForgetPass({
      ...forgetpass,
      [name]: value,
    })
  }

  const [errors, setErrors] = useState({
    email: '',
    code: '',
    password: '',
    passwordConfirmation: ''
  })

  const validateData = async () => {
    const Schema = object({
      email: string().required(),
      code: string().required(),
      password: string().min(8).max(20).required(),
      passwordConfirmation: string().oneOf([forgetpass.password, null], 'Passwords must match'),
    })

    try {
      await Schema.validate(forgetpass, { abortEarly: false });
      setErrors({
        email: '',
        code: '',
        password: '',
        passwordConfirmation: ''
      });
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(e => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
      error.errors.map(errors => {
        toast.error(errors, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      })
      return false;
    }
  }

  const validateEmail = async () => {
    const Schema = object({
      email: string().required(),
    })

    try {
      await Schema.validate(forgetpass);
      setErrors({
        ...errors,
        email: ''
      });
      return true;
    } catch (error) {
        setErrors({
          ...errors,
          email: error.errors[0]
        });
        toast.error(error.errors[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      return false;
    }
  }

  const handleSendCode = async () => {

    if (! await validateEmail()) {
      return false;
    }
    axios.get(`http://localhost:3002/send-email?email=${forgetpass.email}`)
    .then(response => {
      const { data } = response;
      setCode(data);

    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Handle error here
    });
    setSendCodeDiv(false);
    setForgetPassDiv(true);
  }

  const handleChangePass = async () => {

    if (! await validateData()) {
      return false;
    }
    if (code.randomVariable == forgetpass.code) {
             if(forgetpass.password === forgetpass.passwordConfirmation){
              try {
                const result = await axios.post('http://localhost:3002/froget-pass-update', {
                  pass: forgetpass.password,
                  email: forgetpass.email                 
                });
              } catch (error) {
                console.log('Client error:', error.response.status);
                console.log('Error data:', error.response.data);
              }


             }
    }

    setSendCodeDiv(false);
    setForgetPassDiv(false);
  }

  const handleCancel = () => {
    setForgetPass({
      email: '',
      code: '',
      password: '',
      passwordConfirmation: ''
    })
    setSendCodeDiv(false);
    setForgetPassDiv(false);
  }

  return (
    <div className="loginpage">
      <div className="logincontainer">
        <h2>Login</h2>
        <form>
          <div>
            <label>Username :</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleFormSubmit} className="submitbtn" type="submit">Login</button>
        </form>
        <button onClick={() => setSendCodeDiv(true)} className="forgetpass">Forget your password?</button>
        {SendCodeDiv &&
          <div className="SendCodeDiv">
            <div>
              <label>Email :</label>
              <input
                className={errors.email ? 'error' : ''}
                type="text"
                name="email"
                value={forgetpass.email}
                onChange={handleForgetChange}
              />
            </div>

            <button className="sendButton" onClick={handleSendCode}>Send Code</button>
            <MdOutlineCancel className="cancelButton" onClick={handleCancel} />
          </div>
        }
        {forgetPassDiv &&
          <div className="forgetPassDiv">
            <div>
              <label>Email :</label>
              <input
                type="text"
                className={errors.email ? 'error' : ''}
                name="email"
                value={forgetpass.email}
                onChange={handleForgetChange}
              />
            </div>
            <div>
              <label>Code :</label>
              <input
                type="text"
                className={errors.code ? 'error' : ''}
                name="code"
                value={forgetpass.code}
                onChange={handleForgetChange}
              />
            </div>
            <div>
              <label>New Password :</label>
              <input
                type="password"
                className={errors.password ? 'error' : ''}
                name="password"
                value={forgetpass.password}
                onChange={handleForgetChange}
              />
            </div>
            <div>
              <label>Confirm Password :</label>
              <input
                type="password"
                className={errors.passwordConfirmation ? 'error' : ''}
                name="passwordConfirmation"
                value={forgetpass.passwordConfirmation}
                onChange={handleForgetChange}
              />
            </div>

            <button className="sendButton" onClick={handleChangePass}>Confirm</button>
            <MdOutlineCancel className="cancelButton" onClick={handleCancel} />
          </div>
        }
      </div>

    </div>
  );
}
