import axios from "axios";
import { IQuiz } from "./type";

export async function getQuiz(): Promise<IQuiz[]> {
    const response = await axios.get("http://localhost:9000/api/quiz");
    return response.data;
}
