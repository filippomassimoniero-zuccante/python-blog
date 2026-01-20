---
published: true
layout: post
title: "Creating a Space Shooter Game"
date: 2024-01-30 20:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, shooter, game, tutorial]
---
published: true

Space shooters are classic arcade games. Learn how to create a complete space shooter game with Python Arcade.

## Game Structure

Set up the basic game framework:

```python
import arcade
import random

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
SCREEN_TITLE = "Space Shooter"

class SpaceShooter(arcade.Window):
    def __init__(self):
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)

        # Sprite lists
        self.player_list = None
        self.enemy_list = None
        self.bullet_list = None
        self.enemy_bullet_list = None

        # Player
        self.player = None
        self.score = 0

        # Background
        arcade.set_background_color(arcade.color.BLACK)
```

## Player Ship

Create the player-controlled spaceship:

```python
def setup(self):
    # Create sprite lists
    self.player_list = arcade.SpriteList()
    self.enemy_list = arcade.SpriteList()
    self.bullet_list = arcade.SpriteList()
    self.enemy_bullet_list = arcade.SpriteList()

    # Create player ship
    self.player = arcade.Sprite("images/player_ship.png", 0.5)
    self.player.center_x = SCREEN_WIDTH / 2
    self.player.center_y = 50
    self.player_list.append(self.player)

    # Load sounds
    self.shoot_sound = arcade.load_sound("sounds/laser.wav")
    self.explosion_sound = arcade.load_sound("sounds/explosion.wav")
```

## Player Movement and Shooting

Handle player controls:

```python
def on_key_press(self, key, modifiers):
    if key == arcade.key.LEFT:
        self.player.change_x = -5
    elif key == arcade.key.RIGHT:
        self.player.change_x = 5
    elif key == arcade.key.SPACE:
        self.shoot_bullet()

def on_key_release(self, key, modifiers):
    if key == arcade.key.LEFT or key == arcade.key.RIGHT:
        self.player.change_x = 0

def shoot_bullet(self):
    bullet = arcade.Sprite("images/player_bullet.png", 0.8)
    bullet.center_x = self.player.center_x
    bullet.center_y = self.player.top
    bullet.change_y = 8
    self.bullet_list.append(bullet)
    arcade.play_sound(self.shoot_sound)
```

## Enemy Management

Create and manage enemy ships:

```python
def spawn_enemy(self):
    enemy = arcade.Sprite("images/enemy_ship.png", 0.4)
    enemy.center_x = random.randint(50, SCREEN_WIDTH - 50)
    enemy.center_y = SCREEN_HEIGHT + 50
    enemy.change_y = -2
    self.enemy_list.append(enemy)

def update(self, delta_time):
    # Update all sprites
    self.player_list.update()
    self.enemy_list.update()
    self.bullet_list.update()
    self.enemy_bullet_list.update()

    # Keep player in bounds
    if self.player.left < 0:
        self.player.left = 0
    elif self.player.right > SCREEN_WIDTH:
        self.player.right = SCREEN_WIDTH

    # Spawn enemies
    if random.random() < 0.02:  # 2% chance each frame
        self.spawn_enemy()

    # Remove off-screen enemies
    for enemy in self.enemy_list:
        if enemy.top < 0:
            enemy.remove_from_sprite_lists()

    # Remove off-screen bullets
    for bullet in self.bullet_list:
        if bullet.bottom > SCREEN_HEIGHT:
            bullet.remove_from_sprite_lists()

    # Check collisions
    self.check_collisions()
```

## Collision Detection

Handle bullet-enemy and player-enemy collisions:

```python
def check_collisions(self):
    # Player bullets vs enemies
    for bullet in self.bullet_list:
        hit_list = arcade.check_for_collision_with_list(bullet, self.enemy_list)
        if hit_list:
            bullet.remove_from_sprite_lists()
            for enemy in hit_list:
                enemy.remove_from_sprite_lists()
                self.score += 10
                arcade.play_sound(self.explosion_sound)
                self.create_explosion(enemy.center_x, enemy.center_y)

    # Enemy bullets vs player
    for bullet in self.enemy_bullet_list:
        if arcade.check_for_collision(bullet, self.player):
            bullet.remove_from_sprite_lists()
            self.player_hit()

    # Enemies vs player
    for enemy in self.enemy_list:
        if arcade.check_for_collision(enemy, self.player):
            self.game_over()
```

## Enemy AI

Give enemies basic shooting behavior:

```python
def enemy_ai(self):
    for enemy in self.enemy_list:
        # Random chance to shoot
        if random.random() < 0.005:  # 0.5% chance
            bullet = arcade.Sprite("images/enemy_bullet.png", 0.6)
            bullet.center_x = enemy.center_x
            bullet.center_y = enemy.bottom
            bullet.change_y = -6
            self.enemy_bullet_list.append(bullet)
```

## Visual Effects

Add explosions and particle effects:

```python
def create_explosion(self, x, y):
    # Create explosion effect
    explosion = arcade.Sprite("images/explosion.png", 0.5)
    explosion.center_x = x
    explosion.center_y = y
    explosion.alpha = 255

    # Add to temporary effects list
    self.effects_list.append({
        'sprite': explosion,
        'timer': 0.5,  # Lifetime in seconds
        'fade_speed': 5
    })

def update_effects(self, delta_time):
    for effect in self.effects_list[:]:
        effect['timer'] -= delta_time
        effect['sprite'].alpha -= effect['fade_speed']

        if effect['timer'] <= 0:
            self.effects_list.remove(effect)
```

## HUD and UI

Display score and other information:

```python
def on_draw(self):
    arcade.start_render()

    # Draw all sprites
    self.player_list.draw()
    self.enemy_list.draw()
    self.bullet_list.draw()
    self.enemy_bullet_list.draw()

    # Draw effects
    for effect in self.effects_list:
        effect['sprite'].draw()

    # Draw HUD
    arcade.draw_text(f"Score: {self.score}", 10, SCREEN_HEIGHT - 30,
                    arcade.color.WHITE, 16)
    arcade.draw_text(f"Lives: {self.lives}", 10, SCREEN_HEIGHT - 50,
                    arcade.color.WHITE, 16)
```

This creates a complete space shooter game with player movement, enemy AI, collision detection, and visual effects!