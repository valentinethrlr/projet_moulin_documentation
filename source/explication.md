(explication)=

# Explication du fonctionnement du code

Le back-end se compose de deux parties. Il y a d'une part les fichiers qui s'occupent des parties en local, rédigés en JavaScript, et d'autre part ceux qui s'occupent des parties en ligne, également en JavaScript et en utilisant la librairie <em>socket.io</em>.

Le front-end quant à lui est rédigé en HTML et CSS.

## Caractéristiques du serveur

Ce projet est hébergé sur un serveur Dell Poweredge. Celui-ci contient 10 HDD sur lesquels sont stocké les fichiers du site, ainsi que 2 SSD sur lesquels le système d'exploitation est installé.


## Le plateau

Le plateau a été dessiné sur https://www.drawio.com/, puis converti en fichier svg. L'avantage est qu'il s'agit d'un format vectoriel, c'est-à-dire que l'image est stockée via des formules mathématiques qui modélisent les différents points et lignes dans une grille.
Il n'y a donc pas de perte de résolution lors de l'agrandissement ou de la réduction de l'image. {cite:p}`format_svg`

Dans le code, un numéro a été attribué à chaque case, en suivant le schéma ci-dessous:

```{figure} images/plateau.png
---
width: 40%
---
Numérotation des cases
```
Le choix de commencer la numérotation par 0 vient du fait qu'il est ainsi facilement possible de créer une liste représentant le plateau, dans laquelle l'index d'une case correspond à son numéro d'identification.

Une zone <em>area</em> entoure chaque case, pour qu'il soit possible de les sélectionner. Le code ci-dessous présente l'implémentation des trois premières cases du plateau.

```{literalinclude} /src/plateau.html
:language: html
:caption: /src/plateau.html
:linenos: true
:lines: 57-60
```

Les coordonnées des zones de sélection ont été définies à partir des coordonnées des cases données dans le fichier svg. Cette zone est plus grande que la case elle-même, dans le but de rendre le jeu plus agréable à utiliser et éviter à l'utilisateur de devoir cliquer exactement sur les pixels de la case.

Les pions quant à eux sont des éléments HTML. Chacun d'entre eux a comme identification un <em>p</em> (pour pion) suivi d'un <em>b</em> ou <em>n</em> (si le pion est blanc ou noir) et un numéro de 1 à 9. Ici, la numérotation commence par 1, car ceci permettra par la suite de simplifier le code de la mise en place du jeu. 


## Idée d'algorithme de jeu

Une partie est constituée de deux phases principales. 

Il y a tout d'abord une phase de mise en place, durant laquelle chaque joueur pose ses neufs pions sur le plateau. Dès le cinquième tour, un contrôle du plateau est effectué par savoir si un moulin a été formé ou non.

Une fois que tous les pions ont été mis en place, la phase de déplacement des pions commence. A tour de rôle, les joueurs effectuent deux actions différentes qui seront implémentées dans deux fonctions différentes: sélectionner un pion et sélectionner la case sur laquelle ils souhaitent déplacer ce pion.

## Parties en local


Le fichier principal d'implémentation du jeu local est <em>jeu.js</em>, qui se trouve dans le dossier <em>assets</em> de <em>moulin</em> dans <em>public_html</em>.

#### Sélection des options de jeu

La première étape consiste à prendre en compte les options de jeu choisies par le créateur de la partie. 

Pour ce faire, l'option de couleur et de temps sont sauvegardés à partir d'une fonction liée à un <em>onclick</em> de la page HTML. Si le temps choisi est de 5 minutes, un <em>5</em> sera mis en paramètre de la fonction <em>duree(t)</em>. Pour 10 minutes, le paramètre deviendra <em>10</em> et <em>0</em> si le temps de jeu voulu est infini. La même idée est utilisée pour les couleurs, si le créateur de la partie souhaite avoir les pions blancs, le paramètre donné à <em>couleur(c)</em> sera <em>b</em>, un <em>n</em> sera donné s'il souhaite les pions noirs et un <em>a</em> si l'option aléatoire est choisie.

