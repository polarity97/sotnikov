import { observer } from "mobx-react-lite";
import { useStore } from "../../store/useStore";
import Pagination from "../_ui/Pagination";
import { SxProps, Theme } from "@mui/material";

interface PostsPaginationProps {
    sx?: SxProps<Theme> | undefined;
}

const PostsPagination = ({ sx }: PostsPaginationProps) => {
    const { postsStore } = useStore();
    const { numberOfItems } = postsStore;

    const handleChangePage = (start: number, end: number) => {
        postsStore.setSlicePosts(start, end);
    };

    const handleChangeItemsPage = (itemsNumber: number) => {
        postsStore.setNumberOfItems(itemsNumber);
    };

    return (
        <Pagination
            sx={sx}
            count={postsStore.filteredPosts.length}
            onChangePage={handleChangePage}
            onChangeItemsPage={handleChangeItemsPage}
            itemsPerPage={numberOfItems}
        />
    );
};

export default observer(PostsPagination);
