import { useRef, useEffect } from 'react';

interface ColorWheelProps {
  onColorChange: (color: string) => void; // Pass the color change function as a prop
}

export default function ColorWheel({ onColorChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawColorWheel = (ctx: CanvasRenderingContext2D, radius: number, centerX: number, centerY: number) => {
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;
    const centerX = canvas!.width / 2;
    const centerY = canvas!.height / 2;
    const x = offsetX - centerX;
    const y = offsetY - centerY;
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const radius = canvas!.width / 2;

    if (distanceFromCenter <= radius && ctx) {
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const hue = (angle < 0 ? angle + 360 : angle);
      const saturation = (distanceFromCenter / radius) * 100;
      const newColor = `hsl(${hue}, ${saturation}%, 50%)`;
      onColorChange(newColor); // Call the parent function with the new color
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const radius = canvas!.width / 2;
    const centerX = radius;
    const centerY = radius;

    if (ctx) {
      drawColorWheel(ctx, radius, centerX, centerY);
    }
  }, []);

  return (
    <div className="flex justify-center items-center mb-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onClick={handleClick}
        style={{ cursor: 'crosshair'}}
      ></canvas>
    </div>
  );
}
