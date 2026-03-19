function Header() {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-5 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-sm text-white">
        ✦
      </div>

      <div className="flex flex-col">
        <h1 className="text-sm font-semibold leading-tight">
          Cloud Architecture RAG model application
        </h1>
        <p className="text-sm text-gray-500">
          Ask questions about the trained knowledge base
        </p>
      </div>
    </div>
  );
}

export default Header;