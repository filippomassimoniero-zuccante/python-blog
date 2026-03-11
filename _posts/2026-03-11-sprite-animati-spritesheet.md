---
layout: post
title: "Sprite Animati e Spritesheet"
date: 2026-03-03 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, arcade, game-dev]
---

In questo post vediamo come funzionano gli spritesheet e costruiamo una classe `SpriteAnimato` riutilizzabile che gestisce le animazioni per noi

## Cosa sono gli sprite

Nei videogiochi 2D, uno **sprite** è un'immagine 2D che rappresenta un personaggio, un nemico, un oggetto... qualsiasi cosa visiva che si muove o interagisce nel gioco.

In arcade, la classe `arcade.Sprite` gestisce già molte cose per noi: posizione, collisioni, scala. Quello che dobbiamo fare noi è dirgli *quale immagine mostrare* e *quando cambiarla*

## Spritesheet

Animare uno sprite significa mostrare immagini diverse in rapida successione.

Il problema è che caricare decine di file immagine separati è lento e scomodo. La soluzione classica è lo **spritesheet**:

> **Spritesheet**: un'unica immagine che contiene tutti i frame di un'animazione disposti in una griglia

Invece di avere `player_walk_01.png`, `player_walk_02.png`, ... `player_walk_09.png`, avete un solo file `player_walk.png` con tutti i frame affiancati in righe e colonne:

```
riga 0 (su):        [ f0 ][ f1 ][ f2 ] ... [ f8 ]
riga 1 (sinistra):  [ f0 ][ f1 ][ f2 ] ... [ f8 ]
riga 2 (giù):       [ f0 ][ f1 ][ f2 ] ... [ f8 ]
riga 3 (destra):    [ f0 ][ f1 ][ f2 ] ... [ f8 ]
```

Ogni cella della griglia ha la stessa dimensione (per esempio 64×64 pixel).

## La Classe `SpriteAnimato`

