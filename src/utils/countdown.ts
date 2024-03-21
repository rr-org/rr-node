import { io, users } from "../index";
import { getQuiz } from "./getQuiz";
import { IQuiz } from "./type";

let counter = 0;
let shuffled: IQuiz[];

let quizzes: IQuiz[];
getQuiz().then((val: IQuiz[]) => (quizzes = val));

function shuffle(){
    shuffled = quizzes.map(val => ({ val, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({val}) => val)
}

function shuffles(){
    shuffled = shuffled.map(val => ({ val, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({val}) => val)
}

let seconds = 30
export const countdown = (room: string) => {
    shuffle()
    const interval = setInterval(() => {
        io.to(room).emit("matching", seconds);
        seconds--;

        if (seconds === -1) {
            clearInterval(interval);
            
            setTimeout(() => {
                io.to(users[0].room).emit("question", shuffled[0]);
                shuffled.splice(0, 1)

                timer(users[0].room);
                counter++

                io.to(users[0].room).emit("counter", counter);
                console.log(counter)
            }, 3000)
            seconds = 30
        }
    }, 1000);
};

let secondsQuiz = 15
const timer = (room: string) => {
    shuffles()
    const interval = setInterval(() => {
        io.to(room).emit("timer", secondsQuiz);
        secondsQuiz--;
        
        if (secondsQuiz === -1) {
            clearInterval(interval);

            if(counter < 5) {

                setTimeout(() => {
                    io.to(users[0].room).emit("question", shuffled[0]);
                    shuffled.splice(0, 1)

                    timer(users[0].room);
                    counter++

                    io.to(users[0].room).emit("counter", counter);
                    console.log(counter)
                }, 6000)
            }
            if(counter === 5) {
                counter = 0
            }
            secondsQuiz = 15
        }
    }, 1000);
};
