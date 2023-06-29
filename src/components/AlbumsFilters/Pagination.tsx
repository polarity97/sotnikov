import { observer } from "mobx-react-lite";
import { useStore } from "../../store/useStore";
import Pagination from "../_ui/Pagination";
import { SxProps, Theme } from "@mui/material";

interface AlbumsPaginationProps {
    sx?: SxProps<Theme> | undefined;
}

const AlbumsPagination = ({ sx }: AlbumsPaginationProps) => {
    const { albumsStore } = useStore();
    const { numberOfItems } = albumsStore;

    const handleChangePage = (start: number, end: number) => {
        albumsStore.setSliceAlbums(start, end);
    };

    const handleChangeItemsPage = (itemsNumber: number) => {
        albumsStore.setNumberOfItems(itemsNumber);
    };

    return (
        <Pagination
            sx={sx}
            labelRowsPerPage="Albums per page"
            count={albumsStore.filteredAlbums.length}
            onChangePage={handleChangePage}
            onChangeItemsPage={handleChangeItemsPage}
            itemsPerPage={numberOfItems}
        />
    );
};

export default observer(AlbumsPagination);
