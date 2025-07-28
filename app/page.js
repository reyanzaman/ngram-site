"use client";

import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import ArabicKeyboard from '@/app/utils/keyboard';

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

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
  const [ayatDetails, setAyatDetails] = useState([]);

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

  const groupedTopics = searchedTopics.reduce((acc, topic) => {
    if (!acc[topic.foundInGram]) acc[topic.foundInGram] = [];
    acc[topic.foundInGram].push(topic);
    return acc;
  }, {});

  function isDesktop() {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 640; // matches 'sm' breakpoint (Tailwind)
  }

  async function fetchSearchResults(originalText) {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText }),
      });

      if (!response.ok) {
        throw new Error('Search API request failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  }

  // Scrolls bi-gram list
  const scrollToBiGram = (themeId) => {
    setTimeout(() => {
      const container = oneGramContainerRef.current;
      const el = biGramRefs.current[themeId];
      if (container && el) {
        const offset = el.offsetTop - container.offsetTop;
        container.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  // Debounce Search Input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchedTopics([]);
      return;
    }

    async function performSearch() {
      setLoadingSearch(true);
      const results = await fetchSearchResults(debouncedSearch);
      setSearchedTopics(results);
      setLoadingSearch(false);
    }

    performSearch();
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
          body: JSON.stringify({ level, id: gram.id }),
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
  }, [selectedTheme, selectedSubTheme, selectedThematicTopic, selectedThematicContext]);

  // Fetch Ayat Details when selectedAyatIndex changes
  useEffect(() => {
    const fetchAyatDetails = async () => {
      if (selectedAyatIndex === null) return;

      // Determine the highest-order selected n-gram
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

      setLoadingDetails(true);
      try {
        const selectedAyatId = ayats[selectedAyatIndex].id;
        const res = await fetch(
          `/api/get/ayat-details?ngram=${selectedPatternType}&ngramId=${selectedPatternId}&ayatId=${selectedAyatId}`
        );
        const data = await res.json();
        setAyatDetails(data.details || []);
      } catch (e) {
        console.error("Error fetching ayat details", e);
        setAyatDetails([]);
      }
      setLoadingDetails(false);
    };

    fetchAyatDetails();
  }, [selectedAyatIndex]);

  // Scroll to Bi Gram when pendingScrollId is set
  useLayoutEffect(() => {
    if (!pendingScrollId) return;
    let tries = 0;
    function tryScroll() {
      const el = biGramRefs.current[pendingScrollId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setPendingScrollId(null);
      } else if (tries < 8) {
        tries++;
        setTimeout(tryScroll, 120);
      } else {
        setPendingScrollId(null);
      }
    }
    tryScroll();
  }, [pendingScrollId, primaryThemes, subOpenIndex]);

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
      setAyatDetails(null);
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
      setAyatDetails(null);
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
      setAyatDetails(null);
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
      setAyatDetails(null);
      setfiveGramOpenIndex(null);
      setSelectedThematicContext(null);
    } else {
      // If it's a new five-gram, select it
      setSelectedAyatIndex(null);
      setAyatDetails(null);
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
        Repeating 2-Word Text Patterns
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div
          ref={oneGramContainerRef}
          className="rounded lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base"
        >
          {loadingThemes ? (
            <p className="text-gray-500">Loading text patterns...</p>
          ) : primaryThemes.length > 0 ? (
            <ul>
              {primaryThemes.map((theme, index) => (
                <li key={index} className="py-1">
                  <div
                    ref={el => biGramRefs.current[String(theme.id)] = el}
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
            <p className="text-gray-500">No themes available</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{primaryThemes.length > 1 ? `${primaryThemes.length} Patterns` : `${primaryThemes.length} Pattern`}</p>
    </>
  );

  const renderTriGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>
        Repeating 3-word Text Patterns
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedTheme ? (
            loadingSubThemes ? (
              <p className="text-gray-500">Loading repeating 3-word text patterns...</p>
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
                <p className="text-gray-500">No repeating 3-word text patterns available. Please see the Ayats below that contain the text-pattern</p>
              </>
            )
          ) : (
            <>
              <p className="text-gray-500">Select a text pattern to view repeating 3 word text patterns</p>
            </>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{subThemes.length > 1 ? `${subThemes.length} Patterns` : `${subThemes.length} Pattern`}</p>
    </>
  );

  const renderFourGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedSubTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>Repeating 4-word text patterns</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedSubTheme ? (
            loadingThematicTopics ? (
              <p className="text-gray-500">Loading repeating 4-word text patterns...</p>
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
              <p className="text-gray-500">No repeating 4-word text patterns available. Please see the Ayats below that contain the text-pattern</p>
            )
          ) : (
            <p className="text-gray-500">Select a repeating 3-word text pattern to view repeating 5-word text patterns</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{thematicTopics.length > 1 ? `${thematicTopics.length} Patterns` : `${thematicTopics.length} Pattern`}</p>
    </>
  );

  const renderFiveGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedThematicTopic ? 'text-zinc-100' : 'text-zinc-600'}`}>Repeating 5-word text patterns</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[31rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedThematicTopic ? (
            loadingThematicContexts ? (
              <p className="text-gray-500">Loading repeating 5-word text patterns...</p>
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
              <p className="text-gray-500">No repeating 5-word text patterns available. Please see the Ayats below that contain the text-pattern</p>
            )
          ) : (
            <p className="text-gray-500">Select a repeating 4-word text pattern to view repeating 5-word text patterns</p>
          )}
        </div>
      </div>
      <p className='text-sm pt-3 font-bold text-green-100 opacity-40'>{thematicContexts.length > 1 ? `${thematicContexts.length} Patterns` : `${thematicContexts.length} Pattern`}</p>
    </>
  );

  const renderContinueButton = (currentState, nextState) => (
    <button
      onClick={() => setGramState(nextState)}
      className="my-4 w-full bg-[#39413e] hover:bg-[#5b6763] focus:outline-2 focus:outline-offset-2 focus:outline-[#5b6763] active:bg-[#6d7875] rounded-sm py-1"
    >
      <div className="flex items-center justify-center">
        Next <GrFormNext className="text-xl" />
      </div>
    </button>
  );

  const renderBackButton = (currentState, nextState) => (
    <button
      onClick={() => setGramState(nextState)}
      className="my-4 w-full bg-[#39413e] hover:bg-[#5b6763] focus:outline-2 focus:outline-offset-2 focus:outline-[#5b6763] active:bg-[#6d7875] rounded-sm py-1"
    >
      <div className="flex items-center justify-center">
        <GrFormPrevious className="text-xl" /> Back
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
  ]);

  const memoizedTriGram = useMemo(() => renderTriGramContent(), [
    gramState,
    subThemes,
    loadingSubThemes,
    openIndex,
    subOpenIndex,
    selectedSubTheme,
  ]);

  const memoizedFourGram = useMemo(() => renderFourGramContent(), [
    gramState,
    thematicTopics,
    loadingThematicTopics,
    openIndex,
    thematicOpenIndex,
    selectedThematicTopic,
  ]);

  const memoizedFiveGram = useMemo(() => renderFiveGramContent(), [
    gramState,
    thematicContexts,
    loadingThematicContexts,
    fiveGramOpenIndex,
    selectedThematicContext,
  ]);

  // UI Rendering
  return (
    <>
      {
        loading ? (
          <div className="fixed inset-0 bg-[#141a17] flex justify-center items-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full border-t-4 border-green-500 border-solid h-16 w-16 mb-4 mx-auto"></div>
              <p className="text-white text-xl p-0 m-0 mx-auto">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="items-center justify-items-center min-h-screen lg:px-8 md:px-6 px-6 lg:pt-10 md:pt-8 pt-7 gap-16">

            {/* Header */}
            <header className="w-full">
              <h1 className="font-julius-sans lg:text-4xl md:text-3xl text-2xl text-center font-bold">Thematic Text-Pattern Searching</h1>
              <h3 className="font-julius-sans lg:text-2xl md:text-xl text-base text-center">for Al-Qur'an</h3>
              <hr className="w-full lg:my-6 my-3 border-zinc-400"></hr>
            </header>

            <main className="flex flex-col items-center w-full lg:px-8 px-1 lg:py-6 pt-4 my-0">

              {/* Search Box */}
              <div className="w-full lg:mb-2 lg:mt-0 mb-2 mt-2 flex items-center gap-2">
                {/* Input and Cross Button in relative container */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search Text Patterns . . ."
                    className="w-full p-2 rounded bg-[#1f2624] text-zinc-100 border border-[#3a403e] focus:outline-none focus:ring-2 focus:ring-[#144226] pr-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onClick={() => {
                      setKeyboardOpen(true);
                    }}
                    onFocus={(e) => {
                      if (isMobileDevice()) {
                        e.target.blur(); // Prevent keyboard
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
              {keyboardOpen && (
                <div
                  className="search-scroll-container relative bg-[#1f2624] shadow-md rounded lg:mb-2 mb-0 w-full"
                  style={{ maxHeight: '12.8rem', overflowY: 'auto' }}
                >
                  {/* Headers */}
                  <div className='flex flex-row justify-between items-start sticky top-0 z-20 bg-[#1f2624] px-0 shadow-xl border-[#435e43] pt-3'>
                    <div>
                      <h1 className='font-bold ml-5 mt-0 mb-2 text-zinc-200 lg:text-base text-sm'>
                        Search Results ( {searchedTopics.length ? `${searchedTopics.length} Patterns` : '-'} ) :
                      </h1>
                    </div>
                  </div>

                  <div className="lg:p-4 p-3 text-zinc-200 lg:text-lg text-base">
                    {loadingSearch ? (
                      <div className="min-h-[8rem]">
                        <p className="text-gray-500 pl-2">Loading results...</p>
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
                                    setGramState('bi-gram');
                                    toggleSubThemes(matchedIndex, topic);
                                    setKeyboardOpen(false);
                                    setSearchInput('');
                                    setDebouncedSearch('');

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
                        <p className="text-gray-500">Search for patterns using the arabic keyboard below</p>
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
                    <span>Selected Pattern: </span>
                    <span className="block sm:inline font-normal">
                      {  /* 'block' for small screens, 'inline' for larger screens */
                        selectedThematicContext
                          ? selectedThematicContext.five_gram_text // Display the five-gram text
                          : selectedThematicTopic
                            ? selectedThematicTopic.four_gram_text // Display the four-gram text
                            : selectedSubTheme
                              ? selectedSubTheme.tri_gram_text // Display the tri-gram text
                              : selectedTheme
                                ? selectedTheme.bi_gram_text // Display the bi-gram text
                                : "None"
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
                        ? "Corresponding Ayats"
                        : loadingAyats
                          ? "Loading Ayats..."
                          : `Corresponding Ayats ( Found: ${ayats.length} )`}
                    </h3>
                    <p className="lg:text-left text-center lg:text-base text-sm pb-3">Select ayat to view details</p>
                    <div className="bg-[#1f2624] shadow-md rounded py-3">
                      <div className="lg:px-4 px-3 lg:h-[25rem] h-[15rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                        <div className="lg:py-2 lg:px-3">
                          <div className="">
                            <p className="font-bold lg:text-xl text-sm">Ayats</p>
                            <hr className="w-full my-1 border-[#4a504e]"></hr>
                            <ul className=''>
                              {!selectedTheme && !selectedSubTheme && !selectedThematicTopic && !selectedThematicContext ? (
                                <p className="text-zinc-400 py-2">Select a text pattern or n-word repeating text pattern to view Ayats.</p>
                              ) : loadingAyats ? (
                                <p className="text-zinc-400 py-2">Loading Ayats...</p>
                              ) : ayats.length === 0 ? (
                                <p className="text-zinc-400 py-2">No Ayats found for the selected topic.</p>
                              ) : (
                                ayats.map((ayat, idx) => {
                                  // Check if ayat is an object and it has the expected properties
                                  if (ayat && ayat.ayat_arabic_text) {
                                    return (
                                      <div
                                        key={ayat.id}
                                        onClick={() => {
                                          setAyatDetails(null); // Clear before loading new
                                          setSelectedAyatIndex(prev => (prev === idx ? null : idx));
                                        }}
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
                                        Invalid Ayat Data
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
                        <p className="lg:text-lg text-sm font-bold text-right">After</p>
                        <p className="lg:text-lg text-sm font-arabic text-right">
                          {selectedAyatIndex !== null
                            ? loadingDetails
                              ? "Loading..."
                              : ayatDetails?.after || "-"
                            : "-"}
                        </p>
                      </div>
                      <div className='lg:w-[300px] w-[100px] border-x-2 border-[#3a403e]'>
                        <p className="lg:text-lg text-sm text-center font-bold">Selected Pattern</p>
                        <p className="lg:text-lg text-sm text-center font-arabic text-green-200">
                          <span className="block sm:inline font-normal">{  /* 'block' for small screens, 'inline' for larger screens */
                            selectedThematicContext
                              ? selectedThematicContext.five_gram_text // Display the five-gram text
                              : selectedThematicTopic
                                ? selectedThematicTopic.four_gram_text // Display the four-gram text
                                : selectedSubTheme
                                  ? selectedSubTheme.tri_gram_text // Display the tri-gram text
                                  : selectedTheme
                                    ? selectedTheme.bi_gram_text // Display the bi-gram text
                                    : "None"
                          }</span>
                        </p>
                      </div>
                      <div className='lg:w-[300px] w-[100px]'>
                        <p className="lg:text-lg text-sm font-bold">Before</p>
                        <p className="lg:text-lg text-sm font-arabic">
                          {selectedAyatIndex !== null
                            ? loadingDetails
                              ? "Loading..."
                              : ayatDetails?.before || "-"
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500" />
                </div>

              </div>

              {/* Details of Selected Ayat */}
              <div className="w-full lg:mb-8 mb-6">
                <div className="items-start">
                  <h1 className="lg:text-xl text-lg font-julius-sans font-bold lg:pt-3 pt-1">
                    Details of selected Ayat
                  </h1>

                  <hr className="w-full lg:mt-3 mt-2 lg:mb-6 mb-5 border-zinc-500" />

                  <div className="grid gap-y-2">
                    <p className="lg:text-lg text-sm">
                      <b className="font-julius-sans">Selected Ayat : </b>
                      {selectedAyatIndex !== null && ayats[selectedAyatIndex] ? (
                        <span className="font-arabic">{ayats[selectedAyatIndex]?.ayat_arabic_text}</span>
                      ) : (
                        <span className="font-julius-sans"></span>
                      )}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>Surah Name : </b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? "Loading..."
                          : ayatDetails?.surahName || ""
                        : ""}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>Ayat Number : </b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? "Loading..."
                          : ayatDetails?.ayatNumber || ""
                        : ""}
                    </p>
                    <p className="lg:text-lg text-sm font-julius-sans">
                      <b>Ayat Translation : </b>
                      {selectedAyatIndex !== null
                        ? loadingDetails
                          ? "Loading..."
                          : ayatDetails?.translation || ""
                        : ""}
                    </p>
                  </div>
                </div>

                {/* After, Pattern, Before Section Details*/}
                {/* <div className="w-full grid lg:grid-cols-3 border-2 border-[#3a403e] rounded-lg p-4 gap-4">

                  <div className='border-r-2 border-[#3a403e]'>
                    <h1 className='text-center'>After</h1>
                    <hr className="w-[90%] mx-auto lg:mt-3 mt-2 lg:mb-6 mb-5 border-zinc-500" />
                  </div>

                  <div>
                    <h1 className='text-center'>Pattern</h1>
                    <hr className="w-full mx-auto lg:mt-3 mt-2 lg:mb-6 mb-5 border-zinc-500" />
                  </div>

                  <div className='border-l-2 border-[#3a403e]'>
                    <h1 className='text-center'>Before</h1>
                    <hr className="w-[90%] mx-auto lg:mt-3 mt-2 lg:mb-6 mb-5 border-zinc-500" />
                  </div>

                </div> */}

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