import VideoAd from "../ads/VideoAd";
import "./video.css";

function VideoMockup({
    videoUrl,
    headline,
    ctaText,
    ctaColor,
    previewMode,
    animation,
}) {
    return (
        <div className="video-frame">
            <div className="video-screen">
                <VideoAd
                    videoUrl={videoUrl}
                    headline={headline}
                    ctaText={ctaText}
                    ctaColor={ctaColor}
                    previewMode={previewMode}
                    animation={animation}
                />

            </div>
        </div>
    );
}

export default VideoMockup;
