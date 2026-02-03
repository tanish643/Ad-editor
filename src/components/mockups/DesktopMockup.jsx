import HalfPageBase from "../ads/HalfPage/HalfPageBase";
import "./desktop.css";

function DesktopMockup(props) {
    return (
        <div className="laptop-wrapper">
            <div className="laptop-top">
                <div className="laptop-screen">
                    {/* AD SLOT */}
                    <div className="ad-slot">
                        <HalfPageBase {...props} />
                    </div>
                </div>
            </div>

            <div className="laptop-bottom">
                <div className="trackpad" />
            </div>
        </div>
    );
}

export default DesktopMockup;
