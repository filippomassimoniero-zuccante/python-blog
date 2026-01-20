---
published: true
layout: post
title: "Creating Procedural Content"
date: 2024-02-06 12:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, procedural, generation, tutorial]
---
published: true

Procedural generation creates infinite replayability. Learn how to generate levels, textures, and content algorithmically in Python Arcade.

## Random Number Generation

Use Python's random module for consistent results:

```python
import random
import noise  # pip install noise
import arcade

class ProceduralGame(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Procedural Demo")
        self.seed = 42  # For reproducible results
        random.seed(self.seed)

        # Perlin noise for natural-looking generation
        self.noise_scale = 0.05
        self.octaves = 4
        self.persistence = 0.5
        self.lacunarity = 2.0
```

## Terrain Generation

Create natural-looking terrain:

```python
def generate_terrain(self, width, height, tile_size=32):
    """Generate procedural terrain"""
    terrain = []

    for x in range(0, width, tile_size):
        # Use Perlin noise for height variation
        height_value = noise.pnoise1(
            x * self.noise_scale,
            octaves=self.octaves,
            persistence=self.persistence,
            lacunarity=self.lacunarity
        )

        # Convert to screen coordinates
        terrain_height = int(height * 0.5 + height_value * 100)

        # Create terrain blocks
        for y in range(0, terrain_height, tile_size):
            block = arcade.Sprite("dirt.png")
            block.center_x = x + tile_size/2
            block.center_y = y + tile_size/2
            terrain.append(block)

    return terrain

def generate_caves(self, terrain_blocks):
    """Carve out caves in terrain"""
    for block in terrain_blocks[:]:  # Copy list to avoid modification issues
        # Use noise to determine if block should be removed
        noise_value = noise.pnoise2(
            block.center_x * 0.01,
            block.center_y * 0.01,
            octaves=3
        )

        if noise_value > 0.3:  # Remove some blocks to create caves
            terrain_blocks.remove(block)
```

## Dungeon Generation

Create procedural dungeons:

```python
class DungeonGenerator:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.rooms = []
        self.corridors = []

    def generate_dungeon(self):
        """Generate a complete dungeon"""
        # Place rooms
        self.place_rooms()

        # Connect rooms with corridors
        self.connect_rooms()

        # Add features
        self.add_features()

        return self.create_sprite_list()

    def place_rooms(self):
        """Randomly place rooms"""
        max_rooms = 10
        min_size = 4
        max_size = 10

        for _ in range(max_rooms):
            # Try to place a room
            for attempt in range(50):  # Max attempts per room
                w = random.randint(min_size, max_size)
                h = random.randint(min_size, max_size)
                x = random.randint(1, self.width - w - 1)
                y = random.randint(1, self.height - h - 1)

                room = Room(x, y, w, h)

                # Check if room overlaps with existing rooms
                if not any(room.intersects(other) for other in self.rooms):
                    self.rooms.append(room)
                    break

    def connect_rooms(self):
        """Connect rooms with corridors"""
        for i in range(len(self.rooms) - 1):
            room_a = self.rooms[i]
            room_b = self.rooms[i + 1]

            # Create L-shaped corridor
            corridor = self.create_corridor(room_a.center, room_b.center)
            self.corridors.extend(corridor)

    def create_corridor(self, start, end):
        """Create L-shaped corridor between two points"""
        x1, y1 = start
        x2, y2 = end

        corridor = []

        # Horizontal then vertical
        for x in range(min(x1, x2), max(x1, x2) + 1):
            corridor.append((x, y1))
        for y in range(min(y1, y2), max(y1, y2) + 1):
            corridor.append((x2, y))

        return corridor

    def add_features(self):
        """Add stairs, treasures, etc."""
        # Add entrance
        entrance_room = random.choice(self.rooms)
        self.entrance = entrance_room.center

        # Add exit
        exit_room = random.choice([r for r in self.rooms if r != entrance_room])
        self.exit = exit_room.center

        # Add treasures
        for room in self.rooms:
            if random.random() < 0.3:  # 30% chance
                room.has_treasure = True

    def create_sprite_list(self):
        """Convert dungeon to sprites"""
        sprites = arcade.SpriteList()

        # Create floor tiles
        for room in self.rooms:
            for x in range(room.x, room.x + room.w):
                for y in range(room.y, room.y + room.h):
                    floor = arcade.Sprite("floor.png")
                    floor.center_x = x * 32 + 16
                    floor.center_y = y * 32 + 16
                    sprites.append(floor)

        # Create wall tiles
        # (Implementation for walls around rooms and corridors)

        return sprites
```

