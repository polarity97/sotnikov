import axios from "axios";
import { Comment, Post } from "./store/PostsStore";
import { User } from "./store/UsersStore";
import { Album, Photo } from "./store/AlbumsStore";
import { Todo } from "./store/TodosStore";

export const uri = "https://jsonplaceholder.typicode.com";

const fetchPosts = (params: string = ""): Promise<Post[]> => {
    return axios.get(`${uri}/posts?${params}`).then((res) => res.data);
};

const fetchUsers = (): Promise<User[]> => {
    return axios.get(`${uri}/users`).then((res) => res.data);
};

const fetchUser = (id: number): Promise<User> => {
    return axios.get(`${uri}/users/${id}`).then((res) => res.data);
};

const fetchAllComments = (): Promise<Comment[]> => {
    return axios.get(`${uri}/comments`).then((res) => res.data);
};

const fetchComments = (postId: number): Promise<Comment[]> => {
    return axios.get(`${uri}/posts/${postId}/comments`).then((res) => res.data);
};

const addPost = (body: Partial<Post>): Promise<Post> => {
    return axios.post(`${uri}/posts`, body).then((res) => res.data);
};

const updatePost = (id: number, body: Partial<Post>): Promise<Post> => {
    return axios.patch(`${uri}/posts/${id}`, body).then((res) => res.data);
};

const deletePost = (id: number): Promise<Post> => {
    return axios.delete(`${uri}/posts/${id}`).then((res) => res.data);
};

const fetchAlbums = (params: string = ""): Promise<Album[]> => {
    return axios.get(`${uri}/albums?${params}`).then((res) => res.data);
};

const updateAlbum = (id: number, body: Partial<Album>): Promise<Post> => {
    return axios.patch(`${uri}/albums/${id}`, body).then((res) => res.data);
};

const deleteAlbum = (id: number): Promise<Album> => {
    return axios.delete(`${uri}/albums/${id}`).then((res) => res.data);
};

const fetchPhotos = (id: number): Promise<Photo[]> => {
    return axios.get(`${uri}/albums/${id}/photos`).then((res) => res.data);
};

const fetchTodos = (params: string = ""): Promise<Todo[]> => {
    return axios.get(`${uri}/todos?${params}`).then((res) => res.data);
};

const updateTodo = (id: number, body: Partial<Todo>): Promise<Todo> => {
    return axios.patch(`${uri}/todos/${id}`, body).then((res) => res.data);
};

const deleteTodo = (id: number): Promise<Todo> => {
    return axios.delete(`${uri}/todos/${id}`).then((res) => res.data);
};

const addTodo = (body: Partial<Todo>): Promise<Todo> => {
    return axios.post(`${uri}/todos`, body).then((res) => res.data);
};

export const api = {
    fetchPosts,
    fetchUser,
    fetchUsers,
    fetchPhotos,
    fetchAllComments,
    fetchComments,
    updatePost,
    addPost,
    deletePost,
    fetchAlbums,
    updateAlbum,
    deleteAlbum,
    fetchTodos,
    updateTodo,
    deleteTodo,
    addTodo,
};
