import Card from "../components/MainCardSelect";

export default function MainPage() {
  return (
    <main className="bg-primary h-screen justify-between flex-col flex">
      <div className="px-5 flex flex-col items-center justify-between text-wrap">

        <h1 className="text-accent text-3xl font-semibold p-4">Memory Game</h1>
        <p className="text-white">
          Welcome to the memory game, to get started pick from one of the available options below:
        </p>


        <div className="flex-grow">
          <Card name="Ocean" src="./assets/ocean/turtle.png" />
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