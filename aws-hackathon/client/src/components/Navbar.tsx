import { useState } from "react";
import logo from "../assets/logo_alt.svg";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../redux/slices/authSlice";
import { FileData } from "../interfaces/Document";

type Props = {
  showModal: Function;
  state: {
    query: string;
    files: any;
  };
  setState: Function;
};

export const Navbar = ({ showModal, state, setState }: Props) => {
  const dispatch = useDispatch<any>();
  const { files } = useSelector((state: any) => state);
  const { user } = useSelector((state: any) => state);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = async () => {
    try {
      dispatch(logOutUser());
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const search = async (e: any) => {
    const results = files.filter((file: FileData) => {
      return file.title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    setState((currentState: typeof state) => {
      return {
        ...currentState,
        query: e.target.value,
        files: results,
      };
    });
  };
  return (
    <div className="navbar w-full flex flex-col-reverse px-8 sm:px-0 sm:flex-row items-center justify-between pt-5 sm:pt-8 pb-2">
      <div className="logo flex items-end justify-center mt-5 sm:mt-0">
        <img src={logo} alt="Lizo File Server Logo" className="sm:h-[46px] h-[52px] mr-1" />
        <h3 className="sm:text-4xl text-5xl font-bold sm:font-[1000] tracking-wide sm:leading-[0.3] leading-[0.3]">
          IZO
          <br />
          <small className="text-[12px] sm:text-[8px] font-normal"> FILE SERVER</small>
        </h3>
      </div>

      <div className="search rounded-full border border-2 sm:max-w-[40%] md:min-w-[45%] w-full flex items-center my-5 sm:my-0 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#f567d6"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          className="w-full bg-transparent font-normal py-2 px-3 text-center"
          type="search"
          onChange={(e) => search(e)}
          value={state.query}
          name="search_document"
          id="search_ducoment"
          placeholder="Search all documents..."
        />
      </div>

      <div className="user_controls flex items-center">
        <p>
          Howdy, <span className="font-bold text-2xl">{user.first_name + " " + user.last_name}</span>
        </p>
        <div className="avatar ml-3 relative">
          <span className="relative" id="avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>

          {isDropdownOpen ? (
            <div className="user_options absolute right-0 top-[50px] min-w-max bg-white border-2 rounded-lg">
              <div className="arrow_box px-4 py-2 rounded">
                {user.is_admin ? (
                  <div>
                    <span
                      className="px-4 text-sm py-2 cursor-pointer flex items-center"
                      onClick={() => showModal(setIsDropdownOpen(!isDropdownOpen))}
                    >
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
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      &ensp;Upload File
                    </span>
                    <hr className="my-1" />
                  </div>
                ) : (
                  ""
                )}
                <span className="px-4 text-sm py-2 cursor-pointer flex items-center" onClick={() => logout()}>
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  &ensp;Log out
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
