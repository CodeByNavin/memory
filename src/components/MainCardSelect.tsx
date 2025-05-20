
const imageMap: Record<string, any> = import.meta.glob('/src/assets/**/*', {
    eager: true,
    import: 'default',
});

export default function Card({
    name,
    src
}: {
    name: string;
    src: any
}) {

    const normalizedImagePath = '/src/' + src.replace(/^\.\//, '');
    const imageSrc = imageMap[normalizedImagePath];

    if (!imageSrc) {
        console.warn(`Image not found: ${normalizedImagePath}`);
        return <div>Image not found</div>; // Or a placeholder
    }

    return (
        <div 
            className="bg-secondary w-auto flex flex-row items-center h-auto p-3 rounded hover:cursor-pointer"
            onClick={() => {
                return window.location.href = `/game?type=${name.toLowerCase()}`
            }}
        >
            <img src={imageSrc} className="w-10 h-10" />
            <p className="pl-2 text-accent text-lg font-semibold">
                {name}
            </p>
        </div>
    )
}