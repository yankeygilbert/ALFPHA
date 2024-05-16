import { FormEvent, useRef } from "react";
import forgotImg from "../assets/undraw_forgot_password_re_hxwm.svg";
import { onResetpasswordRequest } from "../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

export const EmailModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);

  const sendResetLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = {
      email: emailRef.current?.value!,
    };
    const requestResetToast = toast("Sending link...", { autoClose: false, isLoading: true });

    await onResetpasswordRequest(email)
      .then((res) => {
        if (res.status === 200) {
          toast.update(requestResetToast, {
            render: () => (
              <div>
                <h2 className="font-bold text-xl m-0 p-0">Link sent to your email!</h2>
                <p className="text-sm m-0 p-0">
                  Kindly check your email and follow the instructions to reset your password.
                </p>
              </div>
            ),
            isLoading: false,
            type: toast.TYPE.SUCCESS,
            className: "rotateY animated",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        toast.update(requestResetToast, {
          render: () => (
            <div>
              <h2 className="font-bold text-xl m-0 p-0">User not found!</h2>
              <p className="text-sm m-0 p-0">Please verify your email address and try again.</p>
            </div>
          ),
          isLoading: false,
          type: toast.TYPE.ERROR,
          className: "rotateY animated",
          autoClose: 5000,
        });
      });
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center fixed top-0 z-[999] text-slate-900">
      <div className="fixed right-[5%] top-[5%]">
        <button className="p-1" type="button" onClick={() => setIsModalOpen(!isModalOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <img src={forgotImg} alt="Forgot password" width="200px" />
      <form onSubmit={(e) => sendResetLink(e)} className="flex flex-col px-6 sm:w-[420px] mt-8">
        <h2 className="text-3xl text-center font-bold">Forgot your password?</h2>

        <p className="text-center">
          Enter your email address and we'll send you a link with instructions to reset your password.
        </p>
        <input
          ref={emailRef}
          type="email"
          className="bg-transparent p-4 rounded-full border mt-3 text-center"
          placeholder="Email"
          required
        />
        <button className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-green-500 text-white">
          Send reset link
        </button>
      </form>
      <ToastContainer bodyClassName="toast" limit={2} />
    </div>
  );
};
