const fs = require('fs');
const path = 'tools/eslint-report.json';
const raw = fs.readFileSync(path,'utf8');
const data = JSON.parse(raw);
let errors=0,warnings=0;const files=[];
for(const f of data){
  errors+=f.errorCount||0; warnings+=f.warningCount||0;
  if((f.errorCount||0)||(f.warningCount||0)){
    files.push({file:f.filePath, errors:f.errorCount, warnings:f.warningCount, messages:f.messages.map(m=>({ruleId:m.ruleId,message:m.message,line:m.line,column:m.column}))});
  }
}
console.log(JSON.stringify({errors,warnings,problems:errors+warnings,files},null,2));
