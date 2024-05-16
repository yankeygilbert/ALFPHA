import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onUpload } from "../api/docs";
import { getDocuments } from "../redux/slices/authSlice";

const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "30px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  marginTop: "40px",
  marginBottom: "10px",
  cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Function;
};

export const UploadFile = ({ isModalOpen, setIsModalOpen }: Props) => {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: any) => state);

  // ------------Drag n Drop------------
  const { acceptedFiles, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/plain": [".doc", ".docx", ".pdf"],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const [acceptedFileItems, setAcceptedFileItems] = useState("");

  useEffect(() => {
    const x = acceptedFiles.map((file) => {
      return `${file.name} - ${file.size} bytes`;
    });

    setAcceptedFileItems(x[0]);
    setFileErrorMessage(false);
  }, [acceptedFiles]);

  //Upload options
  interface Document {
    user_uid: string;
    title: string;
    description: string;
    document: File | null;
  }

  const document: Document = {
    user_uid: user.user_uid,
    title: "",
    description: "",
    document: null,
  };

  const [documentToUpload, setDocumentToUpload] = useState(document);
  const [isFileErrorMessage, setFileErrorMessage] = useState(false);

  const uploadFile = async (e: any) => {
    e.preventDefault();

    const uploadFileToast = toast("Uploading file...", { autoClose: false, isLoading: true });

    if (!acceptedFiles[0]) {
      setFileErrorMessage(true);
    } else {
      let formData = new FormData();
      formData.append("user_uid", documentToUpload.user_uid);
      formData.append("title", documentToUpload.title);
      formData.append("description", documentToUpload.description);
      formData.append("document", acceptedFiles[0]);

      await onUpload(formData)
      .then((response) => {
        if (response.status === 200) {
          toast.update(uploadFileToast, {
            render: () => (
              <div>
                <h2 className="font-bold text-sm m-0 p-0">File Uploaded!</h2>
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
        toast.update(uploadFileToast, {
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
      });;;

      setIsModalOpen(!isModalOpen);
      await dispatch(getDocuments());
    }
  };

  return (
    <div className="min-w-screen min-h-screen w-full h-full px-8 fixed top-0 bg-[white] flex justify-center items-center">
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

      <form onSubmit={(e) => uploadFile(e)} className="sm:w-[520px]">
        <h2 className="text-5xl font-bold">Upload File</h2>
        <div {...getRootProps({ style, className: "flex-col items-center justify-center h-[80px]" })}>
          <input
            {...getInputProps({
              type: "file",
              name: "file",
              id: "file",
              // required: true,
            })}
          />
          <p>Drag 'n' drop file here, or click to select file</p>
        </div>
        <aside className="mb-4">
          <ul>
            <li>
              {isFileErrorMessage ? <span className="text-red-400">* Please select a file</span> : acceptedFileItems}
            </li>
          </ul>
        </aside>

        <label htmlFor="title" className="font-bold">
          Title
        </label>
        <input
          value={documentToUpload.title}
          onChange={(e) => setDocumentToUpload({ ...documentToUpload, title: e.target.value })}
          className="rounded w-[100%] mb-4 p-3 bg-transparent border-2"
          type="text"
          name="title"
          id="title"
          required
        />

        <label htmlFor="description" className="font-bold">
          Description
        </label>
        <textarea
          value={documentToUpload.description}
          onChange={(e) => setDocumentToUpload({ ...documentToUpload, description: e.target.value })}
          className="rounded sm:min-h-[240px] min-h-[140px] w-[100%] mb-4 p-3 bg-transparent border-2"
          name="description"
          id="description"
          maxLength={170}
        ></textarea>
        <button
          disabled={!acceptedFiles[0]}
          className="text-white mt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-700 py-4 w-full"
        >
          Upload
        </button>
      </form>

      <ToastContainer bodyClassName="toast" limit={2} />
    </div>
  );
};
