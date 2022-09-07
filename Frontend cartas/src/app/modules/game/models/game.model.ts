import { Card } from "./card.model"

export interface Game{
    game:[{
        id: string,
        mazo: Card[]
    }]
}