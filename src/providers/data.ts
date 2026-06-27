import { Subject } from "@/types";
import {
  DataProvider,
  GetListParams,
  GetListResponse,
  BaseRecord,
} from "@refinedev/core";

const MOCK_SUBJETCS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description:
      "An introductory course covering the fundamental concepts of computer science and programming.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "CS201",
    name: "Data Structures and Algorithms",
    department: "CS",
    description:
      "Covers essential data structures, algorithm design techniques, and complexity analysis.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "CS301",
    name: "Database Management Systems",
    department: "CS",
    description:
      "Introduces relational databases, SQL, normalization, and database design principles.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    code: "CS401",
    name: "Operating Systems",
    department: "CS",
    description:
      "Explores process management, memory management, file systems, and concurrency concepts.",
    createdAt: new Date().toISOString(),
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    return {
      data: MOCK_SUBJETCS as unknown as TData[],
      total: MOCK_SUBJETCS.length,
    };
  },

  getOne: async () => {
    throw new Error("This function is not present in mock");
  },

  create: async () => {
    throw new Error("This function is not present in mock");
  },

  update: async () => {
    throw new Error("This function is not present in mock");
  },

  deleteOne: async () => {
    throw new Error("This function is not present in mock");
  },

  getApiUrl: () => "mock",
};
