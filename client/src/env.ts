const VITE_MOCK_CUSTOMER_ID: number | undefined = import.meta.env[
  "VITE_MOCK_CUSTOMER_ID"
];

if (!VITE_MOCK_CUSTOMER_ID) {
  throw new Error(
    'Unable to find enviroment variable: "VITE_MOCK_CUSTOMER_ID"'
  );
}

const VITE_API_URL: string | undefined = import.meta.env["VITE_API_URL"];

if (!VITE_API_URL) {
  throw new Error('Unable to find enviroment variable: "VITE_API_URL"');
}

export const env = {
  VITE_MOCK_CUSTOMER_ID,
  VITE_API_URL,
};
