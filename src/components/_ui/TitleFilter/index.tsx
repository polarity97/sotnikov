import { Box, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface TitleFilterProps {
    onChange: (val: string) => void;
    onClickArrow: (arrowUp: boolean) => void;
}

const TitleFilter = ({ onChange, onClickArrow }: TitleFilterProps) => {
    const [arrowUp, setArrowUp] = useState<boolean>(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.currentTarget.value);
    };

    const handleClickArrow = () => {
        setArrowUp(!arrowUp);
        onClickArrow(!arrowUp);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField sx={{ backgroundColor: "white" }} onChange={handleChange} size="small" label="Filter by title..." />
            {arrowUp ? (
                <FaArrowUp onClick={handleClickArrow} size={16} style={{ cursor: "pointer" }} />
            ) : (
                <FaArrowDown onClick={handleClickArrow} size={16} style={{ cursor: "pointer" }} />
            )}
        </Box>
    );
};

export default TitleFilter;
