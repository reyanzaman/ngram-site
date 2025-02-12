import Image from "next/image";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen lg:px-8 md:px-6 px-6 lg:pt-10 md:pt-8 pt-7 gap-16">
      <header className="w-full">
        <h1 className="font-julius-sans lg:text-4xl md:text-4xl text-3xl text-center font-bold">N-Gram Searching</h1>
        <h3 className="font-julius-sans lg:text-xl md:text-lg text-base text-center">on the Holy Quran</h3>
        <hr className="w-full lg:my-6 my-3 border-zinc-400"></hr>
      </header>

      <main className="flex flex-col items-center w-full lg:px-8 px-1 lg:py-6 pt-4 my-0">
        <div className="grid lg:grid-cols-4 grid-cols-1 lg:gap-6 gap-y-3 gap-x-3 w-full text-center">
          <div className="">
            <h3 className="font-julius-sans font-bold text-xl py-1 text-zinc-100">Bi-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded py-3">
              <div className="rounded lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                <ul className="">
                  <li className="py-1 text-green-200">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1</li>
                  <hr className="w-full my-1 border-[#3a403e]"></hr>
                  <li className="py-1">Some Text1</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-julius-sans font-bold text-xl py-1 text-zinc-600">Tri-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded py-3">
            <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                  <ul>
                    <li className="py-1">Some Text1</li>
                    <hr className="w-full my-1 border-[#3a403e]"></hr>
                    <li className="py-1">Some Text1</li>
                  </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-julius-sans font-bold text-xl py-1 text-zinc-600">Four-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded py-3">
              <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                <h1>Some Text4</h1>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-julius-sans font-bold text-xl py-1 text-zinc-600">Five-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded py-3">
              <div className="lg:p-4 p-3 lg:h-[30rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                <h1>Some Text5</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Result */}

        <div className="lg:py-8 py-4 w-full">
          <div>
            <h3 className="font-julius-sans font-bold text-xl py-1 text-zinc-300">Search Result (Ayats Found: 2)</h3>
            <div className="bg-[#1f2624] shadow-md rounded py-3">
              <div className="lg:px-4 px-3 lg:h-[20rem] h-[14rem] text-zinc-200 overflow-auto lg:text-lg text-base">
                  <div className="grid grid-cols-3 lg:gap-4 gap-2">
                    <div className="col-span-2">
                      <p className="font-bold text-xl">Ayat</p>
                      <hr className="w-full my-1 border-[#4a504e]"></hr>
                      <ul>
                        <li className="py-1 font-arabic text-green-200">بسم الله الرحمن الرحيم</li>
                        <hr className="w-full my-1 border-[#3a403e]"></hr>
                        <li className="py-1 font-arabic">يا ايها الذين امنوا</li>
                        <hr className="w-full my-1 border-[#3a403e]"></hr>
                      </ul>
                    </div>
                    <div>
                    <p className="font-bold text-xl text-center">Count</p>
                    <hr className="w-full my-1 border-[#4a504e]"></hr>
                      <ul className="text-center">
                        <li className="py-1 text-green-200">1</li>
                        <hr className="w-full my-1 border-[#3a403e]"></hr>
                        <li className="py-1">2</li>
                        <hr className="w-full my-1 border-[#3a403e]"></hr>
                      </ul>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}

        <div className="lg:mt-10 mt-8 lg:mb-8 mb-6 items-start w-full">
          <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500"></hr>
          <h1 className="lg:text-2xl text-xl font-julius-sans font-bold lg:pt-3 pt-1">Details of selected Ayat</h1>
          <hr className="w-full lg:mt-6 mt-4 mb-3 border-zinc-500"></hr>
          <div className="grid lg:grid-cols-2 grid-cols-1 pt-2 lg:gap-y-3 gap-y-3 gap-x-8">
            <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Selected N-Gram:</b> الله الرحمن</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Surah Name:</b> ABC</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Number</b>: 1</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>No. of Occurences:</b> 2</p>
            <p className="lg:text-lg text-sm font-julius-sans"><b>Ayat Translation:</b> In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
            <p className="lg:text-lg text-sm font-arabic"><b className="font-julius-sans">Ayat Text:</b> بسم الله الرحمن الرحيم</p>
            
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
