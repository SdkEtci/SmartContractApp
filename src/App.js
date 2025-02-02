import { useState } from "react";
import Web3 from "web3";
import "./App.css"; // Import a CSS file for styling

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Add Project states
  const [projectName, setProjectName] = useState("");
  const [teamWallets, setTeamWallets] = useState("");

  // Update Project states
  const [updateProjectId, setUpdateProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamWallets, setNewTeamWallets] = useState("");

  // Fetch Project Details states
  const [projectIdToFetch, setProjectIdToFetch] = useState("");
  const [projectDetails, setProjectDetails] = useState(null);

  const contractAddress = "0xe542F0C8CC3021C33BD6497E86643a03Bd85B7aD";
  const contractAbi = [
    // ABI here (same as before)
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      setUserAddress(accounts[0]);
      setWeb3(web3Instance);
      setContract(contractInstance);

      console.log("Wallet connected:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const getDetails = async () => {
    if (!contract || !userAddress) return;

    try {
      const group = await contract.methods.getWalletGroup(userAddress).call();
      const hasVoted = await contract.methods.getIsVoted(userAddress).call();
      console.log("Wallet Group:", group);
      console.log("Has Voted:", hasVoted);
      alert(`Wallet Group: ${group}\nHas Voted: ${hasVoted}`);
    } catch (error) {
      console.error("Error getting details:", error);
    }
  };

  const addProject = async () => {
    if (!contract || !userAddress) return;
    if (!projectName || !teamWallets) {
      alert("Please fill in both project name and team wallets!");
      return;
    }

    try {
      const walletArray = teamWallets.split(',').map(wallet => wallet.trim());

      const tx = await contract.methods.addProject(projectName, walletArray)
        .send({ from: userAddress });

      console.log("Transaction Sent:", tx);
      alert("Project added successfully!");

      // Clear form
      setProjectName("");
      setTeamWallets("");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Error adding project: " + error.message);
    }
  };

  const updateProject = async () => {
    if (!contract || !userAddress) return;
    if (!updateProjectId || !newProjectName || !newTeamWallets) {
      alert("Please fill in all fields to update the project!");
      return;
    }

    try {
      const walletArray = newTeamWallets.split(',').map(wallet => wallet.trim());

      const tx = await contract.methods.updateProject(parseInt(updateProjectId), newProjectName, walletArray)
        .send({ from: userAddress });

      console.log("Transaction Sent:", tx);
      alert("Project updated successfully!");

      // Clear form
      setUpdateProjectId("");
      setNewProjectName("");
      setNewTeamWallets("");
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project: " + error.message);
    }
  };

  const vote = async () => {
    if (!contract || !userAddress) return;

    try {
      const projectId = prompt("Enter project ID to vote:");
      if (!projectId) return;

      const tx = await contract.methods.vote(parseInt(projectId))
        .send({ from: userAddress });

      console.log("Transaction Sent:", tx);
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const fetchProjectDetails = async () => {
    if (!contract || !projectIdToFetch) return;

    try {
      const details = await contract.methods.getProjectDetail(parseInt(projectIdToFetch)).call();
      setProjectDetails(details);
      console.log("Project Details:", details);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Kapsül Teknoloji Voting System</h1>
        <button className="connect-wallet-button" onClick={connectWallet}>
          {userAddress ? `Connected: ${userAddress.slice(0, 6)}...` : "Connect Wallet"}
        </button>
      </header>

      <main className="main">
        {/* Add Project Section */}
        <section className="section">
          <h2>Add Project</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Team Wallets (comma-separated)"
              value={teamWallets}
              onChange={(e) => setTeamWallets(e.target.value)}
            />
            <button onClick={addProject}>Add Project</button>
          </div>
        </section>

        {/* Update Project Section */}
        <section className="section">
          <h2>Update Project</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Project ID to Update"
              value={updateProjectId}
              onChange={(e) => setUpdateProjectId(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Team Wallets (comma-separated)"
              value={newTeamWallets}
              onChange={(e) => setNewTeamWallets(e.target.value)}
            />
            <button onClick={updateProject}>Update Project</button>
          </div>
        </section>

        {/* Vote Section */}
        <section className="section">
          <h2>Vote</h2>
          <button onClick={vote}>Vote for a Project</button>
        </section>

        {/* Fetch Project Details Section */}
        <section className="section">
          <h2>Fetch Project Details</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Project ID to Fetch"
              value={projectIdToFetch}
              onChange={(e) => setProjectIdToFetch(e.target.value)}
            />
            <button onClick={fetchProjectDetails}>Fetch Details</button>
          </div>
          {projectDetails && (
            <div className="project-details">
              <h3>Project Details</h3>
              <p><strong>ID:</strong> {projectDetails.id}</p>
              <p><strong>Name:</strong> {projectDetails.projectName}</p>
              <p><strong>Vote Count:</strong> {projectDetails.voteCount}</p>
              <p><strong>Team Wallets:</strong> {projectDetails.teamWallets.join(", ")}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;