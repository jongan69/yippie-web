import React, { useState } from 'react';
import { Rnd } from "react-rnd";

const EmojiList = ({ elementRef }: any) => {
    const [emojis, setEmojis] = useState<any>([]);

    const emojiList = [
        '/assets/emoji1.png',
        '/assets/emoji2.png',
        '/assets/emoji3.png',
        '/assets/emoji4.png',
        '/assets/emoji5.png',
        '/assets/emoji6.png',
        '/assets/emoji7.png',
        // Add more emoji paths as needed
    ];

    const addEmoji = (emojiSrc: string) => {
        const newEmoji = {
            id: emojis.length,
            src: emojiSrc,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
        };
        setEmojis([...emojis, newEmoji]);
    };

    const updateEmoji = (index: any, updates: { x: any; y: any; }) => {
        const updatedEmojis = [...emojis];
        updatedEmojis[index] = { ...updatedEmojis[index], ...updates };
        setEmojis(updatedEmojis);
    };

    return (
        <div className="emoji-selector">
            {emojis.map((emoji: { id: any; width: any; height: any; x: any; y: any; src: string | undefined; }, index: any) => (
        <Rnd
          key={emoji.id}
          size={{ width: emoji.width, height: emoji.height }}
          position={{ x: emoji.x, y: emoji.y }}
          onDragStop={(e: any, d: { x: any; y: any; }) => updateEmoji(index, { x: d.x, y: d.y })}
          onResizeStop={(e: any, direction: any, ref: { offsetWidth: any; offsetHeight: any; }, delta: any, position: any) => updateEmoji(index, {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position
          })}
          enableResizing={{
            top: true, right: true, bottom: true, left: true,
            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
          }}
        >
          <img src={emoji.src} alt={`Emoji`} style={{ width: '100%', height: '100%' }} />
        </Rnd>
      ))}
            {emojiList.map((emoji, index) => (
                <img key={index} src={emoji} alt={`Emoji ${index}`} onClick={() => addEmoji(emoji)} style={{ width: 50, height: 50, cursor: 'pointer', margin: 5 }} />
            ))}
        </div>
    );
};

export default EmojiList;