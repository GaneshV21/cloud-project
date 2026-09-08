import React, { useState } from "react";
import { LeftSideSection } from "./LeftSideSection";
import { message, Typography } from "antd";
import {
  CustomButton,
  CustomInput,
  CustomInputPassword,
} from "../../../utils/custom-input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LOGIN } from "../../../utils/api-endpoints";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../../redux/AuthSlice";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", isError: false });
  const [password, setPassword] = useState({ value: "", isError: false });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmail({ value: value, isError: !emailRegex.test(value) });
    } else if (name === "password") {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setPassword({ value: value, isError: !passwordRegex.test(value) });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        email: email.value,
        password: password.value,
      };
      const data = await axios.post(LOGIN, payload);
      message.success(data?.data?.message);
      navigate("/dashboard");
      localStorage.setItem("token", data?.data?.data?.token);
      localStorage.setItem("user", JSON.stringify(data?.data?.data || {}));
      dispatch(setToken(data?.data?.data?.token));
      dispatch(setUser(data?.data?.data));
    } catch (error) {
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex">
      <div className="w-[55%] bg-container relative flex justify-center ">
        <LeftSideSection />
      </div>
      <div className="w-[45%] flex justify-center items-center px-8">
        <div className="w-full max-w-[450px]">
          <Typography className="text-[30px] font-semibold text-[#1D2939]">
            Welcome Back
          </Typography>
          <Typography className="text-[14px] text-[#667085] mt-2 mb-8">
            login to your account
          </Typography>

          <Typography className="text-[14px] font-medium text-[#344054] my-2">
            Email <span className="text-red-500">*</span>
          </Typography>
          <CustomInput
            placeholder="Enter your email"
            className="h-[44px]"
            name="email"
            value={email?.value}
            onChange={handleChange}
            status={email?.isError ? "error" : "success"}
          />
          {email?.isError && (
            <Typography className="text-[12px] text-[#F04438]">
              Please enter a valid email address
            </Typography>
          )}
          <Typography className="text-[14px] font-medium text-[#344054] my-2">
            Password <span className="text-red-500">*</span>
          </Typography>
          <CustomInputPassword
            placeholder="Enter your password"
            className="h-[44px]"
            name="password"
            value={password?.value}
            onChange={handleChange}
            status={password?.isError ? "error" : "success"}
          />
          {password?.isError && (
            <Typography className="text-[12px] text-[#F04438]">
              Password must be at least 8 characters long, contain at least one
              uppercase letter, one number, and one special character
            </Typography>
          )}

          <Typography className="flex justify-end text-[13px] text-[#5142D4] font-medium cursor-pointer my-2">
            Forget Password?
          </Typography>

          <CustomButton
            label={"Login"}
            className="w-full h-[44px] rounded-lg bg-[#5142D4] text-white font-medium hover:bg-[#4338CA]"
            disabled={
              !email?.value ||
              !password?.value ||
              email?.isError ||
              password?.isError
            }
            loading={loading}
            onClick={handleSubmit}
          />
          <Typography className="text-center text-[13px] text-[#667085] mt-6">
            Don't have an account?{" "}
            <Link to="/signup">
              <span
                className="text-[#5142D4] font-medium cursor-pointer"
                Link
                to="/signup"
              >
                Sign Up
              </span>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Login;
