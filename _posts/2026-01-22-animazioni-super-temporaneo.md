---
layout: post
title: "Animare gli sprite"
date: 2026-01-22 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, refactoring]
---

Super super temporaneo

https://dev.to/kartik_patel/spritesheet-and-animation-4iik

Per il momento (da rifare)

```python
import arcade
from constants import WORLD_WIDTH, WORLD_HEIGHT, PLAYER_IDLE_SOURCE, PLAYER_WALK_SOURCE, UPDATES_PER_FRAME, MOVEMENT_SPEED, UPDATES_PER_FRAME_WALK

class Player(arcade.Sprite):
    def __init__(self):
        super().__init__()
        self.scale = 1.6
        self.center_x = WORLD_WIDTH // 2
        self.center_y = WORLD_HEIGHT // 2
        
        # Animazioni per direzione
        self.idle_textures = {
            'up': [],
            'left': [],
            'down': [],
            'right': []
        }
        self.walk_textures = {
            'up': [],
            'left': [],
            'down': [],
            'right': []
        }
        self.current_texture = 0
        self.texture_change_frames = 0
        
        # Controlli
        self.up_pressed = False
        self.down_pressed = False
        self.left_pressed = False
        self.right_pressed = False
        
        # Direzione corrente
        self.current_direction = 'down'  # Direzione di default
        
        self.health = 100
        self.max_health = 100
        
        self.load_animations()
        self.texture = self.idle_textures['down'][0]
    
    def load_animations(self):
        """Carica tutte le animazioni del player"""
        idle_sheet = arcade.load_spritesheet(PLAYER_IDLE_SOURCE)
        
        # Carica idle per ogni direzione (4 rows, 2 columns)
        textures = idle_sheet.get_texture_grid(
            size=(64, 64),
            columns=2,
            count=8,
            margin=(0, 0, 0, 0)
        )
        # Row 1: up
        self.idle_textures['up'] = textures[:2]
        
        # Row 2: left
        self.idle_textures['left'] = textures[2:4]
        
        # Row 3: down
        self.idle_textures['down'] = textures[4:6]
        
        # Row 4: right
        self.idle_textures['right'] = textures[6:8]
        
        # Carica walk animation (come prima)
        walk_sheet = arcade.load_spritesheet(PLAYER_WALK_SOURCE)
        textures = walk_sheet.get_texture_grid(
            size=(64, 64),
            columns=9,
            count=36,
            margin=(0, 0, 0, 0)
        )
        self.walk_textures['up'] = textures[:9]
        self.walk_textures['left'] = textures[9:18]
        self.walk_textures['down'] = textures[18:27]
        self.walk_textures['right'] = textures[27:36]
    
    def update_animation(self, delta_time):
        """Aggiorna l'animazione del player"""
        # Calcola movimento
        change_x = 0
        change_y = 0
        
        if self.up_pressed:
            change_y += MOVEMENT_SPEED
        if self.down_pressed:
            change_y -= MOVEMENT_SPEED
        if self.left_pressed:
            change_x -= MOVEMENT_SPEED
        if self.right_pressed:
            change_x += MOVEMENT_SPEED
        
        # Determina direzione basata sul movimento
        if change_y > 0:
            self.current_direction = 'up'
        elif change_y < 0:
            self.current_direction = 'down'
        elif change_x < 0:
            self.current_direction = 'left'
        elif change_x > 0:
            self.current_direction = 'right'
        
        # Determina animazione
        is_moving = change_x != 0 or change_y != 0
        
        if is_moving:
            current_animation = self.walk_textures[self.current_direction]
        else:
            # Usa l'idle animation per la direzione corrente
            current_animation = self.idle_textures[self.current_direction]
        
        frame_check = UPDATES_PER_FRAME_WALK if is_moving else UPDATES_PER_FRAME
        # Aggiorna frame
        self.texture_change_frames += 1
        if self.texture_change_frames >= frame_check:
            self.texture_change_frames = 0
            self.current_texture = (self.current_texture + 1) % len(current_animation)
            self.texture = current_animation[self.current_texture]
        
        # # Flip sprite solo per left/right se necessario
        # if self.current_direction == 'left':
        #     self.scale = (-3, 3)
        # else:
        #     self.scale = (3, 3)
        
        return change_x, change_y
    
    def handle_key_press(self, key):
        """Gestisce la pressione dei tasti"""
        if key in (arcade.key.UP, arcade.key.W):
            self.up_pressed = True
        elif key in (arcade.key.DOWN, arcade.key.S):
            self.down_pressed = True
        elif key in (arcade.key.LEFT, arcade.key.A):
            self.left_pressed = True
        elif key in (arcade.key.RIGHT, arcade.key.D):
            self.right_pressed = True
    
    def handle_key_release(self, key):
        """Gestisce il rilascio dei tasti"""
        if key in (arcade.key.UP, arcade.key.W):
            self.up_pressed = False
        elif key in (arcade.key.DOWN, arcade.key.S):
            self.down_pressed = False
        elif key in (arcade.key.LEFT, arcade.key.A):
            self.left_pressed = False
        elif key in (arcade.key.RIGHT, arcade.key.D):
            self.right_pressed = False
    
    def take_damage(self, amount):
        """Applica danno al player"""
        self.health -= amount
        if self.health < 0:
            self.health = 0
        print(f"Player health: {self.health}/{self.max_health}")
    
    def is_alive(self):
        """Controlla se il player è vivo"""
        return self.health > 0
```