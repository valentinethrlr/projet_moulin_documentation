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
    :caption: Implémentation récursive naïve pour calculer :math:`F(n)`

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

Une autre manière de calculer la complexité temporelle est de constater que
:math:`T(n) \geq 2\cdot T(n-2) = \Theta(2^{\frac{n}{2}}) = \Theta(2^n)` puisque
cela correspond au nombre de nœuds d'un arbre binaire dont les deux sous-arbres
sont de hauteur ``n-2``.

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

Pour mémoïser une fonction récursive, il faut suivre les étapes suivantes

#.  Transformer la fonction récursive pour qu'elle ne possède plus qu'un seul
    ``return``. Cette étape est facultative mais simplifie le processus.

#.  Rajouter une structure de données (table de hachage ou tableau par exemple)
    qui survit à l'exécution de la fonction, par exemple dans l'espace global.
    Puis, dans la fonction récursive, avant le ``return``, il faut stocker la
    valeur de retour dans la table de mémoïsation sous la clé correspondant à la
    valeur des paramètres lors de l'appel (en l'occurrence le paramètre ``n``).

#.  Tout au début de la fonction récursive, vérifier dans la table de
    mémoïsation si le calcul a déjà été fait. Il suffit de vérifier si la table
    de mémoïsation possède déjà une valeur à l'emplacement indiqué par les
    valeurs des paramètres. Si c'est le cas, il faut court-circuiter l'exécution
    de la fonction avec un "early return" en retournant la valeur présente dans
    la table de mémoïsation.

.. _refactore-fib-memoization:

..  figure:: figures/refactore-fib-memoization.png
    :align: center
    :width: 100%

    Étapes pour rajouter la mémoïsation à la fonction ``fib(n)``




..
    ..  code-block:: python

        def fib(n):
            if n <= 1:
                return n
            return fib(n - 1) + fib(n - 2)

    ..  code-block:: python

        def fib(n):
            if n <= 1:
                result = n
            else:
                result = fib(n - 1) + fib(n - 2)
            return result

    ..  code-block:: python

        memo = {}
        def fib(n):
            if n <= 1:
                result = n
            else:
                result = fib(n - 1) + fib(n - 2)
            memo[n] = result
            return result

..
    Le code :ref:`code-fib-memoized` montre la version mémoïsée de la fonction
    ``fib(n)``.

    ..  _code-fib-memoized:

    ..  code-block:: python
        :caption: Version mémoïsée de ``fib(n)``

        memo = {}
        def fib(n):
            if n in memo:
                return memo[n]
        
            if n <= 1:
                result = n
            else:
                result = fib(n - 1) + fib(n - 2)
            memo[n] = result
            return result

Pour éviter d'avoir une structure de données qui traîne dans l'espace de noms
global, on peut faire un petit réusinage du code en faisant de la partie
récursive mémoïsée une fonction locale à une autre fonction et en incluant la
table de mémoïsation comme variable locale de la fonction ``fib(n)``. En raison
du mécanisme de fermeture, la table de mémoïsation survit ainsi toujours à
l'exécution de la fonction ``f(n)`` qui peut y accéder comme s'il s'agissait
d'une variable globale.

..  code-block:: python
    :caption: Version récursive mémoïsée avec encapsulation de la table de mémoïsation

    def fib(n):
        memo = {}
        def f(n):
            if n in memo:
                return memo[n]
        
            if n <= 1:
                result = n
            else:
                result = f(n - 1) + f(n - 2)
            memo[n] = result
            return result
        return f(n)


La version mémoïsée de l'algorithme ``fib(n)`` permet de trouver le résultat
rapidement, même pour des valeurs de :math:`n` impensables pour l'algorithme
récursif amnésique. La sortie du programme :ref:`fib_memo1.py` est la suivante:

.. _table-timings-memoized-fib:

..  csv-table:: Temps d'exécution de la fonction ``fib(n)`` mémoïsée
    :header-rows: 1

    :math:`n`, :math:`F(n)`, Temps d'exécution
    5, 5, 0.002 ms
    10, 55, 0.003 ms
    20, 6765, 0.007 ms
    200, 280571172992510140037611932413038677189525, 0.015 ms
    800, ``RecursionError``, Non disponible



