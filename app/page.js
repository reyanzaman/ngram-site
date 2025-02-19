"use client";

import React, { useState } from 'react';
import { GrFormNext, GrFormPrevious  } from "react-icons/gr";

export default function Home() {

  const [openIndex, setOpenIndex] = useState(null);
  const [gramState, setGramState] = React.useState('bi-gram');

  const toggleSublist = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const one_grams = [
    {
      label: "الله",
      subcategories: ["سم الرحيم", "سم الله", "الرحمن الرحيم"]
    },
    {
      label: "الْحَمْدُ",
      subcategories: ["رَبِّ الْعَالَمِينَ", "الرَّحْمَٰنِ", "الرَّحِيمِ"]
    },
    {
      label: "اله",
      subcategories: ["سم الرحيم", "سم الله", "الرحمن الرحيم"]
    },
    {
      label: "مْدُ",
      subcategories: ["رَبِّ الْعلَمِينَ", "الحْمَٰنِ", "الحِيمِ"]
    }
  ];

  // Components

  const renderBiGramContent = () => (
    <>
      <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-100">Primary Theme</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="rounded lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          <ul className="">
            {one_grams.map((category, index) => (
              <li key={index} className="py-1 cursor-pointer">
                <div
                  className={`${
                    openIndex === index ? "text-green-200" : "text-gray-200"
                  }`}
                  onClick={() => toggleSublist(index)}
                >
                  {category.label}
                </div>
                <hr className="w-full my-1 border-[#3a403e]" />
                {openIndex === index && (
                  <ul className="mt-1 text-gray-400">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li key={`${index}-${subIndex}`} className="py-1">
                        {subcategory}
                        <hr className="w-1/2 mx-auto my-1 border-[#3a403e]" />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );  

  const renderTriGramContent = () => (
    <>
      <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-600">
        Sub-Themes
      </h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          <ul>
            <li className="py-1">الرحيم</li>
            <hr className="w-full my-1 border-[#3a403e]" />
            <li className="py-1">الْعلَمِينَ</li>
            <hr className="w-full my-1 border-[#3a403e]" />
          </ul>
        </div>
      </div>
    </>
  );

  const renderFourGramContent = () => (
    <>
      <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-600">Thematic Topics</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          <h1>الرحمن الم</h1>
          <hr className="w-full my-1 border-[#3a403e]"></hr>
          <h1>المالرَّحِيمِ</h1>
          <hr className="w-full my-1 border-[#3a403e]"></hr>
        </div>
      </div>
    </>
  );

  const renderFiveGramContent = () => (
    <>
      <h3 className="font-julius-sans font-bold lg:text-xl text-lg py-1 text-zinc-600">Thematic Context</h3>
      <div className="bg-[#1f2624] shadow-md rounded py-3">
        <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
          <h1>الرحيم الرحمن</h1>
          <hr className="w-full my-1 border-[#3a403e]"></hr>
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
        <GrFormPrevious className="text-xl"/> Back 
      </div>
    </button>
  );

  return (
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
                <div className="grid grid-cols-3 lg:gap-4 gap-2">
                  <div className="col-span-2">
                    <p className="font-bold lg:text-xl text-sm">Ayat</p>
                    <hr className="w-full my-1 border-[#4a504e]"></hr>
                    <ul>
                      <li className="py-1 font-arabic text-green-200 lg:text-xl text-sm">بسم الله الرحمن الرحيم</li>
                      <hr className="w-full my-1 border-[#3a403e]"></hr>
                      <li className="py-1 font-arabic lg:text-xl text-sm">يا ايها الذين امنوا</li>
                      <hr className="w-full my-1 border-[#3a403e]"></hr>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold lg:text-xl text-sm text-center">Count</p>
                    <hr className="w-full my-1 border-[#4a504e]"></hr>
                    <ul className="text-center">
                      <li className="py-1 text-green-200 lg:text-xl text-sm">1</li>
                      <hr className="w-full my-1 border-[#3a403e]"></hr>
                      <li className="py-1 lg:text-xl text-sm">2</li>
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
            <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Selected N-Gram : </b>الله الرحمن</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Surah Name : </b>Yusuf - Prophet Joseph (12)</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Number : </b>1</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>No. of Occurences : </b> 2</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Translation : </b> In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
            <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Ayat Text : </b> بسم الله الرحمن الرحيم</p>

          </div>
        </div>

      </main>

      <footer className="items-center justify-center w-full m-0 p-0 text-center">
        <hr className="w-full lg:mt-6 mt-6 mb-3 border-zinc-400"></hr>
        <p className="p-0 mb-3 lg:text-sm text-xs">&copy; PhD Research Project of Nazia Nishat</p>
      </footer>
    </div>
  );
}
