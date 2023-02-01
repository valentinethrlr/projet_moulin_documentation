.. _knapsack-dp.rst:

Le problème du sac à dos
########################

Le problème du sac à dos est un problème algorithmique classique connu pour être
NP-complet :cite:p:`Book1975-BOORMK-2`. Ce problème d'optimisation combinatoire
peut être formulé de très nombreuses manières et il existe de nombreuses
variantes du problème. Cette section présente la variante la plus simple et
classique, le **0-1 Knapsack Problem**. Comme ce problème est NP-complet, on ne
connaît pas d'algorithme efficace pour résoudre de manière exactes de grosses
instances du problème. Il existe de très nombreuses approches possibles. Parmi
les approches exactes, il y a notamment la programmation dynamique et la
programmation en nombres entiers (0-1 Integer Programming) qui sont capables de
résoudre de petites et moyennes instances du problème. Pour résoudre les
instances plus grandes, il faut recourir à des méthodes par approximation que
nous n'aborderons pas ici.

Présentation du problème
========================

Présentation intuitive
----------------------

..  only:: html

    ..  youtube:: HvAK6HxZ190
        :align: center
        :width: 100%

..
    ..  only:: latex

        ..  raw:: latex

            \marginnote{salut}
            \qrcode[hyperlink,height=0.5in]{https://www.youtube.com/watch?v=HvAK6HxZ190}

..  admonition:: Astuce didactique

    La vidéo :cite:p:`parent:intro-sac-à-dos` présente le problème de manière
    accessible à des étudiants du niveau gymnase. 

Supposons que l'on prépare une longue randonnée qui exclut de pouvoir se
ravitailler en route et que l'on dispose d'un sac à dos de contenance limitée
(par exemple 50 litres), quels articles alimentaires faut-il y placer pour
maximiser la valeur nutritive emportée? Les articles considérés sont mentionnés
dans le tableau :ref:`table-knapsack-items-example-1`.


..
    ..  csv-table:: Articles disponibles dans la réserve alimentaire
        :header-rows: 1
        :class: longtable

        No article, Description, Volume [L], Valeur nutritive [kcal]
        0, Paquet de pâtes, 13, 2600
        1, Paquet de pâtes, 13, 2600
        2, Paquet de pâtes, 13, 2600
        3, Pommes, 10, 500
        4, Paquet de riz, 24, 4500
        5, Yogourt, 11, 960

.. _table-knapsack-items-example-1:

..  csv-table:: Articles disponibles dans la réserve alimentaire
    :header-rows: 1
    :class: longtable

    No article, Description, Volume [L], Valeur nutritive [kcal]
    0, Paquet de pâtes, 13, 2600
    1, Paquet de pâtes, 13, 2600
    2, Paquet de pâtes, 13, 2600
    3, Pommes, 10, 500
    4, Paquet de riz, 24, 4500
    5, Yogourt, 11, 960

..  admonition:: Remarques

    Pour résoudre le problème, il faut prendre en compte les remarques suivantes:

    *   Pour pouvoir utiliser la programmation dynamique, on impose que tous les
        volumes et la capacité du sac soient des nombres entiers. Si, dans la
        vraie vie, les nombres ne sont pas entiers, on peut toujours transformer
        le problème en multipliant tous les volumes et la capacité par un
        facteur commun pour que les volumes et la capacité du sac à dos soient
        des nombres entiers.

    *   Chaque paquet de pâtes constitue un article à part entière et est donc
        noté dans une ligne à part entière dans le tableau.

    *   La colonne "Description" du tableau n'a aucune importance dans le
        problème. On ne prend en compte que la volume et la valeur nutritive des
        aliments.

    *   On ne peut pas "ouvrir" un paquet de pâtes pour prendre la moitié du
        paquet. Pour chaque article, soit on le prend complètement, soit on ne
        le prend pas du tout, d'où le nom du problème **0-1**-Knapsack Problem.

    *   On aurait pu remplacer les volumes en [l] par des poids en [kg] et
        mettre une contrainte de poids maximal de 50 kg au le sac à dos au lieu
        des 50 litres de contenance.

Applications
------------

Le problème du sac à dos possède de nombreuses applications pratiques. On peut
notamment citer le problème d'allocation d'actifs en finance. Dans ce contexte,
on a une somme à investir, qui correspond à la capacité maximale du sac à dos et
des projets ou investissements qui demandent tous une certaine partie du capital
à investir et une "promesse" de retour sur investissement. Comme il y a souvent
plus de projet à financer que d'actifs disponibles, on peut déterminer les
projets à financer en priorité en résolvant un problème du sac à dos. Le
problème revêt aussi une grande importance dans le domaine de la logistique.

Un des premiers protocoles cryptographiques à clé publique était basé sur la
résolution d'un problème du sac à dos.

Le problème revêt également une certaine importance théorique vu qu'il s'agit
d'un problème NP-complet. Découvrir un algorithme polynomial pour le sac à dos
reviendrait à résoudre P = NP.

Formulation mathématique
------------------------

Mathématiquement, le problème peut se formuler de la manière suivante. Comme
pour tout problème d'optimisation combinatoire, on utilise des **variables de
décisions** pour formuler le problème, ainsi que des **contraintes** et une
**fonction objectif** à optimiser. On considère que :math:`N` est le nombre
d'objets emportés. Les données du problème sont les suivantes:

..  admonition:: Données connues du problème

    On peut représenter le problème à l'aide de trois listes 

    - La liste ``V`` dont chaque élément ``V[i]`` indique le volume de l'objet
      numéro :math:`i`.

    - Liste ``N`` dont chaque élément ``N[i]`` indique la valeur nutritive de
      l'objet numéro :math:`i`.

..  admonition:: Variables de décision

    Dans ce problème, les variables de décision sont des variables binaires
    :math:`x_i \in \{0, 1\}` définies de la manière suivante pour tout
    :math:`0 \leq i \leq N`,

    ..  math::

        x_i = \begin{cases}
        1 &\text{si on prend l'objet $i$} \\
        0 &\text{sinon} \\
        \end{cases}

    Pour l'instance considérée en exemple, il y a six variable de décision
    :math:`x_0, \ldots, x_5`, une pour chacun des articles que l'on peut
    potentiellement emporter.


..  admonition:: Contraintes

    Dans un problème d'optimisation combinatoire les contraintes doivent être
    respectées pour qu'une solution soit considéré comme valide (*feasible* en
    anglais). Dans le cas du problème du sac à dos, il n'y a qu'une seule
    contrainte, formulée comme une inéquation linéaire:

    ..  math::

        \sum_{i=0}^{N-1}
        x_i \cdot V[i]
        \leq 
        C

    Pour l'instance considérée en exemple, pour un sac à dos de 50 litres, la
    contrainte s'écrit

    ..  math::
        
        x_0 \cdot 13 + x_1 \cdot 13 + x_2 \cdot 13 + x_3 \cdot 10 + x_4 \cdot 24 + x_5 \cdot 11 \leq 50

..  admonition:: Fonction objectif

    La fonction objectif indique la valeur qui doit être optimisée. Dans notre
    cas, il s'agit de la valeur nutritive totale emportée dans le sac à dos. En
    l'occurrence, la valeur objectif à optimiser est donnée par la fonction

    ..  math::

        f(X) = f(x_0, \ldots, x_{N-1}) = \sum_{i=0}^{N-1} x_i \cdot N[i]

    Pour l'instance considérée en exemple, la fonction objectif est donc

    ..  math::

        f(X) &= f(x_0, x_1, x_2, x_3, x_4, x_5) \\
        &= x_0 \cdot 2600 + x_1 \cdot 2600 + x_2
        \cdot 2600 + x_3 \cdot 500 + x_4 \cdot 4500 + x_5 \cdot 960

        
Résoudre le problème du sac à dos consiste à attribuer à chaque variable de
décision :math:`x_i` une valeur dans :math:`\{0, 1\}` de telle manière que
toutes les contraintes soient satisfaites. De plus, il faut trouver une solution
optimale, à savoir une solution qui maximise la fonction objectif :math:`f`. La
programmation dynamique se préoccupe avant tout de trouver le profit maximal et
détermine les objets à rajouter concrètement dans le sac une fois le problème de
la valeur optimale connue.

..
    Représentation du problème en Python
    ====================================

    En Python, le problème peut être représenté comme suit:

    ..  literalinclude:: scripts/knapsack.py

Résolution par la force brute
=============================


On se rappelle qu'on veut résoudre l'instance du problème du sac à dos dont les
données figurent dans la table :ref:`table-knapsack-small-instance`.

.. _table-knapsack-small-instance:

..  csv-table:: Articles disponibles dans la réserve alimentaire
    :header-rows: 1
    :class: longtable

    No article, Description, Volume :math:`V[i]` [litre], Valeur nutritive :math:`N[i]` [kcal], "Variables :math:`x_i \in \{0, 1\}`"  
    0, Paquet de riz, 24, 4500, ?
    1, Paquet de pâtes, 13, 2600, ?
    2, Paquet de pâtes, 13, 2600, ?
    3, Paquet de pâtes, 13, 2600, ?

On considère de plus que la capacité du sac à dos est de :math:`C = 50\,[l]`.

Comme toujours, on peut commencer par utiliser la force brute sur une petite
instance pour se familiariser avec le problème et trouver la réponse correcte
qui permettra de tester les tentatives ultérieures.

..  literalinclude:: scripts/knapsack_bruteforce.py
    :caption:

Le programme en question produit la sortie suivante, qui montre les meilleures
solutions en premier:

::

    Sol. 0: X=(1, 1, 1, 1), f(X)=12300, V(X)=63, Feasible=False
    Sol. 1: X=(0, 1, 1, 1), f(X)=9700, V(X)=50, Feasible=True
    Sol. 2: X=(1, 0, 1, 1), f(X)=9700, V(X)=50, Feasible=True
    Sol. 3: X=(1, 1, 0, 1), f(X)=9700, V(X)=50, Feasible=True
    Sol. 4: X=(1, 1, 1, 0), f(X)=7800, V(X)=39, Feasible=True
    Sol. 5: X=(0, 0, 1, 1), f(X)=7100, V(X)=37, Feasible=True
    Sol. 6: X=(0, 1, 0, 1), f(X)=7100, V(X)=37, Feasible=True
    Sol. 7: X=(1, 0, 0, 1), f(X)=7100, V(X)=37, Feasible=True
    Sol. 8: X=(0, 1, 1, 0), f(X)=5200, V(X)=26, Feasible=True
    Sol. 9: X=(1, 0, 1, 0), f(X)=5200, V(X)=26, Feasible=True
    Sol. 10: X=(1, 1, 0, 0), f(X)=5200, V(X)=26, Feasible=True
    Sol. 11: X=(0, 0, 0, 1), f(X)=4500, V(X)=24, Feasible=True
    Sol. 12: X=(0, 0, 1, 0), f(X)=2600, V(X)=13, Feasible=True
    Sol. 13: X=(0, 1, 0, 0), f(X)=2600, V(X)=13, Feasible=True
    Sol. 14: X=(1, 0, 0, 0), f(X)=2600, V(X)=13, Feasible=True
    Sol. 15: X=(0, 0, 0, 0), f(X)=0, V(X)=0, Feasible=True

On constate qu'on ne peut pas introduire tous les aliments dans le sac car la
solution :math:`X=(1,1,1,1)` n'est pas faisable. On peut également voir qu'il y
a plusieurs solutions optimales qui permettent d'emporter 9700 kcal de valeur
nutritive. Toutes ces solutions consistent à emporter deux paquets de pâtes et
un paquet de riz.

Analyse de complexité
---------------------

Comme toujours, la force brute a une performance catastrophique exponentielle.
Dans un problème d'optimisation combinatoire, la complexité de la force brute
est donnée par la taille du produit cartésien des domaines :math:`D_i` des
variables. Comme il y a 4 variables dans cette instance, la complexité est de
:math:`|\{0, 1\}^4| = 2^4 = 16`. De manière générale, s'il y a :math:`n`
éléments à choix à insérer dans le sac à dos, la complexité temporelle de la
force brute est :math:`\Theta(2^n)`.

Résolution gloutonne
====================

On peut éventuellement espérer résoudre le problème de manière gloutonne, en
rajoutant les éléments un à un et en commençant par insérer ceux qui paraissent
le plus avantageux, à savoir ceux dont le rapport :math:`\frac{N[i]}{V[i]}` est
le plus élevé. Le tableau ci-dessous est trié dans l'ordre décroissant de la
valeur heuristique :math:`\frac{N[i]}{V[i]}`.

..  _table-knapsack-greed:

    ..  csv-table:: Articles disponibles dans la réserve alimentaire
        :header-rows: 1
        :class: longtable

        Description, Volume :math:`V[i]` [litre], Valeur nutritive :math:`N[i]` [kcal], "Rapport :math:`\frac{N[i]}{V[i]}`" 
        Paquet de pâtes, 13, 2600, 200
        Paquet de pâtes, 13, 2600, 200
        Paquet de pâtes, 13, 2600, 200
        Paquet de riz, 24, 4500, 187.5

On voit bien que cette manière de procéder va insérer les trois paquets de
pâtes, qui paraissent les plus avantageux, et laisser de côté le paquet de
Paquet de riz, pour lequel il n'y aura plus de place une fois les trois paquets
de pâtes emportés dans le sac. En effet, les trois paquets de pâtes occupent un
volume de 39 litres et il n'y a donc plus de place pour le paquet de riz. Par
contre, la valeur nutritive emportée est de :math:`3\times 2600 = 7800`, ce qui
est passablement inférieur à la valeur optimale de 9700.

..
    Implémentation en Python
    ------------------------

    Le programme :ref:`greedy_knapsack.py` montre une implémentation en Python de la
    stratégie gloutonne.

    ..  _greedy_knapsack.py:

    ..  literalinclude:: scripts/greedy_knapsack.py
        :caption:
        

    La sortie du programme donne en effet une solution sous-optimale qui prend les
    trois paquets de pâtes mais laisse le paquet de riz.

    .. code-block:: txt

        Solution optimale trouvée: X=[1, 1, 1, 0], valeur=7800



    ..
        ..  pcode::
            :linenos:

            \begin{algorithm}
            \caption{Greedy Knapsack}
            \begin{algorithmic}
            \PROCEDURE{Greedy-KP}{$V, W, C$}
                \STATE $W_{tot} \gets 0$
                \STATE $I \gets \{0 \ldots N-1\}$
                \STATE $S \gets \{\}$
                \While{$W_{tot} < C$}
                    \State $i = \max_{k \in I \setminus S} $
                \EndWhile

            \ENDPROCEDURE
            \end{algorithmic}
            \end{algorithm}

    ..
        \begin{algorithm}
        \caption{Greedy Knapsack}
        \begin{algorithmic}
        \PROCEDURE{Greedy-KP}{$V, $N, $C}
            IF{$p < r$}
                \STATE $q = $ \CALL{Partition}{$A, p, r$}
                \STATE \CALL{Greedy-KP}{$A, p, q - 1$}
                \STATE \CALL{Greedy-KP}{$A, q + 1, r$}
            \ENDIF
        \ENDPROCEDURE
        \end{algorithmic}
        \end{algorithm}

Résolution par programmation dynamique
======================================

Comme la force brute est exclue en raison de sa complexité temporelle et que la
méthode gloutonne donne des solutions sous-optimales, la programmation dynamique
pourrait donner de meilleurs résultats. En effet, la programmation dynamique est
une manière classique de résoudre le problème du sac à dos de manière exacte.

..  admonition:: Stratégie de résolution par programmation dynamique

    De manière générale, pour résoudre un problème par programmation dynamique,
    il faut suivre les étapes suivantes:

    #. Définir les sous-problèmes
    #. Vérifier que le problème possède la propriété de sous-structures
       optimales et de sous-problèmes non disjoints. Trouver une formulation
       permettant de résoudre le problème connaissant la solution optimale des
       sous-problèmes directs. Envisager tous les cas possibles comme dans une
       approche par force brute. Déterminer la formule de récurrence.
    #. Optionnel : vérifier que le graphe de dépendances soit acyclique. Si on
       omet cette étape et que le graphe de dépendances contient un cycle, on ne
       manquera pas de tomber sur une récursion infinie lors de
       l'implémentation.
    #. Implémenter la récurrence sous forme de récursion avec mémoïsation
    #. Résoudre le problème de manière ascendante (bottom-up) avec la "méthode
       tabulaire" pour éviter la récursion.       
    #. Optionnel : optimiser l'algorithme pour économiser de la mémoire
    #. Optionnel : construire une solution concrète à partir du tableau de
       programmation dynamique.

    Les étapes en question sont données à titre indicatif et constituent un
    guide utile dans la plupart des cas. Parfois, il faut toutefois faire preuve
    d'un peu plus de souplesse et de ruse.

    Les étapes 1 à 2 sont les plus difficiles lorsqu'on n'a pas l'habitude de la
    programmation dynamique. Dès que ces étapes ont été réalisées, le reste
    découle en général assez facilement.

Étape 0 : Partir d'une instance simple
--------------------------------------

Nous partirons de l'instance définie par la table
:ref:`table-knapsack-small-instance`.

Étapes 1 : Décomposition en sous-problèmes
------------------------------------------

Pour résoudre un problème avec la programmation dynamique, il faut commencer par
le décomposer en sous-problèmes. Il faut aussi bien clarifier ce qu'on attend
comme solution. La programmation dynamique convient bien pour résoudre des
problèmes d'optimisation combinatoire. Résoudre le problème signifie attribuer à
chaque variable de décision :math:`x_i` une valeur issue de leur domaine
:math:`D_i`. Mais, avant de vouloir déterminer la valeur à attribuer à chaque
variable de décision, la programmation dynamique consiste dans un premier temps
à déterminer la valeur optimale. On veut donc développer une fonction qui dépend
des poids ``weights: list[int]``, des profits ``profits: list[int]`` et de la capacité du
sac à dos ``capacity: int``.

..  code-block:: python

    def knapsack(profits: list[int], weights: list[int], capacity: int) -> int:
        pass

qui retourne la valeur optimale que l'on peut emporter dans le sac. Une fois
cette valeur déterminée, on peut modifier légèrement l'algorithme pour
fournir également une solution concrète :math:`X \in D_0 \times D_1 \times
\cdots \times D_{N-1}`.

Dans le cas du sac à dos, cela est assez facile à faire. Si l'on sait résoudre
le problème pour les :math:`N-1` derniers articles du tableau, on peut
facilement le résoudre en rajoutant un élément supplémentaire.

L'idée est toujours de ramener le problème initial à la résolution d'un problème
trivial. En l'occurrence, le problème du sac à dos est trivial s'il n'y a aucun
élément à rajouter dans le sac à dos. Dans ce cas, la valeur optimale que l'on
peut insérer dans le sac à dos est nulle.

..  code-block:: python

    def knapsack(profits: list[int], weights: list[int], capacity: int):
        if len(profits) == 0:
            return 0

Étape 2 : Construire une solution optimale à partir des sous-solutions
----------------------------------------------------------------------

Ensuite, si le problème n'est pas trivial, il faut réduire sa taille
récursivement. La réduction du problème se fait en envisageant toutes les
alternatives possibles, comme pour une recherche par force brute, car on ne sait
pas à l'avance quel choix il faut faire. On doit donc décider s'il faut ou non
insérer le premier objet de la liste. Que l'objet en question soit placé dans le
sac ou non, il faut ensuite résoudre un nouveau problème du sac à dos avec un
objet de moins.

-   Si on décide de ne pas insérer le premier objet, il faut résoudre un nouveau
    problème du sac à dos avec les objets restants
  
    ::

        profit_without = knapsack(profits[1:], weights[1:], capacity)


-   Si, en revanche, on décide d'insérer le premier objet, la capacité restante
    pour le reste des objets est moindre, car l'objet inséré occupe une capacité
    de ``weights[0]`` dans le sac à dos. En revanche, la valeur emportée dans le
    sac à dos est augmentée de ``profits[0]``. Il faut donc résoudre le problème
    suivant pour les objets restants:
  
    ::

        remaining = capacity - weights[0]
        profit_with = knapsack(profits[1:], weights[1:], remaining) + profits[0]

Il faut ensuite choisir la meilleure des deux options, à savoir celle qui
rapporte le plus:

..  literalinclude:: scripts/knapsack_step1.py
    :caption:

..  compound::

    Le programme produit la sortie suivante:

    ::

        Valeur optimale: 12300


..
    En résolvant le problème pour les profits ``N = [2600, 2600, 2600, 4500]``, les
    volumes ``V = [13, 13, 13, 24]`` et une capacité de ``C = 50``, on obtient
    l'arbre d'appels récursifs de la figure :ref:`fig_knapsack_step1_tree`.

    ..  _fig_knapsack_step1_tree:

    ..  figure:: figures/knapsack-step1.png
        :align: center
        :width: 100%

        Arbre des appels récursifs pour ``kp_step1(profits=N, weights=C,
        capacity=C)``

On constate un problème. La fonction retourne une valeur optimale de 12300 au
lieu des 9700 attendus. La contrainte de capacité du sac à dos ne semble donc
pas respectée. Cela vient du fait que l'élément courant ne doit être rajouté que
s'il reste suffisamment de la place, à savoir si ``weights[0] <= capacity``. Il
faut donc explorer la possibilité de rajouter l'objet actuellement considéré que
s'il reste suffisamment de place:

..  literalinclude:: scripts/knapsack_step1_ok.py
    :emphasize-lines: 6, 9-10
    :caption:
    :linenos:

Cette fois-ci, le programme fournit bien la valeur optimale attendue et produit la sortie

::

    Valeur optimale: 9700


Étape 3 : ajout de la mémoïsation
---------------------------------

La manière dont la fonction récursive est écrite pour l'instant n'est pas idéale
et amène deux problèmes importants.

#.  Cette formulation récursive empêche une bonne mémoïsation. En effet, comme
    le montre l'arbre des appels récursifs de la figure
    :ref:`fig_knapsack_step1_tree`, les listes ``weights`` et ``profits``
    changent à chaque appel récursif. L'idée de la mémoïsation étant de
    sauvegarder la valeur de retour de la fonction pour chaque combinaison de
    paramètre déjà rencontrés, il n'y aucune chance de pouvoir profiter de la
    mémoïsation si les paramètres ``weights`` et ``profits`` changent à chaque
    appel récursif. En réalité, la seule chose qui change à chaque fois est la
    capacité restante du sac à dos et le numéro de l'objet que l'on est en train
    de considérer.

#.  Comme les listes ``weights`` et ``profits`` sont copiées à chaque appel, la
    mémoire utilisée par la pile d'appels récursifs explose très rapidement.

..  _fig_knapsack_step1_tree:

..  figure:: figures/knapsack-step1-part.png
    :align: center
    :width: 100%

    Extrait de l'arbre des appels récursifs

Pour corriger ce problème, il faut récrire la fonction ``knapsack`` pour que,
lors des appels récursifs, on ne réduise pas le problème en réduisant les listes
``weights`` et ``profits``, mais en modifiant l'indice de l'élément en cours de
traitement. Dans le code :ref:`code-knapsack-step3-optimize-recursion`, on
réduit la taille du problème et on indique l'objet dont on considère l'insertion
dans le sac à dos à l'aide du paramètre :math:`k` allant de 0 à :math:`N-1`.

..  _code-knapsack-step3-optimize-recursion:

..  literalinclude:: scripts/knapsack_step3.py
    :caption:
    :linenos:
    :pyobject: knapsack

Le problème est qu'il faut à présent indiquer le paramètre ``k=0`` lors de
l'appel de la fonction, ce qui n'est pas très pratique. De plus, la fonction
``knapsack`` contient toujours les paramètres ``profits`` et ``weights`` qui
sont passés à chaque appel récursif. Pour améliorer la situation et éviter qu'il
faille indiquer le paramètre :math:`k` lors de l'appel, on peut isoler la
fonction récursive dans une fonction locale à la fonction ``knapsack`` comme le
montre le code :ref:`code-knapsack-step3-optimize-recursion-better`.

..  _code-knapsack-step3-optimize-recursion-better:

..  literalinclude:: scripts/knapsack_step3_better.py
    :caption:
    :linenos:
    :pyobject: knapsack

À présent, on peut commencer à attaquer la mémoïsation. En effet, l'arbre des
appels récursifs de la fonction interne ``solve`` présente des appels redondants
qui gagneraient à être mémoïsés comme le montre la figure
:ref:`fig_knapsack_solve_tree`.

..  _fig_knapsack_solve_tree:

..  figure:: figures/knapsack_rec_final.png
    :align: center
    :width: 100%

    Arbre des appels récursifs de la fonction locale ``solve``

Pour rappel, la mémoïsation consiste à mémoriser la valeur de retour de la
fonction pour chaque combinaison de paramètres. Dans le cas présent, la fonction
à mémoïser est la fonction locale ``solve(capacity, k)``. Pour la mémoïsation,
on peut utiliser une table de hachage dont les clés sont des tuples ``(c, k)``
où ``c`` est la capacité du sac à dos et ``k`` l'indice de l'élément sur lequel
porte actuellement le choix. On peut également utiliser un tableau
bidimensionnel où l'on stocke la valeur de retour de l'appel ``solve(c, k)`` à
l'adresse ``memo[k][c]``. Nous retiendrons la deuxième possibilité qui se
rapproche le plus de l'approche descendante que nous utiliserons par la suite.

..  admonition:: Discussion
    :class: hint

    Une table de hachage ``memo[(c, k)]`` présente l'avantage d'économiser un
    peu d'espace, car certains couples de paramètres ``(c, k)`` ne sont jamais
    utilisés dans l'arbre récursif.

    Par contre, le tableau bidimensionnel ``memo[k][c]`` présente l'avantage
    d'être plus rapide. De toute manière, la programmation dynamique ne permet
    pas de résoudre des instances astronomiques du problème du sac à dos. De ce
    fait, le produit :math:`k\cdot C` reste tout à fait gérable en pratique pour
    la mémoire de travail d'un ordinateur moderne.

    De plus, le tableau bidimensionnel correspond exactement à la structure de
    données utilisée pour mettre en place l'algorithme suivant l'approche
    tabulaire ascendante permettant de se débarrasser de la récursion.

Le programme :ref:`knapsack_memoized.py` ajoute la mémoïsation dans le tableau
bidimensionnel ``memo[k][c]``.

.. _knapsack_memoized.py:

..  literalinclude:: scripts/knapsack_memoized.py
    :caption:
    :linenos:
    :pyobject: knapsack
    :emphasize-lines: 3, 6-7, 19

..

..  admonition:: Commentaires concernant le code

    * Ligne 3 : on crée un tableau bidimensionnel de :math:`N+1` lignes (une
      ligne par objet dans le problème plus une ligne supplémentaire pour éviter
      d'accéder en dehors du tableau) et de :math:`C+1` colonnes, :math:`C`
      étant la capacité du sac à dos.

    * Lignes 6-7 : Si la valeur en ``memo[k][c]`` n'est pas ``None``, c'est que
      la fonction a déjà été appelée avec les paramètres ``(c, k)`` au
      préalable. Dans ce cas, on retourne simplement la valeur stockée au lieu
      de refaire le calcul.

    * Ligne 19 : Avant de retourner la valeur optimale pour le problème ``(c,
      k)``, on le stocke dans le tableau de mémoïsation à l'adresse
      ``memo[k][c]``.

Comme le montre la figure :ref:`knapsack_memoized_tree`, maintenant que la
fonction locale ``solve`` est mémoïsée, l'arbre des appels récursifs est déjà
beaucoup plus réduit, car tous les sous-arbres redondants ont été élagués.

..  _knapsack_memoized_tree:

..  figure:: figures/knapsack_memoized.png
    :align: center
    :width: 80%

    Arbre des appels récursifs pour la version mémoïsée de la fonction locale
    ``solve(c, k)``

Étape 4 : graphe de dépendances
-------------------------------

Fondamentalement, le graphe de dépendances pour le calcul de ``solve(c, k)``
correspond à l'arbre des appels récursifs dont tous les nœuds correspondant au
même couple de paramètres ``(c, k)`` sont réduits à un seul sommet dans le
graphe de dépendances. Il est important d'établir un tri topologique du graphe
de dépendances inversé pour savoir comment construire la solution de manière
itérative avec la méthode tabulaire et se débarrasser de la récursion.

..  _knapsack-subproblems-graph:

..  graphviz::
    :caption: Graphe de dépendances du calcul de ``solve(50, 0)``

     digraph example {
         rankdir=LR;
         rank=same;
         "S(50, 0)" -> "S(50, 1)" -> "S(50, 2)" -> "S(50, 3)" -> "S(50, 4)"
         "S(50, 3)" -> "S(26, 4)"
        "S(50, 0)" -> "S(37, 1)" -> "S(37, 2)" -> "S(37, 3)" -> "S(37, 4)" 
        "S(37, 3)" -> "S(13, 4)"
         "S(50, 1)" -> "S(37, 2)" -> "S(24, 3)" -> "S(24, 4)"
         "S(24, 3)" -> "S(0, 4)" 
        "S(37, 1)" -> "S(24, 2)" -> "S(24, 3)" 
        "S(24, 2)" -> "S(11, 3)" -> "S(11, 4)" 
     }

..  _knapsack-reversed-subproblems-graph:

..  graphviz::
    :caption: Inverse du graphe de dépendances du calcul de ``solve(50, 0)``

    digraph example {
        rankdir=LR;
        rank=same;
        "S(50, 4)" -> "S(50, 3)" -> "S(50, 2)" -> "S(50, 1)" -> "S(50, 0)"
        "S(26, 4)" -> "S(50, 3)"
        "S(37, 4)" -> "S(37, 3)" -> "S(37, 2)" -> "S(37, 1)" -> "S(50, 0)"
        "S(13, 4)" -> "S(37, 3)"
        "S(24, 4)" -> "S(24, 3)" -> "S(37, 2)" -> "S(50, 1)"
        "S(0, 4)" -> "S(24, 3)"
        "S(24, 3)" -> "S(24, 2)" -> "S(37, 1)"
        "S(11, 4)" -> "S(11, 3)" -> "S(24, 2)"
    }

En observant le graphe de dépendances inversé de la figure
:ref:`knapsack-reversed-subproblems-graph`, on constate qu'on peut facilement
réaliser un tri topologique en notant les sommets du graphe dans l'ordre
décroissant de :math:`k` et dans l'ordre croissant de la capacité :math:`C`.
Cela vient du fait que, lors des appels récursifs, on ne fait qu'augmenter
:math:`k` et diminuer la capacité restante dans le sac à dos à mesure qu'on
descend dans l'arbre des appels récursifs. Si on trie les sommets par ordre
décroissant de :math:`k` et par ordre croissant des capacités, on obtient
l'ordre 

..  code-block:: txt
    
    S(0, 4) -> S(11, 4) -> S(13, 4) -> S(24, 4) -> S(26, 4) -> S(37, 4)
     -> S(50, 4) -> S(11, 3) -> S(24, 3) -> S(37, 3) -> S(50, 3) -> S(24, 2)
     -> S(37, 2) -> S(50, 2) -> S(37, 1) -> S(50, 1) -> S(50, 0)

On constate que la dernière valeur calculée est le problème original ``solve(50,
0)``, ce qui est une bonne nouvelle.

Étape 5 : De la version récursive à la version itérative
--------------------------------------------------------

Pour éviter les pénalités de performance et les limitations dues à la récursion,
on peut également résoudre le problème de manière itérative. Il faut pour cela
savoir dans quel ordre construire la solution finale en tenant compte du tri
topologique du graphe de dépendances inversé réalisé à l'étape précédente.
L'algorithme itératif ascendant consiste essentiellement à remplir toutes les
entrées de la table de mémoïsation ``memo[k][c]`` en respectant l'ordre des
dépendances, à savoir en diminuant la valeur de ``k`` et en augmentant la valeur
de ``c``.


..  only:: html

    ..
        ..  figure:: figures/recursion-to-tabulation.gif
            :align: center
            :width: 100%

    ..  margin::

        ..  admonition:: Étapes pour passer de la récursion à la méthode ascendante "tabulaire"

            Les étapes ci-dessous se rapportent à la figure
            :ref:`easy-steps-recursion-to-tabulation`.

            1. Préremplir la table de mémoïsation avec les "cas de base" de la
            récursion.

            2. Consulter la table de mémoïsation au lieu de faire des appels récursifs.
            En l'occurrence, utiliser ``memo[k][c]`` au lieu de faire un appel
            récursif ``solve(c, k)``.

            3. Parcourir itérativement la table de mémoïsation dans le "bon ordre" au
            lieu de faire des appels récursifs. Le "bon ordre" est déterminé par un
            tri topologique de l'inverse du graphe des sous-problèmes résultant de
            l'arbre des appels récursifs.

            4. Le reste peut en principe être transposé tel quel de la version récursive
            à la version itérative.  
..
    ..  only:: html

        ..  _easy-steps-recursion-to-tabulation:

        ..  figure:: figures/recursion-to-tabulation.png
            :align: center
            :width: 100%

            Étapes pour passer de la version récursive descendante à la version
            itérative ascendante

..  only:: latex

    ..  admonition:: Étapes pour passer de la récursion à la méthode ascendante "tabulaire"

        Les étapes ci-dessous se rapportent à la figure
        :ref:`easy-steps-recursion-to-tabulation`.

        1. Préremplir la table de mémoïsation avec les "cas de base" de la
        récursion.

        2. Consulter la table de mémoïsation au lieu de faire des appels récursifs.
        En l'occurrence, utiliser ``memo[k][c]`` au lieu de faire un appel
        récursif ``solve(c, k)``.

        3. Parcourir itérativement la table de mémoïsation dans le "bon ordre" au
        lieu de faire des appels récursifs. Le "bon ordre" est déterminé par un
        tri topologique de l'inverse du graphe des sous-problèmes résultant de
        l'arbre des appels récursifs.

        4. Le reste peut en principe être transposé tel quel de la version récursive
        à la version itérative.  


..  _easy-steps-recursion-to-tabulation:

..  figure:: figures/recursion-to-tabulation-vertical.png
    :align: center
    :width: 100%

    Étapes pour passer de la version récursive descendante à la version
    itérative ascendante


..  literalinclude:: scripts/knapsack_tabular.py
    :caption:
    :linenos:
    :pyobject: knapsack

On constate qu'après cette transformation, le programme livre toujours le bon
résultat:

..  code-block:: txt

    Valeur optimale: 9700

Test du programme sur d'autres instances
========================================

Pour tester les performance et l'exactitude de l'algorithme, on peut utiliser
des instances de tests de différentes tailles disponibles sur le Web. Pour les
premiers tests, les instances de test :cite:p:`johnyortega:test-instances` sont
utilisées étant donné que les valeurs optimales sont indiquées.

Petites instances
-----------------

Le tableau :ref:`knapsack-test-small-instances` montre les résultats obtenus
pour les petites instances mentionnées dans la section "Low-dimensional 0/1
knapsack problems".

..  _knapsack-test-small-instances:

..  csv-table:: Instances testées sur l'algorithme récursif mémoïsé et sur l'algorithme itératif
    :header-rows: 1

    "Nom de l'instance", "Optimum correct", Optimum trouvé, Temps (récursion), Temps (itératif)
    ``f1_l-d_kp_10_269``, 295, 295 , ":math:`0.2198\,\textrm{ms}`", ":math:`0.5875\,\textrm{ms}`"
    ``f2_l-d_kp_20_878``, 1024, 1024 , ":math:`2.9633\,\textrm{ms}`", ":math:`4.0302\,\textrm{ms}`"
    ``f3_l-d_kp_4_20``, 35, 35 , ":math:`0.0122\,\textrm{ms}`", ":math:`0.0231\,\textrm{ms}`"
    ``f4_l-d_kp_4_11``, 23, 23 , ":math:`0.0093\,\textrm{ms}`", ":math:`0.0169\,\textrm{ms}`"
    ``f6_l-d_kp_10_60``, 52, 52 , ":math:`0.0877\,\textrm{ms}`", ":math:`0.1328\,\textrm{ms}`"
    ``f7_l-d_kp_7_50``, 107, 107 , ":math:`0.0558\,\textrm{ms}`", ":math:`0.0787\,\textrm{ms}`"
    ``f8_l-d_kp_23_10000``, 9767, 9767 , ":math:`8.7740\,\textrm{ms}`", ":math:`58.0101\,\textrm{ms}`"
    ``f9_l-d_kp_5_80``, 130, 130 , ":math:`0.0265\,\textrm{ms}`", ":math:`0.0958\,\textrm{ms}`"
    ``f10_l-d_kp_20_879``, 1025, 1025 , ":math:`5.7342\,\textrm{ms}`", ":math:`4.0514\,\textrm{ms}`"
    
..  admonition:: Discussion des résultats

    La version récursive et la version itérative calculent le profit maximal
    correctement.
    
    Contrairement aux idées reçues l'algorithme récursif est la plupart du temps
    plus rapide que l'algorithme itératif par tabulation, malgré le *overhead*
    dû aux appels récursifs. Cela vient du fait que la version récursive fait
    moins de travail inutile. En effet, la version itérative qui construit la
    solution petit à petit doit écrire dans ``memo[k][c]`` pour tout :math:`0
    \leq k \leq N` et pour tout :math:`0 \leq c \leq C`, ce qui fait
    :math:`(N+1)\cdot (C+1)` écritures, alors que la récursion ne fait que les
    appels strictement nécessaires.

    La version itérative est de ce fait particulièrement pénalisée dans le cas
    de l'instance ``f8_l-d_kp_23_10000`` où la capacité :math:`C = 10000` du sac
    à dos est très importante.

Instances plus importantes
--------------------------

Le tableau :ref:`knapsack-test-large-instances` présente les résultats des tests
des deux algorithmes sur des instances notées dans la catégorie "Large scale"

.. _knapsack-test-large-instances:

..  csv-table:: Test sur de grosses instances de l'algorithme récursif mémoïsé et de l'algorithme itératif
    :header-rows: 1

    "Nom de l'instance", ":math:`N`", ":math:`C`", "Optimum", "Temps (récursion)", "Temps (itératif)"
    "``knapPI_1_100_1000_1``", "100", "995", "9147", ":math:`27\,\textrm{ms}`", ":math:`19\,\textrm{ms}`"
    "``knapPI_1_200_1000_1``", "200", "1008", "11238", ":math:`59\,\textrm{ms}`", ":math:`40\,\textrm{ms}`"
    "``knapPI_1_500_1000_1``", "500", "2543", "28857", ":math:`462\,\textrm{ms}`", ":math:`283\,\textrm{ms}`"
    "``knapPI_1_1000_1000_1``", "1000", "5002", "54503", "``RecursionError``", ":math:`1203\,\textrm{ms}`"
    "``knapPI_1_2000_1000_1``", "2000", "10011", "110625", "``RecursionError``", ":math:`4887\,\textrm{ms}`"
    "``knapPI_1_5000_1000_1``", "5000", "25016", "276457", "``RecursionError``", ":math:`31604\,\textrm{ms}`"
    "``knapPI_1_10000_1000_1``", "10000", "49877", "563647", "``RecursionError``", ":math:`154955\,\textrm{ms}`"
..

..  admonition:: Discussion des résultats

    Sur de plus grosses instances, on constate qu'il y a un avantage à procéder
    de manière itérative. En effet, certaines instances sont hors de portée de
    la version récursive qui se heurte à la limite de profondeur des appels
    récursifs.
    
    De plus, l'approche itérative semble plus rapide que la version récursive
    sur de plus grosses instances. On constate tout de même que, pour plusieurs
    milliers d'objets, le temps nécessaire pour exécuter l'algorithme croît
    rapidement, ce qui est attendu pour une solution exacte d'un problème
    NP-complet.

Construction de la solution à partir du tableau
===============================================

L'algorithme présenté jusqu'à présent est capable de trouver le profit maximal,
mais sans pouvoir fournir la liste des objets à inclure dans le sac. On peut
toutefois construire la solution :math:`X = (x_0, x_1, \ldots, x_n)` à partir du
tableau construit pendant le processus itératif.

Pour cela, il faut comprendre la manière dont est rempli le tableau lors de la
construction de la solution. Pour bien comprendre, prenons une instance plus
simple du problème dans laquelle la capacité du sac à dos vaut :math:`C=8`, les
profits sont ``weights = [2, 3, 4, 5]`` et les profits ``profits = [1, 2, 5,
6]``. La figure :ref:`dp-kp-fill-table-step-01`  présente une représentation du
problème avec le tableau dynamique (9 colonnes de droite). Les trois colonnes de
gauche représentent les données du problème.

.. _dp-kp-fill-table-step-01:

..  figure:: figures/fill-table-step1.png
    :align: center
    :width: 100%

    Premières étapes de remplissage du tableau de programmation dynamique

..  admonition:: Remplissage du tableau
    :class: hint

    *   Les emplacements ``memo[4][0]`` à ``memo[4][8]``, notés ``memo[4][0..8]``
        (cases rouges) sont tous préremplis par des zéros (cas de base) avant de
        commencer le parcours du tableau.
 
    *   Les emplacements ``memo[3][0]`` à ``memo[3][4]`` (rose) sont remplis
        dans l'ordre avec des 0, car l'objet :math:`k=3` de poids :math:`W[3]=5`
        ne peut pas être mis dans le sac. En d'autres termes, la condition
       
        ::
        
            if weights[k] <= c:

        n'est pas satisfaite. Dans ce cas, il n'y a que l'alternative
        ``profit_without = memo[k+1][c]`` qui est explorée et on copie
        simplement la valeur de la case au-dessus dans ``memo[k][c]``.

    *   Pour ``memo[3][5]``, il y a suffisamment de place pour mettre l'objet
        :math:`k=3`. De ce fait, on considère les deux possibilités. On consulte
        donc l'emplacement ``memo[4][5]`` qui vaut 0

        ::

            profit_without = memo[k+1][c]

        puis, on consulte la case ``memo[k+1][c - W[k]]`` et on rajoute ``P[k]`` avec les instructions

        ::
            
            remaining = c - weights[k]
            profit_with = memo[k+1][remaining] + profits[k]

        À l'issue de cette étape, ``profit_with`` vaut 6 qui correspond au
        profit maximal. On stocke donc cette valeur dans ``memo[k][c]`` avec 

        ::

            best_profit = max(profit_with, profit_without)
            memo[k][c] = best_profit

    *   La formule générale pour remplir le tableau, qui découle directement de
        l'algorithme, est donc la suivante

        ::

            memo[k][c] = max(memo[k+1][c], memo[k+1][c - W[k]] + P[k])

        si :math:`W[k] <= c` et, dans le cas contraire, simplement
        ``memo[k+1][c]``.

Le tableau, entièrement rempli est montré dans la figure
:ref:`dp-kp-fill-table-complete`.

.. _dp-kp-fill-table-complete:

..  figure:: figures/fill-table-complete.png
    :align: center
    :width: 100%

    Tableau de programmation dynamique rempli

..  admonition:: Construction de la solution concrète

    Pour construire la solution, à savoir l'assignation d'une valeur de
    :math:`\{0, 1\}` aux variables de décisions :math:`x_0, \ldots, x_{N-1}`, on
    part de la case finale du tableau, à savoir ``memo[0][C]`` où ``C``
    représente la capacité du sac à dos et on remonte les tableau selon les
    étapes numérotées sur la figure :ref:`dp-kp-fill-table-complete` selon la
    logique suivante:

    #.  On compare la valeur de ``memo[k][c]`` avec la case du haut
        ``memo[k+1][c]``.

    #.  Si ``memo[k][c]`` et ``memo[k+1][c]`` ont la même valeur, c'est que
        l'objet de la ligne :math:`k` actuelle ne contribue par à la valeur
        optimale. On ne rajoute donc pas l'objet :math:`k` dans le sac en posant
        :math:`x_k = 0`. On recommence au point 1, mais en montant d'une ligne
        pour considérer le prochain objet tout en restant dans la même colonne.
        Cette situation correspond aux étiquettes 1 et 4 dans la figure
        :ref:`dp-kp-fill-table-complete`.

    #.  Si, en revanche, ``memo[k][c] == memo[k+1][c] + P[k]``, ce que l'objet
        :math:`k` de la ligne actuelle contribue au profit maximal. On le
        rajoute donc dans le sac en posant :math:`x_k = 1`. On recommence au
        point 1, mais en montant d'une ligne pour considérer le prochain objet.
        Comme on a rajouté l'objet :math:`k`, il y a moins de place restante
        dans le sac à dos et il faut donc aussi décaler de :math:`W[k]` colonnes
        vers la gauche. Cette situations correspond aux étiquettes 2 et 5 dans
        la figure :ref:`dp-kp-fill-table-complete`.

    #.  On s'arrête lorsqu'on est parvenu à la ligne :math:`k = N-1` où
        :math:`N` est le nombre d'objets.

..  literalinclude:: scripts/knapsack_tabular.py
    :pyobject: derive_solution
    :linenos:
    :caption:


Analyse de complexité
=====================

Complexité temporelle
---------------------

La version récursive mémoïsée et itérative ont toutes deux la même complexité
temporelle, comme d'habitude en programmation dynamique. Dans les deux cas, la
complexité est déterminée dans le pire des cas par le nombre d'appels récursifs
non mémoïsés ou le nombre de cases dans le tableau de programmation dynamique.
Dans le cas du sac à dos, les deux seuls paramètres indépendants dont dépend
chaque sous problème est l'indice :math:`k` de l'objet considéré et la capacité
:math:`C` du sac à dos . Les appels mémoïsés coûtent :math:`\Theta(1)`
opérations, de même que la recombinaison des solutions optimales. La complexité
temporelle est donc

..  math::

    (N+1) \cdot (C+1) \cdot \Theta(1) = \Theta(N \cdot C)

Malheureusement, cette complexité n'est pas polynomiale, mais
**pseudo-polynomiale**.

Complexité spatiale
-------------------

Un des talons d'Achille des algorithmes de programmation dynamique est leur
forte consommation mémoire. En effet, la complexité spatiale des algorithmes
récursifs et itératifs sont également de complexité :math:`\Theta(N \cdot C)` vu
que la table de mémoïsation doit dans les deux cas stocker :math:`(N+1)\cdot
(C+1)` valeurs différentes.

Dans le cas où l'on n'a pas besoin de reconstruire la solution, mais où l'on ne
s'intéresse qu'à la valeur optimale, on peut toutefois ne se rappeler que de
deux lignes du tableau de mémoïsation et avoir une complexité spatiale
:math:`\Theta(C)`.

Avantages et inconvénients
==========================

L'un des avantages de la programmation dynamique pour résoudre le problème du
sac à dos est la formulation excessivement simple qui donne une solution
optimale pour des instances de petite et moyenne taille (quelques milliers
d'objets et une capacité du sac à dos raisonnable).

En revanche, les algorithmes de programmation dynamique sont particulièrement
sensibles à la capacité du sac à dos, alors que d'autres algorithmes ne sont pas
du tout affectés par cette grandeur. De plus, si les coefficients de poids ne
sont pas entiers, il faut mettre la capacité et les poids à l'échelle pour
obtenir des nombres entiers, ce qui donne lieu à une capacité de sac à dos et
une consommation mémoire importante.
    





