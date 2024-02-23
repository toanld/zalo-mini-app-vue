const config = {
  ENV: import.meta.env.MODE,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  ACCESS_TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  MINIAPP_ID: import.meta.env.APP_ID,
  PAGING_LIMIT: 12
}

export default config
