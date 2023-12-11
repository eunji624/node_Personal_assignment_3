# node_Personal_assignment_2

내일배움캠프 Node.js 심화주차 개인과제 입니다.

### 배포 주소

http://mallish.store/api/auth/login

### 환경변수 셋팅

- PORT
- SECRET_KEY
- KAKAO_ID
- KAKAO_CALLBACK_URL
- DATABASE_URL
- SESSION_SECRET_KEY
- REDIS_HOST
- REDIS_PASSWORD
- REDIS_PORT

### API 명세서 URL

- https://docs.google.com/spreadsheets/d/1ujCVNFIhgsDy3UfyvX24Keni2-DMAPjIksdsO53khlA/edit#gid=0

### ERD URL

-

### 폴더구조

```
📦prisma
 ┗ 📜schema.prisma
 📦src
 ┣ 📂controllers
 ┃ ┣ 📜products.controller.js
 ┃ ┗ 📜users.controller.js
 ┣ 📂middlewares
 ┃ ┣ 📜ErrorHandler.js
 ┃ ┣ 📜JoiValidation.js
 ┃ ┣ 📜auth.js
 ┃ ┗ 📜otherValidation.js
 ┣ 📂passport
 ┃ ┣ 📜index.js
 ┃ ┣ 📜kakaoStrategy.js
 ┃ ┗ 📜localStrategy.js
 ┣ 📂repositories
 ┃ ┣ 📜products.repository.js
 ┃ ┗ 📜users.repository.js
 ┣ 📂routers
 ┃ ┣ 📜index.js
 ┃ ┣ 📜product.router.js
 ┃ ┗ 📜users.router.js
 ┣ 📂services
 ┃ ┣ 📜products.service.js
 ┃ ┗ 📜users.service.js
 ┣ 📂utils
 ┃ ┗ 📂prisma
 ┃ ┃ ┗ 📜index.js
 ┣ 📂views
 ┃ ┣ 📜login.ejs
 ┃ ┣ 📜main.ejs
 ┃ ┗ 📜userInfo.ejs
 ┗ 📜app.js
```

### 기술스텍

<div>
<img src="https://img.shields.io/badge/보일내용-배경색상?style=for-the-badge&logo=제공하는이름&logoColor=내용색상">

<img src="https://img.shields.io/badge/javaScript-F7DF1E?style=for-the-badge&logo=javaScript&logoColor=black">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">

<img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=for-the-badge&logo=Amazon RDS&logoColor=white">

<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white">

<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">

<img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=Passport&logoColor=black">

<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=black">

<img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white">
</div>
