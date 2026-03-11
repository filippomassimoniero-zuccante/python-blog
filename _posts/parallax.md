---
layout: post
title: "Parallax"
date: 2026-03-03 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, arcade, game-dev]
---

Avete mai guardato fuori dal finestrino quando siete in un treno o in macchina? Gli alberi vicini sembrano scompaiono dalla vista, rapidissimi, mentre le montagne sullo sfondo si muovono lentamente. Questo effetto si chiama **parallasse** (parallax), ed è uno dei trucchi più semplici che possiamo usare per dare profondità ai nostri giochi platformer 2D.

E se ci fate caso, è usato praticamente dappertutto nei giochi platformer

## Cos'è il Parallasse

> **Parallasse**: fenomeno per cui oggetti a distanze diverse sembrano muoversi a velocità diverse rispetto all'osservatore

Nei giochi 2D lo si simula con più **livelli di sfondo** sovrapposti, ognuno che scorre a una velocità diversa rispetto alla camera:

- Lo sfondo più lontano (cielo, montagne) scorre molto lentamente
- Gli strati intermedi (alberi, colline) scorrono un po' più velocemente
- Il terreno si muove alla velocità del giocatore 

Il risultato è un'illusione di profondità 

Ogni layer ha un parametro **depth** ("profondità"): più alto è il valore, più il layer è lontano e più scorre lentamente. Un layer con `depth=10` si muoverà più lentamente di uno con `depth=1`.

## `ParallaxGroup`

Arcade mette a disposizione `arcade.future.background.ParallaxGroup`, che gestisce tutto questo automaticamente. Attenzione che è una feature sperimentale e la sintassi in futuro potrebbe cambiare

Vediamo come usarla:

```python
import arcade
import arcade.future.background as background


WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 800
CAMERA_SPEED = 0.1


class GameView(arcade.View):
    def __init__(self):
        super().__init__()
        self.background_color = (162, 84, 162, 255)
        self.camera = arcade.Camera2D()

        # Creiamo il gruppo che gestirà tutti i layer
        self.backgrounds = background.ParallaxGroup()

        bg_size = (WINDOW_WIDTH, WINDOW_HEIGHT)

        # Aggiungiamo i layer dal più lontano al più vicino.
        # depth alto = lontano = scorre lento
        self.backgrounds.add_from_file("assets/layers/cielo.png",    size=bg_size, depth=10.0)
        self.backgrounds.add_from_file("assets/layers/montagne.png", size=bg_size, depth=5.0)
        self.backgrounds.add_from_file("assets/layers/alberi.png",   size=bg_size, depth=3.0)
        self.backgrounds.add_from_file("assets/layers/strada.png",   size=bg_size, depth=1.0)

        self.player = arcade.Sprite("assets/player.png")
        self.player.bottom = 0 # mette il giocatore in basso
        self.x_velocity = 0 # usata per la gestione del movimento, per spostare il giocatore

    def on_draw(self):
        self.clear() # pulisco lo schermo
        self.camera.use()

        bg = self.backgrounds

        # Sposta i layer simulando la profondità
        bg.offset = self.camera.bottom_left
        # Segue la camera per simulare un "mondo infinito"
        bg.pos = self.camera.bottom_left

        bg.draw()
        arcade.draw_sprite(self.player)

    def pan_camera_to_player(self):
        # La camera segue il giocatore in modo "smooth" (lerp). Guarda l'altro blog sulla camera
        self.camera.position = arcade.math.lerp_2d(
            self.camera.position,
            (self.player.center_x, self.height // 2),
            CAMERA_SPEED
        )

    def on_update(self, delta_time: float):
        self.player.center_x += self.x_velocity * delta_time
        self.pan_camera_to_player()

    def on_key_press(self, symbol: int, modifiers: int):
        #gestione del movimento solita
```


Alla prossima!
