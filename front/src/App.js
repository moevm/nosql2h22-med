import { getPosts } from './api/postman'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import ListPage from './ListPage'

function App() {
  const [posts, setPosts] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    getPosts().then(json => {
      setPosts(json)
      setSearchResults([])
    })
  }, [])



  return (
  <div className="container">
      <SearchBar posts={posts} setSearchResults={setSearchResults} />
      <ListPage searchResults={searchResults} />
  </div>)
}

export default App;