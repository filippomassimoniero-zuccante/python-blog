---
layout: post
title: "Understanding React Hooks: useState and useEffect"
date: 2026-01-18 12:00:00 +0100
author: "Your Name"
categories: coding
tags: [react, hooks, javascript, frontend]
---

React Hooks revolutionized how we write React components. In this post, we'll dive deep into the two most fundamental hooks: `useState` and `useEffect`.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 to solve several problems:

- Allow state and lifecycle features in function components
- Eliminate "wrapper hell" from higher-order components
- Group related logic together
- Share stateful logic between components

## useState Hook

The `useState` hook is the most basic hook for managing state in function components.

### Basic Usage

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useState with Objects

```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="number"
        name="age"
        value={user.age}
        onChange={handleChange}
        placeholder="Age"
      />
    </form>
  );
}
```

### Lazy Initial State

For expensive initial state calculations:

```jsx
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    // This function runs only once during initial render
    return computeExpensiveValue();
  });
  
  // ... rest of component
}
```

## useEffect Hook

The `useEffect` hook lets you perform side effects in function components.

### Basic Usage

```jsx
import React, { useState, useEffect } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment Count
    </button>
  );
}
```

### Conditional Effects with Dependencies

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs when userId changes
    fetchUser(userId)
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [userId]); // Dependency array

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
```

### Cleanup Functions

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty array means effect runs only once

  return <div>Timer: {seconds}s</div>;
}
```

### Multiple Effects

```jsx
function DataComponent({ userId, theme }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});

  // Effect for fetching user data
  useEffect(() => {
    if (userId) {
      fetchUser(userId).then(setUser);
    }
  }, [userId]);

  // Effect for applying theme
  useEffect(() => {
    document.body.className = theme;
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  // Effect for settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
}
```

## Common Patterns

### Custom Hooks

Create reusable logic with custom hooks:

```jsx
// useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Usage in component
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Data Fetching Hook

```jsx
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}
```

## Best Practices

1. **Always use hooks at the top level** - Never call hooks inside loops, conditions, or nested functions
2. **Use ESLint plugin for hooks** - `eslint-plugin-react-hooks` helps catch rule violations
3. **Include all dependencies** in the dependency array
4. **Use cleanup functions** for subscriptions, timers, and event listeners
5. **Extract complex logic** into custom hooks
6. **Use `useCallback` and `useMemo`** for performance optimization when needed

## Common Pitfalls

### Stale Closure

```jsx
// ❌ Wrong
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Always uses initial count (0)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Correct
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Uses functional update
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
```

### Missing Dependencies

```jsx
// ❌ Missing dependency
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId in deps

  // ✅ Correct
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
}
```

## Conclusion

React Hooks provide a powerful way to manage state and side effects in function components. Understanding `useState` and `useEffect` is fundamental to modern React development. By following best practices and creating custom hooks, you can write cleaner, more maintainable React applications.