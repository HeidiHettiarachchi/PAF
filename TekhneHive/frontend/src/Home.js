import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import CELLS from 'vanta/dist/vanta.cells.min';

const Home = () => {
  const vantaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const effect = CELLS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      color1: 0xffa800,
    });

    return () => effect.destroy();
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      <div>
        <h1 style={{
          fontFamily: "'Baloo 2', cursive, sans-serif",
          fontSize: '5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          transform: 'rotate(-2deg)',
          textShadow: `
    0 0 10px rgba(255, 168, 0, 0.7),
    0 0 20px rgba(255, 255, 255, 0.3)
  `,
          lineHeight: '1.2',
          animation: 'bounce 2s infinite alternate'
        }}>
          <span style={{
            color: 'rgb(255, 255, 255)',
            fontSize: '4rem',
            fontWeight: 600,
            display: 'inline-block',
            transform: 'rotate(2deg)',
            marginRight: '2rem'
          }}>Welcome to</span>
          <br />
          <span style={{
            color: '#000000',
            fontSize: '6rem',
            fontWeight: 900,
            textShadow: `
      2px 2px 0 #ffdb58,
      4px 4px 0 rgba(255, 219, 88, 0.7),
      0 0 20px rgba(255, 219, 88, 0.8)
    `,
            display: 'inline-block',
            padding: '0 15px',
            background: 'rgba(255, 219, 88, 0.7)',
            transform: 'rotate(2deg)',
            borderRadius: '15px',
            border: '4px solid #ffdb58',
            boxShadow: '0 0 20px rgba(255, 219, 88, 0.8)'
          }}>TekhneHive!</span>
        </h1>
        <br/>

        <p style={{
          fontFamily: "'Comic Neue', cursive, sans-serif",
          fontSize: '1.5rem',
          marginBottom: '2rem',
          textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
        }}>
          Join our buzzing hive of creativity — 
          <br /> where minds swarm together to share, and learn. 
          <br/> Every idea is a drop of honey! 
        </p>

        <button
          onClick={() => navigate('/login')}
          style={{
            fontFamily: "'Baloo 2', cursive, sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            padding: '15px 40px',
            borderRadius: '50px',
            background: 'rgba(0, 0, 0, 0.2)',
            color: '#ffffff',
            border: '3px solid #ffdb58',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1)',
            animation: 'pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgb(0, 0, 0)';
            e.currentTarget.style.color = '#ffdb58';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(255, 216, 88, 0.2)';
            e.currentTarget.style.color = '#ffffff';

          }}
        >
          Let's Buzz In!
        </button>
      </div>

      {/* Add these styles to your CSS */}
      <style jsx>{`
        @keyframes bounce {
          0% { transform: translateY(0) rotate(-2deg); }
          100% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 219, 88, 0.5); }
          50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(255, 219, 88, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 219, 88, 0.5); }
        }
      `}</style>
    </div>
  );
};

export default Home;