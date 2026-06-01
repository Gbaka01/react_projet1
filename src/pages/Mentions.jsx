export default function Mentions() {
  return (
    <section className="container py-5">
      
      <div
        className="p-4 rounded shadow"
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "white",
        }}
      >
        <h1 className="mb-4 text-center">Mentions légales</h1>

        <p>
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la confiance en l&apos;économie numérique, il est précisé aux
          utilisateurs du site{" "}
          <strong>Réseau social GOLI Goré Gbaka</strong> l&apos;identité des
          différents intervenants dans le cadre de sa réalisation et de son
          suivi.
        </p>

        <h2 className="h4 mt-4">Édition du site</h2>

        <p>
          Le présent site, accessible à l&apos;URL{" "}
          <a
            href="https://www.reseaugbaka.fr"
            target="_blank"
            rel="noreferrer"
            className="text-info"
          >
            https://www.reseaugbaka.fr
          </a>{" "}
          (le « Site »), est édité par :
        </p>

        <p>
          <strong>Goré GOLI</strong>, résidant 16 rue de Chatillon,
          91260 Juvisy-sur-Orge, de nationalité française,
          né le 28/04/1980.
        </p>

        <h2 className="h4 mt-4">Hébergement</h2>

        <p>
          Le Site est hébergé par la société <strong>OVH SAS</strong>,
          située 2 rue Kellermann - BP 80157 - 59053 Roubaix Cedex 1,
          téléphone : 1007.
        </p>

        <h2 className="h4 mt-4">Directeur de publication</h2>

        <p>
          Le Directeur de la publication du Site est Goré GOLI.
        </p>

        <h2 className="h4 mt-4">Nous contacter</h2>

        <p>
          Par téléphone :{" "}
          <a href="tel:+33760292363" className="text-info">
            +33 7 60 29 23 63
          </a>

          <br />

          Par email :{" "}
          <a
            href="mailto:gore.goli@gmail.com"
            className="text-info"
          >
            gore.goli@gmail.com
          </a>

          <br />

          Par courrier : 16 rue de Chatillon,
          91260 Juvisy-sur-Orge
        </p>

        <p className="mt-4 fst-italic text-light">
          Génération des mentions légales par Legalstart.
        </p>
      </div>
    </section>
  );
}