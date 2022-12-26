import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { AiFillHome, AiFillClockCircle } from "react-icons/ai"
import { FaInternetExplorer } from "react-icons/fa"
import Grade from "../Components/Grade"
import logo from "../icons/hospital_tmp.jpg"
import { getMedicalbyId } from "../api/postman";

const Profilepage = () => {

    const { id } = useParams();
    const [profile, setProfile] = useState("");

    useEffect(() => {
        getMedicalbyId(id).then((response) => {
            setProfile(response.data)
        }, []);
    }, [])

    var addr = <>Не указан</>
    if (profile.addr !== undefined) {
        addr = <>{profile.addr.streetName} {profile.addr.prefixStreet}, {profile.addr.house}, {profile.addr.addrRegionName} </>;
    }    

    return (
        <div className="profilepage">
            <div className="upper-container">
                <img src={logo} className="round profile__logo" alt="logo"/>
            </div>
            <div className="lower-container container">
                <div className="container">
                    <h2>{profile.nameFull}</h2>
                </div>
                <div className="container">
                    <Grade amount={profile.grade}></Grade>
                </div>
                <div className="container">
                    <ul>
                        <li><AiFillHome/></li>
                        <li><p>{addr}</p></li>
                    </ul>
                    <ul>
                        <li><AiFillClockCircle/></li>
                        <li><p> c 8:00 До 18:00 </p></li> 
                    </ul>
                    <ul>
                        <li><FaInternetExplorer/></li>
                        <li><a href="https://ya.ru/">Официальный сайт</a></li> 
                    </ul>
                </div>
                <div className="container">
                    <p>Специальности: {profile.specialties && profile.specialties.join(", ")}</p>
                </div>
            </div>
        </div>
    )
}
export default Profilepage