import { observer } from "mobx-react-lite";
import PostsPagination from "./Pagination";
import { Box } from "@mui/material";
import DeleteFavoriteItems from "../_ui/DeleteFavoriteItems";
import { useStore } from "../../store/useStore";
import AddPost from "./AddPost";
import FavoriteFilter from "../_ui/FavoriteFilter";
import TitleFilter from "../_ui/TitleFilter";
import UserFilter from "../_ui/UserFilter";

const PostsFilters = () => {
    const { postsStore } = useStore();
    const { selectedPosts } = postsStore;

    const handleConfirmDelete = () => {
        postsStore.deletePosts(selectedPosts.map((p) => p.id));
    };

    const handleConfirmFavorite = () => {
        postsStore.addToFavoriteSelected();
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
                <UserFilter
                    onChange={(userIds) => postsStore.setFilteredUserIds(userIds)}
                    onClickArrow={(arrowUp) => postsStore.setAscUserIds(arrowUp)}
                />
                <TitleFilter
                    onClickArrow={(arrowUp) => postsStore.setAscTitle(arrowUp)}
                    onChange={(val) => postsStore.setFilteredTitle(val)}
                />
                <FavoriteFilter
                    onChange={(active: boolean) => {
                        postsStore.setShowFavorites(active);
                    }}
                />
                <AddPost sx={{ marginLeft: { xs: "", md: "auto" } }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", flexDirection: { xs: "column", md: "row" } }}>
                {postsStore.showDelete && (
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
                            onConfirmFavorite={handleConfirmFavorite}
                            onConfirmDelete={handleConfirmDelete}
                            title="Actions"
                        />
                    </Box>
                )}
                <PostsPagination sx={{ marginLeft: "auto" }} />
            </Box>
        </>
    );
};

export default observer(PostsFilters);
