import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ login }: any) {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: {
      emailError: "",
      passwordError: "",
      generalError: "",
    },
  });

  const validateEmail = (email: string) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormData((prev) => ({
        ...prev,
        error: { ...prev.error, emailError: "" },
      }));
      return true;
    }
    setFormData((prev) => ({
      ...prev,
      error: { ...prev.error, emailError: "Invalid email" },
    }));
    return false;
  };

  const validatePassword = (password: string) => {
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        error: { ...prev.error, passwordError: "" },
      }));
      return true;
    }
    setFormData((prev) => ({
      ...prev,
      error: { ...prev.error, passwordError: "Invalid Password" },
    }));

    return false;
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!formData.email || !formData.password) return;
    else if (
      validateEmail(formData.email) &&
      validatePassword(formData.password)
    ) {
      if (
        formData.email == "123@gmail.com" &&
        formData.password == "Utkarsh@123"
      ) {
        login();
        setFormData((prev) => ({
          ...prev,
          error: {
            ...prev.error,
            generalError: "",
          },
        }));
        navigate("/");
      } else {
        setFormData((prev) => ({
          ...prev,
          error: {
            ...prev.error,
            generalError: "Wrong email or password",
          },
        }));
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-[rgb(241,245,249)]">
      <form
        className="w-full max-w-md p-8 flex flex-col bg-white rounded-lg  shadow-md gap-4 "
        onSubmit={handleSubmit}
      >
         <h1 className=" text-3xl text-center font-bold bg-gradient-to-r from-[#f34848] to-[#2ee4d8] bg-clip-text text-transparent ">
            AnonymousDock
          </h1>
        <h1 className="flex justify-center text-2xl font-semibold text-black">
          Sign In
        </h1>
        <div className="flex flex-col">
          <label className="pb-2 text-gray-800 text-sm">Email</label>
          <input
            placeholder="Enter email"
            type="email"
            className="p-2 rounded-md border border-gray-300 "
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              validateEmail(formData.email);
            }}
          />
          {formData.error.emailError && (
            <p className="text-red-600 text-[10px] pt-2">
              {formData.error.emailError}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col">
          <label className="pb-2 text-gray-800 text-sm">Password</label>
          <div className="relative w-full">
            {showPass ? (
              <img
                src="https://cdn-icons-png.flaticon.com/512/159/159604.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/2767/2767146.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            )}
            <input
              placeholder="Enter password"
              type={showPass ? "text" : "password"}
              className="p-2 w-full rounded-md border border-gray-300 "
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                validatePassword(formData.password);
              }}
            />
          </div>
          {formData.error.passwordError && (
            <p className="text-red-600 text-[10px] pt-2">
              {formData.error.passwordError}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-900 hover:bg-white p-2 rounded-lg hover:text-black text-white font-bold text-lg disabled:cursor-not-allowed border border-black"
          disabled={
            !!(
              formData.error.emailError ||
              formData.error.passwordError ||
              formData.error.generalError
            )
          }
        >
          Login
        </button>
        {formData.error.generalError && (
          <p className="text-red-600 text-[10px]">
            {formData.error.generalError}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
