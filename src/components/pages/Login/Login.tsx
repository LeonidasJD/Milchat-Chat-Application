import { Input, DatePicker } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Logo from "../../../assets/login/milchatLogo.png";
import LoginBanner from "../../../assets/login/banner.png";
import Button from "../../common/button.tsx";
import useLogin from "./useLogin.tsx";
import "./login.scss";
import "../../../styles/input/inputField.scss";
import { Controller } from "react-hook-form";
import UserCreatedModal from "../../userCreatedModal/userCreatedModal.tsx";

const Login = () => {
  const {
    isLoading,
    controlSignUp,
    handleSubmitSignUp,
    onSubmitSignUp,
    errorsSignUp,
    isLogin,
    setIsLogin,
    controlLogin,
    handleSubmitLogin,
    errorsLogin,
    onSubmitLogin,
    userCreated,
    errorMessage,
  } = useLogin();

  return (
    <div className="login-container">
      <div className="header">
        <div className="logo-wrapper">
          <img src={Logo} alt="logo" />
        </div>
        <div className="header-links-wrapper">
          <ul>
            <li>
              <p onClick={() => setIsLogin(false)}>Sign Up Free</p>
            </li>
            <li>
              <p onClick={() => setIsLogin(true)}>Login</p>
            </li>
          </ul>
          {/* <Space wrap>
            <Select
              defaultValue="english"
              style={{ width: 120 }}
              options={[
                { value: "english", label: "English" },
                { value: "serbian", label: "Serbian" },
              ]}
            />
          </Space> */}
        </div>
      </div>

      <div className="main-page-wrapper">
        <div className="side-image-wrapper">
          <img src={LoginBanner} alt="banner" />
        </div>
        <div className="main-login-content">
          {/* SIGN UP FORM  START*/}
          {!isLogin && !userCreated && (
            <div className="signUpWrapper">
              <h1>SIGN UP FOR FREE</h1>
              <form onSubmit={handleSubmitSignUp(onSubmitSignUp)}>
                <label className="login-label">Name</label>
                <Controller
                  name="name"
                  control={controlSignUp}
                  rules={{
                    required: "Name is required*",
                    pattern: {
                      value: /^.+$/,
                      message: "Name must containet at least one character*",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      {...field}
                    />
                  )}
                />
                {errorsSignUp?.name && (
                  <span className="error-message">
                    {String(errorsSignUp.name.message)}
                  </span>
                )}
                <label className="login-label">Date of birth</label>
                <Controller
                  name="dateOfBirth"
                  control={controlSignUp}
                  rules={{
                    required: "Date of birth is required*",
                  }}
                  render={({ field }) => (
                    <DatePicker style={{ width: "100%" }} {...field} />
                  )}
                />
                {errorsSignUp?.dateOfBirth && (
                  <span className="error-message">
                    {String(errorsSignUp.dateOfBirth.message)}
                  </span>
                )}
                <label className="login-label">Email</label>
                <Controller
                  name="email"
                  control={controlSignUp}
                  rules={{
                    required: "Email is required*",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message:
                        "Email addres must be in format example@example.com*",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  )}
                />
                {errorsSignUp?.email && (
                  <span className="error-message">
                    {String(errorsSignUp.email.message)}
                  </span>
                )}
                <label className="login-label">Password</label>
                <Controller
                  name="password"
                  control={controlSignUp}
                  rules={{
                    required: "Password is required*",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                      message:
                        "Password must have at least 8 characters, one uppercase letter, and one special character*",
                    },
                  }}
                  render={({ field }) => (
                    <Input.Password
                      type="password"
                      placeholder="Enter your password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      {...field}
                    />
                  )}
                />
                {errorsSignUp?.password && (
                  <span className="error-message">
                    {String(errorsSignUp.password.message)}
                  </span>
                )}

                <Button
                  color="dark"
                  type="submit"
                  text={isLoading ? "Loading..." : "Sign Up"}
                />
              </form>
              <p className="alreadyHaveAccount">
                You aleready have account?{" "}
                <Button
                  style={{ width: "130px" }}
                  text="Login"
                  color="light"
                  onClick={() => setIsLogin(true)}
                />
              </p>
            </div>
          )}

          {/* LOGIN FORM START */}

          {isLogin && (
            <div className="loginWrapper">
              {errorMessage && (
                <span style={{ color: "white" }}>{errorMessage}</span>
              )}

              <h1>LOGIN</h1>
              <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
                <label className="login-label">Email</label>
                <Controller
                  name="email"
                  control={controlLogin}
                  rules={{ required: "Email is required*" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  )}
                />
                {errorsLogin?.email && (
                  <span className="error-message">
                    {String(errorsLogin.email.message)}
                  </span>
                )}

                <label className="login-label">Password</label>
                <Controller
                  name="password"
                  control={controlLogin}
                  rules={{ required: "Password is required*" }}
                  render={({ field }) => (
                    <Input.Password
                      type="password"
                      placeholder="Enter your password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      {...field}
                    />
                  )}
                />
                {errorsLogin?.password && (
                  <span className="error-message">
                    {String(errorsLogin.password.message)}
                  </span>
                )}
                <Button
                  color="dark"
                  type="submit"
                  text={isLoading ? "Loading..." : "Login"}
                />
              </form>
            </div>
          )}

          {userCreated && !isLogin && (
            <UserCreatedModal onNavigateToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
