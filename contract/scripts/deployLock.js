async function main() {
    const [owner, account1, account2] = await ethers.getSigners();
    const Lock = await ethers.getContractFactory("Lock");

    // Specifici `_unlockTime` în momentul deploy-ului (ex. 100 în cazul tău)
    const lockContract = await Lock.deploy(0);

    const _unlockTime = latestBlock.timestamp + 60;

    // Așteaptă să se finalizeze procesul de deploy
    await lockContract.deploy();

    console.log("Lock Contract deployed at:", lockContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });