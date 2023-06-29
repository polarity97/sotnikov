import { Box, Button, Fade, Modal, SxProps, Theme, Typography } from "@mui/material";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface DeleteFavoriteItemsProps {
    title: string;
    onConfirmDelete: () => void;
    onConfirmFavorite: () => void;
    buttonStyle?: SxProps<Theme> | undefined;
    favorite?: boolean;
}

const DeleteFavoriteItems = ({ title, onConfirmDelete, onConfirmFavorite, buttonStyle, favorite = true }: DeleteFavoriteItemsProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button sx={{ ...buttonStyle, lineHeight: "normal" }} onClick={() => setOpen(true)} variant="contained">
                {title}
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute" as "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: 300, sm: 400 },
                            backgroundColor: "bisque",
                            border: "2px solid #000",
                            borderRadius: "8px",
                            boxShadow: 24,
                            py: 2,
                            px: { xs: 2, sm: 4 },
                            outline: "none",
                        }}
                    >
                        <Box sx={{ display: "flex" }}>
                            <IoMdClose onClick={() => setOpen(false)} style={{ marginLeft: "auto", cursor: "pointer" }} />
                        </Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete or add to favorite.
                        </Typography>
                        <Box sx={{ marginTop: "24px" }}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                    onConfirmDelete();
                                }}
                                sx={{ lineHeight: "normal" }}
                                variant="contained"
                            >
                                Delete
                            </Button>
                            {favorite && (
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                        onConfirmFavorite();
                                    }}
                                    sx={{ marginLeft: "12px", lineHeight: "normal" }}
                                    variant="contained"
                                    color="warning"
                                >
                                    Add to favorites
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default DeleteFavoriteItems;
