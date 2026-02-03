import HalfPageBase from "./HalfPageBase";
import "./shutter.css";

function Shutter(props) {
    return (
        <div className="shutter-wrapper">
            <div className="shutter top" />
            <div className="shutter bottom" />
            <HalfPageBase {...props} />
        </div>
    );
}

export default Shutter;
