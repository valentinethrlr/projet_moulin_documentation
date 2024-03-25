(explication)=

# Explication du fonctionnement du code

Le back-end se compose en deux parties. Il y a d'une part les fichiers qui s'occupent des parties en local, rédigés en JavaScript, et d'autre part ceux qui s'occupent des parties en ligne, codées sur un serveur, également en JavaScript et en utilisant les fonctions de node.js.

Le front-end quant à lui est rédigé en HTML et CSS.


## Le plateau

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


## Idée d'algorithme de jeu

Une partie se découpe en deux phases principales. 

Il y a tout d'abord une phase de mise en place, durant laquelle chaque joueur pose ses neufs pions. Dès le cinquième tour, un contrôle du plateau est effectué par savoir si un moulin a été formé ou non. A partir cet instant, ce même contrôle est effectué après chaque tour joué.

Une fois que tous les pions ont été mis en place, la phase de déplacement des pions commencent. A tour de rôle, les joueurs effectuent deux actions différentes qui seront implémentées dans deux fonction différentes: sélectionner un pion et sélectionner une case sur laquelle ils souhaient déplacer ce pion.

## Parties en local


Le fichier principal d'implémentation du jeu local est <em>jeu.js</em>.

#### Sélection des options de jeu

La première étape consiste à prendre en compte les options de jeu choisies par le créateur de la partie. 

Pour ce faire, l'option de couleur et de temps sont sauvegardés à partir d'une fonction <em>onclick</em> définie sur la page HTML. Si le temps choisi est de 5 minutes, un <em>5</em> sera mis en paramètre de la fonction. Pour 10 minutes le paramètre deviendra <em>10</em> et <em>0</em> si le temps de jeu voulu est infini. La même idée est utilisée pour les couleurs, si le créateur de la partie souhaite avec des pions blancs, le paramètre donné sera <em>b</em>, un <em>n</em> sera donné pour le choix d'avoir des pions noirs et un <em>a</em> si l'option aléatoire est choisie.

Voici le code HTML qui permet de réaliser cela:

```{literalinclude} /src/plateau.html
:language: html
:caption: /src/plateau.html
:linenos: true
:lines: 3-15
```

Les fonctions <em>duree(t)</em> et <em>couleur(c)</em> enregistre simplement les options choisies dans des variables globales <em>dureeJoueur</em> et <em>couleurJoueur</em>. 

#### Variables globales

Afin de faciliter l'implémentation du jeu, plusieurs variables globales ont été définies.

Tout d'abord, la variable <em>plateau</em> modélise la plateau à chaque instant du jeu, en enregistrant la position des pions qui s'y trouve. Dans cette liste, l'élément à l'index n correspond au pion se trouvant sur la case de numéro d'identification n.

Les déplacements possibles sur le plateau d'une case à une autre sont modélisés par toutes les variables zone<em>n</em>. Il s'agit d'une liste, comprenant tous les numéros des cases sur lesquels il est possible de se déplacer à partir de la case <em>n</em>.

La figure ci-dessous illustre la <em>zone0</em> et la <em>zone19</em>.

```{figure} images/zones.png
---
width: 100%
---
Exemples de zones: zone0 et zone19
```

La liste <em>moulins</em> présente tous les triplets de cases sur lesquels il est possible d'avoir un moulin. Nous constatons donc qu'il y a au total seize dispositions de moulin différentes.

Cette liste est liée à <em>moulinsPlateau</em>, qui à une position i indique si le triplet de cases à l'indexe i de <em>moulins</em> est occupée par un moulin. Ceci permet de garder en mémoire les moulins présents sur la plateau même lorsqu'ils ont été créées durant les tours de jeu antérieur, sans qu'ils soient à nouveau détectés à chaque nouveau tour.

Les deux variables <em>nbBElimine</em> et <em>nbNElimine</em> sauvegarde le nombre de pions blancs, respectivement noirs, qui ont déjà été éliminés durant la partie.

La variable <em>mouvementsSansPrise</em> permet ensuite de prendre en compte la règle du jeu qui stipule que lorsqu'il y a 50 mouvements sans aucune prise, la partie est considérée comme nulle.

