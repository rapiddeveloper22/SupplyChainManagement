const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Supply = artifacts.require('Supply');

module.exports = async function (deployer) {
    const instance = await deployProxy(Supply, { deployer });
    console.log('Deployed', instance.address);
};