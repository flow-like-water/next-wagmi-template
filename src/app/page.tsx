'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import Image from 'next/image'; // Importing the Image component
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import useToast from '@/hooks/useToast';

export default function Home() {
  const toast = useToast();
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('');
  const tokenName = useTokenRead<string>('name');
  const tokenBalance = useTokenRead<bigint>('balanceOf', [address]);
  const tokenDecimals = useTokenRead<bigint>('decimals');
  const tokenSymbol = useTokenRead<string>('symbol');

  const tokenTransfer = useTokenWrite('transfer', {
    onSuccess(data) {
      console.log('data: transfer write ', data);
    },
  });

  const tokenNameData = tokenName.data;
  const tokenDecimalsData = Number(tokenDecimals.data);
  const tokenBalanceData = formatUnits(tokenBalance.data || BigInt(0), tokenDecimalsData);
  const tokenSymbolData = tokenSymbol.data as string;

  const handleTransfer = async () => {
    if (!recipient) return toast('Please enter recipient address', 'error');
    const amount = parseUnits('10', tokenDecimalsData);
    await tokenTransfer.write([recipient, amount]);
    toast('Transfer successful', 'success');
  };

  return (
    <div className="h-screen w-full bg-slate-900 text-white flex flex-col">
      <div className="self-end p-4">
        <ConnectButton />
      </div>
      <main className="flex-grow flex justify-center items-center">
        <div className="flex flex-col gap-5 items-center">
          {/* Image container */}
          <div className="flex justify-center items-center gap-4 mb-5">
            <Image src="/venusaur.png" alt="Venusaur" width={250} height={250} />
            <Image src="/charizard.png" alt="Charizard" width={375} height={375} />
            <Image src="/blastoise.png" alt="Blastoise" width={250} height={250} />
          </div>

          {address ? <div className=""></div> : <p className="text-red-500">Connect Your Wallet</p>}

          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Enter recipient address"
              className="p-2 border-none rounded-md focus:outline-cyan-300 text-black"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button className="border-cyan-700 border-2 rounded-md px-3 py-1" onClick={handleTransfer}>
              Transfer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
