const fs = require('fs');

const content = fs.readFileSync('D:/phu/AI App Practice/brazil-mei/generated-detail-page.ts', 'utf-8');

// Fix the table in article 8
const fixedTable = `<table>
<thead>
<tr><th>Beneficio</th><th>Carencia minima</th><th>Observao</th></tr>
</thead>
<tbody>
<tr><td>Aposentadoria por idade</td><td>180 contribuiçııes mensais</td><td>Idade minima de 62 anos (mulher) ou 65 anos (homem)[cite:18][cite:20]</td></tr>
<tr><td>Auxilio por incapacidade temporaria (antigo auxilio-doena)</td><td>12 contribuiçııes mensais</td><td>Sujeito a pericia medica do INSS[cite:18]</td></tr>
<tr><td>Aposentadoria por incapacidade permanente (antiga invalidez)</td><td>12 contribuiçııes mensais, em regra</td><td>Sujeito a pericia medica do INSS[cite:18]</td></tr>
<tr><td>Salario-maternidade</td><td>Sem carencia minima na maioria dos casos</td><td>Regras especificas se aplicam; convem confirmar a situaao individual</td></tr>
<tr><td>Auxilio-reclusao</td><td>Carencia especifica (variavel conforme a regra vigente)</td><td>Destinado a dependentes do segurado recolhido à prisao, sob certas condiçııes</td></tr>
<tr><td>Pensao por morte</td><td>Sem carencia minima na maioria dos casos</td><td>Destinado a dependentes do segurado falecido</td></tr>
</tbody>
</table>`;

const fixed = content.replace(
  /<table>\n<thead>\n<tr><th>Beneficio<\/th><th>Carencia minima<\/th><th>Observao<\/th><\/tr>\n<\/thead>\n<tbody><tr><td>Aposentadoria por idade<\/td><\/tr><\/tbody>\n<\/table> 180 contribuiçııes mensais \| Idade minima de 62 anos \(mulher\) ou 65 anos \(homem\)\[cite:18\]\[cite:20\] \|\n\| Auxilio por incapacidade temporaria \(antigo auxilio-doena\) \| 12 contribuiçııes mensais \| Sujeito a pericia medica do INSS\[cite:18\] \|\n\| Aposentadoria por incapacidade permanente \(antiga invalidez\) \| 12 contribuiçııes mensais, em regra \| Sujeito a pericia medica do INSS\[cite:18\] \|\n\| Salario-maternidade \| Sem carencia minima na maioria dos casos \| Regras especificas se aplicam; convem confirmar a situaao individual \|\n\| Auxilio-reclusao \| Carencia especifica \(variavel conforme a regra vigente\) \| Destinado a dependentes do segurado recolhido à prisao, sob certas condiçııes \|\n\| Pensao por morte \| Sem carencia minima na maioria dos casos \| Destinado a dependentes do segurado falecido \|/s,
  fixedTable
);

fs.writeFileSync('D:/phu/AI App Practice/brazil-mei/generated-detail-page.ts', fixed);
console.log('Fixed table in article 8');