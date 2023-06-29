import { observable, makeObservable, action, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { api } from "../api";
import { makePersistable } from "mobx-persist-store";

export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export class TodosStore {
    todos: Todo[] = [];
    newTodos: Todo[] = [];
    completedTodoIds: number[] = [];
    editedTodos: Todo[] = [];
    deletedTodoIds: number[] = [];
    selectedTodos: Todo[] = [];
    numberOfItems: number = 10;
    start: number = 0;
    end: number = 10;
    filteredTitle: string = "";
    showCompleted: boolean = false;
    ascTitle: boolean | null = null;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            todos: observable,
            newTodos: observable,
            editedTodos: observable,
            selectedTodos: observable,
            deletedTodoIds: observable,
            numberOfItems: observable,
            start: observable,
            end: observable,
            filteredTitle: observable,
            showCompleted: observable,
            ascTitle: observable,
            setTodos: action,
            setFilteredTitle: action,
            toggleCompleted: action,
            setShowCompleted: action,
            setAscTitle: action,
            toggleTodo: action,
            setSliceTodos: action,
            _updateSelectedTodos: action,
            _updateNewTodos: action,
            setNumberOfItems: action,
        });
        this.rootStore = rootStore;

        makePersistable(this, {
            name: "TodosStore",
            properties: ["numberOfItems", "editedTodos", "deletedTodoIds", "newTodos"],
            storage: window.localStorage,
            expireIn: 3600000,
            removeOnExpiration: true,
        });
    }

    async fetchComments(todoId: number) {
        const comments = await api.fetchComments(todoId);
        return comments;
    }

    async fetchTodos(params: string = "") {
        const todos = await api.fetchTodos(params);
        this._combineTodos(todos);
    }

    setFilteredTitle(title: string) {
        this.filteredTitle = title;
    }

    setShowCompleted(show: boolean) {
        this.showCompleted = show;
    }

    setAscTitle(asc: boolean) {
        this.ascTitle = asc;
    }

    setSliceTodos(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    get showDelete() {
        return this.selectedTodos.length !== 0;
    }

    get slicedTodos() {
        return this.filteredTodos.slice(this.start, this.end);
    }

    get filteredTodos() {
        let todos = this.todos;
        todos = todos.filter((el) => el.title.includes(this.filteredTitle));
        if (this.ascTitle !== null) {
            todos = this.ascTitle
                ? todos.slice().sort((a, b) => {
                      return a.title > b.title ? 1 : -1;
                  })
                : todos.slice().sort((a, b) => {
                      return a.title > b.title ? -1 : 1;
                  });
        }

        if (this.showCompleted) {
            todos = todos.filter((el) => el?.completed);
        }
        return todos;
    }

    setTodos(todos: Todo[]) {
        this.todos = todos;
    }

    setNumberOfItems(val: number) {
        this.numberOfItems = val;
        this.setSliceTodos(0, val);
    }

    addTodo(body: Partial<Todo>) {
        api.addTodo(body).then(
            action("fetchSuccess", (newTodo) => {
                if (this.newTodos.length) {
                    this.newTodos.push({ ...newTodo, id: this.newTodos[this.newTodos.length - 1].id + 1 });
                } else {
                    this.newTodos.push({ ...newTodo });
                }
                this._combineTodos();
            })
        );
    }

    updateTodo(todoId: number, body: Partial<Todo>) {
        // updated for newly created todos
        if (this._isNewTodo(todoId)) {
            const todoIndex = this.newTodos.findIndex((el) => el.id === todoId);
            if (todoIndex !== -1) {
                runInAction(() => {
                    this.newTodos[todoIndex] = { ...this.newTodos[todoIndex], ...body };
                    this._combineTodos();
                });
            }
        } else {
            api.updateTodo(todoId, body).then(
                action("fetchSuccess", (updatedTodo) => {
                    const todoIndex = this.editedTodos.findIndex((el) => el.id === todoId);
                    if (todoIndex !== -1) {
                        this.editedTodos[todoIndex] = {
                            ...this.editedTodos[todoIndex],
                            ...body,
                        };
                    } else {
                        this.editedTodos.push(updatedTodo);
                    }
                    this._combineTodos();
                }),
                action("fetchError", (error) => {
                    console.log(error);
                })
            );
        }
    }

    deleteTodos(todoIds: number[]) {
        const defs: Promise<any>[] = [];
        todoIds.forEach((id) => {
            const prom = api.deleteTodo(id);
            defs.push(prom);
        });
        Promise.all(defs).then(
            action("fetchSuccess", () => {
                this.deletedTodoIds.push(...todoIds);
                this._updateSelectedTodos(this.deletedTodoIds);
                this._updateNewTodos(this.deletedTodoIds);
                this._combineTodos();
            })
        );
    }

    _updateSelectedTodos(deletedTodoIds: number[]) {
        this.selectedTodos = this.selectedTodos.filter((el) => !deletedTodoIds.includes(el.id));
    }

    _updateNewTodos(deletedTodoIds: number[]) {
        this.newTodos = this.newTodos.filter((el) => !deletedTodoIds.includes(el.id));
    }

    deleteTodo(todoId: number) {
        api.deleteTodo(todoId).then(
            action("fetchSuccess", () => {
                this.deletedTodoIds.push(todoId);
                this._updateSelectedTodos(this.deletedTodoIds);
                this._updateNewTodos(this.deletedTodoIds);
                this._combineTodos();
            }),
            action("fetchError", (error) => {
                console.log(error);
            })
        );
    }

    toggleCompleted(todoId: number, completed: boolean) {
        if (this._isNewTodo(todoId)) {
            const todo = this.newTodos.find((el) => el.id === todoId);
            if (todo) {
                todo.completed = completed;
            }
        } else {
            this.updateTodo(todoId, { completed: completed });
        }
    }

    updateNumberOfItems(number: number) {
        this.numberOfItems = number;
    }

    toggleTodo(todoId: number, checked: boolean) {
        const todo = this._findTodo(todoId);
        if (todo) {
            if (checked) {
                this.selectedTodos.push(todo);
            } else {
                const todoIndex = this.selectedTodos.findIndex((el) => el.id === todo.id);
                if (todoIndex !== -1) {
                    this.selectedTodos.splice(todoIndex, 1);
                }
            }
        }
    }

    // Exclude deleted todos and search for edited todos
    // and replace corresponding ones in fetched todos
    // Include created todos in the final array
    _combineTodos(todos: Todo[] = this.todos) {
        let combinedTodos = [...todos];
        if (this.deletedTodoIds.length) {
            combinedTodos = combinedTodos.filter((el) => !this.deletedTodoIds.includes(el.id));
        }
        if (this.editedTodos.length) {
            this.editedTodos.forEach((editedTodo) => {
                const todoIndex = combinedTodos.findIndex((el) => el.id === editedTodo.id);
                if (todoIndex !== -1) {
                    combinedTodos[todoIndex] = { ...editedTodo };
                }
            });
        }
        if (this.newTodos.length) {
            this.newTodos.forEach((newTodo) => {
                const todoIndex = combinedTodos.findIndex((el) => el.id === newTodo.id);
                if (todoIndex !== -1) {
                    combinedTodos[todoIndex] = { ...newTodo };
                } else {
                    combinedTodos.push({ ...newTodo });
                }
            });
        }
        this.setTodos(combinedTodos);
    }

    _findTodo(todoId: number) {
        return this.todos.find((todo) => todo.id === todoId);
    }

    _findIndexOfTodo(todoId: number) {
        return this.todos.findIndex((todo) => todo.id === todoId);
    }

    _isNewTodo(todoId: number) {
        return this.newTodos.length && this.newTodos.map((el) => el.id).includes(todoId);
    }
}