Invece di riscrivere ogni volta la logica di animazione, creiamo una classe `SpriteAnimato` che estende `arcade.Sprite`. Supporta più animazioni con nome, ognuna con la propria durata e comportamento (continuo a ripeterla in loop o mostro l'animazione una volta sola?)

Create un file sprite_animato.py 

Se vuoi vedere come funziona, bene. Altrimenti non preoccuparti è facile da usare
```python
import arcade

class SpriteAnimato(arcade.Sprite):
    def __init__(self, scala: float = 1.0):
        super().__init__(scale=scala)
        self.animazioni = {}          # nome -> dizionario con textures, durata_frame, loop
        self.animazione_corrente = None
        self.animazione_default = None
        self.tempo_frame = 0.0
        self.indice_frame = 0

    def aggiungi_animazione(
        self,
        nome: str,
        percorso: str,
        frame_width: int,
        frame_height: int,
        num_frame: int,
        colonne: int,
        durata: float,
        loop: bool = True,
        default: bool = False,
        riga: int = 0,
    ):
        """
        Carica uno spritesheet e registra l'animazione con il nome dato.

        loop    : se True l'animazione riparte dall'inizio quando finisce
        default : se True questa è l'animazione di riposo (quella a cui si
                  torna automaticamente quando una animazione non in loop finisce)
        riga    : riga dello spritesheet da cui estrarre i frame (0 = prima riga)
        """
        sheet = arcade.load_spritesheet(percorso)
        offset = riga * colonne
        tutti = sheet.get_texture_grid(
            size=(frame_width, frame_height),
            columns=colonne,
            count=offset + num_frame,
        )
        self._registra(nome, tutti[offset:], durata, loop, default)

    def _registra(self, nome, textures, durata, loop, default=False):
        """Usato internamente per registrare texture già caricate."""
        self.animazioni[nome] = {
            "textures": textures,
            "durata_frame": durata / len(textures),
            "loop": loop,
        }
        if default or self.animazione_default is None:
            self.animazione_default = nome
        if self.animazione_corrente is None:
            self._vai(nome)

    def imposta_animazione(self, nome: str):
        """Cambia animazione (ignorata se è già quella attiva, evita reset del frame)."""
        if nome != self.animazione_corrente:
            self._vai(nome)

    def _vai(self, nome: str):
        self.animazione_corrente = nome
        self.indice_frame = 0
        self.tempo_frame = 0.0
        self.texture = self.animazioni[nome]["textures"][0]

    def update_animation(self, delta_time: float = 1 / 60):
        anim = self.animazioni[self.animazione_corrente]
        self.tempo_frame += delta_time

        if self.tempo_frame < anim["durata_frame"]:
            return  # non è ancora il momento di cambiare frame

        self.tempo_frame -= anim["durata_frame"]
        prossimo = self.indice_frame + 1

        if prossimo < len(anim["textures"]):
            # Frame successivo nello stesso ciclo
            self.indice_frame = prossimo
        elif anim["loop"]:
            # Fine ciclo: ricominciamo da capo
            self.indice_frame = 0
        else:
            # Animazione finita e non looppa: torna alla default
            self._vai(self.animazione_default)
            return

        self.texture = anim["textures"][self.indice_frame]
```

A noi ci interessano solo questi metodi
- `aggiungi_animazione` per registrare un'animazione. Per esempio `giocatore_attacco_spada`
- `imposta_animazione` lo chiamiamo quando vogliamo che l'animazione parta. Per esempio, se abbiamo cliccato con il tasto sinistro del mouse, allora deve partire quell'animazione
- `update_animation` chiamala ogni volta nel tuo `on_update`

### Note

Usiamo `delta_time`, il tempo in secondi trascorso dall'ultimo frame, e non contiamo i frame del gioco. In questo modo l'animazione va alla stessa velocità indipendentemente dagli FPS.

Il parametro `riga` è particolarmente utile quando un unico file contiene più animazioni su righe diverse (come il walk sheet con le 4 direzioni)

## Usare `SpriteAnimato`

Per uno sprite semplice con una sola animazione:

```python
fuoco = SpriteAnimato(scala=1.5)
fuoco.aggiungi_animazione(
    nome="brucia",
    percorso="assets/fuoco.png",
    frame_width=64, frame_height=64,
    num_frame=9, colonne=9,
    durata=0.6,
    loop=True,
    default=True, # possiamo avere solo 1 animazione di default
)
```

Per uno sprite con più animazioni, per esempio un personaggio con `idle` e `attacca`:

```python
guerriero = SpriteAnimato(scala=2.0)

guerriero.aggiungi_animazione(
    nome="idle",
    percorso="assets/guerriero_idle.png",
    frame_width=64, frame_height=64,
    num_frame=4, colonne=4,
    durata=0.8,
    loop=True,
    default=True,   # quando "attacca" finisce, torna qui automaticamente
)
guerriero.aggiungi_animazione(
    nome="attacca",
    percorso="assets/guerriero_attacco.png",
    frame_width=64, frame_height=64,
    num_frame=6, colonne=6,
    durata=0.4,
    loop=False,     # si riproduce una volta sola, poi torna all'idle
)
```

Per far partire l'attacco:

```python
guerriero.imposta_animazione("attacca")
```

Quando i 6 frame finiscono, `SpriteAnimato` torna da solo all'`idle`.

## Estendere `SpriteAnimato`: la classe `Player`

Per un personaggio con animazioni per 4 direzioni, estendiamo la classe. Grazie al parametro `riga`, registrare tutte e 8 le animazioni (idle e walk per ogni direzione) richiede un solo ciclo `for`:

```python
PLAYER_IDLE_SOURCE = "assets/player_idle.png"  # 4 righe × 2 colonne, 64×64 px
PLAYER_WALK_SOURCE = "assets/player_walk.png"  # 4 righe × 9 colonne, 64×64 px
# Ordine righe in entrambi: su / sinistra / giù / destra

class Player(SpriteAnimato):
    DIREZIONI = ["su", "sinistra", "giu", "destra"]

    def __init__(self):
        super().__init__(scala=2.0)

        for i, dir in enumerate(self.DIREZIONI):
            self.aggiungi_animazione(f"idle_{dir}", PLAYER_IDLE_SOURCE,
                frame_width=64, frame_height=64, num_frame=2, colonne=2,
                durata=0.8, loop=True, default=(dir == "giu"), riga=i)
            self.aggiungi_animazione(f"walk_{dir}", PLAYER_WALK_SOURCE,
                frame_width=64, frame_height=64, num_frame=9, colonne=9,
                durata=0.6, loop=True, riga=i)

        self.direzione = "giu"
        self.su = self.giu = self.sinistra = self.destra = False

    def update_animation(self, delta_time: float = 1 / 60):
        dx = dy = 0
        if self.su:       
            dy += 4
        if self.giu:      
            dy -= 4
        if self.sinistra: 
            dx -= 4
        if self.destra:   
            dx += 4

        # da fare: capire in che direzione stiamo andando e impostare self.direzione

        # Scegliamo walk o idle
        if dx != 0 or dy != 0:
            self.imposta_animazione(f"walk_{self.direzione}")
        else:
            self.imposta_animazione(f"idle_{self.direzione}")

        super().update_animation(delta_time)

        # Muoviamo il personaggio ecc

    def on_key_press(self, key):
        # ....
```


Alla prossima!
