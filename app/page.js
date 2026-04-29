"use client";

import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import ArabicKeyboard from '@/app/utils/keyboard';

const translations = {
  en: {
    // Search
    searchPlaceholder: "Search Text Patterns . . .",
    searchResultsLabel: "Search Results",
    searchResultsPatterns: (n) => `${n} Patterns`,
    searchResultsDash: "-",
    loadingResults: "Loading results...",
    searchHint: "Search for patterns using the arabic keyboard below",
    // Selected Pattern
    selectedPattern: "Selected Pattern:",
    selectedPatternNone: "None",
    // N-Gram headings
    biGramHeading: "Repeating 2-Word Text Patterns",
    triGramHeading: "Repeating 3-word Text Patterns",
    fourGramHeading: "Repeating 4-word text patterns",
    fiveGramHeading: "Repeating 5-word text patterns",
    // N-Gram loading / empty states
    loadingBiGram: "Loading text patterns...",
    noThemes: "No themes available",
    loadingTriGram: "Loading repeating 3-word text patterns...",
    noTriGram: "No repeating 3-word text patterns available. Please see the Ayats below that contain the text-pattern",
    selectBiGramFirst: "Select a text pattern to view repeating 3 word text patterns",
    loadingFourGram: "Loading repeating 4-word text patterns...",
    noFourGram: "No repeating 4-word text patterns available. Please see the Ayats below that contain the text-pattern",
    selectTriGramFirst: "Select a repeating 3-word text pattern to view repeating 5-word text patterns",
    loadingFiveGram: "Loading repeating 5-word text patterns...",
    noFiveGram: "No repeating 5-word text patterns available. Please see the Ayats below that contain the text-pattern",
    selectFourGramFirst: "Select a repeating 4-word text pattern to view repeating 5-word text patterns",
    // Pattern count
    patterns: (n) => n > 1 ? `${n} Patterns` : `${n} Pattern`,
    // Navigation buttons
    next: "Next",
    back: "Back",
    nextAyat: "Next Ayat",
    backAyat: "Previous Ayat",
    resetAyat: "Reset Ayat",
    // Ayat list
    correspondingAyats: "Corresponding Ayats",
    loadingAyats: "Loading Ayats...",
    correspondingAyatsFound: (n) => `Corresponding Ayats ( Found: ${n} )`,
    selectAyatHint: "Select ayat to view details",
    selectPatternHint: "Select a text pattern or n-word repeating text pattern to view Ayats.",
    loadingAyatsList: "Loading Ayats...",
    noAyatsFound: "No Ayats found for the selected topic.",
    // Before / After / Pattern
    after: "After",
    before: "Before",
    selectedPatternLabel: "Selected Pattern",
    loading: "Loading...",
    // Ayat details
    detailsHeading: "Details of selected Ayat",
    selectedAyatLabel: "Selected Ayat : ",
    surahName: "Surah Name : ",
    ayatNumber: "Ayat Number : ",
    ayatTranslation: "Ayat Translation : ",
    // Ayats panel heading
    ayatsHeading: "Ayats",
    invalidAyat: "Invalid Ayat Data",
    // Global loading
    globalLoading: "Loading...",
  },
  bn: {
    searchPlaceholder: "টেক্সট প্যাটার্ন অনুসন্ধান করুন . . .",
    searchResultsLabel: "অনুসন্ধান ফলাফল",
    searchResultsPatterns: (n) => `${n}টি প্যাটার্ন`,
    searchResultsDash: "-",
    loadingResults: "ফলাফল লোড হচ্ছে...",
    searchHint: "নিচের আরবি কীবোর্ড ব্যবহার করে প্যাটার্ন অনুসন্ধান করুন",
    selectedPattern: "নির্বাচিত প্যাটার্ন:",
    selectedPatternNone: "কোনোটি নয়",
    biGramHeading: "পুনরাবৃত্ত ২-শব্দের টেক্সট প্যাটার্ন",
    triGramHeading: "পুনরাবৃত্ত ৩-শব্দের টেক্সট প্যাটার্ন",
    fourGramHeading: "পুনরাবৃত্ত ৪-শব্দের টেক্সট প্যাটার্ন",
    fiveGramHeading: "পুনরাবৃত্ত ৫-শব্দের টেক্সট প্যাটার্ন",
    loadingBiGram: "টেক্সট প্যাটার্ন লোড হচ্ছে...",
    noThemes: "কোনো বিষয় পাওয়া যায়নি",
    loadingTriGram: "পুনরাবৃত্ত ৩-শব্দের প্যাটার্ন লোড হচ্ছে...",
    noTriGram: "কোনো পুনরাবৃত্ত ৩-শব্দের প্যাটার্ন পাওয়া যায়নি। নিচে আয়াতগুলো দেখুন যেগুলোতে এই টেক্সট প্যাটার্ন রয়েছে",
    selectBiGramFirst: "পুনরাবৃত্ত ৩-শব্দের প্যাটার্ন দেখতে একটি টেক্সট প্যাটার্ন নির্বাচন করুন",
    loadingFourGram: "পুনরাবৃত্ত ৪-শব্দের প্যাটার্ন লোড হচ্ছে...",
    noFourGram: "কোনো পুনরাবৃত্ত ৪-শব্দের প্যাটার্ন পাওয়া যায়নি। নিচে আয়াতগুলো দেখুন যেগুলোতে এই টেক্সট প্যাটার্ন রয়েছে",
    selectTriGramFirst: "পুনরাবৃত্ত ৫-শব্দের প্যাটার্ন দেখতে একটি ৩-শব্দের প্যাটার্ন নির্বাচন করুন",
    loadingFiveGram: "পুনরাবৃত্ত ৫-শব্দের প্যাটার্ন লোড হচ্ছে...",
    noFiveGram: "কোনো পুনরাবৃত্ত ৫-শব্দের প্যাটার্ন পাওয়া যায়নি। নিচে আয়াতগুলো দেখুন যেগুলোতে এই টেক্সট প্যাটার্ন রয়েছে",
    selectFourGramFirst: "পুনরাবৃত্ত ৫-শব্দের প্যাটার্ন দেখতে একটি ৪-শব্দের প্যাটার্ন নির্বাচন করুন",
    patterns: (n) => n > 1 ? `${n}টি প্যাটার্ন` : `${n}টি প্যাটার্ন`,
    next: "পরবর্তী",
    back: "পূর্ববর্তী",
    correspondingAyats: "সংশ্লিষ্ট আয়াত",
    loadingAyats: "আয়াত লোড হচ্ছে...",
    correspondingAyatsFound: (n) => `সংশ্লিষ্ট আয়াত ( পাওয়া গেছে: ${n} )`,
    selectAyatHint: "বিস্তারিত দেখতে আয়াত নির্বাচন করুন",
    selectPatternHint: "আয়াত দেখতে একটি টেক্সট প্যাটার্ন বা n-শব্দের পুনরাবৃত্ত প্যাটার্ন নির্বাচন করুন।",
    loadingAyatsList: "আয়াত লোড হচ্ছে...",
    noAyatsFound: "নির্বাচিত বিষয়ের জন্য কোনো আয়াত পাওয়া যায়নি।",
    after: "পরে",
    before: "আগে",
    nextAyat: "পরবর্তী আয়াত",
    backAyat: "পূর্ববর্তী আয়াত",
    resetAyat: "রিসেট আয়াত",
    selectedPatternLabel: "নির্বাচিত প্যাটার্ন",
    loading: "লোড হচ্ছে...",
    detailsHeading: "নির্বাচিত আয়াতের বিবরণ",
    selectedAyatLabel: "নির্বাচিত আয়াত : ",
    surahName: "সূরার নাম : ",
    ayatNumber: "আয়াত নম্বর : ",
    ayatTranslation: "আয়াতের অনুবাদ : ",
    ayatsHeading: "আয়াত",
    invalidAyat: "অবৈধ আয়াত তথ্য",
    globalLoading: "লোড হচ্ছে...",
  },
  ms: {
    searchPlaceholder: "Cari Corak Teks . . .",
    searchResultsLabel: "Keputusan Carian",
    searchResultsPatterns: (n) => `${n} Corak`,
    searchResultsDash: "-",
    loadingResults: "Memuatkan keputusan...",
    searchHint: "Cari corak menggunakan papan kekunci Arab di bawah",
    selectedPattern: "Corak Dipilih:",
    selectedPatternNone: "Tiada",
    biGramHeading: "Corak Teks 2 Perkataan Berulang",
    triGramHeading: "Corak Teks 3 Perkataan Berulang",
    fourGramHeading: "Corak Teks 4 Perkataan Berulang",
    fiveGramHeading: "Corak Teks 5 Perkataan Berulang",
    loadingBiGram: "Memuatkan corak teks...",
    noThemes: "Tiada tema tersedia",
    loadingTriGram: "Memuatkan corak teks 3 perkataan berulang...",
    noTriGram: "Tiada corak teks 3 perkataan berulang tersedia. Sila lihat Ayat di bawah yang mengandungi corak teks ini",
    selectBiGramFirst: "Pilih corak teks untuk melihat corak teks 3 perkataan berulang",
    loadingFourGram: "Memuatkan corak teks 4 perkataan berulang...",
    noFourGram: "Tiada corak teks 4 perkataan berulang tersedia. Sila lihat Ayat di bawah yang mengandungi corak teks ini",
    selectTriGramFirst: "Pilih corak teks 3 perkataan berulang untuk melihat corak teks 5 perkataan berulang",
    loadingFiveGram: "Memuatkan corak teks 5 perkataan berulang...",
    noFiveGram: "Tiada corak teks 5 perkataan berulang tersedia. Sila lihat Ayat di bawah yang mengandungi corak teks ini",
    selectFourGramFirst: "Pilih corak teks 4 perkataan berulang untuk melihat corak teks 5 perkataan berulang",
    patterns: (n) => n > 1 ? `${n} Corak` : `${n} Corak`,
    next: "Seterusnya",
    back: "Kembali",
    nextAyat: "Ayat Seterusnya",
    backAyat: "Ayat Sebelumnya",
    resetAyat: "Reset Ayat",
    correspondingAyats: "Ayat Berkaitan",
    loadingAyats: "Memuatkan Ayat...",
    correspondingAyatsFound: (n) => `Ayat Berkaitan ( Dijumpai: ${n} )`,
    selectAyatHint: "Pilih ayat untuk melihat butiran",
    selectPatternHint: "Pilih corak teks atau corak teks n-perkataan berulang untuk melihat Ayat.",
    loadingAyatsList: "Memuatkan Ayat...",
    noAyatsFound: "Tiada Ayat dijumpai untuk topik yang dipilih.",
    after: "Selepas",
    before: "Sebelum",
    selectedPatternLabel: "Corak Dipilih",
    loading: "Memuatkan...",
    detailsHeading: "Butiran Ayat yang Dipilih",
    selectedAyatLabel: "Ayat Dipilih : ",
    surahName: "Nama Surah : ",
    ayatNumber: "Nombor Ayat : ",
    ayatTranslation: "Terjemahan Ayat : ",
    ayatsHeading: "Ayat",
    invalidAyat: "Data Ayat Tidak Sah",
    globalLoading: "Memuatkan...",
  },
};

