package org.example.cardgame.usecase;

import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.command.IniciarJuegoCommand;
import org.example.cardgame.events.JuegoCreado;
import org.example.cardgame.events.RondaIniciada;
import org.example.cardgame.events.TableroCreado;
import org.example.cardgame.gateway.JuegoDomainEventRepository;
import org.example.cardgame.values.JugadorId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
class IniciarJuegoUseCaseTest {

    @Mock
    private JuegoDomainEventRepository repository;

    @InjectMocks
    private IniciarJuegoUseCase useCase;


    @Test
    void IniciarJuego(){
    var command = new IniciarJuegoCommand();
    command.setJuegoId("XXX");

    when(repository.obtenerEventosPor("XXX")).thenReturn(history());


        StepVerifier.create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent -> {
                    var event = (TableroCreado) domainEvent;
                    return "XXX".equals(event.aggregateRootId());
                }).expectComplete().verify();


    }

    private Flux<DomainEvent> history() {
        var event = new JuegoCreado(JugadorId.of("RRR"));
        return Flux.just(event);
    }

}