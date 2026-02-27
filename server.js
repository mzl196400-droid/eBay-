const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 你的防盗密钥
const MY_SECRET_API_KEY = "ebay_super_secret_key_888";

// 1. 完整的条款库 (不要动)
const policyDB = {
    en: { hPay:"Payment", hShip:"Shipping", hRet:"Returns", hCon:"Contact Us", hFeed:"Feedback", bPay:"1. We only accept eBay payments.<br>All payments must be made within 3 days after auction won.", bShip:"1. eBay Payments Confirmed Addresses Only.<br>Tracking Number will be provided.<br>Domestic shipping: 3-5 days. International: 10-15 working days.", bRet:"Item may be returned for refund or replacement within 30 days of the purchase date. Returned merchandise must be unused. Shipping costs are non-refundable.", bCon:"If you have Any Questions, please Email us firstly.<br>1.Item can't work.<br>2.Item broken.<br>3.Wrong item.<br>We reply within 24 hours.", bFeed:"Positive Feedback is very important to us. Please contact us before you Leave Negative feedback.", hRel:"You may also like" },
    de: { hPay:"Zahlung", hShip:"Versand", hRet:"Rückgabe", hCon:"Kontakt", hFeed:"Bewertung", bPay:"1. Wir akzeptieren nur eBay-Zahlungen.<br>Die Zahlung muss innerhalb von 3 Tagen nach Auktionsende erfolgen.", bShip:"1. Nur bestätigte eBay-Adressen.<br>Sendungsnummer wird bereitgestellt.<br>Inlandsversand: 3-5 Tage. International: 10-15 Werktage.", bRet:"Rückgabe innerhalb von 30 Tagen möglich. Ware muss unbenutzt und originalverpackt sein. Versandkosten nicht erstattungsfähig.", bCon:"Bei Fragen bitte zuerst E-Mail senden.<br>1. Artikel defekt.<br>2. Transportschaden.<br>3. Falscher Artikel.<br>Wir antworten binnen 24 Std.", bFeed:"Positive Bewertung ist uns wichtig. Bitte kontaktieren Sie uns, bevor Sie eine negative Bewertung abgeben.", hRel:"Das könnte Ihnen auch gefallen" },
    fr: { hPay:"Paiement", hShip:"Livraison", hRet:"Retours", hCon:"Contact", hFeed:"Évaluation", bPay:"1. Nous acceptons uniquement les paiements eBay.<br>Le paiement doit être effectué sous 3 jours.", bShip:"1. Adresses eBay confirmées uniquement.<br>Numéro de suivi fourni.<br>Livraison nationale : 3-5 jours. International : 10-15 jours ouvrables.", bRet:"Retour possible sous 30 jours. L'article doit être inutilisé. Frais de port non remboursables.", bCon:"Si vous avez des questions, contactez-nous d'abord.<br>1. Article défectueux.<br>2. Cassé.<br>3. Mauvais article.<br>Réponse sous 24h.", bFeed:"Votre évaluation positive est importante. Veuillez nous contacter avant de laisser un avis négatif.", hRel:"Vous aimerez peut-être aussi" },
    "fr-CA": { hPay:"Paiement", hShip:"Expédition", hRet:"Retours", hCon:"Contactez-nous", hFeed:"Rétroaction", bPay:"1. Nous acceptons uniquement les paiements eBay.<br>Le paiement doit être effectué dans les 3 jours suivant la fin de l'enchère.", bShip:"1. Adresses confirmées eBay uniquement.<br>Numéro de suivi fourni.<br>Expédition intérieure : 3-5 jours. International : 10-15 jours ouvrables.", bRet:"L'article peut être retourné pour remboursement ou remplacement dans les 30 jours. La marchandise retournée doit être inutilisée. Frais d'expédition non remboursables.", bCon:"Si vous avez des questions, veuillez nous envoyer un courriel d'abord.<br>1. L'article ne fonctionne pas.<br>2. Article brisé.<br>3. Mauvais article.<br>Nous répondons dans les 24 heures.", bFeed:"Votre rétroaction positive est très importante pour nous. Veuillez nous contacter avant de laisser une rétroaction négative.", hRel:"Vous aimerez peut-être aussi" },
    es: { hPay:"Pago", hShip:"Envío", hRet:"Devoluciones", hCon:"Contacto", hFeed:"Voto", bPay:"1. Solo aceptamos pagos de eBay.<br>El pago debe realizarse dentro de los 3 días posteriores a la subasta.", bShip:"1. Solo direcciones confirmadas de eBay.<br>Número de seguimiento proporcionado.<br>Envío nacional: 3-5 días. Internacional: 10-15 días laborables.", bRet:"Devolución posible dentro de 30 días. El artículo debe estar sin usar. Gastos de envío no reembolsables.", bCon:"Si tiene preguntas, envíenos un correo primero.<br>1. Artículo defectuoso.<br>2. Roto.<br>3. Artículo incorrecto.<br>Respondemos en 24h.", bFeed:"El voto positivo es importante. Contáctenos antes de dejar un voto negativo.", hRel:"También te puede interesar" },
    it: { hPay:"Pagamento", hShip:"Spedizione", hRet:"Resi", hCon:"Contatti", hFeed:"Feedback", bPay:"1. Accettiamo solo pagamenti eBay.<br>Il pagamento deve essere effettuato entro 3 giorni.", bShip:"1. Solo indirizzi eBay confermati.<br>Numero di tracciamento fornito.<br>Spedizione nazionale: 3-5 giorni. Internazionale: 10-15 giorni lavorativi.", bRet:"Reso possibile entro 30 giorni. L'articolo deve essere inutilizzato. Spese di spedizione non rimborsabili.", bCon:"Per domande, inviaci prima un'email.<br>1. Articolo difettoso.<br>2. Rotto.<br>3. Articolo sbagliato.<br>Rispondiamo entro 24 ore.", bFeed:"Il feedback positivo è importante. Contattaci prima di lasciare un feedback negativo.", hRel:"Potrebbe piacerti anche" },
    zh: { hPay:"支付", hShip:"运输", hRet:"退货", hCon:"联系我们", hFeed:"反馈", bPay:"1. 我们仅接受eBay支付。<br>请在竞拍结束后3天内付款。", bShip:"1. 仅限eBay确认地址。<br>提供追踪号码。<br>国内运输：3-5天。国际运输：10-15个工作日。", bRet:"30天内可退货退款或更换。商品必须未使用且包装原好。运费不退。", bCon:"如有任何问题，请先发邮件联系。<br>1. 产品无法工作。<br>2. 破损。<br>3. 发错货。<br>我们将在24小时内回复。", bFeed:"好评对我们要非常重要。在留下差评前请务必联系我们解决。", hRel:"猜你喜欢" }
};

