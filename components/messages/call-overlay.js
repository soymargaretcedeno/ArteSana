/**
 * Llamadas de voz y video desde el chat (micrófono/cámara + marcación tel:).
 */
(function (global) {
    'use strict';

    const ARTESANA_PHONE = '+50763962388';
    const FALLBACK_PHONES = {
        '1': '+507 6396-2388',
        '3': '+507 6234-5678',
        '5': '+507 6345-6789',
        '8': '+507 6456-7890',
        'ana diaz': '+507 6396-2388',
        'ana díaz': '+507 6396-2388',
        'maria gonzalez': '+507 6234-5678',
        'maría gonzález': '+507 6234-5678'
    };

    let activeCall = null;

    function t(key, fallback) {
        return global.MessagesUtils ? global.MessagesUtils.t(key, fallback) : fallback;
    }

    function esc(value) {
        if (global.MessagesUtils?.esc) return global.MessagesUtils.esc(value);
        const n = document.createElement('div');
        n.textContent = String(value ?? '');
        return n.innerHTML;
    }

    function digits(phone) {
        const cleaned = String(phone || '').replace(/[^\d+]/g, '');
        return cleaned.length >= 7 ? cleaned : '';
    }

    function resolvePhone(thread) {
        if (!thread) return ARTESANA_PHONE;
        if (thread.phone && digits(thread.phone)) return thread.phone;
        if (thread.type === 'directors') return ARTESANA_PHONE;

        const users = global.localDB?.users || global.localDB?.getAllUsers?.() || [];
        const artisan = users.find((user) =>
            String(user.id) === String(thread.artisanId) ||
            String(user.name || '').toLowerCase() === String(thread.artisanName || '').toLowerCase()
        );
        if (artisan?.phone && digits(artisan.phone)) return artisan.phone;

        const byId = FALLBACK_PHONES[String(thread.artisanId)];
        if (byId) return byId;
        const byName = FALLBACK_PHONES[String(thread.artisanName || '').toLowerCase()];
        return byName || ARTESANA_PHONE;
    }

    function formatPhone(phone) {
        const raw = digits(phone);
        if (raw.startsWith('+507') && raw.length >= 11) {
            return `+507 ${raw.slice(4, 8)}-${raw.slice(8)}`;
        }
        return phone || raw;
    }

    function stopStream(stream) {
        stream?.getTracks?.().forEach((track) => track.stop());
    }

    function startRingtone() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        const ctx = new AudioCtx();
        let stopped = false;
        const beep = () => {
            if (stopped) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 440;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1);
        };
        beep();
        const timer = setInterval(beep, 1800);
        return {
            stop() {
                stopped = true;
                clearInterval(timer);
                ctx.close().catch(() => {});
            }
        };
    }

    function mountOverlay(html) {
        hangUp(false);
        const wrap = document.createElement('div');
        wrap.id = 'artesanaCallOverlay';
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        return wrap;
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    async function start(thread, mode) {
        const isVideo = mode === 'video';
        const name = thread?.artisanName || t('msg_artisan', 'Artesano');
        const avatar = thread?.artisanAvatar || '';
        const phone = resolvePhone(thread);
        const tel = digits(phone);

        const overlay = mountOverlay(`
            <div class="call-overlay" role="dialog" aria-modal="true" aria-label="${esc(t('msg_call', 'Llamada'))}">
                ${isVideo ? '<video class="call-remote-video" id="callRemoteVideo" autoplay playsinline></video>' : ''}
                <div class="call-scrim"></div>
                <div class="call-card">
                    ${avatar
                        ? `<img class="call-avatar" src="${esc(avatar)}" alt="">`
                        : `<div class="call-avatar call-avatar-fallback">${esc((name || 'A').slice(0, 1))}</div>`}
                    <p class="call-name">${esc(name)}</p>
                    <p class="call-status" id="callStatus">${esc(t('msg_calling', 'Llamando…'))}</p>
                    <p class="call-phone">${esc(formatPhone(phone))}</p>
                    <p class="call-timer" id="callTimer">00:00</p>
                    ${isVideo ? '<video class="call-local-video" id="callLocalVideo" autoplay muted playsinline></video>' : ''}
                    <div class="call-actions">
                        <button type="button" class="call-btn call-btn-mute" id="callMuteBtn" aria-label="${esc(t('msg_mute', 'Silenciar'))}">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button type="button" class="call-btn call-btn-hang" id="callHangBtn" aria-label="${esc(t('msg_hangup', 'Colgar'))}">
                            <i class="fas fa-phone-slash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);

        const ring = startRingtone();
        activeCall = { overlay, ring, stream: null, timer: null, startedAt: 0, muted: false };

        overlay.querySelector('#callHangBtn')?.addEventListener('click', () => hangUp(true));
        overlay.querySelector('#callMuteBtn')?.addEventListener('click', toggleMute);

        if (tel) {
            const link = document.createElement('a');
            link.href = `tel:${tel}`;
            link.style.display = 'none';
            overlay.appendChild(link);
            setTimeout(() => link.click(), 280);
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: isVideo
            });
            if (!activeCall || activeCall.overlay !== overlay) {
                stopStream(stream);
                return;
            }
            activeCall.stream = stream;
            const localVideo = overlay.querySelector('#callLocalVideo');
            const remoteVideo = overlay.querySelector('#callRemoteVideo');
            if (localVideo) localVideo.srcObject = stream;
            if (remoteVideo) remoteVideo.srcObject = stream;
            connectCall(overlay, ring);
        } catch (err) {
            connectCall(overlay, ring);
        }
    }

    function connectCall(overlay, ring) {
        setTimeout(() => {
            if (!activeCall || activeCall.overlay !== overlay) return;
            ring?.stop();
            activeCall.ring = null;
            const status = overlay.querySelector('#callStatus');
            if (status) status.textContent = t('msg_in_call', 'En llamada');
            activeCall.startedAt = Date.now();
            activeCall.timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - activeCall.startedAt) / 1000);
                const timerEl = overlay.querySelector('#callTimer');
                if (timerEl) timerEl.textContent = `${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`;
            }, 250);
        }, 1400);
    }

    function toggleMute() {
        if (!activeCall?.stream) return;
        activeCall.muted = !activeCall.muted;
        activeCall.stream.getAudioTracks().forEach((track) => {
            track.enabled = !activeCall.muted;
        });
        const btn = activeCall.overlay.querySelector('#callMuteBtn');
        if (btn) {
            btn.classList.toggle('is-muted', activeCall.muted);
            btn.innerHTML = activeCall.muted
                ? '<i class="fas fa-microphone-slash"></i>'
                : '<i class="fas fa-microphone"></i>';
        }
    }

    function hangUp(notify) {
        if (!activeCall) return;
        activeCall.ring?.stop();
        if (activeCall.timer) clearInterval(activeCall.timer);
        stopStream(activeCall.stream);
        activeCall.overlay.remove();
        activeCall = null;
        if (notify && global.PlatformServices?.sendMessage && global.MessagesUtils) {
            /* keep hang-up local; no extra chat spam */
        }
    }

    global.MessagesCall = { start, hangUp, resolvePhone };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeCall) {
            event.preventDefault();
            event.stopImmediatePropagation();
            hangUp(true);
        }
    }, true);
})(window);
