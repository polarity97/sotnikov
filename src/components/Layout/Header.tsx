import { NavLink } from "react-router-dom";
import "./styles.scss";

const links = [
    { title: "Posts", link: "/posts" },
    { title: "Albums", link: "/albums" },
    { title: "Todos", link: "/todos" },
];

const Header = () => {
    return (
        <div className="header">
            <ul className="header__links">
                {links.map((link, index) => (
                    <li key={index}>
                        <NavLink
                            to={link.link}
                            className={({ isActive }) => {
                                return isActive ? "header__link header__link--active" : "header__link";
                            }}
                        >
                            {link.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Header;
