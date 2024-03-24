'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { contractABI } from '@/blockchain/abis';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits, parseEther } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import Image from 'next/image';
import useToast from '@/hooks/useToast';

const Home = () => {
  const toast = useToast();
  const { address } = useAccount();
  const [sliderValue, setSliderValue] = useState(1);
  const max = 10;
  const tickCount = 10;
  const [isMinted, setIsMinted] = useState(false);
  const mintValue = parseUnits(sliderValue.toString(), 'ether');

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleMint = async () => {
    const roundedValue = Math.round(sliderValue);
    const mintValue = parseEther(roundedValue.toString());

    console.log('Minting with value:', mintValue);
    console.log('Slider value for minting:', sliderValue);

    writeContract({
      chainId: 369,
      address: '0x47d2307b4f9a93F184BdE81D7D3f604c650AAd8d',
      abi: contractABI,
      functionName: 'mint',
      args: [BigInt(sliderValue)], // Use sliderValue or a transformed value if needed
      value: mintValue.toString(),
    });
  };

  const handleSliderChange = (e) => {
    const roundedValue = Math.round(e.target.value);
    setSliderValue(roundedValue);
    // Set CSS variable for slider position
    document.documentElement.style.setProperty('--val', roundedValue.toString());
  };

  const isTickActive = (tickValue) => sliderValue >= tickValue;

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
        </Head>
        <div className="flex flex-grow flex-col items-center justify-center w-full">
          <div className="flex justify-center items-center gap-4 mb-5">
            <Image src="/venusaur.png" alt="Venusaur" width={200} height={200} />
            <Image src="/charizard.png" alt="Charizard" width={275} height={275} />
            <Image src="/blastoise.png" alt="Blastoise" width={200} height={200} />
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
          <button
            style={{
              WebkitMaskImage:
                "url('https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png')",
              maskImage:
                "url('https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png')",
              WebkitMaskSize: '2300% 100%',
              maskSize: '2300% 100%',
              animation: isMinted
                ? 'mask-animation-recede 0.7s steps(22) forwards'
                : 'mask-animation-fill 0.7s steps(22) forwards',
            }}
            className="bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-lg hover:shadow-none mt-5"
            onClick={() => {
              handleMint();
            }}
            onMouseLeave={() => setIsMinted(false)}
          >
            Mint
          </button>
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
        </div>
      </div>
    </>
  );
};

export default Home;
