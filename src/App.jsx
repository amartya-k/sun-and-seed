import React, { useState } from 'react';

const YOUR_IMAGE_LINK = "https://i.postimg.cc/DyJs5yQJ/Gemini-Generated-Image-pme3zwpme3zwpme3.png";

const App = () => {
  const [stage, setStage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const herName = "Sayantika"; 

  const memories = [
    "It started as a small seed, half a world away.",
    "Through long nights and quiet calls, we kept it warm.",
    "The distance only made the roots grow deeper.",
    `And now, no matter the season, we bloom together, ${herName}.`
  ];

  const handleStart = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div style={s.ghibliBg}>
        <div style={s.texture} />
        <div style={s.content}>
          <h1 style={s.title}>The Sun & The Seed</h1>
          <button onClick={handleStart} style={s.startBtn}>Enter the Meadow</button>
        </div>
        <Petals />
      </div>
    );
  }

  return (
    <div style={s.ghibliBg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        @keyframes drift { 0% { top:-10%; transform:rotate(0); opacity: 0; } 15% { opacity: 0.7; } 100% { top:110%; transform:rotate(360deg) translateX(40px); opacity: 0; } }
        @keyframes pop { 0% { transform: scale(0); opacity:0; } 100% { transform: scale(1); opacity:1; } }
        @keyframes beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes softFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .p { position:absolute; width:10px; height:10px; background:#ffccd5; border-radius:12px 2px; animation: drift 10s linear infinite; pointer-events:none; }
      `}</style>
      
      <div style={s.texture} />
      <Petals />
      {stage === 3 && <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,0.1)'}} />}
      
      <div style={s.headerSection}>
        <div style={s.storyCard}><p style={s.storyText}>{memories[stage]}</p></div>
      </div>

      <div style={s.meadowSection}>
        <div style={{...s.flowerWrapper, transform: `scale(${0.7 + stage * 0.15})`}}>
          {stage === 0 && <div style={s.seed} />}
          {stage > 0 && <div style={{...s.stem, height: `${stage * 35}px` }} />}
          {stage >= 1 && <div style={s.leafLeft} />}
          {stage >= 2 && <div style={s.leafRight} />}
          {stage === 3 && (
            <div style={s.bloomContainer}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{...s.petal, transform: `rotate(${i * 60}deg) translateY(-22px)`}} />
              ))}
              <div style={s.flowerCenter} />
            </div>
          )}
        </div>
        
        {stage < 3 && (
          <div style={s.sunDraggable} draggable onDragEnd={() => setStage(stage + 1)}>
            <div style={s.sun}>☀️</div>
            <p style={s.sunHint}>Drag to nourish</p>
          </div>
        )}
      </div>

      <div style={s.footerSection}>
        {stage === 3 && (
          <div style={s.finalMemoryCard}>
             <div style={s.posterContainer}>
               <img src={YOUR_IMAGE_LINK} alt="Our Future" style={s.ghibliPhoto} />
             </div>
             <h2 style={s.reunion}>Home is with you, {herName} <span style={s.heartBeside}>♥</span></h2>
          </div>
        )}
      </div>
    </div>
  );
};

const Petals = () => (
  <div style={s.petalsWrap}>
    {[...Array(15)].map((_, i) => (
      <div key={i} className="p" style={{left: `${Math.random() * 100}%`, animationDelay: `${i * 0.7}s` }} />
    ))}
  </div>
);

const s = {
  ghibliBg: { height: '100vh', background: 'linear-gradient(to bottom, #dcebe3 0%, #f9f7e8 50%, #eef2d8 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  texture: { position: 'absolute', inset: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")', opacity: 0.4, pointerEvents: 'none', zIndex: 1 },
  headerSection: { height: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', zIndex: 10 },
  meadowSection: { height: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  footerSection: { height: '50vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 10, padding: '0 10px' },
  storyCard: { padding: '12px 20px', background: 'rgba(255, 255, 255, 0.45)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '20px', backdropFilter: 'blur(8px)', textAlign: 'center' },
  storyText: { fontSize: '1.2rem', color: '#1b4332', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: '700', margin: 0 },
  flowerWrapper: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 1s ease-in-out', zIndex: 20 },
  seed: { width: '22px', height: '16px', background: '#5d4037', borderRadius: '50% 50% 40% 40%' },
  stem: { width: '5px', background: '#386641', borderRadius: '3px' },
  leafLeft: { position: 'absolute', bottom: '18px', left: '-18px', width: '22px', height: '12px', background: '#6a994e', borderRadius: '20px 0 20px 0', transform: 'rotate(-25deg)' },
  leafRight: { position: 'absolute', bottom: '32px', right: '-18px', width: '22px', height: '12px', background: '#6a994e', borderRadius: '0 20px 0 20px', transform: 'rotate(25deg)' },
  bloomContainer: { position: 'absolute', top: '-30px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop 0.8s forwards' },
  petal: { position: 'absolute', width: '42px', height: '62px', background: 'radial-gradient(circle at center, #fff 0%, #ffb7ce 70%, #f7a1c4 100%)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' },
  flowerCenter: { position: 'absolute', width: '18px', height: '18px', background: '#fee440', borderRadius: '50%', border: '2px solid #fff' },
  sunDraggable: { position: 'absolute', top: '-10px', cursor: 'grab', textAlign: 'center', zIndex: 20 },
  sun: { fontSize: '3rem' },
  sunHint: { fontSize: '0.65rem', color: '#386641', fontWeight: '700', marginTop: '5px' },
  finalMemoryCard: { padding: '25px 15px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '25px', backdropFilter: 'blur(10px)', textAlign: 'center', animation: 'pop 1s ease-out forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '95%', maxWidth: '400px' },
  posterContainer: { position: 'relative', maxWidth: '200px', borderRadius: '15px', overflow: 'hidden', border: '4px solid white' },
  ghibliPhoto: { width: '100%', height: 'auto' },
  reunion: { fontSize: '1.6rem', color: '#1b4332', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' },
  heartBeside: { fontSize: '2rem', color: '#ff758f', display: 'inline-block' },
  content: { marginTop: '35vh', textAlign: 'center', zIndex: 10 },
  title: { fontSize: '3rem', color: '#1b4332', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' },
  startBtn: { marginTop: '20px', padding: '14px 45px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: '#386641', color: 'white' },
  petalsWrap: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }
};

export default App;