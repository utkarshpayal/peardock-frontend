import { useState } from "react";

function Signup() {
  const [showPass, setShowPass] = useState({
    pass: false,
    confPass: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: {
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
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
  const validateConfirmPassword = (password: string) => {
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      ) &&
      formData.password !== formData.confirmPassword
    ) {
      setFormData((prev) => ({
        ...prev,
        error: { ...prev.error, confirmPasswordError: "" },
      }));
      return true;
    }
    setFormData((prev) => ({
      ...prev,
      error: { ...prev.error, confirmPasswordError: "Password didn't match" },
    }));

    return false;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    )
      return;
    else if (
      validateEmail(formData.email) &&
      validatePassword(formData.password) &&
      validatePassword(formData.confirmPassword)
    ) {
      setFormData({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        error: {
          emailError: formData.error.emailError,
          passwordError: formData.error.passwordError,
          confirmPasswordError: formData.error.confirmPasswordError,
          generalError: formData.error.generalError,
        },
      });
    }
  };
  return (
    <div className=" w-full  bg-[rgb(241,245,249)] flex items-center justify-center">
      <form
        className="w-full max-w-md p-8 flex flex-col  bg-white rounded-lg  shadow-md gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className=" text-3xl text-center font-bold bg-gradient-to-r from-[#f34848] to-[#2ee4d8] bg-clip-text text-transparent ">
          AnonymousDock
        </h1>
        <h1 className="flex justify-center text-2xl font-semibold text-black">
          Signup
        </h1>
        <div className="flex flex-col">
          <label className="pb-2 text-gray-800 text-sm">Name</label>
          <input
            placeholder="Enter username"
            type="text"
            className="p-2 rounded-md border border-gray-300"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2 text-gray-800 text-sm">Email</label>
          <input
            placeholder="Enter email"
            type="email"
            className="p-2 rounded-md border border-gray-300"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
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
            <input
              placeholder="Enter password"
              type={showPass.pass ? "text" : "password"}
              className="p-2 rounded-md border border-gray-300 w-full"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                validatePassword(formData.password);
              }}
            />
            {showPass.pass ? (
              <img
                src="https://cdn-icons-png.flaticon.com/512/159/159604.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, pass: !prev.pass }))
                }
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/2767/2767146.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, pass: !prev.pass }))
                }
              />
            )}
          </div>
          {formData.error.passwordError && (
            <p className="text-red-600 text-[10px] pt-2">
              {formData.error.passwordError}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col">
          <label className="pb-2 text-gray-800 text-sm">Confirm Password</label>
          <div className="relative w-full">
            <input
              placeholder="Confirm Password"
              type={showPass.confPass ? "text" : "password"}
              className="p-2 rounded-md border border-gray-300 w-full"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
                validateConfirmPassword(formData.confirmPassword);
              }}
            />
            {showPass.confPass ? (
              <img
                src="https://cdn-icons-png.flaticon.com/512/159/159604.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, confPass: !prev.confPass }))
                }
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/2767/2767146.png "
                className="w-4 h-4 z-[10] absolute  top-[50%] right-2 translate-y-[-50%] cursor-pointer"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, confPass: !prev.confPass }))
                }
              />
            )}
          </div>
          {formData.error.confirmPasswordError && (
            <p className="text-red-600 text-[10px] pt-2">
              {formData.error.confirmPasswordError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-gray-900 hover:bg-white p-2 rounded-lg hover:text-black text-white font-bold text-lg disabled:cursor-not-allowed border border-black"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
