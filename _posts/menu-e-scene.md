---
layout: post
title: "Menu e Cambio di Scena"
date: 2026-03-03 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, arcade, game-dev]
---

Finora il nostro gioco parte direttamente in partita. Ma quasi tutti i giochi veri hanno un menu iniziale, una schermata di pausa, una schermata di game over

In arcade, dobbiamo creare delle **View**.

## Tutto in `MyGame`

Se mettiamo menu, gioco e game over nella stessa classe `MyGame`, il codice diventa presto ingestibile:

```python
class MyGame(arcade.Window):
    def on_draw(self):
        if self.stato == "menu":
            # disegna menu...
        elif self.stato == "gioco":
            # disegna gioco...
        elif self.stato == "game_over":
            # disegna game over...

    def on_update(self, delta_time):
        if self.stato == "menu":
            # aggiorna menu...
        elif self.stato == "gioco":
            # aggiorna gioco...
```

Ogni metodo si riempie di `if/elif`. Aggiungere una nuova schermata significa modificare ogni metodo. Questo è molto fastidioso, difficile da mantenere e diventiamo matti a modificare il codice

## `arcade.View`

Arcade ha una soluzione elegante: `arcade.View`.

> **View**: una "schermata" del gioco. Ogni view ha i propri metodi `on_draw`, `on_update`, `on_key_press`, ecc. La finestra mostra una sola view alla volta, e si può cambiare in qualsiasi momento.

Ogni schermata diventa una classe separata:

```
MenuView: schermata iniziale con titolo e pulsanti
GameView: il gioco vero e proprio
PausaView: menu di pausa
GameOverView: schermata "hai perso"
```

## Struttura Base

```python
# file MenuView.py
class MenuView(arcade.View): # MenuView è una View... Ricordiamoci delle sottoclassi!
    def on_draw(self):
        self.clear()
        arcade.draw_text("IL MIO GIOCO", 480, 350,
                         arcade.color.WHITE, font_size=48, anchor_x="center")
        arcade.draw_text("Premi INVIO per iniziare", 480, 250,
                         arcade.color.LIGHT_GRAY, font_size=20, anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.RETURN:
            # Passiamo alla schermata di gioco
            game_view = GameView()
            game_view.setup()
            self.window.show_view(game_view)

# file GameView.py
class GameView(arcade.View):
    def setup(self):
        self.player = Player()
        self.camera = arcade.Camera2D()
        # ... setup del gioco ...

    def on_draw(self):
        self.clear()
        # disegna la scena

    def on_update(self, delta_time: float):
        self.player.update()

    def on_key_press(self, key, modifiers):
        if key == arcade.key.ESCAPE:
            pausa = PauseView(self)  # passiamo noi stessi per poter tornare in futuro, allo stato del gioco che avviene in questo momento
            self.window.show_view(pausa)

# file MyGame.py
class MyGame(arcade.Window):
    def __init__(self):
        super().__init__(960, 540, "Giochino bellino")
        menu = MenuView()
        self.show_view(menu)  # la prima view da mostrare


def main():
    window = MyGame()
    arcade.run()

main()
```

Il metodo che ci interessa è `self.window.show_view(altra_view)`: sostituisce la view corrente quella che passiamo al metodo

##  Pausa

La pausa ha una particolarità: vogliamo **tornare** alla partita esattamente com'era. Dobbiamo quindi salvarci la `GameView` da cui proveniamo:

```python
class PauseView(arcade.View):
    def __init__(self, game_view):
        super().__init__()
        self.game_view = game_view  # teniamo il riferimento alla partita in corso

    def on_draw(self):
        # Disegniamo il gioco sottostante. Non chiamando mai on_update, il gioco viene "freezato"
        self.game_view.on_draw()

        # Poi sovrapponiamo un rettangolo nero semitrasparente
        arcade.draw_rect_filled(
            arcade.XYWH(480, 270, 960, 540),
            (0, 0, 0, 150)  # nero semitrasparente
        )
        # scriviamo quello che dobbiamo scrivere
        arcade.draw_text("PAUSA", 480, 350,
                         arcade.color.WHITE, font_size=48, anchor_x="center")
        arcade.draw_text("INVIO: Riprendi    ESC: Menu principale",
                         480, 250, arcade.color.LIGHT_GRAY, font_size=16, anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.RETURN:
            # Torniamo alla partita in corso
            self.window.show_view(self.game_view)
        elif key == arcade.key.ESCAPE:
            # Torniamo al menu principale (la partita viene abbandonata)
            self.window.show_view(MenuView())
```

## Schermata di Game Over

```python
class GameOverView(arcade.View):
    def __init__(self, punteggio: int):
        super().__init__()
        self.punteggio = punteggio

    def on_draw(self):
        self.clear()
        arcade.draw_text("GAME OVER", 480, 360,
                         arcade.color.RED, font_size=56, anchor_x="center")
        arcade.draw_text(f"Punteggio: {self.punteggio}", 480, 280,
                         arcade.color.WHITE, font_size=28, anchor_x="center")
        arcade.draw_text("R   Rigioca             M    Menu", 480, 180,
                         arcade.color.LIGHT_GRAY, font_size=18, anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.R:
            nuova_partita = GameView()
            nuova_partita.setup()
            self.window.show_view(nuova_partita)
        elif key == arcade.key.M:
            self.window.show_view(MenuView())
```

E nella `GameView`, quando il giocatore muore:

```python
    def on_update(self, delta_time: float):
        self.player.update()

        if not self.player.is_alive():
            game_over = GameOverView(punteggio=self.punteggio)
            self.window.show_view(game_over)
```

## Livelli 

Lo stesso meccanismo vale per i livelli. Ogni livello può essere una view separata, oppure la stessa `GameView` con un parametro `livello`:

```python
class GameView(arcade.View):
    def __init__(self, livello: int = 1):
        super().__init__()
        self.livello = livello

    def setup(self):
        # Carichiamo la mappa del livello corrente
        # ... ecc ecc

    def on_update(self, delta_time: float):
        self.player.update()

        # Il giocatore ha raggiunto l'uscita?
        if self.player_ha_completato_livello():
            if self.livello < LIVELLO_MASSIMO:
                prossimo = GameView(livello=self.livello + 1)
                prossimo.setup()
                self.window.show_view(prossimo)
            else:
                # Gioco completato!
                self.window.show_view(FineGiocoView())
```

Attenzione a non creare **import circolari** (A importa B, B importa A) se iniziate ad avere numerose classi!

Alla prossima!
