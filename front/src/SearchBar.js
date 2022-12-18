const SearchBar = ({ posts, setSearchResults }) => {
    const handleSubmit = (e) => e.preventDefault()

    const handleSearchChange = (e) => {
        if (!e.target.value) return setSearchResults([])

        
        const resultsArray = posts.filter(post => post.nameFull.includes(e.target.value) || post.nameShort.includes(e.target.value))
        

        setSearchResults(resultsArray)
    }

    return (
        <header className="">
            <form className="search" onSubmit={handleSubmit}>
                <input
                    className="search__input"
                    type="text"
                    placeholder="Что ищем?"
                    id="search"
                    onChange={handleSearchChange}
                />
            </form>
        </header>
    )
}
export default SearchBar