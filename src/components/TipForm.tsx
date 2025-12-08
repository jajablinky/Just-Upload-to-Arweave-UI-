import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ARTISTS = [
  { id: 'peter-caires', name: 'Peter Caires', tagline: 'Royal Society × BBC' },
  {
    id: 'artist-aurora',
    name: 'Aurora Fields',
    tagline: 'Generative soundscapes',
  },
  {
    id: 'artist-echo',
    name: 'Echo Lines',
    tagline: 'Long-form essays on the permaweb',
  },
] as const;

type ArtistId = (typeof ARTISTS)[number]['id'];

interface TipFormProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onTipSent?: (artistName: string) => void;
}

function TipForm({
  isWalletConnected,
  onConnectWallet,
  onTipSent,
}: TipFormProps) {
  const [amount, setAmount] = useState('');
  const [artistId, setArtistId] = useState<ArtistId>('peter-caires');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected || !amount || !artistId) return;

    const selectedArtist =
      ARTISTS.find(artist => artist.id === artistId) ?? ARTISTS[0];

    setIsSubmitting(true);
    setTimeout(() => {
      setAmount('');
      setIsSubmitting(false);
      if (onTipSent) onTipSent(selectedArtist.name);
    }, 1000);
  };

  const cardClasses =
    'bg-white border border-gray-200 rounded-lg p-6 md:p-7 w-full shadow-sm';
  const labelClasses =
    'block text-xs font-medium text-gray-700 mb-2 font-dm-sans';
  const buttonPrimaryClasses = 'w-full font-dm-sans text-base';

  if (!isWalletConnected) {
    return (
      <div className={cardClasses}>
        <h2 className="text-2xl font-dm-sans font-semibold mb-3 text-black">
          Connect Wallet
        </h2>
        <p className="text-gray-600 mb-6 text-sm font-dm-sans leading-relaxed">
          Connect your Arweave wallet to start sending tips securely and
          instantly.
        </p>
        <Button onClick={onConnectWallet} className={buttonPrimaryClasses}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <h2 className="text-2xl font-dm-sans font-semibold mb-6 text-black">
        Send a Tip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="amount" className={labelClasses}>
            Amount (AR)
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min={0}
              value={amount}
              onChange={event => setAmount(event.target.value)}
              placeholder="0.0"
              required
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-dm-sans text-sm">
              AR
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="artist" className={labelClasses}>
            Artist
          </label>
          <Select
            value={artistId}
            onValueChange={value => setArtistId(value as ArtistId)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an artist" />
            </SelectTrigger>
            <SelectContent>
              {ARTISTS.map(artist => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-gray-500 font-dm-sans">
            {ARTISTS.find(artist => artist.id === artistId)?.tagline}
          </p>
        </div>

        <Button
          type="submit"
          disabled={!amount || isSubmitting}
          className={`${buttonPrimaryClasses} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Sending…' : 'Send Tip'}
        </Button>
      </form>

      <div className="mt-5 flex justify-between items-center text-xs text-gray-500 font-dm-sans">
        <span>{isWalletConnected ? 'Wallet connected' : 'Not connected'}</span>
        <Button
          type="button"
          variant="ghost"
          className="h-auto px-0 py-0 text-xs text-gray-600 hover:text-black"
          onClick={() => onConnectWallet()}
        >
          {isWalletConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}

export default TipForm;
