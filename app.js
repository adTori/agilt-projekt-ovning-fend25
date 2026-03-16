let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const searchPlayerInput = document.getElementById("searchPlayerInput")
const searchResult = document.getElementById("searchResult")

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
    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    teamA.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `

<span onclick="goToPlayer('${p.username}')">${p.username}</span>

<button onclick="removePlayer('A','${p.username}')">
Remove
</button>

`
        listA.appendChild(li)
    })
    teamB.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `
<span onclick="goToPlayer('${p.username}')">${p.username}</span>
<button onclick="removePlayer('B','${p.username}')">
Remove
</button>

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
        teamA.filter(p => p.username !== username)
    }
    if (team === "B") {
        teamB.filter(p => p.username !== username)
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

<option value="A" ${teamA.length >= 5 ? "disabled" : ""}>
${teamAName}
</option>

<option value="B" ${teamB.length >= 5 ? "disabled" : ""}>
${teamBName}
</option>

`

    document.getElementById("playerForm").addEventListener("submit", e => {

        e.preventDefault()
        const username = document.getElementById("username").value
        if (usernameExists) {
            document.getElementById("error").textContent = "Username already exists"
        }
        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age"),
            country: document.getElementById("country").value,
            ranking: document.getElementById("ranking")

        }
        const team = document.getElementById("teamSelect").value
        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }
        save()
        window.location.href = "index.html"

    })

}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer")

    const player = teamA.find(p => p.username === username)

    const profile = document.getElementById("profile")

    profile.innerHTML = `
<div class="profile">
<h2>${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.country}</p>
<p><b>Ranking:</b> ${player?.ranking}</p>
<br>
<button onclick="window.location='home.html'">
Back
</button>

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

searchPlayerInput.addEventListener("input", renderSearchPlayer)