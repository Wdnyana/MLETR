import { useCallback, useEffect, useState } from 'react'
import { magic } from '@/lib/magic-provider'
import { LoginEmailOTP } from '@/types/general-type'
import useWeb3 from '@/components/utils/web3'

const UserInfo = ({ token, setToken }: LoginEmailOTP) => {
  const web3 = useWeb3()

  const [balance, setBalance] = useState('...')
  const [copied, setCopied] = useState('Copy')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [publicAddress] = useState(localStorage.getItem('user'))

  const getBalance = useCallback(async () => {
    if (publicAddress && web3) {
      const balance = await web3.eth.getBalance(publicAddress)
      if (balance == BigInt(0)) {
        setBalance('0')
      } else {
        setBalance(web3.utils.fromWei(balance, 'ether'))
      }
      console.log('BALANCE: ', balance)
    }
  }, [web3, publicAddress])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    await getBalance()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }, [getBalance])

  useEffect(() => {
    if (web3) {
      refresh()
    }
  }, [web3, refresh])

  useEffect(() => {
    setBalance('...')
  }, [])

  return (
    <>
      <div className="flex-row">
        <div className="green-dot" />
        <h1>{balance}</h1>
        <br />
        <p>{magic.wallet.getInfo()?.toString()}</p>
        <br />
        <p>{token}</p>
        <br />
      </div>
    </>
  )
}

export default UserInfo
