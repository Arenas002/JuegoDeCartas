package org.example.cardgame.usecase;

import org.example.cardgame.command.CrearJuegoCommand;
import org.example.cardgame.events.JuegoCreado;
import org.example.cardgame.events.JugadorAgregado;
import org.example.cardgame.gateway.JuegoDomainEventRepository;
import org.example.cardgame.gateway.ListaDeCartaService;
import org.example.cardgame.gateway.model.CartaMaestra;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.when;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class CrearJuegoUseCaseTest {

    @Mock
    private ListaDeCartaService listaDeCartaService;

    @InjectMocks
    private CrearJuegoUseCase useCase;

    @Test
    void crearJuego(){
        var command = new CrearJuegoCommand();
    command.setJuegoId("MMM");
    command.setJugadores(new HashMap<>());
    command.getJugadores().put("xxxx","julio");
    command.getJugadores().put("jjj","juan");
    command.setJugadorPrincipalId("123");

    when(listaDeCartaService.obtenerCartasDeMarvel()).thenReturn(history());

        StepVerifier.create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent ->{
                    var event = (JuegoCreado) domainEvent;
                    return "MMM".equals(event.aggregateRootId()) && "123".equals(event.getJugadorPrincipal().value());
                } ).expectNextMatches(domainEvent -> {
                    var event = (JugadorAgregado) domainEvent;
                    Assertions.assertEquals(5,event.getMazo().value().cantidad());
                    return "xxxx".equals(event.getJuegoId().value())&& "julio".equals(event.getAlias());
                }).expectNextMatches(domainEvent ->{
                    var event = (JugadorAgregado) domainEvent;
                    Assertions.assertEquals(5,event.getMazo().value().cantidad());
                    return "jjj".equals(event.getJuegoId().value())&& "juan".equals(event.getAlias());
                }).expectComplete()
                .verify();


    }

  private Flux<CartaMaestra>history() {
    return Flux.just(
      new CartaMaestra("1","carta1"),
      new CartaMaestra("2","carta2"),
      new CartaMaestra("3","carta3"),
      new CartaMaestra("4","carta4"),
      new CartaMaestra("5","carta5"),

      new CartaMaestra("6","carta6"),
      new CartaMaestra("7","carta7"),
      new CartaMaestra("8","carta8"),
      new CartaMaestra("9","carta9"),
      new CartaMaestra("10","carta10")

        );
  }



}