async function main() {
  const AttendanceNFT = await ethers.getContractFactory("EmotionBet");
  const contract = await AttendanceNFT.deploy();
  await contract.waitForDeployment();
  console.log("✅ EmotionBet déployé à :", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});