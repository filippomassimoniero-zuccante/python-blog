---
published: true
layout: post
title: "Using Arcade with Physics Engines"
date: 2024-02-05 11:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, arcade, physics, pymunk, tutorial]
---
published: true

Realistic physics can make games more engaging. Learn how to integrate physics engines like Pymunk with Python Arcade.

## Installing Pymunk

First, install the physics library:

```bash
pip install pymunk
pip install arcade[pymunk]  # Or install separately
```

## Basic Physics Setup

Create a physics-enabled game:

```python
import arcade
import pymunk
import pymunk.pygame_util

class PhysicsGame(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Physics Demo")

        # Physics space
        self.space = pymunk.Space()
        self.space.gravity = (0, -900)  # Gravity pointing down

        # Sprite lists
        self.static_sprites = arcade.SpriteList()
        self.dynamic_sprites = arcade.SpriteList()

        # Draw options for debugging
        self.draw_options = pymunk.pygame_util.DrawOptions()

        # Time tracking
        self.last_time = time.time()
```

## Creating Physics Bodies

Add physics to sprites:

```python
def create_ball(self, x, y, radius=20):
    """Create a bouncing ball with physics"""
    # Create sprite
    ball = arcade.SpriteCircle(radius, arcade.color.RED)
    ball.center_x = x
    ball.center_y = y

    # Create physics body
    mass = 1
    moment = pymunk.moment_for_circle(mass, 0, radius)
    body = pymunk.Body(mass, moment)
    body.position = x, y

    # Create physics shape
    shape = pymunk.Circle(body, radius)
    shape.elasticity = 0.8  # Bouncy
    shape.friction = 0.5

    # Add to physics space
    self.space.add(body, shape)

    # Store references
    ball.pymunk_body = body
    ball.pymunk_shape = shape

    self.dynamic_sprites.append(ball)
    return ball

def create_ground(self):
    """Create static ground"""
    # Create sprite for visual ground
    ground = arcade.Sprite("ground.png", scale=2.0)
    ground.center_x = 400
    ground.center_y = 50
    self.static_sprites.append(ground)

    # Create physics body (static)
    body = pymunk.Body(body_type=pymunk.Body.STATIC)
    body.position = (400, 50)

    # Create physics shape
    shape = pymunk.Segment(body, (-400, 0), (400, 0), 5)
    shape.elasticity = 0.5
    shape.friction = 0.8

    self.space.add(body, shape)
```

## Physics Integration

Update physics in the game loop:

```python
def on_update(self, delta_time):
    # Calculate physics time step
    current_time = time.time()
    dt = current_time - self.last_time
    self.last_time = current_time

    # Limit time step to prevent large jumps
    dt = min(dt, 1/60.0)

    # Step physics simulation
    self.space.step(dt)

    # Update sprite positions from physics bodies
    for sprite in self.dynamic_sprites:
        if hasattr(sprite, 'pymunk_body'):
            sprite.center_x = sprite.pymunk_body.position.x
            sprite.center_y = sprite.pymunk_body.position.y
            sprite.angle = math.degrees(sprite.pymunk_body.angle)

def on_draw(self):
    arcade.start_render()

    # Draw sprites
    self.static_sprites.draw()
    self.dynamic_sprites.draw()

    # Draw physics debug info (optional)
    if self.debug_mode:
        self.space.debug_draw(self.draw_options)
```

## Joints and Constraints

Create connected objects:

