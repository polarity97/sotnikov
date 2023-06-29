import { Box, Button, Fade, Typography, Modal as ModalMui, Theme, SxProps } from "@mui/material";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    text: string;
    textStyles?: SxProps<Theme> | undefined;
}

const Modal = ({ open, onClose, onConfirm, text, textStyles }: ModalProps) => {
    return (
        <ModalMui open={open} onClose={() => onClose()} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
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
                        <IoMdClose onClick={() => onClose()} style={{ marginLeft: "auto", cursor: "pointer" }} />
                    </Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={textStyles}>
                        {text}
                    </Typography>
                    <Box sx={{ marginTop: "24px" }}>
                        <Button
                            onClick={() => {
                                onClose();
                                onConfirm();
                            }}
                            sx={{ lineHeight: "normal" }}
                            variant="contained"
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={() => onClose()}
                            sx={{ marginLeft: "12px", lineHeight: "normal" }}
                            variant="contained"
                            color="secondary"
                        >
                            No
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </ModalMui>
    );
};

export default Modal;
