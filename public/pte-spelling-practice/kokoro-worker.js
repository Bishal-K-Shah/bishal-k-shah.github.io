/* eslint-disable no-restricted-globals */
"use strict";

let tts = null;

function progressPercent(info) {
  if (!info) {
    return null;
  }
  if (typeof info.progress === "number") {
    return info.progress <= 1 ? info.progress * 100 : info.progress;
  }
  if (info.loaded && info.total) {
    return (info.loaded / info.total) * 100;
  }
  return null;
}

function extractSamples(raw) {
  const audio = raw && (raw.audio || raw.data || raw);
  if (audio instanceof Float32Array) {
    return audio.slice();
  }
  if (audio && audio.data instanceof Float32Array) {
    return audio.data.slice();
  }
  if (ArrayBuffer.isView(audio)) {
    return new Float32Array(audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength));
  }
  throw new Error("Kokoro did not return audio samples");
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  const { id, type } = msg;
  try {
    if (type === "load") {
      const mod = await import(/* webpackIgnore: true */ msg.moduleUrl);
      const KokoroTTS = mod.KokoroTTS || (mod.default && mod.default.KokoroTTS);
      if (!KokoroTTS) {
        throw new Error("kokoro-js did not export KokoroTTS");
      }
      tts = await KokoroTTS.from_pretrained(msg.modelId, {
        dtype: "q8",
        device: "wasm",
        progress_callback: (info) => {
          const pct = progressPercent(info);
          if (pct !== null) {
            self.postMessage({ id, type: "progress", percent: pct });
          }
        },
      });
      self.postMessage({ id, type: "ready" });
      return;
    }

    if (type === "generate") {
      if (!tts) {
        throw new Error("Kokoro is not loaded");
      }
      const raw = await tts.generate(msg.text, {
        voice: msg.voice || "af_bella",
        speed: typeof msg.speed === "number" ? msg.speed : 1,
      });
      const samples = extractSamples(raw);
      self.postMessage(
        {
          id,
          type: "audio",
          samples,
          sampleRate: (raw && raw.sampling_rate) || 24000,
        },
        [samples.buffer]
      );
      return;
    }

    throw new Error(`Unknown worker message: ${type}`);
  } catch (err) {
    self.postMessage({
      id,
      type: "error",
      message: err && err.message ? err.message : String(err),
    });
  }
};
