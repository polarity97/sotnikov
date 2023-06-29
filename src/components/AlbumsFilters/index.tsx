import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import DeleteFavoriteItems from "../_ui/DeleteFavoriteItems";
import { useStore } from "../../store/useStore";
import FavoriteFilter from "../_ui/FavoriteFilter";
import TitleFilter from "../_ui/TitleFilter";
import UserFilter from "../_ui/UserFilter";
import AlbumsPagination from "./Pagination";

const AlbumsFilters = () => {
    const { albumsStore } = useStore();
    const { selectedAlbums } = albumsStore;

    const handleConfirmDelete = () => {
        albumsStore.deleteAlbums(selectedAlbums.map((al) => al.id));
    };

    const handleConfirmFavorite = () => {
        albumsStore.addToFavoriteSelected();
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
                    onChange={(userIds) => albumsStore.setFilteredUserIds(userIds)}
                    onClickArrow={(arrowUp) => albumsStore.setAscUserIds(arrowUp)}
                />
                <TitleFilter
                    onClickArrow={(arrowUp) => albumsStore.setAscTitle(arrowUp)}
                    onChange={(val) => albumsStore.setFilteredTitle(val)}
                />
                <FavoriteFilter
                    onChange={(active: boolean) => {
                        albumsStore.setShowFavorites(active);
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", flexDirection: { xs: "column", md: "row" } }}>
                {albumsStore.showDelete && (
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
                <AlbumsPagination sx={{ marginLeft: "auto" }} />
            </Box>
        </>
    );
};

export default observer(AlbumsFilters);
