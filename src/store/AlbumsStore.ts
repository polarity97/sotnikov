import { observable, makeObservable, action, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { api } from "../api";
import { makePersistable } from "mobx-persist-store";

export interface Album {
    userId: number;
    id: number;
    title: string;
    isFavorite?: boolean;
}

export interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export class AlbumsStore {
    albums: Album[] = [];
    photos: Photo[] = [];
    favoriteAlbumIds: number[] = [];
    editedAlbums: Album[] = [];
    deletedAlbumIds: number[] = [];
    selectedAlbums: Album[] = [];
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
            albums: observable,
            photos: observable,
            editedAlbums: observable,
            selectedAlbums: observable,
            deletedAlbumIds: observable,
            numberOfItems: observable,
            start: observable,
            end: observable,
            filteredUserIds: observable,
            filteredTitle: observable,
            showFavorites: observable,
            ascUserIds: observable,
            ascTitle: observable,
            setAlbums: action,
            setFilteredUserIds: action,
            setFilteredTitle: action,
            toggleFavorite: action,
            setShowFavorites: action,
            _toggleFavoriteOne: action,
            addToFavoriteSelected: action,
            setAscUserIds: action,
            setAscTitle: action,
            toggleAlbum: action,
            setSliceAlbums: action,
            _updateSelectedAlbums: action,
            setNumberOfItems: action,
        });
        this.rootStore = rootStore;

        makePersistable(this, {
            name: "AlbumsStore",
            properties: ["numberOfItems", "editedAlbums", "deletedAlbumIds"],
            storage: window.localStorage,
            expireIn: 3600000,
            removeOnExpiration: true,
        });
    }
    async fetchAlbums(params: string = "") {
        const albums = await api.fetchAlbums(params);
        this._combineAlbums(albums);
    }

    fetchPhotos(albumId: number) {
        api.fetchPhotos(albumId).then(
            action("fetchSuccess", (photos) => {
                this.photos = photos;
            })
        );
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

    setSliceAlbums(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    get showDelete() {
        return this.selectedAlbums.length !== 0;
    }

    get slicedAlbums() {
        return this.filteredAlbums.slice(this.start, this.end);
    }

    get filteredAlbums() {
        let albums = this.albums;
        // console.log("albums", albums);
        if (this.filteredUserIds.length) {
            albums = this.albums.filter((al) => this.filteredUserIds.includes(al.userId));
        }
        if (this.ascUserIds !== null) {
            albums = this.ascUserIds
                ? albums.slice().sort((a, b) => {
                      return a.userId > b.userId ? 1 : -1;
                  })
                : albums.slice().sort((a, b) => {
                      return a.userId > b.userId ? -1 : 1;
                  });
        }
        // console.log("Albums1", albums);
        albums = albums.filter((al) => al.title.includes(this.filteredTitle));
        if (this.ascTitle !== null) {
            albums = this.ascTitle
                ? albums.slice().sort((a, b) => {
                      return a.title > b.title ? 1 : -1;
                  })
                : albums.slice().sort((a, b) => {
                      return a.title > b.title ? -1 : 1;
                  });
        }

        // console.log("Albums2", albums);
        if (this.showFavorites) {
            albums = albums.filter((al) => al?.isFavorite);
        }
        // console.log("Albums3", albums);
        return albums;
    }

    setAlbums(albums: Album[]) {
        this.albums = albums;
    }

    setNumberOfItems(val: number) {
        this.numberOfItems = val;
        this.setSliceAlbums(0, val);
    }

    updateAlbum(albumId: number, body: Partial<Album>) {
        api.updateAlbum(albumId, body).then(
            action("fetchSuccess", (updatedAlbum) => {
                const postIndex = this.editedAlbums.findIndex((al) => al.id === albumId);
                if (postIndex !== -1) {
                    this.editedAlbums[postIndex] = {
                        ...this.editedAlbums[postIndex],
                        ...body,
                    };
                } else {
                    this.editedAlbums.push(updatedAlbum);
                }
                this._combineAlbums();
            }),
            action("fetchError", (error) => {
                console.log(error);
            })
        );
    }

    deleteAlbums(albumIds: number[]) {
        const defs: Promise<any>[] = [];
        albumIds.forEach((id) => {
            const prom = api.deleteAlbum(id);
            defs.push(prom);
        });
        Promise.all(defs).then(
            action("fetchSuccess", () => {
                this.deletedAlbumIds.push(...albumIds);
                this._updateSelectedAlbums(this.deletedAlbumIds);
                this._combineAlbums();
            })
        );
    }

    _updateSelectedAlbums(deletedAlbumIds: number[]) {
        this.selectedAlbums = this.selectedAlbums.filter((al) => !deletedAlbumIds.includes(al.id));
    }

    deleteAlbum(albumId: number) {
        api.deleteAlbum(albumId).then(
            action("fetchSuccess", () => {
                this.deletedAlbumIds.push(albumId);
                this._updateSelectedAlbums(this.deletedAlbumIds);
                this._combineAlbums();
            }),
            action("fetchError", (error) => {
                console.log(error);
            })
        );
    }

    addToFavoriteSelected() {
        this.selectedAlbums
            .map((al) => al.id)
            .forEach((albumId) => {
                const album = this.editedAlbums.find((al) => al.id === albumId);
                if (album) {
                    album.isFavorite = true;
                } else {
                    const foundAlbum = this.albums.find((al) => al.id === albumId);
                    if (foundAlbum) {
                        foundAlbum.isFavorite = true;
                        this.editedAlbums.push({ ...foundAlbum });
                    }
                }
            });
        this.selectedAlbums = [];
        this._combineAlbums();
    }

    _toggleFavoriteOne(albumId: number) {
        const album = this.editedAlbums.find((al) => al.id === albumId);
        if (album) {
            album.isFavorite = !album.isFavorite;
        } else {
            const foundAlbum = this.albums.find((al) => al.id === albumId);
            if (foundAlbum) {
                foundAlbum.isFavorite = true;
                this.editedAlbums.push({ ...foundAlbum });
            }
        }
    }

    toggleFavorite(albumId: number) {
        this._toggleFavoriteOne(albumId);
        this._combineAlbums();
    }

    updateNumberOfItems(number: number) {
        this.numberOfItems = number;
    }

    toggleAlbum(albumId: number, checked: boolean) {
        const album = this._findAlbum(albumId);
        if (album) {
            if (checked) {
                this.selectedAlbums.push(album);
            } else {
                const albumIndex = this.selectedAlbums.findIndex((al) => al.id === album.id);
                if (albumIndex !== -1) {
                    this.selectedAlbums.splice(albumIndex, 1);
                }
            }
        }
    }

    // Exclude deleted albums and search for edited albums
    // and replace corresponding ones in fetched albums
    // Include created albums in the final array
    _combineAlbums(albums: Album[] = this.albums) {
        let combinedAlbums = [...albums];
        if (this.deletedAlbumIds.length) {
            combinedAlbums = combinedAlbums.filter((al) => !this.deletedAlbumIds.includes(al.id));
        }
        if (this.editedAlbums.length) {
            this.editedAlbums.forEach((editedAlbum) => {
                const albumIndex = combinedAlbums.findIndex((al) => al.id === editedAlbum.id);
                if (albumIndex !== -1) {
                    combinedAlbums[albumIndex] = { ...editedAlbum };
                }
            });
        }
        this.setAlbums(combinedAlbums);
    }

    _findAlbum(albumId: number) {
        return this.albums.find((album) => album.id === albumId);
    }

    _findIndexOfAlbum(albumId: number) {
        return this.albums.findIndex((album) => album.id === albumId);
    }
}
