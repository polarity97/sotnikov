import { useEffect } from "react";
import { useStore } from "../../store/useStore";
import "./styles.scss";
import { observer } from "mobx-react-lite";
import TodoCard from "../../components/TodoCard";
import TodosFilters from "../../components/TodosFilters";

const TodosPage = () => {
    const { todosStore } = useStore();

    useEffect(() => {
        todosStore.fetchTodos();
    }, []);

    return (
        <div className="posts">
            <div className="posts__filters">
                <TodosFilters />
            </div>
            <div className="posts__posts">
                {todosStore.slicedTodos.map((todo, index) => (
                    <TodoCard key={index} todo={todo} />
                ))}
            </div>
        </div>
    );
};

export default observer(TodosPage);
