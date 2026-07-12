import { useEffect, useRef, useState } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const buttons = [
    { 
      label: "Button 1", 
      color: "#3b82f6", 
      xOffset: -222, 
      yOffset: -212, 
      link: "https://www.gofundme.com/f/a-documentary-on-the-portage-theaters-revival", 
      imgUrl: "https://i.imgur.com/XUf0WtC.png",
      hover: 0, 
      clickScale: 1 
    },
    { 
      label: "Button 2", 
      color: "#ef4444", 
      xOffset: 52, 
      yOffset: -212, 
      link: "https://github.com", 
      imgUrl: null, 
      hover: 0, 
      clickScale: 1 
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = 'https://i.imgur.com/n5cdVKi.jpeg';

    buttons.forEach(btn => {
      if (btn.imgUrl) {
        btn.imageObj = new Image();
        btn.imageObj.src = btn.imgUrl;
      }
    });

    let animationFrameId;
    let imgBounds = { x: 0, y: 0, w: 0, h: 0 };

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (img.complete) {
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        if (canvasRatio > imgRatio) {
          imgBounds.w = canvas.width;
          imgBounds.h = canvas.width / imgRatio;
          imgBounds.x = 0;
          imgBounds.y = (canvas.height - imgBounds.h) / 2;
        } else {
          imgBounds.h = canvas.height;
          imgBounds.w = canvas.height * imgRatio;
          imgBounds.x = (canvas.width - imgBounds.w) / 2;
          imgBounds.y = 0;
        }
        ctx.drawImage(img, imgBounds.x, imgBounds.y, imgBounds.w, imgBounds.h);
      }

      buttons.forEach((btn) => {
        const centerX = imgBounds.x + imgBounds.w / 2;
        const bottomY = imgBounds.y + imgBounds.h;
        btn.x = centerX + btn.xOffset;
        btn.y = bottomY + btn.yOffset;

        const isHovered = mouse.x >= btn.x && mouse.x <= btn.x + 120 && mouse.y >= btn.y && mouse.y <= btn.y + 40;
        btn.hover += (isHovered ? 0.15 : -0.15);
        btn.hover = Math.max(0, Math.min(1, btn.hover));

        const scale = 1 + (btn.hover * 0.1) - (1 - btn.clickScale) * 0.1;
        const w = 120 * scale;
        const h = 40 * scale;
        const dx = btn.x - (w - 120) / 2;
        const dy = btn.y - (h - 40) / 2;
        
        ctx.save();
        ctx.filter = `brightness(${1 + btn.hover * 0.5})`;
        if (btn.imageObj?.complete) {
          ctx.drawImage(btn.imageObj, dx, dy, w, h);
        } else {
          ctx.fillStyle = btn.color;
          ctx.fillRect(dx, dy, w, h);
        }
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mouse]);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseMove={(e) => setMouse({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onClick={(e) => {
        buttons.forEach(btn => {
           if (mouse.x >= btn.x && mouse.x <= btn.x + 120 && mouse.y >= btn.y && mouse.y <= btn.y + 40) {
             window.open(btn.link, '_blank');
           }
        });
      }}
    />
  );
}
