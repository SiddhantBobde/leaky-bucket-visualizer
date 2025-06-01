export default function TokenButton({ onClick }) {
    return (
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={onClick}
        >
            Send Request
        </button>
    );
}
