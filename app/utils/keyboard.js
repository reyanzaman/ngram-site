'use client';

import React from 'react';

const KEYS = [
  ['ض','ص','ق','ف','غ','ع','ه','خ','ح','ج'],
  ['ش','س','ي','ب','ل','ا','ت','ن','م','ك'],
  ['ظ','ط','ذ','د','ز','ر','و','ة','ث','ى'],
];

export default function ArabicKeyboard({ searchInput, setSearchInput }) {
  const handleKeyClick = (key) => {
    if (key === 'CLR') setSearchInput('');
    else if (key === 'DEL') setSearchInput((prev) => prev.slice(0, -1));
    else if (key === 'Space') setSearchInput((prev) => prev + ' ');
    else setSearchInput((prev) => prev + key);
  };

  return (
    <div className="arabic-keyboard-outer">
      <div className="arabic-keyboard">
        {KEYS.map((row, rowIdx) => (
          <div key={rowIdx} className="keyboard-row">
            {row.map((key, i) => (
              <button
                key={i}
                className="key"
                onClick={() => handleKeyClick(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        {/* Desktop: DEL, Space, CLR in same row. Mobile: only Space here */}
        <div className="keyboard-row special-row">
          <button
            className="key key-action del-desktop"
            onClick={() => handleKeyClick('DEL')}
            id="del-key"
          >
            DEL
          </button>
          <button
            className="key key-special"
            onClick={() => handleKeyClick('Space')}
          >
            Space
          </button>
          <button
            className="key key-action clr-desktop"
            onClick={() => handleKeyClick('CLR')}
            id="clr-key"
          >
            CLR
          </button>
        </div>
        {/* Mobile: DEL and CLR as small keys on their own row */}
        <div className="keyboard-row mobile-actions-row">
          <button
            className="key key-action"
            onClick={() => handleKeyClick('DEL')}
          >
            DEL
          </button>
          <button
            className="key key-action"
            onClick={() => handleKeyClick('CLR')}
          >
            CLR
          </button>
        </div>

        <style jsx>{`
          .arabic-keyboard-outer {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }
          .arabic-keyboard {
            width: 100%;
            max-width: 950px;
            background: #1e2b22;
            border-radius: 18px;
            box-shadow: 0 8px 48px #050c09cc, 0 0 0 2px #243b27 inset;
            padding: 22px 10px 18px;
            margin: 0 auto;
          }
          .keyboard-row {
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            gap: 7px;
            margin-bottom: 9px;
            justify-content: center;
          }
          .key {
            min-width: 52px;
            height: 42px;
            font-size: 22px;
            font-family: 'Cairo', 'Tajawal', sans-serif;
            color: #f3f7f2;
            background: linear-gradient(180deg,#233927 65%,#17231b 100%);
            border: 1.5px solid #445f47;
            border-radius: 7px;
            margin: 1.5px 2px;
            box-shadow: 0 2px 7px #040d0960, 0 0px 0 #fff inset;
            transition: 0.11s;
            cursor: pointer;
            font-weight: 700;
            flex: 1 0 52px;
            max-width: 92px;
          }
          .key:active {
            background: #233927;
            box-shadow: 0 1px 2px #080e0c;
          }
          .key:hover, .key-action:hover, .key-special:hover {
            background: #294a32;
            color: #e3ffd2;
            border-color: #5f916e;
            box-shadow: 0 4px 14px #15241e88;
          }
          .key-action {
            background: #204a3b;
            color: #ffb8b8;
            border: 2px solid #345548;
          }
          .key-special {
            min-width: 350px;
            background: #294a32;
            color: #dde8d5;
            font-size: 23px;
            flex: 1 1 350px;
            border-radius: 14px;
            margin-top: 4px;
          }
          .special-row {
            margin-top: 11px;
            justify-content: center;
            flex-direction: row;
          }
          .mobile-actions-row {
            display: none;
          }
          /* Hide DEL and CLR in special row on mobile, show mobile actions row */
          @media (max-width: 700px) {
            .arabic-keyboard {
              max-width: 100%;
              padding: 9px 2vw;
              border-radius: 7px;
            }
            .key, .key-special {
              font-size: 17px;
              min-width: 11vw;
              height: 38px;
              max-width: none;
            }
            .key-special {
              min-width: 58vw;
              font-size: 17px;
              border-radius: 7px;
            }
            .arabic-keyboard-outer {
              padding: 0 0.5vw;
            }
            .special-row .del-desktop,
            .special-row .clr-desktop {
              display: none !important;
            }
            .mobile-actions-row {
              display: flex !important;
              flex-direction: row-reverse;
              gap: 7px;
              margin-top: 0;
              margin-bottom: 9px;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </div>
  );
}