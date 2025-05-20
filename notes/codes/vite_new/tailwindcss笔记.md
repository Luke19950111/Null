- tailwindcss
    - 安装 pnpm add -D @tailwindcss/postcss tailwindcss postcss autoprefixer
    - postcss.config.js
        ```
        export default {
          plugins: {
            '@tailwindcss/postcss': {}, // tailwindcss作为Postcss插件，现在独立为一个包
            autoprefixer: {},
            'postcss-px-to-viewport-8-plugin': {}
          }
        }
        ```
    - tailwind.config.js
        ```
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html",
            "./src/**/*.{vue,js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {},
          },
          plugins: [],
        } 
        ```
    - main.css
        ```
        @import './base.css';
        @import "tailwindcss/preflight"; //css重置
        @tailwind utilities;

        /* 自定义样式 */
        @layer components {
          .my-center {
            @apply flex justify-center items-center;
          }
        }
        ```