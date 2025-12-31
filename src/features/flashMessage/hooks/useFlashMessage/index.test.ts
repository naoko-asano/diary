import { renderHook } from "@testing-library/react";

import { ActionResultStatuses } from "@/features/actionResult/model";

import { showFlashMessage } from "../../ui/showFlashMessage";

import { useFlashMessage } from ".";

vi.mock("@/features/flashMessage/ui/showFlashMessage");
const mockedShowFlashMessage = vi.mocked(showFlashMessage);

describe("useFlashMessage", () => {
  it("actionResult.statusがsuccessの場合、showFlashMessageは呼び出される", () => {
    renderHook(() =>
      useFlashMessage({
        status: ActionResultStatuses.SUCCESS,
        message: "Success message",
      }),
    );
    expect(mockedShowFlashMessage).toHaveBeenCalledWith({
      type: ActionResultStatuses.SUCCESS,
      message: "Success message",
    });
  });

  it("actionResult.statusがerrorの場合、showFlashMessageは呼び出される", () => {
    renderHook(() =>
      useFlashMessage({
        status: ActionResultStatuses.ERROR,
        message: "Error message",
      }),
    );
    expect(mockedShowFlashMessage).toHaveBeenCalledWith({
      type: ActionResultStatuses.ERROR,
      message: "Error message",
    });
  });

  it("actionResult.statusがidleの場合、showFlashMessageは呼び出されない", () => {
    renderHook(() =>
      useFlashMessage({
        status: ActionResultStatuses.IDLE,
      }),
    );
    expect(mockedShowFlashMessage).not.toHaveBeenCalled();
  });

  it("actionResult.messageがない場合、showFlashMessageは呼び出されない", () => {
    renderHook(() =>
      useFlashMessage({
        status: ActionResultStatuses.SUCCESS,
      }),
    );
    expect(mockedShowFlashMessage).not.toHaveBeenCalled();
  });
});
