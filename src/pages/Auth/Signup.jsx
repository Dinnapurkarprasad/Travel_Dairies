import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import validateEmail from '../../utils/Helper';
import axiosInstance from '../../utils/axiosinstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [Uname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!Uname) {
      setError("Please enter a  Username");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: Uname,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Account Created Successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-300 -bottom-40 right-[90vh]" />

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-[70vh] h-[80vh] flex items-end bg-regis-bg-img bg-cover bg-center rounded-lg p-[100px] z-10">
          <div className="bg-white/70 rounded-lg p-8 shadow-lg">
            <h4 className="text-5xl text-black font-semibold leading-[58px]">
              Unfold Your <br /> Adventures
            </h4>
            <p className="text-[15px] text-black leading-5 pr-7 mt-4">
              Your Personal Travel Story Starts Here. Turn Your Adventures into Unforgettable Stories.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[70vh] bg-white rounded-r-lg rounded-lg relative p-16 shadow-lg shadow-cyan-200">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="User Name"
              className="input-box mb-3"
              value={Uname}
              onChange={({ target }) => setName(target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {err && <p className="text-red-600 text-xs pb-1">{err}</p>}

            <button type="submit" className="btn-primary">
              CREATE ACCOUNT
            </button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Signup;
