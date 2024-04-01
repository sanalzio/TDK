const axios = require('axios');
const { Fore } = require('./colorama.js');

function log(res) {
    if (res.data.error) {
        console.log(Fore.Red+res.data.error+Fore.Reset);
        process.exit(1);
    }
    const wordj = res.data[0];
    let json = new Object();
    let anlams = new Array();
    for (let ai = 0; ai < wordj.anlamlarListe.length; ai++) {
        const anlamj = wordj.anlamlarListe[ai];
        anlams.push(anlamj.orneklerListe?[anlamj.anlam, anlamj.orneklerListe[0].ornek]:anlamj.anlam);
    }
    json.anlamlar=anlams;


    if (wordj.atasozu) {
        let atas = new Array();
        for (let ai = 0; ai < wordj.atasozu.length; ai++) {
            const ataj = wordj.atasozu[ai];
            atas.push(ataj.madde);
        }
        json.atasozu=atas;
    }


    if (wordj.birlesikler) {
        json.birlesikler=wordj.birlesikler.split(", ");
    }


    const sonucj = json;



    console.log("");

    for (let ai = 0; ai < sonucj.anlamlar.length; ai++) {
        const anlam = sonucj.anlamlar[ai];
        console.log((typeof anlam == 'object'?Fore.Blue+"  Anlam "+(ai+1)+Fore.Reset+": \n    "+anlam[0]+Fore.Cyan+"\n    Örnek"+Fore.Reset+": \n      "+anlam[1]:Fore.Blue+"  Anlam "+(ai+1)+Fore.Reset+": \n    "+anlam)+"\n");
    }


    if (sonucj.atasozu) {
        console.log(Fore.Blue+"  Atasözleri"+Fore.Reset+":");
        for (let ai = 0; ai < sonucj.atasozu.length; ai++) {
            console.log("    "+sonucj.atasozu[ai]);
        }
        console.log("");
    }


    if (sonucj.birlesikler) {
        console.log(Fore.Blue+"  Birleşik kelimeler"+Fore.Reset+":");
        for (let ai = 0; ai < sonucj.birlesikler.length; ai++) {
            console.log("    "+sonucj.birlesikler[ai]);
        }
        console.log("");
    }


    process.exit(0);
}

if (process.argv[2]) {
    axios.get(`https://sozluk.gov.tr/gts?ara=${process.argv.slice(2).join(' ')}`)
        .then(response => {
            log(response);
        });
} else{
    const readline = require('node:readline');

    const cons = readline.Interface({
        input: process.stdin,
        output: process.stdout
    });

    cons.question('Kelime anlamı ara: ', (input) => {
        axios.get(`https://sozluk.gov.tr/gts?ara=${input}`)
            .then(response => {
                log(response);
            });
    });
}
