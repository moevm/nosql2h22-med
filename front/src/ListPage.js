import Post from "./Post"

const ListPage = ({ searchResults }) => {

    const results = searchResults.map(post => <Post key={post.id} post={post} />)

    const content = results?.length ? results : <></>

    return (
        <main className="list__page">{content}</main>
    )
}
export default ListPage