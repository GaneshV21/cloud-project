import { message, Typography } from "antd";
import {
  CustomButton,
  CustomCheckbox,
  CustomInput,
  CustomInputPassword,
} from "../../../utils/custom-input";
import { useState } from "react";
import "../../../App.css";
import { LeftSideSection } from "./LeftSideSection";
import { Link } from "react-router-dom";
import axios from "axios";
import { SIGNUP } from "../../../utils/api-endpoints";
const Signup = () => {
  const [name, setName] = useState({ value: "", isError: false });
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
    } else if (name === "name") {
      const nameRegex = /^[A-Za-z\s]+$/;
      setName({ value: value, isError: !nameRegex.test(value) });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
      };
      const data = await axios.post(SIGNUP, payload);
      message.success(data?.data?.message);
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
            Create your account
          </Typography>
          <Typography className="text-[14px] text-[#667085] mt-2 mb-8">
            Get started with your free account
          </Typography>

          <Typography className="text-[14px] font-medium text-[#344054] my-2">
            Full Name <span className="text-red-500">*</span>
          </Typography>
          <CustomInput
            placeholder="Enter your full name"
            className="h-[44px]"
            name="name"
            value={name?.value}
            onChange={handleChange}
            status={name?.isError ? "error" : "success"}
          />
          {name?.isError && (
            <Typography className="text-[12px] text-[#F04438]">
              Please enter a valid full name
            </Typography>
          )}

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

          <div className="flex items-center gap-2 mt-2 mb-6">
            <CustomCheckbox />
            <Typography className="text-[13px] text-[#667085]">
              I agree to the{" "}
              <span className="text-[#5142D4] font-medium cursor-pointer">
                Terms & Conditions
              </span>
            </Typography>
          </div>

          <CustomButton
            label={"Sign Up"}
            className="w-full h-[44px] rounded-lg bg-[#5142D4] text-white font-medium hover:bg-[#4338CA]"
            disabled={
              !name?.value ||
              !email?.value ||
              !password?.value ||
              name?.isError ||
              email?.isError ||
              password?.isError
            }
            loading={loading}
            onClick={handleSubmit}
          />
          <Typography className="text-center text-[13px] text-[#667085] mt-6">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-[#5142D4] font-medium cursor-pointer">
                Login
              </span>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Signup;
