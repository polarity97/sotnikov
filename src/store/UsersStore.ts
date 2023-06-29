import { observable, makeObservable, action } from "mobx";
import { RootStore } from "./RootStore";
import { api } from "../api";
import { makePersistable } from "mobx-persist-store";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
        phone: string;
        website: string;
        company: {
            name: string;
            catchPhrase: string;
            bs: string;
        };
    };
}

export interface UserDropdown {
    val: string;
    key: number;
    text: string;
}

export class UsersStore {
    users: User[] = [];
    // usersDropdown: UserDropdown[] = [];
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            users: observable,
            // usersDropdown: observable,
            setUsers: action,
        });
        this.rootStore = rootStore;

        makePersistable(this, {
            name: "UsersStore",
            properties: ["users"],
            storage: window.localStorage,
            expireIn: 3600000,
            removeOnExpiration: true,
        });
    }

    async fetchUsers() {
        const users = await api.fetchUsers();
        this.setUsers(users);
    }

    setUsers(users: User[]) {
        this.users = users;
        // this.setUsersDropdown(users);
    }

    // setUsersDropdown(users: User[]) {
    //     this.usersDropdown = users.map((user) => ({
    //         key: user.id,
    //         val: user.username,
    //         text: user.name,
    //     }));
    // }
}
