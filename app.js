const axios = require('axios')
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');

const {Init, Collect} = require('./collector');

const ROOT_DOMAIN = process.argv[2];

let result = {};

async function DFS(link){
    try{
        if(!!result[link]) return;
        
        let links = await Collect(link, ROOT_DOMAIN);
        links = links.filter(l => l != link);

        result[link] = links;

        for(i in links) await DFS(links[i]);
    }
    catch(e){
        // console.log('Failed');
    }
}

async function startProcess(){
    let ROOT = await Init(ROOT_DOMAIN);
    ROOT = ROOT.filter(link => link != ROOT_DOMAIN);
    result[ROOT_DOMAIN] = ROOT;
    
    for(i in ROOT) await DFS(ROOT[i]);

    let availables = new Set();

    for(url in result){
        const subUrls = result[url];
        availables.add(url);

        for(let i=0; i<subUrls.length; i++) availables.add(subUrls[i]);
    }

    availables = Array.from(availables).sort().forEach(i => console.log(i));
}

startProcess();



