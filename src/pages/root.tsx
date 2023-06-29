import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { observer } from "mobx-react-lite";

const RootPage = () => {
    const { usersStore } = useStore();

    useEffect(() => {
        usersStore.fetchUsers();
    }, []);

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default observer(RootPage);
