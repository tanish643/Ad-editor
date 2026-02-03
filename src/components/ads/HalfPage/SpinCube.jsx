import HalfPageBase from "./HalfPageBase";
import "./spinCube.css";

function SpinCube(props) {
    return (
        <div className="spin-cube-wrapper">
            <div className="cube">
                <div className="face front">
                    <HalfPageBase {...props} />
                </div>
                <div className="face right" />
                <div className="face back" />
                <div className="face left" />
            </div>
        </div>
    );
}

export default SpinCube;
