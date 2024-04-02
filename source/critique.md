(regard-critique)=

# Regard critique et améliorations

Le défaut principal de ce projet est que l'algorithme de jeu a été implémenté de manière plutôt alambiquée. La plupart des fonctions dépendent les unes des autres et il y a de nombreuses variables globales. Ceci n'est tout d'abord pas optimal pour la compréhension du code par un tiers, mais aussi pour le débogage de manière générale. Afin d'améliorer ceci, il faudrait repenser entièrement l'algorithme du jeu. Une piste serait par exemple de s'orienter vers de la programmation déclarative et/ou réactive. 

Ensuite, il reste de nombreuses répétitions entre les différentes partie du code, notamment entre les fichiers <em>jeu.js</em> et <em>ligne.js</em>. Il serait peut-être possible de créer un fichier commun qui fonctionnerait dans les deux cas.

De plus, il faudrait idéalement mettre le code de <em>jeu.js</em> dans une classe, ce qui optimiserait la sécurité du code.

Par ailleurs, il faudrait dans la mesure du possible éviter toutes les utilisations des fonctions <em>eval()</em>, qui sont abondantes dans la classe <em>PartieMoulin</em>. A nouveau, une restructuration totale de cette classe et de ses variables de classes permettrait probablement d'éliminer celles-ci, ainsi que de rendre le code plus lisible.

Afin d'étendre encore ce projet, il serait finalement possible de permettre aux joueurs de faire des parties en ligne contre des adversaires choisis au hasard et souhaitant également faire une partie à ce moment-là, ou de faire des parties contre l'ordinateur. La première option demanderait une gestion supplémentaire des joueurs connectés au site et voulant commencer une partie. La deuxième option quant à elle impliquerait potentiellement l'implication d'une IA. 

# Conclusion

En conclusion, ce projet était une bonne mise en pratique des bases des langages JS, HTML et CSS, ainsi que de la programmation orientée objet et des technologies utilisant les webSocket. Cela m'a également permis de découvrir le fonctionnement d'un serveur. 
Il serait en revanche possible par la suite de pousser ce travail encore plus loin et de le rendre plus professionnel. Le facteur qui a empêché ceci est que le temps qu'il aurait fallu y consacrer aurait très largement dépassé celui prévu dans le cadre d'un projet d'OC.
