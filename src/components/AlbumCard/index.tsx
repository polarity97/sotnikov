import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineFavorite, MdDeleteForever } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import Modal from "../_ui/Modal";
import "./styles.scss";
// import { Comment } from "../../../store/CommentsStore";
import { useStore } from "../../store/useStore";
import { observer } from "mobx-react-lite";
import TextArea from "../_ui/TextArea";
import { Autocomplete, Button, Checkbox, TextField } from "@mui/material";
import { User } from "../../store/UsersStore";
import { Album } from "../../store/AlbumsStore";
import ModalPhoto from "./ModalPhoto";
import { Link } from "react-router-dom";

interface AlbumCardProps {
    album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
    const {
        albumsStore,
        usersStore: { users },
    } = useStore();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [revertTitle, setRevertTitle] = useState<string>(album.title);
    const [title, setTitle] = useState<string>(album.title);
    const [checked, setChecked] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined | null>(null);
    const [revertUser, setRevertUser] = useState<User | undefined | null>();

    useEffect(() => {
        setTitle(album.title);
        setRevertTitle(album.title);
        // see if our album should be checked or not
        albumsStore.selectedAlbums.map((p) => p.id).includes(album.id) ? setChecked(true) : setChecked(false);

        // find and set author of the album
        const author = users.find((u) => u.id === album.userId);
        setUser(author);
        setRevertUser(author);
    }, [album]);

    const handleSave = () => {
        const updates: { [key: string]: any } = {
            ...(title !== revertTitle && { title }),
        };
        if (user && revertUser && user.id !== revertUser.id) {
            updates["userId"] = user.id;
        }
        // console.log("updates", updates);
        updates && albumsStore.updateAlbum(album.id, updates);
        setIsEditable(false);
    };

    const handleDiscard = () => {
        title !== revertTitle && setTitle(revertTitle);
        user !== revertUser && setUser(revertUser);
        setIsEditable(false);
    };

    const handleConfirmModal = () => {
        albumsStore.deleteAlbum(album.id);
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(!checked);
        albumsStore.toggleAlbum(album.id, e.target.checked);
    };

    return (
        <div className="album-card">
            <div className="album-card__settings">
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ p: 0, "& .MuiSvgIcon-root": { fontSize: "1rem" } }}
                />
                <MdOutlineFavorite
                    onClick={() => albumsStore.toggleFavorite(album.id)}
                    className="album-card__favorite"
                    color={album?.isFavorite ? "var(--active)" : "black"}
                    name="favorite"
                />
                {!isEditable ? (
                    <BiSolidEdit onClick={() => setIsEditable(!isEditable)} className="album-card__edit" name="edit" />
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{ lineHeight: "normal" }}
                            onClick={() => handleSave()}
                            className="album-card__save"
                            color="primary"
                        >
                            Save
                        </Button>
                        <Button
                            sx={{ lineHeight: "normal" }}
                            variant="contained"
                            onClick={() => handleDiscard()}
                            className="album-card__discard"
                            color="secondary"
                        >
                            Discard
                        </Button>
                    </>
                )}
                <MdDeleteForever onClick={() => setOpenModal(true)} className="album-card__delete" />
                <Modal
                    onConfirm={handleConfirmModal}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    text="Are you sure you want to delete this post?"
                />
            </div>
            {!isEditable ? (
                <Link to={`/photos/${album.id}`} className="album-card__title">
                    {title}
                </Link>
            ) : (
                <TextArea onChange={(val) => setTitle(val)} className="album-card__title album-card__input" value={title} />
            )}

            <div style={{ display: "flex" }}>
                {!isEditable ? (
                    <div className="album-card__user">{user?.name || album.userId.toString()}</div>
                ) : (
                    <Autocomplete
                        disablePortal
                        size="small"
                        getOptionLabel={(user) => user.name}
                        onChange={(_e, user) => setUser(user)}
                        id="combo-box-demo"
                        options={users}
                        value={user}
                        sx={{
                            width: 250,
                            marginLeft: "auto",
                            backgroundColor: "white",
                        }}
                        renderInput={(params) => <TextField {...params} label="Search for user..." />}
                    />
                )}
            </div>
        </div>
    );
};

export default observer(AlbumCard);
