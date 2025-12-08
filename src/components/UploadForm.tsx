import { useState, useEffect } from 'react';
import Arweave from 'arweave';
import { Button } from '@/components/ui/button';

interface UploadFormProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onUploadSuccess?: (txId: string, url: string) => void;
  wallet?: any;
  droppedFile?: File | null;
}

function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    json: 'application/json',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ts: 'application/typescript',
    pdf: 'application/pdf',
    zip: 'application/zip',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

function UploadForm({
  isWalletConnected,
  onConnectWallet,
  onUploadSuccess,
  wallet,
  droppedFile,
}: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  }, [droppedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected || !selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
      });

      const fileData = await selectedFile.arrayBuffer();
      const contentType = getContentType(selectedFile.name);

      let transaction;
      const isWander =
        wallet?.type === 'wander' ||
        (typeof window !== 'undefined' &&
          (window as any).arweaveWallet &&
          !wallet);

      if (
        isWander &&
        typeof window !== 'undefined' &&
        (window as any).arweaveWallet
      ) {
        transaction = await arweave.createTransaction({
          data: fileData,
        });
        transaction.addTag('Content-Type', contentType);
        transaction.addTag('App-Name', 'just-upload-to-arweave-ui');
        transaction.addTag('File-Name', selectedFile.name);

        await arweave.transactions.sign(transaction, 'use_wallet');
      } else if (wallet?.data || wallet) {
        const walletData = wallet?.data || wallet;
        transaction = await arweave.createTransaction(
          {
            data: fileData,
          },
          walletData
        );
        transaction.addTag('Content-Type', contentType);
        transaction.addTag('App-Name', 'just-upload-to-arweave-ui');
        transaction.addTag('File-Name', selectedFile.name);
        await arweave.transactions.sign(transaction, walletData);
      } else {
        throw new Error('No wallet available');
      }

      const uploader = await arweave.transactions.getUploader(transaction);
      const totalChunks = uploader.totalChunks || 1;
      let uploadedChunks = 0;

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        uploadedChunks++;
        const progressPercent =
          totalChunks > 0
            ? Math.min(100, Math.round((uploadedChunks / totalChunks) * 100))
            : Math.min(100, uploadedChunks > 0 ? 99 : 0);
        setUploadProgress(progressPercent);
      }

      setUploadProgress(100);
      const txId = transaction.id;
      const url = `https://arweave.net/${txId}`;

      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);

      if (onUploadSuccess) onUploadSuccess(txId, url);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
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
          Connect your Arweave wallet to start uploading files securely and
          permanently.
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
        Upload to Arweave
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="file" className={labelClasses}>
            Select File
          </label>
          <div className="relative">
            <label
              htmlFor="file"
              className="flex items-center gap-3 rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm transition hover:border-gray-400 focus-within:border-black"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <i
                  className="bx bx-folder text-xl"
                  aria-hidden="true"
                  role="img"
                />
              </span>

              <div className="flex-1 text-left text-xs font-semibold text-gray-800">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </div>

              <span className="ml-auto text-[11px] text-gray-500">
                Choose File
              </span>

              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>

            {selectedFile && (
              <p className="mt-2 text-xs text-gray-600 font-dm-sans">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-dm-sans text-center">
              Uploading to Arweave...
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`${buttonPrimaryClasses} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isUploading ? 'Uploading…' : 'Upload to Arweave'}
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

export default UploadForm;
