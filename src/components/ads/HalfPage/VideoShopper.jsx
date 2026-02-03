import HalfPageBase from "./HalfPageBase";
import "./videoShopper.css";

function VideoShopper({ videoUrl, ...props }) {
    return (
        <div className="video-shopper">
            <video
                src={videoUrl}
                autoPlay
                muted
                loop
                className="shopper-video"
            />
            <div className="shopper-products">
                <HalfPageBase {...props} />
            </div>
        </div>
    );
}

export default VideoShopper;
