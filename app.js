(function () {
  'use strict';

  const verses = window.GitaVerseData?.verses || [];
  const meanings = window.GitaMeaningData || {};
  const chapterNames = {
    1: 'Arjuna Vishada Yoga', 2: 'Sankhya Yoga', 3: 'Karma Yoga',
    4: 'Jnana Karma Sanyasa Yoga', 5: 'Karma Sanyasa Yoga', 6: 'Dhyana Yoga',
    7: 'Jnana Vijnana Yoga', 8: 'Akshara Brahma Yoga', 9: 'Raja Vidya Raja Guhya Yoga',
    10: 'Vibhuti Yoga', 11: 'Vishvarupa Darshana Yoga', 12: 'Bhakti Yoga',
    13: 'Kshetra Kshetrajna Vibhaga Yoga', 14: 'Gunatraya Vibhaga Yoga',
    15: 'Purushottama Yoga', 16: 'Daivasura Sampad Vibhaga Yoga',
    17: 'Shraddhatraya Vibhaga Yoga', 18: 'Moksha Sanyasa Yoga'
  };
  const savedIndex = Number.parseInt(localStorage.getItem('gita-reader-index'), 10);
  let index = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < verses.length ? savedIndex : 0;

  const byId = (id) => document.getElementById(id);
  const el = {
    chapterTitle: byId('chapterTitle'), chapterName: byId('chapterName'), progressText: byId('progressText'),
    progressFill: byId('progressFill'), reference: byId('reference'), sanskrit: byId('sanskritVerse'),
    english: byId('englishVerse'), meaning: byId('meaningText'), reflection: byId('reflectionText'),
    previous: byId('previousButton'), next: byId('nextButton'), chapter: byId('chapterSelect'),
    verse: byId('verseSelect'), go: byId('goButton'), restart: byId('restartButton')
  };
  const installButton = byId('installButton');
  let installPrompt;

  function currentVerse() { return verses[index]; }
  function keyFor(verse) { return `${verse.chapter}-${verse.verse}`; }
  function escapeText(value) { return value || ''; }

  function fillChapters() {
    for (let chapter = 1; chapter <= 18; chapter += 1) {
      const option = new Option(`${chapter}. ${chapterNames[chapter]}`, String(chapter));
      el.chapter.add(option);
    }
  }

  function fillVerses(chapter, selectedVerse) {
    el.verse.replaceChildren();
    verses.filter((verse) => verse.chapter === Number(chapter)).forEach((verse) => {
      el.verse.add(new Option(String(verse.verse), String(verse.verse), false, verse.verse === Number(selectedVerse)));
    });
  }

  function render({ focus = false } = {}) {
    const verse = currentVerse();
    if (!verse) return;
    const companion = meanings[keyFor(verse)] || {};
    const englishMeaning = companion.translation || verse.english_alt || verse.english;
    const explanation = companion.explanation?.trim();

    el.chapterTitle.textContent = `Chapter ${verse.chapter} · Verse ${verse.verse}`;
    el.chapterName.textContent = chapterNames[verse.chapter] || 'Bhagavad Gita';
    el.progressText.textContent = `${index + 1} of ${verses.length}`;
    el.progressFill.style.width = `${((index + 1) / verses.length) * 100}%`;
    el.reference.textContent = `Bhagavad Gita ${verse.chapter}.${verse.verse}`;
    el.sanskrit.textContent = escapeText(verse.sanskrit);
    el.english.textContent = escapeText(verse.english);
    el.meaning.textContent = escapeText(englishMeaning);
    el.reflection.hidden = !explanation;
    el.reflection.textContent = explanation ? `A closer look: ${explanation}` : '';
    el.previous.disabled = index === 0;
    el.next.disabled = index === verses.length - 1;
    el.next.innerHTML = index === verses.length - 1 ? 'You have reached the end <span aria-hidden="true">✓</span>' : 'Next verse <span aria-hidden="true">→</span>';
    el.chapter.value = String(verse.chapter);
    fillVerses(verse.chapter, verse.verse);
    localStorage.setItem('gita-reader-index', String(index));
    if (focus) byId('reference').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function changeIndex(nextIndex) {
    if (nextIndex < 0 || nextIndex >= verses.length) return;
    index = nextIndex;
    render({ focus: true });
  }

  fillChapters();
  render();
  el.previous.addEventListener('click', () => changeIndex(index - 1));
  el.next.addEventListener('click', () => changeIndex(index + 1));
  el.chapter.addEventListener('change', () => fillVerses(el.chapter.value));
  el.go.addEventListener('click', () => {
    const chapter = Number(el.chapter.value); const verseNumber = Number(el.verse.value);
    const found = verses.findIndex((verse) => verse.chapter === chapter && verse.verse === verseNumber);
    if (found >= 0) changeIndex(found);
  });
  el.restart.addEventListener('click', () => changeIndex(0));
  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (event.key === 'ArrowRight') changeIndex(index + 1);
    if (event.key === 'ArrowLeft') changeIndex(index - 1);
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = undefined;
    installButton.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installButton.hidden = true; });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
  }
}());
