(regard-critique)=

# Regard critique et améliorations

Le défaut principal de ce projet est que l'algorithme de jeu est codé d'une manière plutôt alambiquée. La plupart des fonctions dépendent les unes des autres et il y a de nombreuses variable globales. Ceci n'est tout d'abord pas optimale pour la compréhension par une personne externe, mais aussi pour le débogage de manière générale. Afin d'améliorer ceci, il faudrait repenser entièrement l'algorithme du jeu. Une piste serait par exemple de s'orienter vers de la programmation déclarative et/ou programmation réactive. 

Ensuite, il reste de nombreuses répétitions entre les différentes partie du code, notamment entre les fichiers <em>jeu.js</em> et <em>ligne.js</em>. Il serait peut-être possible de créer un fichier commun qui fonctionnerait dans les deux cas.

De plus, il serait possible de mettre le code de <em>jeu.js</em> dans une classe, ce qui optimiserait la sécurité du code.

Il faudrait par ailleurs idéalement éviter toutes les utilisations des fonctions <em>eval()</em>, qui sont abondantes dans la classe <em>PartieMoulin</em>. A nouveau, une restructuration totale de cette classe et de ces variables de classes permettrait probablement d'éliminer ceux-ci, ainsi que de rendre le code plus lisible.

Afin d'étendre encore ce projet, il serait finalement possible de permettre aux joueurs de faire des parties en ligne contre des adversaires choisis au hasard et souhaitant également faire une partie à ce moment-là, ou de faire une partie contre l'ordinateur. La première option demanderait une gestion supplémentaire des joueurs connectés au site et voulant commencer une partie. La deuxième option quant à elle impliquerait potentiellement l'implication d'une IA, ou du moins d'un algorithme de jeu fiable. 


