import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import validateEmail from '../../utils/Helper';
import axiosInstance from '../../utils/axiosinstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

  
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter the password")
      return;
    }
    
    setError("");


    //Login API CALL
    try {
        const response=await axiosInstance.post("/login",{
          email:email,
          password:password
        })

        //Handle successful login responce
        if(response.data && response.data.accessToken){
          localStorage.setItem("token",response.data.accessToken)
          toast.success("Login Successfully! Welcome...");
          setTimeout(()=>{
            navigate("/dashboard")
          },2000)
        }
    } catch (error) {
         // Log the error for debugging
         console.error(error);

         // Check if response exists and contains a message
         if (error.response && error.response.data && error.response.data.message) {
           setError(error.response.data.message);
         } else {
           // Generic error message
           setError("An unexpected error occurred. Please try again.");
         }
    }


  };

  return (
    <div className='h-screen bg-cyan-100 to overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40 '/>
      <div className='login-ui-box bg-cyan-300 -bottom-40 right-[90vh]'/>

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-[70vh] h-[80vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-[100px] z-10'> 
          <div className='bg-white/50 rounded-lg p-8 shadow-lg'>
            <h4 className='text-5xl text-black font-semibold leading-[58px]'>
              Capture Your<br/>Journeys
            </h4>
            <p className='text-[15px] text-black leading-6 pr-7 mt-4'>
              Record your travel experiences and memories in your personal travel journal!
            </p>
          </div>
        </div>

        <div className='w-2/4 h-[70vh] bg-white rounded-r-lg rounded-lg relative p-16 shadow-lg shadow-cyan-200'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7'>Login</h4>

            <input 
              type="text" 
              placeholder='Email' 
              className='input-box' 
              value={email} 
              onChange={({ target }) => setEmail(target.value)} 
            />

            <PasswordInput 
              value={password} 
              onChange={({ target }) => setPassword(target.value)} 
            />

            {/* Display error message if email or password validation fails */}
            {err && <p className='text-red-600 text-xs pb-1'>{err}</p>}

            <button type='submit' className='btn-primary'>
              LOGIN
            </button>
            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button 
              type='button' 
              className='btn-primary btn-light' 
              onClick={() => navigate("/signUp")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
