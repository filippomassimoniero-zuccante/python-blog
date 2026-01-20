---
published: true
layout: post
title: "Implementing Save/Load System"
date: 2024-02-04 10:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, save, load, persistence, tutorial]
---
published: true

Save/load functionality allows players to continue their progress. Learn how to implement a robust save/load system in your Python Arcade games.

## Basic File-Based Saving

Use JSON for simple game state saving:

```python
import json
import os

class SaveLoadSystem:
    def __init__(self, save_file="savegame.json"):
        self.save_file = save_file

    def save_game(self, game_state):
        """Save the current game state to file"""
        try:
            with open(self.save_file, 'w') as f:
                json.dump(game_state, f, indent=2)
            print(f"Game saved to {self.save_file}")
            return True
        except Exception as e:
            print(f"Failed to save game: {e}")
            return False

    def load_game(self):
        """Load game state from file"""
        if not os.path.exists(self.save_file):
            print("No save file found")
            return None

        try:
            with open(self.save_file, 'r') as f:
                game_state = json.load(f)
            print(f"Game loaded from {self.save_file}")
            return game_state
        except Exception as e:
            print(f"Failed to load game: {e}")
            return None

    def delete_save(self):
        """Delete the save file"""
        if os.path.exists(self.save_file):
            os.remove(self.save_file)
            print("Save file deleted")
            return True
        return False
```

## Game State Serialization

Convert game objects to saveable data:

```python
class GameState:
    def __init__(self):
        self.player = None
        self.enemies = []
        self.score = 0
        self.level = 1
        self.timestamp = None

    def to_dict(self):
        """Convert game state to dictionary for JSON serialization"""
        return {
            'player': {
                'x': self.player.center_x,
                'y': self.player.center_y,
                'health': self.player.health,
                'score': self.score
            },
            'enemies': [
                {
                    'type': type(enemy).__name__,
                    'x': enemy.center_x,
                    'y': enemy.center_y,
                    'health': enemy.health
                } for enemy in self.enemies
            ],
            'level': self.level,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

    @classmethod
    def from_dict(cls, data):
        """Create game state from dictionary"""
        state = cls()
        state.score = data.get('score', 0)
        state.level = data.get('level', 1)

        # Recreate player
        player_data = data.get('player', {})
        state.player = Player()
        state.player.center_x = player_data.get('x', 400)
        state.player.center_y = player_data.get('y', 300)
        state.player.health = player_data.get('health', 100)

        # Recreate enemies
        for enemy_data in data.get('enemies', []):
            enemy = Enemy()  # Create appropriate enemy type
            enemy.center_x = enemy_data.get('x', 0)
            enemy.center_y = enemy_data.get('y', 0)
            enemy.health = enemy_data.get('health', 100)
            state.enemies.append(enemy)

        return state
```

## Auto-Save Feature

Implement automatic saving:

```python
class AutoSaveMixin:
    def __init__(self):
        self.auto_save_interval = 300  # 5 minutes
        self.last_save_time = time.time()
        self.save_system = SaveLoadSystem()

    def update(self, delta_time):
        super().update(delta_time)

        # Auto-save periodically
        current_time = time.time()
        if current_time - self.last_save_time >= self.auto_save_interval:
            self.auto_save()

    def auto_save(self):
        """Create an automatic save"""
        game_state = self.get_current_state()
        save_file = f"autosave_{int(time.time())}.json"
        self.save_system.save_file = save_file
        self.save_system.save_game(game_state)

        # Clean up old auto-saves (keep last 3)
        self.cleanup_old_autosaves()

    def cleanup_old_autosaves(self):
        """Remove old auto-save files"""
        autosaves = [f for f in os.listdir('.') if f.startswith('autosave_')]
        autosaves.sort(reverse=True)

        # Keep only the 3 most recent
        for old_save in autosaves[3:]:
            try:
                os.remove(old_save)
            except:
                pass
```

## Multiple Save Slots

Allow multiple save files:

