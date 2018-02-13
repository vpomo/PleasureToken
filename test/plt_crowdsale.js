var PLTCrowdsale = artifacts.require("./PLTCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('PLTCrowdsale', (accounts) => {
    var contract;
    var owner = "0x61b36aC09dFcD335fd9270f5360A20b30Dd95169";
    var rate = 30000;
    var buyWei = 5 * 10**17;
    var rateNew = 30000;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**15;
    var buyWeiCap = 49700 * (10 ** 18);

    var period = 0;

    var totalSupply = 5e+26;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await PLTCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(totalSupply, balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        period = await contract.getPeriod.call(tokenAllocatedBefore);
        //console.log("period = " + period)

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(rate*buyWei, tokenAllocatedAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);

    });


    it('verification define period', async ()  => {
        period = await contract.getPeriod(30*10**21);
        assert.equal(0, period);

        period = await contract.getPeriod(60*10**21);
        assert.equal(1, period);

        period = await contract.getPeriod(90*10**21);
        assert.equal(2, period);

        period = await contract.getPeriod(320*10**21);
        assert.equal(11, period);

        period = await contract.getPeriod(390*10**21);
        assert.equal(12, period);

    });

    it('verification valid purchase token', async ()  => {
        var newByWei = 5 * 10**16;
        var numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        assert.equal( newByWei*30000, numberToken);

        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);
        newByWei = 2 * 10**18;
        numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        await contract.buyTokens(accounts[3],{from:accounts[3], value:newByWei});
        var tokenAllocated = await contract.tokenAllocated.call();
        //console.log("tokenAllocated = " + tokenAllocated);
        assert.equal( newByWei*30000, numberToken);
        numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        assert.equal( newByWei*7250, numberToken);
        //console.log("numberToken = " + numberToken);
    });

    it('verification tokens limit min amount', async ()  => {
            var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
            //console.log("numberTokensMinWey = " + numberTokensMinWey);
            assert.equal(0, numberTokensMinWey);
    });

    it('verification tokens cap reached', async ()  => {
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(7250*buyWei, numberTokensNormal);

            var numberTokensFault = await contract.validPurchaseTokens.call(buyWeiCap);
            //console.log("numberTokensFault = " + numberTokensFault);
            assert.equal(0, numberTokensFault);
    });


});