Voici le code HTML qui permet de réaliser cela:

```{literalinclude} /src/plateau.html
:language: html
:caption: /src/plateau.html
:linenos: true
:lines: 3-15
```

Les fonctions <em>duree(t)</em> et <em>couleur(c)</em> enregistrent ensuite les options choisies dans des variables globales: <em>dureeJoueur</em> et <em>couleurJoueur</em>. 

Si une de ces deux options n'a pas été déterminée par le créateur de la partie, un message d'erreur s'affiche sur l'écran.

#### Variables globales

Afin de faciliter l'implémentation du jeu, plusieurs variables globales ont été définies.

Tout d'abord, la liste <em>plateau</em> modélise le plateau à chaque instant du jeu, en enregistrant la position des pions qui s'y trouvent. Dans cette liste, l'élément à l'index <em>n</em> correspond au pion se trouvant sur la case de numéro d'identification <em>n</em>.

Les déplacements possibles sur le plateau d'une case à une autre sont modélisés par toutes les variables zone-<em>n</em>. Il s'agit de listes, comprenant tous les numéros des cases sur lesquelles il est possible de se déplacer à partir de la case <em>n</em>.

La figure ci-dessous illustre la <em>zone0</em> et la <em>zone19</em>.

```{figure} images/zones.png
---
width: 40%
---
Exemples de zones: zone0 et zone19
```

Voici ces zones dans le fichier <em>jeu.js</em>:

```{literalinclude} /src/jeu.js
:language: html
:caption: /src/jeu.js
:linenos: true
:lines: 17, 36
```

La liste <em>moulins</em> présente tous les triplets de cases sur lesquels il est possible d'avoir un moulin. Nous constatons donc qu'il y a au total seize dispositions de moulin différentes.

Cette liste est liée à <em>moulinsPlateau</em>, qui à une position <em>i</em> indique si le triplet de cases à l'index <em>i</em> de <em>moulins</em> est occupé par un moulin. Ceci permet de garder en mémoire les moulins présents sur le plateau même lorsqu'ils ont été créés durant les tours de jeu antérieurs, sans qu'ils ne soient détectés à chaque nouveau tour.

Pour illustrer ceci, voici un exemple concret d'un instant de partie:

```{figure} images/situationParticuliere.png
---
width: 40%
---
Instant de partie
```

La liste <em>moulin</em> se présente comme il suit:

```{literalinclude} /src/jeu.js
:language: html
:caption: /src/jeu.js
:linenos: true
:lines: 43
```

Nous constatons donc que les deux moulins présents sur le plateau correspondent aux triplets des index 1 et 8.

La liste <em>moulinsPlateau</em> est par conséquent:

```{literalinclude} /src/jeu.js
:language: html
:caption: /src/jeu.js
:linenos: true
:lines: 574
```

Ensuite, la variable <em>typeMoulin</em> prend comme valeur <em>b</em> ou <em>n</em> si un moulin vient d'être formé sur le plateau (et qu'il est soit blanc soit noir) et <em>null</em> si aucun nouveau moulin n'a été détecté.

Les deux variables <em>nbBElimine</em> et <em>nbNElimine</em> sauvegardent le nombre de pions blancs, respectivement noirs, qui ont déjà été éliminés durant la partie.

La variable <em>mouvementsSansPrise</em> permet ensuite de prendre en compte la règle du jeu qui stipule que lorsqu'il y a 50 mouvements sans aucune prise, la partie est considérée comme nulle. Elle sauvegarde donc le nombre de tours consécutifs sans formation de moulin.

En ce qui concerne le déroulement du jeu, la variable globale <em>joueur_actuel</em> désigne le joueur qui doit jouer pendant le tour actuel, tandis que <em>autre_joueur</em> désigne le joueur en attente.


#### <em>tourJoue()</em>

```{literalinclude} /src/jeu.js
:language: html
:caption: /src/jeu.js
:linenos: true
:lines: 129-158
```

