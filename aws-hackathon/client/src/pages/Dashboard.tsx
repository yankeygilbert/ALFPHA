import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import dash from "../assets/dashboard-hero.svg";
import { UploadFile } from "../components/UploadFile";
import { Navbar } from "../components/Navbar";
import { Files } from "../components/Files";

function Dashboard() {
  const { files } = useSelector((state: any) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, setState] = useState({
    query: "",
    files: files,
  });

  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Fragment>
      <div className="min-w-screen min-h-screen bg-[#ffffff] text-slate-700">
        <div className="container md:px-4">
          <Navbar showModal={showModal} state={state} setState={setState}></Navbar>

          <div className="flex items-center justify-center py-12 my-4 sm:my-10 rounded-2xl bg-[antiquewhite]">
            <img src={dash} alt="dash" className="h-[100px]" />
          </div>
          {state.files.length > 0 ? (
            <Files state={state} setState={setState}></Files>
          ) : (
            <div className="flex item-center justify-center p-40">
              <h1 className="text-center mr-4">No files uploaded yet.</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-14 h-14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </div>
          )}
        </div>

        {isModalOpen ? <UploadFile isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}></UploadFile> : ""}
        <div className="copy text-center mt-8 pb-4">© 2023 Lizo, Inc.</div>
      </div>
    </Fragment>
  );
}

export default Dashboard;
