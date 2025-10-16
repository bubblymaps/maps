# Bubbly Maps

A simple, open-source maps platform designed for mapping water fountains.

<img width="2555" height="1276" alt="image" src="https://github.com/user-attachments/assets/466b487e-2a57-463b-a959-dfa9705a71a4" />

## Features

- 🌍 Explore water fountains near you on an interactive map  
- 📍 Add new fountains with location, accessibility, and notes  
- 🔄 Community-driven updates — anyone can contribute by adding reviews, or updating fountain information
- ⚡ Lightweight, fast, and fully open-source  
- 🔎 Search and filter fountains by location or accessibility  
- 📱 Mobile-friendly interface for on-the-go use  
- 🛠️ Docker-ready setup for easy local development
- 🤳 Mobile android app for ease-of-use
- 💻 APIs for integrating fountain data into your own apps

## Self-hosting

Want to self-host the project for your own location? Just follow the steps below.

### Prerequisites

- Node.js >= 24.1  
- npm >= 11.3  
- Docker  
- Docker Compose
- Git
- [TileserverGL](https://github.com/linuskangsoftware/tileservergl)
- PostgreSQL
- MinIO instance

```bash
git clone https://github.com/bubblymaps/maps
cd maps
npm i

cp .env.example .env # change to your values

npm run dev
```

Access your Bubbly Maps instance at ``http://localhost:3000``

For more information regarding how to use Bubbly Maps, please refer to our [documentation](https://docs.bubblymaps.org)

## Credits

Bubbly Maps is a project by [Linus Kang](https://lkang.au) and is licensed under [CC BY-NC 4.0](LICENSE). 

**You may:**

- **Share** — copy and redistribute the material in any medium or format  
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — you must give appropriate credit to Linus Kang, provide a link to the license, and indicate if changes were made  
- **NonCommercial** — you may not use the material for commercial purposes  
- **No additional restrictions** — you may not apply legal terms or technological measures that legally restrict others from doing anything the license permits
