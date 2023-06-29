import { Autocomplete, Box, Button, Fade, Modal, SxProps, TextField, Theme, Typography } from "@mui/material";
import { useState } from "react";
import { useStore } from "../../store/useStore";
import { User } from "../../store/UsersStore";

interface AddPost {
    sx?: SxProps<Theme> | undefined;
}

const AddPost = ({ sx }: AddPost) => {
    const {
        postsStore,
        usersStore: { users },
    } = useStore();

    const [open, setOpen] = useState<boolean>(false);
    const [userError, setUserError] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [bodyError, setBodyError] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined | null>(null);
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const handleSubmit = () => {
        title.trim() === "" ? setTitleError(true) : setTitleError(false);
        body.trim() === "" ? setBodyError(true) : setBodyError(false);
        !user ? setUserError(true) : setUserError(false);
        if (!userError && !bodyError && !titleError && user) {
            postsStore.addPost({
                userId: user.id,
                title: title,
                body: body,
            });
            setUser(null);
            setBody("");
            setTitle("");
            setOpen(false);
        }
    };

    return (
        <>
            <Button sx={sx} variant="contained" onClick={() => setOpen(true)}>
                Add post
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
                            Add post
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
                        <TextField
                            sx={{ backgroundColor: "white", width: "100%", marginBottom: 2 }}
                            placeholder="Body"
                            multiline
                            rows={4}
                            onChange={(e) => {
                                setBody(e.currentTarget.value);
                                !e.currentTarget.value.trim() && setBodyError(true);
                            }}
                            label="You should fill this field!"
                            error={bodyError}
                        />
                        <Autocomplete
                            disablePortal
                            size="small"
                            getOptionLabel={(user) => user.name}
                            onChange={(_e, user) => {
                                setUser(user);
                                !user && setUserError(true);
                            }}
                            id="combo-box-demo"
                            options={users}
                            value={user}
                            sx={{
                                width: "100%",
                                marginLeft: "auto",
                                backgroundColor: "white",
                                marginBottom: 2,
                            }}
                            renderInput={(params) => <TextField {...params} label="Select user..." error={userError} />}
                        />
                        <Button onClick={handleSubmit} size="small" variant="contained">
                            Create post
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default AddPost;
