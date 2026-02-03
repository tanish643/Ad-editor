import HalfPageBase from "../ads/HalfPage/HalfPageBase";
import "./mobile.css";

const MOBILE_AD_SIZES = {
    banner: { width: 320, height: 50 },
    interstitial: { width: 320, height: 480 },
    native: { width: 300, height: 250 },
};

function MobileMockup({
    adImage,
    headline,
    ctaText,
    ctaColor,
    animation,
    previewMode,
    mobileFormat = "banner",
    orientation = "portrait",
}) {
    const size = MOBILE_AD_SIZES[mobileFormat];

    return (
        <div className={`mobile-wrapper ${orientation}`}>
            <div className="mobile-frame">
                <div
                    className="mobile-screen"
                    style={{
                        width: size.width,
                        height: size.height,
                    }}
                >
                    <HalfPageBase
                        adImage={adImage}
                        headline={headline}
                        ctaText={ctaText}
                        ctaColor={ctaColor}
                        animation={animation}
                        previewMode={previewMode}
                        bounds={size}
                    />
                </div>
            </div>
        </div>
    );
}

export default MobileMockup;
