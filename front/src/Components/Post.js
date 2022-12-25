import { Link } from "react-router-dom";
import logo from "../icons/hospital_tmp.jpg"
import Grade from "./Grade";

const Post = ({ post }) => {

    var addr = <>Не указан</>
    if (post.addr !== undefined) {
        addr = <>{post.addr.streetName} {post.addr.prefixStreet}, {post.addr.house}, {post.addr.addrRegionName} </>;
    }

    return (
        <Link key={post.id} to={`/profile/${post.id}`}>
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
                        <p>Специальности: {post.specialties && post.specialties.join(", ")}</p>
                    </article>
                </div>
            </div>
        </Link>
    )
}
export default Post