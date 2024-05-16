import { FormEvent, useState } from "react";
import pageIcon from "../assets/undraw_secure_login_pdn4.svg";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPasswordModule } from "../interfaces/ResetPassword";
import { onResetPassword } from "../api/auth";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = params.get("token");
    const id = params.get("id");
    const data: ResetPasswordModule = {
      token,
      id,
      password,
    };

    const resetToast = toast("Reseting password...", { autoClose: false, isLoading: true });
    await onResetPassword(data)
      .then((res) => {
        //console.log(res);
        if (res.status === 200) {
          toast.update(resetToast, {
            render: () => (
              <div>
                <h2 className="font-bold text-xl m-0 p-0">Password reset successful!</h2>
                <p className="text-sm m-0 p-0"><a className="text-slate-900 underline" href="./">Login</a> with your new credentials.</p>
              </div>
            ),
            isLoading:false,
            type: toast.TYPE.SUCCESS,
            //Here the magic
            className: "rotateY animated",
          });
        }
      })
      .catch((err) => {
        const { error } = err.response.data;
        //console.log(error);
        toast.update(resetToast, {
          render: () => (
            <div>
              <h2 className="font-bold text-sm m-0 p-0">{error}!</h2>
            </div>
          ),
          isLoading:false,
          type: toast.TYPE.ERROR,
          //Here the magic
          className: "rotateY animated",
          autoClose: 5000,
        });
      });
  };

  return (
    <div className="bg-white w-screen h-screen flex flex-col text-slate-900 items-center justify-center">
      <img src={pageIcon} alt="Secure login" width="200px" />
      <form onSubmit={(e) => resetPassword(e)} className="flex flex-col w-[420px] mt-8">
        <h2 className="text-3xl text-center font-bold">Reset your password</h2>

        <p className="text-center">Enter your a new password with at least 6 characters.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent p-3 rounded-full border mt-3 text-center"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
          required
        />
        <button className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-green-500 text-white">
          Reset password
        </button>
      </form>

      <ToastContainer bodyClassName="toast" limit={2} />
    </div>
  );
};
