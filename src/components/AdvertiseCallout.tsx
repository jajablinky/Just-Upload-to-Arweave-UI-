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
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 flex items-center justify-between gap-24 rounded-lg bg-linear-to-r from-[#fff9ec] to-[#d6e2ff] px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.35)] ring-1 ring-white/40 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90">
          <i
            className="bx bx-show text-xl text-slate-700"
            aria-hidden="true"
            role="presentation"
          />
        </span>

        <div className="flex flex-col text-[11px] text-slate-900">
          <span className="text-[10px] text-slate-600">Want to</span>
          <span className="text-xs font-semibold">advertise here?</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 rounded bg-white px-4 py-1 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Get in contact{' '}
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
    </div>
  );
}

export default AdvertiseCallout;
