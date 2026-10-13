/** Suspense fallback for the reservation page: three field skeletons and a button placeholder. */
export function ReservationLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="relative w-full bg-background">
      <span className="sr-only">Đang tải thông tin đặt bàn…</span>
      <div className="w-full section-pad">
        <div className="flex flex-col gap-4 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-24 sm:pb-28 md:pb-32">
          <div className="flex flex-col gap-10 motion-safe:animate-pulse">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="h-3 w-16 bg-surface" />
                <div className="h-12 w-full border-b border-border" />
              </div>
            ))}
            <div className="flex justify-end pt-6">
              <div className="h-12 w-40 bg-surface" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
