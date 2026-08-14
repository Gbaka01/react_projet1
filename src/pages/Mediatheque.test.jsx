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
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Mediatheque from "./Mediatheque";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Composant Mediatheque", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    localStorage.setItem("token", "token-test");
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  test("affiche le titre de la médiathèque", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "image-1",
          nom: "https://example.com/image.webp",
          alt: "Mon dessin",
          createdAt: "2026-08-14T10:00:00.000Z",
          author: {
            nom: "Gbaka",
            prenom: "Goli",
          },
        },
      ],
    });

    render(
      <MemoryRouter>
        <Mediatheque />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Chargement des images...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /médiathèque/i,
        })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Mon dessin")
    ).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/image/all"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer token-test",
        },
        signal: expect.any(AbortSignal),
      })
    );
  });
});