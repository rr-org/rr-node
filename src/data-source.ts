import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: "mongodb+srv://nubieme:zD0NCce512txGxh1@resonance-riddle.hgccwvw.mongodb.net/",
    database: "Resonance-Riddle",
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
})
