import React, { useEffect } from 'react';
import "./Home.css";

function Home() {

  useEffect(() => {
    const patternElement = document.getElementById("pattern");
    if (!patternElement) return;

    // Clear previous hexagons if any
    patternElement.innerHTML = "";

    const countY = Math.ceil(patternElement.clientHeight / 40) + 1;
    const countX = Math.ceil(patternElement.clientWidth / 48) + 1;

    for (let i = 0; i < countY; i++) {
      for (let j = 0; j < countX; j++) {
        const hexagon = document.createElement("div");
        hexagon.style = `
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODciIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODcgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMi4xOTg3MyAyNi4xNTQ3TDQzLjUgMi4zMDk0TDg0LjgwMTMgMjYuMTU0N1Y3My44NDUzTDQzLjUgOTcuNjkwNkwyLjE5ODczIDczLjg0NTNWMjYuMTU0N1oiIGZpbGw9IiMxMzEyMTciIHN0cm9rZT0iIzEzMTIxNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=') no-repeat;
          width: 44px;
          height: 50px;
          background-size: contain;
          position: absolute;
          top: ${i * 40}px;
          left: ${j * 48 + ((i * 24) % 48)}px;
        `;
        patternElement.appendChild(hexagon);
      }
    }

    // Mouse-following glow effect
    const gradientElement = document.getElementById("gradient");
    let mousePosition = { x: 0, y: 0 };

    const handleMouseMove = (mouse) => {
      mousePosition = {
        x: mouse.clientX,
        y: mouse.clientY
      };
    };

    document.addEventListener("mousemove", handleMouseMove);

    const loop = () => {
      if (gradientElement) {
        gradientElement.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
      }
      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      <h1>Hexagons</h1>
      <div id="gradient"></div>
      <div id="pattern"></div>
    </div>
  );
}

export default Home;
