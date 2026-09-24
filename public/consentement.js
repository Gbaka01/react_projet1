/*!
 * Bandeau de consentement aux cookies — reseaugbaka.fr (Réseau Gbaka)
 * Compatible avec un site généré en JavaScript : les contenus et scripts ajoutés
 * après le chargement de la page sont aussi soumis au consentement.
 * Autonome : aucun fichier CSS ni bibliothèque à ajouter.
 *
 * Intégration :
 *   <script src="/consentement.js" defer></script>   (avant </body>, sur chaque page)
 *
 * Scripts soumis au consentement :
 *   <script type="text/plain" data-consent="audience" data-src="https://..."></script>
 *   <script type="text/plain" data-consent="audience"> ...code... </script>
 *
 * Contenus tiers (vidéos, cartes) :
 *   <iframe data-consent="tiers" data-src="https://..." title="..."></iframe>
 *
 * Dans React : window.RGConsentement.choix(), .ouvrir(), .autoriser("tiers")
 *   et l'événement document « rgc:choix ».
 *
 * Lien « Gérer mes cookies » (pied de page) :
 *   <a href="#" data-rgc-ouvrir>Gérer mes cookies</a>
 */
(function () {
  "use strict";
 
  /* ------------------------------------------------------------------ */
  /* Réglages                                                            */
  /* ------------------------------------------------------------------ */
  var CONFIG = {
    cle: "rg-consentement",
    version: 1,              // incrémenter pour redemander le consentement à tous
    dureeJours: 182,         // 6 mois, durée recommandée par la CNIL
    lienPolitique: "/mentions#cookies",
    categories: [
      {
        id: "essentiels",
        titre: "Essentiels",
        texte: "Nécessaires au fonctionnement du site, comme la mémorisation de vos choix. Toujours actifs.",
        obligatoire: true
      },
      {
        id: "audience",
        titre: "Mesure d’audience",
        texte: "Statistiques de fréquentation, pour savoir quels projets et quelles pages sont les plus consultés.",
        cookies: ["_ga", "_gid", "_pk_", "_hj"] // préfixes supprimés en cas de retrait
      },
      {
        id: "tiers",
        titre: "Contenus tiers",
        texte: "Vidéos et cartes intégrées depuis d’autres sites. Ces services peuvent déposer leurs propres cookies."
      }
    ]
  };
 
  /* ------------------------------------------------------------------ */
  /* Styles                                                              */
  /* ------------------------------------------------------------------ */
  var CSS = [
    ".rgc-bandeau,.rgc-voile,.rgc-substitut{--rgc-papier:#fff;--rgc-encre:#14161a;--rgc-gris:#565b66;--rgc-trait:#dfe2e8;",
    "--rgc-bleu:#2447d6;--rgc-bleu-fonce:#1a36a8;--rgc-estompe:#f1f3f8;",
    "--rgc-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace;",
    "font-family:inherit;color:var(--rgc-encre);box-sizing:border-box}",
    ".rgc-bandeau *,.rgc-voile *{box-sizing:inherit}",
    ".rgc-bandeau[hidden],.rgc-voile[hidden]{display:none!important}",
 
    /* Bandeau : carte en bas à droite, étiquette en police de code */
    ".rgc-bandeau{position:fixed;right:1.25rem;bottom:calc(1.25rem + env(safe-area-inset-bottom,0px));z-index:9998;",
    "width:min(27rem,calc(100% - 2.5rem));background:var(--rgc-papier);border:1px solid var(--rgc-trait);border-radius:8px;",
    "padding:1.3rem 1.4rem 1.2rem;box-shadow:0 12px 32px rgba(20,22,26,.14);animation:rgc-pose .4s cubic-bezier(.2,.8,.2,1)}",
    "@keyframes rgc-pose{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}",
    ".rgc-interieur{display:flex;flex-direction:column;gap:1rem}",
    ".rgc-texte{margin:0;font-size:.93rem;line-height:1.6}",
    ".rgc-texte strong{display:block;margin-bottom:.4rem;font-family:var(--rgc-mono);font-size:.8rem;font-weight:500;color:var(--rgc-bleu)}",
    ".rgc-bandeau a,.rgc-voile a{color:var(--rgc-bleu);text-underline-offset:3px}",
    ".rgc-actions{display:flex;flex-wrap:wrap;gap:.5rem}",
    ".rgc-bandeau .rgc-actions .rgc-btn{flex:1 1 auto}",
 
    /* Boutons : « Tout refuser » et « Tout accepter » ont le même poids visuel */
    ".rgc-btn{font:inherit;font-size:.9rem;font-weight:600;line-height:1.2;min-height:44px;padding:.7rem 1rem;cursor:pointer;",
    "border:1px solid var(--rgc-bleu);border-radius:6px;background:var(--rgc-bleu);color:#fff}",
    ".rgc-btn:hover{background:var(--rgc-bleu-fonce);border-color:var(--rgc-bleu-fonce)}",
    ".rgc-btn--leger{background:transparent;color:var(--rgc-bleu)}",
    ".rgc-btn--leger:hover{background:var(--rgc-estompe);color:var(--rgc-bleu-fonce)}",
    ".rgc-bandeau [data-rgc='personnaliser']{order:3;flex-basis:100%}",
    ".rgc-btn:focus-visible,.rgc-bandeau a:focus-visible,.rgc-voile a:focus-visible,.rgc-fermer:focus-visible,",
    ".rgc-interrupteur input:focus-visible+.rgc-piste{outline:2px solid var(--rgc-bleu);outline-offset:3px}",
 
    /* Panneau de préférences */
    ".rgc-voile{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;",
    "padding:1rem;background:rgba(20,22,26,.5)}",
    ".rgc-panneau{position:relative;width:100%;max-width:34rem;max-height:calc(100% - 2rem);overflow:auto;",
    "background:var(--rgc-papier);border-radius:8px;padding:2rem 2rem 1.6rem}",
    ".rgc-panneau h2{margin:0 2.5rem .6rem 0;font-size:1.4rem;font-weight:700;line-height:1.3}",
    ".rgc-panneau>p{margin:0 0 1.2rem;font-size:.95rem;line-height:1.6;color:var(--rgc-gris)}",
    ".rgc-fermer{position:absolute;top:1rem;right:1rem;width:44px;height:44px;border:0;background:none;",
    "font-size:1.6rem;line-height:1;color:var(--rgc-encre);cursor:pointer;border-radius:6px}",
    ".rgc-categorie{display:grid;grid-template-columns:1fr auto;gap:.25rem 1.5rem;align-items:center;",
    "padding:1rem 0;border-top:1px solid var(--rgc-trait)}",
    ".rgc-categorie:last-of-type{border-bottom:1px solid var(--rgc-trait)}",
    ".rgc-categorie h3{margin:0;font-size:1rem;font-weight:600}",
    ".rgc-categorie p{grid-column:1;margin:0;font-size:.88rem;line-height:1.55;color:var(--rgc-gris)}",
    ".rgc-categorie .rgc-interrupteur,.rgc-categorie .rgc-toujours{grid-column:2;grid-row:1/span 2}",
    ".rgc-toujours{font-family:var(--rgc-mono);font-size:.8rem;color:var(--rgc-gris)}",
 
    /* Interrupteur */
    ".rgc-interrupteur{position:relative;display:inline-block;cursor:pointer}",
    ".rgc-interrupteur input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}",
    ".rgc-piste{display:block;width:46px;height:26px;border:2px solid var(--rgc-gris);border-radius:13px;",
    "background:var(--rgc-papier);transition:background .2s,border-color .2s}",
    ".rgc-piste::after{content:'';position:absolute;top:5px;left:5px;width:16px;height:16px;border-radius:50%;",
    "background:var(--rgc-gris);transition:transform .2s,background .2s}",
    ".rgc-interrupteur input:checked+.rgc-piste{background:var(--rgc-bleu);border-color:var(--rgc-bleu)}",
    ".rgc-interrupteur input:checked+.rgc-piste::after{transform:translateX(20px);background:#fff}",
    ".rgc-panneau .rgc-actions{margin-top:1.4rem;justify-content:flex-end}",
 
    /* Remplaçant des contenus tiers bloqués */
    ".rgc-substitut{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:.8rem;",
    "padding:1.5rem;min-height:12rem;border:1px solid var(--rgc-trait);border-radius:8px;background:var(--rgc-estompe);",
    "font-size:.92rem;line-height:1.55}",
    ".rgc-substitut p{margin:0;max-width:48ch}",
 
    "@media (max-width:640px){.rgc-bandeau{left:.75rem;right:.75rem;width:auto;bottom:calc(.75rem + env(safe-area-inset-bottom,0px))}",
    ".rgc-panneau .rgc-actions .rgc-btn{flex:1 1 auto}.rgc-panneau{padding:1.6rem 1.25rem 1.25rem}}",
    "@media (prefers-reduced-motion:reduce){.rgc-bandeau{animation:none}",
    ".rgc-piste,.rgc-piste::after{transition:none}}"
  ].join("");
 
  /* ------------------------------------------------------------------ */
  /* Stockage du choix                                                   */
  /* ------------------------------------------------------------------ */
  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CONFIG.cle));
      if (!v || v.version !== CONFIG.version) return null;
      if (Date.now() - v.date > CONFIG.dureeJours * 864e5) return null;
      return v.choix;
    } catch (e) {
      return null;
    }
  }
 
  function ecrire(choix) {
    try {
      localStorage.setItem(CONFIG.cle, JSON.stringify({ version: CONFIG.version, date: Date.now(), choix: choix }));
    } catch (e) { /* stockage indisponible : le bandeau réapparaîtra */ }
  }
 
  function choixComplet(valeur) {
    var c = {};
    CONFIG.categories.forEach(function (cat) { c[cat.id] = cat.obligatoire ? true : valeur; });
    return c;
  }
 
  function supprimerCookies(prefixes) {
    var hotes = [location.hostname, "." + location.hostname.replace(/^www\./, "")];
    document.cookie.split(";").forEach(function (c) {
      var nom = c.split("=")[0].trim();
      if (!prefixes.some(function (p) { return nom.indexOf(p) === 0; })) return;
      var expire = nom + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = expire;
      hotes.forEach(function (h) { document.cookie = expire + "; domain=" + h; });
    });
  }
 
  /* ------------------------------------------------------------------ */
  /* Activation des scripts et contenus autorisés                        */
  /* ------------------------------------------------------------------ */
  function activer(choix) {
    var scripts = document.querySelectorAll('script[type="text/plain"][data-consent]');
    Array.prototype.forEach.call(scripts, function (ancien) {
      if (!choix[ancien.getAttribute("data-consent")] || ancien.hasAttribute("data-rgc-actif")) return;
      var s = document.createElement("script");
      Array.prototype.forEach.call(ancien.attributes, function (a) {
        if (["type", "data-consent", "data-src"].indexOf(a.name) === -1) s.setAttribute(a.name, a.value);
      });
      if (ancien.getAttribute("data-src")) s.src = ancien.getAttribute("data-src");
      else s.text = ancien.text;
      ancien.setAttribute("data-rgc-actif", "");
      ancien.parentNode.insertBefore(s, ancien.nextSibling);
    });
 
    var cadres = document.querySelectorAll("iframe[data-consent][data-src]");
    Array.prototype.forEach.call(cadres, function (cadre) {
      var autorise = !!choix[cadre.getAttribute("data-consent")];
      var substitut = cadre.previousElementSibling;
      var aSubstitut = substitut && substitut.classList.contains("rgc-substitut");
      if (autorise) {
        if (aSubstitut) substitut.remove();
        cadre.hidden = false;
        if (!cadre.src) cadre.src = cadre.getAttribute("data-src");
      } else if (!aSubstitut) {
        cadre.hidden = true;
        var bloc = document.createElement("div");
        bloc.className = "rgc-substitut";
        bloc.innerHTML =
          "<p>Ce contenu est hébergé par un autre site, qui peut déposer des cookies. " +
          "Il s’affichera si vous autorisez les contenus tiers.</p>" +
          '<button type="button" class="rgc-btn">Autoriser et afficher</button>';
        bloc.querySelector("button").addEventListener("click", function () {
          var c = lire() || choixComplet(false);
          c.tiers = true;
          enregistrer(c);
        });
        cadre.parentNode.insertBefore(bloc, cadre);
      }
    });
  }
 
  /* ------------------------------------------------------------------ */
  /* Interface                                                           */
  /* ------------------------------------------------------------------ */
  var bandeau, voile, derniereCible;
 
  function construire() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
 
    bandeau = document.createElement("div");
    bandeau.className = "rgc-bandeau";
    bandeau.setAttribute("role", "region");
    bandeau.setAttribute("aria-label", "Consentement aux cookies");
    bandeau.hidden = true;
    bandeau.innerHTML =
      '<div class="rgc-interieur">' +
      '<p class="rgc-texte"><strong><span aria-hidden="true">// </span>cookies</strong>Avec votre accord, ce site mesure sa fréquentation ' +
      "et affiche des contenus venant d’autres sites. Si vous refusez, vous pouvez toujours consulter mon parcours et mes projets. " +
      '<a href="' + CONFIG.lienPolitique + '">En savoir plus</a></p>' +
      '<div class="rgc-actions">' +
      '<button type="button" class="rgc-btn" data-rgc="refuser">Tout refuser</button>' +
      '<button type="button" class="rgc-btn rgc-btn--leger" data-rgc="personnaliser">Personnaliser</button>' +
      '<button type="button" class="rgc-btn" data-rgc="accepter">Tout accepter</button>' +
      "</div></div>";
 
    var lignes = CONFIG.categories.map(function (cat) {
      var commande = cat.obligatoire
        ? '<span class="rgc-toujours">Toujours actifs</span>'
        : '<label class="rgc-interrupteur"><input type="checkbox" role="switch" data-cat="' + cat.id +
          '" aria-labelledby="rgc-cat-' + cat.id + '" aria-describedby="rgc-desc-' + cat.id + '">' +
          '<span class="rgc-piste" aria-hidden="true"></span></label>';
      return '<div class="rgc-categorie"><h3 id="rgc-cat-' + cat.id + '">' + cat.titre + "</h3>" + commande +
        '<p id="rgc-desc-' + cat.id + '">' + cat.texte + "</p></div>";
    }).join("");
 
    voile = document.createElement("div");
    voile.className = "rgc-voile";
    voile.hidden = true;
    voile.innerHTML =
      '<div class="rgc-panneau" role="dialog" aria-modal="true" aria-labelledby="rgc-titre">' +
      '<button type="button" class="rgc-fermer" data-rgc="fermer" aria-label="Fermer">×</button>' +
      '<h2 id="rgc-titre">Préférences de cookies</h2>' +
      "<p>Choisissez les services que vous autorisez. Vous pourrez modifier ce choix à tout moment " +
      "depuis le lien « Gérer mes cookies » en bas de page.</p>" +
      lignes +
      '<div class="rgc-actions">' +
      '<button type="button" class="rgc-btn rgc-btn--leger" data-rgc="refuser">Tout refuser</button>' +
      '<button type="button" class="rgc-btn rgc-btn--leger" data-rgc="accepter">Tout accepter</button>' +
      '<button type="button" class="rgc-btn" data-rgc="enregistrer">Enregistrer mes choix</button>' +
      "</div></div>";
 
    document.body.appendChild(bandeau);
    document.body.appendChild(voile);
 
    [bandeau, voile].forEach(function (el) {
      el.addEventListener("click", function (e) {
        var b = e.target.closest("[data-rgc]");
        if (!b) {
          if (e.target === voile) fermerPanneau();
          return;
        }
        var action = b.getAttribute("data-rgc");
        if (action === "accepter") enregistrer(choixComplet(true));
        else if (action === "refuser") enregistrer(choixComplet(false));
        else if (action === "personnaliser") ouvrirPanneau();
        else if (action === "fermer") fermerPanneau();
        else if (action === "enregistrer") {
          var c = choixComplet(false);
          voile.querySelectorAll("input[data-cat]").forEach(function (i) { c[i.getAttribute("data-cat")] = i.checked; });
          enregistrer(c);
        }
      });
    });
 
    voile.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { fermerPanneau(); return; }
      if (e.key !== "Tab") return;
      var f = voile.querySelectorAll("button, a[href], input");
      var premier = f[0], dernier = f[f.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });
 
    document.addEventListener("click", function (e) {
      var lien = e.target.closest("[data-rgc-ouvrir]");
      if (lien) { e.preventDefault(); ouvrirPanneau(); }
    });
  }
 
  function ouvrirPanneau() {
    derniereCible = document.activeElement;
    var c = lire() || choixComplet(false);
    voile.querySelectorAll("input[data-cat]").forEach(function (i) { i.checked = !!c[i.getAttribute("data-cat")]; });
    voile.hidden = false;
    voile.querySelector("h2").setAttribute("tabindex", "-1");
    voile.querySelector("h2").focus();
  }
 
  function fermerPanneau() {
    voile.hidden = true;
    if (!lire()) { bandeau.hidden = false; bandeau.querySelector("[data-rgc='personnaliser']").focus(); }
    else if (derniereCible && derniereCible.focus) derniereCible.focus();
  }
 
  function enregistrer(nouveau) {
    var ancien = lire();
    ecrire(nouveau);
    voile.hidden = true;
    bandeau.hidden = true;
    document.dispatchEvent(new CustomEvent("rgc:choix", { detail: nouveau }));
 
    // Retrait d'un consentement : on efface les cookies concernés et on recharge
    // pour arrêter les scripts déjà lancés.
    var retrait = false;
    if (ancien) {
      CONFIG.categories.forEach(function (cat) {
        if (ancien[cat.id] && !nouveau[cat.id]) {
          retrait = true;
          if (cat.cookies) supprimerCookies(cat.cookies);
        }
      });
    }
    if (retrait) { location.reload(); return; }
    activer(nouveau);
    if (derniereCible && derniereCible.focus && document.contains(derniereCible)) derniereCible.focus();
  }
 
  /* ------------------------------------------------------------------ */
  /* Démarrage                                                           */
  /* ------------------------------------------------------------------ */
  function demarrer() {
    construire();
    var choix = lire();
    if (choix) activer(choix);
    else { activer(choixComplet(false)); bandeau.hidden = false; }
 
    // Le site affiche ses pages en JavaScript : on surveille les vidéos et
    // scripts ajoutés plus tard pour leur appliquer le choix du visiteur.
    if ("MutationObserver" in window) {
      var attente = null;
      new MutationObserver(function (mutations) {
        var pertinent = mutations.some(function (m) {
          return Array.prototype.some.call(m.addedNodes, function (n) {
            return n.nodeType === 1 && !n.closest(".rgc-bandeau,.rgc-voile,.rgc-substitut") &&
              (n.matches("[data-consent]") || n.querySelector("[data-consent]"));
          });
        });
        if (!pertinent || attente) return;
        attente = setTimeout(function () { attente = null; activer(lire() || choixComplet(false)); }, 50);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
 
  window.RGConsentement = {
    ouvrir: function () { ouvrirPanneau(); },
    choix: function () { return lire(); },
    // Autorise une catégorie (ex. "tiers") depuis l'application React
    autoriser: function (categorie) {
      var c = lire() || choixComplet(false);
      c[categorie] = true;
      enregistrer(c);
    }
  };
 
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
 