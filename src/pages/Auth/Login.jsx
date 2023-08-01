import React, { useState } from "react";
import "./css/style.css";
import { FaUserAlt, FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import http from "../../http";
import Cookies from "universal-cookie";
import showPwdImg from "../../images/show-password.svg";
import hidePwdImg from "../../images/hide-password.svg";

const cookies = new Cookies();
const Login = () => {
  const { register, handleSubmit } = useForm();
  const [getLoginData, setLoginData] = useState("");
  const navigate = useNavigate();
  const [getError, setError] = useState({});
  const [getAuthError, setAuthError] = useState(false);
  const [isRevealPwd, setIsRevealPwd] = useState(false);

  const onSubmit = (data, e) => {
    setError({});

    data = { ...getLoginData };
    http
      .post("/login", data)
      .then((res) => {
        if (res.status == 200) {
          cookies.set("userAuth", JSON.stringify(res.data.data));
          navigate("/task-creation");
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message == "Validation Error.") {
          let errs = err.response.data.data;
          let keys = Object.keys(errs);
          let errors = {};
          keys.map((key) => (errors[key] = errs[key][0]));
          setError(errors);
        } else if (err?.response?.data?.message == "Logical Error.") {
          setAuthError(true);
        } 
      });
  };
  console.log(getAuthError)
  const onError = (errors, e) => console.log(errors, e);

  const handleChange = (e) => {
    setError("");
    setAuthError(false);

    console.log(e);
    let loginData = { ...getLoginData };
    loginData[e.target.name] = e.target.value;
    setLoginData(loginData);
  };

  return (
    <>
      <div className="limiter">
        <div
          className="container-login100"
        >
          <div className="wrap-login100 pt-4">
            <span className="login100-form-title pt-4 pb-5">Task Management</span>
            {getAuthError ? (
              <div className="pb-4">
                <p className="authError">The Credential is not Correct</p>
              </div>
            ) : null}
            
            <Form
              className="login100-form validate-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Form.Group
                className={`wrap-input100 ${
                  getError.email ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate="Email is required"
              >
                <Form.Control
                  className="input100"
                  type="text"
                  autoComplete="off"
                  name="email"
                  placeholder="Enter the Email"
                  onChange={(e) => handleChange(e)}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <FaUserAlt />
                </span>
              </Form.Group>

              <Form.Group
                className={`wrap-input100 ${
                  getError.password ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate="Password is required"
              >
                <Form.Control
                  className="input100"
                  type={isRevealPwd ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  placeholder=" Enter the Password"
                  onChange={(e) => handleChange(e)}
                />
                <img
                  className="pwd"
                  title={isRevealPwd ? "Hide password" : "Show password"}
                  src={isRevealPwd ? showPwdImg : hidePwdImg}
                  onClick={() => setIsRevealPwd((prevState) => !prevState)}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <FaKey />
                </span>
              </Form.Group>
              
              <div className="container-login100-form-btn pt-3">
                <Button
                  className="login100-form-btn"
                  variant="success"
                  type="submit"
                >
                  LOGIN
                </Button>
                <div className="text-center p-3">
                  Don't have an account?
                  <Link to="/sign-up" style={{ color: "green" }}>
                    <span> Signup</span>
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
