import { Box, Fade, Modal, Typography } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { Photo } from "../../store/AlbumsStore";

interface ModalPhotoProps {
    open: boolean;
    photo: Photo;
    onClose: () => void;
}

const ModalPhoto = ({ open, photo, onClose }: ModalPhotoProps) => {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute" as "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: { xs: 300, sm: 400, md: "fit-content" },
                        backgroundColor: "bisque",
                        border: "2px solid #000",
                        borderRadius: "8px",
                        boxShadow: 24,
                        py: 2,
                        px: { xs: 2, sm: 4 },
                        outline: "none",
                    }}
                >
                    <Box mb={2} sx={{ display: "flex" }}>
                        <IoMdClose onClick={() => onClose()} style={{ marginLeft: "auto", cursor: "pointer" }} />
                    </Box>
                    <img style={{ width: "100%" }} src={`${photo?.url}`} alt={`${photo?.title}`} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {photo?.title}
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ModalPhoto;
