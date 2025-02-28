import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ItemDataType } from "../../App";
import ColumnElement from "../ColumnElement";
import DonateModule from "../DonateModule";
interface NavLinkProps extends React.PropsWithChildren {
  link?: string;
  hamburgerClose?: () => void;
  setOpenDonate?: React.Dispatch<React.SetStateAction<boolean>>;
  active_bttn?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  link,
  hamburgerClose,
  setOpenDonate,
  active_bttn,
}) => {
  return (
    <>
      {link ? (
        <Link
          to={link}
          onClick={() => {
            if (hamburgerClose) {
              hamburgerClose(); // Закрытие меню при клике
            }
          }}
          className={`text-sm md:text-xl rounded-lg p-3 button-disabled text-300 flex gap-3 md:justify-between items-center transition-all ${
            document.location.pathname === link ? "button-active" : ""
          }`}
        >
          {children}
        </Link>
      ) : (
        <div
          onClick={() => {
            if (setOpenDonate) {
              setOpenDonate(true); // Закрытие меню при клике
            }
          }}
          className={`text-sm md:text-xl rounded-lg p-3 button-disabled text-300 flex gap-3 md:justify-between items-center transition-all cursor-pointer ${
            active_bttn ? "button-active" : ""
          }`}
        >
          {children}
        </div>
      )}
    </>
  );
};

interface Navigation {
  hamburgerClose?: () => void;
  BiggestTXinDay?: ItemDataType | null;
  BiggestTXEver?: ItemDataType | null;
}

