import { useState } from "react";
import { ADMIN_LOGIN } from "../../gql/admin";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import * as jose from "jose";
const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    username: "",
  });

  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();

  /*Part of gql */

  const [postLogin] = useMutation(ADMIN_LOGIN, {
    onError: (err) => {
      console.log("Login Error ", err);
    },
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErrors({
      username: "",
      password: "",
    });
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.username) {
      tempErrors.username = "Name field is required.";
      errorExist = true;
    }
    if (!values.password) {
      tempErrors.password = "Password field is required.";
      errorExist = true;
    }
    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }

    try {
      const result = await postLogin({
        variables: {
          username: values.username,
          password: values.password,
        },
      });

      setValues({
        username: "",
        password: "",
      });
      setLoading(false);

      if (result.data.AdminLogIn.error === 1) {
        alert(result.data.AdminLogIn.message);
        return;
      } else alert("Login Successfull");

      const decodedToken = jose.decodeJwt(result.data.AdminLogIn.accessToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        navigate("/login");
      }

      const data = JSON.stringify({
        token: result.data.AdminLogIn.accessToken,
        userID: decodedToken.user_id,
      });
      window.localStorage.setItem("loggedUser", data);
      navigate("/appointment");
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                // method="get"
                // action="#"
                action="#"
                className="space-y-4 md:space-y-6"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={values.username}
                    onChange={handleChange("username")}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    placeholder="Enter Username"
                    required=""
                  />
                  {errors.username && (
                    <p className="text-red-500 mt-2 text-sm">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange("password")}
                    id="password"
                    placeholder="Enter Password"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    required=""
                  />
                  {errors.password && (
                    <p className="text-red-500 mt-2 text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
                <button
                  type="submit"
                  className="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={handleClick}
                  loading={loading}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showAlert.message && !showAlert.isError && (
        <alert
          sx={{ position: "absolute", bottom: "1em", right: "1em" }}
          severity="success"
        >
          {showAlert.message}
        </alert>
      )}
      {showAlert.message && showAlert.isError && (
        <alert
          sx={{ position: "absolute", bottom: "1em", right: "1em" }}
          severity="warning"
        >
          {showAlert.message}
        </alert>
      )}
    </>
  );
};
export default Login;
