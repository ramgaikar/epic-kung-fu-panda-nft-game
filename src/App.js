import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import './App.css'
import SelectCharacter from './Components/SelectCharacter'
import Arena from './Components/Arena'
import LoadingIndicator from './Components/LoadingIndicator'

// Constants

import { CONTRACT_ADDRESS, transformCharacterData } from './constants'
import myEpicGame from './utils/MyEpicGame.json'

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null)

  const [characterNFT, setCharacterNFT] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have MetaMask!')
        setIsLoading(false)
        return
      } else {
        console.log('We have the ethereum object', ethereum)

        const accounts = await ethereum.request({ method: 'eth_accounts' })

        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log('Found an authorized account:', account)
          setCurrentAccount(account)
        } else {
          console.log('No authorized account found')
        }
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    /*
     * Anytime our component mounts, make sure to immiediately set our loading state
     */
    setIsLoading(true)
    checkIfWalletIsConnected()
  }, [])

  /*
   * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
   */

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer,
      )

      const txn = await gameContract.checkIfUserHasNFT()
      if (txn.name) {
        console.log('User has character NFT')
        setCharacterNFT(transformCharacterData(txn))
      } else {
        console.log('No character NFT found')
      }
      setIsLoading(false)
    }

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  // Render Methods
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }

    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      )
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT) {
      /*
       * If there is a connected wallet and characterNFT, it's time to battle!
       */
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      )
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App
