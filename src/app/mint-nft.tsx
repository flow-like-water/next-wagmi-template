import * as React from 'react';
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { contractABI } from '@/blockchain/abis/contract';
import { parseEther } from 'viem';

export function MintNFT() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get('tokenId') as string;

    if (tokenId === null) {
      console.error('Token ID is null');
      return;
    }
    writeContract({
      chainId: 369,
      address: '0x47d2307b4f9a93F184BdE81D7D3f604c650AAd8d',
      abi: contractABI,
      functionName: 'mint',
      args: [BigInt(1)],
      value: parseEther('1'),
    });
  }

  console.error('Error object:', error);

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  console.error('Error object:', error);

  return (
    <form onSubmit={submit}>
      <input name="address" placeholder="0xA0Cf…251e" required />
      <input name="tokenId" placeholder="Token ID" required /> {/* Changed from name="value" */}
      <button disabled={isPending} type="submit">
        {isPending ? 'Confirming...' : 'Mint'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
    </form>
  );
}
