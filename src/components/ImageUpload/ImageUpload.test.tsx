import { fireEvent, render, waitFor } from "@testing-library/react";
import { isBase64UrlImage } from "src/utils/helpers/isBase64UrlImage";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import ImageUpload from "./ImageUpload";

export const testImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=";

vi.mock("src/utils/helpers/isBase64UrlImage");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("ImageUpload", () => {
  const mockProps = {
    setImage: vi.fn(),
    image: testImage,
  };

  const { container, rerender, getByTestId } = render(
    <ImageUpload {...mockProps} />
  );

  test("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  test("should match snapshot when image is set", () => {
    rerender(<ImageUpload {...mockProps} />);
    expect(container).toMatchSnapshot("image");
  });

  test("should call setImage when image is set", async () => {
    (isBase64UrlImage as Mock).mockResolvedValueOnce(true);

    rerender(<ImageUpload {...mockProps} />);

    const file = new File([testImage], "test.png", { type: "image/png" });
    const input = getByTestId("image-upload-input");

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => expect(mockProps.setImage).toBeCalled());
  });

  test("should not call setImage when image is not set", async () => {
    (isBase64UrlImage as Mock).mockResolvedValueOnce(false);
    global.alert = vi.fn();

    rerender(<ImageUpload {...mockProps} />);

    const file = new File([testImage], "test.png", { type: "image/png" });
    const input = getByTestId("image-upload-input");

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => expect(mockProps.setImage).not.toBeCalled());
    await waitFor(() => expect(global.alert).toBeCalled());
  });
});
