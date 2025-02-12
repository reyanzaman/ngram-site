import Image from "next/image";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen lg:px-8 md:px-6 px-6 lg:py-10 md:py-8 py-7 pb-20 gap-16">
      <header className="w-full">
        <h1 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="lg:text-4xl md:text-4xl text-3xl text-center font-bold">N-Gram Searching</h1>
        <h3 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="lg:text-xl md:text-lg text-base text-center">on the Holy Quran</h3>
        <hr className="w-full lg:my-6 my-3 border-zinc-400"></hr>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full lg:px-8 px-2 lg:py-10 py-6">
        <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-y-3 w-full text-center">
          <div>
            <h3 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="font-bold text-xl py-1 text-zinc-100">Bi-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded lg:p-6 p-3 lg:h-[40rem] h-[15rem] text-zinc-200 overflow-y-scroll overflow-x-auto lg:text-lg text-sm">
              <ul className="">
                <li className="py-1 text-nowrap text-green-200">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
                <li className="py-1 text-nowrap">Some Text1 Some Text1 Some Text1 Some Text1 Some Text1</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="font-bold text-xl py-1 text-zinc-500">Tri-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded lg:p-6 p-3 lg:h-[40rem] h-[15rem] text-zinc-200">
              <h1>Some Text3</h1>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="font-bold text-xl py-1 text-zinc-500">Four-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded lg:p-6 p-3 lg:h-[40rem] h-[15rem] text-zinc-200">
              <h1>Some Text4</h1>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Julius Sans One', sans-serif" }} className="font-bold text-xl py-1 text-zinc-500">Five-Gram</h3>
            <div className="bg-[#1f2624] shadow-md rounded lg:p-6 p-3 lg:h-[40rem] h-[15rem] text-zinc-200">
              <h1>Some Text5</h1>
            </div>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
