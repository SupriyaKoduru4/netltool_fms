function CountCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-col gap-3 bg-[#E5E5EA] border border-gray-200 rounded-xl p-5 w-full shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
        {title}
      </p>
      <p className="text-3xl font-semibold text-gray-900 tracking-tight">
        {count.toLocaleString()}
      </p>
    </div>
  );
}

export default CountCard;