(function () {
  "use strict";

  const REPEAT_INTERVAL_MS = 2500;
  const CORRECT_HOLD_MS = 550;

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
    voiceSelect: document.getElementById("voice-select"),
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
  let speakGeneration = 0;
  let answerVisible = false;
  let audioPaused = false;
  const STORAGE_KEY = "pte-spelling-drill";
  let savedVoiceName = "";
  let saveTimer = null;
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
        speechRate: els.speechRate.value,
        voice: els.voiceSelect.value,
        preset: getActivePreset(),
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
      if (data.speechRate) {
        els.speechRate.value = String(data.speechRate);
        els.rateValue.textContent = els.speechRate.value;
      }
      if (typeof data.voice === "string") {
        savedVoiceName = data.voice;
      }
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

  function getVoiceList() {
    const voices = speechSynthesis.getVoices();
    const english = voices.filter((v) => v.lang.startsWith("en"));
    return english.length ? english : voices;
  }

  function loadVoices() {
    const list = getVoiceList();
    const current = els.voiceSelect.value;
    els.voiceSelect.innerHTML = "";

    if (list.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Default voice";
      els.voiceSelect.appendChild(opt);
      return;
    }

    list.forEach((voice) => {
      const opt = document.createElement("option");
      opt.value = voice.name;
      opt.textContent = `${voice.name} (${voice.lang})`;
      els.voiceSelect.appendChild(opt);
    });

    const stillAvailable = list.some((v) => v.name === (savedVoiceName || current));
    if (stillAvailable) {
      els.voiceSelect.value = savedVoiceName || current;
    } else {
      els.voiceSelect.value = list[0].name;
    }
    if (els.voiceSelect.value) {
      savedVoiceName = els.voiceSelect.value;
    }
  }

  function getSelectedVoice() {
    const list = getVoiceList();
    const selected = els.voiceSelect.value;
    return list.find((v) => v.name === selected) || list[0] || null;
  }

  function cancelSpeech() {
    speakGeneration += 1;
    if (repeatTimer) {
      clearTimeout(repeatTimer);
      repeatTimer = null;
    }
    speechSynthesis.cancel();
  }

  function speakGroup(group) {
    return new Promise((resolve) => {
      const text = group.join(" ");
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
      await new Promise((resolve) => {
        repeatTimer = setTimeout(resolve, REPEAT_INTERVAL_MS);
      });
      repeatTimer = null;
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
        await new Promise((resolve) => {
          repeatTimer = setTimeout(resolve, REPEAT_INTERVAL_MS);
        });
        repeatTimer = null;
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

  function acceptCorrect(group) {
    recordAttempt(group);
    acceptingInput = false;
    cancelSpeech();
    els.answerInput.classList.remove("mismatch");
    setStatus("Correct", "is-correct");
    appendAssembledGroup(group);
    setTimeout(advanceOrComplete, CORRECT_HOLD_MS);
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

  els.voiceSelect.addEventListener("change", () => {
    savedVoiceName = els.voiceSelect.value;
    saveState();
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

  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } else {
    els.voiceSelect.innerHTML = '<option value="">Speech not supported</option>';
    els.startBtn.disabled = true;
    setStatus("Text-to-speech is not supported in this browser.");
  }

  loadState();
  updateRepeatCountVisibility();
  updateWordCount();
})();
