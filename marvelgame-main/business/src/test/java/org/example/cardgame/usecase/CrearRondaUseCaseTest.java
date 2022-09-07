package org.example.cardgame.usecase;

import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.Tablero;
import org.example.cardgame.command.CrearRondaCommand;
import org.example.cardgame.events.JuegoCreado;
import org.example.cardgame.events.RondaCreada;
import org.example.cardgame.events.TableroCreado;
import org.example.cardgame.gateway.JuegoDomainEventRepository;
import org.example.cardgame.values.JugadorId;
import org.example.cardgame.values.TableroId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.when;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class CrearRondaUseCaseTest {

    @Mock
    private JuegoDomainEventRepository repository;

    @InjectMocks
    private CrearRondaUseCase useCase;

    @Test
    void crearRonda(){
        var command = new CrearRondaCommand();
        command.setJuegoId("XXX");
        command.setJugadores(new HashSet<>());
        command.getJugadores().add("DDD");
        command.getJugadores().add("MMM");
        command.setTiempo(12);

        when(repository.obtenerEventosPor("XXX")).thenReturn(history());

        StepVerifier
                .create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent -> {
                    var event = (RondaCreada) domainEvent;
                    return "XXX".equals(event.aggregateRootId()) && event.getTiempo().equals(12) && event.getRonda().value().jugadores().equals(Set.of(JugadorId.of("DDD"),JugadorId.of("MMM")));

                }).expectComplete().verify();





    }

    private Flux<DomainEvent> history() {
        var event = new TableroCreado(TableroId.of("1234"), Set.of(JugadorId.of("999"),JugadorId.of("1111")));
        event.setAggregateRootId("XXX");

        var event2 = new JuegoCreado(JugadorId.of("8888"));
        event2.setAggregateRootId("XXX");


    return  Flux.just(event,event2);

    }


}