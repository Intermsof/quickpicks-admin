export interface AdminPanelUses {
    lastTenSearches: [string];
    lastUsedDate: string;
}

export interface Game {
    awayTeamName: string,
    awayTeamScore: number,
    homeTeamName: string,
    homeTeamScore: number,
    isFinished: boolean,
    spread: number,
    gameStartTime: string,
    gameStartDate: string,
    gameState: number
}

export interface GameWithID{
    id: string,
    data: Game
}

export interface Sport {
    awards: Award[],
    currentContest: string,
    lastContest: string,
    entries: number,
    id: string,
    isActive: boolean,
}

export interface Award {
    award: number,
    end: number
}

export interface Contest{
    date: string,
    games: [string],
    progression: number
}

export interface ContestStaging {
    date: string,
    games: [GameWithID],
    progression: number
}

export interface User {
    NFLPicks: String,
    NFLEntered: boolean,
    NFLPosition: number,
    coins: number,
    email: string,
    prevCoins: number,
    username: string 
}

export interface ContestEntry {
    contest: String,
    date: String,
    lastGameScore: number,
    picks: [number],
    position: number
}

export interface Request {
    amount: number,
    paypalEmail: String,
    qpEmail: String,
    status: number
}