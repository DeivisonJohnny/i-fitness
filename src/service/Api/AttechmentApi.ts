import Api from ".";

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

    return newAttachment as Attachment;
  }
}
