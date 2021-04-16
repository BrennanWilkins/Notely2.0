const baseURL = module.exports.baseURL = process.env.NODE_ENV === 'production' ?
'https://notely-app.herokuapp.com' :
'http://localhost:3000';

const logo = (
  `<svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 512 512" x="0" y="0">
    <defs id="_WQ2A4cYe3fyjAnqdW86Q3">
      <linearGradient id="g__eg9218d50_5" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop id="_eg9218d50_629" offset="0%" style="stop-color: rgb(105, 137, 252); stop-opacity: 1;"></stop>
        <stop id="_eg9218d50_630" offset="100%" style="stop-color: rgb(105, 137, 252); stop-opacity: 0.59;"></stop>
      </linearGradient>
    </defs>
    <path id="_6dOlRZ9pT_u4sZqhV-Qxm" d="M256,104V88a243.65939,243.65939,0,0,1,32,2.11835V88a40.04521,40.04521,0,0,0-40-40H202.42188l12.70263,8.46875A37.82,37.82,0,0,1,232,88V98.18945a7.99976,7.99976,0,0,1-6.90674,7.92481A224.04852,224.04852,0,0,0,32,328V464H43.15576a45.80536,45.80536,0,0,0,38.188-20.437,7.99959,7.99959,0,0,1,13.3125,0A45.80536,45.80536,0,0,0,132.84424,464h10.70508a69.22889,69.22889,0,0,0-38.05957-54.31055L68.42236,391.15527a7.99959,7.99959,0,0,1-3.95605-9.84619l5.021-14.05859A155.908,155.908,0,0,1,216,264a7.99977,7.99977,0,0,1,8,8v6.81885A69.852,69.852,0,0,1,194.37744,336H224a48.05436,48.05436,0,0,0,48-48V256h16v32a63.85007,63.85007,0,0,1-21.73584,48H278a34.03864,34.03864,0,0,0,34-34V272a7.99991,7.99991,0,0,1,10.29883-7.6626,155.092,155.092,0,0,1,105.5376,110.81543l5.89648,23.82031A11.86082,11.86082,0,0,0,445.26709,408,18.75373,18.75373,0,0,0,464,389.26758V376a7.99877,7.99877,0,0,1,2.34326-5.65674A46.32246,46.32246,0,0,0,480,337.37305V328A223.99942,223.99942,0,0,0,256,104ZM456,336a8,8,0,1,1-8,8A8,8,0,0,1,456,336Z" stroke="none" fill="url(#g__eg9218d50_5)"></path>
  </svg>`
);

const getHtml = (htmlStr, title) => (
  `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <link rel="icon" href="${baseURL}/favicon.ico" />
    </head>
    <body>
      <div style="display:flex;align-items:center;padding: 10px;">
        <a style="text-decoration: none;" href="${baseURL}">
          ${logo}
        </a>
        <div style="color:#777777;margin-left:0.5em;font-size:1.2em;">Published with Notely</div>
      </div>
      <div style="padding: 1em">
        ${htmlStr}
      </div>
    </body>
  </html>`
);

module.exports = getHtml;
