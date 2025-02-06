async function main() {
  const Market = await ethers.getContractAt(
    "Market",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const products = await Market.getAllProducts();
  console.log(products);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
