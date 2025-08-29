import Api from ".";
import { queryClient } from "../QueryClient";

export type Attachment = {
  id?: string;
  filename?: string;
  url?: string;
  typeName?: string;
};
export type AttachmentModel =
  | "order"
  | "project"
  | "expense"
  | "withdrawPartner"
  | "plan"
  | "form"
  | "user"
  | "linkUtils";

export type CreateOrUpdateAttachment = {
  modelId: string;
  typeName?: string;
  verboseLog?: string;
  model: string;
  file: File;
};

function updateQueryCache(
  modelId: string,
  model: string,
  attachment: Attachment
) {
  let modelKey = "";
  switch (model) {
    case "order":
      modelKey = "orders";
      break;
    case "project":
      modelKey = "projects";
      break;
    case "expense":
      modelKey = "expenses";
      break;
    case "withdrawPartner":
      modelKey = "withdraws-partner";
      break;
    case "user":
      modelKey = "users";
      break;
  }

  const queryKey = [modelKey, modelId];
  const data = queryClient.getQueryData<{ attachments?: Attachment[] }>(
    queryKey
  );
  if (data) {
    queryClient.setQueryData(queryKey, data);
  }
}

export default class AttachmentApi {
  static async create(attachment: CreateOrUpdateAttachment) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(attachment)) {
      if (value != null) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, value);
        }
      }
    }
    const newAttachment = await Api.post<Attachment>("attachments", formData);

    updateQueryCache(
      attachment.modelId,
      attachment.model,
      newAttachment as Attachment
    );

    return newAttachment as Attachment;
  }
}
