---
layout: post
title: "Refactor e best practices"
date: 2026-01-22 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, refactoring]
---

Oggi parliamo di **refactoring** e di come scrivere codice più mantenibile.

> **Refactor**: processo di ristrutturazione del codice sorgente esistente per migliorarne la qualità interna senza alterarne le funzionalità

In pratica, vuol dire rendere il codice più leggibile, più organizzato e più facile da modificare in futuro, **senza cambiare quello che fa**.

## Manutenzione del software

Il software va **mantenuto** nel tempo:
- Dobbiamo correggere bug
- Dobbiamo aggiungere nuove funzionalità
- Dobbiamo adattarlo a nuove esigenze

Se il codice è scritto male, una modifica anche "banale" vorrebbe dire modificare un sacco di linee di codice già scritto. E questo potrebbe introdurre dei problemi

## Un Solo File Non Va Bene

Spesso mettiamo tutto il codice in un unico file. Va bene per esercizi semplici, ma con il nostro progetto inizia a dare problemi:
- Il file diventa lunghissimo e difficile da navigare
- È difficile ricordarci dove risiede il pezzo di codice che fa una certa cosa
- Se si chiede ad una persona esterna di guardare il nostro codice impazzirebbe

Dobbiamo dividere il codice in più file, ognuno con una **responsabilità** specifica

```python
# Invece di avere tutto in main.py, dividiamo:
#
# gioco/
# --- main.py          # Gestione principale del gioco
# --- giocatore.py     # Classe Giocatore
# --- nemico.py        # Classe Nemico
# --- livello.py       # Gestione livelli
# --- costanti.py      # Valori costanti (dimensioni, colori...)
```



## DRY: Don't Repeat Yourself

Se ti ritrovi a copiare e incollare lo stesso codice in più punti, stai violando questo principio.

## Magic Numbers: I Numeri Magici

I "magic numbers" sono numeri che appaiono nel codice senza spiegazione. Rendono il codice difficile da capire e da modificare.

**Codice con magic numbers:**

```python
import pygame

pygame.init()
schermo = pygame.display.set_mode((800, 600))

# ... 200 righe dopo ...

if giocatore.x > 800:
    giocatore.x = 0

# ... altre 100 righe dopo ...

nemico.x = 800 - 50
```

Cosa sono 800 e 600? Cosa succede se vogliamo cambiare la risoluzione? Dobbiamo cercare e sostituire ogni occorrenza, sperando di non dimenticarne nessuna

**Codice senza magic numbers:**

```python
import pygame

LARGHEZZA_SCHERMO = 800
ALTEZZA_SCHERMO = 600

pygame.init()
schermo = pygame.display.set_mode((LARGHEZZA_SCHERMO, ALTEZZA_SCHERMO))

# ... 200 righe dopo ...

if giocatore.x > LARGHEZZA_SCHERMO:
    giocatore.x = 0

# ... altre 100 righe dopo ...

nemico.x = LARGHEZZA_SCHERMO - 50
```

Ora se vogliamo cambiare la risoluzione, basta modificare un solo valore all'inizio del file.

**Convenzione**: le costanti si scrivono in MAIUSCOLO con underscore tra le parole.

## Scrivi Una Volta, Usa N Volte

Un buon programmatore scrive codice **riutilizzabile**. Invece di riscrivere la stessa logica ogni volta, crea funzioni o classi che possono essere usate in più contesti

- Se cambiamo come funziona il movimento, lo facciamo in un solo punto
- Il codice è più corto e più chiaro
- Se cambi

## Esercizi

### Esercizio 1: Elimina i Magic Numbers
Riscrivi questo codice eliminando i magic numbers:

```python
import pygame
schermo = pygame.display.set_mode((1024, 768))
font = pygame.font.Font(None, 36)
if punteggio > 1000:
    print("Hai vinto!")
```

### Esercizio 2: Applica DRY
Scrivi una funzione per non ripetere la "cornicetta" ogni volta:

```python
print("*" * 20)
print("Benvenuto!")
print("*" * 20)

# ... altro codice ...

print("*" * 20)
print("Arrivederci!")
print("*" * 20)
```

Alla prossima!
