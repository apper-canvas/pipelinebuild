const Loading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="w-6 h-6 bg-slate-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-slate-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="w-32 h-6 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="w-48 h-3 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-16 h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="w-28 h-6 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="w-full h-3 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;