import { AlbumsStore } from "./AlbumsStore";
import { PostsStore } from "./PostsStore";
import { TodosStore } from "./TodosStore";
import { UsersStore } from "./UsersStore";

export class RootStore {
    postsStore: PostsStore;
    usersStore: UsersStore;
    albumsStore: AlbumsStore;
    todosStore: TodosStore;

    constructor() {
        this.postsStore = new PostsStore(this);
        this.usersStore = new UsersStore(this);
        this.albumsStore = new AlbumsStore(this);
        this.todosStore = new TodosStore(this);
    }
}

const rootStore = new RootStore();

export default rootStore;
