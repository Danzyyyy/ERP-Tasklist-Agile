export default function Skeleton() {
  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto animate-[fade_0.15s_ease]">
      <div className="w-[250px] h-7 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
      <div className="w-[390px] h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse my-2.5 mb-6" />
      <div className="h-[100px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse mb-4" />
      <div className="h-14 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-t-xl animate-pulse" />
      <div className="bg-white border border-slate-200 p-3 rounded-b-xl space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            className="h-11 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse"
            key={i}
          />
        ))}
      </div>
    </main>
  );
}
