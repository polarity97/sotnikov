import { Box, Button, Fade, Modal, SxProps, TextField, Theme, Typography } from "@mui/material";
import { useState } from "react";
import { useStore } from "../../store/useStore";

interface AddPost {
    sx?: SxProps<Theme> | undefined;
}

const AddTodo = ({ sx }: AddPost) => {
    const { todosStore } = useStore();

    const [open, setOpen] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const handleSubmit = () => {
        title.trim() === "" ? setTitleError(true) : setTitleError(false);
        console.log("titleError", titleError);
        console.log("title", title);
        if (!titleError) {
            todosStore.addTodo({
                title: title,
            });
            setTitle("");
            setOpen(false);
        }
    };

    return (
        <>
            <Button sx={sx} variant="contained" onClick={() => setOpen(true)}>
                Add todo
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
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
                            py: 4,
                            px: { xs: 2, sm: 4 },
                            outline: "none",
                        }}
                    >
                        <Typography mb={2} variant="h6" component="h2">
                            Add todo
                        </Typography>
                        <TextField
                            sx={{ backgroundColor: "white", width: "100%", marginBottom: 2 }}
                            placeholder="Title"
                            multiline
                            rows={2}
                            onChange={(e) => {
                                setTitle(e.currentTarget.value);
                                !e.currentTarget.value.trim() && setTitleError(true);
                            }}
                            label="You should fill this field!"
                            error={titleError}
                        />

                        <Button onClick={handleSubmit} size="small" variant="contained">
                            Create todo
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default AddTodo;
