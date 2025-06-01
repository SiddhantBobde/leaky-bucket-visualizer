export default function Bucket({ tokens, maxTokens }) {
    const filled = Math.round(tokens);
    const empty = maxTokens - filled;

    return (
        <div className="mt-6 flex gap-6 items-center">
            <h2 className="font-semibold mb-2">Bucket</h2>
            <div className="flex gap-1">
                {Array.from({ length: filled }).map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-blue-500 rounded"></div>
                ))}
                {Array.from({ length: empty }).map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-300 rounded"></div>
                ))}
            </div>
        </div>
    );
}
