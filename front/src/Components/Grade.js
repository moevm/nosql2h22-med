
import { AiFillStar } from "react-icons/ai"

const Grade = ({ amount }) => {
    const content = (
        <div className="Grade">
            {Array.from(Array(amount).keys()).map(i => (
            <AiFillStar/>
          ))}
        </div>
    )

    return content;
}

export default Grade;