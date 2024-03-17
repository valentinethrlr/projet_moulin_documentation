(explication)=

# Explication du fonctionnement du code

Le back-end se compose en deux parties. Il y a d'une part les fichiers qui s'occupent des parties en local, rédigés en JavaScript, et d'autre part ceux qui s'occupent des parties en ligne, codées sur un serveur, également en JavaScript et en utilisant les fonctions de node.js.

Le front-end quant à lui est rédigé en HTML et CSS.

## Parties en local

### Le plateau

Le plateau a été dessiné sur https://www.drawio.com/, puis converti en fichier svg. L'avantage est qu'il s'agit d'un format vectoriel, c'est-à-dire que l'image est stockée via des formules mathématiques, qui modélisent les différents points et lignes dans une grille.
Il n'y a donc pas de perte de résolution lors d'agrandissements ou de réductions de l'image. {cite:p}`format_svg`

Pour la programmation, un numéro a été attributé à chaque case, en suivant le schéma ci-dessous:

```{figure} images/plateau.png
---
width: 100%
---
Architecture du site
```
Le choix de commencer par la numérotation par 0 vient du fait qu'il est ainsi possible de créer une liste représentant le plateau, dans laquelle l'index d'une case correspond à son numéro d'identification.

Pour qu'il soit possible de sélectionner les cases, une zone <em>area</em>. Le code ci-dessous présente l'implémentation des trois premières cases du plateau.

```{literalinclude} /src/plateau.html
:language: html
:caption: /src/plateau.html
:linenos: true
:lines: 57-60
```

Les coordonnées des zones de sélection ont été définies à partir des coordonnées des cases données par le fichier svg. Cette zone est plus grande que la case elle-même, dans le but de rendre le jeu plus agréable à utiliser.

Les pions quant à eux sont directement des éléments HTML. De la même manière, chacun d'entre eux est numéroté, de 1 à 9. Ici, la numérotation commence par 1, car ceci permettra par la suite de simplifier le code de la mise en place du jeu. 


### Idée d'algorithme de jeu

Une partie se découpe en deux phases principales. 

Il y a tout d'abord une phase de mise en place, durant laquelle chaque joueur pose ses neufs pions. Dès le cinquième tour, un contrôle du plateau est effectué par savoir si un moulin a été formé ou non. A partir cet instant, ce même contrôle est effectué après chaque tour joué.

Une fois que tous les pions ont été mis en place, la phase de déplacement des pions commencent. A tour de rôle, les joueurs effectuent deux actions différentes qui seront implémentées dans deux fonction différentes: sélectionner un pion et sélectionner une case sur laquelle ils souhaient déplacer ce pion.

### Détail du code

Le fichier principal d'implémentation du jeu local est <emp>jeu.js</emp>.

#### Sélection des options de jeu

La première étape consiste à prendre en compte les options de jeu choisies par le créateur de la partie. 


