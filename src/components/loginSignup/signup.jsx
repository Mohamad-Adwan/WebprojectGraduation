import { React, useState } from 'react';
import './Signup.Module.css';
import axios from 'axios'; // Import Axios
import { object, string } from 'yup';
import { toast, Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function signup() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    selectedMajored: ''
  });

  const [signupResult, setSignupResult] = useState(null);
  const [code, setCode] = useState(null);
  const [codeDiv, setCodeDiv] = useState(false);
  const [codeConf, setCodeConf] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    selectedMajored: '',
  });

  const isadmin = user.userType === 'Company' ? '2' : '0';
  const islogin = '0';
  const choices = ['Computer Engineering', 'Medicine', 'Mechatronics engineering', 'lawyer', 'English Language', 'Arabic Language'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '',
    })
  }

  const handleSelectedMajored = (e) => {
    setUser({
      ...user,
      selectedMajored: e.target.value,
    })
  }
  const handleUserTypeChange = (e) => {
    setUser({
      ...user,
      userType: e.target.value,
    });
    setErrors({
      ...errors,
      userType: '',
    });
  }
  const validateData = async () => {

    const Schema = object({
      username: string().min(5).max(20).required(),
      email: string().email().required(),
      password: string().min(8).max(20).required(),
      passwordConfirmation: string().oneOf([user.password, null], 'Passwords must match'),
      selectedMajored: string().required('Select your Major').notOneOf(['Choose..'], 'Select your Major')
    });

    try {
      await Schema.validate(user, { abortEarly: false });
      setErrors({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        selectedMajored: ''
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
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    //send code


    if (! await validateData()) {
      console.log("error")
      return false;
    }
    console.log(user.email);
    axios.get(`http://localhost:3002/send-email?email=${user.email}`)
      .then(response => {
        const { data } = response;
        setCode(data);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle error here
      });
    setCodeDiv(true);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // منع النموذج من إعادة التحميل
    /////////////////

    //here codmpaer code with code that user add from text box verification
    if (code.randomVariable == codeConf) {
      ///////////////
            // استدعاء الدالة التي تقوم بتسجيل الدخول وتخزين النتيجة
      try {

        const result = await axios.post('http://localhost:3002/signup', {
          username: user.username,
          password: user.password,
          email: user.email,
          isadmin: isadmin,
          islogin: islogin,
          selectedMajored: user.selectedMajored
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
        navigate('/loginSignup');
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
        setSignupResult(error.response.data.message);
      }

    }
    setCodeDiv(false);
  };
  return (
    <div className="signuppage">
      <div className="signupcontainer">
        <h2>Sign up</h2>
        <form onSubmit={handleSendCode}>
          <div>
            <label>Email</label>
            <input
              type="text"
              className={errors.email && 'errorMessage'}
              value={user.email}
              name='email'
              onChange={handleChange} />
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              className={errors.username && 'errorMessage'}
              value={user.username}
              name='username'
              onChange={handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password"
              className={errors.password && 'errorMessage'}
              value={user.password}
              name='password'
              onChange={handleChange} />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password"
              className={errors.passwordConfirmation && 'errorMessage'}
              value={user.passwordConfirmation}
              name='passwordConfirmation'
              onChange={handleChange} />
          </div>
          <div className="option-list" value={user.selectedMajored} onChange={handleSelectedMajored} ><h5>Choose an option:</h5>
            <select className={errors.selectedMajored && 'errorMessage'}>
              <option>Choose..</option>
              {choices.map((choice, index) => (
                <option key={index} value={choice} >
                  {choice}
                </option>
              ))}
            </select>
          </div>
          <div className="option-list" value={user.userType} onChange={handleUserTypeChange} >
            <h5>Register as:</h5>
            <select className={errors.userType && 'errorMessage'}>
              <option>Choose..</option>
              <option value="User">User</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <button className="submitbtn" type="submit">SignUp</button>
        </form>
        {signupResult && (
          <div>
            {signupResult.error ? (
              <p>{signupResult.error}</p>
            ) : (
              <p></p>
            )}
          </div>
        )}
      </div>
      {codeDiv &&
        <div className='varificationDiv'>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="code">Verification Code:</label>
              <input
                type='text'
                name='code'
                placeholder='Enter The Code...'
                value={codeConf}
                // This line defines a second name attribute
                onChange={(e) => setCodeConf(e.target.value)}
              />            </div>

            <button type='submit'>SignUp</button>
          </form>
        </div>
      }
    </div>
  )
}
