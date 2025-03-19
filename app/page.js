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

    fetchPrimaryTopics();
  }, []);

  // Toggle One Gram
  const toggleSublist = (index, topic) => {
    if (topic === null) {
      // Deselect the topic and close everything if the topic is null
      setSelectedTopic(null);
      setOpenIndex(null);
    } else {
      const isSameIndex = openIndex === index;
  
      if (isSameIndex) {
        // Deselect the topic if it's the same
        setSelectedTopic(null);
        setOpenIndex(null);
      } else {
        // Select a new topic and fetch its bi-grams
        setSelectedTopic(topic);
        setOpenIndex(index);
        fetchPrimaryThemes(topic.id); // Ensure topic is valid before calling this
      }
    }
  
    // Reset other states to clear selections
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
      const res = await fetch(`/api/get/primary-themes?topic=${topicId}`);
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

    // Toggle the subIndex and theme
    setSubOpenIndex(isSameIndex ? null : subIndex);
    setSelectedTheme(isSameIndex ? null : theme);

    // Reset all other states
    if (!isSameIndex) {
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setThematicOpenIndex(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null); // Reset fiveGramOpenIndex when toggling to a new sub-theme
      fetchSubThemes(theme.id);
    } else {
      // Reset only the selectedSubTheme if the same index is toggled
      setSelectedSubTheme(null);
      setSelectedThematicTopic(null);
      setSelectedThematicContext(null);
      setThematicOpenIndex(null);
      setContextOpenIndex(null);
      setfiveGramOpenIndex(null); // Ensure that fiveGramOpenIndex is reset when toggling the same bi-gram
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

  const renderBiGramContent = () => (
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
          <ul>
            {primaryTopics.map((topic, index) => (
              // Only show the topic if it's the selected one or if no topic is selected
              (openIndex === null || openIndex === index) && (
                <li key={index} className="py-1 cursor-pointer">
                  <div
                    className={`${openIndex === index ? "text-green-200" : "text-gray-200"}`}
                    onClick={() => toggleSublist(index, topic)}
                  >
                    {topic.topic_text}
                  </div>
                  <hr className="w-full my-1 border-[#3a403e]" />
                  {openIndex === index && (
                    <ul className="mt-1 text-gray-400">
                      {loadingThemes ? (
                        <div>
                          <li className="text-gray-500">Loading primary themes...</li>
                          <hr className="w-full mx-auto my-1 border-[#3a403e]" />
                        </div>
                      ) : (
                        primaryThemes.length > 0 ? (
                          <>
                            {primaryThemes.map((theme, subIndex) => (
                              <li
                                key={`${index}-${subIndex}`}
                                className={`${subOpenIndex === subIndex ? "text-green-200 py-1" : "text-gray-200 py-1"}`}
                                onClick={() => toggleSubThemes(subIndex, theme)}
                              >
                                {theme.bi_gram_text}
                                <hr className="w-1/2 mx-auto my-1 border-[#3a403e]" />
                              </li>
                            ))}
                            <hr className="w-full mx-auto my-1 border-[#3a403e]" />
                          </>
                        ) : (
                          <li className="text-gray-500">No themes available</li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  const renderTriGramContent = () => (
    <>
      <h3 className={`font-julius-sans font-bold lg:text-xl text-lg py-1 ${selectedTheme ? 'text-zinc-100' : 'text-zinc-600'}`}>
        Sub-Themes
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          {selectedTheme ? (
            <ul>
              {subThemes.length > 0 ? (
                subThemes.map((theme, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${thematicOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleThematicTopics(index, theme)}
                    >
                      {theme.tri_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading sub-themes</li>
              )}
            </ul>
          ) : (
            <div>
              <p className="text-gray-500">Select a primary theme to view sub-themes</p>
            </div>
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
            <ul>
              {thematicTopics.length > 0 ? (
                thematicTopics.map((thematicTopic, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${contextOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleThematicContext(index, thematicTopic)}
                    >
                      {thematicTopic.four_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading thematic topics</li>
              )}
            </ul>
          ) : (
            <div>
              <p className="text-gray-500">Select a sub-theme to view thematic topics</p>
            </div>
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
            <ul>
              {thematicContexts.length > 0 ? (
                thematicContexts.map((thematicContext, index) => (
                  <li key={index} className="py-1 cursor-pointer">
                    <div
                      className={`${fiveGramOpenIndex === index ? "text-green-200" : "text-gray-200"}`}
                      onClick={() => toggleFiveGram(index, thematicContext)}
                    >
                      {thematicContext.five_gram_text}
                    </div>
                    <hr className="w-full my-1 border-[#3a403e]" />
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading thematic contexts</li>
              )}
            </ul>
          ) : (
            <div>
              <p className="text-gray-500">Select a thematic topic to view thematic contexts</p>
            </div>
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
