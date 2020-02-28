const axios = require('axios')
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const spawn = require('child_process').spawn

const {Init, Collect} = require('./collector');

const ROOT_DOMAIN = 'target-url';
const MMDC_PATH = 'my mmdc path';

let result = {};

async function DFS(link){
    if(!!result[link]) return;
    
    let links = await Collect(link, ROOT_DOMAIN);
    links = links.filter(l => l != link);

    result[link] = links;

    for(i in links) await DFS(links[i]);
}

async function diagramize(input, output){
    console.log(`Converting ${input} -- > ${output}`);

    return new Promise(async (resolve, reject) =>{
        /* windows version */
        let cmd = spawn('cmd', [MMDC_PATH, '-i', input, '-o', output], { stdio: 'inherit'});

        cmd.on('error', e => {
            console.log(`Failed`);
            // console.log(e);
            reject();
        });

        cmd.on('close', code => {
            if(code == 0) console.log(`Success`);
            resolve();
        });
    })
}

async function startProcess(){
    let ROOT = await Init(ROOT_DOMAIN);
    ROOT = ROOT.filter(link => link != ROOT_DOMAIN);
    result[ROOT_DOMAIN] = ROOT;
    
    for(i in ROOT) await DFS(ROOT[i]);

    if(!fs.existsSync("mermaids")){
        fs.mkdirSync("mermaids", 0766, function(err){
            if(err){
                console.log(err);
                response.send("ERROR! Can't make the directory! \n");
            }
        });
    }

    if(!fs.existsSync("diagrams")){
        fs.mkdirSync("diagrams", 0766, function(err){
            if(err){
                console.log(err);
                response.send("ERROR! Can't make the directory! \n");
            }
        });
    }

    let cnt = 1;
    let failed = 0;

    const prefix = 'graph LR'

    for(i in result){
        let from = i;
        let to = result[i];
        let index = cnt;
        if(to.length < 1) continue;

        to = to.map(v => `\t${from} --> ${v}\r\n`).reduce((a, c) => a + c).replace(/[\(\)]/g, 'B').replace(/ /g, 'W');

        fs.writeFileSync(`./mermaids/output${cnt++}.mmd`, prefix + '\r\n' + to, (err) => {
            return console.log(`(failed : ${failed})Failed to save output${cnt}.mmd!`);
        });
    }
    console.log(`---------- Saving Mermaids ----------`);
    console.log(` Success      ${cnt - failed} files`);
    console.log(`  Failed      ${failed} files`);

    let list = fs.readdirSync('mermaids');

    for(i in list){
        try{
            await diagramize(`mermaids/output${Number(i)+1}.mmd`, `diagrams/output${Number(i)+1}.png`);
        }
        catch(e){
            continue;
        }
    }
}

startProcess();



