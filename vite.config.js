import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
 
  // server: {
  //   host:"172.30.9.66",
  //   port:"3197",
  //
  //   proxy:{
  //     "/api":{
  //       target:"http://172.30.9.66:3197",
  //       changeOrigin: true
  //     }
  //   }
  // },
})