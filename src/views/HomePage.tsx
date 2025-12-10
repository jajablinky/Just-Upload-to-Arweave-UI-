import { useEffect, useState, type MouseEvent } from 'react';
import UploadForm from '../components/UploadForm';
import WalletConnectModal from '../components/WalletConnectModal';
import AdvertiseCallout from '../components/AdvertiseCallout';
import RippleEffect from '../components/RippleEffect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import backgroundFrame from '../resources/background-frame.png';
import logoImage from '../resources/just-upload-to-arweave.png';

function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showArtistCursor, setShowArtistCursor] = useState(false);
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadTxId, setUploadTxId] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [ripplePosition, setRipplePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showRipple, setShowRipple] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { toast } = useToast();

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

  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!showArtistCursor) return;

    const centerX = circlePos.x - 20;
    const centerY = circlePos.y - 20;
    const radius = 60;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      window.open('https://petercaires.com', '_blank', 'noopener,noreferrer');
    }
  };

  const handleUploadSuccess = (txId: string, url: string) => {
    setUploadTxId(txId);
    setUploadUrl(url);
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Get drop position for ripple effect
      const dropX = e.clientX;
      const dropY = e.clientY;
      setRipplePosition({ x: dropX, y: dropY });
      setShowRipple(true);

      // Show toast notification
      toast({
        title: 'File ready to be uploaded',
        description: files[0].name,
      });

      setDroppedFile(files[0]);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleBackgroundLeave}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBackgroundClick}
    >
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src={backgroundFrame}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          src="https://arweave.net/69BbTwr1jAexNoNBLqGPJnqNLgb8JaU5GSb3fQvZQRA"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div
        className="relative z-10 min-h-screen flex flex-col p-6 md:p-12"
        onMouseEnter={handleBackgroundEnter}
        onMouseLeave={handleBackgroundLeave}
      >
        <img
          src={logoImage}
          alt="Just upload to arweave"
          className="fixed top-6 left-1/2 -translate-x-1/2 h-20 md:h-24 opacity-60 invert pointer-events-none z-20 brightness-10"
        />
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div
            className="w-full max-w-[480px] flex flex-col gap-8"
            onMouseEnter={handlePanelEnter}
            onMouseLeave={handlePanelLeave}
          >
            <UploadForm
              isWalletConnected={isWalletConnected}
              onConnectWallet={handleConnectClick}
              onUploadSuccess={handleUploadSuccess}
              wallet={wallet?.data || wallet}
              droppedFile={droppedFile}
            />
          </div>

          <div className="hidden md:flex flex-col items-end justify-center flex-1">
            <div className="max-w-xs text-right text-white/80 font-roboto-mono space-y-2">
              <p className="text-xs tracking-[0.18em] uppercase text-white/60">
                Peter Caires
              </p>
              <p className="text-sm text-white/70">Royal Society x BBC</p>
              <p className="text-white">
                “The Man who tried to eat every animal.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {showArtistCursor && (
        <div className="pointer-events-none fixed inset-0 z-20">
          <div
            className="absolute flex items-center justify-center rounded-full text-base md:text-sm text-black bg-white/70"
            style={{
              left: circlePos.x,
              top: circlePos.y,
              width: 120,
              height: 120,
              marginLeft: -80,
              marginTop: -80,
            }}
          >
            <span className="text-center">View Artist</span>
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
              Upload successful
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 font-roboto-mono">
              {uploadUrl
                ? 'Your file is live on Arweave.'
                : 'Your file has been uploaded to Arweave successfully.'}
            </DialogDescription>
            {uploadUrl && (
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

      <AdvertiseCallout />

      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-12 py-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <i
                className="bx bx-cloud-upload text-6xl text-gray-400"
                aria-hidden="true"
              />
              <p className="text-2xl font-dm-sans font-semibold text-gray-900">
                Drop to upload
              </p>
            </div>
          </div>
        </div>
      )}

      {showRipple && ripplePosition && (
        <RippleEffect
          x={ripplePosition.x}
          y={ripplePosition.y}
          onComplete={() => {
            setShowRipple(false);
            setRipplePosition(null);
          }}
        />
      )}
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
