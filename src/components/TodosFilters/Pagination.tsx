import { observer } from "mobx-react-lite";
import { useStore } from "../../store/useStore";
import Pagination from "../_ui/Pagination";
import { SxProps, Theme } from "@mui/material";

interface TodosPaginationProps {
    sx?: SxProps<Theme> | undefined;
}

const TodosPagination = ({ sx }: TodosPaginationProps) => {
    const { todosStore } = useStore();
    const { numberOfItems } = todosStore;

    const handleChangePage = (start: number, end: number) => {
        todosStore.setSliceTodos(start, end);
    };

    const handleChangeItemsPage = (itemsNumber: number) => {
        todosStore.setNumberOfItems(itemsNumber);
    };

    return (
        <Pagination
            sx={sx}
            labelRowsPerPage="Todos per page"
            count={todosStore.filteredTodos.length}
            onChangePage={handleChangePage}
            onChangeItemsPage={handleChangeItemsPage}
            itemsPerPage={numberOfItems}
        />
    );
};

export default observer(TodosPagination);
