---
published: true
layout: post
title: "Implementing Game States and Menus"
date: 2024-01-27 17:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, game-states, menus, ui, tutorial]
---
published: true

Most games need different screens like menus, gameplay, and game over. Learn how to implement game states and menus in Python Arcade.

## Game State Management

Use an enum to define different game states:

```python
from enum import Enum

class GameState(Enum):
    MENU = 0
    PLAYING = 1
    PAUSED = 2
    GAME_OVER = 3

class MyGame(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Game States Demo")
        self.current_state = GameState.MENU

        # Create different views for each state
        self.menu_view = MenuView()
        self.game_view = GameView()
        self.pause_view = PauseView()
        self.game_over_view = GameOverView()
```

## Creating Menu Views

Create different view classes for each state:

```python
class MenuView(arcade.View):
    def __init__(self):
        super().__init__()
        self.title = "My Awesome Game"
        self.start_button = None

    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_BLUE)

    def on_draw(self):
        arcade.start_render()
        arcade.draw_text(self.title, 400, 400,
                        arcade.color.WHITE, 30,
                        anchor_x="center")
        arcade.draw_text("Press SPACE to Start", 400, 300,
                        arcade.color.WHITE, 20,
                        anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game_view = GameView()
            self.window.show_view(game_view)
```

## Game View

The main gameplay view:

```python
class GameView(arcade.View):
    def __init__(self):
        super().__init__()
        self.player = None
        self.score = 0

    def setup(self):
        self.player = arcade.Sprite("player.png")
        self.player.center_x = 400
        self.player.center_y = 300

    def on_show_view(self):
        arcade.set_background_color(arcade.color.AMAZON)
        if self.player is None:
            self.setup()

    def on_draw(self):
        arcade.start_render()
        self.player.draw()
        arcade.draw_text(f"Score: {self.score}", 10, 570,
                        arcade.color.WHITE, 16)

    def on_key_press(self, key, modifiers):
        if key == arcade.key.ESCAPE:
            pause_view = PauseView(self)
            self.window.show_view(pause_view)

    def on_update(self, delta_time):
        self.player.update()
        # Game logic here
```

## Pause Menu

Create a pause overlay:

```python
class PauseView(arcade.View):
    def __init__(self, game_view):
        super().__init__()
        self.game_view = game_view

    def on_draw(self):
        # Draw the game behind
        self.game_view.on_draw()

        # Draw pause overlay
        arcade.draw_rectangle_filled(400, 300, 400, 200,
                                   arcade.color.BLACK + (150,))
        arcade.draw_text("PAUSED", 400, 350,
                        arcade.color.WHITE, 30,
                        anchor_x="center")
        arcade.draw_text("Press ESC to Resume", 400, 280,
                        arcade.color.WHITE, 16,
                        anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.ESCAPE:
            self.window.show_view(self.game_view)
```

## Game Over Screen

Handle game over state:

```python
class GameOverView(arcade.View):
    def __init__(self, final_score):
        super().__init__()
        self.final_score = final_score

    def on_draw(self):
        arcade.start_render()
        arcade.set_background_color(arcade.color.BLACK)
        arcade.draw_text("GAME OVER", 400, 400,
                        arcade.color.RED, 40,
                        anchor_x="center")
        arcade.draw_text(f"Final Score: {self.final_score}", 400, 350,
                        arcade.color.WHITE, 20,
                        anchor_x="center")
        arcade.draw_text("Press R to Restart", 400, 280,
                        arcade.color.WHITE, 16,
                        anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.R:
            menu_view = MenuView()
            self.window.show_view(menu_view)
```

## Transitioning Between States

Handle state changes in your main game class:

```python
def game_over(self):
    game_over_view = GameOverView(self.score)
    self.show_view(game_over_view)

def restart_game(self):
    game_view = GameView()
    self.show_view(game_view)
```

Game states make your games feel more professional and provide better user experience!