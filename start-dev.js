#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeModules(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

function checkPackageJson(dir) {
  const packageJsonPath = path.join(dir, 'package.json');
  return fs.existsSync(packageJsonPath);
}

async function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    log(`📦 Installation des dépendances pour ${name}...`, 'yellow');
    
    const install = spawn('npm', ['install'], { 
      cwd: dir, 
      stdio: 'inherit',
      shell: true 
    });

    install.on('close', (code) => {
      if (code === 0) {
        log(`✅ Dépendances installées pour ${name}`, 'green');
        resolve();
      } else {
        log(`❌ Erreur lors de l'installation des dépendances pour ${name}`, 'red');
        reject(new Error(`Installation failed for ${name}`));
      }
    });
  });
}

async function startService(command, args, cwd, name, color) {
  return new Promise((resolve, reject) => {
    log(`🚀 Démarrage de ${name}...`, color);
    
    const service = spawn(command, args, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });

    service.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${name} démarré avec succès`, 'green');
        resolve();
      } else {
        log(`❌ Erreur lors du démarrage de ${name}`, 'red');
        reject(new Error(`${name} failed to start`));
      }
    });

    // Résoudre immédiatement pour les services qui tournent indéfiniment
    setTimeout(() => resolve(), 3000);
  });
}

async function main() {
  log('🎮 FanVerse - Démarrage du monorepo', 'bright');
  log('=====================================', 'cyan');

  const services = [
    { name: 'Frontend', dir: './frontend', hasPackageJson: true },
    { name: 'Backend', dir: './backend', hasPackageJson: true },
    { name: 'Contracts', dir: './fanverse-contract', hasPackageJson: true }
  ];

  // Vérification des services
  log('\n🔍 Vérification des services...', 'blue');
  for (const service of services) {
    if (!checkPackageJson(service.dir)) {
      log(`❌ ${service.name}: package.json manquant`, 'red');
      continue;
    }

    if (!checkNodeModules(service.dir)) {
      log(`⚠️  ${service.name}: node_modules manquant`, 'yellow');
      try {
        await installDependencies(service.dir, service.name);
      } catch (error) {
        log(`❌ Impossible d'installer les dépendances pour ${service.name}`, 'red');
        continue;
      }
    } else {
      log(`✅ ${service.name}: Prêt`, 'green');
    }
  }

  // Démarrage des services
  log('\n🚀 Démarrage des services...', 'blue');
  
  try {
    // Démarrage en parallèle avec concurrently
    const concurrentlyArgs = [
      '"npm run dev:backend"',
      '"npm run dev:frontend"'
    ];

    const concurrently = spawn('npx', [
      'concurrently',
      '--prefix', '[{name}]',
      '--names', 'Backend,Frontend',
      '--prefix-colors', 'red,blue',
      ...concurrentlyArgs
    ], { 
      stdio: 'inherit',
      shell: true 
    });

    concurrently.on('close', (code) => {
      if (code !== 0) {
        log('❌ Erreur lors du démarrage des services', 'red');
        process.exit(1);
      }
    });

    // Gestion des signaux pour arrêter proprement
    process.on('SIGINT', () => {
      log('\n🛑 Arrêt des services...', 'yellow');
      concurrently.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  log(`❌ Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

main().catch((error) => {
  log(`❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
}); 