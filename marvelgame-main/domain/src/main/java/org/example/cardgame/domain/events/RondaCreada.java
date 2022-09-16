package org.example.cardgame.domain.events;

import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.domain.values.Ronda;

/**
 * The type Ronda creada.
 */
public class RondaCreada extends DomainEvent {
    private final Ronda ronda;
    private final Integer tiempo;

    private final String idJugadorElegido;

    /**
     * Instantiates a new Ronda creada.
     *
     * @param ronda            the ronda
     * @param tiempo           the tiempo
     * @param idJugadorElegido
     */
    public RondaCreada(Ronda ronda, Integer tiempo, String idJugadorElegido) {
        super("cardgame.rondacreada");
        this.ronda = ronda;
        this.tiempo = tiempo;
        this.idJugadorElegido = idJugadorElegido;
    }

    /**
     * Gets ronda.
     *
     * @return the ronda
     */
    public Ronda getRonda() {
        return ronda;
    }


    public String getIdJugadorElegido() {
        return idJugadorElegido;
    }

    /**
     * Gets tiempo.
     *
     * @return the tiempo
     */
    public Integer getTiempo() {
        return tiempo;
    }
}
