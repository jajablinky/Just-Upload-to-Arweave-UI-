import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletSelect: (walletType: 'wander') => void;
}

function WalletConnectModal({
  open,
  onOpenChange,
  onWalletSelect,
}: WalletConnectModalProps) {
  const handleWander = async () => {
    if (typeof window !== 'undefined' && (window as any).arweaveWallet) {
      try {
        await (window as any).arweaveWallet.connect([
          'ACCESS_ADDRESS',
          'SIGN_TRANSACTION',
        ]);
        onWalletSelect('wander');
        onOpenChange(false);
      } catch (error) {
        console.error('Wander connection error:', error);
        alert('Failed to connect Wander. Please try again.');
      }
    } else {
      alert(
        'Wander extension not found. Please install it from https://wander.app'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-dm-sans font-semibold text-gray-900">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 font-dm-sans">
            Connect your Wander wallet to start uploading to Arweave
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button
            onClick={handleWander}
            variant="outline"
            className="w-full justify-start h-auto py-4 px-4 border-gray-300 hover:bg-gray-50 text-black font-dm-sans"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
                W
              </div>
              <div className="text-left">
                <div className="font-semibold">Wander</div>
                <div className="text-xs text-gray-500 font-normal">
                  Browser extension
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WalletConnectModal;
