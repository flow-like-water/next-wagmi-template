'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits, parseEther } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import Image from 'next/image';
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import { useContractWrite } from '@/blockchain/hooks/useContract';
import useToast from '@/hooks/useToast';

const Home = () => {
  const toast = useToast();
  const { address } = useAccount();
  const [sliderValue, setSliderValue] = useState(1);
  const max = 10;
  const tickCount = 10; // Set to 10 for 10 Pokéballs
  const [isMinted, setIsMinted] = useState(false);

  // Destructuring the write function and any other properties you might need from the custom hook
  const { write: mintNFT, error, isLoading } = useContractWrite('mint');

  /*  const tokenTransfer = useTokenWrite('transfer', {
    onSuccess(data) {
      console.log('data: transfer write ', data);
    },
  }); */

  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  const isTickActive = (tickValue) => sliderValue >= tickValue;

  // Inside your component
  const handleMintClick = async () => {
    const mintAmount = sliderValue.toString(); // Assuming this is your desired mint amount
    const totalValue = parseEther(mintAmount).toString(); // Example value in Ether, adjust based on your requirements

    console.log(`Minting ${mintAmount} NFTs for a total value of ${totalValue}`);

    try {
      setIsMinted(true);
      //const parsedValue = parseEther(valueToSend);

      await mintNFT(mintAmount, { value: totalValue });
      toast('Mint successful', 'success');
    } catch (err) {
      console.error('Mint failed: ', err);
      toast('Mint failed: ' + err.message, 'error');
    }
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
              handleMintClick();
            }}
            onMouseLeave={() => setIsMinted(false)}
          >
            Mint
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
