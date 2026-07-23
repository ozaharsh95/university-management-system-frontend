import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL, USER_ROLES } from "@/constants";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}auth`, // The base URL of your auth server -> example -> BACKEND_BASE_URL="http://localhost:8000/api/"

  user: {
    additionalFields: {
      role: {
        type: USER_ROLES,
        required: true,
        defaultValue: "student",
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
