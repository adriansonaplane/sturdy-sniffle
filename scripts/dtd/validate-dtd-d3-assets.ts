import { DTD_D3_AUTHORED_ASSET_MANIFEST, validateDtdD3Manifest } from '../../src/dungeon/assets/authoredCatacombs.js';
const result=validateDtdD3Manifest(DTD_D3_AUTHORED_ASSET_MANIFEST);
console.log(JSON.stringify({validator:'catacombs.dtd_d3.asset_validator.v1',...result},null,2));
if(!result.ok) process.exit(1);
