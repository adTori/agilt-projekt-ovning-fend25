let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const searchPlayerInput = document.getElementById("searchPlayerInput")
const searchResult = document.getElementById("searchResult")

const rankToNumber = {
    "Iron": 1,
    "Bronze": 2,
    "Silver": 3,
    "Gold": 4,
    "Diamond": 5
};

const numberToRank = {
    1: "Iron",
    2: "Bronze",
    3: "Silver",
    4: "Gold",
    5: "Diamond"
};

function getTeamSummary(teamPlayers) {
    if (!teamPlayers || teamPlayers.length === 0) {
        return {
            count: 0,
            avgAge: "—",
            avgRankName: "—"
        };
    }

    let totalAge = 0;
    let ageCount = 0;
    let totalRankPoints = 0;
    let rankCount = 0;

    teamPlayers.forEach(player => {
        const age = Number(player.age);
        if (!isNaN(age) && age > 0) {
            totalAge += age;
            ageCount++;
        }

        const rankKey = (player.ranking || "").trim();
        const rankNum = rankToNumber[rankKey] || rankToNumber[rankKey.charAt(0).toUpperCase() + rankKey.slice(1).toLowerCase()];

        if (rankNum !== undefined) {
            totalRankPoints += rankNum;
            rankCount++;
        }
    });

    const count = teamPlayers.length;

    const avgAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) : "—";

    let avgRankName = "—";
    if (rankCount > 0) {
        const avgPoints = totalRankPoints / rankCount;
        const closest = Math.round(avgPoints);
        const clamped = Math.max(1, Math.min(5, closest));
        avgRankName = numberToRank[clamped];
    }

    return { count, avgAge, avgRankName };
}

function save() {
    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))
    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)
}

function renameTeam(team) {
    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}

function renderHome() {
    document.getElementById("teamAName").textContent = teamAName
    document.getElementById("teamBName").textContent = teamBName

    const h2A = document.getElementById("teamAName");
    const h2B = document.getElementById("teamBName");
    h2A.style.cursor = "pointer";
    h2B.style.cursor = "pointer";
    h2A.onclick = () => window.location.href = "teamStats.html";
    h2B.onclick = () => window.location.href = "teamStats.html";

    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""

    teamA.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `
<span onclick="goToPlayer('${p.username}')">${p.username}</span>
<button onclick="removePlayer('A','${p.username}')">Remove</button>
`
        listA.appendChild(li)
    })

    teamB.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `
<span onclick="goToPlayer('${p.username}')">${p.username}</span>
<button class="removePlayer" onclick="removePlayer('B','${p.username}')">Remove</button>
`
        listB.appendChild(li)
    })
}

function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}

function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username)
    }
    if (team === "B") {
        teamB = teamB.filter(p => p.username !== username)
    }
    save()
    renderHome()
}

function usernameExists(username) {
    return teamA.includes(username) || teamB.includes(username)
}

function renderAddPlayer() {
    const teamSelect = document.getElementById("teamSelect")

    teamSelect.innerHTML = `
<option value="A" ${teamA.length >= 5 ? "disabled" : ""}>${teamAName}</option>
<option value="B" ${teamB.length >= 5 ? "disabled" : ""}>${teamBName}</option>
`

    document.getElementById("playerForm").addEventListener("submit", e => {
        e.preventDefault()
        const username = document.getElementById("username").value.trim()

        if (usernameExists) {
            document.getElementById("error").textContent = "Username already exists"
            return; // ← stop here
        }

        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: document.getElementById("country").value,
            ranking: document.getElementById("ranking").value.trim()
        }

        const team = document.getElementById("teamSelect").value
        if (team === "A") teamA.push(player)
        if (team === "B") teamB.push(player)

        save()
        window.location.href = "index.html"
    })
}

function renderPlayerInfo() {
    const username = localStorage.getItem("selectedPlayer")
    const player = [...teamA, ...teamB].find(p => p.username === username)

    const profile = document.getElementById("profile")
    profile.innerHTML = `
<div class="profile">
<h2>${player?.username || "Player not found"}</h2>
<p><b>Name:</b> ${player?.firstname || ""} ${player?.lastname || ""}</p>
<p><b>Age:</b> ${player?.age || "—"}</p>
<p><b>Country:</b> ${player?.country || "—"}</p>
<p><b>Ranking:</b> ${player?.ranking || "—"}</p>
<br>
<button onclick="window.location='index.html'">Back</button>
</div>
`
}

function renderSearchPlayer() {
    const query = searchPlayerInput.value.toLowerCase()
    searchResult.innerHTML = ""

    const allPlayers = [...teamA, ...teamB]
    const filteredPlayers = allPlayers.filter(player =>
        player.username.toLowerCase().includes(query)
    )

    // Om ingen spelare hittas
    if (filteredPlayers.length === 0 && query !== "") {
        const li = document.createElement("li")
        li.textContent = "No players found"
        searchResult.appendChild(li)
        return
    }

    filteredPlayers.forEach(player => {
        const li = document.createElement("li")
        li.textContent = player.username
        searchResult.appendChild(li)
    })
}

if (searchPlayerInput) {
    searchPlayerInput.addEventListener("input", renderSearchPlayer)
}

function renderTeamStatsPage() {
    const teamANameEl = document.getElementById("teamAName");
    const teamBNameEl = document.getElementById("teamBName");

    if (!teamANameEl || !teamBNameEl) return;

    teamANameEl.textContent = teamAName || "Team A";
    teamBNameEl.textContent = teamBName || "Team B";

    const summaryA = getTeamSummary(teamA);
    const summaryB = getTeamSummary(teamB);

    document.getElementById("statsA").innerHTML = `
        <p><b>Players:</b> ${summaryA.count}</p>
        <p><b>Average age:</b> ${summaryA.avgAge}</p>
        <p><b>Average rank:</b> ${summaryA.avgRankName}</p>
    `;

    document.getElementById("statsB").innerHTML = `
        <p><b>Players:</b> ${summaryB.count}</p>
        <p><b>Average age:</b> ${summaryB.avgAge}</p>
        <p><b>Average rank:</b> ${summaryB.avgRankName}</p>
    `;
}

renderTeamStatsPage();