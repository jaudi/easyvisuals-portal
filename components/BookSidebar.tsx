const books = [
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    desc: "The definitive book on value investing.",
    url: "https://www.amazon.co.uk/dp/0060555661?tag=financeplots-21",
    emoji: "📘",
  },
  {
    title: "One Up on Wall Street",
    author: "Peter Lynch",
    desc: "How to use what you know to make money in the market.",
    url: "https://www.amazon.co.uk/dp/0743200403?tag=financeplots-21",
    emoji: "📗",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    desc: "Timeless lessons on wealth, greed, and happiness.",
    url: "https://www.amazon.co.uk/dp/0857197681?tag=financeplots-21",
    emoji: "📙",
  },
];

export default function BookSidebar() {
  return (
    <div className="space-y-4">
      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Recommended Reading</p>
      {books.map((book) => (
        <a
          key={book.title}
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#0d1426] border border-gray-800 hover:border-blue-700/50 rounded-xl p-4 transition group"
        >
          <div className="text-2xl mb-2">{book.emoji}</div>
          <p className="text-white text-sm font-semibold group-hover:text-blue-300 transition leading-snug">{book.title}</p>
          <p className="text-gray-500 text-xs mt-0.5">{book.author}</p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">{book.desc}</p>
          <p className="text-blue-400 text-xs mt-2 font-medium">View on Amazon →</p>
        </a>
      ))}
      <p className="text-gray-600 text-xs leading-relaxed pt-1">
        These are affiliate links. If you buy, we earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}
