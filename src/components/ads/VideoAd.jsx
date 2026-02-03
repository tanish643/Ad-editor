import { useEffect, useRef, useState } from "react";

function VideoAd({
    videoUrl,
    headline,
    ctaText,
    ctaColor,
    previewMode,
    animation,
}) {
    /* ---------------- CAROUSEL STATE ---------------- */
    const carouselVideos = [
        videoUrl,
        "https://www.w3schools.com/html/movie.mp4",
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    ];

    const [index, setIndex] = useState(0);

    /* ---------------- SCRATCH STATE ---------------- */
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const isScratching = useRef(false);
    const [revealed, setRevealed] = useState(false);

    /* ---------------- RESET ON MODE CHANGE ---------------- */
    useEffect(() => {
        setIndex(0);
        setRevealed(false);
    }, [animation, videoUrl]);

    /* ---------------- CAROUSEL EFFECT ---------------- */
    useEffect(() => {
        if (animation !== "carousel") return;

        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % carouselVideos.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [animation, carouselVideos.length]);

    /* ---------------- SCRATCH EFFECT ---------------- */
    useEffect(() => {
        if (animation !== "scratch") return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext("2d");

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#999";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scratch = (x, y) => {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();
        };

        const getRevealPercent = () => {
            const pixels = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            ).data;

            let cleared = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) cleared++;
            }
            return cleared / (pixels.length / 4);
        };

        const down = () => (isScratching.current = true);
        const up = () => {
            isScratching.current = false;
            if (getRevealPercent() > 0.4) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setRevealed(true);
            }
        };

        const move = (e) => {
            if (!isScratching.current) return;
            const r = canvas.getBoundingClientRect();
            scratch(e.clientX - r.left, e.clientY - r.top);
        };

        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointermove", move);

        return () => {
            canvas.removeEventListener("pointerdown", down);
            canvas.removeEventListener("pointerup", up);
            canvas.removeEventListener("pointermove", move);
        };
    }, [animation]);

    /* ---------------- VIDEO SOURCE ---------------- */
    const src =
        animation === "carousel"
            ? carouselVideos[index]
            : videoUrl;

    return (
        <div
            ref={containerRef}
            style={{ position: "absolute", inset: 0 }}
        >
            {/* VIDEO */}
            <video
                key={src}
                src={src}
                autoPlay
                loop
                muted
                controls={previewMode}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* SCRATCH LAYER */}
            {animation === "scratch" && !revealed && (
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        cursor: "crosshair",
                    }}
                />
            )}

            {/* CAROUSEL CONTROLS */}
            {animation === "carousel" && (
                <>
                    <button
                        onClick={() =>
                            setIndex(
                                (index - 1 + carouselVideos.length) %
                                carouselVideos.length
                            )
                        }
                        style={navBtn("left")}
                    >
                        ‹
                    </button>

                    <button
                        onClick={() =>
                            setIndex((index + 1) % carouselVideos.length)
                        }
                        style={navBtn("right")}
                    >
                        ›
                    </button>
                </>
            )}

            {/* HEADLINE */}
            <div style={headlineStyle}>{headline}</div>

            {/* CTA */}
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    background: ctaColor,
                    padding: "10px 16px",
                    borderRadius: 6,
                    color: "white",
                    fontWeight: "bold",
                }}
            >
                {ctaText}
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const navBtn = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: 10,
    transform: "translateY(-50%)",
    fontSize: 30,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    zIndex: 10,
});

const headlineStyle = {
    position: "absolute",
    top: 20,
    left: 20,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textShadow: "0 2px 4px black",
};

export default VideoAd;
