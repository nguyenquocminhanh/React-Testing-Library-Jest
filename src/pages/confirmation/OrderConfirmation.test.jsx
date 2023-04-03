import { rest } from "msw";
import { server } from "../../mocks/server";
import OrderConfirmation from "./OrderConfirmation";
import { render, screen } from "../../test-utils/testing-library-utils";

test("error response from server for submitting order", async () => {
  // gia lap msw khac, override msw for new response
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  // await because response from server above
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occured. Please try again later."
  );
});
