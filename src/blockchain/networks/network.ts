import type { Network, Networks } from '@/lib/types/network';

const networks: Networks = {
  369: {
    contract: '0x47d2307b4f9a93F184BdE81D7D3f604c650AAd8d', //replace
    token: '0x47d2307b4f9a93F184BdE81D7D3f604c650AAd8d', //replace
  },
};

export const getNetwork = (chainId?: number): Network => {
  if (chainId === undefined || !networks[chainId]) {
    return networks[369];
  }
  return networks[chainId];
};
