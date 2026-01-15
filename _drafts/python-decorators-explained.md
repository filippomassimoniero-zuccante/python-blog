---
layout: post
title: "Understanding Python Decorators"
date: 2026-01-16 10:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, decorators, advanced]
---

Python decorators are a powerful feature that allows you to modify or extend the behavior of functions without permanently modifying their structure.

## What are Decorators?

Decorators are essentially functions that wrap another function, adding functionality before or after the wrapped function runs.

```python
def timing_decorator(func):
    """A decorator that measures execution time."""
    import time
    
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Done!"

# Usage
result = slow_function()
```

## Practical Examples

### Logging Decorator

```python
def log_calls(func):
    """Log every function call."""
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned: {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b
```

### Memoization Decorator

```python
def memoize(func):
    """Cache function results to avoid redundant calculations."""
    cache = {}
    
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Class-based Decorators

Sometimes you need more complex decorators that maintain state:

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.call_count = 0
    
    def __call__(self, *args, **kwargs):
        self.call_count += 1
        print(f"Call {self.call_count} of {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def greet(name):
    return f"Hello, {name}!"
```

Decorators are especially useful for:
- Logging and debugging
- Performance monitoring
- Input validation
- Caching and memoization
- Authentication and authorization

Mastering decorators will make your Python code more elegant and maintainable!