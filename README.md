# 🕒 pg-cron-ts

Un petit scheduler TypeScript basé sur `cron`, capable d’exécuter des requêtes SQL PostgreSQL à intervalles réguliers définis par fichier.

## 📦 Fonctionnalités

- Planification de jobs via des expressions CRON (compatible `cronstrue`)
- Exécution de requêtes SQL depuis des fichiers `.sql`
- Configuration des connexions PostgreSQL par job
- Support multijob via le dossier `jobs/`
- Journalisation des exécutions et erreurs
- Compatible Docker

---

## 🚀 Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/MaxVzl/pg-cron-ts.git
cd pg-cron-ts
```

### 2. Structure du projet

```bash
pg-cron-ts/
├── src/              # Code TypeScript
│   └── index.ts      # Script principal
├── jobs/             # Dossier des tâches planifiées
│   ├── epurate.json  # Configuration de la tâche
│   └── epurate.sql   # Requête SQL associée
├── Dockerfile
└── docker-compose.yml
```

## ⚙️ Exemple de configuration de job

### 📄 `jobs/epurate.json`

```json
{
  "name": "epurate",
  "description": "This job runs the epuration script weekly to clean up old data.",
  "expression": "* * * * * *",
  "pg_user": "postgres",
  "pg_password": "postgres",
  "pg_host": "localhost",
  "pg_port": "5432",
  "pg_database": "postgres",
  "script": "epurate.sql",
  "timezone": "Europe/Paris"
}
```

### 🧾 `jobs/epurate.sql`

```sql
-- Exemple simple
SELECT NOW() AS current_time;
```

## 🐳 Utilisation avec Docker

### 🔧 Lancer avec Docker Compose

```bash
docker-compose up -d --build
```

### 🛑 Arrêter et nettoyer les conteneurs
```bash
docker-compose down -v
```

Cela lancera :
- Une base de données PostgreSQL (postgres:16)
- Un conteneur cron qui exécute les tâches définies dans jobs/

## 🧪 Tester localement (sans Docker)

```bash
npm install
npm run build
npm run start
```

## ✨ Dépendances principales

- [node-cron](https://github.com/kelektiv/node-cron)
- [pg](https://node-postgres.com/)
- [cronstrue](https://github.com/bradymholt/cRonstrue)
- TypeScript

## ✅ TODO / Idées d'amélioration

- Ajout de logs persistants
- Ajout d'un serveur HTTP de monitoring (ex : /health)
- Reload dynamique des fichiers jobs/
- Validation JSON des configs

## 📝 Licence

MIT – Fait avec ❤️ par [MaxVzl](https://github.com/MaxVzl)
