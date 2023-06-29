import { Autocomplete, Box, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { User } from "../../../store/UsersStore";
import { useStore } from "../../../store/useStore";

interface UserFilterProps {
    onChange: (userIds: number[]) => void;
    onClickArrow: (arrowUp: boolean) => void;
}

const UserFilter = ({ onChange, onClickArrow }: UserFilterProps) => {
    // const [userIds, setUserIds] = useState<number[]>([]);
    const [arrowUp, setArrowUp] = useState<boolean>(true);
    const [usersValue, setUsersValue] = useState<User[]>([]);

    const {
        usersStore: { users },
    } = useStore();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // if we hadn't store edited posts in local storage, we would have used
        // query params to fetch data from server, but since we use localstorage
        // with potential changes we search among stored posts
        // postsStore.fetchPosts(searchParams.toString());
        onChange(usersValue.map((u) => u.id));
    }, [usersValue]);

    useEffect(() => {
        let ids: number[] = [];
        for (let [_key, value] of searchParams) {
            ids.push(+value);
        }
        const usrs = users.filter((u) => ids.includes(u.id));
        setUsersValue(usrs);
    }, []);

    const handleClickArrow = () => {
        setArrowUp(!arrowUp);
        onClickArrow(!arrowUp);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Autocomplete
                multiple
                size="small"
                disablePortal
                value={usersValue}
                getOptionLabel={(user) => user.name}
                onChange={(_e, users) => {
                    const params = users.reduce((result, u) => {
                        return result + `userId=${u.id}&`;
                    }, "");
                    const ids = users.map((u) => u.id);
                    // setUserIds(ids);
                    setUsersValue(users.filter((u) => ids.includes(u.id)));
                    setSearchParams(params);
                }}
                id="combo-box-demo"
                options={users}
                sx={{
                    width: { xs: "100%", md: 500 },
                    backgroundColor: "white",
                }}
                renderInput={(params) => <TextField {...params} label="Filter by user..." />}
            />
            {arrowUp ? (
                <FaArrowUp onClick={handleClickArrow} size={16} style={{ cursor: "pointer" }} />
            ) : (
                <FaArrowDown onClick={handleClickArrow} size={16} style={{ cursor: "pointer" }} />
            )}
        </Box>
    );
};

export default observer(UserFilter);
