import { getCities, getPosts, getSpecialties } from '../api/postman'
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { BiImport, BiExport } from "react-icons/bi"
import Post from "../Components/Post"

const getCitiesPromise = getCities().then(({ data }) => data);
const getSpecialtiesPromise = getSpecialties().then(({ data }) => data);

const Homepage = () => {

    const [searchValue, setSearchValue] = useState("")
    const [specializationFilter, setSpecializationFilter] = useState("")
    const [cityFilter, setCityFilter] = useState("")
    const [timeFilter, setTimeFilter] = useState("")
    const [sortAttribute, setSortAttribute] = useState("");
    const [searchResults, setSearchResults] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [cities, setCities] = useState([])

    useEffect(() => {
        getCitiesPromise.then(setCities)
        .catch(err => console.error(err.toJSON()));
    }, [])

    useEffect(() => {
        getSpecialtiesPromise.then(setSpecialties)
        .catch(err => console.error(err.toJSON()));
    }, [])

    const handleSelectSpecializationFilterChange = (e) => {
        setSpecializationFilter(e.target.value);
        getPosts(searchValue, e.target.value, cityFilter, timeFilter, sortAttribute).then((response) => {
            setSearchResults(response.data);
        })
    }

    const handleSelectCityFilterChange = (e) => {
        setCityFilter(e.target.value);
        getPosts(searchValue, specializationFilter, e.target.value, timeFilter, sortAttribute).then((response) => {
            setSearchResults(response.data);
        })
    }

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
        getPosts(searchValue, specializationFilter, cityFilter, e.target.value, sortAttribute).then((response) => {
            setSearchResults(response.data);
        })
    }

    const handleSelectSortChange = (e) => {
        setSortAttribute(e.target.value);
        getPosts(searchValue, specializationFilter, cityFilter, timeFilter, e.target.value).then((response) => {
            setSearchResults(response.data);
        })
    }

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);

        if (!e.target.value) return setSearchResults([])

        getPosts(e.target.value, specializationFilter, cityFilter, timeFilter, sortAttribute).then((response) => {
            setSearchResults(response.data);
        })
    };

    const handleClick = (e) => {
        getPosts(searchValue, specializationFilter, cityFilter, timeFilter, sortAttribute).then((response) => {
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(
                new Blob([JSON.stringify(response.data)], {type: "application/json"})
            );
            link.download = "data.json";
            document.body.appendChild(link);

            link.click();
        })
    };

    const results = searchResults.map(post => <Post key={post.id} post={post} />)

    const content = (
    <div className="homepage container">
        <Link to={`/importexport`}>
            <BiImport/>
            Import Files
        </Link>
        {results?.length
                ?
                <div className="export-button" onClick={handleClick}>
                    <BiExport/>
                    Export Files
                </div>
                : <></>
        }
        <div className="search-bar">
            <form className="search">
                <input
                    className="search__input"
                    type="text"
                    placeholder="Что ищем?"
                    id="search"
                    onChange={handleSearchChange}
                />
            </form>
            <div className="search-settings">
                <select 
                    className='container filter-dialog'
                    onChange={handleSelectSpecializationFilterChange}
                    value={specializationFilter}
                >
                    <option value=""></option>
                    {specialties.map((specialization, index) => {
                        return <option key={index} value={specialization}>{specialization}</option>;
                    })}
                </select>
                <select 
                    className='container filter-dialog'
                    onChange={handleSelectCityFilterChange}
                    value={cityFilter}
                >
                    <option value=""></option>
                    {cities.map((city, index) => {
                        return <option key={index} value={city}>{city}</option>;
                    })}
                </select>
                <select 
                    className='container filter-dialog'
                    onChange={handleTimeFilterChange}
                    value={timeFilter}
                >
                        <option value=""></option>
                        <option value="Открыто">Открыто</option>
                        <option value="Закрыто">Закрыто</option>
                </select>
                <select
                    className="container sort-dialog"
                    onChange={handleSelectSortChange}
                    value={sortAttribute}
                >
                    <option value=""></option>
                    <option value="regionName">Город</option>
                    <option value="grade">Рейтинг</option>
                    <option value="nameFull">Название</option>
                    <option value="specialties">Специальности</option>
                </select>
                </div>
        </div>
        <div>
            <main className="list__page">{results?.length ? results : <></>}</main>
        </div>
    </div>
    )

    return ( content )
}
export default Homepage