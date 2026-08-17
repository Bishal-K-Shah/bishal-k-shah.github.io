(function () {
  "use strict";

  const REPEAT_GAP_MS = {
    tight: 900,
    natural: 2500,
    relaxed: 4500,
  };
  const CORRECT_HOLD_MS = 550;
  const BETWEEN_GROUPS_MS = 400;
  const SPEECH_WAIT_MAX_MS = 15000;
  const KOKORO_DOWNLOAD_LABEL = "Download better voice (~90 MB, One-time)";
  const KOKORO_VOICE_ID = "kokoro:af_bella";
  const KOKORO_VOICE_LABEL = "Better voice — Kokoro Bella (downloaded)";
  const KOKORO_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
  const KOKORO_MODULE_URL = "https://esm.sh/kokoro-js@1.2.1";

  const PRESETS = {
    wordlist: {
      wordsPerGroup: 1,
      text: [
        "definitely",
        "separate",
        "necessary",
        "occurrence",
        "embarrass",
        "government",
        "environment",
        "independent",
        "immediately",
        "successful",
        "recommend",
        "privilege",
        "consensus",
        "calendar",
        "committed",
        "accidentally",
        "beginning",
        "business",
        "achieve",
        "existence",
        "foreign",
        "until",
        "noticeable",
        "available",
        "experience",
        "knowledge",
        "research",
        "development",
        "approximately",
        "sufficient",
        "argument",
        "conscience",
        "conscious",
        "apparent",
        "beneficial",
        "committee",
        "correspondence",
        "grateful",
        "hygiene",
        "liaison",
      ].join("\n"),
    },
    essay: {
      wordsPerGroup: 3,
      text: [
        "Governments frequently face a difficult choice between public education and commercial development. It is often argued that they should immediately increase expenditure on schools, because knowledge, research, and experience are necessary for successful, independent progress. Critics, however, recommend a separate strategy that privileges business committees and correspondence with foreign investors instead.",
        "In my view, this argument is definitely not sufficient. An apparent lack of opportunity can embarrass a beginning student and damage the existence of a foreign correspondence programme. A committed government must achieve consensus rather than wait until the occurrence of a crisis in the environment.",
        "For example, a noticeable improvement in hygiene, available facilities, and professional liaison is beneficial for young people. The conscience of a conscious society should be grateful for this calendar of responsibility. Accidentally neglecting such development would harm future generations and reduce their privilege of education.",
        "In conclusion, although some people remain sceptical, sufficient and successful investment in education is more necessary than a purely commercial approach. Governments should therefore recommend this policy without delay, remain committed until it is achieved, and accept the occurrence of short-term costs as a beneficial, noticeable, and definitely worthwhile sacrifice. This remains a necessary argument for independent development.",
      ].join("\n\n"),
    },
  };

  const els = {
    sourceText: document.getElementById("source-text"),
    fileUpload: document.getElementById("file-upload"),
    fileName: document.getElementById("file-name"),
    wordCount: document.getElementById("word-count"),
    wordsPerGroup: document.getElementById("words-per-group"),
    repeatModeRadios: document.querySelectorAll('input[name="repeat-mode"]'),
    repeatCountWrap: document.getElementById("repeat-count-wrap"),
    repeatCount: document.getElementById("repeat-count"),
    repeatGapRadios: document.querySelectorAll('input[name="repeat-gap"]'),
    voiceSelect: document.getElementById("voice-select"),
    kokoroWrap: document.getElementById("kokoro-wrap"),
    kokoroBtn: document.getElementById("kokoro-btn"),
    kokoroRemove: document.getElementById("kokoro-remove"),
    kokoroStatus: document.getElementById("kokoro-status"),
    kokoroProgressTrack: document.getElementById("kokoro-progress-track"),
    kokoroProgressBar: document.getElementById("kokoro-progress-bar"),
    speechRate: document.getElementById("speech-rate"),
    rateValue: document.getElementById("rate-value"),
    showAnswerBtn: document.getElementById("show-answer-btn"),
    startBtn: document.getElementById("start-btn"),
    setupPanel: document.getElementById("setup-panel"),
    practicePanel: document.getElementById("practice-panel"),
    completePanel: document.getElementById("complete-panel"),
    progress: document.getElementById("progress"),
    progressBar: document.getElementById("progress-bar"),
    status: document.getElementById("status"),
    audioToggle: document.getElementById("audio-toggle"),
    answerReveal: document.getElementById("answer-reveal"),
    revealText: document.getElementById("reveal-text"),
    answerInput: document.getElementById("answer-input"),
    submitBtn: document.getElementById("submit-btn"),
    replayBtn: document.getElementById("replay-btn"),
    stopBtn: document.getElementById("stop-btn"),
    completeSummary: document.getElementById("complete-summary"),
    retryListWrap: document.getElementById("retry-list-wrap"),
    retryList: document.getElementById("retry-list"),
    restartBtn: document.getElementById("restart-btn"),
    presetWordlist: document.getElementById("preset-wordlist"),
    presetEssay: document.getElementById("preset-essay"),
    assembledWrap: document.getElementById("assembled-wrap"),
    assembledText: document.getElementById("assembled-text"),
  };

  let groups = [];
  let groupSize = 3;
  let currentIndex = 0;
  let sessionActive = false;
  let acceptingInput = true;
  let repeatTimer = null;
  let repeatTimerResolve = null;
  let speakGeneration = 0;
  let currentSpeakPromise = Promise.resolve();
  let answerVisible = false;
  let audioPaused = false;
  const STORAGE_KEY = "pte-spelling-drill";
  let savedVoiceName = "";
  let saveTimer = null;
  let kokoroDownloadedFlag = false;
  let kokoroReady = false;
  let kokoroTts = null;
  let kokoroWorker = null;
  let kokoroReqId = 0;
  const kokoroWaiters = new Map();
  const kokoroClipCache = new Map();
  const kokoroPending = new Map();
  let kokoroAudioCtx = null;
  let kokoroSource = null;
  let kokoroPlayResolve = null;
  let kokoroAudio = null;
  let kokoroObjectUrl = null;
  let kokoroLoading = false;
  const attemptCounts = new Map();

  function stripWord(word) {
    return word.replace(/^[^\w']+|[^\w']+$/g, "");
  }

  function tokenize(text) {
    return text
      .split(/\s+/)
      .map(stripWord)
      .filter(Boolean);
  }

  function chunkWords(words, size) {
    const n = Math.max(1, Math.min(5, size));
    const result = [];
    for (let i = 0; i < words.length; i += n) {
      result.push(words.slice(i, i + n));
    }
    return result;
  }

  function normalizeAnswer(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(" ")
      .map(stripWord)
      .filter(Boolean)
      .join(" ");
  }

  function groupToExpected(group) {
    return group.map((w) => w.toLowerCase()).join(" ");
  }

  function groupToDisplay(group) {
    return group.join(" ");
  }

  function matchesGroup(typed, group) {
    return normalizeAnswer(typed) === groupToExpected(group);
  }

  function typedWordCount(text) {
    return text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function isSpaceAfterLastWord(text, group) {
    return typedWordCount(text) >= group.length;
  }

  function getRepeatMode() {
    const selected = document.querySelector('input[name="repeat-mode"]:checked');
    return selected ? selected.value : "until-typed";
  }

  function setRepeatMode(mode) {
    els.repeatModeRadios.forEach((radio) => {
      radio.checked = radio.value === mode;
    });
  }

  function getRepeatGap() {
    const selected = document.querySelector('input[name="repeat-gap"]:checked');
    const value = selected ? selected.value : "natural";
    return REPEAT_GAP_MS[value] ? value : "natural";
  }

  function setRepeatGap(tier) {
    const next = REPEAT_GAP_MS[tier] ? tier : "natural";
    els.repeatGapRadios.forEach((radio) => {
      radio.checked = radio.value === next;
    });
  }

  function getRepeatGapMs() {
    return REPEAT_GAP_MS[getRepeatGap()];
  }

  function getActivePreset() {
    if (els.presetWordlist.classList.contains("active")) {
      return "wordlist";
    }
    if (els.presetEssay.classList.contains("active")) {
      return "essay";
    }
    return "";
  }

  function saveState() {
    try {
      const data = {
        sourceText: els.sourceText.value,
        wordsPerGroup: els.wordsPerGroup.value,
        repeatMode: getRepeatMode(),
        repeatCount: els.repeatCount.value,
        repeatGap: getRepeatGap(),
        speechRate: els.speechRate.value,
        voice: els.voiceSelect.value,
        preset: getActivePreset(),
        kokoroDownloaded: kokoroDownloadedFlag,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      // Ignore quota / private-mode failures.
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 250);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const data = JSON.parse(raw);
      if (typeof data.sourceText === "string") {
        els.sourceText.value = data.sourceText;
      }
      if (data.wordsPerGroup) {
        els.wordsPerGroup.value = String(data.wordsPerGroup);
      }
      if (data.repeatMode === "until-typed" || data.repeatMode === "multiple-times") {
        setRepeatMode(data.repeatMode);
      }
      if (data.repeatCount) {
        els.repeatCount.value = String(data.repeatCount);
      }
      if (data.repeatGap) {
        setRepeatGap(data.repeatGap);
      }
      if (data.speechRate) {
        els.speechRate.value = String(data.speechRate);
        els.rateValue.textContent = els.speechRate.value;
      }
      if (typeof data.voice === "string") {
        savedVoiceName = data.voice;
      }
      kokoroDownloadedFlag = Boolean(data.kokoroDownloaded);
      if (data.preset === "wordlist" || data.preset === "essay") {
        els.presetWordlist.classList.toggle("active", data.preset === "wordlist");
        els.presetEssay.classList.toggle("active", data.preset === "essay");
      }
    } catch (err) {
      // Ignore invalid stored data.
    }
  }

  function updateWordCount() {
    const n = tokenize(els.sourceText.value).length;
    els.wordCount.textContent = n ? `${n} word${n === 1 ? "" : "s"}` : "";
    els.startBtn.disabled = n === 0;
  }

  function updateRepeatCountVisibility() {
    const show = getRepeatMode() === "multiple-times";
    els.repeatCountWrap.classList.toggle("hidden", !show);
  }

  function hideAnswer() {
    answerVisible = false;
    updateAnswerReveal();
  }

  function toggleAnswer() {
    if (!sessionActive || !groups[currentIndex]) {
      return;
    }
    answerVisible = !answerVisible;
    updateAnswerReveal();
  }

  function updateAnswerReveal() {
    const on = answerVisible && sessionActive && groups[currentIndex];
    els.answerReveal.classList.toggle("hidden", !on);
    els.showAnswerBtn.classList.toggle("revealed", on);
    els.showAnswerBtn.textContent = on ? "Hide Answer (Esc)" : "Show Answer (Esc)";
    if (on) {
      els.revealText.textContent = groupToDisplay(groups[currentIndex]);
    }
  }

  function setStatus(text, kind) {
    els.status.textContent = text;
    els.status.classList.remove("is-correct", "is-wrong");
    if (kind) {
      els.status.classList.add(kind);
    }
  }

  function isDesktop() {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") {
      return !navigator.userAgentData.mobile;
    }
    return !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  }

  function isGoogleVoice(voice) {
    const blob = `${voice.name || ""} ${voice.voiceURI || ""}`;
    return /google/i.test(blob);
  }

  function preferredGoogleVoice(list) {
    const google = list.filter(isGoogleVoice);
    const us = google.find((v) => /en-US/i.test(v.lang) || /US English/i.test(v.name));
    return us || google[0] || null;
  }

  function isKokoroSelected() {
    return els.voiceSelect.value === KOKORO_VOICE_ID;
  }

  function addVoiceOption(parent, value, label) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    parent.appendChild(opt);
  }

  function getVoiceList() {
    const voices = speechSynthesis.getVoices();
    const english = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
    return english.length ? english : voices;
  }

  function loadVoices() {
    const list = getVoiceList();
    const previous = savedVoiceName || els.voiceSelect.value;
    els.voiceSelect.innerHTML = "";

    if (kokoroReady) {
      const downloaded = document.createElement("optgroup");
      downloaded.label = "Downloaded";
      addVoiceOption(downloaded, KOKORO_VOICE_ID, KOKORO_VOICE_LABEL);
      els.voiceSelect.appendChild(downloaded);
    }

    const google = list.filter(isGoogleVoice);
    const other = list.filter((v) => !isGoogleVoice(v));

    if (google.length) {
      const group = document.createElement("optgroup");
      group.label = "Google";
      google.forEach((voice) => {
        addVoiceOption(group, voice.name, `${voice.name} (${voice.lang})`);
      });
      els.voiceSelect.appendChild(group);
    }

    if (other.length) {
      const group = document.createElement("optgroup");
      group.label = "Other system voices";
      other.forEach((voice) => {
        addVoiceOption(group, voice.name, `${voice.name} (${voice.lang})`);
      });
      els.voiceSelect.appendChild(group);
    }

    const values = [...els.voiceSelect.options].map((opt) => opt.value);
    if (!values.length) {
      addVoiceOption(els.voiceSelect, "", "Default voice");
      return;
    }

    if (previous && values.includes(previous)) {
      els.voiceSelect.value = previous;
      return;
    }
    if (savedVoiceName && values.includes(savedVoiceName)) {
      els.voiceSelect.value = savedVoiceName;
      return;
    }

    const googleDefault = preferredGoogleVoice(list);
    els.voiceSelect.value = googleDefault ? googleDefault.name : values[0];
    if (!savedVoiceName) {
      savedVoiceName = els.voiceSelect.value;
      saveState();
    }
  }

  function getSelectedVoice() {
    const list = getVoiceList();
    const selected = els.voiceSelect.value;
    return list.find((v) => v.name === selected) || preferredGoogleVoice(list) || list[0] || null;
  }

  function finishKokoroPlay() {
    const resolve = kokoroPlayResolve;
    kokoroPlayResolve = null;
    if (resolve) {
      resolve();
    }
  }

  function stopKokoroAudio() {
    finishKokoroPlay();
    if (kokoroSource) {
      kokoroSource.onended = null;
      try {
        kokoroSource.stop();
      } catch (err) {
        // Already stopped.
      }
      try {
        kokoroSource.disconnect();
      } catch (err) {
        // Already disconnected.
      }
      kokoroSource = null;
    }
    if (kokoroAudio) {
      kokoroAudio.onended = null;
      kokoroAudio.onerror = null;
      kokoroAudio.pause();
      kokoroAudio.removeAttribute("src");
      kokoroAudio.load();
      kokoroAudio = null;
    }
    if (kokoroObjectUrl) {
      URL.revokeObjectURL(kokoroObjectUrl);
      kokoroObjectUrl = null;
    }
  }

  function clearRepeatTimer() {
    if (repeatTimer) {
      clearTimeout(repeatTimer);
      repeatTimer = null;
    }
    if (repeatTimerResolve) {
      const resolve = repeatTimerResolve;
      repeatTimerResolve = null;
      resolve();
    }
  }

  function waitRepeatGap() {
    return new Promise((resolve) => {
      repeatTimerResolve = resolve;
      repeatTimer = setTimeout(() => {
        repeatTimer = null;
        repeatTimerResolve = null;
        resolve();
      }, getRepeatGapMs());
    });
  }

  function stopRepeats() {
    speakGeneration += 1;
    clearRepeatTimer();
  }

  function cancelSpeech() {
    stopRepeats();
    speechSynthesis.cancel();
    stopKokoroAudio();
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function waitForCurrentSpeech() {
    return Promise.race([currentSpeakPromise, wait(SPEECH_WAIT_MAX_MS)]);
  }

  function floatTo16BitWav(float32, sampleRate) {
    const samples = float32.length;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i += 1) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples * 2, true);
    let offset = 44;
    for (let i = 0; i < samples; i += 1) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  function extractKokoroSamples(raw) {
    const audio = raw && (raw.audio || raw.data || raw);
    if (audio instanceof Float32Array) {
      return audio;
    }
    if (audio && audio.data instanceof Float32Array) {
      return audio.data;
    }
    if (ArrayBuffer.isView(audio)) {
      return new Float32Array(audio.buffer, audio.byteOffset, audio.byteLength / Float32Array.BYTES_PER_ELEMENT);
    }
    throw new Error("Kokoro did not return audio samples");
  }

  function getKokoroAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    if (!kokoroAudioCtx || kokoroAudioCtx.state === "closed") {
      kokoroAudioCtx = new AudioCtx();
    }
    return kokoroAudioCtx;
  }

  function playKokoroWav(samples, sampleRate) {
    return new Promise((resolve) => {
      kokoroPlayResolve = resolve;
      kokoroObjectUrl = URL.createObjectURL(floatTo16BitWav(samples, sampleRate));
      kokoroAudio = new Audio(kokoroObjectUrl);
      kokoroAudio.onended = finishKokoroPlay;
      kokoroAudio.onerror = finishKokoroPlay;
      const started = kokoroAudio.play();
      if (started && typeof started.catch === "function") {
        started.catch(finishKokoroPlay);
      }
    });
  }

  function playKokoroSamples(samples, sampleRate) {
    stopKokoroAudio();
    const ctx = getKokoroAudioContext();
    if (!ctx) {
      return playKokoroWav(samples, sampleRate);
    }

    return (async () => {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const copy = samples.slice();
      let buffer;
      try {
        buffer = ctx.createBuffer(1, copy.length, sampleRate);
        buffer.copyToChannel(copy, 0);
      } catch (err) {
        return playKokoroWav(samples, sampleRate);
      }
      await new Promise((resolve) => {
        kokoroPlayResolve = resolve;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (kokoroSource === source) {
            kokoroSource = null;
          }
          finishKokoroPlay();
        };
        kokoroSource = source;
        source.start();
      });
    })();
  }

  function kokoroAvailable() {
    return Boolean(kokoroWorker || kokoroTts);
  }

  function kokoroClipKey(text) {
    const speed = parseFloat(els.speechRate.value) || 0.9;
    return `${speed}|${text}`;
  }

  function clearKokoroClips() {
    kokoroClipCache.clear();
    kokoroPending.clear();
  }

  function workerCall(payload) {
    return new Promise((resolve, reject) => {
      if (!kokoroWorker) {
        reject(new Error("Kokoro worker is not running"));
        return;
      }
      const id = (kokoroReqId += 1);
      kokoroWaiters.set(id, { resolve, reject });
      kokoroWorker.postMessage({ id, ...payload });
    });
  }

  function handleKokoroWorkerMessage(event) {
    const data = event.data || {};
    if (data.type === "progress") {
      setKokoroProgress(data.percent);
      return;
    }
    const waiter = kokoroWaiters.get(data.id);
    if (!waiter) {
      return;
    }
    kokoroWaiters.delete(data.id);
    if (data.type === "error") {
      waiter.reject(new Error(data.message || "Kokoro worker failed"));
      return;
    }
    waiter.resolve(data);
  }

  function stopKokoroWorker() {
    kokoroWaiters.forEach((waiter) => {
      waiter.reject(new Error("Kokoro worker stopped"));
    });
    kokoroWaiters.clear();
    if (kokoroWorker) {
      kokoroWorker.onmessage = null;
      kokoroWorker.onerror = null;
      kokoroWorker.terminate();
      kokoroWorker = null;
    }
  }

  async function generateKokoroOnMain(text, speed) {
    if (!kokoroTts || typeof kokoroTts.generate !== "function") {
      throw new Error("Kokoro is not loaded");
    }
    const raw = await kokoroTts.generate(text, { voice: "af_bella", speed });
    return {
      samples: extractKokoroSamples(raw).slice(),
      sampleRate: (raw && raw.sampling_rate) || 24000,
    };
  }

  async function generateKokoroClip(text, speed) {
    if (kokoroWorker) {
      const data = await workerCall({
        type: "generate",
        text,
        speed,
        voice: "af_bella",
      });
      const samples = data.samples instanceof Float32Array
        ? data.samples
        : new Float32Array(data.samples);
      return { samples, sampleRate: data.sampleRate || 24000 };
    }
    return generateKokoroOnMain(text, speed);
  }

  function requestKokoroClip(text) {
    const speed = parseFloat(els.speechRate.value) || 0.9;
    const key = kokoroClipKey(text);
    const cached = kokoroClipCache.get(key);
    if (cached) {
      return Promise.resolve(cached);
    }
    const pending = kokoroPending.get(key);
    if (pending) {
      return pending;
    }
    const request = generateKokoroClip(text, speed)
      .then((clip) => {
        kokoroClipCache.set(key, clip);
        if (kokoroClipCache.size > 80) {
          const oldest = kokoroClipCache.keys().next().value;
          kokoroClipCache.delete(oldest);
        }
        return clip;
      })
      .finally(() => {
        kokoroPending.delete(key);
      });
    kokoroPending.set(key, request);
    return request;
  }

  function prefetchKokoroNext(index) {
    if (!isKokoroSelected() || !kokoroAvailable()) {
      return;
    }
    const next = groups[index + 1];
    if (!next) {
      return;
    }
    requestKokoroClip(next.join(" ")).catch(() => {});
  }

  async function startKokoroWorker() {
    stopKokoroWorker();
    const worker = new Worker("/pte-spelling-practice/kokoro-worker.js", { type: "module" });
    kokoroWorker = worker;
    worker.onmessage = handleKokoroWorkerMessage;
    worker.onerror = (event) => {
      const err = new Error(event.message || "Kokoro worker failed");
      kokoroWaiters.forEach((waiter) => waiter.reject(err));
      kokoroWaiters.clear();
    };
    await workerCall({
      type: "load",
      moduleUrl: KOKORO_MODULE_URL,
      modelId: KOKORO_MODEL_ID,
    });
  }

  async function startKokoroMainThread() {
    const mod = await import(/* webpackIgnore: true */ KOKORO_MODULE_URL);
    const KokoroTTS = mod.KokoroTTS || (mod.default && mod.default.KokoroTTS);
    if (!KokoroTTS) {
      throw new Error("kokoro-js did not export KokoroTTS");
    }
    // WebGPU + q8 is a known Kokoro corruption path (hum / static).
    // wasm + q8 is the documented clean setup for this model size.
    kokoroTts = await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
      dtype: "q8",
      device: "wasm",
      progress_callback: (info) => {
        if (!info) {
          return;
        }
        if (typeof info.progress === "number") {
          const pct = info.progress <= 1 ? info.progress * 100 : info.progress;
          setKokoroProgress(pct);
        } else if (info.loaded && info.total) {
          setKokoroProgress((info.loaded / info.total) * 100);
        }
      },
    });
  }

  function speakWebSpeech(text) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getSelectedVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = parseFloat(els.speechRate.value) || 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  }

  function speakKokoro(text) {
    return requestKokoroClip(text).then((clip) => {
      prefetchKokoroNext(currentIndex);
      return playKokoroSamples(clip.samples, clip.sampleRate);
    });
  }

  function speakGroup(group) {
    const text = group.join(" ");
    const play = isKokoroSelected() && kokoroAvailable()
      ? speakKokoro(text).catch((err) => {
          console.warn("Kokoro playback failed, using browser TTS.", err);
          els.kokoroStatus.textContent = "Better voice failed; using browser TTS.";
          return speakWebSpeech(text);
        })
      : speakWebSpeech(text);
    currentSpeakPromise = play.catch(() => {});
    return currentSpeakPromise;
  }

  function setKokoroProgress(percent) {
    const pct = Math.max(0, Math.min(100, percent));
    els.kokoroProgressBar.style.width = `${pct}%`;
  }

  function updateKokoroUi() {
    if (!isDesktop()) {
      els.kokoroWrap.classList.add("hidden");
      return;
    }
    els.kokoroWrap.classList.remove("hidden");
    els.kokoroWrap.classList.toggle("is-ready", kokoroReady && !kokoroLoading);
    if (kokoroLoading) {
      els.kokoroBtn.classList.remove("hidden");
      els.kokoroRemove.classList.add("hidden");
      els.kokoroBtn.disabled = true;
      els.kokoroBtn.textContent = "Downloading…";
      els.kokoroStatus.classList.remove("hidden");
      els.kokoroStatus.textContent = "Downloading better voice…";
      els.kokoroProgressTrack.classList.remove("hidden");
      return;
    }
    els.kokoroBtn.disabled = false;
    els.kokoroProgressTrack.classList.add("hidden");
    if (kokoroReady) {
      els.kokoroBtn.classList.add("hidden");
      els.kokoroRemove.classList.remove("hidden");
      els.kokoroStatus.classList.add("hidden");
      els.kokoroStatus.textContent = "Better voice ready";
    } else {
      els.kokoroBtn.classList.remove("hidden");
      els.kokoroRemove.classList.add("hidden");
      els.kokoroBtn.textContent = KOKORO_DOWNLOAD_LABEL;
      const status = els.kokoroStatus.textContent;
      const showStatus = status && status !== "Better voice ready" && status !== "One-time download";
      els.kokoroStatus.classList.toggle("hidden", !showStatus);
    }
  }

  function selectKokoroVoice() {
    if (!kokoroReady) {
      return;
    }
    savedVoiceName = KOKORO_VOICE_ID;
    loadVoices();
    els.voiceSelect.value = KOKORO_VOICE_ID;
    saveState();
  }

  async function loadKokoroModel(forceDownload) {
    if (kokoroAvailable()) {
      kokoroReady = true;
      updateKokoroUi();
      selectKokoroVoice();
      return true;
    }
    kokoroLoading = true;
    els.kokoroStatus.textContent = forceDownload ? "Downloading better voice…" : "Loading better voice…";
    setKokoroProgress(forceDownload ? 2 : 8);
    updateKokoroUi();

    try {
      try {
        await startKokoroWorker();
        kokoroTts = null;
      } catch (workerErr) {
        console.warn("Kokoro worker unavailable, using main thread.", workerErr);
        stopKokoroWorker();
        await startKokoroMainThread();
      }
      kokoroReady = true;
      kokoroDownloadedFlag = true;
      kokoroLoading = false;
      setKokoroProgress(100);
      els.kokoroStatus.textContent = "Better voice ready";
      updateKokoroUi();
      saveState();
      selectKokoroVoice();
      return true;
    } catch (err) {
      console.warn(err);
      stopKokoroWorker();
      kokoroTts = null;
      kokoroReady = false;
      kokoroLoading = false;
      kokoroDownloadedFlag = false;
      els.kokoroStatus.textContent = "Could not load the better voice. Browser TTS is still available.";
      updateKokoroUi();
      saveState();
      loadVoices();
      return false;
    }
  }

  function removeKokoroVoice() {
    stopKokoroAudio();
    stopKokoroWorker();
    clearKokoroClips();
    kokoroTts = null;
    kokoroReady = false;
    kokoroDownloadedFlag = false;
    if (savedVoiceName === KOKORO_VOICE_ID) {
      savedVoiceName = "";
    }
    els.kokoroStatus.textContent = "Downloaded voice removed. Browser TTS will be used.";
    updateKokoroUi();
    loadVoices();
    saveState();
  }

  function handleKokoroButton() {
    if (kokoroLoading || kokoroReady) {
      return;
    }
    loadKokoroModel(true);
  }

  async function speakCurrentGroupOnce(generation) {
    if (!sessionActive || generation !== speakGeneration) {
      return;
    }
    const group = groups[currentIndex];
    if (!group) {
      return;
    }
    await speakGroup(group);
  }

  async function runUntilTypedLoop(generation) {
    while (sessionActive && generation === speakGeneration) {
      await speakCurrentGroupOnce(generation);
      if (!sessionActive || generation !== speakGeneration) {
        return;
      }
      await waitRepeatGap();
    }
  }

  async function runMultipleTimesLoop(generation) {
    const times = Math.max(1, parseInt(els.repeatCount.value, 10) || 3);
    for (let i = 0; i < times; i += 1) {
      if (!sessionActive || generation !== speakGeneration) {
        return;
      }
      await speakCurrentGroupOnce(generation);
      if (i < times - 1 && sessionActive && generation === speakGeneration) {
        await waitRepeatGap();
      }
    }
    if (sessionActive && generation === speakGeneration && acceptingInput) {
      setStatus("Type the words you heard.");
    }
  }

  function updateAudioToggle() {
    const paused = audioPaused;
    els.audioToggle.setAttribute("aria-pressed", paused ? "false" : "true");
    els.audioToggle.setAttribute("aria-label", paused ? "Play audio" : "Pause audio");
    els.audioToggle.title = paused ? "Play audio" : "Pause audio";
    els.audioToggle.querySelector(".icon-pause").classList.toggle("hidden", paused);
    els.audioToggle.querySelector(".icon-play").classList.toggle("hidden", !paused);
  }

  function pauseAudio() {
    audioPaused = true;
    cancelSpeech();
    updateAudioToggle();
  }

  function playAudio() {
    audioPaused = false;
    updateAudioToggle();
    startSpeakingCurrentGroup();
  }

  function toggleAudio() {
    if (!sessionActive) {
      return;
    }
    if (audioPaused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function startSpeakingCurrentGroup() {
    if (audioPaused) {
      return;
    }
    cancelSpeech();
    const generation = speakGeneration;

    if (getRepeatMode() === "until-typed") {
      setStatus("Listen and type the words you hear.");
      runUntilTypedLoop(generation);
    } else {
      setStatus("Listening…");
      runMultipleTimesLoop(generation);
    }
  }

  function updateProgress() {
    els.progress.textContent = `Group ${currentIndex + 1} of ${groups.length}`;
    const pct = groups.length ? ((currentIndex) / groups.length) * 100 : 0;
    els.progressBar.style.width = `${pct}%`;
    updateAnswerReveal();
  }

  function recordAttempt(group) {
    const key = groupToExpected(group);
    attemptCounts.set(key, (attemptCounts.get(key) || 0) + 1);
  }

  function resetAssembled() {
    els.assembledText.innerHTML = "";
    const show = groupSize > 2;
    els.assembledWrap.classList.toggle("hidden", !show);
  }

  function appendAssembledGroup(group) {
    if (groupSize <= 2) {
      return;
    }
    const span = document.createElement("span");
    span.className = "assembled-group just-added";
    span.textContent = groupToDisplay(group);
    if (els.assembledText.childNodes.length) {
      els.assembledText.appendChild(document.createTextNode(" "));
    }
    els.assembledText.appendChild(span);
    els.assembledWrap.classList.remove("hidden");
    setTimeout(() => {
      span.classList.remove("just-added");
    }, 700);
  }

  function clearFeedback() {
    els.answerInput.classList.remove("mismatch");
  }

  function advanceOrComplete() {
    cancelSpeech();
    els.answerInput.value = "";
    clearFeedback();
    acceptingInput = true;
    currentIndex += 1;
    hideAnswer();

    if (currentIndex >= groups.length) {
      els.progressBar.style.width = "100%";
      finishSession();
      return;
    }

    updateProgress();
    els.answerInput.focus();
    startSpeakingCurrentGroup();
  }

  async function acceptCorrect(group) {
    recordAttempt(group);
    acceptingInput = false;
    stopRepeats();
    els.answerInput.classList.remove("mismatch");
    setStatus("Correct", "is-correct");
    appendAssembledGroup(group);
    const started = Date.now();
    await waitForCurrentSpeech();
    if (!sessionActive) {
      return;
    }
    const remaining = Math.max(BETWEEN_GROUPS_MS, CORRECT_HOLD_MS - (Date.now() - started));
    await wait(remaining);
    if (!sessionActive) {
      return;
    }
    advanceOrComplete();
  }

  function handleSubmit() {
    if (!sessionActive || !acceptingInput) {
      return;
    }

    const group = groups[currentIndex];
    if (!group) {
      return;
    }

    if (matchesGroup(els.answerInput.value, group)) {
      acceptCorrect(group);
      return;
    }

    recordAttempt(group);
    els.answerInput.classList.add("mismatch");
    setStatus("Not quite — try again.", "is-wrong");
    setTimeout(() => {
      els.answerInput.classList.remove("mismatch");
    }, 400);
    els.answerInput.focus();
    els.answerInput.select();
  }

  function finishSession() {
    sessionActive = false;
    acceptingInput = true;
    cancelSpeech();
    clearFeedback();
    hideAnswer();

    els.practicePanel.classList.add("hidden");
    els.completePanel.classList.remove("hidden");

    const firstTry = [...attemptCounts.values()].filter((n) => n === 1).length;
    els.completeSummary.textContent = `You completed all ${groups.length} group${groups.length === 1 ? "" : "s"}. ${firstTry} correct on the first try.`;

    const retried = [];
    attemptCounts.forEach((count, key) => {
      if (count > 1) {
        retried.push({ key, count });
      }
    });

    els.retryList.innerHTML = "";
    if (retried.length === 0) {
      els.retryListWrap.classList.add("hidden");
    } else {
      els.retryListWrap.classList.remove("hidden");
      retried
        .sort((a, b) => b.count - a.count)
        .forEach(({ key, count }) => {
          const li = document.createElement("li");
          li.textContent = `${key} (${count} attempts)`;
          els.retryList.appendChild(li);
        });
    }
  }

  function startSession() {
    const words = tokenize(els.sourceText.value);
    if (words.length === 0) {
      return;
    }

    const size = parseInt(els.wordsPerGroup.value, 10) || 3;
    groupSize = size;
    groups = chunkWords(words, size);
    currentIndex = 0;
    sessionActive = true;
    acceptingInput = true;
    attemptCounts.clear();
    hideAnswer();
    resetAssembled();
    audioPaused = false;
    updateAudioToggle();

    const untilTyped = getRepeatMode() === "until-typed";
    els.replayBtn.classList.toggle("hidden", untilTyped);

    els.setupPanel.classList.add("hidden");
    els.completePanel.classList.add("hidden");
    els.practicePanel.classList.remove("hidden");

    clearFeedback();
    updateProgress();
    els.answerInput.value = "";
    els.answerInput.focus();
    startSpeakingCurrentGroup();
  }

  function stopSession() {
    sessionActive = false;
    acceptingInput = true;
    cancelSpeech();
    clearFeedback();
    hideAnswer();

    els.practicePanel.classList.add("hidden");
    els.setupPanel.classList.remove("hidden");
  }

  function restartFromComplete() {
    els.completePanel.classList.add("hidden");
    els.setupPanel.classList.remove("hidden");
  }

  function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) {
      return;
    }
    els.sourceText.value = preset.text;
    els.wordsPerGroup.value = String(preset.wordsPerGroup);
    els.fileName.textContent = "";
    els.presetWordlist.classList.toggle("active", name === "wordlist");
    els.presetEssay.classList.toggle("active", name === "essay");
    updateWordCount();
    saveState();
  }

  els.sourceText.addEventListener("input", () => {
    els.presetWordlist.classList.remove("active");
    els.presetEssay.classList.remove("active");
    updateWordCount();
    scheduleSave();
  });

  els.fileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      els.sourceText.value = reader.result;
      els.fileName.textContent = file.name;
      els.presetWordlist.classList.remove("active");
      els.presetEssay.classList.remove("active");
      updateWordCount();
      saveState();
    };
    reader.readAsText(file);
  });

  els.wordsPerGroup.addEventListener("change", saveState);

  els.repeatModeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateRepeatCountVisibility();
      saveState();
    });
  });

  els.repeatCount.addEventListener("change", saveState);

  els.repeatGapRadios.forEach((radio) => {
    radio.addEventListener("change", saveState);
  });

  els.voiceSelect.addEventListener("change", () => {
    savedVoiceName = els.voiceSelect.value;
    saveState();
  });

  els.kokoroBtn.addEventListener("click", handleKokoroButton);
  els.kokoroRemove.addEventListener("click", () => {
    if (!kokoroLoading && kokoroReady) {
      removeKokoroVoice();
    }
  });

  els.speechRate.addEventListener("input", () => {
    els.rateValue.textContent = els.speechRate.value;
    scheduleSave();
  });

  els.showAnswerBtn.addEventListener("click", toggleAnswer);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
      return;
    }
    if (!sessionActive) {
      return;
    }
    e.preventDefault();
    toggleAnswer();
  });

  els.presetWordlist.addEventListener("click", () => applyPreset("wordlist"));
  els.presetEssay.addEventListener("click", () => applyPreset("essay"));

  els.audioToggle.addEventListener("click", toggleAudio);
  els.startBtn.addEventListener("click", startSession);
  els.submitBtn.addEventListener("click", handleSubmit);
  els.replayBtn.addEventListener("click", () => {
    if (sessionActive) {
      audioPaused = false;
      updateAudioToggle();
      startSpeakingCurrentGroup();
    }
  });
  els.stopBtn.addEventListener("click", stopSession);
  els.restartBtn.addEventListener("click", restartFromComplete);

  els.answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === " " || e.key === "Spacebar" || e.code === "Space") {
      if (!sessionActive || !acceptingInput) {
        return;
      }
      const group = groups[currentIndex];
      if (!group || !isSpaceAfterLastWord(els.answerInput.value, group)) {
        return;
      }
      e.preventDefault();
      handleSubmit();
    }
  });

  loadState();
  updateRepeatCountVisibility();
  updateWordCount();
  updateKokoroUi();

  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } else {
    els.voiceSelect.innerHTML = '<option value="">Speech not supported</option>';
    els.startBtn.disabled = true;
    setStatus("Text-to-speech is not supported in this browser.");
  }

  if (isDesktop() && kokoroDownloadedFlag) {
    loadKokoroModel(false);
  }
})();
