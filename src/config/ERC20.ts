// src/abis/ERC20.ts
export const ERC20_ABI = [
    {
      constant: false,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' }
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    }
  ] as const;