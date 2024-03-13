# TodoappClient

This project is Joshua Mckenna's Todo App onboarding project

### File Structure Explained
I devised a design structure that feels organized and logical, as I wasn't sure of the typical structure. Therefore, I developed one and decided to document it for others who may examine my project, ensuring understanding. I conducted research to gather ideas on how Angular projects are typically organized. I found various designs, but they were mostly similar and so I took all the similar and shared attributes and implemented them in away that made sense for this project.

Starting with components, I decided to organize all the Components/Pages in a folder called ViewModel. Any child components that won't be used elsewhere will reside in a folder named ``Subcomponents``, which is within the parent Controller. Since there might be components used in multiple places, I created a folder called ``Fragments`` to contain such components.

Regarding routing, I realized that not all pages may share the same design, such as the 404 page. Hence, I concluded that I should create a router page to handle anything different. Consequently, I created two router pages. The first router is in app.component.html and will only contain the <router-outlet/> HTML tag. The second router is the MainComponent, which will hold the router, the navbar, and a footer. This approach provides flexibility in webpage designs.

There is Core fold will have a folders to hold Models, Services, and possible Controllers for handling business logic. Each of these will be in their respected folders./ I seen a core file was used offen in design patterns when researching them

#### Tree Structure Example
```
Src/app/
├── Core/
│   ├── Models/
│   │   └── TodoItem.ts
│   ├── Services/
│   │   └── TodoItem.Service.ts
│   └── Controllers/
│       ├── HomeController
│       └── etc..
└── ViewModels/
    ├── Fragements/
    │   ├── navbar/
    │   ├── footer/
    │   └── alert/
    ├── home/
    │   ├── components/
    │   │   ├── Table/
    │   │   ├── Slideshow/        
    │   │   └── Toolbar/
    │   ├── Home.component.html
    │   ├── Home.component.css
    │   └── Home.component.ts   
    ├── main
    └── about
```

This was created with this [Tree Structure Diagram Creation tool](https://tree.nathanfriend.io/)
