export interface Juego {
    juegoId:string,
    jugadores: Map<string, string>;
    jugadorPrincipalId: string | undefined;
}