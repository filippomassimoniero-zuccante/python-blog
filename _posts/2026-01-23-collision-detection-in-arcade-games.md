---
published: true
layout: post
title: "Collision Detection in Arcade Games"
date: 2024-01-23 13:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, collision, physics, tutorial]
---
published: true

Collision detection is crucial for game mechanics. Learn how to detect when objects collide in Python Arcade.

## Basic Collision Detection

The simplest collision detection checks if two sprites overlap:

```python
# Check if player collides with coin
if arcade.check_for_collision(self.player, coin):
    self.score += 1
    coin.remove_from_sprite_lists()
```

## Different Collision Methods

### Point Collision
Check if a point is inside a sprite:

```python
if player.collides_with_point((mouse_x, mouse_y)):
    print("Player clicked!")
```

### List Collisions
Check collisions between sprite lists:

```python
# Player vs enemies
player_hits = arcade.check_for_collision_with_list(self.player, self.enemy_list)
for enemy in player_hits:
    enemy.remove_from_sprite_lists()

# Bullets vs enemies
for bullet in self.bullet_list:
    hit_list = arcade.check_for_collision_with_list(bullet, self.enemy_list)
    if hit_list:
        bullet.remove_from_sprite_lists()
        for enemy in hit_list:
            enemy.remove_from_sprite_lists()
```

## Advanced Collision Techniques

### Pixel-Perfect Collision
For more precise collision detection:

```python
# This requires pixel-perfect collision setup
if arcade.check_for_collision_with_list_detailed(sprite1, sprite_list):
    # Handle detailed collision
    pass
```

### Collision with Rotation
Handle rotated sprites:

```python
# Arcade automatically handles rotation in collision detection
rotated_sprite = arcade.Sprite("rotated.png", angle=45)
if arcade.check_for_collision(player, rotated_sprite):
    # Collision detected even with rotation
    pass
```

## Collision Response

After detecting collisions, you need to respond appropriately:

```python
def update(self, delta_time):
    # Update sprite positions
    self.player_list.update()
    self.enemy_list.update()

    # Check collisions and respond
    for player in self.player_list:
        # Player vs walls
        if player.left < 0:
            player.left = 0
        elif player.right > SCREEN_WIDTH:
            player.right = SCREEN_WIDTH

        # Player vs enemies
        enemy_hits = arcade.check_for_collision_with_list(player, self.enemy_list)
        for enemy in enemy_hits:
            self.game_over()
```

Proper collision detection makes your games feel solid and realistic!