```python
class SaveSlotSystem:
    def __init__(self):
        self.save_slots = {}
        self.current_slot = None

    def save_to_slot(self, slot_name, game_state):
        """Save to a specific slot"""
        self.save_slots[slot_name] = game_state
        self.save_game_to_file(slot_name, game_state)

    def load_from_slot(self, slot_name):
        """Load from a specific slot"""
        if slot_name in self.save_slots:
            return self.save_slots[slot_name]

        # Try loading from file
        loaded_state = self.load_game_from_file(slot_name)
        if loaded_state:
            self.save_slots[slot_name] = loaded_state
            return loaded_state

        return None

    def get_available_slots(self):
        """Get list of available save slots"""
        slots = list(self.save_slots.keys())

        # Also check for saved files
        if os.path.exists('saves'):
            for file in os.listdir('saves'):
                if file.endswith('.json'):
                    slot_name = file[:-5]  # Remove .json
                    if slot_name not in slots:
                        slots.append(slot_name)

        return sorted(slots)

    def save_game_to_file(self, slot_name, game_state):
        """Save game state to file"""
        os.makedirs('saves', exist_ok=True)
        filename = f"saves/{slot_name}.json"

        with open(filename, 'w') as f:
            json.dump(game_state, f, indent=2)

    def load_game_from_file(self, slot_name):
        """Load game state from file"""
        filename = f"saves/{slot_name}.json"

        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return json.load(f)

        return None
```

## Save Menu GUI

Create a save/load menu:

```python
class SaveMenu(arcade.View):
    def __init__(self, game_view):
        super().__init__()
        self.game_view = game_view
        self.save_slots = ['Slot 1', 'Slot 2', 'Slot 3']
        self.selected_slot = 0

    def on_draw(self):
        arcade.start_render()
        arcade.set_background_color(arcade.color.DARK_BLUE_GRAY)

        # Draw title
        arcade.draw_text("Save/Load Game", 400, 500,
                        arcade.color.WHITE, 30, anchor_x="center")

        # Draw save slots
        for i, slot in enumerate(self.save_slots):
            y_pos = 400 - i * 60
            color = arcade.color.YELLOW if i == self.selected_slot else arcade.color.WHITE

            arcade.draw_text(f"{slot}: {self.get_slot_info(slot)}", 400, y_pos,
                           color, 20, anchor_x="center")

        # Draw instructions
        arcade.draw_text("↑↓ Select Slot | S Save | L Load | ESC Back", 400, 100,
                        arcade.color.GRAY, 14, anchor_x="center")

    def get_slot_info(self, slot_name):
        """Get information about a save slot"""
        # Check if slot has save data
        # Return level, date, etc.
        return "Empty"  # Placeholder

    def on_key_press(self, key, modifiers):
        if key == arcade.key.UP:
            self.selected_slot = (self.selected_slot - 1) % len(self.save_slots)
        elif key == arcade.key.DOWN:
            self.selected_slot = (self.selected_slot + 1) % len(self.save_slots)
        elif key == arcade.key.S:
            self.save_game()
        elif key == arcade.key.L:
            self.load_game()
        elif key == arcade.key.ESCAPE:
            self.window.show_view(self.game_view)

    def save_game(self):
        slot_name = self.save_slots[self.selected_slot]
        game_state = self.game_view.get_game_state()
        self.game_view.save_system.save_to_slot(slot_name, game_state)

    def load_game(self):
        slot_name = self.save_slots[self.selected_slot]
        game_state = self.game_view.save_system.load_from_slot(slot_name)
        if game_state:
            self.game_view.load_game_state(game_state)
            self.window.show_view(self.game_view)
```

## Error Handling and Validation

Add robust error handling:

```python
def safe_save_game(self, game_state):
    """Safely save game with backup"""
    try:
        # Create backup of existing save
        if os.path.exists(self.save_file):
            backup_file = f"{self.save_file}.backup"
            os.rename(self.save_file, backup_file)

        # Save new game state
        with open(self.save_file, 'w') as f:
            json.dump(game_state, f, indent=2)

        # Remove backup on successful save
        if os.path.exists(backup_file):
            os.remove(backup_file)

        return True

    except Exception as e:
        print(f"Save failed: {e}")
        # Restore backup if it exists
        if os.path.exists(backup_file):
            os.rename(backup_file, self.save_file)
        return False

def validate_save_data(self, data):
    """Validate save data integrity"""
    required_keys = ['player', 'level', 'timestamp']
    if not all(key in data for key in required_keys):
        return False

    # Validate player data
    player = data.get('player', {})
    if not all(key in player for key in ['x', 'y', 'health']):
        return False

    return True
```

Save/load systems allow players to preserve their progress and enhance replayability!