"use client";

import { useEffect, useRef } from "react";

export default function SplashScreen() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // تشغيل الصوت أول ما الـ Component يظهر
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // ممكن تعلي أو توطي الصوت من هنا (0.0 لـ 1.0)
            
            // في المتصفحات الحديثة، لازم المستخدم يعمل "تفاعل" عشان الصوت يشتغل
            // بس في الـ Splash Screen ساعات المتصفح بيسمح لو الصوت قصير
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play was prevented by the browser. This is normal behavior if the user hasn't interacted with the page yet.", error);
                });
            }
        }
    }, []);

    return (
        <div className="splash-container">
            {/* ملف الصوت مخفي */}
            <audio ref={audioRef} src="/splash-sound.mp3" preload="auto" />

            <style jsx>{`
                * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
                .splash-container {
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle at center, #233054 0%, #151d35 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .ambient-glow {
                    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; z-index: 1;
                    animation: float 6s infinite alternate ease-in-out;
                }
                .glow-gold { background-color: #D4AF37; width: 60vw; height: 60vw; top: -10%; left: -20%; }
                .glow-blue { background-color: #4A6B9C; width: 70vw; height: 70vw; bottom: -10%; right: -20%; animation-delay: -3s; }
                
                .logo-wrapper { z-index: 10; display: flex; flex-direction: column; align-items: center; }
                .logo-text { font-size: 4.5rem; font-weight: 800; letter-spacing: 0.15em; display: flex; margin-left: 0.15em; text-shadow: 0 10px 20px rgba(0,0,0,0.3); }
                .letter { opacity: 0; transform: translateY(20px) scale(0.9); animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .letter-white { color: #ffffff; }
                .letter-gold { color: #E5BC3A; }
                
                .letter:nth-child(1) { animation-delay: 0.1s; }
                .letter:nth-child(2) { animation-delay: 0.25s; }
                .letter:nth-child(3) { animation-delay: 0.4s; }
                .letter:nth-child(4) { animation-delay: 0.55s; }
                
                .tagline { color: #97AEE0; font-size: 1rem; font-weight: 600; margin-top: 15px; letter-spacing: 0.05em; opacity: 0; transform: translateY(10px); animation: fadeUp 0.8s ease forwards 0.8s; }
                
                .loader-container { position: absolute; bottom: 12%; width: 70%; max-width: 300px; z-index: 10; opacity: 0; animation: fadeUp 0.8s ease forwards 1.2s; }
                .progress-track { width: 100%; height: 4px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; width: 0%; background-color: #E5BC3A; border-radius: 10px; box-shadow: 0 0 10px rgba(229, 188, 58, 0.5); animation: loading 2.5s cubic-bezier(0.65, 0, 0.35, 1) forwards 1.5s; }
                
                @keyframes popIn { to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
                @keyframes loading { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
                @keyframes float { to { transform: translate(20px, 20px); } }
            `}</style>

            <div className="ambient-glow glow-gold"></div>
            <div class="ambient-glow glow-blue"></div>

            <div className="logo-wrapper">
                <div className="logo-text">
                    <span className="letter letter-white">S</span>
                    <span className="letter letter-white">A</span>
                    <span className="letter letter-gold">F</span>
                    <span className="letter letter-white">Y</span>
                </div>
                <div className="tagline">Your Time, Your Rewards</div>
            </div>

            <div className="loader-container">
                <div className="progress-track">
                    <div className="progress-fill"></div>
                </div>
            </div>
        </div>
    );
}