import { MdOutlineFavorite } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface FavoriteFilterProps {
    title?: string;
    isActive?: boolean;
    onChange: (active: boolean) => void;
    todo?: boolean;
}

const FavoriteFilter = ({ isActive = false, title = "Favorites", onChange, todo = false }: FavoriteFilterProps) => {
    const [active, setActive] = useState<boolean>(isActive);

    useEffect(() => {
        onChange(active);
    }, [active]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 1,
                px: 2,
                backgroundColor: "white",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: 1,
            }}
        >
            {title}{" "}
            {todo ? (
                <IoCheckmarkDoneSharp
                    onClick={() => {
                        setActive(!active);
                        onChange(!active);
                    }}
                    style={{ cursor: "pointer" }}
                    color={active ? "var(--active)" : "black"}
                    name="favorite"
                />
            ) : (
                <MdOutlineFavorite
                    onClick={() => {
                        setActive(!active);
                        onChange(!active);
                    }}
                    style={{ cursor: "pointer" }}
                    color={active ? "var(--active)" : "black"}
                    name="favorite"
                />
            )}
        </Box>
    );
};

export default FavoriteFilter;
