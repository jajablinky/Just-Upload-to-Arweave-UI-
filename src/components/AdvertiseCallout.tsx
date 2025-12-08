import { useState, type MouseEventHandler } from 'react';

const contactLink = 'https://x.com/messages/compose?recipient=jajablinky';

type AdvertiseCalloutProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function AdvertiseCallout({ onClick }: AdvertiseCalloutProps) {
  const [visible, setVisible] = useState(true);

  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.open(contactLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[32px] bg-linear-to-r from-[#f4ecff] to-[#d6e2ff] px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.35)] ring-1 ring-white/40 backdrop-blur">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
        <i
          className="bx bx-show text-xl text-slate-700"
          aria-hidden="true"
          role="presentation"
        />
      </span>

      <div className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.4em] text-slate-900">
        <span className="text-[10px] text-slate-600 tracking-[0.3em]">
          Want to
        </span>
        <span className="text-xs font-semibold tracking-[0.2em]">
          advertise here?
        </span>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="shrink-0 rounded-full bg-white px-4 py-1 text-[11px] font-semibold tracking-[0.3em] text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Check it out
      </button>

      <button
        type="button"
        aria-label="Close advertising callout"
        onClick={() => setVisible(false)}
        className="text-xl text-slate-500 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        <i className="bx bx-x" aria-hidden="true" />
      </button>
    </div>
  );
}

export default AdvertiseCallout;
