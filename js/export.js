function exportToCSV(players) {
    const headers = [
        "Name",
        "Team",
        "Position",
        "Jersey #",
        "Age",
        "Nationality",
        "PPG",
        "APG",
        "RPG",
    ];

    const rows = players.map(p => [
        p.name,
        p.team,
        p.position,
        p.jersey_number,
        p.age,
        p.nationality,
        p.points_per_game,
        p.assists_per_game,
        p.rebounds_per_game
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(escapeCSV).join(","))
        .join("\n");

    download(csv, "nba_players.csv", "text/csv");
}

function escapeCSV(value) {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}