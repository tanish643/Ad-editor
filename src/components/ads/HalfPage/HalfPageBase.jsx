import { useState, useEffect } from "react";

function HalfPageAd({
    adImage,
    headline,
    ctaText,
    ctaColor,
    animation,
    previewMode,
    bounds = { width: 300, height: 600 },
}) {
    /* ---------------- STATE ---------------- */

    const [imgPos, setImgPos] = useState({ x: 40, y: 40 });
    const [imgSize, setImgSize] = useState({ width: 220, height: 300 });

    const [textPos, setTextPos] = useState({ x: 20, y: 20 });
    const [textSize, setTextSize] = useState({ width: 200, height: 50 });

    const [ctaPos, setCtaPos] = useState({ x: 80, y: 520 });
    const [ctaSize, setCtaSize] = useState({ width: 140, height: 40 });

    const [dragType, setDragType] = useState(null);
    const [resizeType, setResizeType] = useState(null);

    const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = useState({ width: 0, height: 0 });

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    /* ---------------- MOUSE ---------------- */

    const onMouseDown = (type, e) => {
        if (previewMode) return;
        e.stopPropagation();
        setDragType(type);
        setResizeType(null);
        setStartMouse({ x: e.clientX, y: e.clientY });
    };

    const onResizeDown = (type, e) => {
        if (previewMode) return;
        e.stopPropagation();
        setResizeType(type);
        setDragType(null);
        setStartMouse({ x: e.clientX, y: e.clientY });

        if (type === "image") setStartSize(imgSize);
        if (type === "text") setStartSize(textSize);
        if (type === "cta") setStartSize(ctaSize);
    };

    const onMouseMove = (e) => {
        if (!dragType && !resizeType) return;

        const dx = e.clientX - startMouse.x;
        const dy = e.clientY - startMouse.y;

        if (dragType === "image") {
            setImgPos(p => ({
                x: clamp(p.x + dx, 0, bounds.width - imgSize.width),
                y: clamp(p.y + dy, 0, bounds.height - imgSize.height),
            }));
            setStartMouse({ x: e.clientX, y: e.clientY });
        }

        if (dragType === "text") {
            setTextPos(p => ({
                x: clamp(p.x + dx, 0, bounds.width - textSize.width),
                y: clamp(p.y + dy, 0, bounds.height - textSize.height),
            }));
            setStartMouse({ x: e.clientX, y: e.clientY });
        }

        if (dragType === "cta") {
            setCtaPos(p => ({
                x: clamp(p.x + dx, 0, bounds.width - ctaSize.width),
                y: clamp(p.y + dy, 0, bounds.height - ctaSize.height),
            }));
            setStartMouse({ x: e.clientX, y: e.clientY });
        }

        if (resizeType === "image") {
            setImgSize({
                width: clamp(startSize.width + dx, 80, bounds.width - imgPos.x),
                height: clamp(startSize.height + dy, 80, bounds.height - imgPos.y),
            });
        }

        if (resizeType === "text") {
            setTextSize({
                width: clamp(startSize.width + dx, 60, bounds.width - textPos.x),
                height: clamp(startSize.height + dy, 30, bounds.height - textPos.y),
            });
        }

        if (resizeType === "cta") {
            setCtaSize({
                width: clamp(startSize.width + dx, 60, bounds.width - ctaPos.x),
                height: clamp(startSize.height + dy, 30, bounds.height - ctaPos.y),
            });
        }
    };

    const onMouseUp = () => {
        setDragType(null);
        setResizeType(null);
    };

    /* ---------------- EXPORT ---------------- */

    useEffect(() => {
        const exportHandler = () => {
            const config = {
                image: { src: adImage, position: imgPos, size: imgSize },
                text: { value: headline, position: textPos, size: textSize },
                cta: { text: ctaText, color: ctaColor, position: ctaPos, size: ctaSize },
                animation,
            };

            const blob = new Blob([JSON.stringify(config, null, 2)], {
                type: "application/json",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "ad-config.json";
            a.click();
            URL.revokeObjectURL(url);
        };

        window.addEventListener("EXPORT_AD", exportHandler);
        return () => window.removeEventListener("EXPORT_AD", exportHandler);
    }, [imgPos, imgSize, textPos, textSize, ctaPos, ctaSize, adImage, headline, ctaText, ctaColor, animation]);

    /* ---------------- RENDER ---------------- */

    return (
        /* ✅ HARD AD SLOT (CLIPS EVERYTHING) */
        <div
            style={{
                width: bounds.width,
                height: bounds.height,
                position: "relative",
                overflow: "hidden",
                background: "#fff",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div
                className={`ad-animate ${animation}`}
                style={{ position: "absolute", inset: 0 }}
            >
                {/* IMAGE */}
                <div
                    onMouseDown={(e) => onMouseDown("image", e)}
                    style={{
                        position: "absolute",
                        left: imgPos.x,
                        top: imgPos.y,
                        width: imgSize.width,
                        height: imgSize.height,
                        border: previewMode ? "none" : "2px solid black",
                        cursor: previewMode ? "default" : "move",
                    }}
                >
                    <img
                        src={adImage}
                        alt="Ad"
                        draggable={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {!previewMode && <ResizeHandle onDown={(e) => onResizeDown("image", e)} />}
                </div>

                {/* TEXT */}
                <div
                    onMouseDown={(e) => onMouseDown("text", e)}
                    style={{
                        position: "absolute",
                        left: textPos.x,
                        top: textPos.y,
                        width: textSize.width,
                        height: textSize.height,
                        border: previewMode ? "none" : "1px dashed black",
                        background: "rgba(255,255,255,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: previewMode ? "default" : "move",
                    }}
                >
                    <b>{headline}</b>
                    {!previewMode && <ResizeHandle onDown={(e) => onResizeDown("text", e)} />}
                </div>

                {/* CTA */}
                <div
                    onMouseDown={(e) => onMouseDown("cta", e)}
                    style={{
                        position: "absolute",
                        left: ctaPos.x,
                        top: ctaPos.y,
                        width: ctaSize.width,
                        height: ctaSize.height,
                        background: ctaColor,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                        fontWeight: "bold",
                        cursor: previewMode ? "default" : "move",
                    }}
                >
                    {ctaText}
                    {!previewMode && <ResizeHandle onDown={(e) => onResizeDown("cta", e)} />}
                </div>
            </div>
        </div>
    );
}

function ResizeHandle({ onDown }) {
    return (
        <div
            onMouseDown={onDown}
            style={{
                width: 10,
                height: 10,
                background: "black",
                position: "absolute",
                right: -5,
                bottom: -5,
                cursor: "nwse-resize",
            }}
        />
    );
}

export default HalfPageAd;
