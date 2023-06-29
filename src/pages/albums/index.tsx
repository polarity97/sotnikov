import { useEffect } from "react";
import { useStore } from "../../store/useStore";
import "./styles.scss";
import { observer } from "mobx-react-lite";
import AlbumCard from "../../components/AlbumCard";
import AlbumsFilters from "../../components/AlbumsFilters";

const AlbumsPage = () => {
    const { albumsStore } = useStore();

    useEffect(() => {
        albumsStore.fetchAlbums();
    }, []);

    return (
        <div className="albums">
            <div className="albums__filters">
                <AlbumsFilters />
            </div>
            <div className="albums__albums">
                {albumsStore.slicedAlbums.map((album, index) => (
                    <AlbumCard key={index} album={album} />
                ))}
            </div>
        </div>
    );
};

export default observer(AlbumsPage);
