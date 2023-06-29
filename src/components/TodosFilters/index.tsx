import { observer } from "mobx-react-lite";
import TodosPagination from "./Pagination";
import { Box } from "@mui/material";
import DeleteFavoriteItems from "../_ui/DeleteFavoriteItems";
import { useStore } from "../../store/useStore";
import FavoriteFilter from "../_ui/FavoriteFilter";
import TitleFilter from "../_ui/TitleFilter";
import AddTodo from "./AddTodo";

const TodosFilters = () => {
    const { todosStore } = useStore();
    const { selectedTodos } = todosStore;

    const handleConfirmDelete = () => {
        todosStore.deleteTodos(selectedTodos.map((p) => p.id));
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 2, md: 4 },
                    flexDirection: { xs: "column", md: "row" },
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                <TitleFilter
                    onClickArrow={(arrowUp) => todosStore.setAscTitle(arrowUp)}
                    onChange={(val) => todosStore.setFilteredTitle(val)}
                />
                <FavoriteFilter
                    title="Completed"
                    todo
                    isActive
                    onChange={(active: boolean) => {
                        todosStore.setShowCompleted(active);
                    }}
                />
                <AddTodo sx={{ marginLeft: { xs: "", md: "auto" } }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", flexDirection: { xs: "column", md: "row" } }}>
                {todosStore.showDelete && (
                    <Box
                        sx={{
                            position: { lg: "absolute" },
                            display: "flex",
                            justifyContent: "center",
                            left: { lg: 0 },
                            right: { lg: "0" },
                            margin: { lg: "auto" },
                        }}
                    >
                        <DeleteFavoriteItems
                            favorite={false}
                            onConfirmFavorite={() => {}}
                            onConfirmDelete={handleConfirmDelete}
                            title="Actions"
                        />
                    </Box>
                )}
                <TodosPagination sx={{ marginLeft: "auto" }} />
            </Box>
        </>
    );
};

export default observer(TodosFilters);
