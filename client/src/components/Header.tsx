import "./Header.css";
import { useSelector } from "react-redux";
import { Page, selectPage, setPage } from "../features/page/pageSlice";
import { useAppDispatch } from "../app/hooks";
import { MouseEventHandler } from "react";

export function Header() {
  const currentPage = useSelector(selectPage);
  const dispatch = useAppDispatch();

  const makeOnPageLinkClick =
    (page: Page): MouseEventHandler<HTMLAnchorElement> =>
    (event) => {
      event.preventDefault();
      dispatch(setPage(page));
    };

  return (
    <nav className="Header">
      {Object.entries(Page).map(([label, value]) => (
        <a
          key={value}
          href="#"
          className={value === currentPage ? "current" : undefined}
          onClick={makeOnPageLinkClick(value)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