export default function Home() {

  // States Variables
  const [openIndex, setOpenIndex] = useState(null);
  const [subOpenIndex, setSubOpenIndex] = useState(null);
  const [thematicOpenIndex, setThematicOpenIndex] = useState(null);
  const [contextOpenIndex, setContextOpenIndex] = useState(null);
  const [fiveGramOpenIndex, setfiveGramOpenIndex] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState(null); //OneGram
  const [selectedTheme, setSelectedTheme] = useState(null); //BiGram
  const [selectedSubTheme, setSelectedSubTheme] = useState(null); //TriGram
  const [selectedThematicTopic, setSelectedThematicTopic] = useState(null); //FourGram
  const [selectedThematicContext, setSelectedThematicContext] = useState(null); //FiveGram
  const [selectedAyatIndex, setSelectedAyatIndex] = useState(null); // Ayat Index

  const [gramState, setGramState] = React.useState('bi-gram');

  const [primaryThemes, setPrimaryThemes] = useState([]);
  const [subThemes, setSubThemes] = useState([]);
  const [thematicTopics, setThematicTopics] = useState([]);
  const [thematicContexts, setThematicContexts] = useState([]);
  const [ayats, setAyats] = useState([]);
  const [ayatDetailsMap, setAyatDetailsMap] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [loadingSubThemes, setLoadingSubThemes] = useState(false);
  const [loadingThematicTopics, setLoadingThematicTopics] = useState(false);
  const [loadingThematicContexts, setLoadingThematicContexts] = useState(false);
  const [loadingAyats, setLoadingAyats] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchedTopics, setSearchedTopics] = useState([]);
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const oneGramContainerRef = useRef(null);
  const biGramRefs = useRef({});
  const [pendingScrollId, setPendingScrollId] = useState(null);
  const ayatListRef = useRef(null);
  const ayatItemRefs = useRef({});

  const latestRequestId = useRef(0);
  const currentSearchAbort = useRef(null);

  const [selectedLang, setSelectedLang] = useState('en');

  const [surahAyats, setSurahAyats] = useState([]);
  const [surahAyatIndex, setSurahAyatIndex] = useState(null);
  const [currentAyat, setCurrentAyat] = useState(null);
  const [surahCache, setSurahCache] = useState({});
  const [lastDetails, setLastDetails] = useState(null);

  // currentDetails: whatever the API returned for the current ayat (may have null before/after)
  const currentDetails = currentAyat ? ayatDetailsMap[currentAyat.id] : undefined;
  const hasCurrentRealDetails = currentDetails?.before != null || currentDetails?.after != null;

  // displayDetails: for before/after we fall back to lastDetails (the last pattern-matching ayat)
  // so those fields stay visible when navigating to surrounding ayats.
  // For surahName/ayatNumber/translation we always use currentDetails so they update live.
  const displayDetails = {
    // Metadata always reflects the current ayat
    surahName: currentDetails?.surahName,
    ayatNumber: currentDetails?.ayatNumber,
    translation: currentDetails?.translation,
    ayatText: currentDetails?.ayatText,
    // Before/after come from current if real, otherwise last known good
    before: hasCurrentRealDetails ? currentDetails?.before : lastDetails?.before,
    after: hasCurrentRealDetails ? currentDetails?.after : lastDetails?.after,
  };

  useEffect(() => {
    const fetchSurah = async () => {
      if (!currentAyat) return;

      const surahId = currentAyat.surah_id;

      // ✅ 1. FROM CACHE
      if (surahCache[surahId]) {
        const cached = surahCache[surahId];

        setSurahAyats(cached);

        const index = cached.findIndex(
          a => a.id === currentAyat.id
        );
        setSurahAyatIndex(index);

        return;
      }

      // ✅ 2. FETCH
      try {
        const res = await fetch(
          `/api/get/surah-ayats?surah_id=${surahId}&lang=${selectedLang}`
        );

        const data = await res.json();
        const fullSurah = data.ayats || [];

        setSurahAyats(fullSurah);

        // ✅ SAVE CACHE
        setSurahCache(prev => ({
          ...prev,
          [surahId]: fullSurah
        }));

        // ✅ CALCULATE INDEX HERE (inside scope)
        const index = fullSurah.findIndex(
          a => a.id === currentAyat.id
        );
        setSurahAyatIndex(index);

      } catch (e) {
        console.error("Error fetching surah", e);
      }
    };

    fetchSurah();
  }, [currentAyat?.surah_id, selectedLang]);

  const t = (key, ...args) => {
    const val = (translations[selectedLang] || translations.en)[key];
    return typeof val === 'function' ? val(...args) : (val ?? key);
  };

  const groupedTopics = searchedTopics.reduce((acc, topic) => {
    if (!acc[topic.foundInGram]) acc[topic.foundInGram] = [];
    acc[topic.foundInGram].push(topic);
    return acc;
  }, {});

  function isDesktop() {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 640; // matches 'sm' breakpoint (Tailwind)
  }

  async function fetchSearchResults(originalText, opts = {}) {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText }),
        signal: opts.signal, // ← pass AbortController signal if provided
      });

      if (!response.ok) {
        throw new Error('Search API request failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      // If aborted, quietly return []
      if (error.name === 'AbortError') return [];
      console.error('Error fetching search results:', error);
      return [];
    }
  }

  // Debounce Search Input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Search effect
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      if (currentSearchAbort.current) currentSearchAbort.current.abort(); // cancel in-flight
      setSearchedTopics([]);
      return;
    }

    async function performSearch() {
      setLoadingSearch(true);

      // abort any previous request before starting a new one
      if (currentSearchAbort.current) currentSearchAbort.current.abort();
      const ac = new AbortController();
      currentSearchAbort.current = ac;

      const requestId = ++latestRequestId.current;
      const query = debouncedSearch;

      try {
        const results = await fetchSearchResults(query, { signal: ac.signal });

        // optional tiny delay to smooth UI
        await new Promise(r => setTimeout(r, 150));

        if (requestId === latestRequestId.current && !ac.signal.aborted) {
          setSearchedTopics(results);
          setLoadingSearch(false);
        }
      } catch (err) {
        // ignore abort errors; only clear loading if this is still current
        if (requestId === latestRequestId.current && !ac.signal.aborted) {
          setLoadingSearch(false);
        }
      }
    }

    performSearch();

    // abort on unmount or dependency change
    return () => {
      if (currentSearchAbort.current) currentSearchAbort.current.abort();
    };
  }, [debouncedSearch, searchTrigger]);

  // Fetch Ayats
  useEffect(() => {
    const fetchAyats = async () => {
      setLoadingAyats(true);

      let gram = null;
      let level = null;

      if (selectedThematicContext) {
        gram = selectedThematicContext;
        level = "fivegram";
      } else if (selectedThematicTopic) {
        gram = selectedThematicTopic;
        level = "fourgram";
      } else if (selectedSubTheme) {
        gram = selectedSubTheme;
        level = "trigram";
      } else if (selectedTheme) {
        gram = selectedTheme;
        level = "bigram";
      }

      if (!gram) {
        setAyats([]);
        setLoadingAyats(false);
        return;
      }

      try {
        const res = await fetch("/api/get/ayats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level, id: gram.id, lang: selectedLang }),
        });
        const data = await res.json();
        setAyats(data.ayats || []);
      } catch (e) {
        console.error("Error fetching ayats", e);
        setAyats([]);
      }

      setLoadingAyats(false);
    };

    fetchAyats();
  }, [selectedTheme, selectedSubTheme, selectedThematicTopic, selectedThematicContext, selectedLang]);

  // Fetch Ayat Details when selectedAyatIndex changes
  useEffect(() => {
    const fetchAyatDetails = async () => {
      if (!currentAyat) return;

      // ✅ DEFINE THEM HERE
      let selectedPatternType = null;
      let selectedPatternId = null;

      if (selectedThematicContext) {
        selectedPatternType = "five_grams";
        selectedPatternId = selectedThematicContext.id;
      } else if (selectedThematicTopic) {
        selectedPatternType = "four_grams";
        selectedPatternId = selectedThematicTopic.id;
      } else if (selectedSubTheme) {
        selectedPatternType = "tri_grams";
        selectedPatternId = selectedSubTheme.id;
      } else if (selectedTheme) {
        selectedPatternType = "bi_grams";
        selectedPatternId = selectedTheme.id;
      }

      // ✅ stop if nothing selected
      if (!selectedPatternType || !selectedPatternId) return;

      setLoadingDetails(true);

      try {
        const res = await fetch(
          `/api/get/ayat-details?ngram=${selectedPatternType}&ngramId=${selectedPatternId}&ayatId=${currentAyat.id}&lang=${selectedLang}`
        );

        const data = await res.json();

        const hasRealDetails = data.details?.before != null || data.details?.after != null;

        setAyatDetailsMap(prev => ({
          ...prev,
          [currentAyat.id]: data.details || null
        }));

        // Only update lastDetails when the ayat actually has before/after content.
        // This preserves the last valid before/after when navigating to surrounding ayats.
        if (hasRealDetails) {
          setLastDetails(data.details);
        }

      } catch (e) {
        console.error("Error fetching ayat details", e);
        setAyatDetailsMap(prev => ({
          ...prev,
          [currentAyat.id]: null
        }));
      }

      setLoadingDetails(false);
    };

    fetchAyatDetails();
  }, [
    currentAyat,
    selectedTheme,
    selectedSubTheme,
    selectedThematicTopic,
    selectedThematicContext,
    selectedLang
  ]);

  // Scroll selected ayat into view inside the ayat list panel
  useEffect(() => {
    if (!currentAyat) return;
    const el = ayatItemRefs.current[selectedAyatIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedAyatIndex]);

  // When a search result wants the bi-gram list to scroll to a specific id,
  // scroll the element stored in biGramRefs and then clear the pending id.
  useLayoutEffect(() => {
    if (!pendingScrollId) return;

    const id = String(pendingScrollId);
    const el = biGramRefs.current[id];

    if (el && el.scrollIntoView) {
      // Use smooth behavior and nearest block to keep UX consistent
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Optionally give keyboard focus so it's visible for a11y
      try {
        el.focus?.();
      } catch (e) {
        // ignore
      }
    }

    // Clear the pending id so we only scroll once per request
    setPendingScrollId(null);
  }, [pendingScrollId]);

  // Toggle Bi Gram
  const toggleSubThemes = (subIndex, theme) => {
    const isSameIndex = subOpenIndex === subIndex;

    if (isSameIndex) {
      setSelectedAyatIndex(null);
      setSubOpenIndex(null);
      setSelectedTheme(null);
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setThematicOpenIndex(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);
      setThematicContexts([]);
      setLoadingThematicContexts(false);
      setGramState('bi-gram');
    } else {
      setSubOpenIndex(subIndex);
      setSelectedTheme(theme);

      setSelectedAyatIndex(null);
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setThematicOpenIndex(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);
      setThematicContexts([]);

      setSubThemes([]);
      setLoadingSubThemes(true);
      setGramState('bi-gram');

      // Only call fetchSubThemes if theme is not null
      if (theme) {
        fetchSubThemes(theme.id);
        setGramState('tri-gram');
      }
    }
  };

  // Toggle Tri Gram
  const toggleThematicTopics = (thematicIndex, theme) => {
    const isSameIndex = thematicOpenIndex === thematicIndex;

    // If it's the same index, deselect it and reset higher levels
    if (isSameIndex) {
      setSelectedAyatIndex(null);
      setThematicOpenIndex(null);
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);
      setThematicContexts([]);
      setGramState('bi-gram');
    } else {
      // If it's a new thematic topic, select it and fetch data
      setThematicOpenIndex(thematicIndex);
      setSelectedSubTheme(theme);

      // Clear deeper selections and show loading message
      setSelectedAyatIndex(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);

      setThematicTopics([]);  // Clear old thematic topics
      setLoadingThematicTopics(true);  // Show loading message

      fetchThematicTopics(theme.id);
      setGramState('four-gram');
    }
  };

  // Toggle Four Gram
  const toggleThematicContext = (contextIndex, themeTopic) => {
    const isSameIndex = contextOpenIndex === contextIndex;

    // If it's the same index, deselect it and reset higher levels
    if (isSameIndex) {
      setSelectedAyatIndex(null);
      setContextOpenIndex(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setfiveGramOpenIndex(null);
      setThematicContexts([]);
      setLoadingThematicContexts(false);
      setGramState('tri-gram');
    } else {
      // If it's a new thematic context, select it and fetch data
      setContextOpenIndex(contextIndex);
      setSelectedThematicTopic(themeTopic);

      // Clear deeper selections and show loading message
      setSelectedAyatIndex(null);
      setSelectedThematicContext(null);
      setfiveGramOpenIndex(null);

      setThematicContexts([]);  // Clear old thematic contexts
      setLoadingThematicContexts(true);  // Show loading message

      fetchThematicContext(themeTopic.id);
      setGramState('five-gram');
    }
  };

  // Toggle Five Gram
  const toggleFiveGram = (index, context) => {
    const isSameIndex = fiveGramOpenIndex === index;

    // If it's the same index, deselect it and reset higher levels
    if (isSameIndex) {
      setSelectedAyatIndex(null);
      setfiveGramOpenIndex(null);
      setSelectedThematicContext(null);
    } else {
      // If it's a new five-gram, select it
      setSelectedAyatIndex(null);
      setfiveGramOpenIndex(index);
      setSelectedThematicContext(context);
    }
  };

  // Fetch Bi Gram
  const fetchPrimaryThemes = async () => {
    setLoadingThemes(true);

    // Try to load from localStorage
    const cached = localStorage.getItem('primaryThemes');
    if (cached) {
      setPrimaryThemes(JSON.parse(cached));
      setLoadingThemes(false);
      return;
    }

    try {
      const res = await fetch(`/api/get/primary-themes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setPrimaryThemes(data.themes);
        localStorage.setItem('primaryThemes', JSON.stringify(data.themes));
      } else {
        console.error("Error retrieving bi-grams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bi-grams:", error);
    }
    setLoadingThemes(false);
  };

  // Fetch Bi Gram at beginning
  useEffect(() => {
    fetchPrimaryThemes();
  }, []);

  // Fetch Tri Gram
  const fetchSubThemes = async (topicId) => {
    setLoadingSubThemes(true);
    try {
      const res = await fetch(`/api/get/sub-themes?theme=${topicId}`);
      const data = await res.json();
      if (res.ok) {
        setSubThemes(data.subThemes);
      } else {
        console.error("Error retrieving tri-grams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tri-grams:", error);
    }
    setLoadingSubThemes(false);
  };

  // Fetch Four Gram
  const fetchThematicTopics = async (topicId) => {
    setLoadingThematicTopics(true);
    try {
      const res = await fetch(`/api/get/thematic-topics?subtheme=${topicId}`);
      const data = await res.json();
      if (res.ok) {
        setThematicTopics(data.thematicTopics);
      } else {
        console.error("Error retrieving four-grams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching four-grams:", error);
    }
    setLoadingThematicTopics(false);
  };

  // Fetch Five Gram
  const fetchThematicContext = async (topicId) => {
    setLoadingThematicContexts(true);
    try {
      const res = await fetch(`/api/get/thematic-contexts?thematicTopic=${topicId}`);
      const data = await res.json();
      if (res.ok) {
        setThematicContexts(data.thematicContexts);
      } else {
        console.error("Error retrieving five-grams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching five-grams:", error);
    }
    setLoadingThematicContexts(false);
  };

  // Components
  const renderBiGramContent = () => (
    <>
      <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-100">
        {t('biGramHeading')}
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div
          ref={oneGramContainerRef}
          className="rounded lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base"
        >
          {loadingThemes ? (
            <p className="text-gray-500">{t('loadingBiGram')}</p>
          ) : primaryThemes.length > 0 ? (
            <ul>
              {primaryThemes.map((theme, index) => (
                <li key={index} className="py-1">
                  <div
                    ref={el => biGramRefs.current[String(theme.id)] = el}
                    tabIndex={-1}
                    className={`cursor-pointer hover:bg-[#28302d] rounded px-2 ${subOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                    onClick={() => toggleSubThemes(index, theme)}
                  >
                    {theme.bi_gram_text}
                  </div>
                  <hr className="w-1/2 mx-auto my-1 border-[#3a403e]" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t('noThemes')}</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{t('patterns', primaryThemes.length)}</p>
    </>
  );

  const renderTriGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>
        {t('triGramHeading')}
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedTheme ? (
            loadingSubThemes ? (
              <p className="text-gray-500">{t('loadingTriGram')}</p>
            ) : subThemes.length > 0 ? (
              <ul>
                {subThemes.map((theme, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${thematicOpenIndex === index ? "text-green-200" : "text-gray-200"} hover:bg-[#28302d]`}
                      onClick={() => toggleThematicTopics(index, theme)}
                    >
                      {theme.tri_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-gray-500">{t('noTriGram')}</p>
              </>
            )
          ) : (
            <>
              <p className="text-gray-500">{t('selectBiGramFirst')}</p>
            </>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{t('patterns', subThemes.length)}</p>
    </>
  );

  const renderFourGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedSubTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>{t('fourGramHeading')}</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedSubTheme ? (
            loadingThematicTopics ? (
              <p className="text-gray-500">{t('loadingFourGram')}</p>
            ) : thematicTopics.length > 0 ? (
              <ul>
                {thematicTopics.map((thematicTopic, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${contextOpenIndex === index ? "text-green-200" : "text-gray-200"} hover:bg-[#28302d]`}
                      onClick={() => toggleThematicContext(index, thematicTopic)}
                    >
                      {thematicTopic.four_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('noFourGram')}</p>
            )
          ) : (
            <p className="text-gray-500">{t('selectTriGramFirst')}</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{t('patterns', thematicTopics.length)}</p>
    </>
  );

  const renderFiveGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedThematicTopic ? 'text-zinc-100' : 'text-zinc-600'}`}>{t('fiveGramHeading')}</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedThematicTopic ? (
            loadingThematicContexts ? (
              <p className="text-gray-500">{t('loadingFiveGram')}</p>
            ) : thematicContexts.length > 0 ? (
              <ul>
                {thematicContexts.map((thematicContext, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${fiveGramOpenIndex === index ? "text-green-200" : "text-gray-200"} hover:bg-[#28302d]`}
                      onClick={() => toggleFiveGram(index, thematicContext)}
                    >
                      {thematicContext.five_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('noFiveGram')}</p>
            )
          ) : (
            <p className="text-gray-500">{t('selectFourGramFirst')}</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{t('patterns', thematicContexts.length)}</p>
    </>
  );

  const renderContinueButton = (currentState, nextState) => (
    <button
      onClick={() => setGramState(nextState)}
      className="my-4 w-full bg-[#39413e] hover:bg-[#5b6763] focus:outline-2 focus:outline-offset-2 focus:outline-[#5b6763] active:bg-[#6d7875] rounded-sm py-1"
    >
      <div className="flex items-center justify-center">
        {t('next')} <GrFormNext className="text-xl" />
      </div>
    </button>
  );

  const renderBackButton = (currentState, nextState) => (
    <button
      onClick={() => setGramState(nextState)}
      className="my-4 w-full bg-[#39413e] hover:bg-[#5b6763] focus:outline-2 focus:outline-offset-2 focus:outline-[#5b6763] active:bg-[#6d7875] rounded-sm py-1"
    >
      <div className="flex items-center justify-center">
        <GrFormPrevious className="text-xl" /> {t('back')}
      </div>
    </button>
  );

  const memoizedBiGram = useMemo(() => renderBiGramContent(), [
    gramState,
    openIndex,
    primaryThemes,
    loadingThemes,
    subOpenIndex,
    selectedTopic,
    selectedLang,
  ]);

  const memoizedTriGram = useMemo(() => renderTriGramContent(), [
    gramState,
    subThemes,
    loadingSubThemes,
    openIndex,
    subOpenIndex,
    selectedSubTheme,
    selectedLang,
  ]);

  const memoizedFourGram = useMemo(() => renderFourGramContent(), [
    gramState,
    thematicTopics,
    loadingThematicTopics,
    openIndex,
    thematicOpenIndex,
    selectedThematicTopic,
    selectedLang,
  ]);

  const memoizedFiveGram = useMemo(() => renderFiveGramContent(), [
    gramState,
    thematicContexts,
    loadingThematicContexts,
    fiveGramOpenIndex,
    selectedThematicContext,
    selectedLang,
  ]);

  const goToNextAyat = () => {
    if (surahAyatIndex === null) return;

    const nextIndex = surahAyatIndex + 1;
    if (nextIndex >= surahAyats.length) return;

    const nextAyat = surahAyats[nextIndex];

    setSurahAyatIndex(nextIndex);
    setCurrentAyat(nextAyat);

    const newIndex = ayats.findIndex(a => a.id === nextAyat.id);
    if (newIndex !== -1) {
      setSelectedAyatIndex(newIndex);
    }
  };

  const goToPrevAyat = () => {
    if (surahAyatIndex === null) return;

    const prevIndex = surahAyatIndex - 1;
    if (prevIndex < 0) return;

    const prevAyat = surahAyats[prevIndex];

    setSurahAyatIndex(prevIndex);
    setCurrentAyat(prevAyat);

    const newIndex = ayats.findIndex(a => a.id === prevAyat.id);
    if (newIndex !== -1) {
      setSelectedAyatIndex(newIndex);
    }
  };

  const handleReset = () => {
    if (selectedAyatIndex === null || ayats.length === 0) return;

    const baseAyat = ayats[selectedAyatIndex];

    setCurrentAyat(baseAyat);

    // reset surah index to match selected ayat
    const indexInSurah = surahAyats.findIndex(a => a.id === baseAyat.id);
    if (indexInSurah !== -1) {
      setSurahAyatIndex(indexInSurah);
    }
  };

  const handleAyatClick = (ayat, idx) => {
    // set selected ayat
    setCurrentAyat(ayat);
    setSelectedAyatIndex(idx);

    if (surahAyats.length > 0) {
      const indexInSurah = surahAyats.findIndex(
        a => a.id === ayat.id
      );

      if (indexInSurah !== -1) {
        setSurahAyatIndex(indexInSurah);
      }
    }
  };

  // UI Rendering
  return (
    <>
      {
        loading ? (
          <div className="fixed inset-0 bg-[#141a17] flex justify-center items-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full border-t-4 border-green-500 border-solid h-16 w-16 mb-4 mx-auto"></div>
              <p className="text-white text-xl p-0 m-0 mx-auto">{t('globalLoading')}</p>
            </div>
          </div>
        ) : (
          <div className="items-center justify-items-center min-h-screen lg:px-8 md:px-6 px-6 lg:pt-10 md:pt-8 pt-7 gap-16">

            {/* Header */}
            <header className="w-full">
              <h1 className="font-julius-sans lg:text-4xl md:text-3xl text-2xl text-center font-bold">Thematic Text-Pattern Searching</h1>
              <h3 className="font-julius-sans lg:text-2xl md:text-xl text-base text-center">for Al-Qur'an</h3>
              <hr className="w-full lg:my-6 my-3 border-zinc-400"></hr>
              <div className="flex justify-center gap-3 mt-3 mb-1">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'ms', label: 'Bahasa Melayu' },
                ].map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLang(code)}
                    className={`px-3 py-1 rounded text-sm border border-[#3a403e] transition-colors
                      ${selectedLang === code
                        ? 'bg-[#294a32] text-green-200 border-green-800'
                        : 'bg-[#1f2624] text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Translator credit */}
              {selectedLang === 'bn' && (
                <p className="text-center text-xs text-zinc-500 mt-3">
                  Bengali translation by <span className="text-zinc-400">Muhiuddin Khan</span>
                </p>
              )}
              {selectedLang === 'ms' && (
                <p className="text-center text-xs text-zinc-500 mt-3">
                  Malay translation by <span className="text-zinc-400">Abdullah Muhammad Basmeih</span>
                </p>
              )}
            </header>

            <main className="flex flex-col items-center w-full lg:px-8 px-1 lg:py-6 pt-4 my-0">

              {/* Search Box */}
              <div className="w-full lg:mb-2 lg:mt-0 mb-2 mt-2 flex items-center gap-2">
                {/* Input and Cross Button in relative container */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full p-2 rounded bg-[#1f2624] text-zinc-100 border border-[#3a403e] focus:outline-none focus:ring-2 focus:ring-[#144226] pr-10"
                    value={searchInput}
                    readOnly
                    onClick={() => {
                      setKeyboardOpen(true);
                      // Do NOT blur — just keep it focused
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData?.getData('text');
                      if (pastedText) {
                        setSearchInput(pastedText);
                        e.preventDefault(); // Prevent double-insert
                      }
                    }}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-400"
                      aria-label="Clear search"
                      tabIndex={0}
                    >
                      {/* Cross Icon SVG */}
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Keyboard Toggle Button */}
                <button
                  type="button"
                  onClick={() => setKeyboardOpen((v) => !v)}
                  aria-label="Toggle Keyboard"
                  className={`p-2 rounded border border-[#3a403e] lg:hover:bg-[#1f2624] transition
                  ${keyboardOpen ? 'bg-[#294a32]' : 'bg-[#141a17]'}
                  text-zinc-100`}
                  style={{ minWidth: 38, minHeight: 38 }}
                >
                  {/* Simple keyboard SVG icon */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="7" width="18" height="10" rx="2" stroke="#e0e0e0" strokeWidth="1.7" />
                    <rect x="7" y="11" width="2" height="2" rx="0.5" fill="#e0e0e0" />
                    <rect x="11" y="11" width="2" height="2" rx="0.5" fill="#e0e0e0" />
                    <rect x="15" y="11" width="2" height="2" rx="0.5" fill="#e0e0e0" />
                  </svg>
                </button>
              </div>

              {/* Search Result Display */}
              {(keyboardOpen || searchedTopics.length > 0) && (
                <div
                  className="search-scroll-container relative bg-[#1f2624] shadow-md rounded lg:mb-2 mb-0 w-full mt-1"
                  style={{ maxHeight: '14rem', overflowY: 'auto' }}
                >
                  {/* Headers */}
                  <div className='flex flex-row justify-between items-start sticky top-0 z-20 bg-[#1f2624] px-0 shadow-xl border-[#435e43] pt-3'>
                    <div>
                      <h1 className='font-bold ml-5 mt-0 mb-2 text-zinc-200 lg:text-base text-sm'>
                        {t('searchResultsLabel')} ( {searchedTopics.length ? t('searchResultsPatterns', searchedTopics.length) : t('searchResultsDash')} ) :
                      </h1>
                    </div>
                  </div>

                  <div className="lg:p-4 p-3 text-zinc-200 lg:text-lg text-base">
                    {loadingSearch ? (
                      <div className="min-h-[8rem]">
                        <p className="text-gray-500 pl-2">{t('loadingResults')}</p>
                      </div>
                    ) : searchedTopics.length > 0 ? (
                      <>
                        {Object.entries(groupedTopics).map(([gram, topics], idx) => (
                          <div key={gram} id={`gram-${idx + 1}`} className="mb-4 min-h-[7rem]">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                              {topics.map((topic, index) => (
                                <li
                                  key={index}
                                  className="cursor-pointer py-2 px-3 border border-[#2f3a35] bg-[#161f1a] hover:bg-[#232f28] transition-colors duration-200"
                                  onClick={() => {
                                    const matchedIndex = primaryThemes.findIndex(t => String(t.id) === String(topic.id));
                                    const matchedTheme = matchedIndex !== -1 ? primaryThemes[matchedIndex] : topic;
                                    setGramState('bi-gram');
                                    toggleSubThemes(matchedIndex, matchedTheme);
                                    setKeyboardOpen(false);

                                    // Only on desktop, set pendingScrollId (triggers useLayoutEffect)
                                    if (isDesktop()) {
                                      setTimeout(() => {
                                        setPendingScrollId(String(topic.id));
                                      }, 0);
                                    } else {
                                      setTimeout(() => {
                                        setGramState('tri-gram');
                                      }, 250);
                                    }
                                  }}
                                >
                                  <div
                                    className={
                                      [
                                        selectedTopic,
                                        selectedTheme,
                                        selectedSubTheme,
                                        selectedThematicTopic,
                                        selectedThematicContext,
                                      ].some(sel => sel?.id === topic.id)
                                        ? 'text-green-200'
                                        : 'text-gray-200'
                                    }
                                  >
                                    <div className="whitespace-pre-wrap break-words">
                                      {
                                        // Find the text field dynamically by checking known keys
                                        topic.topic_text ??
                                        topic.bi_gram_text ??
                                        topic.tri_gram_text ??
                                        topic.four_gram_text ??
                                        topic.five_gram_text ??
                                        ''
                                      }
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="min-h-[8rem]" >
                        <p className="text-gray-500">{t('searchHint')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Keyboard Component */}
              {keyboardOpen && (
                <div className='lg:mb-2 mb-1 lg:mt-6 mt-6 w-full mx-auto'>
                  <ArabicKeyboard searchInput={searchInput} setSearchInput={setSearchInput} />
                </div>
              )}

              {/* Selected Pattern Display */}
              <div className="w-fit lg:min-w-[25rem] min-w-[21rem] py-4 px-10 rounded-md bg-[#232f28] h-fit lg:mt-6 lg:mb-2 mt-6 mb-0 shadow-xl">
                <div className="flex flex-row items-center justify-center gap-5">
                  <h1 className='lg:text-xl text-lg text-center font-bold'>
                    <span>{t('selectedPattern')} </span>
                    <span className="block sm:inline font-normal">
                      {  /* 'block' for small screens, 'inline' for larger screens */
                        selectedThematicContext
                          ? selectedThematicContext.five_gram_text
                          : selectedThematicTopic
                            ? selectedThematicTopic.four_gram_text
                            : selectedSubTheme
                              ? selectedSubTheme.tri_gram_text
                              : selectedTheme
                                ? selectedTheme.bi_gram_text
                                : t('selectedPatternNone')
                      }</span>
                  </h1>

                  {/* Clear Button */}
                  <button
                    className="ml-1 text-zinc-100 p-1 hover:text-green-200 scale-125"
                    onClick={() => toggleSubThemes(null, null)}
                  >
                    <div className='bg-[#405c13] py-[2.5px] px-2 rounded text-xs hover:bg-[#4f7422] transition-colors duration-200'>
                      ✖
                    </div>
                  </button>
                </div>
              </div>

              {/* N-Gram Selection */}
              <div className="grid lg:grid-cols-4 grid-cols-1 lg:gap-6 gap-y-3 gap-x-3 w-full lg:mt-8 mt-6 text-center items-center">

                {/* Only render one bi-gram container, with ref */}
                {(gramState === 'bi-gram') && <div className='sm:hidden'>{memoizedBiGram}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{memoizedBiGram}</div>

                {/* Tri-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'tri-gram' && <div className="sm:hidden">{memoizedTriGram}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{memoizedTriGram}</div>

                {/* Four-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'four-gram' && <div className="sm:hidden">{memoizedFourGram}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{memoizedFourGram}</div>

                {/* Five-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'five-gram' && <div className="sm:hidden">{memoizedFiveGram}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{memoizedFiveGram}</div>

              </div>

              {/* Mobile Continue Button */}
              <div className='lg:hidden w-full flex flex-row items-center gap-3'>
                {gramState === 'bi-gram' && renderContinueButton('bi-gram', 'tri-gram')}

                {gramState === 'tri-gram' && renderBackButton('tri-gram', 'bi-gram')}
                {gramState === 'tri-gram' && renderContinueButton('tri-gram', 'four-gram')}

                {gramState === 'four-gram' && renderBackButton('four-gram', 'tri-gram')}
                {gramState === 'four-gram' && renderContinueButton('four-gram', 'five-gram')}

                {gramState === 'five-gram' && renderBackButton('five-gram', 'four-gram')}
              </div>

              {/* Ayat List & Before/After  */}
              <div className='w-full lg:pt-8 pt-4 pb-4'>

                {/* Ayat List */}
                <div className="">
                  <div>
                    <h3 className="lg:text-left text-center font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-300">
                      {!selectedTheme && !selectedSubTheme && !selectedThematicTopic && !selectedThematicContext
                        ? t('correspondingAyats')
                        : loadingAyats
                          ? t('loadingAyats')
                          : t('correspondingAyatsFound', ayats.length)}
                    </h3>
                    <div className="flex lg:flex-row flex-col lg:items-center items-start gap-3 pb-3">
                      <p className="lg:text-base text-sm">{t('selectAyatHint')}</p>

                      {/* Prev / Next ayat navigation */}
                      {ayats.length > 0 && (
                        <div className="flex items-center gap-2 lg:ml-auto">
                          <button
                            onClick={() => {
                              if (selectedAyatIndex === null || selectedAyatIndex === 0) return;
                              setSelectedAyatIndex(selectedAyatIndex - 1);
                            }}
                            disabled={selectedAyatIndex === null || selectedAyatIndex === 0}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-[#39413e] hover:bg-[#5b6763] disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
                          >
                            <GrFormPrevious className="text-lg" /> {t('back')}
                          </button>

                          <span className="text-zinc-400 text-sm min-w-[4rem] text-center">
                            {selectedAyatIndex !== null
                              ? `${selectedAyatIndex + 1} / ${ayats.length}`
                              : `- / ${ayats.length}`}
                          </span>

                          <button
                            onClick={() => {
                              const nextIdx = selectedAyatIndex === null ? 0 : selectedAyatIndex + 1;
                              if (nextIdx >= ayats.length) return;
                              setSelectedAyatIndex(nextIdx);
                            }}
                            disabled={selectedAyatIndex !== null && selectedAyatIndex >= ayats.length - 1}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-[#39413e] hover:bg-[#5b6763] disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
                          >
                            {t('next')} <GrFormNext className="text-lg" />
                          </button>
                        </div>
                      )}

                    </div>
                    <div className="bg-[#1f2624] shadow-md rounded py-3">
                      <div ref={ayatListRef} className="lg:px-4 px-3 lg:h-[25rem] h-[15rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                        <div className="lg:py-2 lg:px-3">
                          <div className="">
                            <p className="font-bold lg:text-xl text-sm">{t('ayatsHeading')}</p>
                            <hr className="w-full my-1 border-[#4a504e]"></hr>
                            <ul className=''>
                              {!selectedTheme && !selectedSubTheme && !selectedThematicTopic && !selectedThematicContext ? (
                                <p className="text-zinc-400 py-2">{t('selectPatternHint')}</p>
                              ) : loadingAyats ? (
                                <p className="text-zinc-400 py-2">{t('loadingAyatsList')}</p>
                              ) : ayats.length === 0 ? (
                                <p className="text-zinc-400 py-2">{t('noAyatsFound')}</p>
                              ) : (
                                ayats.map((ayat, idx) => {
                                  // Check if ayat is an object and it has the expected properties
                                  if (ayat && ayat.ayat_arabic_text) {
                                    return (
                                      <div
                                        key={ayat.id}
                                        ref={el => ayatItemRefs.current[idx] = el}
                                        onClick={() => handleAyatClick(ayat, idx)}
                                        className={`cursor-pointer rounded ${selectedAyatIndex === idx ? "bg-[#2c3533] text-green-200" : ""}`}
                                      >
                                        <li className={`py-2 font-arabic lg:text-xl text-sm ${selectedAyatIndex !== idx ? "text-zinc-200" : ""}`}>
                                          <span className="text-zinc-400 mr-2">(Surah-{ayat.surah_id} | Ayat-{ayat.ayat_no}) </span> {ayat.ayat_arabic_text}
                                          <p className="text-zinc-400 mr-2">{ayat.ayat_english_text}</p>
                                        </li>
                                        <hr className="w-full my-1 border-[#3a403e]" />
                                      </div>
                                    );
                                  } else {
                                    // If ayat doesn't have the required properties, display a fallback message
                                    return (
                                      <div key={idx} className="py-2 font-arabic lg:text-xl text-sm text-zinc-400">
                                        {t('invalidAyat')}
                                      </div>
                                    );
                                  }
                                })
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Before, Selected Pattern, After Section */}
                <div className='w-full mt-8 mb-2'>
                  <hr className="w-full mb-3 border-zinc-500" />
                  <div className="">
                    <div className="flex flex-row justify-center lg:gap-4 gap-5">
                      <div className='lg:w-[300px] w-[100px]'>
                        <p className="lg:text-lg text-sm font-bold text-right">{t('after')}</p>
                        <p className="lg:text-lg text-sm font-arabic text-right">
                          {selectedAyatIndex !== null
                            ? displayDetails
                              ? displayDetails.after
                              : t('loading')
                            : "-"}
                        </p>
                      </div>
                      <div className='lg:w-[300px] w-[100px] border-x-2 border-[#3a403e]'>
                        <p className="lg:text-lg text-sm text-center font-bold">{t('selectedPatternLabel')}</p>
                        <p className="lg:text-lg text-sm text-center font-arabic text-green-200">
                          <span className="block sm:inline font-normal">{
                            selectedThematicContext
                              ? selectedThematicContext.five_gram_text
                              : selectedThematicTopic
                                ? selectedThematicTopic.four_gram_text
                                : selectedSubTheme
                                  ? selectedSubTheme.tri_gram_text
                                  : selectedTheme
                                    ? selectedTheme.bi_gram_text
                                    : t('selectedPatternNone')
                          }</span>
                        </p>
                      </div>
                      <div className='lg:w-[300px] w-[100px]'>
                        <p className="lg:text-lg text-sm font-bold">{t('before')}</p>
                        <p className="lg:text-lg text-sm font-arabic">
                          {selectedAyatIndex !== null
                            ? displayDetails
                              ? displayDetails.before
                              : t('loading')
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500" />
                </div>

              </div>

              {/* Details of Selected Ayat */}
              {surahAyats.length > 0 && surahAyatIndex !== null && (
                <div className='flex flex-col items-center w-full'>
                  <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={goToPrevAyat}
                    disabled={surahAyatIndex === 0}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-[#39413e] hover:bg-[#5b6763] disabled:opacity-30"
                  >
                    <GrFormPrevious /><p className='font-sans'>{t('backAyat')}</p>
                  </button>

                  <span className="text-sm text-zinc-400">
                    {`${surahAyatIndex + 1} / ${surahAyats.length}`}
                  </span>

                  <button
                    onClick={goToNextAyat}
                    disabled={surahAyatIndex === surahAyats.length - 1}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-[#39413e] hover:bg-[#5b6763] disabled:opacity-30"
                  >
                    <p className='font-sans'>{t('nextAyat')}</p><GrFormNext />
                  </button>
                  </div>
                  <button onClick={handleReset} className="px-32 py-1 rounded border border-[#39413e] hover:bg-[#5b6763] disabled:opacity-30 text-sm transition-colors">
                    <p className='font-sans'>{t('resetAyat')}</p>
                  </button>
                </div>
              )}

              <div className="w-full lg:mb-8 mb-6">
                <div className="items-start">
                  <h1 className="lg:text-xl text-lg font-julius-sans font-bold lg:pt-3 pt-1">
                    {t('detailsHeading')}
                  </h1>

                  <hr className="w-full lg:mt-3 mt-2 lg:mb-6 mb-5 border-zinc-500" />

                  <div className="grid gap-y-2">
                    <p className="lg:text-lg text-sm">
                      <b className="font-julius-sans">{t('selectedAyatLabel')}</b>
                      {selectedAyatIndex !== null && currentAyat ? (
                        <span className="font-arabic">{currentAyat.ayat_arabic_text}</span>
                      ) : (
                        <span className="font-julius-sans"></span>
                      )}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>{t('surahName')}</b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? displayDetails?.surahName || t('loading')
                          : displayDetails?.surahName || ""
                        : ""}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>{t('ayatNumber')}</b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? displayDetails?.ayatNumber || t('loading')
                          : displayDetails?.ayatNumber || ""
                        : ""}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>{t('ayatTranslation')}</b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? displayDetails?.translation || t('loading')
                          : displayDetails?.translation || ""
                        : ""}
                    </p>
                  </div>
                </div>

              </div>

            </main>

            {/* Footer */}
            <footer className="items-center justify-center w-full m-0 p-0 text-center">
              <hr className="w-full lg:mt-6 mt-6 mb-3 border-zinc-400"></hr>
              <p className="p-0 mb-1 lg:text-sm text-xs">&copy; PhD Research Project of Nazia Nishat</p>
              <p className="p-0 mb-3 lg:text-xs text-[10px]">Developed by Khandoker Ashik Uz Zaman</p>
            </footer>
          </div>
        )
      }
    </>
  );
}