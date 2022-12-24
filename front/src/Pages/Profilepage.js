import { useState } from "react"
import { AiFillHome, AiFillClockCircle } from "react-icons/ai"
import { FaInternetExplorer } from "react-icons/fa"


import Grade from "../Components/Grade"
import logo from "../icons/hosp1.jpg"

const Profilepage = ({ profile }) => {

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
                    <h2>Структурное подразделение АДЦ в г. Артем Филиала ООО 'Эверест в г. Спасск-Дальний</h2>
                </div>
                <div className="container">
                    <Grade amount={5}></Grade>
                </div>
                <div className="container">
                    <ul>
                        <li><AiFillHome/></li>
                        <li><p>Бабушкина ул 34 пом.4,5 Приморский край</p></li>
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
                    <p>"радиология и радиотерапия" "функциональная диагностика" "паразитология" "детская урология-андрология" "диабетология" "педиатрия" "детская онкология"</p>
                </div>
            </div>
        </div>
    )
}
export default Profilepage