---
published: true
layout: post
title: "Creating Custom GUI Elements"
date: 2024-02-03 23:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, gui, ui, tutorial]
---
published: true

User interfaces enhance game usability. Learn how to create custom GUI elements for your Python Arcade games.

## Basic Button Class

Create a clickable button:

```python
class Button:
    def __init__(self, x, y, width, height, text, color=arcade.color.BLUE):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.text = text
        self.color = color
        self.hover_color = self.lighten_color(color)
        self.is_hovered = False
        self.is_pressed = False

    def lighten_color(self, color):
        """Create a lighter version of the color for hover effect"""
        r, g, b = color[:3]
        return (min(255, r + 40), min(255, g + 40), min(255, b + 40))

    def check_hover(self, mouse_x, mouse_y):
        self.is_hovered = (self.x <= mouse_x <= self.x + self.width and
                          self.y <= mouse_y <= self.y + self.height)

    def draw(self):
        color = self.hover_color if self.is_hovered else self.color
        arcade.draw_rectangle_filled(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            color
        )

        # Draw border
        arcade.draw_rectangle_outline(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            arcade.color.WHITE, 2
        )

        # Draw text
        arcade.draw_text(
            self.text,
            self.x + self.width/2,
            self.y + self.height/2,
            arcade.color.WHITE,
            16, anchor_x="center", anchor_y="center"
        )
```

## Slider Control

Create a draggable slider for settings:

```python
class Slider:
    def __init__(self, x, y, width, height, min_value, max_value, initial_value):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.min_value = min_value
        self.max_value = max_value
        self.value = initial_value
        self.is_dragging = False

    def get_value(self):
        return self.value

    def set_value(self, value):
        self.value = max(self.min_value, min(self.max_value, value))

    def check_hover(self, mouse_x, mouse_y):
        slider_y = self.y + self.height/2
        return (self.x <= mouse_x <= self.x + self.width and
                slider_y - 10 <= mouse_y <= slider_y + 10)

    def start_drag(self, mouse_x):
        if self.check_hover(mouse_x, self.y + self.height/2):
            self.is_dragging = True
            self.update_value(mouse_x)

    def update_drag(self, mouse_x):
        if self.is_dragging:
            self.update_value(mouse_x)

    def stop_drag(self):
        self.is_dragging = False

    def update_value(self, mouse_x):
        relative_x = mouse_x - self.x
        ratio = max(0, min(1, relative_x / self.width))
        self.value = self.min_value + ratio * (self.max_value - self.min_value)

    def draw(self):
        # Draw track
        arcade.draw_line(
            self.x, self.y + self.height/2,
            self.x + self.width, self.y + self.height/2,
            arcade.color.GRAY, 4
        )

        # Draw filled track
        value_ratio = (self.value - self.min_value) / (self.max_value - self.min_value)
        arcade.draw_line(
            self.x, self.y + self.height/2,
            self.x + self.width * value_ratio, self.y + self.height/2,
            arcade.color.BLUE, 4
        )

        # Draw handle
        handle_x = self.x + self.width * value_ratio
        arcade.draw_circle_filled(handle_x, self.y + self.height/2, 8, arcade.color.WHITE)
        arcade.draw_circle_outline(handle_x, self.y + self.height/2, 8, arcade.color.BLACK, 2)
```

## Progress Bar

Create a progress bar for loading or health:

```python
class ProgressBar:
    def __init__(self, x, y, width, height, max_value, color=arcade.color.GREEN):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.max_value = max_value
        self.current_value = max_value
        self.color = color
        self.background_color = arcade.color.GRAY

    def set_value(self, value):
        self.current_value = max(0, min(self.max_value, value))

    def draw(self):
        # Draw background
        arcade.draw_rectangle_filled(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            self.background_color
        )

        # Draw filled portion
        if self.current_value > 0:
            fill_width = self.width * (self.current_value / self.max_value)
            arcade.draw_rectangle_filled(
                self.x + fill_width/2,
                self.y + self.height/2,
                fill_width, self.height,
                self.color
            )

        # Draw border
        arcade.draw_rectangle_outline(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            arcade.color.BLACK, 2
        )
```

## Text Input Field

Create a text input for user input:

```python
class TextInput:
    def __init__(self, x, y, width, height, placeholder=""):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.text = ""
        self.placeholder = placeholder
        self.is_focused = False
        self.cursor_position = 0
        self.cursor_timer = 0

    def on_mouse_press(self, mouse_x, mouse_y):
        self.is_focused = (self.x <= mouse_x <= self.x + self.width and
                          self.y <= mouse_y <= self.y + self.height)

    def on_text(self, text):
        if self.is_focused:
            self.text += text
            self.cursor_position = len(self.text)

    def on_key_press(self, key):
        if not self.is_focused:
            return

        if key == arcade.key.BACKSPACE:
            if self.text:
                self.text = self.text[:-1]
                self.cursor_position = len(self.text)
        elif key == arcade.key.ENTER:
            self.is_focused = False

    def draw(self):
        # Draw background
        bg_color = arcade.color.LIGHT_GRAY if self.is_focused else arcade.color.WHITE
        arcade.draw_rectangle_filled(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            bg_color
        )

        # Draw border
        border_color = arcade.color.BLUE if self.is_focused else arcade.color.GRAY
        arcade.draw_rectangle_outline(
            self.x + self.width/2,
            self.y + self.height/2,
            self.width, self.height,
            border_color, 2
        )

        # Draw text
        display_text = self.text if self.text else self.placeholder
        text_color = arcade.color.BLACK if self.text else arcade.color.GRAY
        arcade.draw_text(
            display_text,
            self.x + 10,
            self.y + self.height/2,
            text_color,
            14, anchor_y="center"
        )

        # Draw cursor
        if self.is_focused and int(self.cursor_timer * 2) % 2 == 0:
            cursor_x = self.x + 10 + len(display_text) * 8  # Rough character width
            arcade.draw_line(
                cursor_x, self.y + 5,
                cursor_x, self.y + self.height - 5,
                arcade.color.BLACK, 1
            )

    def update(self, delta_time):
        self.cursor_timer += delta_time
```

## GUI Manager

Create a manager to handle all GUI elements:

```python
class GUIManager:
    def __init__(self):
        self.elements = []

    def add_element(self, element):
        self.elements.append(element)

    def update(self, delta_time):
        for element in self.elements:
            if hasattr(element, 'update'):
                element.update(delta_time)

    def draw(self):
        for element in self.elements:
            element.draw()

    def on_mouse_press(self, mouse_x, mouse_y, button):
        for element in self.elements:
            if hasattr(element, 'on_mouse_press'):
                element.on_mouse_press(mouse_x, mouse_y)

    def on_mouse_release(self, mouse_x, mouse_y, button):
        for element in self.elements:
            if hasattr(element, 'on_mouse_release'):
                element.on_mouse_release(mouse_x, mouse_y)

    def on_mouse_drag(self, mouse_x, mouse_y, dx, dy):
        for element in self.elements:
            if hasattr(element, 'update_drag'):
                element.update_drag(mouse_x)
```

Custom GUI elements make your games more polished and user-friendly!