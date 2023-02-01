..  _fibonacci:

Principes de base de la programmation dynamique
###############################################


..
    ..  danger:: Dessiner les arbres d'appels récursifs
        :class: info

        *   Voici un package cool qui permettra de dessiner les arbres d'appels
            récursifs :
            https://dev.to/bishalsarang/visualize-recursion-tree-with-animation-in-python-5357.

        *   https://github.com/mdaines/viz.js qui est un port de Graphviz dans le
            navigateur, à voir si c'est gérable ...

        *   Paraît pas mal non plus pour dessiner des graphes et des arbres :
            https://js.cytoscape.org/. C'est probablement la meilleure que j'ai
            trouvé.


..  warning::

    Ce chapitre illustre les principes fondamentaux sous-jacents à la
    programmation dynamique à travers l'exemple du calcul des nombres de
    Fibonacci, car cet exemple est largement connu et très facile à résoudre.

    Il faut savoir toutefois que cet exemple n'est pas un problème que l'on
    résout typiquement avec la programmation dynamique. En d'autres termes, il
    existe de meilleures méthodes pour calculer les nombres de Fibonacci que
    celles développées dans la suite. L'avantage des nombres de Fibonacci est de
    pouvoir se concentrer sur les propriétés et les concepts propres à la
    programmation dynamique avec un problème simple et familier.

    Une fois ces principes présentés, nous les appliquerons à des problèmes plus
    intéressants tels que le problème du sac à dos.

Un des principes fondamentaux de la programmation dynamique est de décomposer le
problème à résoudre en sous-problèmes et de recombiner les résultats des
sous-problèmes pour résoudre le problème initial. Le calcul des termes de la
suite de Fibonacci convient bien pour illustrer ce principe. Pour rappel, le
terme de rang :math:`n` de la suite de Fibonacci est défini récursivement comme
suit pour :math:`n \in \mathbb{N}`:

..  math:: 

    F(n) = \begin{cases}
    0 &\text{si $n = 0$} \\
    1 &\text{si $n = 1$} \\
    F(n-2) + F(n-1) &\text{sinon}
    \end{cases}

La fonction ``fib(n)`` ci-dessous implémente la récursion naïve et le tableau
:ref:`table-timings-naive-fib` indique le temps nécessaire à son exécution pour
différentes valeurs de :math:`n`.

..  code-block:: python

    def fib(n):
        if n <= 1:
            return n
        return fib(n - 2) + fib(n - 1)

.. _table-timings-naive-fib:

..  csv-table:: Temps d'exécution de la fonction ``fib(n)``
    :header-rows: 1

    :math:`n`, :math:`F(n)`, Temps d'exécution
    5, 8, 0.002 ms
    10, 89, 0.011 ms
    20, 10946, 1.121 ms
    30, 1346269, 132.518 ms
    40, 165580141, 16060.584 ms
    50, ?, Pas de résultat en temps raisonnable


On voit bien que l'algorithme n'est pas efficace, même pour des valeurs
relativement petites de :math:`n`. L'exécution de l'appel pour :math:`n=50` est
même tellement lente que le programme ne produit aucune sortie en temps
raisonnable. De nombreux problèmes intéressants tels que le problème du rendu de
pièces de monnaies ou du sac à dos présentent une structure permettant une
résolution par décomposition, qui est toutefois inefficace si l'on procède de
manière naïve.

..  only:: html

    En considérant l'arbre des appels récursifs, on comprend vite que cet
    algorithme récursif est de complexité temporelle :math:`\Theta(2^n)`. En
    effet, l'appel ``fib(4)`` génère l'arbre d'appels récursifs suivant:

    ..  tab-set::

        ..  tab-item:: Gif animé

            ..  figure:: figures/fib4-deroulement-dynamique.gif
                :align: center
                :width: 100%

                Arbre des appels récursifs à la fonction ``fib(n)`` pour :math:`n = 4`

        
        ..  tab-item:: PowerPoint

            ..  raw:: html

                <iframe
                src="https://onedrive.live.com/embed?cid=D617C342AC226A99&amp;resid=D617C342AC226A99%21325356&amp;authkey=AMAei_uwZUragVo&amp;em=2&amp;wdAr=1.7777777777777777"
                width="100%" height="430px" frameborder="0">Ceci est un document
                <a target="_blank" href="https://office.com">Microsoft
                Office</a> incorporé, avec <a target="_blank"
                href="https://office.com/webapps">Office</a>.</iframe>
        

        ..  tab-item:: Visualisation statique

            ..  figure:: figures/fib4-deroulement-statique.png
                :align: center
                :width: 80%

                Arbre des appels récursifs à la fonction ``fib(n)`` pour :math:`n = 4`

