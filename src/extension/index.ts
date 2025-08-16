import { ExtResp } from "@types"
import { ExternalMessage } from "@types"

export let extensionID = "omhfaemlhfikakkigibnfjcpaibpenha"

export const extensionURL =
  "https://chromewebstore.google.com/detail/roboapply/omhfaemlhfikakkigibnfjcpaibpenha?hl=en"

export async function getResponseFromExtension<T extends ExternalMessage>(
  params: T
): Promise<ExtResp<T["type"]>> {
  const response = await chrome?.runtime?.sendMessage<ExternalMessage>(
    extensionID,
    {
      ...params
    }
  )

  return response
}

export async function isExtensionInstalled(): Promise<boolean> {
  try {
    const res = await chrome?.runtime?.sendMessage<
      ExternalMessage,
      ExtResp<"isExtensionInstalled">
    >(extensionID, {
      type: "isExtensionInstalled"
    })
    if (res?.installed) return true
    return false
  } catch (error) {
    return false
  }
}

export async function activateTab() {
  const res = await chrome?.runtime
    ?.sendMessage<ExternalMessage, ExtResp<"activateTab">>(extensionID, {
      type: "activateTab"
    })
    .catch((err) => console.log({ err }))
}