## Texture Generation

Create procedural textures:

```python
def generate_cloud_texture(self, width, height):
    """Generate a cloud-like texture"""
    import PIL.Image
    import numpy as np

    # Create noise array
    noise_array = np.zeros((height, width))
    for y in range(height):
        for x in range(width):
            noise_value = noise.pnoise2(
                x * 0.01, y * 0.01,
                octaves=4, persistence=0.5
            )
            noise_array[y, x] = (noise_value + 1) / 2  # Normalize to 0-1

    # Create RGBA array
    rgba = np.zeros((height, width, 4), dtype=np.uint8)
    rgba[:, :, 3] = (noise_array * 255).astype(np.uint8)  # Alpha channel

    # Create PIL image
    image = PIL.Image.fromarray(rgba, 'RGBA')

    # Convert to Arcade texture
    texture = arcade.Texture(f"cloud_{random.randint(0, 1000)}")
    texture.image = image

    return texture
```

## Level Generation Algorithms

### Maze Generation
Create procedural mazes:

```python
def generate_maze(self, width, height):
    """Generate a maze using recursive backtracking"""
    # Initialize grid (all walls)
    maze = [[1 for _ in range(width)] for _ in range(height)]

    def carve_passages(cx, cy):
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        random.shuffle(directions)

        for dx, dy in directions:
            nx, ny = cx + dx * 2, cy + dy * 2

            if 0 <= nx < width and 0 <= ny < height and maze[ny][nx] == 1:
                # Carve passage
                maze[cy + dy][cx + dx] = 0
                maze[ny][nx] = 0
                carve_passages(nx, ny)

    # Start from top-left
    maze[1][1] = 0
    carve_passages(1, 1)

    return maze
```

### Island Generation
Create procedural islands:

```python
def generate_island(self, size):
    """Generate a procedural island"""
    island = np.zeros((size, size))

    # Create base shape with noise
    for y in range(size):
        for x in range(size):
            # Distance from center
            dx = x - size/2
            dy = y - size/2
            distance = math.sqrt(dx*dx + dy*dy)

            # Use noise for terrain variation
            noise_value = noise.pnoise2(x * 0.05, y * 0.05)

            # Create island shape
            height = 1.0 - (distance / (size/2))
            height += noise_value * 0.3
            height = max(0, min(1, height))

            island[y, x] = height

    return island
```

## Seeded Generation

Ensure consistent results:

```python
def set_seed(self, seed):
    """Set seed for reproducible generation"""
    self.seed = seed
    random.seed(seed)
    # Set noise seed if using noise library
    noise.seed(seed)

def generate_world(self, seed=None):
    """Generate a complete world"""
    if seed is not None:
        self.set_seed(seed)

    # Generate terrain
    terrain = self.generate_terrain(100, 100)

    # Generate dungeons
    dungeons = []
    for _ in range(5):
        dungeon = DungeonGenerator(50, 50)
        dungeons.append(dungeon.generate_dungeon())

    # Generate biomes
    biomes = self.generate_biomes(100, 100)

    return {
        'terrain': terrain,
        'dungeons': dungeons,
        'biomes': biomes,
        'seed': self.seed
    }
```

Procedural generation creates infinite variety and replayability in your games!