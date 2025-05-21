import { useEffect, useState } from 'react';

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
  const [gameType, setGameType] = useState<string | null>(null);
  const [cardArray, setCardArray] = useState<Card[] | null>(null);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [correct, setCorrect] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the game type from the URL
  useEffect(() => {
    console.log('useEffect: Getting game type from URL');
    const queryString = window.location.href.split('?')[1];
    const urlParams = new URLSearchParams(queryString);
    const gameParam = urlParams.get('type');
    setGameType(gameParam);
    console.log('useEffect: Game type set to:', gameParam);
  }, []);

  // Load images based on game type
  useEffect(() => {
    if (!gameType) {
      console.log('useEffect: No game type, skipping image loading');
      return;
    }

    console.log('useEffect: Loading images for game type:', gameType);

    fetch('/assets-manifest.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const files = data[gameType];

        if (!files) {
          setError(`No images found for game type: ${gameType}`);
          setCardArray(null);
          return;
        }

        const cards = files.map((file: any, index: number) => ({
          key: `${file}-${index}`,
          src: `/assets/${gameType}/${file}`,
          id: `${file}-${index}`,
        }));

        const duplicatedCards = cards.flatMap((card: { id: any; }) => [
          { ...card, id: `${card.id}-1` },
          { ...card, id: `${card.id}-2` },
        ]);

        setCardArray(shuffleArray(duplicatedCards));
        setError(null); // Clear any previous errors
      })
      .catch((err: any) => {
        console.error('Error loading images:', err);
        setError(
          `Failed to load images for game type: ${gameType}. ${err.message}`
        );
        setCardArray(null);
      });
  }, [gameType]);

  // Check if all cards are flipped
  useEffect(() => {
    if (!cardArray) {
      console.log('useEffect: cardArray is null, skipping win check');
      return;
    }
    if (correct.length / 2 === cardArray.length / 2) {
      setTimeout(() => {
        setFlippedCardIds([]);
        setGameOver(true);
      }, 500);
      console.log('Game Completed');
    }
  }, [correct, cardArray]);

  // Handle card click
  const handleCardClick = (id: string) => {
    if (correct.includes(id)) return;
    if (flippedCardIds.includes(id)) return;

    setFlippedCardIds((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  // Check if two cards are flipped
  useEffect(() => {
    if (flippedCardIds.length < 2) return;
    if (flippedCardIds.length > 2) {
      console.warn('All cards being unflipped. Storage length is more than 2');
      setFlippedCardIds([]);
      return;
    }

    const tempArray = [...flippedCardIds];
    const simplifiedIds = tempArray.map((id) => id.split('-')?.[0]);

    if (simplifiedIds[0] === simplifiedIds[1]) {
      console.log('Correct');
      setCorrect((prev) => [...prev, ...flippedCardIds]);
      setFlippedCardIds([]);
    } else {
      console.log('Incorrect');
      setTimeout(() => {
        setFlippedCardIds([]);
      }, 500);
    }
  }, [flippedCardIds]);

  return (
    <main className="bg-primary justify-between h-screen flex-col flex">
      <div className="px-5 flex flex-col items-center justify-between text-wrap">
        <h1 className="text-accent text-3xl font-semibold p-4">Memory Game</h1>

        <div className="flex-grow text-center">
          <div>
            {gameType ? (
              <p className="text-secondary">
                Game Type:{' '}
                {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
              </p>
            ) : (
              <p>No game type specified.</p>
            )}

            <span className="text-secondary">
              Score: {correct.length / 2} / {cardArray ? cardArray.length / 2 : 0}
            </span>

            {error ? (
              <div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="bg-accent hover:cursor-pointer text-white px-4 py-2 rounded mt-4 ml-4"
                >
                  Go to Home
                </button>
              </div>
            ) : cardArray ? (
              <>
                {gameOver ? (
                  <div>
                    <p className="text-secondary">Game Over! You won!</p>
                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="bg-accent hover:cursor-pointer text-white px-4 py-2 rounded mt-4"
                    >
                      Restart Game
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/';
                      }}
                      className="bg-accent hover:cursor-pointer text-white px-4 py-2 rounded mt-4 ml-4"
                    >
                      Go to Home
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center w-full">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {cardArray.map((card) => {
                        const isFlipped =
                          flippedCardIds.includes(card.id) ||
                          correct.includes(card.id);

                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className="flex justify-center items-center"
                          >
                            <div className="perspective w-28 h-36 cursor-pointer">
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
                                    alt="Card"
                                    className="object-cover w-10 h-10"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p>Loading card data...</p>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-secondary text-white text-center p-4 w-full">
        © 2025 My Memory Game
        <p>
          Made By{' '}
          <a href="https://codebynavin.me/" className="underline">
            Navin
          </a>
        </p>
      </footer>
    </main>
  );
}