Cette fonction permet d'incrémenter les tours durant la partie. (Le compte des tours se fait par la variable globale <em>tour</em>.) Lorsqu'un des joueurs a terminé son action de jeu, c'est l'autre qui devient le <em>joueur_actuel</em>. Une indication avec la couleur des pions du joueur qui doit réaliser un mouvement s'affiche alors au-dessus du plateau. Finalement, si une option de durée de jeu a été choisie, le chronomètre du joueur suivant se déclenche. Les variables <em>tempsb</em> et <em>tempsn</em> indiquent le temps de jeu restant du joueur aux pions blancs, respectivement noirs.

La fonction de chronométrage, <em>timer(temps)</em> prend donc en paramètre le temps de jeu restant du joueur et décrémente toutes les secondes cette variable grâce à la fonction JS <em>setInterval()</em>. Lors d'une décrémentation, l'horloge présente sur la page de jeu et implémentée en HTML est également modifiée.


#### <em>joue(numeroCase)</em>

Cette fonction s'occupe de tout ce qui est lié à la sélection d'une case du plateau.

Lorsqu'une case est sélectionnée par un utilisateur, cette fonction s'exécute en prenant comme paramètre le numéro d'identification de la case choisie.

Lors des 18 premiers tours de jeu (phase de mise en place), elle permet aux joueurs de poser à tour de rôle leurs pions sur le plateau.

```{literalinclude} /src/jeu.js
:language: js
:caption: /src/jeu.js
:linenos: true
:lines: 175-192
```

Cette partie du code s'appuie principalement sur le choix des noms d'id des pions dans le code HTML. Ils suivent la construction <em>p</em> + <em>b</em> ou <em>n</em> (en fonction de la couleur du pion) + un numéro d'identification.

Le déplacement des pions jusqu'à une case se fait par la fonction <em>deplacement(pion, case)</em>.

Cette fonction commence par appeler une autre fonction <em>mouvement(pion, case)</em>, qui code explicitement le déplacement du pion sur la case en indiquer les nouvelles coordonnées que devra prendre ce dernier. La fonction actualise ensuite la liste <em>plateau</em>, en plaçant l'id du pion au bon endroit selon la case sur laquelle il se trouve.

Pour la suite du jeu, les pions sont déplacés à l'aide de cette même fonction. Si un joueur n'a plus que 3 pions, il peut se déplacer comme il le souhaite sur le plateau; il n'y a donc aucune condition avant le mouvement.

En revanche, lors des tours "normaux", une condition vérifie que la case choisie se situe bien dans la <em>zone</em> de la case sur laquelle se trouve le pion à déplacer.

```{literalinclude} /src/jeu.js
:language: js
:caption: /src/jeu.js
:linenos: true
:lines: 212-218
```

Dans cette condition, l'emplacement du pion est tout d'abord recherchée par l'expression <em>plateau.indexOf(pion_actuel)</em>. Ce numéro de case est accolé au <em>zone</em> à l'aide d'une template-string, puis cette string est évaluée en tant que variable par la fonction <em>eval()</em>. Finalement, il est vérifié que la case sélectionnée se trouve dans cette zone avec la méthode <em>includes</em>.

Après chaque déplacement, il est vérifié que le joueur suivant puisse lui aussi faire un mouvement et qu'il ne soit pas bloqué. Si c'est le cas, il a perdu la partie. Pour ce faire, la fonction <em>controleMouvementPossible()</em> est appelée. Elle vérifie simplement qu'au moins une des cases de des zone des cases sur lesquelles se trouvent ses pions soit libre.

Le deuxième rôle de <em>joue(numeroCase)</em> est de contrôler si un moulin a été formé immédiatement après le fin du tour du joueur (c'est-à-dire lorsqu'il aura posé son pion). Ce contrôle ne s'effectue qu'à partir du cinquième tour, étant donné qu'il est impossible de former un moulin avant, puisque les joueurs n'auront que deux pions sur le plateau.

