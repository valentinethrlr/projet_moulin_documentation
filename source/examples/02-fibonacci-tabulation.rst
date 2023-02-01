.. _fibonacci-tabulation.rst:

Nombres de Fibonacci, approche ascendante
#########################################

Dans la section :ref:`fibonacci-memoisation`, nous avons présenté la
programmation dynamique descendante pour le calcul du :math:`n`-ième terme de la
suite de Fibonacci. Dans cette section, nous allons aborder l'approche
ascendante qui se débarrasse de la récursion. Cette approche est généralement
plus performante, car elle évite les problèmes de performance liés aux appels
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

On peut encore améliorer la performance de ce dernier algorithme en tenant
compte du fait que, pour calculer :math:`F(n)`, il suffit de connaître
:math:`F(n-1)` et :math:`F(n-2)` et qu'il n'est pas nécessaire de se souvenir de
tous les résultats intermédiaires précédents. On peut réaliser très facilement
en prenant un tableau de 3 éléments qui va, en tout temps, stocker les résultats
pour le rang :math:`n`, :math:`n-1` et :math:`n-2`. On utilise pour ce faire un
type personnalisé de cache LRU basé sur un tableau de longueur 3 parcouru modulo
3, de manière cyclique.

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
