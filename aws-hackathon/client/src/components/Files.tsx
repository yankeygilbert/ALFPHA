import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onDelete, onDownload, onSendFile } from "../api/docs";
import { copy } from "../assets/hero";
import { FileData } from "../interfaces/Document";
import Moment from "moment";
import { getDocuments } from "../redux/slices/authSlice";

type Props = {
  state: {
    query: string;
    files: any;
  };
  setState: Function;
};

export const Files = ({ state, setState }: Props) => {
  const dispatch = useDispatch<any>();

  const { user } = useSelector((state: any) => state);
  const [recipientEmail, setRecipientEmail] = useState("");

  const downloadFile = async (id: string, name: string) => {
    const downloadingFileToast = toast("Downloading file...", { autoClose: false, isLoading: true });

    name = name.replace(/^.*[\\\/]/, "");
    await onDownload(id, name)
    .then((response) => {
      if (response.status === 200) {
        toast.update(downloadingFileToast, {
          render: () => (
            <div>
              <h2 className="font-bold text-xl m-0 p-0">File Downloaded!</h2>
              <p className="text-sm m-0 p-0">Thank you for saving our file.</p>
            </div>
          ),
          isLoading: false,
          type: toast.TYPE.SUCCESS,
          //Here the magic
          className: "rotateY animated",
          autoClose: 5000,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.update(downloadingFileToast, {
        render: () => (
          <div>
            <h2 className="font-bold text-sm m-0 p-0">!</h2>
          </div>
        ),
        isLoading: false,
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 5000,
      });
    });;

    let copy = [...state.files];
    copy = copy.map((file) => {
      if (file.file_uid === id) {
        file = { ...file, num_downloads: file.num_downloads + 1 };
      }

      return file;
    });

    setState({
      query: "",
      files: copy,
    });
    await dispatch(getDocuments());
  };

  const sendFile = async (e: any, id: string) => {
    e.preventDefault();

    const sendFileToast = toast("Sending file...", { autoClose: false, isLoading: true });

    const data = {
      user_uid: user.user_uid,
      file_uid: id,
      recipientEmail,
    };

    await onSendFile(data)
      .then((response) => {
        if (response.status === 200) {
          toast.update(sendFileToast, {
            render: () => (
              <div>
                <h2 className="font-bold text-xl m-0 p-0">File sent!</h2>
                <p className="text-sm m-0 p-0">Thank you for sharing our file.</p>
              </div>
            ),
            isLoading: false,
            type: toast.TYPE.SUCCESS,
            //Here the magic
            className: "rotateY animated",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        const { error } = err.response.data;
        //console.log(error);
        toast.update(sendFileToast, {
          render: () => (
            <div>
              <h2 className="font-bold text-sm m-0 p-0">{error}Error sending file!</h2>
            </div>
          ),
          isLoading: false,
          type: toast.TYPE.ERROR,
          //Here the magic
          className: "rotateY animated",
          autoClose: 5000,
        });
      });

    setRecipientEmail("");
    let copy = [...state.files];
    copy = copy.map((file) => {
      if (file.file_uid === id) {
        file = { ...file, num_emails_sent: file.num_downloads + 1 };
      }
      return file;
    });

    setState({
      query: "",
      files: copy,
    });
    closeRecipient(`${id}-send`);
    await dispatch(getDocuments());
  };

  const deleteFile = async (id: String) => {
    const deleteFileToast = toast("Deleting file...", { autoClose: false, isLoading: true });

    await onDelete(id)
      .then((response) => {
        if (response.status === 200) {
          toast.update(deleteFileToast, {
            render: () => (
              <div>
                <h2 className="font-bold text-sm m-0 p-0">File removed successfully!</h2>
              </div>
            ),
            isLoading: false,
            type: toast.TYPE.SUCCESS,
            //Here the magic
            className: "rotateY animated",
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        const { error } = err.response.data;
        //console.log(error);
        toast.update(deleteFileToast, {
          render: () => (
            <div>
              <h2 className="font-bold text-sm m-0 p-0">{error}!</h2>
            </div>
          ),
          isLoading: false,
          type: toast.TYPE.ERROR,
          //Here the magic
          className: "rotateY animated",
          autoClose: 5000,
        });
      });

    let copy = [...state.files];
    copy = copy.filter((x) => x.file_uid !== id);
    setState({
      query: "",
      files: copy,
    });
    await dispatch(getDocuments());
  };

  const toggleOptions = (e: any, id: string) => {
    let element = document.getElementById(id);
    if (element && element.style.display === "flex") {
      element.style.display = "none";
      e.target.classList.remove("rotate");
    } else if (element) {
      element.style.display = "flex";
      e.target.classList.add("rotate");
    }
  };

  const openRecipient = (id: string) => {
    let element = document.getElementById(id);
    if (element) {
      element.style.transform = "translateX(0px)";
    }
  };

  const closeRecipient = (id: string) => {
    let element = document.getElementById(id);
    if (element) {
      element.style.transform = "translateX(100%)";
    }
  };

  return (
    <div className="flex flex-wrap iems-center sm:justify-center lg:justify-between w-full px-5 sm:px-0">
      {state.files.map((file: FileData, index: any) => {
        return (
          <div
            className="sm:w-[460px] sm:min-w-[32%] sm:h-[260px] flex flex-col justify-between border sm:border-2 rounded-xl px-5 py-3 my-4 transition"
            key={index}
          >
            <div className="flex justify-between">
              <div className="title mb-2 flex items-center">
                <div className="sm:w-[45px] sm:h-[45px] w-[45px] sm:bg-gray-200 p-1 rounded-full mr-3">
                  <img src={copy} alt="notebook" />
                </div>
                <h2 className="sm:text-xl font-bold leading-4">
                  {file.title}
                  <br />
                  <span className="text-xs font-normal">{Moment(file.created_at).format("Do MMM")}</span>
                </h2>
              </div>

              {user.is_admin ? (
                <div className="flex mt-1">
                  <span
                    title="Show options"
                    className="cursor-pointer"
                    onClick={(e) => toggleOptions(e, file.file_uid)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 options-btn"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </span>

                  <div className="options hidden" id={file.file_uid}>
                    <span title="Edit file" className="mx-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </span>
                    <span className="cursor-pointer" title="Delete file" onClick={() => deleteFile(file.file_uid)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="desc mb-2">
              <span className="text-sm sm:text-lg">{file.description.substring(0, 170)}...</span>
            </div>
            <div className="w-full h-[40px] actions relative flex justify-between items-center overflow-hidden">
              {user.is_admin ? (
                <div className="min-w-[45%] flex items-center">
                  <span className="font-bold flex mr-5">
                    <span className="text-sm">{file.num_downloads.toString()}&ensp;</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </span>
                  |
                  <span className="font-bold flex ml-5">
                    <span className="text-sm">{file.num_emails_sent.toString()}&ensp;</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>
                  </span>
                </div>
              ) : (
                "--"
              )}
              <div className="flex">
                <button
                  className="bg-transparent flex p-0 text-sm"
                  onClick={() => downloadFile(file.file_uid, file.file_path)}
                >
                  Download&ensp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
                <button
                  className="bg-transparent flex p-0 ml-5 text-sm"
                  onClick={() => openRecipient(`${file.file_uid}-send`)}
                >
                  Send&ensp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="send_file flex items-center absolute w-full px-[1px] translate-x-full transition  rounded-full bg-gray-900"
                id={`${file.file_uid}-send`}
              >
                <form onSubmit={(e) => sendFile(e, file.file_uid)} className="">
                  <input
                    type="email"
                    className="w-full rounded-full p-2 text-center text-white bg-transparent"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email and press enter to send."
                  />
                </form>
                <span
                  className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center cursor-pointer font-bold"
                  title="close"
                  onClick={() => closeRecipient(`${file.file_uid}-send`)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <ToastContainer bodyClassName="toast" limit={2} />
    </div>
  );
};
