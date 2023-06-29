import { useEffect } from "react";
import { useStore } from "../../store/useStore";
import "./styles.scss";
import { observer } from "mobx-react-lite";
import PostCard from "../../components/PostCard";
import PostsFilters from "../../components/PostsFilters";

const PostsPage = () => {
    const { postsStore } = useStore();

    useEffect(() => {
        postsStore.fetchPosts();
    }, []);

    return (
        <div className="posts">
            <div className="posts__filters">
                <PostsFilters />
            </div>
            <div className="posts__posts">
                {postsStore.slicedPosts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
        </div>
    );
};

export default observer(PostsPage);
