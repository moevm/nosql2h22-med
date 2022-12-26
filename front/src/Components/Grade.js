
import { AiFillStar } from "react-icons/ai"

const Grade = ({ amount }) => {
    const content = (
        <div className="Grade">
            {Array.from(Array(amount).keys()).map((value, index) => (
            <AiFillStar key={index}/>
          ))}
        </div>
    )

    return content;
}

export default Grade;