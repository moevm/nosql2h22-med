import { getPosts } from '../api/postman'
import { useState } from 'react'
import Post from "../Components/Post"

const Homepage = () => {

    const [searchResults, setSearchResults] = useState([])

    const handleChange = (e) => {
        if (!e.target.value) return setSearchResults([])
        
        getPosts(e.target.value).then((response) => {
            setSearchResults(response.data)
        })
    };

    const results = searchResults.map(post => <Post key={post.id} post={post} />)

    const content = (
    <div className="homepage container">
        <div>
            <form className="search">
                <input
                    className="search__input"
                    type="text"
                    placeholder="Что ищем?"
                    id="search"
                    onChange={handleChange}
                />
            </form>
        </div>
        <div>
            <main className="list__page">{results?.length ? results : <></>}</main>
        </div>
    </div>
    )

    return ( content )
}
export default Homepage