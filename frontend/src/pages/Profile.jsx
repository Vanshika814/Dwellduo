export default function Profile() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const inputBase =
    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-50 px-4 py-12">
      <div className="w-full max-w-4xl rounded-3xl border border-white/70 bg-white/90 p-6 sm:p-10 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500">
              Profile
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Build your roommate profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
              Share who you are and how you live so we can match you with your ideal roommate.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full border border-white bg-gradient-to-br from-sky-300 via-violet-300 to-fuchsia-300 shadow" />
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
            >
              Change photo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-500 mb-1">
                Full name
              </label>
              <input id="name" name="name" type="text" className={inputBase} placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="age" className="block text-xs font-medium text-slate-500 mb-1">
                Age
              </label>
              <input id="age" name="age" type="number" className={inputBase} placeholder="24" />
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1">
                City
              </label>
              <input id="city" name="city" type="text" className={inputBase} placeholder="Mumbai" />
            </div>
            <div>
              <label
                htmlFor="occupation"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Occupation
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                className={inputBase}
                placeholder="Designer, Student, Engineer..."
              />
            </div>
          </section>

          <section>
            <label htmlFor="bio" className="block text-xs font-medium text-slate-500 mb-1">
              About you
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className={`${inputBase} min-h-[120px]`}
              placeholder="Tell potential roommates about your lifestyle, schedule, and what you’re looking for."
            />
          </section>

          <section>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Interests & vibe
            </label>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {["Early bird", "Night owl", "Clean & tidy", "Music lover", "Gym", "Cooking"].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 hover:border-sky-200 hover:text-sky-500"
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
            >
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

