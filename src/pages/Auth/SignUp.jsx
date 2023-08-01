import React, { useState } from "react";
import "./css/style.css";
import { FaUserAlt, FaKey, FaHockeyPuck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import http from "../../http";
import showPwdImg from "../../images/show-password.svg";
import hidePwdImg from "../../images/hide-password.svg";
import { AiTwotoneMail } from "react-icons/ai";

const SignUp = () => {
  const { register, handleSubmit } = useForm();
  const [getRegistrationData, setRegistrationData] = useState("");
  const navigate = useNavigate();
  const [getError, setError] = useState({});
  const [isRevealPwd, setIsRevealPwd] = useState(false);

  const onSubmit = (data, e) => {
    setError({});

    data = { ...getRegistrationData };
    http
      .post("/register", data)
      .then((res) => {
        if (res.status == 200) {
            setTimeout(()=>{
              navigate("/login");
            },1000)
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message == "Validation Error.") {
          let errs = err.response.data.data;
          let keys = Object.keys(errs);
          let errors = {};
          keys.map((key) => (errors[key] = errs[key][0]));
          setError(errors);
        }
      });
  };
  const onError = (errors, e) => console.log(errors, e);

  const handleChange = (e) => {
    setError("");
 
    console.log(e);
    let RegistrationData = { ...getRegistrationData };
    RegistrationData[e.target.name] = e.target.value;
    setRegistrationData(RegistrationData);
  };

  return (
    <>
      <div className="limiter">
        <div
          className="container-login100"
        >
          <div className="wrap-login100 pt-4">
          <span className="login100-form-title pt-4 pb-5">Task Management</span>
            <Form
              className="login100-form validate-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Form.Group
                className={`wrap-input100 ${
                  getError.name ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate={getError.name}
              >
                <Form.Control
                  className="input100"
                  type="text"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter the Name"
                  onChange={(e) => handleChange(e)}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <FaUserAlt />
                </span>
              </Form.Group>


              <Form.Group
                className={`wrap-input100 ${
                  getError.email ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate={getError.email}
              >
                <Form.Control
                  className="input100"
                  type="text"
                  name="email"
                  autoComplete="off"
                  placeholder="Enter the Email"
                  onChange={(e) => handleChange(e)}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <AiTwotoneMail />
                </span>
              </Form.Group>

              <Form.Group
                className={`wrap-input100 ${
                  getError.password ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate={getError.password}
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

              <Form.Group
                className={`wrap-input100 ${
                  getError.confirm_password ? "alert-validate" : null
                } validate-input mb-3`}
                data-validate={getError.confirm_password}
              >
                <Form.Control
                  className="input100"
                  type={isRevealPwd ? "text" : "password"}
                  name="confirm_password"
                  autoComplete="off"
                  placeholder=" Enter the Confirm Password"
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
                  <FaHockeyPuck />
                </span>
              </Form.Group>

              <div className="container-login100-form-btn pt-3">
                <Button
                  className="login100-form-btn"
                  variant="success"
                  type="submit"
                >
                  Signup
                </Button>
                <div className="text-center p-3">
                  If you have register? 
                  <Link to="/login" style={{ color: "green" }}>
                    <span> login</span>
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

export default SignUp;
