'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import Image from 'next/image';
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import useToast from '@/hooks/useToast';

const Home = () => {
  const toast = useToast();
  const { address } = useAccount();
  //const [recipient, setRecipient] = useState('');
  const [nftAmount, setNftAmount] = useState(1); // Default value is 1
  const tokenName = useTokenRead<string>('name');
  const tokenBalance = useTokenRead<bigint>('balanceOf', [address]);
  const tokenDecimals = useTokenRead<bigint>('decimals');
  const tokenSymbol = useTokenRead<string>('symbol');
  const [sliderValue, setSliderValue] = useState(5);
  const max = 10;
  const tickCount = 10; // Set to 10 for 10 Pokéballs

  const tokenTransfer = useTokenWrite('transfer', {
    onSuccess(data) {
      console.log('data: transfer write ', data);
    },
  });

  const tokenNameData = tokenName.data;
  const tokenDecimalsData = Number(tokenDecimals.data);
  const tokenBalanceData = formatUnits(tokenBalance.data || BigInt(0), tokenDecimalsData);
  const tokenSymbolData = tokenSymbol.data as string;

  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  const isTickActive = (tickValue) => sliderValue >= tickValue;

  const handleTransfer = async () => {
    if (nftAmount < 1 || nftAmount > 10) return toast('Select a number between 1 and 10', 'error');
    const amount = parseUnits(nftAmount.toString(), tokenDecimalsData);
    await tokenTransfer.write([address, amount]);
    toast('Transfer successful', 'success');
  };

  return (
    <>
      <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4">
          <ConnectButton />
        </div>
        <Head>
          <meta charset="UTF-8" />
          <title>Styled native range input</title>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="/style.css" />
          {/* Other scripts can be included here. Make sure you handle them correctly in React. */}
        </Head>
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="flex justify-center items-center gap-4 mb-5">
            {/* Image container */}
            <Image src="/venusaur.png" alt="Venusaur" width={250} height={250} />
            <Image src="/charizard.png" alt="Charizard" width={375} height={375} />
            <Image src="/blastoise.png" alt="Blastoise" width={250} height={250} />
          </div>
          <div className="outer-slider-container">
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max={max}
                value={sliderValue}
                onChange={handleSliderChange}
                className="slider"
                step="1"
              />

              <div className="tick-marks-container">
                {Array.from({ length: tickCount }, (_, index) => (
                  <div
                    key={index}
                    className={`tick-mark ${isTickActive(index + 1) ? 'active' : 'inactive'}`}
                    style={{
                      backgroundImage: `url(${isTickActive(index + 1) ? '/pokeball.png' : '/pokeball_grey.png'})`,
                    }}
                  />
                ))}
              </div>
              <div className="min-max-labels">
                <span>MIN</span>
                <span>MAX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