De manière générale, la mémoïsation sert à éviter de recalculer un résultat déjà
calculé au préalable. Concrètement, au niveau des appels récursifs, cela a pour
effet de couper toutes les branches inutiles de l'arbre des appels de la
fonction récursive, comme le montre la figure :ref:`fib-6-tree-with-memo` pour
l'appel ``fib(6)``.

..  only:: html

    L'animation ci-dessous montre les appels récursifs de la version mémoïsée
    ``fib(n=6)``.

    ..  figure:: scripts/fib_memoized-6.gif
        :align: center
        :width: 40%

        Animation montrant les appels récursifs à la fonction ``fib(n)`` pour
        :math:`n = 6`


..  _fib-6-tree-with-memo:

..  figure:: figures/fib_memoized-6.png
    :align: center
    :width: 25%

    Arbre des appels récursifs lors de l'appel ``fib(6)``

..
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

De manière générale, pour déterminer la complexité d'un algorithme utilisant la
programmation dynamique, on considère le nombre d'appels récursifs non mémoïsés
à faire. En effet, les appels mémoïsés coûtent :math:`\Theta(1)` en temps pour
autant que la table de mémoïsation permette un accès en :math:`\Theta(1)`
opérations.

..  math:: 

    \text{nombre d'appels non mémoïsés} \times \text{complexité pour chaque
    appel non mémoïsé}

Dans le cas présent, pour calculer le terme de rang :math:`n` de la suite de
Fibonacci, il faut calculer tous les :math:`n` termes précédents, ce qui fait en
tout :math:`n+1` sous-problèmes (appels non mémoïsés). En supposant que
l'addition de :math:`F(n-1)` et :math:`F(n-2)` est :math:`\Theta(1)`, la
résolution de chaque sous-problème est :math:`\Theta(1)`, puisque les appels
récursifs sont mémoïsés. La complexité temporelle est donc :math:`(n+1) \times
\Theta(1) = \Theta(n)`.

