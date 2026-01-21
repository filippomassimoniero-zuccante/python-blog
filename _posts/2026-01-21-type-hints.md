---
layout: post
title: "Type Hints"
date: 2026-01-21 10:00:00 +0100
author: "Prof Niero"
categories: coding
tags: [python, test]
---
A volte VSCode riesce a darci i suggerimenti (per esempio quando scriviamo "nomeVariabile" seguito dal punto) riesce a darci dei suggerimenti sensati... E a volte no

Questo succede specialmente con i parametri o i risultati delle funzioni

```python
def trovaParola(frase, parola):
    frase. # vscode non ci mostra i suggerimenti

print(trovaParola("ciao come stai", "come"))

```

Ma come mai? Per noi sembra ovvio che `frase` e `parola` siano stringhe, ma vscode non lo può sapere

Il tipo di dato verrà scoperto solo quando, mentre stiamo eseguendo il programma, verrà chiamata la nostra funzione

Da Python 3.5 in poi esiste una soluzione: i **type hints**

Per verificare la tua versione di python puoi usare `py` e basta, e ti scriverà la versione che stai usando

Come penso abbiate già capito, le variabili in realtà hanno diversi "tipi" (numero, lista, stringa, bool) e python prova a capire che operazioni può fare con una certa variabile. Se però proviamo a chiedergli di usare un metodo del tipo sbagliato, otteniamo un errore

```python

def stampaParolaInMaiuscolo(miaStringa):
    print(miaStringa.upper())

stampaParolaInMaiuscolo("ciao")
stampaParolaInMaiuscolo(5)

# Output
CIAO
Traceback (most recent call last):
    <...>
    print(miaStringa.upper())
          ^^^^^^^^^^^^^^^^
AttributeError: 'int' object has no attribute 'upper'
```
## Cosa Sono i Type Hints

I type hints sono delle **annotazioni** che aggiungi al codice per dichiarare esplicitamente il tipo di una variabile, di un parametro o del valore di ritorno di una funzione

Non servono a Python per "risolvere" il problema che succede quando passiamo un tipo invece che un altro, ma servono a VSCode per darci sempre i suggerimenti adatti al tipo della variabile

Sono in un certo senso una "garanzia" che tu dai a VSCode che effettivamente quella variabile *dovrebbe essere* di quel tipo. Poi se facendo girare il programma non è così, python si avvierà lo stesso e arrivato al punto di codice "problematico", darà errore

Questo problema non c'è nei linguaggi "staticamente tipizzati" (Statically Typed), per esempio Java. Lì non possiamo proprio scrivere il codice senza scrivere i tipi corretti, e se proviamo a usare una funzione cambiando i tipi, il programma ci fermerà subito, quando proviamo a compilare

Cercando online forse vi siete già imbattuti in codice scritto con type hints. Vi consiglio da adesso in poi di usarle 

## Variabili

Dichiarare le variabili senza type hint:

```python
nome = "Mario"
eta = 15
altezza = 1.75
is_studente = True
```

Ed ecco la stessa cosa con type hints:

```python
nome: str = "Mario"
eta: int = 25
altezza: float = 1.75
is_studente: bool = True
```

La sintassi è: `nome_variabile: tipo = valore`

I tipi base sono:
- `str`: stringhe di testo
- `int`: numeri interi
- `float`: numeri decimali
- `bool`: valori booleani (True/False)


## Funzioni/metodi

Possiamo indicare sia il tipo dei **parametri** che il tipo del **valore di ritorno**

```python
def saluta(nome: str) -> str:
    return f"Ciao, {nome}!"
```

La freccia `->` indica il tipo di ritorno 

Usando i type hints, VSCode riesce a capire che la funzione `saluta`:
- Accetta un parametro `nome` di tipo `str`
- Restituisce un valore di tipo `str`

Se una funzione non deve restituire nulla, usa `None`:

```python
def stampa_messaggio(messaggio: str) -> None:
    print(messaggio)
```

## Liste e Dizionari

Per le collezioni, specifichiamo anche il tipo degli elementi contenuti

**Liste:**

```python
def calcola_media(voti: list[float]) -> float:
    return sum(voti) / len(voti)

voti: list[int] = [8, 7, 9, 6]
nomi: list[str] = ["Mario", "Luigi", "Peach"]
```

**Dizionari:**

```python
studente: dict[str, str] = {
    "nome": "Mario",
    "classe": "5A"
}
```

`dict[str, str]` significa: le chiavi sono stringhe, i valori sono stringhe

Un altro dizionario:

```python
voti_classe: dict[str, int] = {
    "Mario": 8,
    "Luigi": 7,
    "Peach": 9
}
```

Qui `dict[str, int]` indica: chiavi stringa, valori interi

## Union Types:

Alcune funzioni accettano più tipi diversi:

```python
def processa_input(valore: int | str) -> str:
    return str(valore)


# Entrambe funzionano
risultato1 = processa_input(42)
risultato2 = processa_input("ciao")
```

Con `int | str` stiamo dicendo che potrebbe essere una stringa **oppure** un intero. VSCode vi darà i suggerimenti per entrambi i tipi

## Maiuscole o minuscole?

Se cerchi esempi online , potresti trovare due sintassi diverse:

```python
# Vecchio stile (Python < 3.9)
from typing import List, Dict
voti: List[int] = [8, 7, 9]
studente: Dict[str, str] = {"nome": "Mario"}

# Nuovo stile (Python 3.9+)
voti: list[int] = [8, 7, 9]
studente: dict[str, str] = {"nome": "Mario"}
```

La versione con la maiuscola (`List`, `Dict`) è **legacy** (vecchia e non più consigliata). Usa sempre la versione minuscola (`list`, `dict`).

## Esercizi

### Esercizio 1: Tipi Base
Aggiungi i type hints appropriati a queste variabili:

```python
citta = "Venezia"
abitanti = 258685
superficie = 414.57
capoluogo = True
```

### Esercizio 2: Funzione con Type Hints
Scrivi una funzione `calcola_sconto` che:
- Accetta un prezzo (`float`) e una percentuale di sconto (`int`) tra 0 e 100
- Restituisce il prezzo scontato (`float`)

## Prossimi Passi

Ora che conosci i type hints, puoi iniziare a fare un **refactor** del tuo codice. 

> **Refactor**: processo di ristrutturazione del codice sorgente esistente per migliorarne la qualità interna senza alterarne le funzionalità

Alla prossima!