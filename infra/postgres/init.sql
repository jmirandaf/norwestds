-- Crea las bases de datos de la aplicación en el primer arranque.
-- Este script solo se ejecuta cuando el volumen de datos está vacío.

SELECT 'CREATE DATABASE norwestds_portal'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'norwestds_portal'
)\gexec

SELECT 'CREATE DATABASE norwestds_designpro'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'norwestds_designpro'
)\gexec
