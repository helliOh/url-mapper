const axios = require('axios')
const cheerio = require('cheerio');

const getHtml = async (root) => {
    try {
      return await axios.get(root);
    } catch (error) {
      console.error(error);
    }
};

exports.Init = async (root) =>{
    console.log(`   Init     ${root}...`);
    return new Promise((resolve, reject) =>{
        getHtml(root).then(HTML =>{
            try{
                const $ = cheerio.load(HTML.data);
                let links = [];
            
                $('a').each((index, DOM) =>{
                    const link = $(DOM).attr('href');
                    links.push(link);
                });
            
                links = Array.from(new Set(links));
                /* Remove none link a tags*/
                links = links.filter(link => !!link && link.indexOf('/') == 0);
                /* Attach root domain to link */
                links = links.map((link) => {
                    if(link == '/') return root;
                    else return root + link
                });

                resolve(links);
            }
            catch(e){
                reject(e);
            }
        })
    })
}

exports.Collect = async (from, root) =>{
    return new Promise((resolve, reject) =>{
        from = encodeURI(from);
        console.log(`Collecting    ${decodeURI(from)}...`)
        
        getHtml(from).then(HTML =>{
            try{
                const $ = cheerio.load(HTML.data);
                let links = [];
            
                $('a').each((index, DOM) =>{
                    const link = $(DOM).attr('href');
                    links.push(link);
                });
            
                links = Array.from(new Set(links));
                /* Remove none link a tags*/
                links = links.filter(link => !!link && link.indexOf('/') == 0);
                /* Attach root domain to link */
                links = links.map((link) => {
                    if(link == from) return from;
                    else return root + link
                });

                resolve(links);
            }
            catch(e){
                reject(e);
            }
        })
    })
}