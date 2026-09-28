import React from 'react';

export const CardSkeleton = () => (
  <div aria-hidden="true" className="flex animate-pulse flex-col gap-4 rounded-3xl bg-white/60 p-6 dark:bg-white/[.05]">
    <div className="h-44 w-full rounded-2xl bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-6 w-3/4 rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-4 w-full rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-4 w-2/3 rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 w-16 rounded-full bg-black/[.06] dark:bg-white/[.08]"></div>
      <div className="h-6 w-20 rounded-full bg-black/[.06] dark:bg-white/[.08]"></div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div aria-hidden="true" className="flex animate-pulse flex-col items-center gap-4 rounded-3xl bg-white/60 p-6 text-center dark:bg-white/[.05]">
    <div className="h-24 w-24 rounded-full bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-6 w-48 rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-4 w-32 rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-12 w-full rounded-md bg-black/[.06] dark:bg-white/[.08]"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <div aria-hidden="true" className="flex animate-pulse items-center justify-between gap-4 rounded-xl bg-white/50 p-4 dark:bg-white/[.05]">
    <div className="flex items-center gap-3 w-1/3">
      <div className="h-10 w-10 rounded-full bg-black/[.06] dark:bg-white/[.08]"></div>
      <div className="h-5 w-28 rounded bg-black/[.06] dark:bg-white/[.08]"></div>
    </div>
    <div className="h-5 w-20 rounded bg-black/[.06] dark:bg-white/[.08]"></div>
    <div className="h-8 w-24 rounded-lg bg-black/[.06] dark:bg-white/[.08]"></div>
  </div>
);