..  only:: latex

    En considérant l'arbre des appels récursifs, on comprend vite que cet
    algorithme récursif est de complexité temporelle :math:`\Theta(2^n)`. En
    effet, l'appel ``fib(4)`` génère l'arbre d'appels récursifs de la figure
    :ref:`fib-tree-4`

    ..  _fib-tree-4:

    ..  figure:: figures/fibonacci-4.png
        :align: center
        :width: 50%

        Arbre des appels récursifs à la fonction ``fib(n)`` pour :math:`n = 4`

On constate que l'arbre représentant les appels récursifs est un arbre binaire
(incomplet) de hauteur :math:`n-1 = 3`. Si l'on augmente :math:`n` de 1, le
nombre de nœuds est presque multiplié par 2 comme le montre la figure
:ref:`fib-tree-5`. En effet, l'arbre :math:`F(n)` est le sous-arbre gauche de
l'arbre :math:`F(n+1)`.

..  _fib-tree-5:

..  figure:: figures/fibonacci-5.png
    :align: center
    :width: 70%

    Arbre des appels récursifs à la fonction ``fib(n)`` pour :math:`n = 5`

Complexité de la récursion naïve
================================

Lorsque l'on étudie les algorithmes récursifs, il faut non seulement
s'intéresser à la complexité temporelle, liée au nombre d'opérations
élémentaires nécessaires pour exécuter l'algorithme, mais également à la
complexité spatiale, qui donne une indication de la quantité de mémoire de
travail nécessaire en fonction de la taille de l'entrée.

Complexité temporelle
---------------------

.. 
    On peut aussi calculer la complexité avec la master theorem ... je ne sais
    pas si la version vue en cours est suffisante

    ..  math::

        T(n) = 2\cdot T(n-1) + 1 \Rightarrow \Theta(2^n)

    Attention ... ceci n'est pas vraiment le master theorem ... il faudra
    refaire un check ...

La complexité de la méthode récursive ``fib(n)`` est donné par la formule de
récurrence :math:`T(n) = T(n-1) + T(n-2) + \Theta(1)`. En effet, toutes les
opérations impliquées dans la recombinaison des sous-solutions :math:`F(n-1)` et
:math:`F(n-2)` sont constantes en temps (addition, comparaison, etc.). Or, la
formule de récurrence ``T(n)`` correspond justement à la suite de Fibonacci. On
a donc :math:`T(n) \geq F(n) \approx \phi^n` où :math:`\phi` est le nombre d'or,
ce qui nous donne un :math:`\Theta(\phi^n) = \Theta(2^n)` pour la complexité
temporelle.

..  only:: comment

    Chaque appel récursif de l'algorithme ``fib(n)`` effectue les mêmes étapes. On
    peut donc ramener l'étude de sa complexité au nombre d'appels récursifs
    nécessaires, à savoir au nombre de nœuds dans l'arbre des appels récursifs. En
    gros, le nombre d'appels récursifs de ``fib(n)`` est encadré par les algorithmes
    ``f(n)`` et ``g(n)`` ci-dessous, dont le nombre d'appels récursifs est
    clairement exponentiel en :math:`n`.

    ::

        def f(n):
            if n <= 1: return n
            return f(n - 1) + f(n - 1)
        
        def g(n):
            if n <= 1: return n
            return g(n - 2) + g(n - 2)
        
    En effet, comme le montrent les figures :ref:`fib-lower-bound` et
    :ref:`fib-upper-bound`, il y a :math:`2^n = \Theta(2^n)` appels récursifs pour
    exécuter l'appel ``f(n)`` et :math:`2^{\frac{n}{2}} = \Theta(2^n)` pour l'appel
    ``g(n)``. Or, comme l'arbre des appels récursifs de l'algorithme ``fib(n)``
    contient plus de nœuds que celui de ``g(n)``, mais moins de nœuds que celui de
    ``f(n)``, la complexité de ``fib(n)`` est entre celle de ``f(n)`` et celle de
    ``g(n)``. Or, aussi bien ``f(n)`` que ``g(n)`` est de complexité temporelle
    :math:`\Theta(2^n)`, ce qui implique que ``fib(n)`` est également de complexité
    temporelle :math:`\Theta(2^n)`.

    ..  _fib-upper-bound:

    ..  figure:: figures/fib-upper-4.png
        :align: center
        :width: 90%

        Arbre des appels récursifs pour ``f(n)``

    ..  _fib-lower-bound:

    ..  figure:: figures/fib-lower-4.png
        :align: center
        :width: 40%

        Arbre des appels récursifs pour ``g(n)``
    
