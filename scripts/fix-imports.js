const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixImports(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                fixImports(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.match(/import\s+prisma\s+from\s+['"]@\/lib\/prisma['"]/)) {
                console.log('Fixing:', fullPath);
                const newContent = content.replace(
                    /import\s+prisma\s+from\s+(['"]@\/lib\/prisma['"])/g,
                    'import { prisma } from $1'
                );
                fs.writeFileSync(fullPath, newContent);
            }
        }
    }
}

fixImports(path.join(__dirname, '..', 'src', 'app'));
fixImports(path.join(__dirname, '..', 'src', 'lib'));
fixImports(path.join(__dirname, '..', 'app'));
fixImports(path.join(__dirname, '..', 'prisma'));
fixImports(path.join(__dirname, '..', 'lab-upload'));
