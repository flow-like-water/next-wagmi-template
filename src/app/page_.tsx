'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import Image from 'next/image';
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import useToast from '@/hooks/useToast';
import Slider from '../app/slider/slider';

export default function Home() {
  const toast = useToast();
  const { address } = useAccount();
  //const [recipient, setRecipient] = useState('');
  const [nftAmount, setNftAmount] = useState(1); // Default value is 1
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

  const handleSliderInput = (e) => {
    setNftAmount(Number(e.target.value));
    // Set CSS variable for slider position
    document.documentElement.style.setProperty('--val', e.target.value);
  };

  const handleTransfer = async () => {
    if (nftAmount < 1 || nftAmount > 10) return toast('Select a number between 1 and 10', 'error');
    const amount = parseUnits(nftAmount.toString(), tokenDecimalsData);
    await tokenTransfer.write([address, amount]);
    toast('Transfer successful', 'success');
  };

  return (
    <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <div className="flex justify-center items-center gap-4 mb-5">
        {/* Image container */}
        <Image src="/venusaur.png" alt="Venusaur" width={250} height={250} />
        <Image src="/charizard.png" alt="Charizard" width={375} height={375} />
        <Image src="/blastoise.png" alt="Blastoise" width={250} height={250} />
      </div>
      {/* Slider and Mint button container */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Slider */}
        <input
          type="range"
          min="1"
          max="10"
          value={nftAmount}
          onChange={handleSliderInput}
          className="slider" // Use this class to apply additional styles if needed
          style={{ '--min': '1', '--max': '10', '--val': nftAmount }}
        />
        <Slider />
        {/* Mint button */}
        <button
          className="border-indigo-600 bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleTransfer}
        >
          Mint
        </button>
      </div>
      {/* Amount display */}
      <div className="mt-2">Amount: {nftAmount}</div>
    </div>
  );
}
