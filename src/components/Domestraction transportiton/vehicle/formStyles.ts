// Centralized styling tokens for every vehicle detail form so the UI
// stays visually consistent with the latest design reference.
export const vehicleFormStyles = {
  card: 'rounded-[30px] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]',
  panel: 'rounded-[26px] border border-slate-100 bg-slate-50/60 p-6',
  imageCard:
    'flex h-36 w-36 items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)]',
  pillInput:
    'w-full rounded-[22px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
  pillStatic:
    'w-full rounded-[22px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500',
  uploadButton:
    'flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_16px_35px_rgba(15,23,42,0.12)] transition-all hover:border-blue-400 hover:text-blue-600',
  select:
    'w-full appearance-none rounded-[22px] border border-slate-200 bg-white px-5 py-3 pr-12 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
  circleButton:
    'flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.1)] transition-all hover:border-blue-500 hover:text-blue-600',
  ghostButton:
    'rounded-[22px] border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition-all hover:border-blue-400 hover:text-blue-600',
  primaryButton:
    'rounded-[22px] bg-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600',
  badge:
    'rounded-[18px] border border-slate-100 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.06)]',
};

export type VehicleFormStyleKey = keyof typeof vehicleFormStyles;
