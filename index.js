

import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url'
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import wait from 'wait';


dotenv.config();

console.log('APP[INFO] in download theme');


const shop = process.env.SHOP;
const accessToken = process.env.ACCESS_TOKEN;
const themeId = process.env.THEME_ID;

console.log(`https://${shop}/admin/api/2024-04/themes/${themeId}/assets.json`)

// DOWNLOAD THEME FILES
const assetApiReq = await fetch(`https://${shop}/admin/api/2024-04/themes/${themeId}/assets.json`, {
    method: 'GET',
    headers: {
        'X-Shopify-Access-Token': accessToken,
    },
});

// console.log("🚀 ~ assetApiReq:", assetApiReq)

const assetApiRes = await assetApiReq.json();
const folderPath = __dirname.split('/controllers')[0]+`/my-theme`;

for(let i=0; i<assetApiRes.assets.length; i++){
    const asset = assetApiRes.assets[i];

    const assetReq = await fetch(`https://${shop}/admin/api/2024-04/themes/${themeId}/assets.json?asset[key]=${asset.key}`, {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken,
        },
    });
    const assetRes = await assetReq.json();
    console.log("🚀 ~ assetReq:", assetReq)

    let assetFolderPath = assetRes.asset.key.split('/');
    assetFolderPath.pop();
    assetFolderPath = assetFolderPath.join('/');

    // If it doesn't exist, create the directory
    if (!fs.existsSync(folderPath+"/"+assetFolderPath)) {
        fs.mkdirSync(folderPath+"/"+assetFolderPath, { recursive: true });              
    }

        await fs.promises.writeFile(folderPath +`/${assetRes.asset.key}`, assetRes.asset.value);
        if(i% 2 == 0){
            await wait(1000);
        }
    }

    // let themeLiquidFile = await fs.promises.readFile(`${folderPath}/layout/theme.liquid`, 'utf8');

    console.log('APP[INFO] finished download theme');

