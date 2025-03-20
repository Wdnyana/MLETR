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
