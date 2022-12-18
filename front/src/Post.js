import logo from "./logo.svg"

const Post = ({ post }) => {
    return (
        <div className="post">

        
        <img src={logo} className="post-logo" alt="logo" width="200" height="200" />
        <article>
            <h2>{post.nameFull}</h2>
            <p>
                Адрес: {post.streetName} {post.prefixStreet}, {post.house}, {post.addrRegionName}
            </p>
            <p>Рейтинг: {post.rating}</p>
        </article>
        </div>
    )
}
export default Post