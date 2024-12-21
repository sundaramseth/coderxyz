import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
   proxy:{
    '/api':{
      target:'https://coderxyz.onrender.com',
      secure:false,
    },
   },
  },
  plugins: [react()],
})
