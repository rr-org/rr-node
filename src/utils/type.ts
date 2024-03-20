export interface IUsers {
    id: string;
    username: string;
    room: string;
}

export interface IQuiz {
    id: string;
    question: string;
    answer: string;
    option: string[];
}
