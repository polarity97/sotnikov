import { ChangeEvent, useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import "./styles.scss";
import { useStore } from "../../store/useStore";
import { observer } from "mobx-react-lite";
import TextArea from "../_ui/TextArea";
import { Button, Checkbox } from "@mui/material";
import Modal from "../_ui/Modal";
import { Todo } from "../../store/TodosStore";
import classNames from "classnames";

interface TodoCard {
    todo: Todo;
}

const TodoCard = ({ todo }: TodoCard) => {
    const {
        todosStore,
        usersStore: { users },
    } = useStore();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(todo.title);
    const [revertTitle, setRevertTitle] = useState<string>(todo.title);
    const [completed, setCompleted] = useState<boolean>(todo.completed);
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        setTitle(todo.title);
        setRevertTitle(todo.title);
        setCompleted(todo.completed);
        // see if our todo should be checked or not
        todosStore.selectedTodos.map((p) => p.id).includes(todo.id) ? setChecked(true) : setChecked(false);
    }, [todo]);

    const handleSave = () => {
        const updates: { [key: string]: any } = {
            ...(title !== revertTitle && { title }),
        };
        updates && todosStore.updateTodo(todo.id, updates);
        setIsEditable(false);
    };

    const handleDiscard = () => {
        title !== revertTitle && setTitle(revertTitle);
        setIsEditable(false);
    };

    const handleConfirmModal = () => {
        todosStore.deleteTodo(todo.id);
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(!checked);
        todosStore.toggleTodo(todo.id, e.target.checked);
    };

    const titleClassnames = classNames({
        "todo-card__title": true,
        "todo-card__title--crossed": completed,
    });

    return (
        <div className="todo-card">
            <div className="todo-card__settings">
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ p: 0, "& .MuiSvgIcon-root": { fontSize: "1rem" } }}
                />
                <IoCheckmarkDoneSharp
                    onClick={() => {
                        setCompleted(!todo.completed);
                        todosStore.toggleCompleted(todo.id, !todo.completed);
                    }}
                    className="todo-card__favorite"
                    color={completed ? "var(--active)" : "black"}
                    name="favorite"
                />
                {!isEditable ? (
                    <BiSolidEdit onClick={() => setIsEditable(!isEditable)} className="todo-card__edit" name="edit" />
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{ lineHeight: "normal" }}
                            onClick={() => handleSave()}
                            className="todo-card__save"
                            color="primary"
                        >
                            Save
                        </Button>
                        <Button
                            sx={{ lineHeight: "normal" }}
                            variant="contained"
                            onClick={() => handleDiscard()}
                            className="todo-card__discard"
                            color="secondary"
                        >
                            Discard
                        </Button>
                    </>
                )}
                <MdDeleteForever onClick={() => setOpenModal(true)} className="todo-card__delete" />
                <Modal
                    onConfirm={handleConfirmModal}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    text="Are you sure you want to delete this todo?"
                />
            </div>
            {!isEditable ? (
                <div className={titleClassnames}>{title}</div>
            ) : (
                <TextArea onChange={(val) => setTitle(val)} className="todo-card__title todo-card__input" value={title} />
            )}
        </div>
    );
};

export default observer(TodoCard);
