"use client";
import { useEffect, useRef } from "react";

export default function FractalBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let imgLoaded = false;
    let animId: number;
    const mouse = { x: -999, y: -999 };
    const smoothMouse = { x: -999, y: -999 };

    const img = new Image();
    img.src = "/bg.jpg";

    img.onload = () => {
      imgLoaded = true;
    };

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function drawBase() {
      if (!imgLoaded || !canvas || !ctx) return;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function draw() {
      if (!canvas || !ctx) return;
      const cw = canvas.width, ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      if (!imgLoaded) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, cw, ch);
        return;
      }

      ctx.globalAlpha = 0.75;
      drawBase();
      ctx.globalAlpha = 0.5;

      const mx = smoothMouse.x;
      const my = smoothMouse.y;
      const hasMouse = mx > 0;

      const cols = 28;
      const rows = 18;
      const sw = cw / cols;
      const sh = ch / rows;
      const time = Date.now() * 0.0008;

      for (let col = 0; col < cols; col++) {
        const sx = col * sw;
        const cx2 = sx + sw / 2;

        for (let row = 0; row < rows; row++) {
          const sy = row * sh;
          const cy2 = sy + sh / 2;

          let distFactor = 0;
          if (hasMouse) {
            const dx = cx2 - mx;
            const dy = cy2 - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = cw * 0.22;
            distFactor = Math.max(0, 1 - dist / radius);
            distFactor = distFactor * distFactor;
          }

          const wave =
            Math.sin(col * 0.4 + time) *
            Math.cos(row * 0.5 + time * 0.7) *
            0.15;
          const totalFactor = Math.min(1, distFactor + wave * 0.3);

          const sliceH = sh * (1.5 + totalFactor * 6.0);
          const sliceY = cy2 - sliceH / 2;
          const shiftX =
            Math.sin(col * 0.7 + time) * totalFactor * sw * 0.08;

          ctx.save();
          ctx.beginPath();
          ctx.rect(sx, sy, sw, sh);
          ctx.clip();

          const scale2 = Math.max(cw / img.width, ch / img.height);
          const dw = img.width * scale2;
          const dh = img.height * scale2;
          const dxBase = (cw - dw) / 2;
          const dyBase = (ch - dh) / 2;

          const srcX = ((sx + shiftX - dxBase) / dw) * img.width;
          const srcY = ((sliceY - dyBase) / dh) * img.height;
          const srcW = (sw / dw) * img.width;
          const srcH = (sliceH / dh) * img.height;

          if (
            srcW > 0 &&
            srcH > 0 &&
            srcX + srcW > 0 &&
            srcY + srcH > 0 &&
            srcX < img.width &&
            srcY < img.height
          ) {
            ctx.drawImage(
              img,
              Math.max(0, srcX),
              Math.max(0, srcY),
              Math.min(srcW, img.width - Math.max(0, srcX)),
              Math.min(srcH, img.height - Math.max(0, srcY)),
              sx,
              sy,
              sw,
              sh
            );
          }

          if (totalFactor > 0.05) {
            ctx.fillStyle = `rgba(200,220,255,${totalFactor * 0.18})`;
            ctx.fillRect(sx, sy, sw, sh);

            ctx.strokeStyle = `rgba(255,255,255,${totalFactor * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx, sy + sh);
            ctx.stroke();
          }

          ctx.restore();
        }
      }
    }

    function loop() {
      animId = requestAnimationFrame(loop);
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.1;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.1;
      draw();
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    }

    function onMouseLeave() {
      mouse.x = -999;
      mouse.y = -999;
    }

    resize();
    loop();

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}