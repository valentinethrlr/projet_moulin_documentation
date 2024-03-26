(manuel)= 

# Manuel utilisateur

Le site est construit selon l'architecture ci-dessous.

```{figure} images/Architecture.png
---
width: 100%
---
Architecture du site
```

Pour jouer, il est soit possible de créer une nouvelle partie, soit d'en rejoindre une déjà existante. 

Lors de la création d'une nouvelle partie, deux paramètres de jeu peuvent être déterminé par l'utilisateur. Il peut choisir le temps de jeu maximal de chaque joueur (qui peut être de 5 minutes, 10 minutes ou infini), ainsi que sa couleur de pion, en sachant que se sont toujours les blancs qui commencent à jouer.


```{figure} images/options.png
---
width: 100%
---
Options de création de partie
```
Si la partie est créée en ligne, un ID de 6 chiffres est généré et affiché à l'écran.

Pour rejoindre cette partie, l'adversaire doit cliquer sur le bouton <em>rejoindre une partie</em> et entrer cette même ID dans le champ correspondant.

Lorsque la partie commence, il y a tout d'abord une phase de mise en place du jeu, durant laquelle les utilisateurs peuvent cliquer sur la case sur laquelle ils souhaitent placer leur pion.
Ensuite, pour déplacer un pion, il suffit cliquer sur celui-ci. Une animation indique qu'il a bien été sélectionné. Il faut ensuite cliquer sur la case de destination. 

Lorsqu'il y a un moulin, les pions qu'il est possible d'éliminer sont entourés de rouge. Pour supprimer un pion adverse, il faut alors cliquer dessus.

```{figure} images/moulin.png
---
width: 100%
---
Situation lors d'un moulin
```
Lorsque la partie est terminée, un message désignant le nom du gagnant apparaît.

Finalement, une page avec un rappel des règles est disponible, sur la page d'accueil du site.