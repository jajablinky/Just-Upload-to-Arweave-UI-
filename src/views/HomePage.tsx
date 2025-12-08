import { useEffect, useState, type MouseEvent } from 'react';
import TipForm from '../components/TipForm';
import UploadForm from '../components/UploadForm';
import WalletConnectModal from '../components/WalletConnectModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showArtistCursor, setShowArtistCursor] = useState(false);
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastArtist, setLastArtist] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<'tip' | 'upload'>('tip');
  const [uploadTxId, setUploadTxId] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (walletType: 'wander') => {
    try {
      if (walletType === 'wander') {
        if (typeof window !== 'undefined' && (window as any).arweaveWallet) {
          await (window as any).arweaveWallet.connect([
            'ACCESS_ADDRESS',
            'SIGN_TRANSACTION',
          ]);
          const address = await (
            window as any
          ).arweaveWallet.getActiveAddress();
          setWallet({ type: 'wander', address });
          setIsWalletConnected(true);
        } else {
          alert(
            'Wander extension not found. Please install it from https://wander.app'
          );
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setIsWalletConnected(false);
  };

  const handleConnectClick = () => {
    if (isWalletConnected) {
      handleDisconnect();
    } else {
      handleConnectWallet();
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    setCursorPos({ x: event.clientX, y: event.clientY });
  };

  const handleBackgroundEnter = () => {
    setShowArtistCursor(true);
  };

  const handleBackgroundLeave = () => {
    setShowArtistCursor(false);
  };

  const handlePanelEnter = () => {
    setShowArtistCursor(false);
  };

  const handlePanelLeave = () => {
    setShowArtistCursor(true);
  };

  const handleTipSuccess = (artistName: string) => {
    setLastArtist(artistName);
    setSuccessType('tip');
    setShowSuccess(true);
    setShowArtistCursor(false);
  };

  const handleUploadSuccess = (txId: string, url: string) => {
    setUploadTxId(txId);
    setUploadUrl(url);
    setSuccessType('upload');
    setShowSuccess(true);
    setShowArtistCursor(false);
  };

  useEffect(() => {
    if (!showArtistCursor) return;
    const id = window.requestAnimationFrame(() => {
      setCirclePos(previous => ({
        x: previous.x + (cursorPos.x - previous.x) * 0.15,
        y: previous.y + (cursorPos.y - previous.y) * 0.15,
      }));
    });
    return () => window.cancelAnimationFrame(id);
  }, [cursorPos, showArtistCursor]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleBackgroundLeave}
    >
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div
        className="relative z-10 min-h-screen flex flex-col p-6 md:p-12"
        onMouseEnter={handleBackgroundEnter}
        onMouseLeave={handleBackgroundLeave}
      >
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div
            className="w-full max-w-[480px] flex flex-col gap-8"
            onMouseEnter={handlePanelEnter}
            onMouseLeave={handlePanelLeave}
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-dm-sans font-semibold text-white mb-3">
                Just A Tip.
              </h1>
              <p className="text-base md:text-lg text-white/80 font-dm-sans">
                The simplest way to tip on Arweave.
              </p>
            </div>

            <Tabs defaultValue="tip" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6">
                <TabsTrigger
                  value="tip"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 font-dm-sans text-sm"
                >
                  Tip
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 font-dm-sans text-sm"
                >
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tip" className="mt-0">
                <TipForm
                  isWalletConnected={isWalletConnected}
                  onConnectWallet={handleConnectClick}
                  onTipSent={handleTipSuccess}
                />
              </TabsContent>
              <TabsContent value="upload" className="mt-0">
                <UploadForm
                  isWalletConnected={isWalletConnected}
                  onConnectWallet={handleConnectClick}
                  onUploadSuccess={handleUploadSuccess}
                  wallet={wallet?.data || wallet}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden md:flex flex-col items-end justify-center flex-1">
            <div className="max-w-xs text-right text-white/80 font-roboto-mono space-y-2">
              <p className="text-xs tracking-[0.18em] uppercase text-white/60">
                Peter Caires
              </p>
              <p className="text-sm text-white/70">Royal Society × BBC</p>
              <p className="text-base md:text-lg text-white">
                “The man who tried to eat everything”
              </p>
            </div>
          </div>
        </div>
      </div>

      {showArtistCursor && (
        <div className="pointer-events-none fixed inset-0 z-20">
          <div
            className="absolute flex items-center font-roboto-monojustify-center rounded-full text-[12px] md:text-sm tracking-[0.18em] uppercase text-black bg-white/90"
            style={{
              left: circlePos.x,
              top: circlePos.y,
              width: 160,
              height: 160,
              marginLeft: -80,
              marginTop: -80,
            }}
          >
            <span className="text-center">Check out Artist</span>
          </div>
        </div>
      )}

      {showSuccess && <ConfettiBurst />}

      <Dialog
        open={showSuccess}
        onOpenChange={(open: boolean) => setShowSuccess(open)}
      >
        <DialogContent className="max-w-sm bg-white text-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-dm-sans font-semibold text-gray-900">
              {successType === 'tip' ? 'Tip sent' : 'Upload successful'}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 font-roboto-mono">
              {successType === 'tip'
                ? lastArtist
                  ? `Your tip to ${lastArtist} was submitted.`
                  : 'Your tip was submitted.'
                : uploadUrl
                ? `Your file has been uploaded to Arweave successfully.`
                : 'Your file has been uploaded to Arweave successfully.'}
            </DialogDescription>
            {successType === 'upload' && uploadUrl && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 font-dm-sans mb-1">
                  Transaction ID:
                </p>
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black hover:underline font-dm-sans break-all"
                >
                  {uploadTxId}
                </a>
              </div>
            )}
          </DialogHeader>
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="px-6 py-3 rounded-lg font-dm-sans text-sm"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WalletConnectModal
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
        onWalletSelect={handleWalletSelect}
      />
    </div>
  );
}

export default HomePage;

function ConfettiBurst() {
  const pieces = Array.from({ length: 140 });

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.2;
        const duration = 2 + Math.random() * 1.5;
        const size = 6 + Math.random() * 6;
        const colors = [
          '#f97316',
          '#22c55e',
          '#38bdf8',
          '#eab308',
          '#ec4899',
          '#a855f7',
        ];
        const color = colors[index % colors.length];

        return (
          <span
            key={index}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}