En ce qui concerne le déroulement du jeu, la variable globale <em>joueur_actuel</em> désigne le joueur qui doit jouer pendant le tour actuel, tandis que <em>autre_joueur</em> désigne le joueur en attente.


#### <em>tourJoue()</em>

Cette fonction permet d'incrémenter les tours durant la partie. Une fois qu'un des joueurs a terminé son action de jeu, c'est l'autre qui devient le <em>joueur_actuel</em>. Une indication avec la couleur du joueur qui doit réaliser un mouvement s'affiche alors au-dessus du plateau. Finalement, si une option de durée de jeu a été choisie, le chronomètre du joueur suivant se déclenche. Les variables <em>tempsb</em> et <em>tempsn</em> indiquent le temps de jeu restant du joueur blanc, respectivement noir.

La fonction de chronométrage, <em>timer(temps)</em> prend donc en paramètre le temps de jeu restant du joueur et décrémente toutes les secondes cette variable grâce à la fonction JS <em>setInterval()</em>. Lors d'une décrémentation, l'horloge présente sur la page de jeu et implémentée en HTML est également modifiée.


#### <em>joue(numeroCase)</em>

Cette fonction s'occupe de tout ce qui est lié à la sélection d'une case du plateau. Lorsqu'une case est sélectionnée par un utilisateur, cette fonction s'exécute avec en paramètre le numéro d'identification de la case choisie.

Lors des 18 premiers tours de jeu (phase de mise en place), elle permet aux joueurs de poser tour à tour leurs pions sur le plateau.

```{literalinclude} /src/jeu.js
:language: js
:caption: /src/jeu.js
:linenos: true
:lines: 178-195
```

Cette partie du code s'appuie principalement sur le choix des noms d'id des pions dans le code HTML. Ils suivent la construction <em>p</em> + <em>b</em> ou <em>n</em> (en fonction de la couleur du pion) + un numéro d'identification.

Le déplacement des pions jusqu'à une case se fait par la fonction <em>deplacement(pion, case)</em>.

Cette fonction commence par appeler une autre fonction <em>mouvement(pion, case)</em>, qui code explicitement le déplacement du pion sur la case en indiquer les nouvelles coordonnées que devra prendre ce dernier. Ensuite, elle actualise la variable <em>plateau</em>.

De la même manière, la fonction <em>joue(case)</em> permet de déplacer les pions durant la phase de jeu. S'il un joueur n'a plus que 3 pions, il peut se déplacer comme il le souhaite sur le plateau; il n'y a donc aucune condition avant le mouvement.

En revanche, lors des tours "normaux", une condition vérifie que la case choisie se situe bien dans la <em>zone</em> de la case sur laquelle se trouve le pion à déplacer.

```{literalinclude} /src/jeu.js
:language: js
:caption: /src/jeu.js
:linenos: true
:lines: 215-221
```

Dans cette condition, l'emplacement du pion est tout d'abord recherchée par l'expression <em>plateau.indexOf(pion_actuel)</em>. Ce numéro de case est accolé au <em>zone</em> à l'aide d'une template-string, puis cette string est évaluée en tant que variable par la fonction eval(). Finalement, il est vérifié que la case sélectionne se trouve dans cette zone avec la méthode <em>includes</em>.

Le deuxième rôle de <em>joue(numeroCase)</em> est de contrôler si un moulin a été formé immédiatement après le fin du tour du joueur (c'est-à-dire lorsqu'il aura poser son pion). Ce contrôle ne s'effectue qu'à partir du cinquième tour, étant donné qu'il est impossible de former un moulin avant.
Pour ce faire, toutes les configurations possibles de moulin (présentées dans <em>moulins</em>) sont parcourues et il est à chaque fois vérifié si les pions présents sur ces triplets sont identiques. Si c'est effectivement le cas, il est contrôlé que le moulin vient d'être formé, donc qu'il ne se situe pas encore dans la liste <em>moulinsPlateau</em>. Si ce n'est pas le cas, les contrôles continuent jusqu'à la fin de la liste des triplets et la configuration est indiqué comme vide dans <em>moulinsPlateau</em>. Ceci permet de prendre en compte le cas où un moulin est ouvert, et donc potentiellement à nouveau formable.

