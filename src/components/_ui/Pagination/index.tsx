import { TablePagination } from "@mui/material";
import { SxProps, Theme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

interface Pagination {
    count: number;
    onChangePage: (start: number, end: number) => void;
    onChangeItemsPage: (val: number) => void;
    itemsPerPage: number;
    sx?: SxProps<Theme> | undefined;
}

const Pagination = ({ sx, onChangePage, onChangeItemsPage, itemsPerPage, count }: Pagination) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        onChangePage(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeItemsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = parseInt(event.target.value, 10);
        setRowsPerPage(val);
        setPage(0);
        onChangeItemsPage(val);
    };

    const rowsPerPageOptions = useMemo(() => {
        return [
            { label: "10", value: 10 },
            { label: "20", value: 20 },
            { label: "50", value: 50 },
            { label: "100", value: 100 },
            { label: "all", value: -1 },
        ];
    }, []);

    useEffect(() => {
        onChangePage(0, rowsPerPage);
        setPage(0);
    }, [count]);

    return (
        <TablePagination
            sx={sx}
            component="div"
            count={count}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage="Posts per page"
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeItemsPerPage}
        />
    );
};

export default Pagination;
