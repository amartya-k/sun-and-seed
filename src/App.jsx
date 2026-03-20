import React, { useState, useRef, useEffect } from 'react';
import { toBlob } from 'html-to-image';

const App = () => {
  const [stage, setStage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const postcardRef = useRef(null);
  const [imgData, setImgData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const herName = "Sayantika"; 

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch("/us.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setImgData(reader.result);
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error("Image failed to pre-load", e);
      }
    };
    loadImage();
  }, []);

  const memories = [
    "It started as a small seed, half a world away.",
    "Through long nights and quiet calls, we kept it warm.",
    "The distance only made the roots grow deeper.",
    `And now, no matter the season, we bloom together, ${herName}.`
  ];

  const handleStart = () => setGameStarted(true);
  const handleRestart = () => setStage(0);

  // FIXED: Mobile-optimized download using Blobs and lower Pixel Ratio
  const downloadPostcard = async () => {
    if (postcardRef.current === null || !imgData || isDownloading) return;
    
    setIsDownloading(true);
    try {
      // We use toBlob because it's significantly more stable on iOS Chrome/Safari
      const blob = await toBlob(postcardRef.current, {
        pixelRatio: 2, // 3 is too high for mobile memory limits
        backgroundColor: '#f9f9f2',
        cacheBust: false,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Postcard_for_${herName}.png`;
      link.href = url;
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert("Please try again or take a screenshot!"); 
    } finally {
      setIsDownloading(false);
    }
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
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .p { position:absolute; width:10px; height:10px; background:#ffccd5; border-radius:12px 2px; animation: drift 10s linear infinite; pointer-events:none; }
        .heart-glow { display: inline-block; color: #ff4d6d; margin-left: 8px; font-style: normal; }
        .reunion-text { background: linear-gradient(to bottom, #1b4332, #2d6a4f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Playfair Display', serif; font-weight: 700; font-style: italic; line-height: 1.2; }
      `}</style>
      
      <div style={s.texture} />
      <Petals />
      
      <div style={s.headerSection}>
        <div style={s.storyCard}><p style={s.storyText}>{memories[stage]}</p></div>
      </div>

      <div style={s.meadowSection}>
        <div style={{...s.flowerWrapper, transform: `scale(${0.7 + stage * 0.15})`}}>
          {stage === 0 && <div style={s.seed} />}
          {stage > 0 && <div style={{...s.stem, height: `${stage * 25}px` }} />}
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
          <div style={s.sunDraggable} onClick={() => setStage(stage + 1)}>
            <div style={s.sun}>☀️</div>
            <p style={s.sunHint}>Tap the sun to grow</p>
          </div>
        )}
      </div>

      <div style={s.footerSection}>
        {stage === 3 && (
          <div style={s.finalMemoryCard}>
             <div ref={postcardRef} style={s.postcardBox}>
                <div style={s.posterContainer}>
                    {imgData ? (
                      <div style={{...s.ghibliPhoto, backgroundImage: `url(${imgData})` }} />
                    ) : (
                      <div style={s.loadingPlaceholder}>Blooming...</div>
                    )}
                </div>
                <h2 style={s.reunion}>
                    <span className="reunion-text">Home is with you, {herName}</span>
                    <span className="heart-glow">♥</span>
                </h2>
             </div>

             <div style={s.btnGroup}>
                <button onClick={downloadPostcard} style={s.downloadBtn} disabled={isDownloading}>
                  {isDownloading ? "Saving..." : "Save Postcard 💌"}
                </button>
                <button onClick={handleRestart} style={s.restartBtn}>Restart</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Petals = () => (
  <div style={s.petalsWrap}>
    {[...Array(12)].map((_, i) => (
      <div key={i} className="p" style={{left: `${Math.random() * 100}%`, animationDelay: `${i * 0.8}s` }} />
    ))}
  </div>
);

const s = {
  ghibliBg: { minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #dcebe3 0%, #f9f7e8 50%, #eef2d8 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' },
  texture: { position: 'absolute', inset: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")', opacity: 0.4, pointerEvents: 'none', zIndex: 1 },
  headerSection: { minHeight: '15vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 10 },
  meadowSection: { minHeight: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '20px', position: 'relative' },
  footerSection: { minHeight: '60vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 10, padding: '0 10px 80px 10px' },
  storyCard: { padding: '12px 20px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '25px', backdropFilter: 'blur(5px)', textAlign: 'center', width: '85%' },
  storyText: { fontSize: '0.95rem', color: '#1b4332', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: '700', margin: 0, lineHeight: '1.4' },
  flowerWrapper: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.8s ease-out' },
  seed: { width: '20px', height: '14px', background: '#5d4037', borderRadius: '50%' },
  stem: { width: '6px', background: '#386641', borderRadius: '4px' },
  leafLeft: { position: 'absolute', bottom: '15px', left: '-15px', width: '20px', height: '10px', background: '#6a994e', borderRadius: '20px 0', transform: 'rotate(-20deg)' },
  leafRight: { position: 'absolute', bottom: '25px', right: '-15px', width: '20px', height: '10px', background: '#6a994e', borderRadius: '0 20px', transform: 'rotate(20deg)' },
  bloomContainer: { position: 'absolute', top: '-25px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop 0.6s forwards' },
  petal: { position: 'absolute', width: '35px', height: '55px', background: 'radial-gradient(circle, #fff, #ffb7ce)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  flowerCenter: { position: 'absolute', width: '15px', height: '15px', background: '#fee440', borderRadius: '50%', border: '2px solid #fff' },
  sunDraggable: { textAlign: 'center', cursor: 'pointer', zIndex: 30, WebkitTapHighlightColor: 'transparent', animation: 'pulse 2s infinite ease-in-out' },
  sun: { fontSize: '2.8rem', filter: 'drop-shadow(0 0 10px #f9dc5c)' },
  sunHint: { fontSize: '0.55rem', color: '#386641', fontWeight: '800', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' },
  finalMemoryCard: { padding: '15px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '25px', backdropFilter: 'blur(10px)', textAlign: 'center', animation: 'pop 1s forwards', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '340px', width: '95%' },
  postcardBox: { background: '#f9f9f2', padding: '15px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  posterContainer: { width: '150px', height: '220px', borderRadius: '15px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 8px 25px rgba(0,0,0,0.12)', margin: '0 auto', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ghibliPhoto: { width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', display: 'block' },
  loadingPlaceholder: { color: '#386641', fontSize: '0.8rem', fontStyle: 'italic' },
  reunion: { fontSize: '1.1rem', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  btnGroup: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '15px' },
  downloadBtn: { padding: '12px 18px', borderRadius: '50px', border: 'none', background: '#386641', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', opacity: 1 },
  restartBtn: { padding: '12px 18px', borderRadius: '50px', border: '1px solid #386641', background: 'transparent', color: '#386641', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' },
  content: { marginTop: '40vh', textAlign: 'center', zIndex: 10 },
  title: { fontSize: '2.2rem', color: '#1b4332', fontFamily: "'Playfair Display', serif" },
  startBtn: { padding: '12px 45px', borderRadius: '50px', border: 'none', background: '#386641', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
  petalsWrap: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }
};

export default App;