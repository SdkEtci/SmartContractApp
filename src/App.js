import { useState } from "react";
import Web3 from "web3";
import "./App.css"; // Stil dosyasını içe aktar

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

  const contractAddress = "0xe542F0C8CC3021C33BD6497E86643a03Bd85B7aD";
  const contractAbi = [
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "string", "name": "projectName", "type": "string"}],
      "name": "ProjectAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "string", "name": "projectName", "type": "string"}],
      "name": "ProjectUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "uint8", "name": "projectID", "type": "uint8"}],
      "name": "Vote",
      "type": "event"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "_projectName", "type": "string"},
        {"internalType": "address[]", "name": "_teamsWallets", "type": "address[]"}
      ],
      "name": "addProject",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_wallet", "type": "address"}],
      "name": "getIsVoted",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint8", "name": "_projectID", "type": "uint8"}],
      "name": "getProjectDetail",
      "outputs": [
        {
          "components": [
            {"internalType": "uint8", "name": "id", "type": "uint8"},
            {"internalType": "string", "name": "projectName", "type": "string"},
            {"internalType": "address[]", "name": "teamWallets", "type": "address[]"},
            {"internalType": "uint8", "name": "voteCount", "type": "uint8"}
          ],
          "internalType": "struct KapsulVoting.Project",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "string", "name": "_projectName", "type": "string"}],
      "name": "getProjectIDByName",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_wallet", "type": "address"}],
      "name": "getWalletGroup",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address[]", "name": "_teamsWallets", "type": "address[]"},
        {"internalType": "uint8", "name": "_groupNumber", "type": "uint8"}
      ],
      "name": "identifyWallets",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint8", "name": "_id", "type": "uint8"},
        {"internalType": "string", "name": "_newProjectName", "type": "string"},
        {"internalType": "address[]", "name": "_newTeamWallets", "type": "address[]"}
      ],
      "name": "updateProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint8", "name": "_projectID", "type": "uint8"}],
      "name": "vote",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask bulunamadı!");
      return;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);
      console.log("Kontrat Örneği:", contractInstance); // Debugging

      setUserAddress(accounts[0]);
      setWeb3(web3Instance);
      setContract(contractInstance);

      console.log("Cüzdan bağlandı:", accounts[0]);
    } catch (error) {
      console.error("Cüzdan bağlanırken hata:", error);
    }
  };

  const addProject = async () => {
    if (!contract || !userAddress) return;
    if (!projectName || !teamWallets) {
      alert("Lütfen proje adı ve takım cüzdanlarını doldurun!");
      return;
    }

    try {
      const walletArray = teamWallets.split(',').map(wallet => wallet.trim());

      const tx = await contract.methods.addProject(projectName, walletArray)
        .send({ from: userAddress });

      console.log("İşlem Gönderildi:", tx);
      alert("Proje başarıyla eklendi!");

      // Formu temizle
      setProjectName("");
      setTeamWallets("");
    } catch (error) {
      console.error("Proje eklenirken hata:", error);
      alert("Proje eklenirken hata: " + error.message);
    }
  };

  const updateProject = async () => {
    if (!contract || !userAddress) return;
    if (!updateProjectId || !newProjectName || !newTeamWallets) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      const walletArray = newTeamWallets.split(',').map(wallet => wallet.trim());

      const tx = await contract.methods.updateProject(parseInt(updateProjectId), newProjectName, walletArray)
        .send({ from: userAddress });

      console.log("İşlem Gönderildi:", tx);
      alert("Proje başarıyla güncellendi!");

      // Formu temizle
      setUpdateProjectId("");
      setNewProjectName("");
      setNewTeamWallets("");
    } catch (error) {
      console.error("Proje güncellenirken hata:", error);
      alert("Proje güncellenirken hata: " + error.message);
    }
  };

  const vote = async () => {
    if (!contract || !userAddress) return;

    try {
      const projectId = prompt("Oy vermek için proje ismini girin:");
      if (!projectId) return;

      const tx = await contract.methods.vote(parseInt(projectId))
        .send({ from: userAddress });

      console.log("İşlem Gönderildi:", tx);
      alert("Oyunuz başarıyla kaydedildi!");
    } catch (error) {
      console.error("Oy verirken hata:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Kapsül Teknoloji Oylama Sistemi</h1>
        <button className="connect-wallet-button" onClick={connectWallet}>
          {userAddress ? `Bağlandı: ${userAddress.slice(0, 6)}...` : "Cüzdanı Bağla"}
        </button>
      </header>

      <main className="main">
        {/* Proje Ekleme Bölümü */}
        <section className="section">
          <h2>Proje Ekle</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Proje Adı"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Takım Cüzdanları (virgülle ayırın)"
              value={teamWallets}
              onChange={(e) => setTeamWallets(e.target.value)}
            />
            <button onClick={addProject}>Proje Ekle</button>
          </div>
        </section>

        {/* Proje Güncelleme Bölümü */}
        <section className="section">
          <h2>Proje Güncelle</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Güncellenecek Proje ID"
              value={updateProjectId}
              onChange={(e) => setUpdateProjectId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Yeni Proje Adı"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Yeni Takım Cüzdanları (virgülle ayırın)"
              value={newTeamWallets}
              onChange={(e) => setNewTeamWallets(e.target.value)}
            />
            <button onClick={updateProject}>Proje Güncelle</button>
          </div>
        </section>

        {/* Oy Verme Bölümü */}
        <section className="section">
          <h2>Oy Ver</h2>
          <button onClick={vote}>Proje için Oy Ver</button>
        </section>
      </main>
    </div>
  );
}

export default App;