Une autre manière de déterminer la complexité temporelle est de déterminer le
nombre de nœuds de l'arbre des appels récursifs. Comme le montre la figure
:ref:`fib-6-tree-with-memo`, la version mémoïsée ne demande que :math:`n + (n - 1)
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

Nous avons vu que la version mémoïsée demande en gros deux fois plus de mémoire
que la version naïve. Cette situation peut être améliorée en ne mémorisant que
les deux derniers termes calculés au lieu de mémoriser tous les termes
précédents. En effet, pour calculer :math:`F(n)`, il suffit de se souvenir de
:math:`F(n-1)` et de :math:`F(n-2)`. Ce mécanisme de mémoïsation peut être
implémenté à l'aide d'un cache LRU de taille 3 au lieu d'une table de hachage
complète:

..  literalinclude:: scripts/fib_lru_cache.py
    :caption:

..
    On peut par exemple implémenter un cache LRU à l'aide d'une liste doublement
    chaînée dans laquelle on "tourne". Le principe est simple : lorsqu'on rajoute
    une nouvelle valeur dans le cache et qu'il est plein, on remplace la plus
    ancienne valeur présente par la nouvelle valeur à insérer.

L'avantage d'un cache LRU est qu'il permet une mémoïsation de complexité
spatiale :math:`\Theta(1)`, sans compter le stockage nécessaire à la pile des
appels récursifs qui reste :math:`\Theta(n)`. En définitive, la complexité
spatiale de l'algorithme ``fib(n)`` mémoïsé avec un cache LRU reste
:math:`\Theta(n)` en raison de la pile d'appels, mais c'est un :math:`\Theta(n)`
plus avantageux que celui de la mémoïsation avec une table de hachage.


Programmation dynamique, approche descendante (top-down)
========================================================

Dans cette section, nous avons vu comment attaquer le calcul du terme de rang
:math:`n` de la suite de Fibonacci, un problème de nature typiquement récursive,
avec une approche de programmation dite **descendante** (*top-down* en anglais).
L'approche descendante de la programmation dynamique consiste essentiellement à
utiliser un algorithme récursif agrémenté de mémoïsation pour éviter l'explosion
exponentielle du nombre de branches dans l'arbre des appels récursifs. 

L'idée est de partir du problème que l'on veut résoudre et d'utiliser une
approche récursive pour "descendre l'arbre" jusqu'à atteindre une feuille, qui
correspond à une version triviale du problème, puis faire remonter les valeurs
de retour le long des branches de l'arbre jusqu'à parvenir à la racine de
l'arbre correspondant au problème original que l'on voulait résoudre.

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

Graphe de dépendances et tri topologique inverse
================================================

Pour pouvoir être résolu par programmation dynamique, il faut que le **graphe de
dépendances** des calculs soit acyclique. 

..  _defn:dependency-graph:

..  admonition:: Définition (Graphe de dépendances / graphe des sous-problèmes)

    Le graphe de dépendances (également appelé graphe des sous-problèmes) d'une
    fonction récursive est le graphe orienté :math:`G(V, E)` dont les sommets
    :math:`v \in V` représentent les calculs à effectuer, à savoir les appels
    récursifs à faire et qui contient une arête :math:`(u, v) \in E` si et
    seulement si le calcul du problème :math:`u` dépend directement du calcul du
    problème de :math:`v`.

..  _fig-dependency-graph-fibn:

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



..  _prop:condition-necessaire-graphe-dependances-dag:

..  admonition:: Proposition

    Si on établit une relation d'équivalence entre les nœuds de l'arbre des
    appels récursifs correspondant à un appel avec les mêmes paramètres
    (mémoïsés dans un même emplacement), on obtient le graphe des dépendances en
    faisant "l'arbre des appels modulo la relation d'équivalence". En d'autres
    termes, on obtient chaque sommet du graphe de dépendances en réduisant les
    nœuds équivalents de l'arbre des appels récursifs. On obtient les arêtes du
    graphe de dépendances en réduisant de manière analogue toutes les arêtes de
    l'arbre des appels entre deux nœuds équivalents.

..  admonition:: Proposition (Condition nécessaire pour la programmation dynamique)

    Pour qu'un problème puisse être résolu par programmation dynamique, il faut
    que le graphe de dépendance sous-jacent soit acyclique.

En effet, si le graphe de dépendances est cyclique, la récursion va
immanquablement conduire à un algorithme qui tourne en boucle infinie (récursion
infinie indirecte).

Il n'y a aucun problème avec le calcul des nombres de Fibonacci puisque le
calcul de :math:`F(n)` n'est dépendant que du calcul de :math:`F(n-1)` et
:math:`F(n-2)`, comme le montre le graphe de dépendances de la figure
:ref:`fig-dependency-graph-fibn` pour le calcul de :math:`F(5)`.


..  admonition:: Proposition (Ordre d'évaluation des appels récursifs)

    Si le graphe de dépendances est un DAG (*directed acyclic graph* = graphe
    orienté acyclique), l'ordre dans lequel les problèmes sont résolus (un
    problème est considéré comme résolu lorsque toutes ses dépendances sont
    résolues) par les appels récursifs correspond à un "tri topologique inverse"
    du graphe de dépendances, à savoir à un tri topologique du graphe de
    dépendances inversé.

Approche itérative ascendante
=============================

L'approche récursive développée précédemment correspond à l'approche
"descendante" de la programmation dynamique. Il existe également une approche
ascendante qui se débarrasse de la récursion. Cette approche est souvent plus
performante, car elle évite les pénalités de performance liés aux appels
récursifs.

..  admonition:: Programmation dynamique ascendante (*bottom-up*)
    :class: tip

    L'approche ascendante de la programmation dynamique fonctionne à l'envers de
    l'approche descendante. Au lieu de partir du résultat auquel on veut arriver
    et décomposer le problème jusqu'à ce qu'il soit trivial, on part du cas
    trivial et on construit progressivement la solution en mémorisant toutes les
    étapes dans une table de hachage ou un tableau. En général, on préfère
    stocker les résultats intermédiaires dans un tableau pour de meilleures
    performances.

..
    L'approche ascendante, à rebours de l'approche récursive qui commence avec le
    calcul souhaité et descend vers les cas de base, démarre avec les cas de base
    pour "remonter" au résultat souhaité. 
    
Les calculs doivent cependant être faits dans un ordre tel que l'on calcule
toujours les dépendances d'un calcul avant de faire le calcul lui-même. Dans le
cas de Fibonacci, il est trivial de déterminer cet ordre. En effet, le graphe de
dépendances de ``fib(5)`` de la figure :ref:`inverse-dependency-graph`

.. _inverse-dependency-graph:

..  graphviz::
    :caption: Graphe de dépendances inversé du calcul de :math:`F(5)`

    digraph example {
        rankdir=LR;
        rank=same;
        "F(0)" -> "F(2)" -> "F(3)" -> "F(4)" -> "F(5)" 
        "F(1)" -> "F(2)"
        "F(1)" -> "F(3)" [constraint=false]
        "F(2)" -> "F(4)" [constraint=false]
        "F(3)" -> "F(5)" [constraint=false]
    }   

On voit facilement qu'on obtient un tri topologique de ce graphe orienté
acyclique en triant les sommets :math:`F(n)` dans l'ordre croissant de
:math:`n`: :math:`F(0) \rightarrow F(1) \rightarrow F(2) \rightarrow \ldots
\rightarrow F(5)`.

De la version récursive à la version itérative
==============================================

Pour passer de la version récursive à la version itérative, on procède en
suivant les transformations suivantes:

#.  Transformation de la table de mémoïsation en tableau contenant autant de
    dimensions que de paramètres indépendants dans la clé d'accès à la table de
    mémoïsation. Dans le cas des nombres de Fibonacci, chaque appel à la
    fonction ne contient que le paramètre :math:`n`. Le tableau sera donc de
    dimension 1. Dans chaque dimension, le tableau doit avoir une taille
    correspondant au nombre de valeurs entières différentes que peut prendre le
    paramètre. Dans notre cas, le paramètre ``n`` peut prendre n'importe
    laquelle des :math:`N+1` valeurs entières entre :math:`0` et :math:`N`. On
    crée donc le tableau comme suit:
 
    ::

        memo = [None for _ in range(N + 1)]

#.  Remplissage du tableau ``memo`` avec les valeurs représentant les cas de
    base de la récursion. Dans le cas de Fibonacci, il y a deux cas de base, à
    savoir :math:`F(0) = 0` et :math:`F(1) = 1` . On peut donc initialiser le
    tableau ``memo`` avec ``memo[0:2] = [0, 1]``. De manière équivalente, on
    aurait pu transformer les cas de base en  

    ::

        memo[0] = 0
        memo[1] = 1

    ou encore en

    ::

        for k in [0, 1]:
            memo[k] = k

#.  Transformation des appels récursifs ``f(n)`` en un accès au tableau de
    mémoïsation ``memo[n]``.

#.  Itérer sur toutes les emplacements non remplis du tableau de solutions
    intermédiaires. Il est crucial de parcourir le tableau dans un ordre qui
    correspond à un tri topologique du graphe de dépendances inversé. Dans notre
    cas, il suffit de parcourir le tableau dans l'ordre croissant des indices
    :math:`k`. Dans notre cas, les cases ``memo[0]`` et ``memo[1]`` sont déjà
    remplies avec les cas de base. On commence donc à itérer à partir de
    :math:`k=2` jusqu'à la fin du tableau, à savoir jusqu'à :math:`k=n` où se
    trouvera la solution construite pas à pas à la fin de l'itération.

#.  Supprimer ce qui concerne la récursion et dont on n'a pas besoin dans la
    version itérative.

..  figure:: figures/fib-recursion2iteration.png
    :align: center
    :width: 100%

    Passage de la version récursive mémoïsée à la version itérative ascendante
    de ``fib(n)``

..
    ::

        memo = {}
        def fib(n):
            if n <= 1:
                result = n
            else:
                result = fib(n - 1) + fib(n - 2)
            memo[n] = result
            return result
    ::

        memo = {}
        def fib(n):
            if n <= 1:
                return n
            
            memo[n] = fib(n - 1) + fib(n - 2)
            return memo[n]

    ::

        memo = [None for _ in range(n+1)]
        def fib(n):
            memo[:2] = [0, 1]

            for k in range(2, n + 1):
                result = memo[k - 1] + memo[k - 2]
                memo[k] = result
            return memo[n]
    ::

        def fib(n):
            memo = [None for _ in range(n+1)]
            memo[:2] = [0, 1]

            for k in range(2, n + 1):
                result = memo[k - 1] + memo[k - 2]
                memo[k] = result
            return memo[n]

À la fin de ce processus, on trouve la version itérative de ``fib(n)`` présentée
dans le code :ref:`code-fib-tabular.py`.

..  _code-fib-tabular.py:

..  code-block:: python
    :caption: Version itérative de ``fib(n)``
    :linenos:

    def fib(n):
        memo = [None for _ in range(n+1)]
        # initialisation du tableau avec les cas de base
        memo[:2] = [0, 1]

        # remplir le tableau itérativement (dans le bon ordre) 
        # au lieu de faire des appels récursifs
        for k in range(2, n + 1):
            # remplacer les appels récursifs par des accès au tableau
            result = memo[k - 1] + memo[k - 2]
            memo[k] = result
        # La réponse au problème se trouve dans la dernière case
        # remplie du tableau
        return memo[n]

..
    Implémentation en Python
    ========================

    Commençons pas étudier une implémentation Python ascendante, qui n'utilise pas
    la récursion et qui mémorise les résultats intermédiaires dans une table de
    hachage.

    ..  literalinclude:: scripts/fib_tabulation.py
        :caption:
        :linenos:
        :pyobject: fib_hash
        
    De manière équivalente, on peut remplacer la table de hachage par un tableau
    (liste en Python) pour de meilleures performances. Le seul changement à faire
    est à la ligne 2.

    ..  literalinclude:: scripts/fib_tabulation.py
        :caption:
        :linenos:
        :emphasize-lines: 2
        :pyobject: fib_table

Analyse de complexité de la version itérative
=============================================

La version récursive mémoïsée (approche descendante) et la version itérative
(approche ascendante) ont exactement la même complexité temporelle
:math:`\Theta(n)`. Nous avons déjà vu que cette complexité est linéaire dans le
cas de la récursion mémoïsée. Dans le cas de la version itérative, la
programmation dynamique consiste simplement à remplir tout le tableau, qui est
de taille :math:`n+1`. Pour chaque case, il faut faire des opérations de coût
:math:`\Theta(1)`. La complexité temporelle de l'algorithme itératif est donc
également de complexité :math:`\Theta(n)`.

Au niveau de la complexité spatiale, la mémoire utilisée vient surtout du
tableau. Dans le cas de la version itérative, sa taille est en
:math:`\Theta(n)`.

Améliorations des performances
==============================

On peut encore améliorer la performance de ce dernier algorithme en tenant
compte du fait que, pour calculer :math:`F(n)`, il suffit de connaître
:math:`F(n-1)` et :math:`F(n-2)` et qu'il n'est pas nécessaire de se souvenir de
tous les résultats intermédiaires précédents. On peut réaliser cette
amélioration très facilement en prenant un tableau de 3 éléments qui va, en tout
temps, stocker les résultats pour le rang :math:`n`, :math:`n-1` et :math:`n-2`.
On utilise pour ce faire un type personnalisé de cache LRU basé sur un tableau
de longueur 3 parcouru modulo 3, de manière cyclique.

..  literalinclude:: scripts/fib_tabulation.py
    :caption:
    :linenos:
    :emphasize-lines: 2
    :pyobject: fib_table_lru


L'implémentation du cache LRU est dans ce cas très simple puisque les clés sont
des nombres entiers. Elle consiste essentiellement à accéder aux indices modulo
la taille du cache, ce qui a pour effet de faire une rotation dans le tableau
``self.cache`` à mesure que l'indice croît.

..  literalinclude:: scripts/dp.py
    :caption:
    :linenos:
    :pyobject: ArrayLRUCache