S'il y a effectivement un moulin, un message est affiché au-dessus du plateau. Le moulin est enregistrer dans <em>moulinsPlateau</em>, le type de moulin dans <em>typeMoulin</em> et le nombre de mouvements sans prise est remis à zéro.
La fonction <em>listePossible</em> permet de créer la liste des pions qu'il sera possible d'éliminer à l'adversaire, ceux qui ne sont dans aucun moulin. Si tous les pions sont dans des moulins, tous les pions adverses sur le plateau sont éliminables. Les éléments présents dans cette liste sont animés pour être plus facilement repérables. 

L'animation est réalisée en CSS. 

```{literalinclude} /src/jeu.css
:language: css
:caption: /src/jeu.css
:linenos: true
:lines: 1-9
```

Le décorateur <em>@keyframes</em> indique l'état final de l'objet, en l'occurrence, il obtiendra un bord rouge. Ensuite, la propriété <em>.animationSelection</em> indique la durée de l'animation, qui est dans ce cas de 0.75 secondes.

S'il n'y a pas de moulin au triplet contrôlé, cet emplacement est marqué <em>null</em> dans la liste <em>moulinsPlateau</em>. Ceci permet également de prendre en compte les cas de moulins existants qui ont été détruits, mais qui pourraient être reformés par la suite.

Une fois de le joueur à fini son tour (c'est-à-dire que son pion a été déplacé), la fonction <em>tourJoue()</em> est exécutée.

#### <em>selectionne(pionId)</em>

Cette fonction gère tout ce qui concerne la sélection d'un pion. Elle est appelée lorsqu'un utilisateur clique sur un pion, et reçoit en paramètre l'identifiant de ce dernier.

En première lieu, elle contrôle s'il y a eu un moulin, afin de permet à l'utilisateur de supprimer un pion de son adversaire. La première condition vérifiée dans ce cas est qu'il soit bien possible de supprimer le pion sélectionné. Pour ce faire, nous pouvons tirer profit de la liste <em>pionsPossibles</em> qui avait été crée dans la fonction <em>joue(case)</em> lorsque le moulin avait été repéré, afin de justement mettre en évidence les pions qu'il est possible de supprimer. 
Une autre variable globale initialisée dans <em>jou(case)</em> est également réutilisée ici. Il s'agit de la situation particulière où tous les pions adverses se trouvent dans un moulin, et qu'il est donc possible d'éliminer n'importe quel pion. Dans ce cas, la variable <em>supprimeDansMoulin</em> prend la valeur <em>true</em>. Tous les moulins contenant le pion éliminé seront alors supprimés de la liste <em>moulinsPlateau</em>.

Si le pion peut bien être éliminé, la fonction <em>elimine(pionId)</em> est appelée. Elle masque le pion sur le plateau et révèle un pion du côté du joueur qui a formé le moulin.

Finalement, la fonction enlève l'animation de tous les pions présents sur le plateau, met à jour la liste <em>plateau</em> et <em>typeMoulin</em>, puis permet à l'autre joueur de jouer en appelant <em>tourJoue()</em>.

Le deuxième rôle de cette fonction est de sélectionner un pion afin de le déplacer. Avant tout, toutes les animations potentielles des pions sont supprimées. Ceci permet par exemple à un joueur de sélectionner un pion, puis de changer d'avis avant de cliquer sur une case et de choisir un autre pion. 

Il y a ensuite un contrôle qui vérifie que le pion désiré appartient bien au joueur qui doit faire un mouvement. Le pion est alors enregistré dans la variable globale <em>pion_actuel</em>. Après cela, la fonction <em>joue(case)</em> pourra être appelée.

Finalement, cette fonction contrôle les fins de partie. Elle vérifie qu'aucun joueur n'ait perdu plus de 6 pions. Si c'est le cas, la fonction <em>finDePartie(gagnant)</em> est appelée. Cette dernière masque tous les éléments sur la page, puis affiche le nom du vainqueur.

## Parties en ligne

Pour les parties en ligne, la technologie utilisée est le node JS, avec le concept de web sockets.