Pour ce faire, toutes les configurations possibles de moulin (présentées dans <em>moulins</em>) sont parcourues et il est à chaque fois vérifié si les pions présents sur ces triplets sont identiques. Si c'est effectivement le cas, il est contrôlé que le moulin vient d'être formé; par conséquent qu'il n'existe pas encore dans la liste <em>moulinsPlateau</em> à l'emplacement correspondant. Si les pions des cases des triplets sont différents, les contrôles continuent jusqu'à la fin de la liste des triplets et la configuration est marqué <em>null</em> dans la liste <em>moulinsPlateau</em>. Ceci permet également de prendre en compte les cas de moulins existants qui ont été détruits, mais qui pourraient être reformés par la suite.

S'il y a effectivement un moulin, un message est affiché au-dessus du plateau. Le moulin est enregistré dans <em>moulinsPlateau</em>, le type de moulin dans <em>typeMoulin</em> et le nombre de mouvements sans prise est remis à zéro.

La fonction <em>listePossible</em> permet de créer la liste des pions qu'il sera possible d'éliminer à l'adversaire, ceux qui ne sont dans aucun moulin.(Si tous les pions sont dans des moulins, tous les pions adverses sur le plateau sont éliminables.)

Afin de créer cette liste, il est tout d'abord plus simple de créer la liste des pions qu'il n'est pas possible de supprimer: c'est-à-dire les pions formant un moulin.

```{literalinclude} /src/jeu.js
:language: css
:caption: /src/jeu.js
:linenos: true
:lines: 404-425
```

