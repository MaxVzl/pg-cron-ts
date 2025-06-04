import {CronJob} from "cron";
import cronstrue from 'cronstrue/i18n';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const jobsDir = path.resolve(__dirname, '../jobs');
const files = fs.readdirSync(jobsDir);
const jobJsonFiles = files.filter(f => f.endsWith('.json'));

for (const jobFile of jobJsonFiles) {
  const jsonPath = path.join(jobsDir, jobFile);
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const config = JSON.parse(jsonContent);

  const sqlPath = path.join(jobsDir, config.script);
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  const readable = cronstrue.toString(config.expression, { locale: 'fr' });

  const job = new CronJob(
    config.expression,
    async () => {
      console.log(`Executing job ${config.name} ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
      const client = new Client({
        user: config.pg_user,
        host: config.pg_host,
        database: config.pg_database,
        password: config.pg_password,
        port: Number(config.pg_port),
      });

      try {
        await client.connect();
        await client.query('BEGIN');
        const res = await client.query(sql);
        await client.query('COMMIT');
        console.log(`Job ${config.name} executed successfully:`, res.rowCount);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error executing job ${config.name}:`, err);
      } finally {
        await client.end();
      }
    },
    null,
    true,
    config.timezone
  );

  job.start();
  console.log(`Job ${config.name} started with expression "${config.expression}" (${readable})`);
}
