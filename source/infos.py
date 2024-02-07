class DocumentInfos:

    title = u'Titre de votre travail personnel (modifier dans `source/infos.py`)'
    first_name = 'Prénom (infos.py)'
    last_name = 'Nom de famille (infos.py)'
    author = f'{first_name} {last_name}'
    year = u'2024'
    month = u'Janvier'
    seminary_title = u'Projet OCI'
    tutor = u"Cédric Donner"
    release = "(Version finale)"
    repository_url = "https://github.com/<username>/<reponame>"

    @classmethod
    def date(cls):
        return cls.month + " " + cls.year

infos = DocumentInfos()