---
published: true
layout: post
title: "Building a Simple Platformer Game"
date: 2024-01-26 16:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, platformer, game, tutorial]
---
published: true

Platformer games are a classic genre. Learn how to create a simple platformer game using Python Arcade with jumping, platforms, and basic physics.

## Game Setup

Create the basic game structure:

```python
import arcade

SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 650
SCREEN_TITLE = "Platformer Demo"

class PlatformerGame(arcade.Window):
    def __init__(self):
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)

        # Sprite lists
        self.player_list = None
        self.wall_list = None
        self.coin_list = None

        # Player
        self.player = None

        # Physics engine
        self.physics_engine = None

        # Camera
        self.camera = None

        arcade.set_background_color(arcade.csscolor.CORNFLOWER_BLUE)
```

## Creating Platforms

Add platforms and walls:

```python
def setup(self):
    # Create sprite lists
    self.player_list = arcade.SpriteList()
    self.wall_list = arcade.SpriteList()
    self.coin_list = arcade.SpriteList()

    # Create player
    self.player = arcade.Sprite(":resources:images/animated_characters/female_person/femalePerson_idle.png", 0.4)
    self.player.center_x = 64
    self.player.center_y = 128
    self.player_list.append(self.player)

    # Create ground
    for x in range(0, 1250, 64):
        wall = arcade.Sprite(":resources:images/tiles/grassMid.png", 0.5)
        wall.center_x = x
        wall.center_y = 32
        self.wall_list.append(wall)

    # Create platforms
    coordinate_list = [[256, 96], [512, 96], [768, 96]]
    for coordinate in coordinate_list:
        wall = arcade.Sprite(":resources:images/tiles/grassMid.png", 0.5)
        wall.position = coordinate
        self.wall_list.append(wall)

    # Create physics engine
    self.physics_engine = arcade.PhysicsEnginePlatformer(
        self.player,
        self.wall_list,
        gravity_constant=0.5
    )

    # Setup camera
    self.camera = arcade.Camera(SCREEN_WIDTH, SCREEN_HEIGHT)
```

## Player Movement

Handle player input and movement:

```python
def on_key_press(self, key, modifiers):
    if key == arcade.key.LEFT or key == arcade.key.A:
        self.player.change_x = -5
    elif key == arcade.key.RIGHT or key == arcade.key.D:
        self.player.change_x = 5
    elif key == arcade.key.UP or key == arcade.key.W:
        if self.physics_engine.can_jump():
            self.player.change_y = 10
            arcade.play_sound(self.jump_sound)

def on_key_release(self, key, modifiers):
    if key == arcade.key.LEFT or key == arcade.key.A:
        self.player.change_x = 0
    elif key == arcade.key.RIGHT or key == arcade.key.D:
        self.player.change_x = 0
```

## Game Loop

Update and render the game:

```python
def on_update(self, delta_time):
    # Update physics
    self.physics_engine.update()

    # Update camera to follow player
    self.center_camera_to_player()

    # Check for coin collection
    coin_hit_list = arcade.check_for_collision_with_list(
        self.player, self.coin_list)

    for coin in coin_hit_list:
        coin.remove_from_sprite_lists()
        arcade.play_sound(self.coin_sound)

def center_camera_to_player(self):
    screen_center_x = self.player.center_x - (self.camera.viewport_width / 2)
    screen_center_y = self.player.center_y - (self.camera.viewport_height / 2)

    # Don't let camera travel beyond 0
    if screen_center_x < 0:
        screen_center_x = 0
    if screen_center_y < 0:
        screen_center_y = 0

    player_centered = screen_center_x, screen_center_y
    self.camera.move_to(player_centered)

def on_draw(self):
    arcade.start_render()

    # Activate camera
    self.camera.use()

    # Draw all sprite lists
    self.wall_list.draw()
    self.coin_list.draw()
    self.player_list.draw()
```

## Adding Coins

Add collectible coins:

```python
# In setup method
for x in range(128, 1250, 256):
    coin = arcade.Sprite(":resources:images/items/coinGold.png", 0.5)
    coin.center_x = x
    coin.center_y = 96
    self.coin_list.append(coin)

# Load sounds
self.jump_sound = arcade.load_sound(":resources:sounds/jump1.wav")
self.coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")
```

This creates a basic platformer game with jumping, platforms, and coin collection. You can extend it with enemies, power-ups, and more levels!