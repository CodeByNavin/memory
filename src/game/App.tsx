import { useEffect, useState } from "react";

interface Card {
  key: string;
  src: string;
  id: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Game() {
  const imageMap: Record<string, any> = import.meta.glob(`/src/assets/**/*`, {
    eager: true,
    import: 'default',
  });

  const [gameType, setGameType] = useState<string | null>(null);
  const [cardArray, setCardArray] = useState<Card[] | null>(null);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);

  const handleCardClick = (id: string) => {
    console.log(id)
    setFlippedCardIds((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
    console.log(flippedCardIds)
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameParam = urlParams.get('type');
    setGameType(gameParam);
  }, []);

  useEffect(() => {
    if (gameType) {
      const filteredCards: Card[] = [];

      for (const key in imageMap) {
        if (imageMap.hasOwnProperty(key) && key.includes(gameType)) {
          filteredCards.push({ key, src: imageMap[key], id: key });
        }
      }

      // Duplicate and give unique IDs
      const duplicatedCards: Card[] = filteredCards.flatMap((card) => [
        { ...card, id: `${card.key}-1` },
        { ...card, id: `${card.key}-2` },
      ]);

      const shuffledCards = shuffleArray(duplicatedCards);
      setCardArray(shuffledCards);
    }
  }, [gameType]);


  return (
    <main className="bg-primary justify-between h-screen flex-col flex">
      <div className="px-5 flex flex-col items-center justify-between text-wrap">

        <h1 className="text-accent text-3xl font-semibold p-4">Memory Game</h1>

        <div className="flex-grow text-center">
          <div>
            {gameType ? <p className="text-secondary">Game Type: {gameType}</p> : <p>No game type specified.</p>}
            {cardArray ? (
              <div className="flex justify-center w-full">
                <div className="grid grid-cols-4 gap-4 p-4">
                  {cardArray.map((card) => {
                    const isFlipped = flippedCardIds.includes(card.id);

                    return (
                      <div key={card.id} onClick={() => handleCardClick(card.id)}
                        className="flex justify-center items-center">
                        <div
                          className="perspective w-28 h-36 cursor-pointer"
                        >
                          <div
                            className={`relative w-full h-full transition-transform duration-500 transform preserve-3d ${isFlipped ? 'rotate-x-180' : ''
                              }`}
                          >
                            {/* Front */}
                            <div className="absolute w-full h-full backface-hidden bg-gray-400 rounded-lg flex justify-center items-center shadow-md">
                              <span className="text-white text-xl">?</span>
                            </div>

                            {/* Back */}
                            <div className="absolute w-full h-full backface-hidden bg-gray-400 rounded-lg flex justify-center items-center shadow-md transform rotate-x-180">
                              <img
                                src={card.src}
                                alt="Card Image"
                                className="object-cover w-10` h-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            ) : (
              <p>No card map data available.</p>
            )}
          </div>
        </div>
      </div>


      <footer className="bg-secondary text-white text-center p-4 w-full">
        © 2025 My Memory Game
        <p>
          Made By <a href="https://codebynavin.me/">
            Navin
          </a>
        </p>
      </footer>
    </main>
  );
};