```python
def create_pendulum(self, x, y):
    """Create a swinging pendulum"""
    # Fixed point
    static_body = pymunk.Body(body_type=pymunk.Body.STATIC)
    static_body.position = (x, y + 100)

    # Pendulum bob
    bob_body = pymunk.Body(1, pymunk.moment_for_circle(1, 0, 20))
    bob_body.position = (x, y)

    # Shape for bob
    bob_shape = pymunk.Circle(bob_body, 20)
    bob_shape.elasticity = 0.8

    # Create sprite for bob
    bob_sprite = arcade.SpriteCircle(20, arcade.color.BLUE)
    bob_sprite.pymunk_body = bob_body
    bob_sprite.pymunk_shape = bob_shape
    self.dynamic_sprites.append(bob_sprite)

    # Create joint
    joint = pymunk.PinJoint(static_body, bob_body, (0, 0), (0, 0))

    # Add everything to space
    self.space.add(bob_body, bob_shape, joint)

    return bob_sprite
```

## Collision Handling

Respond to physics collisions:

```python
def setup_collision_handlers(self):
    """Setup collision detection"""

    def ball_hit_ground(arbiter, space, data):
        """Handle ball hitting ground"""
        ball_shape = arbiter.shapes[0]
        ball_body = ball_shape.body

        # Play sound or create effect
        arcade.play_sound(self.bounce_sound)

        return True  # Return True to process collision

    # Add collision handler
    handler = self.space.add_collision_handler(0, 1)  # Collision types
    handler.begin = ball_hit_ground
```

## Performance Optimization

Optimize physics performance:

```python
def optimize_physics(self):
    """Optimize physics simulation"""

    # Use spatial hash for better performance
    self.space.use_spatial_hash(5.0, 10000)

    # Set iterations for better accuracy vs performance tradeoff
    self.space.iterations = 10  # Default is 10

    # Enable sleeping for inactive bodies
    self.space.sleep_time_threshold = 0.5

    # Set up collision layers
    # Layer 1: Player
    # Layer 2: Enemies
    # Layer 3: Environment

    # Make shapes not collide with same layer
    self.space.add_collision_handler(1, 1).begin = lambda arb, space, data: False
    self.space.add_collision_handler(2, 2).begin = lambda arb, space, data: False
```

## Advanced Physics Features

### Raycasting
Cast rays for line-of-sight or aiming:

```python
def raycast(self, start_point, end_point):
    """Cast a ray and get hit information"""
    result = self.space.segment_query_first(
        start_point, end_point,
        1,  # Radius
        pymunk.ShapeFilter()  # Filter
    )

    if result:
        return result.point, result.shape
    return None

def on_mouse_press(self, x, y, button, modifiers):
    # Cast ray from player to mouse
    player_pos = (self.player.center_x, self.player.center_y)
    mouse_pos = (x, y)

    hit = self.raycast(player_pos, mouse_pos)
    if hit:
        hit_point, hit_shape = hit
        # Handle hit
        self.create_hit_effect(hit_point)
```

### Soft Bodies
Create deformable objects:

```python
def create_soft_body(self, x, y, segments=8):
    """Create a simple soft body"""
    bodies = []
    shapes = []
    joints = []

    # Create body segments
    for i in range(segments):
        angle = (i / segments) * 2 * math.pi
        pos_x = x + math.cos(angle) * 50
        pos_y = y + math.sin(angle) * 50

        body = pymunk.Body(1, pymunk.moment_for_circle(1, 0, 10))
        body.position = (pos_x, pos_y)
        bodies.append(body)

        shape = pymunk.Circle(body, 10)
        shapes.append(shape)

        # Create sprite
        segment_sprite = arcade.SpriteCircle(10, arcade.color.GREEN)
        segment_sprite.pymunk_body = body
        self.dynamic_sprites.append(segment_sprite)

    # Connect segments with joints
    for i in range(segments):
        j1 = pymunk.DampedSpring(
            bodies[i], bodies[(i + 1) % segments],
            (0, 0), (0, 0),
            50, 100, 1  # rest_length, stiffness, damping
        )
        joints.append(j1)

    # Add everything to space
    for body in bodies:
        self.space.add(body)
    for shape in shapes:
        self.space.add(shape)
    for joint in joints:
        self.space.add(joint)
```

Physics engines add realistic movement and interactions to your games!