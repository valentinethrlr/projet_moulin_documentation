class DocumentInfos:

    title = u'Jeu du moulin'
    first_name = 'Valentine'
    last_name = 'Thürler'
    author = f'{first_name} {last_name}'
    year = u'2024'
    month = u'Avril'
    seminary_title = u'Projet OCI'
    tutor = u"Cédric Donner"
    release = "(Version finale)"
    repository_url = "https://github.com/<valentinethrlr>/<projet-moulin>"

    @classmethod
    def date(cls):
        return cls.month + " " + cls.year

infos = DocumentInfos()