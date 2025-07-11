async function main() {
  const EmotionBet = await ethers.getContractFactory("EmotionBet");
  const contract = await EmotionBet.deploy();
  await contract.waitForDeployment();
  console.log("✅ EmotionBet déployé à :", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});