Pour ce faire, il suffit de parcourir la liste <em>moulinsPlateau</em>, si un emplacement contient un moulin adversaire (donc pas du type du moulin qui vient d'être créé), les pions situés sur les cases du triplet correspondant sont ajouté dans la liste <em>intouchable</em>, qui est finalement retournée.

Ensuite, pour créer la liste des pions qu'il est possible de supprimer, nous prenons tous les pions adverses et vérifions qu'ils se trouvent sur le plateau, mais qu'ils se trouvent pas dans la liste des pions intouchables.

```{literalinclude} /src/jeu.js
:language: css
:caption: /src/jeu.js
:linenos: true
:lines: 428-452
```

Les éléments présents dans liste des pions possibles sont animés pour être plus facilement repérables. 

L'animation est réalisée en CSS. 

```{literalinclude} /src/jeu.css
:language: css
:caption: /src/jeu.css
:linenos: true
:lines: 1-9
```

Le décorateur <em>@keyframes</em> indique l'état final de l'objet: en l'occurrence, il obtiendra un bord rouge. Ensuite, la propriété <em>.animationSelection</em> indique la durée de l'animation, qui est dans ce cas de 0.75 secondes.

Une fois de le joueur à fini son tour (c'est-à-dire que son pion a été déplacé), la fonction <em>tourJoue()</em> est exécutée.

#### <em>selectionne(pionId)</em>

Cette fonction gère tout ce qui concerne la sélection d'un pion. Elle est appelée lorsqu'un utilisateur clique sur un pion et reçoit en paramètre l'identifiant de ce dernier.

En premier lieu, la fonction contrôle s'il y a eu un moulin (c'est-à-dire si la variable <em>typeMoulin</em> a comme valeur soit <em>b</em> soit <em>n</em>), afin de permettre à l'utilisateur de supprimer un pion de son adversaire. 

Lorsqu'il sélectionne alors un pion première condition vérifiée est qu'il soit bien possible de supprimer le pion sélectionné. Pour ce faire, nous pouvons tirer profit de la liste <em>pionsPossibles</em> qui avait été créée dans la fonction <em>joue(case)</em> lorsque le moulin avait été repéré, afin de mettre en évidence les pions qu'il est justement possible de supprimer. 

Une autre variable globale initialisée dans <em>joue(case)</em> est également réutilisée ici. Il s'agit de la situation particulière où tous les pions adverses se trouvent dans un moulin, et qu'il est par conséquent possible d'éliminer n'importe quel pion. Dans ce cas, la variable <em>supprimeDansMoulin</em> prend la valeur <em>true</em>. Tous les moulins contenant le pion éliminé seront alors supprimés de la liste <em>moulinsPlateau</em>.

Si le pion peut bien être éliminé, la fonction <em>elimine(pionId)</em> est appelée. Elle masque le pion sur le plateau et révèle un pion du côté du joueur qui a formé le moulin. Ceux-ci sont déjà présents dans le code HTML, mais ne sont simplement pas affichés.

Pour finir, la fonction enlève l'animation de tous les pions présents sur le plateau, met à jour la liste <em>plateau</em> et <em>typeMoulin</em>, puis permet à l'autre joueur de jouer en appelant <em>tourJoue()</em>.

Le deuxième rôle de cette fonction est de sélectionner un pion afin de le déplacer. Avant tout, toutes les animations potentielles des pions sont supprimées. Ceci permet à un joueur de sélectionner un pion, puis de changer d'avis avant de cliquer sur une case et d'en choisir un autre. 

Il y a ensuite un contrôle qui vérifie que le pion désiré appartient bien au joueur qui doit faire un mouvement. Le pion est alors enregistré dans la variable globale <em>pion_actuel</em>. Après cela, la fonction <em>joue(case)</em> pourra être appelée.

Finalement, cette fonction contrôle les fins de partie. Elle vérifie qu'aucun joueur n'ait perdu plus de 6 pions. Si c'est le cas, la fonction <em>finDePartie(gagnant)</em> est appelée. Cette dernière masque tous les éléments sur la page, puis affiche le nom du vainqueur.

## Parties en ligne

Pour les parties en ligne, la technologie utilisée est le node JS, avec le concept de WebSockets.

### Utilité des WebSockets

Les sources utilisées pour rédiger cette partie sont: {cite:p}`socket_video`, {cite:p}`socket_page1`, {cite:p}`socket_page2` et {cite:p}`socket_page3`.

L'idée est de créer une connection bidirectionnelle entre le serveur et le client, qui sont alors appelés des "sockets". 
L'avantage est que le client et le serveur pourront ensuite s'envoyer des messages en temps réel, sans que le client ne doive constamment faire des demandes auprès du serveur. 

```{figure} images/websocket-handshake.png
---
width: 40%
---
WebSocket en schéma, tiré de {cite:p}`socket_page2`
```

Afin d'établir cette connexion, il y a tout d'abord une phase dite de "handshake".

Du côté du serveur, un port doit être ouvert. Pour ce projet, il s'agit du port 25565. (La raison pour cela est que le propriétaire du serveur m'a indiqué qu'il était libre). Ensuite, le serveur est mis "sur écoute".

Ensuite, le client envoie une première requête (une requête HTTP) vers ce port, pour demander une connection. Si le serveur accepte cette demande, une liaison est établie entre les deux. A partir de cet instant, des messages transiteront entre eux automatiquement, sans autre requête.

Dès qu'une des deux socket se déconnecte, la connexion est rompue et se ferme.

### Socket\.IO

La source principale de ce chapitre est {cite:p}`socketIo`, la documentation officielle de la librairie socket\.IO. 

Socket\.IO est une librairie JS qui permet d'implémenter des connections webSocket. En fournissant une abstraction et des fonctionnalités supplémentaires, elle permet de faciliter l'utilisation du protocole webSocket. Néanmoins, elle garde la possibilité d'utiliser des requêtes HTTP long-polling comme solution de secours.

Pour créer une connexion du côté serveur, les lignes suivantes sont nécessaires:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 2-25
```
Les premières lignes servent à initialiser un serveur HTTP et la dernière à écouter les différentes tentatives de connexion au port spécifié.

Une constante <em>moulinWorkspace</em> a été créée pour différencier les informations provenant des parties de moulin de celles qui viennent des parties de morpion (ce jeu avait été programmé sur le même site comme préparation au projet du moulin).

Enfin d'établir le lien, cette ligne de code est nécessaire du côté client:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 28
```

Une fois le <em>handshake</em> complété, la syntaxe pour envoyer un message est du côté client est:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 30-32
```
La première ligne fait référence à la connexion qui a été établie entre le serveur et le client.

Du côté serveur, une fonction <em>envoieMoulin</em> a été créée pour rendre le code plus lisible par la suite:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 35-37
```

Pour recevoir un message, l'idée est la même côté client et côté serveur, il suffit de repérer un événement particulier:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 40-42
```
Pour que ce bloc soit exécuté, il faut simplement que le nom de l'événement attendu corresponde à celui de l'événement envoyé. 


### Programmation

Le fichier d'entrée côté client est <em>ligne.js</em> qui se trouve dans le dossier <em>assets</em> de <em>moulin</em> de <em>public_html</em>. Il est lié aux pages HTML <em>jouer.html</em> et <em>rejoindre</em>. Côté serveur, il s'agit du fichier <em>moulin.js</em> dans le dossier <em>moulin</em> de <em>nodeJS</em>.

Globalement, l'algorithme de jeu est le même que pour les parties en local. Une grande partie du code a donc été repris du fichier <em>jeu.js</em> et mis dans la classe du fichier <em>PartieMoulin.js</em>. Pour des raisons de sécurité, il n'était pas possible d'avoir un fichier commun avec cette partie du code, le but étant de séparer rigoureusement ce qui concerne le client de ce qui concerne le serveur.

La principale différence est que tous les "calculs" se font sur le serveur, qui ne fait ensuite qu'envoyer ce qui doit être affiché sur les écrans des joueurs. Les clients quant à eux envoient les identifiants des cases et des pions sélectionnés.

#### Variables globales de <em>moulin.js</em>

Ce fichier ne contient en réalité qu'une classe, qui sera exporté dans le fichier <em>index.js</em> du dossier <em>nodeJs</em>.

Cette classe sauvegarde toutes les parties dans l'objet <em>parties</em>, avec l'id de la partie comme clé et un objet <em>PartieMoulin</em> comme valeur.

La deuxième variable globale est l'objet <em>joueurs</em>, qui stocke les identifiants des clients comme clé et l'identifiant de la partie à laquelle ils jouent comme valeur.


#### Mise en place du jeu côté serveur

Lorsque le client clique sur le bouton <em>Créer une partie en ligne</em>, la fonction suivante (qui se trouve dans le fichier <em>ligne.js</em>) est appelée:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 46-52
```
Nous constatons qu'ici un message est envoyé vers le serveur sous le format JSON. C'est ce même format qui sera utilisé dans tout le code. Le "but" décrit le type d'événement spécifique, ici, il s'agit de la création d'un id de partie. Ensuite, les options de durée et de couleur du créateur sont indiqués. Nous pouvons remarquer qu'il s'agit des variables globales du fichier <em>jeu.js</em>. Nous pouvons utiliser celles-ci, car les deux fichiers JS sont liés à la même page HTML.

Le serveur récupère le message comme il suit:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 54-66
```
Si le "but" reçu dans le message correspond à "creationId", un id comprenant entre 1 et 6 décimales sera généré aléatoirement. Au ligne 9 et 10, les informations sur les deux options de jeu sont récupérées. Ensuite, l'identifiant du créateur de la partie (<em>socket.id</em>) est stocké dans l'objet <em>joueurs</em> avec l'identifiant de la partie à laquelle il jouera. Par la suite, une nouvelle instance de <em>PartieMoulin</em> est créée, en indiquant l'id de la partie, celle du premier joueur (donc le créateur), la durée et la couleur des pions du créateur. Finalement, l'identifiant est envoyé au client. Celui-ci récupérera l'information et l'affichera pour qu'il puisse le transmettre à son adversaire.

Cet adversaire pourra joindre la partie en indiquant ce même identifiant après avoir cliqué sur le bouton <em>rejoindre une partie</em>. Si la partie qu'il désire rejoindre existe bel et bien, il sera ajouté en temps que <em>joueur2</em> dans celle-ci et un plateau s'affichera sur l'écran des deux utilisateurs. La partie peut dès lors commencer.

#### Classe <em>PartieMoulin</em>

De manière générale, les variables d'instance sont les mêmes que les variables globales dans les parties en local. La seul différence est qu'il faut dans le cas d'une partie en ligne connaître la couleur des pions de chaque utilisateur. Nous avons donc <em>couleur1</em> et <em>couleur2</em>, qui  indiquent la couleur du joueur 1, respectivement du joueur 2. La variable <em>joueur1</em> donne l'identifiant <em>socket.\io</em> du créateur de la partie et <em>joueur2</em> de l'utilisateur qui l'a rejoint. 
Finalement, les variables <em>actuel_joueur</em> et <em>autre_joueur</em> permettent d'indiquer quel joueur a le droit de jouer et lequel doit attendre, en prenant à tour de rôle les valeurs <em>1</em> et <em>2</em>.

Les méthodes sont globalement les mêmes que les fonctions de <em>jeu.js</em> et sont nommées à l'identique. Néanmoins, au lieu de changer directement ce qui est affiché à l'écran des utilisateurs au cours de la partie, un message est envoyé aux clients avec les informations nécessaire pour qu'eux-même puissent modifier les pages web.

Par exemple, lors du déplacement d'un pion, les messages suivant sont envoyés:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 84-85
```
Le premier est à destination du premier joueur et le deuxième du deuxième joueur. Le message sera ensuite récupéré comme il suit par les clients:

```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 87, 128-135
```
Nous constatons que le mouvement est tout d'abord effectué sur le plateau (fonction <em>mouvementLigne</em>, qui fonctionne de la même manière que la fonction <em>mouvement</em> de <em>jeu.js</em>). Ensuite, en fonction du joueur, il sera indiqué si c'est à lui de jouer ou s'il doit maintenant attendre que son adversaire joue.

Pour faire passer des messages du client au serveur et afin d'éviter d'envoyer inutilement des informations lorsqu'une partie est jouée en local, une deuxième fonction <em>joueLigne()</em> est ajoutée aux "onclick" des pions et <em>selectionneLigne()</em> à ceux des cases. Bien que cette pratique ne soit pas très optimale, elle est tout de même pratique dans ce cas précis, puisque cela évite de faire basculer les clients vers une autre page HTML et par conséquent de changer leur <em>socket.id</em> auprès du serveur. Par ailleurs, il est assuré que durant une partie en ligne, les fonctions relatives aux parties locales ne seront pas exécutées, puisqu'une condition <em>enLigne</em> devrait être vérifiée. Or cette variable ne prend la valeur <em>true</em> que si le bouton <em>Jouer sur l'appareil</em> a été choisi. 

Voici les premières lignes de la fonction <em>joue(numeroCase)</em> dans <em>jeu.js</em> qui illustre cette condition.

```{literalinclude} /src/jeu.js
:language: js
:caption: /src/jeu.js
:linenos: true
:lines: 160, 169
```

#### Déroulement du jeu côté client

Le rôle du client sera donc simplement de récupérer les informations reçues du serveur et de réagir de manière appropriée en fonction du "but" du message envoyé.

C'est principalement ces différents cas qui sont indiqués dans le fichier <em>ligne.js</em>. Les réactions suivent la même logique que celle des parties en local, qui ont été expliquées précédemment. 


#### Fin de partie

De la même manière que lors des parties en local, lorsque le jeu est terminé, le plateau et les pions sont masqués et le nom du gagnant est affiché.

Lorsqu'un des joueurs se déconnecte, que ce soit à la fin ou durant la partie, un message est affiché chez l'adversaire pour le prévenir et annuler le jeu.

Du côté serveur, l'instance de la classe <em>PartieMoulin</em> correspondante dans l'objet <em>parties</em> ainsi que les joueurs dans l'objet <em>joueurs</em> sont supprimés. 

Cette déconnexion est détectée grâce à une propriété spécifique de la librairie <em>socket.io</em>.


```{literalinclude} /src/socket.js
:language: js
:caption: /src/socket.js
:linenos: true
:lines: 171-189
```

Les deux premières conditions servent à vérifier que la partie à supprimer ait bel et bien été créée et la deuxième qu'un deuxième joueur ait rejoint cette partie. Ceci ne serait typiquement pas le cas si un joueur crée une partie, puis quitte la page d'attende sans qu'aucun adversaire ne l'a encore rejoint. Dans ce cas, le <em>currentPartie.joueur2</em> de la ligne 17 serait indéfini, ce qui créerait une erreur dans le code.





