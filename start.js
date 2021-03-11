const fs = require("fs").promises;

async function start() {

    let path = process.argv[2] || ".";
    console.info(`Directory ${path}`);

    let images = (await fs.readdir(path, {withFileTypes: true}))
    .filter(de => de.isFile())
    .map(de => de.name)
    .sort()
    .map(name => /^[0-9]+ (.*)\.[a-zA-Z]+$/.exec(name))
    .filter(reg => reg)
    .map(reg => ({file: reg[0], title: reg[1]}));

    let code = "";

    function w(str) {
        console.info(str);
        code += str + "\n";
    }

    w("<html>");
    w("<head>");
    w(`<link href="${__dirname}/styles.css" rel="stylesheet">`)
    w("</head>");
    w("<body>");

    let pageStart = () => w(`<div class="page">`);
    let pageEnd = () => w(`</div>`);
    
    let i = 0;
    for (let image of images) {
        if (i % 2 === 0) {
            if (i) {
                pageEnd();
            }
            pageStart();
        }
        w(`  <div class="image"><div class="photo" style="background-image: url('${image.file}')"></div><div class="title">Obr. ${i+1}: ${image.title}</div></div>`)
        i++;
    }
    pageEnd();
    w("</body>")
    w("</html>")

    await fs.writeFile(path + "/index.html", code);
}

start().catch(e => console.error(e));