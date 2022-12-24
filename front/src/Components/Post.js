import logo from "../icons/hosp1.jpg"
import Grade from "./Grade";

const Post = ({ post }) => {

    console.log(post)

    var addr = <>Не указан</>
    if (post.addr !== undefined) {
        addr = <>{post.addr.streetName} {post.addr.prefixStreet}, {post.addr.house}, {post.addr.addrRegionName} </>;
    }

    return (
        <div className="container post"> 
            <div className="post-image-container">
                <img src={logo} className="round post__logo" alt="logo" />    
            </div>
            <div className="container post-info-container">
                <article>
                    <h2>{post.nameFull}</h2>
                    <p>Адрес: { addr }</p>                    
                    <p>Рейтинг: </p>
                    <Grade amount={post.grade}></Grade>
                </article>
            </div>
        </div>
    )
}
export default Post