const Navigation: React.FC<Navigation> = ({
  hamburgerClose,
  BiggestTXinDay,
  BiggestTXEver,
}) => {
  const [openDonate, setOpenDonate] = useState(false);
  const [todayOrEver, setTodayOrEver] = useState<string>("today");

  return (
    <div>
      {openDonate && <DonateModule setDonutOpen={setOpenDonate} />}
      <div className="biggest_tr">
        {(BiggestTXinDay || BiggestTXEver) && (
          <>
            <span className="biggest_tr_title">
              Biggest fiat tx of{" "}
              <span
                className={`biggest_link ${
                  todayOrEver == "today" ? "active_tx_link" : ""
                }`}
                onClick={() =>
                  todayOrEver == "ever" ? setTodayOrEver("today") : ""
                }
              >
                today
              </span>
              /
              <span
                className={`biggest_link ${
                  todayOrEver == "ever" ? "active_tx_link" : ""
                }`}
                onClick={() =>
                  todayOrEver == "today" ? setTodayOrEver("ever") : ""
                }
              >
                ever
              </span>{" "}
              :
            </span>
            {todayOrEver == "today" && BiggestTXinDay && (
              <ColumnElement item={BiggestTXinDay} />
            )}
            {todayOrEver == "ever" && BiggestTXEver && (
              <ColumnElement item={BiggestTXEver} />
            )}
          </>
        )}
      </div>
      <h1 className="text-gray-300 text-title mb-2 lg:text-xl 2xl:text-2xl relative">
        Big crypto transactions tracker
      </h1>
      <div className="flex md:flex-col gap-3">
        <NavLink link="/" hamburgerClose={hamburgerClose}>
          <span>Tracker</span>
          <svg
            className="svgColor w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <g clipPath="url(#clip0_613_40)">
              <path
                d="M7.44634 14.5209L10.3778 10.0147C10.3778 10.0147 5.9989 8.27519 3.95908 9.83437C1.91931 11.3944 0.000366211 15.7139 0.000366211 15.7139L2.17472 16.9746C2.17472 16.9746 4.92681 11.6416 7.44634 14.5209Z"
                fill="#F1F1F1"
              />
              <path
                d="M15.4791 22.5538L19.9853 19.6223C19.9853 19.6223 21.7248 24.0012 20.1657 26.0411C18.6056 28.0799 14.2861 29.9998 14.2861 29.9998L13.0264 27.8255C13.0264 27.8255 18.3593 25.0733 15.4791 22.5538Z"
                fill="#F1F1F1"
              />
              <path
                d="M12.1108 21.2629L11.3372 20.4902C9.93095 24.145 6.62773 23.3723 6.62773 23.3723C6.62773 23.3723 5.855 20.0691 9.50984 18.6628L8.7371 17.8901C6.69822 17.5385 4.09718 19.9985 3.67513 22.3881C3.25396 24.7776 3.18347 26.8156 3.18347 26.8156C3.18347 26.8156 5.22142 26.746 7.61187 26.3239C10.0023 25.9019 12.4624 23.3018 12.1108 21.2629Z"
                fill="#F1F1F1"
              />
              <path
                d="M29.6029 0.397176C26.4132 -1.09784 18.3355 1.69813 13.843 7.65641C10.4199 12.1947 8.58789 15.2526 8.58789 15.2526L11.307 17.9717L12.0285 18.6931L14.7467 21.4114C14.7467 21.4114 17.8064 19.5803 22.3446 16.1581C28.3011 11.6646 31.098 3.5869 29.6029 0.397176ZM16.0916 13.9085C15.3408 13.1578 15.3408 11.9401 16.0916 11.1894C16.8423 10.4387 18.059 10.4387 18.8107 11.1904C19.5614 11.9411 19.5614 13.1578 18.8107 13.9086C18.059 14.6593 16.8423 14.6593 16.0916 13.9085ZM20.5987 9.40233C19.6282 8.43096 19.6282 6.85807 20.5987 5.88764C21.5683 4.91716 23.1421 4.91716 24.1125 5.88764C25.083 6.85813 25.083 8.43096 24.1125 9.40233C23.1421 10.3719 21.5683 10.3719 20.5987 9.40233Z"
                fill="#F1F1F1"
              />
            </g>
            <defs>
              <clipPath id="clip0_613_40">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </NavLink>
        <NavLink link="/top-200" hamburgerClose={hamburgerClose}>
          <span>Top 200 fiat tx</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <g clipPath="url(#clip0_613_56)">
              <path
                d="M21.4258 9.05582L15.6492 0.54332C15.1475 -0.19418 14.3508 -0.17918 13.8767 0.574153L8.55165 9.02499C8.07749 9.77832 8.40082 10.395 9.27248 10.395H10.8333V13.3333C10.8333 13.7753 11.0089 14.1993 11.3215 14.5118C11.634 14.8244 12.058 15 12.5 15H17.5C17.942 15 18.3659 14.8244 18.6785 14.5118C18.9911 14.1993 19.1667 13.7753 19.1667 13.3333V10.3958H20.7483C21.6208 10.3958 21.9267 9.79332 21.4258 9.05582ZM3.04249 19.6458H1.19832C0.385819 19.6458 0.0474854 19.0525 0.0474854 18.4783C0.0474854 17.8867 0.470819 17.3125 1.19832 17.3125H7.42248C8.15082 17.3125 8.57332 17.8867 8.57332 18.4783C8.57332 19.0533 8.23498 19.6458 7.42248 19.6458H5.57999V28.1367C5.57999 28.9833 5.03915 29.4567 4.31165 29.4567C3.58415 29.4567 3.04332 28.9833 3.04332 28.1367L3.04249 19.6458ZM8.66332 23.3333C8.66332 19.815 11.0308 17.1075 14.4817 17.1075C17.8808 17.1075 20.3008 19.9 20.3008 23.3333C20.3008 26.8342 17.95 29.5592 14.4817 29.5592C11.0475 29.5592 8.66332 26.8342 8.66332 23.3333ZM17.6617 23.3333C17.6617 21.2867 16.5958 19.4417 14.4817 19.4417C12.3675 19.4417 11.3017 21.2867 11.3017 23.3333C11.3017 25.3967 12.3342 27.2233 14.4817 27.2233C16.63 27.2233 17.6617 25.3967 17.6617 23.3333ZM21.3558 18.63C21.3558 17.835 21.83 17.3117 22.6767 17.3117H25.6692C28.1567 17.3117 30 18.9342 30 21.3542C30 23.8233 28.0892 25.3633 25.7717 25.3633H23.8942V28.1375C23.8942 28.9841 23.3533 29.4575 22.6267 29.4575C21.8983 29.4575 21.3567 28.9841 21.3567 28.1375L21.3558 18.63ZM23.8942 23.13H25.62C26.6842 23.13 27.3608 22.3517 27.3608 21.3375C27.3608 20.3217 26.6842 19.5442 25.62 19.5442H23.8942V23.13Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_613_56">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </NavLink>
        <NavLink setOpenDonate={setOpenDonate} active_bttn={openDonate}>
          <span>Donate!</span>
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.21606 15L6.10495 16H8.11726L8.22837 15H10.003C12.2105 15 14 13.2105 14 11.003C14 9.12963 12.6989 7.5076 10.8701 7.1012L9.14852 6.71864L9.45059 4H13V1H9.78393L9.89504 0H7.88273L7.77162 1H5.99699C3.78951 1 2 2.78951 2 4.99699C2 6.87037 3.30115 8.4924 5.12992 8.8988L6.85147 9.28136L6.54939 12H3V15H6.21606ZM8.5617 12H10.003C10.5536 12 11 11.5536 11 11.003C11 10.5357 10.6754 10.1311 10.2193 10.0298L8.81528 9.71776L8.5617 12ZM7.1847 6.28223L7.43828 4H5.99699C5.44637 4 5 4.44637 5 4.99699C5 5.46427 5.32455 5.86887 5.78071 5.97023L7.1847 6.28223Z"
              fill="white"
            />
          </svg>
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;
