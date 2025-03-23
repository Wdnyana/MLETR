import { OAuthExtension } from '@magic-ext/oauth'
import { Magic as MagicBase } from 'magic-sdk'

export type Magic = MagicBase<OAuthExtension[]>

const apiKeyRPC = import.meta.env.VITE_RPC_XDC_TESTNET

const XdcNetworkOptions = {
  rpcUrl: `${apiKeyRPC}`,
  chainId: 51,
}

const apiKeyPublish = import.meta.env.VITE_MAGIC_PUBLISHABLE_KEY

export const magic = new MagicBase(`${apiKeyPublish}`, {
  network: XdcNetworkOptions,
})

export const checkUserLoggedIn = async (): Promise<boolean> => {
  try {
    return await magic.user.isLoggedIn();
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}

export const getUserMetadata = async () => {
  try {
    return await magic.user.getMetadata();
  } catch (error) {
    console.error('Error getting user metadata:', error);
    return null;
  }
}

export const logoutUser = async (): Promise<boolean> => {
  try {
    await magic.user.logout();
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
}