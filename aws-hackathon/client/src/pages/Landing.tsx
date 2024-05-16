import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo_alt.svg";
import { copy, folder, gift, mail, music, notebook, picture, shield } from "../assets/hero";

//Interal function import
import { loginUser } from "../redux/slices/authSlice";
import { EmailModal } from "../components/EmailModal";

interface LoginModal {
  email: string;
  password: string;
}

function LandingPage() {
  const [values, setValues] = useState<LoginModal>({
    email: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch<any>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const toastId = toast("Logging you in...", { autoClose: false, isLoading: true });
    const response = await dispatch(loginUser(values));
    if (response.success) {
      toast.update(toastId, {
        render: () => (
          <div>
            <h2 className="font-bold text-xl m-0 p-0">Login successful!</h2>
            <p className="text-sm m-0 p-0">Enjoy our server full of files.</p>
          </div>
        ),
        isLoading: false,
        type: toast.TYPE.SUCCESS,
        className: "rotateY animated",
        autoClose: 5000,
      });
    }

    if (response.error) {
      const { errors } = response.payload.error.response.data;
      toast.update(toastId, {
        render: () => (
          <div>
            <h2 className="font-bold text-xl m-0 p-0">{errors[0].msg}!</h2>
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
      <div className="design w-full h-full absolute z-[-1] hidden lg:block">
        <img src={copy} alt="Something" className="h-40 absolute right-[15%] top-[75%] animate-pulse slow" />
        <img src={mail} alt="Something" className="h-40 absolute right-[35%] top-[70%] animate-pulse slow" />
        <img src={picture} alt="Something" className="h-40 absolute left-[43%] top-[44%] animate-pulse slow" />
        <img src={folder} alt="Something" className="h-40 absolute right-[5%] top-[50%] animate-pulse slow" />
        <img src={music} alt="Something" className="h-36 absolute left-[30%] top-[70%] swinger" />
        <img src={shield} alt="Something" className="h-60 absolute right-[30%] top-[25%] animate-pulse slow" />
        <img src={notebook} alt="Something" className="h-28 absolute left-[35%] top-[30%] animate-pulse slow" />
        <div className="w-screen h-screen bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px]"></div>
      </div>

      <img src={gift} alt="Something" className="h-32 absolute z-[2] right-[20px] top-[78%] lg:top-[22%] animate-bounce slow" />

      <div className="container px-8">
        <nav className="md:pt-20 pt-5 flex items-center justify-center sm:block">
          <div className="logo flex items-end">
            <img src={logo} alt="Lizo File Server Logo" className="h-[46px] mr-1" />
            <h3 className="text-4xl font-[1000] tracking-wide leading-[0.3]">
              IZO
              <br />
              <small className="text-[9px] font-normal">FILE SERVER</small>
            </h3>
          </div>
        </nav>

        <div className="hero-section mb-14 lg:mb-0 lg:mt-40 mt-12 text-center sm:text-left flex flex-wrap lg:flex-nowrap justify-center sm:justify-between">
          <div className="hero-left">
            <h1 className="text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-violet-500">
              File sharing <br />
              made easy with <br />
              our <span className="underline">platform</span>.
            </h1>
            <p className="max-w-lg mt-8 text-lg">
              Access and download important documents remotely with our easy-to-use platform. Download wedding cards,
              admission forms, and more with just a few clicks.
            </p>
            <div className="mt-8 flex items-center justify-center sm:justify-start">
              <a href="#/register" className="hover:text-white">
                <button
                  type="button"
                  className="mr-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-green-500"
                >
                  Get Started
                </button>
              </a>
              <a href="#/" className="flex underline">
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-right mt-20 sm:mt-10 lg:mt-0">
            <div className="rounded-3xl sm:w-96 sm:h-96 login-form p-10">
              <h3 className="text-xl font-bold">Login</h3>
              <form onSubmit={(e) => onSubmit(e)}>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => onChange(e)}
                  placeholder="Email"
                  required
                  className="bg-transparent mt-8 border-2 border-transparent w-full border-b-[#252c37]"
                />
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={(e) => onChange(e)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="bg-transparent mt-8 border-2 border-transparent w-full border-b-[#252c37]"
                />
                <span className="mt-4 block">
                  <a
                    onClick={() => setIsModalOpen(true)}
                    className="text-[14px] cursor-pointer text-[#c7c9d3] underline"
                  >
                    Forgot password?
                  </a>
                </span>
                <div className="sm:mt-10 mt-4 sm:flex items-center">
                  <button className="mr-5 w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-700">
                    Log in
                  </button>
                  <p className="text-[14px] leading-none">
                    Don't have an account yet? <br />
                    <a href="#/register" className="underline">
                      Sign up
                    </a>{" "}
                    now.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? <EmailModal isModalOpen setIsModalOpen={setIsModalOpen}></EmailModal> : ""}

      <ToastContainer bodyClassName="toast" limit={2} />
    </Fragment>
  );
}

export default LandingPage;
