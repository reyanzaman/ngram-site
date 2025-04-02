"use client";

import React, { useState, useEffect } from 'react';
import { GrFormNext, GrFormPrevious, GrFormClose } from "react-icons/gr";

export default function Home() {

  // States Variables
  const [openIndex, setOpenIndex] = useState(null);
  const [subOpenIndex, setSubOpenIndex] = useState(null);
  const [thematicOpenIndex, setThematicOpenIndex] = useState(null);
  const [contextOpenIndex, setContextOpenIndex] = useState(null);
  const [fiveGramOpenIndex, setfiveGramOpenIndex] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedThematicTopic, setSelectedThematicTopic] = useState(null);
  const [selectedThematicContext, setSelectedThematicContext] = useState(null);

  const [gramState, setGramState] = React.useState('bi-gram');

  const [primaryTopics, setPrimaryTopics] = useState([]);
  const [oneGramsLinkBiGrams, setOneGramsLinkBiGrams] = useState([]);
  const [primaryThemes, setPrimaryThemes] = useState([]);
  const [subThemes, setSubThemes] = useState([]);
  const [thematicTopics, setThematicTopics] = useState([]);
  const [thematicContexts, setThematicContexts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [loadingSubThemes, setLoadingSubThemes] = useState(false);
  const [loadingThematicTopics, setLoadingThematicTopics] = useState(false);
  const [loadingThematicContexts, setLoadingThematicContexts] = useState(false);

  // Fetch One Gram
  useEffect(() => {
    const fetchPrimaryTopics = async () => {
      setLoading(true);
      const cachedData = localStorage.getItem('primary-topics');

      // If data is cached, use it
      if (cachedData) {
        setPrimaryTopics(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      try {
        const res = await fetch("/api/get/primary-topics", {
          method: "GET",
        });
        const data = await res.json();

        if (res.ok) {
          setPrimaryTopics(data.topics);
          // Cache the fetched data in localStorage for future use
          localStorage.setItem('primary-topics', JSON.stringify(data.topics));
        } else {
          console.error(data.error || "Error retrieving data.");
        }
      } catch (error) {
        console.error("Frontend Primary Topic Fetching Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchtopiclinktheme = async () => {
      setLoading(true);
      const cachedData = localStorage.getItem('topic-link-bigram');

      // If data is cached, use it
      if (cachedData) {
        setOneGramsLinkBiGrams(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      try {
        const res = await fetch("/api/get/primary-topics-link-bi-grams", {
          method: "GET",
        });
        const data = await res.json();

        if (res.ok) {
          setOneGramsLinkBiGrams(data.links);
          // Cache the fetched data in localStorage for future use
          localStorage.setItem('topic-link-bigram', JSON.stringify(data.links));
        } else {
          console.error(data.error || "Error retrieving data.");
        }
      } catch (error) {
        console.error("Frontend Topic Link BiGram Fetching Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryTopics();
    fetchtopiclinktheme();
  }, []);

  // Toggle One Gram
  const toggleSublist = (index, topic) => {
    if (topic === null) {
      setSelectedTopic(null);
      setOpenIndex(null);
    } else {
      const isSameIndex = openIndex === index;

      if (isSameIndex) {
        setSelectedTopic(null);
        setOpenIndex(null);
      } else {
        setPrimaryThemes([]);  // Clear old data instantly
        setLoadingThemes(true); // Show loading message
        setSelectedTopic(topic);
        setOpenIndex(index);
        fetchPrimaryThemes(topic.id);
      }
    }

    // Reset all deeper levels
    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSelectedThematicTopic(null);
    setSelectedThematicContext(null);
    setSubOpenIndex(null);
    setThematicOpenIndex(null);
    setContextOpenIndex(null);
    setfiveGramOpenIndex(null);
  };

  // Fetch Bi Gram
  const fetchPrimaryThemes = async (topicId) => {
    setLoadingThemes(true);
    try {
      const linkedBiGrams = oneGramsLinkBiGrams
        .filter(link => link.topic_id === topicId)
        .map(link => link.bi_gram_id);

      if (linkedBiGrams.length === 0) {
        console.warn("No linked bi-grams found for topic:", topicId);
        setPrimaryThemes([]);
        setLoadingThemes(false);
        return;
      }

      // Use POST request with JSON body
      const res = await fetch(`/api/get/primary-themes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biGrams: linkedBiGrams })
      });

      const data = await res.json();

      if (res.ok) {
        setPrimaryThemes(data.themes);
      } else {
        console.error("Error retrieving bi-grams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bi-grams:", error);
    }
    setLoadingThemes(false);
  };

  // Toggle Bi Gram
  const toggleSubThemes = (subIndex, theme) => {
    const isSameIndex = subOpenIndex === subIndex;

    setSubOpenIndex(isSameIndex ? null : subIndex);
    setSelectedTheme(isSameIndex ? null : theme);

    if (!isSameIndex) {
      setSubThemes([]);
      setLoadingSubThemes(true);  // Show loading message
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setThematicOpenIndex(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);
      fetchSubThemes(theme.id);
    }
  };

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

  // Toggle Tri Gram
  const toggleThematicTopics = (thematicIndex, theme) => {
    const isSameIndex = thematicOpenIndex === thematicIndex;

    setThematicOpenIndex(isSameIndex ? null : thematicIndex);
    setSelectedSubTheme(isSameIndex ? null : theme);

    if (!isSameIndex) {
      setThematicTopics([]);
      setLoadingThematicTopics(true);  // Show loading message
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null);
      fetchThematicTopics(theme.id);
    }
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

  // Toggle Four Gram
  const toggleThematicContext = (contextIndex, themeTopic) => {
    const isSameIndex = contextOpenIndex === contextIndex;

    setContextOpenIndex(isSameIndex ? null : contextIndex);
    setSelectedThematicTopic(isSameIndex ? null : themeTopic);

    if (!isSameIndex) {
      setThematicContexts([]);
      setLoadingThematicContexts(true);  // Show loading message
      setSelectedThematicContext(null);
      setfiveGramOpenIndex(null);
      fetchThematicContext(themeTopic.id);
    }
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

  // Toggle Five Gram
  const toggleFiveGram = (index, context) => {
    const isSameIndex = fiveGramOpenIndex === index;

    setfiveGramOpenIndex(isSameIndex ? null : index);
    setSelectedThematicContext(isSameIndex ? null : context);
  };


  // Components

  const renderBiGramContent = () => {
    // Sort primaryTopics based on topic_stemmed
    const sortedTopics = [...primaryTopics].sort((a, b) =>
      a.topic_stemmed.localeCompare(b.topic_stemmed)
    );

    return (
      <>
        <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-100">
          {selectedTopic ? "Primary Themes" : "Primary Topics"}

          {/* Back Button */}
          {selectedTopic && (
            <button
              className="ml-1 text-zinc-100 p-1 hover:text-green-200 translate-y-[3px] scale-125"
              onClick={() => toggleSublist(null, null)}
            >
              <GrFormClose size={20} />
            </button>
          )}
        </h3>
        <div className="bg-[#1f2624] shadow-md rounded py-3">
          <div className="rounded lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
            {primaryTopics.length === 0 ? (
              <p className="text-gray-500">Loading Primary Topics</p>
            ) : (
              <ul>
                {/* Column Headers */}
                <div className="grid grid-cols-2 gap-x-4 px-4 pb-2 mb-2 border-b-2 border-[#3a403e] text-center font-semibold">
                  <p className="w-full">Topic</p>
                  <p className="w-full">Stemmed</p>
                </div>

                {sortedTopics.map((topic, index) =>
                  (openIndex === null || openIndex === index) && (
                    <li key={index} className="py-1 cursor-pointer">
                      <div
                        className={`${openIndex === index ? "text-green-200" : "text-gray-200"}`}
                        onClick={() => toggleSublist(index, topic)}
                      >
                        {/* Topic Row */}
                        <div className="grid grid-cols-2 gap-x-4 px-4 text-center">
                          <p className="w-full">{topic.topic_text}</p>
                          <p className="w-full">{topic.topic_stemmed}</p>
                        </div>
                      </div>
                      <hr className="w-full my-1 border-[#3a403e]" />

                      {/* Sublist for Primary Themes */}
                      {openIndex === index && (
                        <div>
                          <p className="w-full mb-2 mt-4 border-b-2 border-[#3a403e] cursor-auto">Theme</p>
                          <ul className="mt-1 text-gray-400">
                            {loadingThemes ? (
                              <p className="text-gray-500">Loading primary themes...</p>
                            ) : primaryThemes.length > 0 ? (
                              primaryThemes.map((theme, subIndex) => (
                                <li
                                  key={`${index}-${subIndex}`}
                                  className={`${subOpenIndex === subIndex ? "text-green-200 py-1" : "text-gray-200 py-1"}`}
                                  onClick={() => toggleSubThemes(subIndex, theme)}
                                >
                                  {theme.bi_gram_text}
                                  <hr className="w-1/2 mx-auto my-1 border-[#3a403e]" />
                                </li>
                              ))
                            ) : (
                              <p className="text-gray-500">No themes available</p>
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderTriGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>
        Sub-Themes
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedTheme ? (
            loadingSubThemes ? (
              <p className="text-gray-500">Loading sub-themes...</p>
            ) : subThemes.length > 0 ? (
              <ul>
                {subThemes.map((theme, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${thematicOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleThematicTopics(index, theme)}
                    >
                      {theme.tri_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No sub-themes available</p>
            )
          )  : (
            <p className="text-gray-500">Select a primary theme to view sub themes</p>
          )}
        </div>
      </div>
    </>
  );

  const renderFourGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedSubTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>Thematic Topics</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedSubTheme ? (
            loadingThematicTopics ? (
              <p className="text-gray-500">Loading thematic topics...</p>
            ) : thematicTopics.length > 0 ? (
              <ul>
                {thematicTopics.map((thematicTopic, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${contextOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleThematicContext(index, thematicTopic)}
                    >
                      {thematicTopic.four_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
                </ul>
            ) : (
              <p className="text-gray-500">No thematic topics available</p>
            )
          )  : (
            <p className="text-gray-500">Select a sub theme to view thematic topics</p>
          )}
        </div>
      </div>
    </>
  );

  const renderFiveGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedThematicTopic ? 'text-zinc-100' : 'text-zinc-600'}`}>Thematic Context</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedThematicTopic ? (
            loadingThematicContexts ? (
              <p className="text-gray-500">Loading thematic contexts...</p>
            ) : thematicContexts.length > 0 ? (
              <ul>
                {thematicContexts.map((thematicContext, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${fiveGramOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleFiveGram(index, thematicContext)}
                    >
                      {thematicContext.five_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No thematic contexts available</p>
            )
          ) : (
            <p className="text-gray-500">Select a thematic topic to view thematic contexts</p>
          )}
        </div>
      </div>
    </>
  );

  const renderContinueButton = (currentState, nextState) => (
    <button
      onClick={() => setGramState(nextState)}
      className="my-4 w-full bg-[#39413e] hover:bg-[#5b6763] focus:outline-2 focus:outline-offset-2 focus:outline-[#5b6763] active:bg-[#6d7875] rounded-sm py-1"
    >
      <div className="flex items-center justify-center">
        Continue <GrFormNext className="text-xl" />
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
            <header className="w-full">
              <h1 className="font-julius-sans lg:text-4xl md:text-3xl text-2xl text-center font-bold">Thematic Text-Pattern Searching</h1>
              <h3 className="font-julius-sans lg:text-2xl md:text-xl text-base text-center">for Al-Qur'an</h3>
              <hr className="w-full lg:my-6 my-3 border-zinc-400"></hr>
            </header>

            <main className="flex flex-col items-center w-full lg:px-8 px-1 lg:py-6 pt-4 my-0">
              <div className="grid lg:grid-cols-4 grid-cols-1 lg:gap-6 gap-y-3 gap-x-3 w-full text-center">

                {/* Bi-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'bi-gram' && <div className="sm:hidden">{renderBiGramContent()}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{renderBiGramContent()}</div>

                {/* Tri/Four/Five Grams */}

                {/* Tri-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'tri-gram' && <div className="sm:hidden">{renderTriGramContent()}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{renderTriGramContent()}</div>

                {/* Four-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'four-gram' && <div className="sm:hidden">{renderFourGramContent()}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{renderFourGramContent()}</div>

                {/* Five-Gram */}
                {/* Mobile: Render conditionally */}
                {gramState === 'five-gram' && <div className="sm:hidden">{renderFiveGramContent()}</div>}
                {/* Non-mobile: Always render */}
                <div className="hidden sm:block">{renderFiveGramContent()}</div>

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

              {/* Result */}

              <div className="lg:py-8 py-4 w-full">
                <div>
                  <h3 className="lg:text-left text-center font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-300">Search Result (Ayats Found: 2)</h3>
                  <div className="bg-[#1f2624] shadow-md rounded py-3">
                    <div className="lg:px-4 px-3 lg:h-[20rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                      <div className="lg:py-2 lg:px-4">
                        <div className="">
                          <p className="font-bold lg:text-xl text-sm">Ayats</p>
                          <hr className="w-full my-1 border-[#4a504e]"></hr>
                          <ul>
                            <li className="py-1 font-arabic text-green-200 lg:text-xl text-sm">بسم الله الرحمن الرحيم</li>
                            <hr className="w-full my-1 border-[#3a403e]"></hr>
                            <li className="py-1 font-arabic lg:text-xl text-sm">يا ايها الذين امنوا</li>
                            <hr className="w-full my-1 border-[#3a403e]"></hr>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}

              <div className="lg:mt-2 mt-6 lg:mb-8 mb-6 items-start w-full">
                <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500"></hr>
                <h1 className="lg:text-xl text-lg font-julius-sans font-bold lg:pt-3 pt-1">Details of selected Ayat</h1>
                <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500"></hr>
                <div className="grid lg:grid-cols-2 grid-cols-1 pt-2 lg:gap-y-3 gap-y-3 gap-x-8">
                  <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Selected Pattern : </b>الله الرحمن</p>
                  <p className="lg:text-lg text-sm font-julius-sans"><b>Surah Name : </b>Yusuf - Prophet Joseph (12)</p>
                  <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Number : </b>1</p>
                  <p className="lg:text-lg text-sm font-julius-sans"><b>No. of Occurrences : </b> 2</p>
                  <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Translation : </b> In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
                  <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Ayat Text : </b> بسم الله الرحمن الرحيم</p>
                </div>
              </div>

              <div className='w-full'>
                <div className='flex flex-row items-start lg:gap-8 gap-6'>
                  <div className=''>
                    <p className="lg:text-lg text-sm font-bold">Before</p>
                    <p className="lg:text-lg text-sm font-arabic">الرحيم</p>
                  </div>
                  <div>
                    <p className="lg:text-lg text-sm font-bold">Selected Pattern</p>
                    <p className="lg:text-lg text-sm font-arabic text-green-200">الله الرحمن</p>
                  </div>
                  <div>
                    <p className="lg:text-lg text-sm font-bold">After</p>
                    <p className="lg:text-lg text-sm font-arabic">بسم</p>
                  </div>
                </div>
              </div>

            </main>

            <footer className="items-center justify-center w-full m-0 p-0 text-center">
              <hr className="w-full lg:mt-6 mt-6 mb-3 border-zinc-400"></hr>
              <p className="p-0 mb-3 lg:text-sm text-xs">&copy; PhD Research Project of Nazia Nishat</p>
            </footer>
          </div>
        )}
    </>
  );
}
