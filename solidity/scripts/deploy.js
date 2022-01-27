const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame')

  const gameContract = await gameContractFactory.deploy(
    ['Po', 'Shifu', 'Ugve', 'Tigress', 'Monkey', 'Mantis'],
    [
      'QmbSeMJtmZC882ocEjtukY2NY1dXyQPQmu1XamPd9sgaES',
      'QmbyoFUfmPfGexq9pVD5VDtkHLukQR43CDNK6C6t6dBMv6',
      'Qmb8QJBKJdHd5YSHe5DC2xLcsTv7HUcBdxrdTV3QctsTGb',
      'QmbneWpQMmBRyhptqyfXZRPbDW51mVYqZKEMPvzjgciicF',
      'Qmba6uonUoE8GGiNAx6GTc6xjkEwas4UjWv2y8gstEjGP5',
      'QmZAPyfsmXTnp6jhWkQMJj8qgE2nDpZGVrNYg1cDBx78Dc',
    ],
    [500, 400, 300, 200, 100, 50],
    [25, 50, 75, 100, 125, 150],
    'Tai Lung', // Boss name
    'QmNgRundDeFs6dPPRZaLgwLywZjsvZJAG2U4jCX8sPSaWE', // Boss image
    10000, // Boss hp
    50, // Boss attack damage
  )

  await gameContract.deployed()
  console.log('Contract deployed to:', gameContract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
