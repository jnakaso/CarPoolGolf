export const MATCH_PREFIX = "CPMatch"
export const STORAGE_KEY_SEPARATOR: string = ":";

export const CPGOLF_COURSE_URL = 'http://localhost:8100/assets/test-data/courses.js';
export const CPGOLF_PLAYER_URL = 'http://localhost:8100/assets/test-data/players.json';

// export const CPGOLF_COURSE_URL =  "http://www.ppcc.com/asgolf-assets/data/courses.js";
// export const CPGOLF_PLAYER_URL =  "http://www.ppcc.com/ppccgolf/players-json.asp";

export function CP_guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

export class Match {
    id: string;
    courseName: string;
    date: string;
    rating: number;
    slope: number;
    bet: number;
    type: string;
    rounds: Round[] = [];
}


export class Round {
    player: string;
    hdcp: number;
    money: number;
    front: number;
    back: number;
    total: number;
    adjusted: number;
    frontNet: number;
    backNet: number;
    totalNet: number;
}

// http://www.ppcc.com/asgolf-assets/data/courses.js
export class Course {
    id: String;
    name: string;
    rating: number;
    slope: number;
}

export class ASCourse {
    direction: string;
    id: number;
    name: string;
    phone: string;
    tees: ASCourseTee[];
}

export class ASCourseTee {
    handicaps: number[];
    name: string;
    pars: number[];
    rating: number;
    slope: number;
}

// http://www.ppcc.com/ppccgolf/players-json.asp
export class Player {
    id: String;
    name: string;
    hdcp: number;
}