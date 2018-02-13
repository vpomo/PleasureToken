const PLTCrowdsale = artifacts.require('./PLTCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x61b36aC09dFcD335fd9270f5360A20b30Dd95169";
    var wallet = "0x94d9cF23D5291e7B9d04B847593E4Ef511C621B2";

    deployer.deploy(PLTCrowdsale, owner, wallet);

};
