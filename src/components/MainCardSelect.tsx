

export default function Card({
    name,
    src
}: {
    name: string;
    src: any
}) {

    return (
        <div 
            className="bg-secondary w-auto flex flex-row items-center h-auto p-3 rounded hover:cursor-pointer"
            onClick={() => {
                return window.location.href = `/#/game?type=${name.toLowerCase()}`
            }}
        >
            <img src={src} className="w-10 h-10" />
            <p className="pl-2 text-accent text-lg font-semibold">
                {name}
            </p>
        </div>
    )
}