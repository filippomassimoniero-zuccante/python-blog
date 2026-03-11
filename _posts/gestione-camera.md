---
layout: post
title: "Gestire la Camera"
date: 2026-03-03 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, arcade, game-dev]
---

Attualmente, se il giocatore si muove, potrebbe "usicre" dallo schermo, e non lo vediamo più. Abbiamo bisogno di una telecamera che lo segua.

## Camera

Pensate a un film: l'attore si muove, e il cameraman lo segue. Lo schermo del cinema non mostra il set intero, ma solo quello che la telecamera inquadra.

Nel nostro gioco è uguale:

- Il **mondo** è grande (per esempio 3000×3000 pixel)
- La **finestra** è piccola (per esempio 960×540 pixel)
- La **camera** decide quale parte del mondo mostrare


## `arcade.Camera2D`

Arcade mette a disposizione `arcade.Camera2D`

```python
import arcade

class MyGame(arcade.Window):
    def __init__(self):
        super().__init__(960, 540, "Il Mio Gioco")
        self.player = None
        self.camera = None

    def setup(self):
        self.player = Player()  # il vostro sprite player
        self.camera = arcade.Camera2D()

    def on_draw(self):
        self.clear()
        # Attiviamo la camera prima di disegnare il mondo
        self.camera.use()
        self.player.draw()
        # ... draw del resto del mondo ...
```

Senza fare altro, la camera è centrata nell'origine (0, 0) e non si muove. Dobbiamo spostarla noi.

## Seguire il Giocatore

Il modo più semplice è spostare la camera alla posizione del giocatore ad ogni frame, nell'`on_update`:

```python
    def on_update(self, delta_time: float):
        # Aggiorna il giocatore
        self.player.update()

        # Centrate la camera sul giocatore
        self.camera.position = (self.player.center_x, self.player.center_y)
```

Con `camera.position` impostiamo il punto al centro dello schermo. Se il giocatore è a (500, 300), la camera mostrerà il mondo centrato su (500, 300).

## Limitare la Camera ai Bordi del Mondo

Se il giocatore si avvicina al bordo del mondo, la camera non deve andare oltre — altrimenti vedremo il "vuoto" fuori dalla mappa.

Dobbiamo **clampare** (limitare) la posizione della camera:

```python
WORLD_WIDTH = 3000
WORLD_HEIGHT = 3000
SCREEN_WIDTH = 960
SCREEN_HEIGHT = 540

def centra_camera_sul_player(self):
    x = self.player.center_x
    y = self.player.center_y

    # Margini: la camera non può vedere oltre i bordi del mondo
    x_min = SCREEN_WIDTH / 2
    x_max = WORLD_WIDTH - SCREEN_WIDTH / 2
    y_min = SCREEN_HEIGHT / 2
    y_max = WORLD_HEIGHT - SCREEN_HEIGHT / 2

    # Limitiamo x e y ai margini
    x = max(x_min, min(x, x_max))
    y = max(y_min, min(y, y_max))

    self.camera.position = (x, y)
```

`max(x_min, min(x, x_max))` è un pattern comune: prima limitiamo dall'alto con `min`, poi dal basso con `max`. Risultato: x rimane sempre tra `x_min` e `x_max`.

## Camera smooth (Lerp)

La camera che segue esattamente il giocatore funziona, ma può sembrare rigida. Una tecnica classica è la **camera con lerp** (interpolazione lineare):

> **Lerp**: invece di saltare direttamente alla posizione target, la camera si avvicina gradualmente, percorrendo una frazione della distanza ad ogni frame.

```python
def centra_camera_lerp(self, velocita: float = 0.1):
    # Posizione attuale della camera
    cam_x, cam_y = self.camera.position

    # Target: dove vogliamo arrivare?
    target_x = self.player.center_x
    target_y = self.player.center_y

    # Lerp: ci spostiamo del 10% della distanza rimasta
    nuovo_x = cam_x + (target_x - cam_x) * velocita
    nuovo_y = cam_y + (target_y - cam_y) * velocita

    self.camera.position = (nuovo_x, nuovo_y)
```

Con `velocita = 0.1`, la camera percorre il 10% della distanza che la separa dal giocatore ad ogni frame. Più il valore è vicino a 1, più è reattiva; più è vicino a 0, più è fluida.

Potete (dovete) combinare lerp e clamping:

```python
def aggiorna_camera(self):
    cam_x, cam_y = self.camera.position

    # Lerp verso il player
    target_x = cam_x + (self.player.center_x - cam_x) * 0.1
    target_y = cam_y + (self.player.center_y - cam_y) * 0.1

    # Clamping ai bordi
    target_x = max(SCREEN_WIDTH / 2, min(target_x, WORLD_WIDTH - SCREEN_WIDTH / 2))
    target_y = max(SCREEN_HEIGHT / 2, min(target_y, WORLD_HEIGHT - SCREEN_HEIGHT / 2))

    self.camera.position = (target_x, target_y)
```

## UI: Disegnare Fuori dalla Camera

Un problema comune: se abbiamo una **HUD** (punteggio, barre della vita, minimap), questi non devono muoversi assieme alla camera!

La soluzione è usare una seconda camera:

```python
class MyGame(arcade.Window):
    def setup(self):
        self.camera_mondo = arcade.Camera2D()   # segue il giocatore
        self.camera_ui = arcade.Camera2D()      # sempre ferma

    def on_draw(self):
        self.clear()

        # Disegno del mondo con la camera mobile
        self.camera_mondo.use()
        self.sprite_list.draw()

        # Disegno dell'interfaccia con la camera fissa
        self.camera_ui.use()
        arcade.draw_text(f"Vita: {self.player.health}", 20, 20, arcade.color.WHITE, 18)
```

`self.camera_ui` non viene mai spostata, quindi le coordinate UI sono sempre relative all'angolo in basso a sinistra dello schermo.

Alla prossima!
