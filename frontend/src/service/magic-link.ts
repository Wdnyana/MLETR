// import { Magic } from 'magic-sdk'

// const customNodeOptions = {
//   rpcUrl: YOUR_CUSTOM_EVM_RPC_URL, // Custom RPC URL
//   chainId: YOUR_CUSTOM_EVM_CHAIN_ID, // Custom chain id
// }
// const magic = new Magic('pk_live_53CCBD61082AEB48', {
//   network: customNodeOptions,
// })

// /* Connect to any email input or enter your own */
// await magic.auth.loginWithEmailOTP({ email: 'your-email' })
// ;
// import Web3 from 'web3';

// const magic = new Magic('pk_live_53CCBD61082AEB48', {
//   network: customNodeOptions
// });
// const web3 = new Web3(magic.rpcProvider);
// const accounts = await magic.wallet.connectWithUI();

// // ⭐️ After user is successfully authenticated
// const destination = '0x777ED066eB783d02C7421eB6221e9eB3fBB15501';
// const amount = 10000000000000000; // 0.1 eth in wei

// // Submit transaction to the blockchain
// const tx = web3.eth.sendTransaction({
//   from: accounts[0],
//   to: destination,
//   value: amount,
// });

// // Wait for transaction to be mined
// const receipt = await tx;
