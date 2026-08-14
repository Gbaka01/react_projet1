import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import axios from "axios";
import ListArticles from "./ListArticles";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Composant ListArticles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("affiche le message de chargement", () => {
    // Requête volontairement non terminée
    axios.get.mockReturnValueOnce(new Promise(() => {}));

    render(<ListArticles />);

    expect(
      screen.getByText(/chargement/i)
    ).toBeInTheDocument();
  });

  test("affiche les articles reçus du serveur", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "article-1",
          titre: "Mon premier article",
          contenu: "Contenu de mon premier article.",
          createdAt: "2026-08-14T10:00:00.000Z",
          author: {
            nom: "Gbaka",
            prenom: "Goli",
          },
        },
        {
          _id: "article-2",
          titre: "Mon deuxième article",
          contenu: "Contenu de mon deuxième article.",
          createdAt: "2026-08-13T10:00:00.000Z",
          author: null,
        },
      ],
    });

    render(<ListArticles />);

    expect(
      await screen.findByText("Mon premier article")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Contenu de mon premier article.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mon deuxième article")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Contenu de mon deuxième article.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Gbaka Goli/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Auteur inconnu/i)
    ).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/article/all"),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  test("accepte une réponse contenant la propriété articles", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        articles: [
          {
            _id: "article-3",
            titre: "Article enveloppé",
            contenu: "Réponse contenue dans data.articles.",
          },
        ],
      },
    });

    render(<ListArticles />);

    expect(
      await screen.findByText("Article enveloppé")
    ).toBeInTheDocument();
  });

  test("affiche un message si aucun article n’est trouvé", async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<ListArticles />);

    expect(
      await screen.findByText(/aucun article trouvé/i)
    ).toBeInTheDocument();
  });

  test("affiche une erreur 404 si la route API est introuvable", async () => {
    axios.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          message: "Not Found",
        },
      },
      message: "Request failed with status code 404",
    });

    render(<ListArticles />);

    expect(
      await screen.findByText(/route api introuvable/i)
    ).toBeInTheDocument();
  });

  test("affiche une erreur si le serveur est inaccessible", async () => {
    axios.get.mockRejectedValueOnce({
      message: "Network Error",
    });

    render(<ListArticles />);

    expect(
      await screen.findByText(
        /serveur est inaccessible|cors/i
      )
    ).toBeInTheDocument();
  });

  test("affiche le bouton de retour en haut après un scroll", async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 300,
    });

    window.dispatchEvent(new Event("scroll"));

    render(<ListArticles />);

    window.dispatchEvent(new Event("scroll"));

    expect(
      await screen.findByRole("button", {
        name: /retour en haut/i,
      })
    ).toBeInTheDocument();
  });

  test("le bouton appelle window.scrollTo", async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });

    window.scrollTo = vi.fn();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 300,
    });

    render(<ListArticles />);

    window.dispatchEvent(new Event("scroll"));

    const button = await screen.findByRole("button", {
      name: /retour en haut/i,
    });

    button.click();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});