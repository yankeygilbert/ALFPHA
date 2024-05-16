import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailIcon from "../assets/undraw_mail_sent_re_0ofv.svg";

//Function imports
import { registerUser } from "../redux/slices/authSlice";

function Register() {
  const dispatch = useDispatch<any>();

  const { isAwaitingVerification } = useSelector((state: any) => state);
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast("Trying to register...", { autoClose: false, isLoading: true });

    const response = await dispatch(registerUser(values));
    console.log(response)

    if (response.payload.success) { 
      console.log(response)
      toast.update(toastId, {
        type: toast.TYPE.SUCCESS, autoClose: 100, render: () => {
        return <p>Done!</p>
      },})
    }

    if (response.error) {
      toast.update(toastId, {
        render: () => (
          <div>
            <h2 className="font-bold text-xl m-0 p-0">Invalid email or password!</h2>
            <p className="text-sm m-0 p-0">Please check your credentials and try again.</p>
          </div>
        ),
        isLoading: false,
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 5000,
      });
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className="w-full h-full min-h-screen min-w-screen p-8 md:p-0 bg-white flex bg-[#fbfaff]">
        <div className="left w-[50vw] bg-register-bg bg-cover bg-left bg-no-repeat hidden md:block"></div>
        <div className="right md:w-[50vw] md:p-10 xl:p-48 flex items-center justify-center">
          {!isAwaitingVerification ? (
            <div className="content w-full text-slate-950 md:text-left text-center">
              <h1 className="font-bold sm:text-7xl mt-4 md:mt-0 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-pink-700">
                Sign up
              </h1>
              <p className="max-w-xl md:mt-6 mt-4">
                <span className="font-bold text-2xl sm:leading-10">Welcome to Lizo File Server!</span> <br />
                To get started, fill this form and verify your account via a confirmation code to your email. Once
                you're verified, you can browse and download important documents, search our file server, and share
                files directly to any email.
              </p>

              <form onSubmit={(e) => onSubmit(e)}>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  onChange={(e) => onChange(e)}
                  value={values.first_name}
                  required
                  className="bg-transparent mt-8 border text-center md:text-left border-transparent w-full px-4 border-b-gray-400 font-[600]"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  onChange={(e) => onChange(e)}
                  value={values.last_name}
                  required
                  className="bg-transparent mt-8 border text-center md:text-left border-transparent w-full px-4 border-b-gray-400 font-[600]"
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => onChange(e)}
                  value={values.email}
                  required
                  className="bg-transparent mt-8 border text-center md:text-left border-transparent w-full px-4 border-b-gray-400 font-[600]"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => onChange(e)}
                  value={values.password}
                  required
                  className="bg-transparent mt-8 border text-center md:text-left border-transparent w-full px-4 border-b-gray-400 font-[600]"
                />
                <br />
                <button
                  type="submit"
                  className="text-white mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-700 py-4 w-full"
                >
                  Sign up
                </button>
                <p className="max-w-lg mt-5">
                  Already have an account?{" "}
                  <a href="#/" className="text-emerald-700 underline">
                    Log in here
                  </a>
                </p>
              </form>
            </div>
          ) : (
            <div className="content w-full text-slate-950 text-center flex flex-col items-center">
              <img src={emailIcon} alt="Verification email sent." width="120p" />
              <h2 className="mt-6 text-2xl font-bold">Registration successful!</h2>
              <p>Email verification sent to your email address</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer bodyClassName="toast" limit={2} />
    </Fragment>
  );
}

export default Register;