// 2. 完整的风格库 (18个全部都在)
const themes = {
    // 标准
    tech: { group:'std', color:"#0064d2", bg:"#f0f6fc", font:"Roboto, sans-serif" },
    fashion: { group:'std', color:"#b76e79", bg:"#ffffff", font:"'Playfair Display', serif" },
    auto: { group:'std', color:"#d63031", bg:"#fff5f5", font:"'Segoe UI', Verdana, sans-serif" },
    home: { group:'std', color:"#27ae60", bg:"#f1f8e9", font:"'Open Sans', sans-serif" },
    industrial: { group:'std', color:"#333", bg:"#eee", font:"Arial Black, sans-serif" },
    weapon: { group:'std', color:"#4b5320", bg:"#f0f2eb", font:"Arial, Helvetica, sans-serif" },
    auto_parts: { group:'std', color: "#d32f2f", bg: "#121212", font: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    
    // 特殊
    retro: { group:'hol', color:"#5d4037", bg:"#f5f1e8", font:"'Courier New', monospace" },
    adult_pro: { group:'hol', color:"#9c27b0", bg:"#f3e5f5", font:"'Montserrat', sans-serif" },
    xmas_pro: { group:'hol', color: "#2e7d32", bg: "#f1f8e9", font: "'Segoe UI', sans-serif" },
    steam: { group:'hol', color: "#2c3e50", bg: "#f9f9f9", font: "Arial, sans-serif" },
    men_power: { group:'hol', color: "#b71c1c", bg: "#f5f5f5", font: "Arial, Helvetica, sans-serif" },
    cute_pet: { group:'hol', color: "#ff99cc", bg: "#f8f8f8", font: "'Comic Sans MS', cursive, sans-serif" },
    halloween: { group:'hol', color:"#ff6600", bg:"#1a0524", font:"'Verdana', sans-serif" },
    scifi: { group:'hol', color: "#00f2ff", bg: "#05080f", font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    blackfriday: { group:'hol', color:"#000", bg:"#ffff00", font:"Arial Black, sans-serif" },
    valentine: { group:'hol', color:"#e91e63", bg:"#fff0f6", font:"'Comic Sans MS', cursive" },
    july4: { group:'hol', color:"#34495e", bg:"#fff", font:"Impact, sans-serif" }
};

app.post('/api/generate', (req, res) => {
    // 验证密钥
    const clientKey = req.headers['x-api-key'];
    if (clientKey !== MY_SECRET_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, descHTML, imgs, listLang, curTheme, includeRelated } = req.body;
    
    const cfg = themes[curTheme] || themes['tech'];
    const pol = policyDB[listLang] || policyDB['en'];

    // 轮播图 HTML
    let inputs="", slides="", thumbs="", css="";
    if (imgs && imgs.length > 0) {
        imgs.forEach((u, i) => {
            let id = i + 1;
            inputs += `<input type="radio" name="pic" id="p${id}" ${id===1?'checked':''} class="h-r">`;
            slides += `<div class="sld" id="s${id}"><img src="${u}"></div>`;
            thumbs += `<label for="p${id}" class="th" style="background-image:url('${u}')"></label>`;
            css += `#p${id}:checked~.stg #s${id}{opacity:1;z-index:2}#p${id}:checked~.ths label[for="p${id}"]{border-color:${cfg.color};opacity:1;${curTheme==='cute_pet'?'box-shadow:0 0 0 2px #ffcc66;':''}}`;
        });
    }

    // 样式判断
    const isDark = (curTheme === 'blackfriday' || curTheme === 'halloween' || curTheme === 'scifi' || curTheme === 'auto_parts');
    const textColor = isDark ? '#eee' : '#333';
    const bgColor = isDark ? '#121212' : '#fff';
    const policyBg = isDark ? '#1a1a1a' : '#f9f9f9';
    const policyTxt = isDark ? '#ccc' : '#555';
    const policyTitleColor = isDark ? '#fff' : cfg.color;
    
    let bgStyle = `background:${cfg.bg}`;
    if(curTheme === 'adult_pro') {
        bgStyle = `background-image: radial-gradient(circle at 10% 20%, rgba(225, 190, 231, 0.1) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(186, 104, 200, 0.1) 0%, transparent 20%); background-color: #fff;`;
    }

    let extraCSS = "", preContent = "", postContent = "";
    
    // 注入特殊风格 CSS
    if(curTheme === 'auto_parts') {
        bgStyle = `background-color: #151515; color: #ccc;`;
        extraCSS = `
            .con { border: 1px solid #333; border-top: 5px solid #d32f2f; background: #1a1a1a; box-shadow: 0 10px 30px #000; }
            .tit-box { background: transparent; padding: 30px 20px; border-bottom: none; box-shadow: none; position: relative; }
            .tit { font-size: 1.8rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; text-align:center;}
            .tit-box::after { content: ''; display: block; width: 60px; height: 4px; background: #d32f2f; margin: 15px auto 0; }
            .stg, .th { border: 1px solid #444; background: #121212; }
            .th:hover { border-color: #d32f2f; }
            .desc { border-top: none; padding: 20px; }
            .tabs { margin-top:30px; border-top: 5px solid #d32f2f; background: #000; }
            .tab { border-bottom: 1px solid #222; }
            .thd { background: #111 !important; color: #fff !important; font-weight: bold; text-transform: uppercase; padding: 16px 20px; font-size:1.15rem; transition: 0.3s; border-left:5px solid #000; }
            .thd:hover { background: #222 !important; color: #d32f2f !important; }
            .tb { background: #1a1a1a; color: #ccc; border-top: none; }
            .tc:checked~.thd { background: #d32f2f !important; color: #fff !important; border-left: 5px solid #8b0000; }
            .hazard-bar { height: 10px; width: 100%; background: repeating-linear-gradient(45deg, #111, #111 10px, #b71c1c 10px, #b71c1c 20px); margin-bottom: 0; }
        `;
    } else if(curTheme === 'xmas_pro') {
        bgStyle = `background-color: #f9f9f9; background-image: radial-gradient(#e8f5e9 1px, transparent 1px); background-size: 20px 20px; position:relative; overflow-x:hidden;`;
        extraCSS = `
            @keyframes snow { 0% {background-position: 0 0, 0 0;} 100% {background-position: 500px 1000px, 400px 400px;} }
            .snow-overlay { position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:99; background-image: radial-gradient(white 2px, transparent 2px), radial-gradient(white 1px, transparent 1px); background-size: 50px 50px; animation: snow 10s linear infinite; opacity: 0.6; }
        `;
        preContent = '<div class="snow-overlay"></div>';
    } else if(curTheme === 'steam') {
         bgStyle = `background-color: #f9f9f9; color: #2c3e50;`;
         extraCSS = `
            .pipe-decoration { height: 5px; background: linear-gradient(to right, #bdc3c7, #95a5a6, #bdc3c7); margin: 20px 0; position: relative; }
            .pipe-decoration::before, .pipe-decoration::after { content: ""; position: absolute; width: 15px; height: 15px; background-color: #95a5a6; border-radius: 50%; top: -5px; }
            .pipe-decoration::before { left: 0; } .pipe-decoration::after { right: 0; }
            .con { border: 2px solid #7f8c8d; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); background: rgba(236, 240, 241, 0.9); }
            .tit-box::before, .tit-box::after { content: "⚙️"; position: absolute; top: 50%; transform: translateY(-50%); font-size:24px; }
            .tit-box::before { left: 20px; } .tit-box::after { right: 20px; }
            .th { border: 2px solid #95a5a6; background: #000; background-size: contain; background-repeat: no-repeat; background-position: center; }
         `;
         preContent = '<div class="pipe-decoration"></div>';
    } else if(curTheme === 'cute_pet') {
         bgStyle = `background-color: #f8f8f8; font-family: 'Comic Sans MS', sans-serif;`;
         extraCSS = `
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .paw-decoration { display: flex; justify-content: center; gap: 15px; margin: 20px 0; }
            .paw { font-size: 24px; color: #ff99cc; animation: bounce 1.5s infinite; }
            .paw:nth-child(2) { animation-delay: 0.2s; color: #66ccff; } .paw:nth-child(3) { animation-delay: 0.4s; color: #ffcc66; }
            .con { border-radius: 15px; border: 2px solid #e6e6e6; }
            .tit-box { background: #fff; border-bottom: 3px dashed #66ccff; border-radius: 15px 15px 0 0; }
            .th { border-radius: 8px; }
         `;
         postContent = '<div class="paw-decoration"><div class="paw">🐾</div><div class="paw">🐾</div><div class="paw">🐾</div></div>';
    } else if(curTheme === 'halloween') {
        bgStyle = `background-color: #1a0524; background-image: radial-gradient(circle at 50% 0, #360a45 0%, transparent 70%); color: #f0f0f0;`;
        extraCSS = `
            .con { border: 2px solid #ff6600; box-shadow: 0 0 20px rgba(255, 102, 0, 0.2); background: rgba(20, 10, 30, 0.95); border-radius: 10px; }
            .tit-box { background: linear-gradient(135deg, #ff6600 0%, #cc0000 100%); border-bottom: 4px solid #6600cc; clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%); padding-bottom: 30px; position: relative; }
            .tit-box::before { content: '🦇'; position: absolute; left: 15px; top: 15px; font-size: 24px; animation: float 3s ease-in-out infinite; }
            .tit-box::after { content: '🦇'; position: absolute; right: 15px; top: 15px; font-size: 24px; animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .stg, .th { border: 1px solid #ff6600; background-color: #000; background-size: contain; background-repeat: no-repeat; background-position: center; }
            .th:hover { border-color: #9900ff; box-shadow: 0 0 8px #9900ff; }
            .desc { border-left: 3px solid #ff6600; background: rgba(255, 102, 0, 0.05); }
            .thd { color: #ff6600 !important; font-family: 'Verdana', sans-serif; letter-spacing: 1px; }
            .thd:hover { background: #2a1035 !important; }
        `;
    } else if(curTheme === 'scifi') {
        bgStyle = `background-color: #05080f; background-image: linear-gradient(rgba(0,243,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.05) 1px, transparent 1px); background-size: 30px 30px; color: #e0e0e0; font-family: 'Arial Narrow', sans-serif;`;
        extraCSS = `
            .con { border: 1px solid #00f2ff; box-shadow: 0 0 15px rgba(0,242,255,0.15); background: rgba(11,12,21,0.9); }
            .tit-box { background: linear-gradient(to right, rgba(0,242,255,0.1), rgba(189,0,255,0.1)); border-bottom: 2px solid #00f2ff; color: #fff; position: relative; overflow: hidden; clip-path: polygon(0 0, 100% 0, 100% 85%, 98% 100%, 2% 100%, 0 85%); }
            .tit { letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px #00f2ff; }
            .tit-box::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0,242,255,0.4), transparent); animation: scan 4s linear infinite; }
            @keyframes scan { 0% {left:-100%} 100% {left:200%} }
            .stg, .th { border: 1px solid #00f2ff; background-color: #000; box-shadow: 0 0 5px rgba(0,242,255,0.3); background-size: contain; background-repeat: no-repeat; background-position: center; }
            .th:hover { box-shadow: 0 0 10px #bd00ff; border-color: #bd00ff; }
            .desc { border-left: 3px solid #bd00ff; background: rgba(0,242,255,0.02); }
            .warning-box { border: 1px solid #00ff9d; background: rgba(0,255,157,0.1); color: #00ff9d; padding: 10px; }
        `;
    }

    // 政策栏
    const polsHTML = `
<div class="tabs">
    <div class="tab"><input type="checkbox" id="t1" class="tc"><label for="t1" class="thd">${pol.hPay}</label><div class="tb">${pol.bPay}</div></div>
    <div class="tab"><input type="checkbox" id="t2" class="tc"><label for="t2" class="thd">${pol.hShip}</label><div class="tb">${pol.bShip}</div></div>
    <div class="tab"><input type="checkbox" id="t3" class="tc"><label for="t3" class="thd">${pol.hRet}</label><div class="tb">${pol.bRet}</div></div>
    <div class="tab"><input type="checkbox" id="t4" class="tc"><label for="t4" class="thd">${pol.hCon}</label><div class="tb">${pol.bCon}</div></div>
    <div class="tab"><input type="checkbox" id="t5" class="tc"><label for="t5" class="thd">${pol.hFeed}</label><div class="tb">${pol.bFeed}</div></div>
</div>`;

    // 关联商品容器
    let relatedHTML = "";
    if (includeRelated) {
        relatedHTML = `
        <div style="margin-top:30px; border-top:2px solid #eee; padding-top:20px;">
            <div style="font-weight:bold; font-size:1.2rem; color:${cfg.color}; margin-bottom:15px; text-align:center;">${pol.hRel || "You may also like"}</div>
            <div class="rel-content" style="min-height: 150px; background:#f9f9f9; text-align:center; color:#999; padding:20px;">
                <!-- Paste your ERP related items widget code here -->
            </div>
        </div>`;
    }

    // 完整的 HTML 模板字符串
    const tpl = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');
body{margin:0;padding:0;font-family:${cfg.font};background:${cfg.bg};color:${textColor}}
.con{max-width:1000px;margin:0 auto;background:${bgColor};box-shadow:0 0 20px rgba(0,0,0,0.05);overflow:hidden;position:relative}
${curTheme==='men_power'?'.con{background:#fff; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.2);}':''}
${curTheme==='cute_pet'?'.con{border-radius:15px; border:2px solid #e6e6e6; box-shadow:0 10px 25px rgba(255,153,204,0.15);}':''}

img{max-width:100%;display:block}
.tit-box{background:${cfg.color};color:#fff;padding:20px;text-align:center;position:relative}
${curTheme==='adult_pro'?'.tit-box{background:transparent;color:#4a148c;padding:30px 20px;}.tit-box:after{content:"✦ ✦ ✦";display:block;margin-top:10px;color:#e1bee7;letter-spacing:5px;}':''}
${curTheme==='xmas_pro'?'.tit-box{background:linear-gradient(to right, #2e7d32, #1b5e20);box-shadow:0 6px 15px rgba(46,125,50,0.2);}.tit-box:before{content:"❄";position:absolute;top:10px;left:15px;font-size:22px;opacity:0.7;}.tit-box:after{content:"❄";position:absolute;bottom:10px;right:15px;font-size:22px;opacity:0.7;}':''}
${curTheme==='men_power'?'.tit-box{background:linear-gradient(135deg, #0d0d1a, #1a1a2e); border-bottom:4px solid #b71c1c; box-shadow:0 5px 15px rgba(0,0,0,0.3);}':''}
${curTheme==='cute_pet'?'.tit-box{background:#fff; color:#ff99cc; border-bottom:3px dashed #66ccff;}':''}

.tit{font-size:1.6rem;font-weight:bold;margin:0;line-height:1.3;font-family:${curTheme==='adult_pro'?"'Playfair Display', serif":'inherit'}}

.gal-w{width:100%;background:#fff} 
${curTheme==='auto_parts'?'.gal-w{background:#121212;}':''}
.gal-c{width:100%;max-width:700px;margin:0 auto}

.stg{width:100%;position:relative;background:#fff;padding-bottom:100%;height:0;overflow:hidden;border-bottom:1px solid #eee;margin-bottom:15px}
${curTheme==='adult_pro'?'.stg{border:none;box-shadow:0 10px 30px rgba(156,39,176,0.15);border-radius:12px;margin:20px 0;}':''}
${curTheme==='xmas_pro'?'.stg{border:3px solid #f5f5f5;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.1);}':''}
${curTheme==='men_power'?'.stg{border:1px solid #333; box-shadow:0 5px 15px rgba(0,0,0,0.15);}':''}
${curTheme==='cute_pet'?'.stg{border-radius:15px;}':''}

.sld{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s;background:#fff}
${isDark?'.sld{background:#000;}':''}
.sld img{max-width:100%;max-height:100%;object-fit:contain}
.ths{display:flex;gap:10px;overflow-x:auto;padding:0 15px 15px;justify-content:center;scrollbar-width:none}
${curTheme==='steam'?'.ths{justify-content:flex-start;}':''}

.th{flex:0 0 auto;width:70px;height:70px;border:2px solid #eee;background-size:cover;cursor:pointer;border-radius:4px;transition:0.2s}
.th:hover{transform:translateY(-3px)}
.h-r {display:none;}
${css}

.desc{padding:30px;line-height:1.7;font-size:1rem;color:${textColor};border-top:5px solid ${cfg.color}}
${curTheme==='adult_pro'?'.desc{border-top:none;background:#fff;} .desc div[style*="border-bottom"]{margin-top:30px;}':''}
${curTheme==='xmas_pro'?'.desc{background:#fff;border-radius:12px;margin:15px;box-shadow:0 5px 15px rgba(0,0,0,0.05);border-top:none;}':''}
${curTheme==='steam'?'.desc{background:rgba(255,255,255,0.8);border-left:5px solid #e74c3c;border-top:none;margin-bottom:25px;box-shadow:3px 3px 10px rgba(0,0,0,0.1);}':''}

.tabs{border-top:1px solid #eee;background:${isDark?'#000':'#fdfdfd'};margin-top:30px}
.tab{border-bottom:1px solid #eee}
.tc{display:none}
.thd{display:block;padding:16px 20px;font-weight:bold;font-size:1.15rem;color:${policyTitleColor};cursor:pointer;background:${bgColor};position:relative;transition:0.2s}
${curTheme==='adult_pro'?'.thd{color:#6a1b9a;}':''}
.thd:hover{background:${isDark?'#222':'#f9f9f9'}}
.thd::after{content:'+';position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:1.5rem}
.tb{max-height:0;overflow:hidden;transition:max-height .3s;background:${policyBg};padding:0 20px;color:${policyTxt};font-size:1.05rem;line-height:1.6}
.tc:checked~.tb{max-height:1000px;padding:20px;border-top:1px solid #eee}
.tc:checked~.thd::after{content:'-'}

@media(min-width:768px){
    .ebay-app{padding:20px 0;background-color:${curTheme==='adult_pro'?'#f9f5fa':'#f5f7fa'}}
    .con{border-radius:8px}
    .gal-w{padding-top:20px}
    .stg{border:1px solid #eee;border-radius:4px}
    ${curTheme==='adult_pro'?'.stg{border:none}':''}
    ${curTheme==='xmas_pro'?'.stg{border:3px solid #f5f5f5}':''}
    ${curTheme==='steam'?'.stg{border:3px solid #95a5a6}':''}
    .ths { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; }
}
${extraCSS}
</style></head><body style="${bgStyle}">
<div class="ebay-app">
    <div class="con">
        ${preContent}
        <div class="tit-box"><h1 class="tit">${title}</h1></div>
        <div class="gal-w"><div class="gal-c">${inputs}<div class="stg">${slides}</div><div class="ths">${thumbs}</div></div></div>
        ${curTheme==='steam'?'<div class="pipe-decoration"></div>':''}
        <div class="desc">${descHTML}</div>
        ${curTheme==='auto_parts'?'<div class="hazard-bar"></div>':''}
        ${polsHTML}
        ${relatedHTML}
    </div>
</div>
</body></html>`;

    // 4. 将生成的 HTML 发送回插件
    res.json({ html: tpl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});