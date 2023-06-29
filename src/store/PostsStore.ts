import { observable, makeObservable, action, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { api } from "../api";
import { makePersistable } from "mobx-persist-store";

export interface Post {
    body: string;
    id: number;
    title: string;
    userId: number;
    isFavorite?: boolean;
}

export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

export class PostsStore {
    posts: Post[] = [];
    newPosts: Post[] = [];
    comments: Comment[] = [];
    favoritePostIds: number[] = [];
    editedPosts: Post[] = [];
    deletedPostIds: number[] = [];
    selectedPosts: Post[] = [];
    numberOfItems: number = 10;
    start: number = 0;
    end: number = 10;
    filteredUserIds: number[] = [];
    filteredTitle: string = "";
    showFavorites: boolean = false;
    ascUserIds: boolean | null = null;
    ascTitle: boolean | null = null;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            posts: observable,
            newPosts: observable,
            editedPosts: observable,
            selectedPosts: observable,
            deletedPostIds: observable,
            numberOfItems: observable,
            comments: observable,
            start: observable,
            end: observable,
            filteredUserIds: observable,
            filteredTitle: observable,
            showFavorites: observable,
            ascUserIds: observable,
            ascTitle: observable,
            setPosts: action,
            setFilteredUserIds: action,
            setFilteredTitle: action,
            toggleFavorite: action,
            setShowFavorites: action,
            _toggleFavoriteOne: action,
            addToFavoriteSelected: action,
            setAscUserIds: action,
            setAscTitle: action,
            togglePost: action,
            setSlicePosts: action,
            _updateSelectedPosts: action,
            _updateNewPosts: action,
            setNumberOfItems: action,
        });
        this.rootStore = rootStore;

        makePersistable(this, {
            name: "PostsStore",
            properties: ["numberOfItems", "editedPosts", "deletedPostIds", "newPosts"],
            storage: window.localStorage,
            expireIn: 3600000,
            removeOnExpiration: true,
        });
    }

    async fetchComments(postId: number) {
        const comments = await api.fetchComments(postId);
        return comments;
    }

    async fetchPosts(params: string = "") {
        const posts = await api.fetchPosts(params);
        this._combinePosts(posts);
    }

    setFilteredUserIds(userIds: number[]) {
        this.filteredUserIds = [...userIds];
    }

    setFilteredTitle(title: string) {
        this.filteredTitle = title;
    }

    setShowFavorites(show: boolean) {
        this.showFavorites = show;
    }

    setAscUserIds(asc: boolean) {
        this.ascUserIds = asc;
        // set ascTitle to null
        this.ascTitle = null;
    }

    setAscTitle(asc: boolean) {
        this.ascTitle = asc;
    }

    setSlicePosts(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    get showDelete() {
        return this.selectedPosts.length !== 0;
    }

    get slicedPosts() {
        return this.filteredPosts.slice(this.start, this.end);
    }

    get filteredPosts() {
        let posts = this.posts;
        // console.log("posts", posts);
        if (this.filteredUserIds.length) {
            posts = this.posts.filter((p) => this.filteredUserIds.includes(p.userId));
        }
        if (this.ascUserIds !== null) {
            posts = this.ascUserIds
                ? posts.slice().sort((a, b) => {
                      return a.userId > b.userId ? 1 : -1;
                  })
                : posts.slice().sort((a, b) => {
                      return a.userId > b.userId ? -1 : 1;
                  });
        }
        // console.log("posts1", posts);
        posts = posts.filter((p) => p.title.includes(this.filteredTitle));
        if (this.ascTitle !== null) {
            posts = this.ascTitle
                ? posts.slice().sort((a, b) => {
                      return a.title > b.title ? 1 : -1;
                  })
                : posts.slice().sort((a, b) => {
                      return a.title > b.title ? -1 : 1;
                  });
        }

        // console.log("posts2", posts);
        if (this.showFavorites) {
            posts = posts.filter((p) => p?.isFavorite);
        }
        // console.log("posts3", posts);
        return posts;
    }

    setPosts(posts: Post[]) {
        this.posts = posts;
    }

    setNumberOfItems(val: number) {
        this.numberOfItems = val;
        this.setSlicePosts(0, val);
    }

    addPost(body: Partial<Post>) {
        api.addPost(body).then(
            action("fetchSuccess", (newPost) => {
                if (this.newPosts.length) {
                    this.newPosts.push({ ...newPost, id: this.newPosts[this.newPosts.length - 1].id + 1 });
                } else {
                    this.newPosts.push({ ...newPost });
                }
                this._combinePosts();
            })
        );
    }

    updatePost(postId: number, body: Partial<Post>) {
        // updated for newly created posts
        if (this._isNewPost(postId)) {
            const postIndex = this.newPosts.findIndex((p) => p.id === postId);
            if (postIndex !== -1) {
                runInAction(() => {
                    this.newPosts[postIndex] = { ...this.newPosts[postIndex], ...body };
                    this._combinePosts();
                });
            }
        } else {
            api.updatePost(postId, body).then(
                action("fetchSuccess", (updatedPost) => {
                    const postIndex = this.editedPosts.findIndex((p) => p.id === postId);
                    if (postIndex !== -1) {
                        this.editedPosts[postIndex] = {
                            ...this.editedPosts[postIndex],
                            ...body,
                        };
                    } else {
                        this.editedPosts.push(updatedPost);
                    }
                    this._combinePosts();
                }),
                action("fetchError", (error) => {
                    console.log(error);
                })
            );
        }
    }

    deletePosts(postIds: number[]) {
        const defs: Promise<any>[] = [];
        postIds.forEach((id) => {
            const prom = api.deletePost(id);
            defs.push(prom);
        });
        Promise.all(defs).then(
            action("fetchSuccess", () => {
                this.deletedPostIds.push(...postIds);
                this._updateSelectedPosts(this.deletedPostIds);
                this._updateNewPosts(this.deletedPostIds);
                this._combinePosts();
            })
        );
    }

    _updateSelectedPosts(deletedPostIds: number[]) {
        this.selectedPosts = this.selectedPosts.filter((p) => !deletedPostIds.includes(p.id));
    }

    _updateNewPosts(deletedPostIds: number[]) {
        this.newPosts = this.newPosts.filter((p) => !deletedPostIds.includes(p.id));
    }

    deletePost(postId: number) {
        api.deletePost(postId).then(
            action("fetchSuccess", () => {
                this.deletedPostIds.push(postId);
                this._updateSelectedPosts(this.deletedPostIds);
                this._updateNewPosts(this.deletedPostIds);
                this._combinePosts();
            }),
            action("fetchError", (error) => {
                console.log(error);
            })
        );
    }

    addToFavoriteSelected() {
        this.selectedPosts
            .map((p) => p.id)
            .forEach((postId) => {
                if (this._isNewPost(postId)) {
                    const post = this.newPosts.find((p) => p.id === postId);
                    if (post) {
                        post.isFavorite = true;
                    }
                } else {
                    const post = this.editedPosts.find((p) => p.id === postId);
                    if (post) {
                        post.isFavorite = true;
                    } else {
                        const foundPost = this.posts.find((p) => p.id === postId);
                        if (foundPost) {
                            foundPost.isFavorite = true;
                            this.editedPosts.push({ ...foundPost });
                        }
                    }
                }
            });
        this.selectedPosts = [];
        this._combinePosts();
    }

    _toggleFavoriteOne(postId: number) {
        if (this._isNewPost(postId)) {
            const post = this.newPosts.find((p) => p.id === postId);
            if (post) {
                post.isFavorite = !post.isFavorite;
            }
        } else {
            const post = this.editedPosts.find((p) => p.id === postId);
            if (post) {
                post.isFavorite = !post.isFavorite;
            } else {
                const foundPost = this.posts.find((p) => p.id === postId);
                if (foundPost) {
                    foundPost.isFavorite = true;
                    this.editedPosts.push({ ...foundPost });
                }
            }
        }
    }

    toggleFavorite(postId: number) {
        this._toggleFavoriteOne(postId);
        this._combinePosts();
    }

    updateNumberOfItems(number: number) {
        this.numberOfItems = number;
    }

    togglePost(postId: number, checked: boolean) {
        const post = this._findPost(postId);
        if (post) {
            if (checked) {
                this.selectedPosts.push(post);
            } else {
                const postIndex = this.selectedPosts.findIndex((p) => p.id === post.id);
                if (postIndex !== -1) {
                    this.selectedPosts.splice(postIndex, 1);
                }
            }
        }
    }

    // Exclude deleted posts and search for edited posts
    // and replace corresponding ones in fetched posts
    // Include created posts in the final array
    _combinePosts(posts: Post[] = this.posts) {
        let combinedPosts = [...posts];
        if (this.deletedPostIds.length) {
            combinedPosts = combinedPosts.filter((p) => !this.deletedPostIds.includes(p.id));
        }
        if (this.editedPosts.length) {
            this.editedPosts.forEach((editedPost) => {
                const postIndex = combinedPosts.findIndex((p) => p.id === editedPost.id);
                if (postIndex !== -1) {
                    combinedPosts[postIndex] = { ...editedPost };
                }
            });
        }
        if (this.newPosts.length) {
            this.newPosts.forEach((newPost) => {
                const postIndex = combinedPosts.findIndex((p) => p.id === newPost.id);
                if (postIndex !== -1) {
                    combinedPosts[postIndex] = { ...newPost };
                } else {
                    combinedPosts.push({ ...newPost });
                }
            });
        }
        this.setPosts(combinedPosts);
    }

    _findPost(postId: number) {
        return this.posts.find((post) => post.id === postId);
    }

    _findIndexOfPost(postId: number) {
        return this.posts.findIndex((post) => post.id === postId);
    }

    _isNewPost(postId: number) {
        return this.newPosts.length && this.newPosts.map((p) => p.id).includes(postId);
    }
}
