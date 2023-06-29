import { Box, Fade, Grid, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ModalPhoto from "../../components/ModalPhoto";
import { IoMdClose } from "react-icons/io";
import { Photo } from "../../store/AlbumsStore";

const PhotosPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [clickedPhoto, setClickedPhoto] = useState<Photo | null>(null);

    const { albumsStore } = useStore();
    const { id } = useParams();

    useEffect(() => {
        id && albumsStore.fetchPhotos(+id);
    }, []);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <Box sx={{ px: 4, py: 2 }}>
            <Grid justifyContent="center" container spacing={4}>
                {albumsStore.photos.map((photo, index) => (
                    <Grid
                        onClick={() => {
                            setClickedPhoto(photo);
                            setOpenModal(true);
                        }}
                        item
                        key={index}
                    >
                        {loading && <img src={`${photo.thumbnailUrl}`} alt={photo.title} loading="lazy" />}
                        <img
                            style={{ maxWidth: "300px", cursor: "pointer" }}
                            src={`${photo.url}`}
                            alt={photo.title}
                            loading="lazy"
                            onLoad={handleLoad}
                        />
                        <Typography sx={{ maxWidth: "300px" }}>{photo.title}</Typography>
                    </Grid>
                ))}
            </Grid>
            <ModalPhoto open={openModal} onClose={() => setOpenModal(false)} photo={clickedPhoto} />
        </Box>
    );
};

export default observer(PhotosPage);
