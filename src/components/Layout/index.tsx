import { PropsWithChildren } from "react";
import "./styles.scss";
import Header from "./Header";

interface LayoutProps {}

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
    return (
        <div className="layout">
            <Header />
            {children}
        </div>
    );
};

export default Layout;
