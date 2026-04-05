"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function ScreenRecorderPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Inject the recorder script after mount so it has access to DOM
    const script = document.createElement("script");
    script.textContent = `
      (function() {
        let mediaRecorder = null;
        let chunks = [];
        let stream = null;
        let timerInterval = null;
        let elapsedSeconds = 0;
        let recIndex = 0;

        const startBtn    = document.getElementById('sr-startBtn');
        const pauseBtn    = document.getElementById('sr-pauseBtn');
        const stopBtn     = document.getElementById('sr-stopBtn');
        const badge       = document.getElementById('sr-badge');
        const timerEl     = document.getElementById('sr-timer');
        const previewWrap = document.getElementById('sr-preview-wrap');
        const preview     = document.getElementById('sr-preview');
        const recList     = document.getElementById('sr-recordings');
        const emptyState  = document.getElementById('sr-emptyState');

        function formatTime(s) {
          const m = Math.floor(s / 60);
          const sec = String(s % 60).padStart(2, '0');
          return m + ':' + sec;
        }

        function setBadge(state) {
          badge.className = 'sr-badge ' + state;
          const labels = { '': 'Idle', recording: '● Recording', paused: '⏸ Paused' };
          badge.innerHTML = '<span class="sr-dot"></span> ' + (labels[state] || 'Idle');
        }

        function startTimer() {
          timerInterval = setInterval(() => {
            elapsedSeconds++;
            timerEl.textContent = formatTime(elapsedSeconds);
          }, 1000);
        }

        function stopTimer() {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        startBtn.onclick = async () => {
          try {
            const micAudio = document.getElementById('sr-audioCheck').checked;
            const sysAudio = document.getElementById('sr-sysAudioCheck').checked;
            const bitrate  = parseInt(document.getElementById('sr-qualitySelect').value);

            stream = await navigator.mediaDevices.getDisplayMedia({
              video: { frameRate: 30 },
              audio: sysAudio,
            });

            if (micAudio) {
              try {
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                micStream.getAudioTracks().forEach(t => stream.addTrack(t));
              } catch(e) { /* mic denied — continue without */ }
            }

            stream.getVideoTracks()[0].addEventListener('ended', () => {
              if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
            });

            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
              ? 'video/webm;codecs=vp9,opus'
              : MediaRecorder.isTypeSupported('video/webm')
              ? 'video/webm'
              : 'video/mp4';

            mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate });
            chunks = [];

            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            mediaRecorder.onstop = () => saveRecording(mimeType);

            mediaRecorder.start(1000);
            elapsedSeconds = 0;
            timerEl.textContent = '0:00';
            startTimer();

            preview.srcObject = stream;
            previewWrap.style.display = 'block';

            setBadge('recording');
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled  = false;

          } catch (err) {
            if (err.name !== 'NotAllowedError') {
              alert('Could not start recording: ' + err.message);
            }
          }
        };

        pauseBtn.onclick = () => {
          if (!mediaRecorder) return;
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            stopTimer();
            setBadge('paused');
            pauseBtn.textContent = '▶ Resume';
          } else if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            startTimer();
            setBadge('recording');
            pauseBtn.textContent = '⏸ Pause';
          }
        };

        stopBtn.onclick = () => {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
          if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
          }
          stopTimer();
          preview.srcObject = null;
          previewWrap.style.display = 'none';
          setBadge('');
          timerEl.textContent = '0:00';
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          pauseBtn.textContent = '⏸ Pause';
          stopBtn.disabled  = true;
        };

        function saveRecording(mimeType) {
          const ext  = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const blob = new Blob(chunks, { type: mimeType });
          const url  = URL.createObjectURL(blob);
          const now  = new Date();
          const ts   = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          const dur  = formatTime(elapsedSeconds);
          const name = 'FinancePlots_Recording_' + (++recIndex);
          const size = (blob.size / 1024 / 1024).toFixed(1) + ' MB';

          emptyState.style.display = 'none';

          const card = document.createElement('div');
          card.className = 'sr-rec-card';
          card.id = 'sr-rec-' + recIndex;
          const recId = recIndex;

          card.innerHTML =
            '<div class="sr-rec-top">' +
              '<div>' +
                '<div class="sr-rec-name">🎬 ' + name + '.' + ext + '</div>' +
                '<div class="sr-rec-meta">' + ts + ' · ' + dur + ' · ' + size + '</div>' +
              '</div>' +
              '<div class="sr-rec-actions">' +
                '<a class="sr-btn-sm sr-btn-download" href="' + url + '" download="' + name + '.' + ext + '">⬇ Download</a>' +
                '<button class="sr-btn-sm sr-btn-share" data-name="' + name + '.' + ext + '">📤 Share</button>' +
                '<a class="sr-btn-sm sr-btn-email" href="mailto:?subject=Screen%20Recording%20from%20FinancePlots&body=Hi%2C%0A%0AI%20recorded%20this%20using%20the%20FinancePlots%20Screen%20Recorder.%0APlease%20find%20the%20attached%20file%3A%20' + name + '.' + ext + '%0A%0Ahttps%3A%2F%2Fwww.financeplots.com%2Ftools%2Fscreen-recorder">✉️ Email</a>' +
                '<button class="sr-btn-sm sr-btn-delete" data-id="sr-rec-' + recId + '" data-url="' + url + '">🗑 Delete</button>' +
              '</div>' +
            '</div>' +
            '<video class="sr-rec-video" src="' + url + '" controls></video>';

          // Share button — uses Web Share API on mobile, falls back to download prompt on desktop
          card.querySelector('.sr-btn-share').onclick = async function() {
            const fileName = this.dataset.name;
            if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: mimeType })] })) {
              try {
                await navigator.share({
                  files: [new File([blob], fileName, { type: mimeType })],
                  title: 'Screen Recording — FinancePlots',
                  text: 'Recorded with FinancePlots Screen Recorder',
                });
              } catch(e) { /* user cancelled */ }
            } else {
              alert('Direct sharing is not supported in this browser. Please use Download and share the file manually via WhatsApp or email.');
            }
          };

          card.querySelector('.sr-btn-delete').onclick = function() {
            const c = document.getElementById(this.dataset.id);
            if (c) c.remove();
            URL.revokeObjectURL(this.dataset.url);
            if (!recList.querySelector('.sr-rec-card')) {
              emptyState.style.display = '';
            }
          };

          recList.insertBefore(card, recList.firstChild);
        }
      })();
    `;
    el.appendChild(script);

    return () => {
      if (el.contains(script)) el.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-24 pb-16 px-6">
      <style>{`
        .sr-info-box {
          background: #1e3a5f; border: 1px solid #2563eb33; border-radius: 10px;
          padding: 12px 16px; font-size: 0.85rem; color: #93c5fd;
          margin-bottom: 20px; line-height: 1.6;
        }
        .sr-options {
          display: flex; flex-wrap: wrap; gap: 16px;
          margin-bottom: 20px; align-items: center;
        }
        .sr-opt-label {
          font-size: 0.82rem; font-weight: 600; color: #9ca3af;
          display: flex; align-items: center; gap: 8px;
        }
        .sr-opt-label select {
          padding: 5px 10px; border: 1px solid #374151; border-radius: 6px;
          font-size: 0.82rem; background: #111827; color: #e5e7eb;
        }
        .sr-checkbox-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.82rem; font-weight: 600; color: #9ca3af; cursor: pointer;
        }
        .sr-controls {
          display: flex; flex-wrap: wrap; gap: 12px;
          align-items: center; margin-bottom: 20px;
        }
        .sr-controls button {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border: none; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .sr-controls button:active { transform: scale(0.97); }
        .sr-controls button:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
        #sr-startBtn { background: #2563eb; color: #fff; }
        #sr-startBtn:hover:not(:disabled) { background: #1d4ed8; }
        #sr-stopBtn  { background: #dc2626; color: #fff; }
        #sr-stopBtn:hover:not(:disabled)  { background: #b91c1c; }
        #sr-pauseBtn { background: #d97706; color: #fff; }
        #sr-pauseBtn:hover:not(:disabled) { background: #b45309; }
        .sr-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 20px;
          font-size: 0.82rem; font-weight: 600;
          background: #1f2937; color: #6b7280;
        }
        .sr-badge.recording { background: #450a0a; color: #f87171; }
        .sr-badge.paused    { background: #451a03; color: #fb923c; }
        .sr-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: currentColor; display: inline-block;
        }
        .sr-badge.recording .sr-dot { animation: sr-blink 1s infinite; }
        @keyframes sr-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        #sr-timer { font-size: 0.82rem; font-weight: 700; color: #d1d5db; min-width: 42px; }
        #sr-preview-wrap {
          position: relative; background: #0f172a; border-radius: 10px;
          overflow: hidden; margin-bottom: 20px; display: none; min-height: 80px;
          border: 1px solid #1e293b;
        }
        #sr-preview { width: 100%; max-height: 320px; display: block; object-fit: contain; }
        .sr-preview-label {
          position: absolute; top: 8px; left: 10px;
          font-size: 0.72rem; font-weight: 700;
          color: rgba(255,255,255,0.4); letter-spacing: 0.06em; text-transform: uppercase;
        }
        #sr-recordings { display: flex; flex-direction: column; gap: 12px; }
        .sr-rec-card {
          background: #0d1426; border: 1px solid #1e293b;
          border-radius: 10px; padding: 14px 16px;
        }
        .sr-rec-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
        }
        .sr-rec-name { font-size: 0.88rem; font-weight: 700; color: #e2e8f0; }
        .sr-rec-meta { font-size: 0.78rem; color: #6b7280; }
        .sr-rec-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .sr-btn-sm {
          padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
          border: none; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .sr-btn-download { background: #2563eb; color: #fff; }
        .sr-btn-download:hover { background: #1d4ed8; }
        .sr-btn-share { background: #16a34a; color: #fff; border: none; cursor: pointer; }
        .sr-btn-share:hover { background: #15803d; }
        .sr-btn-email { background: transparent; color: #60a5fa; border: 1px solid #1e3a5f; }
        .sr-btn-email:hover { background: #1e3a5f; }
        .sr-btn-delete { background: transparent; color: #f87171; border: 1px solid #7f1d1d; }
        .sr-btn-delete:hover { background: #450a0a; }
        .sr-rec-video {
          width: 100%; max-height: 220px; border-radius: 6px;
          background: #0f172a; margin-top: 6px; display: block;
        }
        .sr-empty { text-align: center; padding: 30px 0 10px; color: #4b5563; font-size: 0.88rem; }
      `}</style>

      <div className="max-w-3xl mx-auto">
        <Link href="/tools" className="text-sm text-blue-400 hover:text-blue-300 transition mb-6 inline-block">
          ← All Tools
        </Link>

        <h1 className="text-3xl font-extrabold mb-2">🎥 Screen Recorder</h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          Record your screen and download the video to share with colleagues.
          Everything runs in your browser — nothing is uploaded anywhere.
        </p>

        <div ref={containerRef}>
          <div className="sr-info-box">
            ℹ️ Your browser will ask you to choose what to share (entire screen, a window, or a tab).
            Recordings stay entirely in your browser — nothing is sent to any server.
          </div>

          {/* Options */}
          <div className="sr-options">
            <label className="sr-opt-label">
              Quality:
              <select id="sr-qualitySelect">
                <option value="2500000">High (2.5 Mbps)</option>
                <option value="1000000" defaultValue="1000000">Standard (1 Mbps)</option>
                <option value="400000">Low (400 Kbps)</option>
              </select>
            </label>
            <label className="sr-checkbox-label">
              <input type="checkbox" id="sr-audioCheck" defaultChecked />
              Include microphone audio
            </label>
            <label className="sr-checkbox-label">
              <input type="checkbox" id="sr-sysAudioCheck" defaultChecked />
              Include system audio
            </label>
          </div>

          {/* Controls */}
          <div className="sr-controls">
            <button id="sr-startBtn">▶ Start Recording</button>
            <button id="sr-pauseBtn" disabled>⏸ Pause</button>
            <button id="sr-stopBtn" disabled>⏹ Stop</button>
            <span id="sr-badge" className="sr-badge"><span className="sr-dot" />  Idle</span>
            <span id="sr-timer">0:00</span>
          </div>

          {/* Live preview */}
          <div id="sr-preview-wrap">
            <span className="sr-preview-label">Live preview</span>
            <video id="sr-preview" autoPlay muted playsInline />
          </div>

          {/* Recordings list */}
          <div id="sr-recordings">
            <div className="sr-empty" id="sr-emptyState">No recordings yet — hit Start to begin.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
