import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineFavorite, MdDeleteForever } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import "./styles.scss";
// import { Comment } from "../../../store/CommentsStore";
import { Comment, Post } from "../../store/PostsStore";
import { useStore } from "../../store/useStore";
import { observer } from "mobx-react-lite";
import TextArea from "../_ui/TextArea";
import { Autocomplete, Button, Checkbox, TextField } from "@mui/material";
import { User } from "../../store/UsersStore";
import Modal from "../_ui/Modal";

interface PostCard {
    post: Post;
}

const PostCard = ({ post }: PostCard) => {
    const {
        postsStore,
        usersStore: { users },
    } = useStore();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [revertTitle, setRevertTitle] = useState<string>(post.title);
    const [title, setTitle] = useState<string>(post.title);
    const [body, setBody] = useState<string>(post.body);
    const [revertBody, setRevertBody] = useState<string>(post.body);
    const [checked, setChecked] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined | null>(null);
    const [revertUser, setRevertUser] = useState<User | undefined | null>();

    useEffect(() => {
        const fetchComments = async () => {
            const data = await postsStore.fetchComments(post.id);
            setComments(data);
            setCommentsOpen(false);
        };
        fetchComments();
    }, [post]);

    useEffect(() => {
        setTitle(post.title);
        setRevertTitle(post.title);
        setBody(post.body);
        setRevertBody(post.body);
        // see if our post should be checked or not
        postsStore.selectedPosts.map((p) => p.id).includes(post.id) ? setChecked(true) : setChecked(false);

        // find and set author of the post
        const author = users.find((u) => u.id === post.userId);
        setUser(author);
        setRevertUser(author);
    }, [post]);

    const handleSave = () => {
        const updates: { [key: string]: any } = {
            ...(title !== revertTitle && { title }),
            ...(body !== revertBody && { body }),
        };
        if (user && revertUser && user.id !== revertUser.id) {
            updates["userId"] = user.id;
        }
        updates && postsStore.updatePost(post.id, updates);
        setIsEditable(false);
    };

    const handleDiscard = () => {
        title !== revertTitle && setTitle(revertTitle);
        body !== revertBody && setBody(revertBody);
        user !== revertUser && setUser(revertUser);
        setIsEditable(false);
    };

    const handleConfirmModal = () => {
        postsStore.deletePost(post.id);
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(!checked);
        postsStore.togglePost(post.id, e.target.checked);
    };

    return (
        <div className="post-card">
            <div className="post-card__settings">
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ p: 0, "& .MuiSvgIcon-root": { fontSize: "1rem" } }}
                />
                <MdOutlineFavorite
                    onClick={() => postsStore.toggleFavorite(post.id)}
                    className="post-card__favorite"
                    color={post?.isFavorite ? "var(--active)" : "black"}
                    name="favorite"
                />
                {!isEditable ? (
                    <BiSolidEdit onClick={() => setIsEditable(!isEditable)} className="post-card__edit" name="edit" />
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{ lineHeight: "normal" }}
                            onClick={() => handleSave()}
                            className="post-card__save"
                            color="primary"
                        >
                            Save
                        </Button>
                        <Button
                            sx={{ lineHeight: "normal" }}
                            variant="contained"
                            onClick={() => handleDiscard()}
                            className="post-card__discard"
                            color="secondary"
                        >
                            Discard
                        </Button>
                    </>
                )}
                <FaComment
                    onClick={() => setCommentsOpen(!commentsOpen)}
                    color={commentsOpen ? "var(--active)" : "black"}
                    className="post-card__comments-icon"
                    name="comment"
                />
                <MdDeleteForever onClick={() => setOpenModal(true)} className="post-card__delete" />
                <Modal
                    onConfirm={handleConfirmModal}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    text="Are you sure you want to delete this post?"
                />
            </div>
            {!isEditable ? (
                <div className="post-card__title">{title}</div>
            ) : (
                <TextArea onChange={(val) => setTitle(val)} className="post-card__title post-card__input" value={title} />
            )}
            {!isEditable ? (
                <div className="post-card__text">{body}</div>
            ) : (
                <TextArea onChange={(val) => setBody(val)} className="post-card__text post-card__input" value={body} />
            )}

            <div style={{ display: "flex" }}>
                {!isEditable ? (
                    <div className="post-card__user">{user?.name || post.userId.toString()}</div>
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
            {commentsOpen && (
                <>
                    <div className="post-card__comments-title">Comments</div>
                    <div className="post-card__comments comments">
                        {comments.map((comment) => (
                            <div key={comment.id} className="post-card__comment comment">
                                {/* <div className="comment__name">
                                    {users.find((user) => user.email === comment.email)?.name || comment.id}
                                </div> */}
                                <div className="comment__email">Email: {comment.email}</div>
                                <div className="comment__text">{comment.body}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default observer(PostCard);
