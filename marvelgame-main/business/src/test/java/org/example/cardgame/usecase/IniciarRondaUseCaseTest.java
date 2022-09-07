package org.example.cardgame.usecase;

import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.command.IniciarRondaCommand;
import org.example.cardgame.events.RondaCreada;
import org.example.cardgame.events.RondaIniciada;
import org.example.cardgame.events.TableroCreado;
import org.example.cardgame.gateway.JuegoDomainEventRepository;
import org.example.cardgame.values.JugadorId;
import org.example.cardgame.values.Ronda;
import org.example.cardgame.values.TableroId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Set;

import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class IniciarRondaUseCaseTest {

    @Mock
    private JuegoDomainEventRepository repository;

    @InjectMocks
    private IniciarRondaUseCase useCase;


    @Test
    void iniciarRonda(){
        var command = new IniciarRondaCommand();
        command.setJuegoId("XXX");

        when(repository.obtenerEventosPor("XXX")).thenReturn(history());

        StepVerifier.create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent ->{
                    var event = (RondaIniciada) domainEvent;
                     return "XXX".equals(event.aggregateRootId());
                }).expectComplete().verify();
    }

    private Flux<DomainEvent> history() {
        var event = new RondaCreada(new Ronda(12, Set.of(JugadorId.of("DDD"),JugadorId.of("QQQ"))),12);
        var event2 = new TableroCreado(TableroId.of("RRR"),Set.of(JugadorId.of("ttt"),JugadorId.of("yyy")));
        return Flux.just(event2,event);

    }


}