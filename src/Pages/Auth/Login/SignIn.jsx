import React, { useState } from "react";
import "./signin.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../Layout/Footer/Footer";
import FilledButton from "../../../components/FilledButton";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../Helper/Helper";
import { RotatingLines } from "react-loader-spinner";
export default function SignIn() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
    const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState({});
  const validation = () => {
    let error = {};
    if (!user.email) {
      error.email = "Email is required";
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        user.email
      )
    ) {
      error.email = "Email should contain One capital , small and a special character";
    }
      if (!user.password) {
        error.password = "Password is required";
      } else if (!/^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(user.password)) {
        error.password =
          "Minimum 6 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character";
      }
    return error;
  };
  const [toHome, settoHome] = React.useState(false);
  if (toHome === true) {
    return <Navigate to="/" />;
  }
  const handleSubmit = async (e) => {
    setLoading(false)
    e.preventDefault();
    setError(validation());
    const formdata = new FormData();
    formdata.append("email", user.email);
    formdata.append("password", user.password);
    try {
      const response = await axiosInstance.post("user/signin", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      setLoading(true);
      if (response.status === 200) {
        setUser({
          ...user,
          email: "",
          password: "",
        });
        toast(response.data.message);
        setTimeout(() => {
          settoHome(true);
        }, 2000);
      } else {
        settoHome(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  let name, value;
  const userData = (e) => {
    name = e.target.name;
    value = e.target.value;

    if (name === "email") {
      if (value.length === 0) {
        setError({ ...error, email: "Email is required" });
        setUser({ ...user, email: value });
      } else {
        setError({ ...error, email: "" });
        setUser({ ...user, email: value });
      }
    }
    if (name === "password") {
      if (value.length === 0) {
        setError({ ...error, password: "Password is required" });
        setUser({ ...user, password: value });
      } else {
        setError({ ...error, password: "" });
        setUser({ ...user, password: value });
      }
    }
  };
  return (
    <div>
      <section className="login">
        <div className="login-div w-[1380px] mx-auto">
          <ToastContainer />
          <div className="form-div w-[450px] bg-[#1E1F22] py-[30px] px-[40px] rounded-xl">
            <form
              action=""
              className="flex justify-center flex-col gap-2"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold text-white">
                Sign in to your account
              </h2>
              <label htmlFor="email">Username or Email</label>
              <input
                name="email"
                label="Email"
                value={user.email}
                onChange={(e) => userData(e)}
                type="email"
                id="email"
              />
              <span style={{ color: "red" }}>{error.email}</span>
              <label htmlFor="password">Password</label>
              <input
                name="password"
                label="Password"
                value={user.password}
                onChange={(e) => userData(e)}
                type="passord"
                id="password"
              />
              <span style={{ color: "red" }}>{error.password}</span>
              <div className="flex justify-between">
                <div>
                  <input type="checkbox" />
                  <label htmlFor=""> Remember Me</label>
                </div>
                <span className="text-[#6a79fa] font-[manrope] capitalize font-semibold text-base">
                  Forgot Password?
                </span>
              </div>
              <p className="text-white text-end text-base pt-2">
                Dont have an account?{" "}
                <Link className="text-[#6a79fa] font-[manrope]" to={"/signup"}>
                  Sign Up
                </Link>
              </p>
              {loading ? (
                <div className="flex justify-center">
                  <RotatingLines
                    visible={true}
                    height="16"
                    width="16"
                    color="#6a79fa"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : (
                <FilledButton text={"Sign In"} type="submit" />
              )}
            </form>
          </div>
          <Navbar />
        </div>
        <Footer />
      </section>
    </div>
  );
}
