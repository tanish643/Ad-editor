import { useState } from "react";
import DesktopMockup from "../components/mockups/DesktopMockup";
import MobileMockup from "../components/mockups/MobileMockup";
import VideoMockup from "../components/mockups/VideoMockup";

function Builder() {
    const [adImage, setAdImage] = useState(
        "https://via.placeholder.com/300x600"
    );
    const [headline, setHeadline] = useState("Your Ad Headline");

    const [ctaText, setCtaText] = useState("Buy Now");
    const [ctaColor, setCtaColor] = useState("#ff5722");

    // 🔥 shared animation (desktop / mobile / video)
    const [animation, setAnimation] = useState("fade");
    const [previewMode, setPreviewMode] = useState(false);

    // DEVICE
    const [device, setDevice] = useState("desktop");

    // MOBILE
    const [mobileFormat, setMobileFormat] = useState("banner");
    const [orientation, setOrientation] = useState("portrait");

    // 🎬 VIDEO
    const [videoUrl, setVideoUrl] = useState(
        "https://www.w3schools.com/html/mov_bbb.mp4"
    );

    /* -------- IMPORT JSON -------- */
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const json = JSON.parse(event.target.result);

            setAdImage(json.image?.src || "");
            setHeadline(json.text?.value || "");
            setCtaText(json.cta?.text || "");
            setCtaColor(json.cta?.color || "#ff5722");
            setAnimation(json.animation || "none");
            setVideoUrl(json.videoUrl || videoUrl);

            window.dispatchEvent(
                new CustomEvent("IMPORT_AD", { detail: json })
            );
        };

        reader.readAsText(file);
    };

    return (
        <div className="builder">
            {/* SIDEBAR */}
            <div className="sidebar">
                <h2>Ad Builder</h2>

                {/* PREVIEW */}
                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        background: previewMode ? "#4caf50" : "#2196f3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    {previewMode ? "Exit Preview" : "Preview Ad"}
                </button>

                {/* DEVICE TOGGLE */}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {["desktop", "mobile", "video"].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDevice(d)}
                            style={{
                                flex: 1,
                                padding: "8px",
                                background: device === d ? "#333" : "#ccc",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                    ))}
                </div>

                {/* MOBILE CONTROLS */}
                {device === "mobile" && !previewMode && (
                    <>
                        <h4>Mobile Ad Format</h4>
                        <select
                            value={mobileFormat}
                            onChange={(e) => setMobileFormat(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 10 }}
                        >
                            <option value="banner">Banner (320×50)</option>
                            <option value="interstitial">Interstitial (320×480)</option>
                            <option value="native">Native (300×250)</option>
                        </select>

                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <button
                                onClick={() => setOrientation("portrait")}
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    background:
                                        orientation === "portrait" ? "#333" : "#ccc",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Portrait
                            </button>

                            <button
                                onClick={() => setOrientation("landscape")}
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    background:
                                        orientation === "landscape" ? "#333" : "#ccc",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Landscape
                            </button>
                        </div>
                    </>
                )}

                {/* VIDEO CONTROLS */}
                {device === "video" && !previewMode && (
                    <>
                        <h4>Video URL</h4>
                        <input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 10 }}
                        />

                        {/* ✅ VIDEO ANIMATION */}
                        <h4>Video Animation</h4>
                        <select
                            value={animation}
                            onChange={(e) => setAnimation(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 10 }}
                        >
                            <option value="none">None</option>
                            <option value="fade">Fade In</option>
                            <option value="scratch">Scratch To Reveal</option>
                            <option value="carousel">Carousel Video</option> {/* ✅ ADDED */}
                        </select>
                    </>
                )}

                {/* EXPORT */}
                <button
                    onClick={() => window.dispatchEvent(new Event("EXPORT_AD"))}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        background: "#673ab7",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Export Ad (JSON)
                </button>

                {/* IMPORT */}
                <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ width: "100%", marginBottom: "15px" }}
                />

                {/* COMMON EDIT CONTROLS */}
                {!previewMode && (
                    <>
                        <h4>Headline</h4>
                        <input
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 10 }}
                        />

                        <h4>CTA Text</h4>
                        <input
                            value={ctaText}
                            onChange={(e) => setCtaText(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 10 }}
                        />

                        <h4>CTA Color</h4>
                        <input
                            type="color"
                            value={ctaColor}
                            onChange={(e) => setCtaColor(e.target.value)}
                            style={{ width: "100%", height: 40, marginBottom: 10 }}
                        />
                    </>
                )}
            </div>

            {/* CANVAS */}
            <div className="canvas">
                {device === "desktop" && (
                    <DesktopMockup
                        adImage={adImage}
                        headline={headline}
                        ctaText={ctaText}
                        ctaColor={ctaColor}
                        animation={animation}
                        previewMode={previewMode}
                    />
                )}

                {device === "mobile" && (
                    <MobileMockup
                        adImage={adImage}
                        headline={headline}
                        ctaText={ctaText}
                        ctaColor={ctaColor}
                        animation={animation}
                        previewMode={previewMode}
                        mobileFormat={mobileFormat}
                        orientation={orientation}
                    />
                )}

                {device === "video" && (
                    <VideoMockup
                        videoUrl={videoUrl}
                        headline={headline}
                        ctaText={ctaText}
                        ctaColor={ctaColor}
                        previewMode={previewMode}
                        animation={animation}
                    />
                )}
            </div>
        </div>
    );
}

export default Builder;
