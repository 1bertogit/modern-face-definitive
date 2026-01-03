#!/usr/bin/env node
/**
 * Script para solicitar indexação em massa via Google Search Console API
 * Requer: npm install googleapis
 */

import { google } from 'googleapis';
import { readFileSync } from 'fs';

const SITE_URL = 'https://drroberiobrandao.com';
const CREDENTIALS_PATH = './google-credentials.json'; // Baixe do Google Cloud Console

// URLs para indexar
const urlsToIndex = [
  '/pt/eventos/congresso-face-moderna-2025',
  '/pt/eventos',
  '/events',
  // Adicione mais URLs aqui
];

async function indexUrls() {
  try {
    // Carregar credenciais
    const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH));
    
    // Autenticar
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
    
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    
    // Solicitar indexação para cada URL
    for (const url of urlsToIndex) {
      const fullUrl = `${SITE_URL}${url}`;
      console.log(`Solicitando indexação: ${fullUrl}`);
      
      await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: fullUrl,
          siteUrl: SITE_URL,
        },
      });
      
      // Aguardar 1 segundo entre requisições (rate limit)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Todas as URLs foram enviadas para indexação!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

indexUrls();