Complexité spatiale
-------------------

Il est également nécessaire d'étudier la complexité spatiale de l'algorithme. En
effet, lorsqu'on utilise des fonctions récursives, chaque appel occupe de
l'espace sur la pile d'appels, à savoir dans la mémoire de travail. La hauteur
maximale de la pile d'appels est atteinte lorsqu'on atteint une feuille de
l'arbre dont la profondeur est maximale. La figure :ref:`fib-call-stack` montre
la hauteur maximal de la pile d'appels pour l'appel ``fib(n=4)``. Le nombre
d'appels récursifs simultanément en cours d'exécution ne dépasse pas la hauteur
de l'arbre des appels récursifs + 1, à savoir :math:`n`. La complexité spatiale
de ``fib(n)`` récursif est donc :math:`\Theta(n)`.

.. _fib-call-stack:

..  figure:: figures/fib-call-stack.png
    :align: center
    :width: 70%

    Hauteur maximale de la pile d'appels pour l'appel ``fib(n=4)``

Optimisation par mémoïsation
============================

La raison pour laquelle l'algorithme récursif ``fib(n)`` est inefficace vient du
fait que de certains calculs sont refaits à l'identique à plusieurs moments. Par
exemple,  on voit bien sur la figure :ref:`fib-tree-5` que l'appel ``fib(5)``
répète quatre fois l'appel ``fib(1)``, trois fois l'appel ``fib(2)`` et deux
fois l'appel ``fib(3)``.

..  _fib-tree-5-recompute:

..  figure:: figures/fibonacci-5.png
    :align: center
    :width: 50%

    Arbre des appels récursifs à la fonction ``fib(n)`` pour :math:`n = 5`

Pour éviter de refaire plusieurs fois le même calcul, on peut mémoriser le
résultat des calculs déjà effectués pour les réutiliser en cas de besoin.
Concrètement, il faut stocker la valeur de retour de la fonction récursive
``fib(n)`` dans une table de hachage en utilisant les valeurs des paramètres
passés à la fonction lors de l'appel comme clé d'accès. 

..  _fib_memo1.py

..  literalinclude:: scripts/fib_memo1.py
    :caption:
    :linenos:

La version mémoïsée de l'algorithme ``fib(n)`` permet de trouver le résultat en
un temps minime, même pour des valeurs de :math:`n` impensables pour
l'algorithme récursif amnésique. La sortie du programme :ref:`fib_memo1.py` est
la suivante:

::

    fib(5) -> 5, exécuté en 0.002 ms
    fib(10) -> 55, exécuté en 0.003 ms
    fib(20) -> 6765, exécuté en 0.007 ms
    fib(200) -> 280571172992510140037611932413038677189525, exécuté en 0.015 ms



De manière générale, la mémoïsation sert à éviter de recalculer un résultat déjà
calculé au préalable. Concrètement, au niveau des appels récursifs, cela a pour
effet de couper toutes les branches inutiles de l'arbre, comme le montre la
figure :ref:`fib-tree-with-memo` pour l'appel ``fib_memo1.py(6)``

..  only:: html

    L'animation ci-dessous montre les appels récursifs de la version mémoïsée
    ``fib_memo1(n=6)``.

    ..  figure:: scripts/fib_memoized-6.gif
        :align: center
        :width: 80%

        Animation montrant les appels récursifs à la fonction ``fib(n)`` pour
        :math:`n = 4`


..  _fib-tree-with-memo:

..  figure:: figures/fib_memoized-6.png
    :align: center
    :width: 60%

    Arbre des appels récursifs lors de l'appel ``fib_memo1(6)``

Pour rappel, le même appel avec l'algorithme ``fib(n)`` non mémoïsé aurait
donné lieu à l'arbre de la figure :ref:`fib-tree-6`.

..  _fib-tree-6:

..  figure:: figures/fib-6.png
    :align: center
    :width: 90%

    Arbre des appels récursifs lors de l'appel ``fib(6)``


Analyse de complexité de la récursion avec la mémoïsation
=========================================================

Complexité temporelle
---------------------

De manière générale, la complexité d'un algorithme utilisant la programmation
dynamique se calcule de la manière suivante:

..  math:: 

    \text{nombre de sous-problèmes} \times \text{complexité pour chaque sous-problème}

Dans le cas présent, pour calculer le :math:`n`-ième terme de la suite de
Fibonacci, il faut calculer tous les :math:`n` termes précédents, ce qui fait en
tout :math:`n+1` sous-problèmes. En supposant que l'addition de :math:`F(n-1)`
et :math:`F(n-2)` est :math:`\Theta(1)`, la résolution de chaque sous-problème
est :math:`\Theta(1)` puisque les appels récursifs sont mémoïsés. La complexité
temporelle est donc :math:`n \times \Theta(1) = \Theta(n)`.

Une autre manière de déterminer la complexité temporelle est de déterminer le
nombre de nœuds de l'arbre des appels récursifs. Comme le montre la figure
:ref:`fib-tree-with-memo`, la version mémoïsée ne demande que :math:`n + (n - 1)
= 2n-1` appels, ce qui donne lieu à une complexité temporelle de
:math:`\Theta(n)`.

Complexité spatiale
-------------------

La complexité spatiale de l'algorithme n'est pas améliorée par la mémoïsation.
Au contraire, la version mémoïsée demande davantage de mémoire que la version
naïve. En effet, en plus de devoir stocker la pile d'appels récursifs, également
de hauteur :math:`n` dans la version mémoïsée, il faut encore stocker la table
de hachage de mémoïsation, qui occupe également :math:`\Theta(n)` unités
mémoire. Ainsi, la version mémoïsée nécessite en gros deux fois plus de mémoire
que la version naïve mais reste :math:`\Theta(n)`.

Mémoïsation en Python
=====================

À partir la version 3.9, le module ``functools`` de Python met à disposition le
décorateur ``@cache`` pour faire de la mémoïsation proprement, ce qui évite de
devoir gérer un dictionnaire global pour stocker les valeurs mémoïsées. Son
utilisation est très simple:

..  literalinclude:: scripts/fib_cache.py
    :caption:

..  tip::

    Dans les versions antérieures à 3.9, on peut obtenir un résultat similaire
    en utilisant le décorateur ``@lru_cache(maxsize=None)``


Optimisation de la mémoïsation avec un cache LRU
================================================

Nous avons vu que la version version mémoïsée demande en gros deux fois plus de
mémoire que la version naïve. Cette situation peut être améliorée en ne
mémorisant que les deux derniers termes calculés au lieu de mémoriser tous les
termes précédents. En effet, pour calculer :math:`F(n)`, il suffit de se
souvenir de :math:`F(n-1)` et de :math:`F(n-2)`. Ce mécanisme de mémorisation
peut être implémenté à l'aide d'un cache LRU de taille 3 au lieu d'une table de
hachage complète:

..  literalinclude:: scripts/fib_lru_cache.py
    :caption:

On peut par exemple implémenter un cache LRU à l'aide d'une liste doublement
chaînée dans laquelle on "tourne". Le principe est simple : lorsqu'on rajoute
une nouvelle valeur dans le cache et qu'il est plein, on remplace la plus
ancienne valeur présente par la nouvelle valeur à insérer.

L'avantage d'un cache LRU est qu'il permet une mémoïsation de complexité
spatiale :math:`\Theta(1)`, sans compter le stockage nécessaire à la pile des
appels récursifs qui reste :math:`\Theta(n)`, au lieu du stockage
:math:`\Theta(n)` de la table de hachage, tout en permettant un accès en
:math:`\Theta(1)`. En définitive, la complexité spatiale de l'algorithme
``fib(n)`` mémoïsé avec un cache LRU reste :math:`\Theta(n)` en raison de la
pile d'appels, mais c'est un :math:`\Theta(n)` plus avantageux que celui de la
mémoïsation avec une table de hachage.

..
    Implémentation d'un cache LRU basique
    -------------------------------------

    Ceci n'est pas une priorité ...b

    Voici une implémentation basique d'un cache LRU

Programmation dynamique, approche descendante (top-down)
========================================================

Dans cette section, nous avons vu comment attaquer le calcul du :math:`n`-ième
terme de la suite de Fibonacci, un problème de nature typiquement récursive,
avec une approche de programmation dite **descendante** (*top-down* en anglais).
L'approche descendante de la programmation dynamique consiste essentiellement à
utiliser un algorithme récursif agrémenté de mémoïsation pour éviter l'explosion
exponentielle du nombre de branches dans l'arbre des appels récursifs. 

L'idée est de partir du problème que l'on veut résoudre et utiliser une approche
récursive pour "descendre l'arbre" jusqu'à atteindre une feuille, qui correspond
à une version triviale du problème, puis faire remonter les valeurs de retour le
long des branches de l'arbre jusqu'à parvenir à la racine de l'arbre
correspondant au problème original que l'on voulait résoudre.

Dans le cas du calcul des termes de la suite de Fibonacci, cette approche permet
déjà d'améliorer l'approche récursive "amnésique", de complexité
:math:`\Theta(2^n)`, qui refait sans arrêt les mêmes calculs, en obtenant une
version améliorée de la récursion de complexité temporelle :math:`\Theta(n)`. 

Cette approche présente toutefois encore un problème lorsque :math:`n` devient
grand : celui de la profondeur de la récursion. En effet, chaque appel récursif
augmente la taille de la pile d'appels dont la hauteur est généralement limitée.
Heureusement, il existe aussi une autre approche de la programmation dynamique
qui se débarrasse de la récursion. Dans la section suivante, nous allons
présenter cette approche, en utilisant toujours l'exemple du calcul des termes
de la suite de Fibonacci.

Dépendances et tri topologique inverse
======================================

Pour pouvoir être résolu par programmation dynamique, il faut que le **graphe de
dépendances** des calculs soit acyclique. Il n'y a aucun problème avec le calcul
des nombres de Fibonacci puisque que le calcul de :math:`F(n)` n'est dépendant
que du calcul de :math:`F(n-1)` et :math:`F(n-2)`, comme le montre le graphe de
la figure :ref:`fig-dep-graph-Fn` dépendances pour le calcul de :math:`F(5)`

..  _fig-dep-graph-Fn:

..  graphviz::
    :caption: Graphe de dépendances du calcul de :math:`F(5)`

     digraph example {
         rankdir=LR;
         rank=same;
         a [label="F(5)"];
         b [label="F(4)"];
         c [label="F(3)"];
         d [label="F(2)"];
         e [label="F(1)"];
         f [label="F(0)"];
         a -> b;
         a -> c [constraint=false];
         b -> c;
         b -> d [constraint=false];
         c -> d;
         c -> e [constraint=false];
         d -> e;
         d -> f;
     }

..  _defn:dependency-graph:

..  admonition:: Définition (Graphe de dépendances)

    Dans le graphe de dépendances est un graphe orienté :math:`G(V, E)` dont les
    nœuds :math:`v \in V` représentent les calculs à effectuer, à savoir les appels
    récursifs à faire. Le graphe contient une arête :math:`(u, v) \in E` si et
    seulement si le calcul de :math:`u` dépend du calcul de :math:`v`.

..  _prop:condition-necessaire-graphe-dependances-dag:

..  admonition:: Proposition (Condition nécessaire pour la programmation dynamique)

    Pour qu'un problème puisse être résolu par programmation dynamique, il faut
    que le graphe de dépendance sous-jacent soit acyclique.

En effet, si le graphe de dépendances est cyclique, la récursion va
immanquablement conduire à un algorithme qui tourne en boucle infinie (récursion
infinie indirecte).

..  admonition:: Proposition (Ordre d'évaluation des appels récursifs)

    Si le graphe de dépendances est un DAG (*directed acyclic graph* = graphe
    orienté acyclique), l'ordre d'évaluation des appels récursifs correspond à
    un "tri topologique inverse" du graphe de dépendances, à savoir à un tri
    topologique de graphe de dépendances inversé.


..
    ..  danger:: 

        Rajouter une explication sur les dépendances et le fait et les DAG et le
        lien avec le tri topologique.

        Il faut que le graphe des dépendances soit un DAG (Graphe orienté
        acyclique), sans quoi il n'est pas possible de résoudre le problème tel que
        avec la programmation dynamique et il est nécessaire de le modifier pour y
        parvenir.
